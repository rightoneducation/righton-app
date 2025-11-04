import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { MCPClientClass } from '../client/MCPClientClass.js';

const mcpClients = new Map<string, MCPClientClass>();

// lazy initialize openai client (so that it doesn't try to connect to the API until secrets are loaded)
let openai: OpenAI;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

export async function initMCPClient(servers: Array<{name: string, version: string, url: string}>) {
  for (const {name, url} of servers){
    try {
      const client = new MCPClientClass(url);
      await client.connect();
      mcpClients.set(name, client);
    } catch (error) {
      // Connection failed
    }
  }
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
  const availableTools = getAllTools();
  const parsedQuery = JSON.parse(query);
  const { query: prompt, isRightOnEnabled, isCZIEnabled } = parsedQuery;
  
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

  let response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: messages,
    tools: filteredTools,
  })

  const toolCalls: Array<{name: string, args: any}> = [];
  const MAX_ITERATIONS = 10;
  let iterationCount = 0;

  while (response.choices[0].message.tool_calls && iterationCount < MAX_ITERATIONS){
    iterationCount++;
    const message = response.choices[0].message;
    messages.push(message);

    for (const call of message.tool_calls || []){
      if (call.type !== 'function') continue;

      const toolName = call.function.name;
      const toolArgs = JSON.parse(call.function.arguments || "{}");
      const client = findClientForTool(toolName);
      if (!client) {
        throw new Error(`No MCP server found for tool: ${toolName}`);
      }
      
      const result = await client.callTool(toolName, toolArgs);
      
      const toolContent = JSON.stringify(result.content);
      
      toolCalls.push({ name: toolName, args: toolArgs });
      messages.push({
        role: 'tool',
        tool_call_id: call.id,
        content: toolContent,
      })
    }
    
    response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      tools: filteredTools,
    })
  }
  
  // Log if we hit the max iteration limit
  if (iterationCount >= MAX_ITERATIONS && response.choices[0].message.tool_calls) {
    console.warn('Hit maximum iteration limit of', MAX_ITERATIONS, 'tool calls');
  }

  // After tool loop, one final call to get structured output
  const structuredResponse = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: messages,
    response_format: zodResponseFormat(ClassroomAnalysisSchema, 'classroomAnalysis')
  });

  const content = JSON.parse(structuredResponse.choices[0].message.content || '{}');
  const structuredData = ClassroomAnalysisSchema.parse(content);

  // Return combined response with tool calls and structured data
  return JSON.stringify({
    toolCalls,
    ...structuredData
  });
}

export async function disconnectMCP(){
  for (const client of mcpClients.values()){
    await client.disconnect();
  }
  mcpClients.clear();
}