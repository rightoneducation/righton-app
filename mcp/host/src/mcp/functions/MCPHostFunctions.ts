import { OpenAI } from "openai";
import { ChatCompletionMessageParam, type ChatCompletionCreateParams } from "openai/resources/chat/completions.mjs";
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { MCPClientClass } from '../client/MCPClientClass.js';
import { writeMCPResultToTable } from '../../utils/writeToTable.js';

const mcpClients = new Map<string, MCPClientClass>();
const COMPLETIONS_MODEL = 'gpt-4o-mini';
const FINAL_REASONING_MODEL = 'gpt-4o-mini';
const MAX_MESSAGE_LENGTH = 4000;

// lazy initialize openai client (so that it doesn't try to connect to the API until secrets are loaded)
let openai: OpenAI;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
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
    if (label !== 'processQuery.start' && label !== 'Process complete') {
      return;
    }
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

function truncateMessageContent(content: ChatCompletionMessageParam['content']): string {
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

  if (content === null || content === undefined) {
    return '';
  }

  const serialized = JSON.stringify(content);
  if (serialized.length <= MAX_MESSAGE_LENGTH) {
    return serialized;
  }
  return `${serialized.slice(0, MAX_MESSAGE_LENGTH)}... [truncated ${serialized.length - MAX_MESSAGE_LENGTH} chars]`;
}

function calculateTotalChars(messages: ChatCompletionMessageParam[]) {
  return messages.reduce((sum, message) => {
    if (typeof message.content === 'string') {
      return sum + message.content.length;
    }
    if (Array.isArray(message.content)) {
      const serialized = message.content.map((item) => JSON.stringify(item)).join('');
      return sum + serialized.length;
    }
    return sum + JSON.stringify(message.content ?? '').length;
  }, 0);
}

function getContentPreview(content: ChatCompletionMessageParam['content']) {
  let serialized = '';
  if (typeof content === 'string') {
    serialized = content;
  } else if (Array.isArray(content)) {
    serialized = content.map((item) => JSON.stringify(item)).join('');
  } else if (content === null || content === undefined) {
    serialized = '';
  } else {
    serialized = JSON.stringify(content);
  }
  return serialized;
}

