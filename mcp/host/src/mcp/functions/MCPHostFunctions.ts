import Anthropic from '@anthropic-ai/sdk';
import { MessageParam, Message, Tool } from '@anthropic-ai/sdk/resources';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { MCPClientClass } from '../client/MCPClientClass.js';
import { writeMCPResultToTable } from '../../utils/writeToTable.js';

const mcpClients = new Map<string, MCPClientClass>();
const COMPLETIONS_MODEL = 'claude-haiku-4-5';
const FINAL_REASONING_MODEL = 'claude-haiku-4-5';
const MAX_MESSAGE_LENGTH = 4000;

// lazy initialize anthropic client (so that it doesn't try to connect to the API until secrets are loaded)
let anthropic: Anthropic;

function getAnthropic() {
  if (!anthropic) {
    anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
  }
  return anthropic;
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) {
    return String(value);
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return '[unserializable]';
  }
}

function createStepLogger(responseId?: string) {
  const start = Date.now();
  return (label: string, extra?: Record<string, unknown>) => {
    // Removed filter - now logs all events for table tracking
    const elapsed = Date.now() - start;
    const timestamp = new Date().toISOString();
    const payload: Record<string, unknown> = { elapsedMs: elapsed };
    if (responseId) {
      payload.responseId = responseId;
    }
    if (extra) {
      Object.assign(payload, extra);
    }
    console.log(`[MCPHost] ${timestamp} ${label}`);
    console.log(`[MCPHost] ${timestamp} details:\n${JSON.stringify(payload, null, 2)}`);
  };
}

function truncateMessageContent(content: MessageParam['content']): string {
  if (typeof content === 'string') {
    if (content.length <= MAX_MESSAGE_LENGTH) {
      return content;
    }
    return `${content.slice(0, MAX_MESSAGE_LENGTH)}... [truncated ${content.length - MAX_MESSAGE_LENGTH} chars]`;
  }

  if (Array.isArray(content)) {
    const serialized = JSON.stringify(content);
    if (serialized.length <= MAX_MESSAGE_LENGTH) {
      return serialized;
    }
    return `${serialized.slice(0, MAX_MESSAGE_LENGTH)}... [truncated ${serialized.length - MAX_MESSAGE_LENGTH} chars]`;
  }

  return '';
}

function calculateTotalChars(messages: MessageParam[]) {
  return messages.reduce((sum, message) => {
    if (typeof message.content === 'string') {
      return sum + message.content.length;
    }
    if (Array.isArray(message.content)) {
      const serialized = message.content.map((item) => {
        if (typeof item === 'string' || (item && typeof item === 'object' && 'type' in item)) {
          return JSON.stringify(item);
        }
        return '';
      }).join('');
      return sum + serialized.length;
    }
    return sum;
  }, 0);
}

function getContentPreview(content: MessageParam['content']) {
  let serialized = '';
  if (typeof content === 'string') {
    serialized = content;
  } else if (Array.isArray(content)) {
    serialized = content.map((item) => JSON.stringify(item)).join('');
  } else {
    serialized = '';
  }
  return serialized;
}

function formatToolCallsForLog(toolUses: Array<{ id: string; name: string; input: Record<string, unknown> }> | undefined) {
  if (!toolUses) {
    return [];
  }

  return toolUses.map((call) => {
    return {
      id: call.id,
      functionName: call.name,
      arguments: JSON.stringify(call.input),
    };
  });
}

