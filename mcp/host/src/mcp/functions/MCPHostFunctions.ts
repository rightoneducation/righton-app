import { OpenAI } from "openai";
import { ChatCompletionMessageParam, type ChatCompletionCreateParams } from "openai/resources/chat/completions.mjs";
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { MCPClientClass } from '../client/MCPClientClass.js';
import { writeMCPResultToTable } from '../../utils/writeToTable.js';

const mcpClients = new Map<string, MCPClientClass>();
const COMPLETIONS_MODEL = 'gpt-4o-mini';
const MAX_MESSAGE_LENGTH = 4000;

// lazy initialize openai client (so that it doesn't try to connect to the API until secrets are loaded)
let openai: OpenAI;

function getOpenAI() {
  if (!openai) {
    console.log('[MCPHost]', new Date().toISOString(), 'Initializing OpenAI client');
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

function createStepLogger(responseId?: string) {
  const start = Date.now();
  return (label: string, extra?: Record<string, unknown>) => {
    const payload = {
      ...(responseId ? { responseId } : {}),
      elapsedMs: Date.now() - start,
      ...extra,
    };
    console.log('[MCPHost]', new Date().toISOString(), label, payload);
  };
}

function logPromptLength(
  log: ReturnType<typeof createStepLogger>,
  label: string,
  messages: ChatCompletionMessageParam[],
  extra: Record<string, unknown> = {},
) {
  try {
    const promptLength = messages.reduce((sum, message) => {
      if (typeof message.content === 'string') {
        return sum + message.content.length;
      }
      if (Array.isArray(message.content)) {
        const serialized = message.content.map((item) => JSON.stringify(item)).join('');
        return sum + serialized.length;
      }
      return sum + JSON.stringify(message.content ?? '').length;
    }, 0);

    log(label, {
      promptLength,
      messageCount: messages.length,
      ...extra,
    });
  } catch (error) {
    log(`${label}.error`, {
      promptLengthError: error instanceof Error ? error.message : 'Unknown prompt length error',
      ...extra,
    });
  }
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

function truncateMessage(message: ChatCompletionMessageParam): ChatCompletionMessageParam {
  return {
    ...message,
    content: truncateMessageContent(message.content),
  };
}

export async function initMCPClient(servers: Array<{name: string, version: string, url: string}>) {
  const log = createStepLogger();
  log('initMCPClient.start', { serverCount: servers.length });
  for (const {name, url} of servers){
    try {
      const connectStart = Date.now();
      console.log('[MCPHost]', new Date().toISOString(), 'initMCPClient.connecting', { server: name, url });
      const client = new MCPClientClass(url);
      await client.connect();
      mcpClients.set(name, client);
      console.log('[MCPHost]', new Date().toISOString(), 'initMCPClient.connected', {
        server: name,
        url,
        elapsedMs: Date.now() - connectStart,
      });
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

export async function processQuery (query: string){
  const parsedQuery = JSON.parse(query);
  const { query: prompt, isRightOnEnabled, isCZIEnabled, responseId } = parsedQuery;
  const log = createStepLogger(responseId);
  log('processQuery.start');

  try {
    log('processQuery.modelPing.start', { model: COMPLETIONS_MODEL, maxCompletionTokens: 8 });
    const pingStart = Date.now();
    await getOpenAI().chat.completions.create({
      model: COMPLETIONS_MODEL,
      messages: [
        { role: 'user', content: 'ping' },
      ],
      max_completion_tokens: 8,
    });
    log('processQuery.modelPing.complete', { pingElapsedMs: Date.now() - pingStart });
  } catch (pingError) {
    log('processQuery.modelPing.error', {
      message: pingError instanceof Error ? pingError.message : 'Unknown ping error',
    });
  }

  const availableTools = getAllTools();
  log('processQuery.availableToolsLoaded', { availableTools: availableTools.length });
  
  const messages: ChatCompletionMessageParam[] = [
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
  log('processQuery.toolsFiltered', {
    filteredTools: filteredTools.length,
    isRightOnEnabled,
    isCZIEnabled,
  });
  logPromptLength(log, 'processQuery.promptLength.beforeInitial', messages);

  log('processQuery.initialCompletion.start');
  const initialParams: ChatCompletionCreateParams = {
    model: COMPLETIONS_MODEL,
    messages: messages,
    tools: filteredTools,
  };
  log('processQuery.initialCompletion.config', {
    includeTools: filteredTools.length > 0,
    availableTools: filteredTools.length,
  });
  let response = await getOpenAI().chat.completions.create(initialParams);
  log('processQuery.initialCompletion.complete');

  const toolCalls: Array<{name: string, args: any}> = [];
  const MAX_ITERATIONS = 10;
  let iterationCount = 0;

  while (response.choices[0].message.tool_calls && iterationCount < MAX_ITERATIONS){
    iterationCount++;
    log('processQuery.iteration.start', { iteration: iterationCount });
    const toolCallsFromResponse = response.choices[0].message.tool_calls ?? [];
    const assistantMessage = truncateMessage(response.choices[0].message);
    messages.push(assistantMessage);
    logPromptLength(log, 'processQuery.promptLength.afterToolMessage', messages, { iteration: iterationCount });

    for (const call of toolCallsFromResponse){
      if (call.type !== 'function') continue;

      const toolName = call.function.name;
      const toolArgs = JSON.parse(call.function.arguments || "{}");
      const client = findClientForTool(toolName);
      if (!client) {
        throw new Error(`No MCP server found for tool: ${toolName}`);
      }
      log('processQuery.toolCall.start', { iteration: iterationCount, toolName });
      const callStart = Date.now();
      const result = await client.callTool(toolName, toolArgs);
      log('processQuery.toolCall.complete', {
        iteration: iterationCount,
        toolName,
        elapsedMs: Date.now() - callStart,
      });
      
      const toolContent = JSON.stringify(result.content);
      const truncatedToolContent = truncateMessageContent(toolContent);
      
      toolCalls.push({ name: toolName, args: toolArgs });
      messages.push({
        role: 'tool',
        tool_call_id: call.id,
        content: truncatedToolContent,
      });
    }
    
    log('processQuery.followUpCompletion.start', { iteration: iterationCount });
    logPromptLength(log, 'processQuery.promptLength.beforeFollowUp', messages, { iteration: iterationCount });
    log('processQuery.followUpCompletion.config', {
      iteration: iterationCount,
      includeTools: filteredTools.length > 0,
      availableTools: filteredTools.length,
    });
    const followUpParams: ChatCompletionCreateParams = {
      model: COMPLETIONS_MODEL,
      messages: messages.map(truncateMessage),
    };
    if (filteredTools.length > 0) {
      followUpParams.tools = filteredTools;
    }
    response = await getOpenAI().chat.completions.create(followUpParams);
    log('processQuery.followUpCompletion.complete', { iteration: iterationCount });
  }
  
  // Log if we hit the max iteration limit
  if (iterationCount >= MAX_ITERATIONS && response.choices[0].message.tool_calls) {
    console.warn('[MCPHost]', new Date().toISOString(), 'Hit maximum iteration limit', { iterationCount });
  }

  try {
    log('processQuery.structuredResponse.start');
    // After tool loop, one final call to get structured output
    logPromptLength(log, 'processQuery.promptLength.beforeStructured', messages);
    const structuredResponse = await getOpenAI().chat.completions.create({
      model: COMPLETIONS_MODEL,
      messages: messages.map(truncateMessage),
      response_format: zodResponseFormat(ClassroomAnalysisSchema, 'classroomAnalysis')
    });
    log('processQuery.structuredResponse.complete');

    const content = JSON.parse(structuredResponse.choices[0].message.content || '{}');
    const structuredData = ClassroomAnalysisSchema.parse(content);

    log('processQuery.writeResult.start');
    // Write successful result to DynamoDB via AppSync
    await writeMCPResultToTable({
      id: responseId,
      status: 'complete',
      learningOutcomes: structuredData.learningOutcomes,
      students: structuredData.students,
      discussionQuestions: structuredData.discussionQuestions,
      toolCalls: toolCalls
    });
    log('processQuery.writeResult.complete');
    
    log('processQuery.success');
    return 'Success';
  } catch (error) {
    log('processQuery.error', {
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