function formatToolCallsForLog(toolCalls: Array<{ id?: string; function?: { name?: string; arguments?: string } }> | undefined) {
  if (!toolCalls) {
    return [];
  }

  return toolCalls.map((call) => {
    return {
      id: call.id,
      functionName: call.function?.name,
      arguments: call.function?.arguments,
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

const THINKING_INSTRUCTION: ChatCompletionMessageParam = {
  role: 'system',
  content: [
    {
      type: 'text',
      text: [
        'You are an expert classroom analyst.',
        'Always explain your reasoning in plain English before choosing or justifying a tool call.',
        'If you request a tool, describe why you need it and what you expect to learn.',
        'Before finalizing any analysis of class struggles, you MUST call `getLearningScienceDatabyCCSS` for every CCSS you reference so your reasoning is grounded in that data. Cite the learning science output (with quotes) when explaining trends.',
        'When identifying emblematic students, consult `getStudentHistory` for those students (or comparable representatives) before describing their performance so your claims reflect actual history.',
        'Only reference student names and IDs that actually appear in the fetched game session data; reuse the `globalStudentId` from `teams.items` when calling `getStudentHistory`.',
        'Do not repeat the same tool call with identical arguments if you already have that data—reuse earlier results.',
      ].join('\n'),
    },
  ],
};

const EXAMPLE_USER_MESSAGE: ChatCompletionMessageParam = {
  role: 'user',
  content: 'Example: Give me a quick read on classroom 999 before we start.',
};

const EXAMPLE_ASSISTANT_MESSAGE: ChatCompletionMessageParam = {
  role: 'assistant',
  content: 'To ground my analysis, I will first fetch the most recent sessions for classroom 999 so I know what activity to reason about.',
  tool_calls: [
    {
      id: 'example_call_1',
      type: 'function',
      function: {
        name: 'getGameSessionsByClassroomId',
        arguments: JSON.stringify({ classroomId: '999' }),
      },
    },
  ],
};

const EXAMPLE_TOOL_MESSAGE: ChatCompletionMessageParam = {
  role: 'tool',
  tool_call_id: 'example_call_1',
  content: '[example tool output omitted]',
};

const STRUCTURED_INSTRUCTION: ChatCompletionMessageParam = {
  role: 'system',
  content: [
    {
      type: 'text',
      text: [
        'Convert ongoing summary data into structured output according to the schema defined in response_format. Perform no other reasoning on this data.',
      ].join('\n'),
    },
  ],
};

const DISCUSSION_QUESTION_REMINDER: ChatCompletionMessageParam = {
  role: 'system',
  content: [
    {
      type: 'text',
      text: [
        'When generating discussion questions:',
        '1. Tie each question to the actual trends the class is struggling with.',
        '2. Base the question on concrete examples from the reviewed game sessions and explicitly reference the scenario or numbers from that example (e.g., restate the question text or the fraction values involved) so students recognize the context.',
        '3. Do NOT mention CCSS codes; refer to the underlying ideas in plain language.',
        '4. Avoid generic directions—anchor each question in specific situations or mistakes observed in the data, quoting or paraphrasing the exact prompt rather than saying “problem 5” or “last session.”',
        '5. Do not ask the student to identify what confused them; instead, directly surface the specific misconception or error you observed so the question guides them through the tricky step.',
        '6. Frame each question around the specific misconception or error you observed in the example (describe what went wrong), but let the model decide how best to phrase the follow-up; avoid telling the student to identify their confusion.',
      ].join(' '),
    },
  ],
};

export async function processQuery (query: string){
  const parsedQuery = JSON.parse(query);
  const { query: prompt, isRightOnEnabled, isCZIEnabled } = parsedQuery;
  let responseId = uuidv4();
  const log = createStepLogger(responseId);
  log('processQuery.start');

  const availableTools = getAllTools();
  const toolMetadataMap = getToolMetadataMap(availableTools);
  const messages: ChatCompletionMessageParam[] = [
    THINKING_INSTRUCTION,
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
    log('Initial completion started', { totalChars: calculateTotalChars(messages) });
  const initialParams: ChatCompletionCreateParams = {
    model: COMPLETIONS_MODEL,
    messages,
    tools: filteredTools,
  };
  const initialStart = Date.now();
  let response = await getOpenAI().chat.completions.create(initialParams);
  log(`Initial completion finished`, {
    durationMs: Date.now() - initialStart,
    totalChars: calculateTotalChars(messages),
  });
  log('Initial completion assistant response', {
    assistantContent: getContentPreview(response.choices[0].message.content),
    toolCalls: formatToolCallsForLog(response.choices[0].message.tool_calls),
    rawMessage: response.choices[0].message,
  });

  const toolCalls: Array<{name: string, args: any}> = [];
  const MAX_ITERATIONS = 10;
  let iterationCount = 0;
  const toolResultCache = new Map<string, string>();
  const knownStudents = new Map<string, { name?: string; latestQuestion?: string; latestCCSS?: string }>();
  let rosterInstructionInjected = false;

  // loop that calls tools and then reasons based on the output of the tools
  // continues while reasoning loop determines that more tools are needed
  while ((response.choices[0].message.tool_calls?.length ?? 0) > 0 && iterationCount < MAX_ITERATIONS){
    const assistantMessageFull = response.choices[0].message;
    const toolCallsFromResponse = assistantMessageFull.tool_calls ?? [];
    iterationCount++;
    log(`Iteration ${iterationCount} started`, { totalChars: calculateTotalChars(messages) });
    messages.push({
      role: assistantMessageFull.role,
      content: assistantMessageFull.content ?? '',
      tool_calls: toolCallsFromResponse,
    } as ChatCompletionMessageParam);
    log(`Iteration ${iterationCount} assistant message added`, {
      totalChars: calculateTotalChars(messages),
    });

    const summaryMessages: ChatCompletionMessageParam[] = [];
    for (const call of toolCallsFromResponse){
      if (call.type !== 'function') continue;

      const toolName = call.function.name;
      const toolArgs = JSON.parse(call.function.arguments || "{}");
      const cacheKey = `${toolName}:${JSON.stringify(toolArgs)}`;
      const cachedContent = toolResultCache.get(cacheKey);
      if (cachedContent) {
        log(`Tool ${toolName} skipped (duplicate arguments)`, {
          iteration: iterationCount,
          totalChars: calculateTotalChars(messages),
        });
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: cachedContent,
        });
        continue;
      }
      if (toolName === 'getStudentHistory') {
        const requestedId = toolArgs?.globalStudentId;
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
          messages.push({
            role: 'tool',
            tool_call_id: call.id,
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
          messages.push({
            role: 'system',
            content: knownStudents.size > 0
              ? `Invalid student id "${requestedId}". Choose from the latest roster: ${availableList.map((s) => `${s.name ?? '(unnamed)'} (${s.id})`).join(', ')}.`
              : 'No student roster available yet. Fetch classroom sessions with team data before requesting student history.',
          });
          continue;
        }
      }

      const client = findClientForTool(toolName);
      if (!client) {
        throw new Error(`No MCP server found for tool: ${toolName}`);
      }
      log(`Tool ${toolName} started`, {
        iteration: iterationCount,
        totalChars: calculateTotalChars(messages),
      });
      const callStart = Date.now();
      const result = await client.callTool(toolName, toolArgs);
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
      messages.push({
        role: 'tool',
        tool_call_id: call.id,
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
            messages.push({
              role: 'system',
              content: [
                'Use actual students from the latest roster when citing performance or calling `getStudentHistory`.',
                'Roster preview:',
                rosterPreview || '(no names available)',
              ].join('\n'),
            });
          }
        }
      }
      log(`Tool ${toolName} message added`, {
        iteration: iterationCount,
        totalChars: calculateTotalChars(messages),
      });
    }
    if (summaryMessages.length > 0) {
      messages.push(...summaryMessages);
    }

    log(`Iteration ${iterationCount} follow-up started`, { totalChars: calculateTotalChars(messages) });
    const followUpParams: ChatCompletionCreateParams = {
      model: COMPLETIONS_MODEL,
      messages,
    };
    if (filteredTools.length > 0) {
      followUpParams.tools = filteredTools;
    }
    const followUpStart = Date.now();
    response = await getOpenAI().chat.completions.create(followUpParams);
    log(`Iteration ${iterationCount} follow-up finished`, {
      durationMs: Date.now() - followUpStart,
      totalChars: calculateTotalChars(messages),
    });
    log(`Iteration ${iterationCount} follow-up assistant response`, {
      assistantContent: getContentPreview(response.choices[0].message.content),
      toolCalls: formatToolCallsForLog(response.choices[0].message.tool_calls),
      rawMessage: response.choices[0].message,
    });

    if (!response.choices[0].message.tool_calls || response.choices[0].message.tool_calls.length === 0) {
      break;
    }
  }
  
  // Log if we hit the max iteration limit
  if (iterationCount >= MAX_ITERATIONS && (response.choices[0].message.tool_calls?.length ?? 0) > 0) {
    console.warn('[MCPHost]', new Date().toISOString(), 'Hit maximum iteration limit', { iterationCount });
  }

  try {
    log('Structured completion started', { totalChars: calculateTotalChars(messages) });
    // After tool loop, one final call to get structured output
    const structuredStart = Date.now();
    const structuredResponse = await getOpenAI().chat.completions.create({
      model: FINAL_REASONING_MODEL,
      messages: [
        STRUCTURED_INSTRUCTION,
        DISCUSSION_QUESTION_REMINDER,
        ...messages,
      ],
      response_format: zodResponseFormat(ClassroomAnalysisSchema, 'classroomAnalysis')
    });
    log('Structured completion finished', {
      durationMs: Date.now() - structuredStart,
      totalChars: calculateTotalChars(messages),
    });

    const content = JSON.parse(structuredResponse.choices[0].message.content || '{}');
    const structuredData = ClassroomAnalysisSchema.parse(content);

    log('Writing result', { totalChars: calculateTotalChars(messages) });
    // Write successful result to DynamoDB via AppSync
    await writeMCPResultToTable({
      id: responseId,
      status: 'complete',
      learningOutcomes: structuredData.learningOutcomes,
      students: structuredData.students,
      discussionQuestions: structuredData.discussionQuestions,
      toolCalls: toolCalls
    });
    log('Write complete');
    
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