function safeJSONParse<T>(value: string | null | undefined): T | undefined {
  if (!value) {
    return undefined;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

export async function initMCPClient(servers: Array<{name: string, version: string, url: string}>) {
  const log = createStepLogger();
  log('initMCPClient.start', { serverCount: servers.length });
  for (const {name, url} of servers){
    try {
      const client = new MCPClientClass(url);
      await client.connect();
      mcpClients.set(name, client);
    } catch (error) {
      // Connection failed
      console.warn('[MCPHost]', new Date().toISOString(), 'initMCPClient.connectionFailed', { server: name, url, error });
    }
  }
  log('initMCPClient.complete', { connectedServers: mcpClients.size });
}

export function getAllTools() {
  const allTools: any[] = [];
  for (const [serName, client] of mcpClients.entries()) {
    const tools = client.getTools();
    for (const tool of tools){
      allTools.push({
        ...tool, 
        _server: serName
      });
    }
  }
  return allTools;
}

function findClientForTool(toolName: string): MCPClientClass | undefined {
  for (const client of mcpClients.values()) {
    const tools = client.getTools();
    if (tools.some(t=> t.function?.name === toolName)){
      return client;
    }
  }
  return undefined;
}

function getToolMetadataMap(tools: any[]) {
  const metadata = new Map<string, { category?: string }>();
  for (const tool of tools) {
    const name = tool?.function?.name;
    if (!name) continue;
    const category =
      tool.metadata?.category ??
      tool.metadata?.tags?.[0] ??
      tool.annotations?.category ??
      tool.annotations?.tags?.[0] ??
      tool._meta?.category ??
      tool._meta?.tags?.[0];
    metadata.set(name, { category });
  }
  return metadata;
}

function summarizeToolResult(toolName: string, args: Record<string, unknown>, result: any) {
  const summary: Record<string, unknown> = {
    toolName,
    args,
  };
  try {
    if (toolName === 'getGameSessionsByClassroomId' && Array.isArray(result?.content)) {
      const text = result.content[0]?.text;
      if (text) {
        const items = JSON.parse(text);
        summary.itemCount = Array.isArray(items) ? items.length : 0;
        summary.firstTitle = Array.isArray(items) && items[0]?.title ? items[0].title : undefined;
        if (Array.isArray(items) && items.length > 0) {
          const questionSession = items[0];
          const rosterSession = items.find((session: any) => session?.teams?.items?.length) ?? questionSession;
          const questions = questionSession?.questions?.items ?? [];
          const questionCodes = questions.map((q: any) => {
            if (!q?.grade || !q?.domain || !q?.cluster || !q?.standard) {
              return undefined;
            }
            return `${q.grade}.${q.domain}.${q.cluster}.${q.standard}`;
          });
          summary.uniqueCCSS = Array.from(new Set(questionCodes.filter(Boolean)));
          summary.firstSessionQuestions = questions.slice(0, 5).map((q: any) => ({
            text: q?.text,
            choices: q?.choices,
            grade: q?.grade,
            domain: q?.domain,
            cluster: q?.cluster,
            standard: q?.standard,
          }));
          summary.teamSourceSessionId = rosterSession?.id;
          const teams = rosterSession?.teams?.items ?? [];
          summary.firstSessionTeams = teams.slice(0, 10).map((team: any) => ({
            name: team?.name,
            globalStudentId: team?.globalStudentId,
            score: team?.score,
            questionText: team?.question?.text,
            questionCCSS: team?.question?.ccssCode ??
              (team?.question?.grade && team?.question?.domain
                ? `${team.question.grade}.${team.question.domain}.${team.question.cluster ?? ''}.${team.question.standard ?? ''}`.replace(/\.+$/, '')
                : undefined),
          }));
          const sessionIds = [questionSession?.id].filter(Boolean);
        }
      }
    }
    if (toolName === 'getLearningScienceDatabyCCSS' && Array.isArray(result?.content)) {
      const text = result.content[0]?.text;
      if (text && !text.startsWith('No learning science data')) {
        const items = JSON.parse(text);
        summary.itemCount = Array.isArray(items) ? items.length : 0;
        summary.firstCode = Array.isArray(items) && items[0]?.statementCode ? items[0].statementCode : undefined;
      } else {
        summary.itemCount = 0;
      }
    }
    if (toolName === 'getStudentHistory' && Array.isArray(result?.content)) {
      const text = result.content[0]?.text;
      try {
        const parsed = text ? JSON.parse(text) : undefined;
        const connection = parsed?.data?.teamByGlobalStudentId;
        const firstTeam = connection?.items?.[0];
        if (firstTeam) {
          summary.student = {
            name: firstTeam.name,
            globalStudentId: firstTeam.globalStudentId,
            recentScore: firstTeam.score,
            latestQuestion: firstTeam.question?.text,
            latestCCSS: firstTeam.question?.ccssCode,
          };
          if (connection?.items?.length) {
            summary.recentAppearances = connection.items.slice(0, 5).map((item: any) => ({
              questionText: item?.question?.text,
              questionCCSS: item?.question?.ccssCode,
              score: item?.score,
              teamId: item?.id,
            }));
          }
        } else {
          summary.details = 'Student history retrieved (no records for this ID)';
        }
      } catch {
        summary.details = 'Student history retrieved (parse failed)';
      }
    }
  } catch {
    summary.details = 'Summary parsing failed';
  }
  return summary;
}

const ClassroomAnalysisSchema = z.object({
  learningOutcomes: z.string().describe("Analysis of the most recent game and identification of areas where students are struggling, with evidence from previous games and learning science data"),
  students: z.array(
    z.object({
      name: z.string().describe("Student's full name"),
      performance: z.enum(["excelling", "struggling"]).describe("Whether the student is performing well or struggling"),
      justification: z.string().describe("Justification for choosing this student")
    })
  ).describe("Two students that are emblematic of the classroom"),
  discussionQuestions: z.array(
    z.object({
      studentName: z.string().describe("Student's full name"),
      question: z.string().describe("The discussion question for this student")
    })
  ).describe("Discussion questions for each of the two students")
});

const SYSTEM_PROMPT = [
  'You are an expert classroom analyst.',
  'Always explain your reasoning in plain English before choosing or justifying a tool call.',
  'If you request a tool, describe why you need it and what you expect to learn.',
  'Before finalizing any analysis of class struggles, you MUST call `getLearningScienceDatabyCCSS` for every CCSS you reference so your reasoning is grounded in that data. Cite the learning science output (with quotes) when explaining trends.',
  'When identifying emblematic students, consult `getStudentHistory` for those students (or comparable representatives) before describing their performance so your claims reflect actual history.',
  'Only reference student names and IDs that actually appear in the fetched game session data; reuse the `globalStudentId` from `teams.items` when calling `getStudentHistory`.',
  'Do not repeat the same tool call with identical arguments if you already have that data—reuse earlier results.',
].join('\n');

const EXAMPLE_USER_MESSAGE: MessageParam = {
  role: 'user',
  content: 'Example: Give me a quick read on classroom 999 before we start.',
};

const EXAMPLE_ASSISTANT_MESSAGE: MessageParam = {
  role: 'assistant',
  content: [
    {
      type: 'text',
      text: 'To ground my analysis, I will first fetch the most recent sessions for classroom 999 so I know what activity to reason about.',
    },
    {
      type: 'tool_use',
      id: 'example_call_1',
      name: 'getGameSessionsByClassroomId',
      input: { classroomId: '999' },
    },
  ],
};

const EXAMPLE_TOOL_MESSAGE: MessageParam = {
  role: 'user',
  content: [
    {
      type: 'tool_result',
      tool_use_id: 'example_call_1',
      content: '[example tool output omitted]',
    },
  ],
};

// JSON Schema for Claude's structured outputs
const CLASSROOM_ANALYSIS_JSON_SCHEMA = {
  type: 'object',
  properties: {
    learningOutcomes: {
      type: 'string'
    },
    students: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          performance: {
            type: 'string',
            enum: ['excelling', 'struggling']
          },
          justification: {
            type: 'string'
          }
        },
        required: ['name', 'performance', 'justification'],
        additionalProperties: false
      }
    },
    discussionQuestions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          studentName: {
            type: 'string'
          },
          question: {
            type: 'string'
          }
        },
        required: ['studentName', 'question'],
        additionalProperties: false
      }
    }
  },
  required: ['learningOutcomes', 'students', 'discussionQuestions'],
  additionalProperties: false
};

