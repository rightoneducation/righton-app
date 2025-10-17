import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";
import { MCPClientClass } from '../client/MCPClientClass.js';
import JSONLogger from '../../utils/jsonLogger.js';

const mcpClients = new Map<string, MCPClientClass>();

// lazy initialize openai client (so that it doesn't try to connect to the API until secrets are loaded)
let openai: OpenAI;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

const logger = new JSONLogger('mcp-host');

export async function initMCPClient(servers: Array<{name: string, version: string, url: string}>) {
  logger.info('mcp_connection_start', { serverCount: servers.length });

  for (const {name, url} of servers){
    try {
      const client = new MCPClientClass(url);
      await client.connect();
      mcpClients.set(name, client);
      
      const tools = client.getTools();
      logger.info('mcp_connected', { 
        name, 
        url, 
        toolCount: tools.length,
        tools: tools.map(t => t.function?.name)
      });
    } catch (error) {
      logger.error('mcp_connection_failed', { 
        name, 
        url, 
        error: error instanceof Error ? error.message : String(error)
      });
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

export async function processQuery (query: string){
  const messages: ChatCompletionMessageParam[] = [
    { role: 'user', content: query }
  ];

  const availableTools = getAllTools();
  logger.info('llm_request_start', { 
    query,
    availableTools: availableTools.map(t => t.function?.name)
  });

  let response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: messages,
    tools: availableTools,
  })

  const finalText: string[] =[];
  let iterationCount = 0;

  while (response.choices[0].message.tool_calls){
    iterationCount++;
    const message = response.choices[0].message;
    messages.push(message);

    logger.info('llm_tool_calls_requested', {
      iteration: iterationCount,
      toolCalls: message.tool_calls?.map(tc => 
        tc.type === 'function' ? {
          name: tc.function.name,
          args: tc.function.arguments
        } : tc
      )
    });

    for (const call of message.tool_calls || []){
      if (call.type !== 'function') continue;

      const toolName = call.function.name;
      const toolArgs = JSON.parse(call.function.arguments || "{}");
      const client = findClientForTool(toolName);
      if (!client) {
        logger.error('tool_not_found', { toolName });
        throw new Error(`No MCP server found for tool: ${toolName}`);
      }

      logger.info('tool_call_start', { toolName, args: toolArgs });
      
      const result = await client.callTool(toolName, toolArgs);
      
      const toolContent = JSON.stringify(result.content);
      logger.info('tool_call_complete', { 
        toolName, 
        args: toolArgs,
        resultLength: toolContent.length,
        result: result.content
      });
      
      finalText.push(`[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`);
      messages.push({
        role: 'tool',
        tool_call_id: call.id,
        content: toolContent,
      })
    }

    logger.info('llm_request_with_tool_results', { iteration: iterationCount });
    
    response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      tools: availableTools,
    })
  }

  if (response.choices[0].message.content) {
    finalText.push(response.choices[0].message.content);
  }

  logger.info('llm_final_response', { 
    totalIterations: iterationCount,
    finalResponse: response.choices[0].message.content
  });

  return finalText.join("\n");
}

export async function disconnectMCP(){
  for (const client of mcpClients.values()){
    await client.disconnect();
  }
  mcpClients.clear();
}