const DISCUSSION_QUESTION_REMINDER = [
  'When generating discussion questions:',
  '1. Tie each question to the actual trends the class is struggling with.',
  '2. Base the question on concrete examples from the reviewed game sessions and explicitly reference the scenario or numbers from that example (e.g., restate the question text or the fraction values involved) so students recognize the context.',
  '3. Do NOT mention CCSS codes; refer to the underlying ideas in plain language.',
  '4. Avoid generic directions—anchor each question in specific situations or mistakes observed in the data, quoting or paraphrasing the exact prompt rather than saying "problem 5" or "last session."',
  '5. Do not ask the student to identify what confused them; instead, directly surface the specific misconception or error you observed so the question guides them through the tricky step.',
  '6. Frame each question around the specific misconception or error you observed in the example (describe what went wrong), but let the model decide how best to phrase the follow-up; avoid telling the student to identify their confusion.',
].join(' ');

function convertToolsToClaudeFormat(tools: any[]): Tool[] {
  return tools.map(tool => ({
    name: tool.function?.name || '',
    description: tool.function?.description || '',
    input_schema: tool.function?.parameters || {},
  }));
}

export async function processQuery (query: string){
  const parsedQuery = JSON.parse(query);
  const { query: prompt, isRightOnEnabled, isCZIEnabled } = parsedQuery;
  let responseId = uuidv4();
  const log = createStepLogger(responseId);
  // TABLE: event_type='processQuery.start', iteration=0, elapsed_ms=0, duration_ms=null, tool_name=null, prompt_length=null
  log('processQuery.start');

  const availableTools = getAllTools();
  // TABLE: event_type='processQuery.availableToolsLoaded', iteration=0, elapsed_ms=<current>, duration_ms=null, tool_name=null, prompt_length=null
  log('processQuery.availableToolsLoaded');
  const toolMetadataMap = getToolMetadataMap(availableTools);
  const messages: MessageParam[] = [
    EXAMPLE_USER_MESSAGE,
    EXAMPLE_ASSISTANT_MESSAGE,
    EXAMPLE_TOOL_MESSAGE,
    { role: 'user', content: prompt }
  ];
  
  // filter available tools based on the enabled flags
  const filteredTools = availableTools.filter(tool => {
    if (isRightOnEnabled && tool._server === 'custom') {
      return true;
    }
    if (isCZIEnabled && tool._server === 'ext') {
      return true;
    }
    return false;
  });
  // TABLE: event_type='processQuery.toolsFiltered', iteration=0, elapsed_ms=<current>, duration_ms=null, tool_name=null, prompt_length=null
  log('processQuery.toolsFiltered');
  
  const claudeTools = convertToolsToClaudeFormat(filteredTools);
  
  // TABLE: event_type='processQuery.initialCompletion.start', iteration=0, elapsed_ms=<current>, duration_ms=null, tool_name=null, prompt_length=<totalChars>
  log('Initial completion started', { totalChars: calculateTotalChars(messages) });
  const initialStart = Date.now();
  let response = await getAnthropic().messages.create({
    model: COMPLETIONS_MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages,
    tools: claudeTools.length > 0 ? claudeTools : undefined,
  });
  // TABLE: event_type='processQuery.initialCompletion.complete', iteration=0, elapsed_ms=<current>, duration_ms=<durationMs>, tool_name=null, prompt_length=<totalChars>
  log(`Initial completion finished`, {
    durationMs: Date.now() - initialStart,
    totalChars: calculateTotalChars(messages),
  });
  log('Initial completion assistant response', {
    assistantContent: getContentPreview(response.content),
    toolCalls: formatToolCallsForLog(
      response.content.filter((item): item is { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> } => 
        item.type === 'tool_use'
      ) as any
    ),
    rawMessage: response,
  });

  const toolCalls: Array<{name: string, args: any}> = [];
  const MAX_ITERATIONS = 10;
  let iterationCount = 0;
  const toolResultCache = new Map<string, string>();
  const knownStudents = new Map<string, { name?: string; latestQuestion?: string; latestCCSS?: string }>();
  let rosterInstructionInjected = false;
  let systemMessages: string[] = [];

  // loop that calls tools and then reasons based on the output of the tools
  // continues while reasoning loop determines that more tools are needed
  let toolUses = response.content.filter((item): item is { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> } => 
    item.type === 'tool_use'
  );
  
  while (toolUses.length > 0 && iterationCount < MAX_ITERATIONS){
    iterationCount++;
    // TABLE: event_type='processQuery.iteration.start', iteration=<iterationCount>, elapsed_ms=<current>, duration_ms=null, tool_name=null, prompt_length=<totalChars>
    log(`Iteration ${iterationCount} started`, { totalChars: calculateTotalChars(messages) });
    
    // Add assistant message with tool uses
    messages.push({
      role: 'assistant',
      content: response.content,
    });
    log(`Iteration ${iterationCount} assistant message added`, {
      totalChars: calculateTotalChars(messages),
    });

    const toolResults: Array<{ type: 'tool_result'; tool_use_id: string; content: string }> = [];
    const summaryMessages: MessageParam[] = [];
    
    for (const call of toolUses){
      const toolName = call.name;
      const toolArgs = call.input;
      const cacheKey = `${toolName}:${JSON.stringify(toolArgs)}`;
      const cachedContent = toolResultCache.get(cacheKey);
      
      if (cachedContent) {
        log(`Tool ${toolName} skipped (duplicate arguments)`, {
          iteration: iterationCount,
          totalChars: calculateTotalChars(messages),
        });
        toolResults.push({
          type: 'tool_result',
          tool_use_id: call.id,
          content: cachedContent,
        });
        continue;
      }
      
      if (toolName === 'getStudentHistory') {
        const requestedId = toolArgs?.globalStudentId as string;
        if (!requestedId || (knownStudents.size > 0 && !knownStudents.has(requestedId))) {
          const availableList = Array.from(knownStudents.entries()).map(([id, info]) => ({
            id,
            name: info.name,
            question: info.latestQuestion,
          }));
          const syntheticContent = JSON.stringify({
            error: 'unknown_student_id',
            providedId: requestedId ?? null,
            availableStudents: availableList,
          });
          toolCalls.push({ name: toolName, args: toolArgs });
          toolResults.push({
            type: 'tool_result',
            tool_use_id: call.id,
            content: syntheticContent,
          });
          summaryMessages.push({
            role: 'assistant',
            content: `Summary: ${JSON.stringify({
              toolName,
              args: toolArgs,
              error: 'Student ID not found in latest roster',
              availableStudents: availableList,
            })}`,
          });
          systemMessages.push(
            knownStudents.size > 0
              ? `Invalid student id "${requestedId}". Choose from the latest roster: ${availableList.map((s) => `${s.name ?? '(unnamed)'} (${s.id})`).join(', ')}.`
              : 'No student roster available yet. Fetch classroom sessions with team data before requesting student history.'
          );
          continue;
        }
      }

      const client = findClientForTool(toolName);
      if (!client) {
        throw new Error(`No MCP server found for tool: ${toolName}`);
      }
      // TABLE: event_type='processQuery.toolCall.start', iteration=<iterationCount>, elapsed_ms=<current>, duration_ms=null, tool_name=<toolName>, prompt_length=<totalChars>
      log(`Tool ${toolName} started`, {
        iteration: iterationCount,
        totalChars: calculateTotalChars(messages),
      });
      const callStart = Date.now();
      const result = await client.callTool(toolName, toolArgs);
      // TABLE: event_type='processQuery.toolCall.complete', iteration=<iterationCount>, elapsed_ms=<current>, duration_ms=<durationMs>, tool_name=<toolName>, prompt_length=<totalChars>
      log(`Tool ${toolName} finished`, {
        iteration: iterationCount,
        durationMs: Date.now() - callStart,
        totalChars: calculateTotalChars(messages),
      });
      const toolContent = JSON.stringify(result.content);
      const truncatedToolContent = toolContent.length > 1000
        ? `${toolContent.slice(0, 1000)}... [truncated ${toolContent.length - 1000} chars]`
        : toolContent;

      toolCalls.push({ name: toolName, args: toolArgs });
      toolResultCache.set(cacheKey, truncatedToolContent);
      toolResults.push({
        type: 'tool_result',
        tool_use_id: call.id,
        content: truncatedToolContent,
      });
      const toolSummary = summarizeToolResult(toolName, toolArgs, result);
      summaryMessages.push({
        role: 'assistant',
        content: `Summary: ${JSON.stringify(toolSummary)}`,
      });
      if (toolName === 'getGameSessionsByClassroomId') {
        const teams = (toolSummary as any)?.firstSessionTeams;
        if (Array.isArray(teams)) {
          for (const team of teams) {
            if (!team?.globalStudentId) continue;
            knownStudents.set(team.globalStudentId, {
              name: team.name,
              latestQuestion: team.questionText,
              latestCCSS: team.questionCCSS,
            });
          }
          if (!rosterInstructionInjected && knownStudents.size > 0) {
            rosterInstructionInjected = true;
            const rosterPreview = Array.from(knownStudents.entries())
              .slice(0, 12)
              .map(([id, info]) => `${info.name ?? '(unnamed)'} — ${id}`)
              .join('\n');
            systemMessages.push(
              [
                'Use actual students from the latest roster when citing performance or calling `getStudentHistory`.',
                'Roster preview:',
                rosterPreview || '(no names available)',
              ].join('\n')
            );
          }
        }
      }
      log(`Tool ${toolName} message added`, {
        iteration: iterationCount,
        totalChars: calculateTotalChars(messages),
      });
    }
    
    // Add tool results as user message
    if (toolResults.length > 0) {
      messages.push({
        role: 'user',
        content: toolResults,
      });
    }
    
    if (summaryMessages.length > 0) {
      messages.push(...summaryMessages);
    }

    // TABLE: event_type='processQuery.followUpCompletion.start', iteration=<iterationCount>, elapsed_ms=<current>, duration_ms=null, tool_name=null, prompt_length=<totalChars>
    log(`Iteration ${iterationCount} follow-up started`, { totalChars: calculateTotalChars(messages) });
    const followUpStart = Date.now();
    const updatedSystemPrompt = systemMessages.length > 0 
      ? [SYSTEM_PROMPT, ...systemMessages].join('\n\n')
      : SYSTEM_PROMPT;
    
    response = await getAnthropic().messages.create({
      model: COMPLETIONS_MODEL,
      max_tokens: 4096,
      system: updatedSystemPrompt,
      messages,
      tools: claudeTools.length > 0 ? claudeTools : undefined,
    });
    // TABLE: event_type='processQuery.followUpCompletion.complete', iteration=<iterationCount>, elapsed_ms=<current>, duration_ms=<durationMs>, tool_name=null, prompt_length=<totalChars>
    log(`Iteration ${iterationCount} follow-up finished`, {
      durationMs: Date.now() - followUpStart,
      totalChars: calculateTotalChars(messages),
    });
    
    const newToolUses = response.content.filter((item): item is { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> } => 
      item.type === 'tool_use'
    );
    
    log(`Iteration ${iterationCount} follow-up assistant response`, {
      assistantContent: getContentPreview(response.content),
      toolCalls: formatToolCallsForLog(newToolUses as any),
      rawMessage: response,
    });

    if (newToolUses.length === 0) {
      break;
    }
    
    // Update toolUses for next iteration
    toolUses = newToolUses;
  }
  
  // Log if we hit the max iteration limit
  const finalToolUses = response.content.filter((item): item is { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> } => 
    item.type === 'tool_use'
  );
  if (iterationCount >= MAX_ITERATIONS && finalToolUses.length > 0) {
    console.warn('[MCPHost]', new Date().toISOString(), 'Hit maximum iteration limit', { iterationCount });
  }

  try {
    // TABLE: event_type='processQuery.structuredResponse.start', iteration=0, elapsed_ms=<current>, duration_ms=null, tool_name=null, prompt_length=<totalChars>
    log('Structured completion started', { totalChars: calculateTotalChars(messages) });
    // After tool loop, one final call to get structured output using Claude's structured outputs
    const structuredStart = Date.now();
    const finalSystemPrompt = [
      SYSTEM_PROMPT,
      DISCUSSION_QUESTION_REMINDER,
      ...systemMessages,
    ].join('\n\n');
    
    // Use beta API for structured outputs
    const structuredResponse = await (getAnthropic() as any).beta.messages.create({
      model: FINAL_REASONING_MODEL,
      max_tokens: 2048, // Reduced from 4096 - structured JSON output is more concise
      system: finalSystemPrompt,
      betas: ['structured-outputs-2025-11-13'],
      messages: [
        ...messages,
        {
          role: 'user',
          content: 'Now output the final structured analysis.',
        },
      ],
      output_format: {
        type: 'json_schema',
        schema: CLASSROOM_ANALYSIS_JSON_SCHEMA,
      },
    });
    // TABLE: event_type='processQuery.structuredResponse.complete', iteration=0, elapsed_ms=<current>, duration_ms=<durationMs>, tool_name=null, prompt_length=<totalChars>
    log('Structured completion finished', {
      durationMs: Date.now() - structuredStart,
      totalChars: calculateTotalChars(messages),
    });

    // Extract text content from Claude's structured output response
    // With structured outputs, response.content[0].text contains valid JSON
    const textContent = structuredResponse.content
      .filter((item: any) => item.type === 'text')
      .map((item: any) => {
        if (item.type === 'text') {
          return item.text;
        }
        return '';
      })
      .join('');
    
    // Parse the JSON response (should always be valid with structured outputs)
    const content = JSON.parse(textContent);
    
    // Validate against Zod schema (structured outputs guarantee schema compliance, but we validate for type safety)
    const structuredData = ClassroomAnalysisSchema.parse(content);

    // TABLE: event_type='processQuery.writeResult.start', iteration=0, elapsed_ms=<current>, duration_ms=null, tool_name=null, prompt_length=<totalChars>
    log('Writing result', { totalChars: calculateTotalChars(messages) });
    const writeStart = Date.now();
    // Write successful result to DynamoDB via AppSync
    await writeMCPResultToTable({
      id: responseId,
      status: 'complete',
      learningOutcomes: structuredData.learningOutcomes,
      students: structuredData.students,
      discussionQuestions: structuredData.discussionQuestions,
      toolCalls: toolCalls
    });
    // TABLE: event_type='processQuery.writeResult.complete', iteration=0, elapsed_ms=<current>, duration_ms=<Date.now() - writeStart>, tool_name=null, prompt_length=null
    log('Write complete', { durationMs: Date.now() - writeStart });
    
    // TABLE: event_type='Process complete', iteration=0, elapsed_ms=<current>, duration_ms=null, tool_name=null, prompt_length=null
    log('Process complete');
    return 'Success';
  } catch (error) {
    log('Process failed', {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    // Write error to DynamoDB
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    await writeMCPResultToTable({
      id: responseId,
      status: 'error',
      error: errorMessage
    });
    
    throw error;
  }
}

export async function disconnectMCP(){
  for (const client of mcpClients.values()){
    await client.disconnect();
  }
  mcpClients.clear();
}