import { query } from '@anthropic-ai/claude-agent-sdk';
import { v4 as uuidv4 } from 'uuid';
import { MCPClientClass } from '../client/MCPClientClass.js';
import { writeMCPResultToTable } from '../../utils/writeToTable.js';

const mcpClients = new Map<string, MCPClientClass>();

// set model
const COMPLETIONS_MODEL = 'claude-haiku-4-5';
const MAX_MESSAGE_LENGTH = 4000;

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

// System prompt for single agent - ultra-concise for speed
const SYSTEM_PROMPT = [
  'Fast classroom analyst. Max 6 tool calls. NO intermediate thinking - call StructuredOutput immediately after getting data.',
  '',
  'WORKFLOW (exact order):',
  '1. mcp__custom__getGameSessionsByClassroomId',
  '2. Extract: 1 CCSS code, 1 struggling student ID (in your head, no text output)',
  '3. mcp__custom__getStudentHistory (1 student)',
  '4. mcp__ext__getLearningScienceDatabyCCSS (1 code)',
  '5. IMMEDIATELY call StructuredOutput - NO thinking, NO planning, NO analysis text',
  '',
  'OUTPUT: learningOutcomes (brief), 2 students (1 struggling/1 excelling), 2 questions (reference specific wrong answers)',
  '',
  'After step 4, go DIRECTLY to StructuredOutput. Do not write analysis. Do not explain. Just output JSON.',
].join('\n');

// No subagent prompts needed - single agent handles everything

// Schema for structured outputs
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




export async function processQuery (queryString: string){
  const parsedQuery = JSON.parse(queryString);
  const { query: prompt, isRightOnEnabled, isCZIEnabled, classroomId } = parsedQuery;
  let responseId = uuidv4();
  const log = createStepLogger(responseId);
  log('processQuery.start');

  // Configure MCP servers based on enabled flags
  // The SDK will automatically discover tools from these servers

  const mcpServers: Record<string, any> = {};

  if (isRightOnEnabled && process.env.MCP_SERVER_URL) {
    mcpServers['custom'] = {
      type: 'http' as const,
      url: process.env.MCP_SERVER_URL,
      headers: {}
    };
  }
  
  if (isCZIEnabled && process.env.EXT_MCP_SERVER_URL) {
    mcpServers['ext'] = {
      type: 'http' as const,
      url: process.env.EXT_MCP_SERVER_URL,
      headers: {}
    };
  }


  // TABLE: event_type='processQuery.toolsFiltered', iteration=0, elapsed_ms=<current>, duration_ms=null, tool_name=null, prompt_length=null
  log('processQuery.toolsFiltered', { 
    enabledServers: Object.keys(mcpServers),
    serverCount: Object.keys(mcpServers).length,
    serverUrls: Object.entries(mcpServers).map(([name, config]) => ({
      name,
      url: (config as any).url,
      type: (config as any).type
    }))
  });
  
  // Disable ALL irrelevant tools from agents (this applies globally to all agents and subagents)
  const disallowedTools = [
    // MUST allow Task tool - it's used to invoke subagents
    // MUST allow TaskOutput - it's used to receive subagent results
    'Bash',
    'Glob',
    'Grep',
    'ExitPlanMode',
    'Read',
    'Edit',
    'Write',
    'NotebookEdit',
    'WebFetch',
    'TodoWrite',
    'WebSearch',
    'KillShell',
    'Skill',
    'SlashCommand',
    'EnterPlanMode',
  ];

  try {
    log('Initial completion started', { totalChars: prompt.length });
    const initialStart = Date.now();

    // Build system prompt
    const fullSystemPrompt = [
      SYSTEM_PROMPT,
    ].join('\n\n');
    
    // Prepend efficiency instruction to user prompt
    const optimizedPrompt = `[No thinking aloud. No explanations. Execute workflow then call StructuredOutput immediately.]\n\n${prompt}`;

    // Explicitly set model to ensure we always use haiku, not sonnet
    // Use shorthand to potentially enforce more strictly
    const modelToUse = 'haiku'; // Force haiku without allowing SDK to upgrade
    
    // Strict turn limit to enforce efficiency (need ~7 turns for 4 tools + reasoning)
    const maxTurnsValue = 10;

    log('Query configuration', {
      model: modelToUse,
      maxTurns: maxTurnsValue,
      mcpServerCount: Object.keys(mcpServers).length,
      disallowedToolsCount: disallowedTools.length
    });

    const q = query({
      prompt: optimizedPrompt,
      options: {
        model: modelToUse,
        systemPrompt: fullSystemPrompt,
        mcpServers: mcpServers,
        disallowedTools: disallowedTools,
        maxTurns: maxTurnsValue,
        permissionMode: 'default',
        settingSources: ['project'],
        outputFormat: {
          type: 'json_schema',
          schema: CLASSROOM_ANALYSIS_JSON_SCHEMA
        }
        // No agents config - single agent handles everything
      }
    });

    // Process messages from the generator
    let finalResult: string | undefined;
    let structuredData: any = undefined;
    let toolCalls: Array<{name: string, args: any}> = [];
    
    // Main agentic loop from query
    for await (const msg of q) {
      
      // Track tool calls
      if (msg.type === 'assistant' && msg.message?.content) {
        for (const content of msg.message.content) {
          if (content.type === 'tool_use') {
            toolCalls.push({
              name: content.name,
              args: content.input
            });
            
          }
        }
      }

      // Log messages for debugging
      log('Message received', {
        type: msg.type,
        subtype: (msg as any).subtype || undefined,
        hasToolUse: msg.type === 'assistant' && msg.message?.content?.some((c: any) => c.type === 'tool_use')
      });

      // Handle final result
      if (msg.type === 'result') {
        if (msg.subtype === 'success') {
          finalResult = msg.result;
          
          // Extract structured output if available
          if (msg.structured_output) {
            structuredData = msg.structured_output;
          } else if (finalResult) {
            // Try to parse as JSON if structured_output not available
            try {
              structuredData = JSON.parse(finalResult);
            } catch {
              // If not JSON, we'll need to handle it differently
              console.log('Final result is not JSON:', finalResult);
            }
          }
          
          log('Process complete', {
            durationMs: msg.duration_ms,
            numTurns: msg.num_turns,
            totalCostUsd: msg.total_cost_usd,
            toolCalls: toolCalls.length,
            modelUsage: msg.modelUsage
          });
          
          // Log the final structured output
          log('Final JSON Output', {
            learningOutcomes: structuredData?.learningOutcomes,
            students: structuredData?.students,
            discussionQuestions: structuredData?.discussionQuestions
          });
          
        } else {
          log('Process failed', {
            subtype: msg.subtype,
            errors: 'errors' in msg ? msg.errors : undefined
          });
          throw new Error(`Query failed: ${msg.subtype}`);
        }
        break; // Exit loop when result is received
      }
    }

    if (!finalResult) {
      throw new Error('No result received from query');
    }


    log('Writing result');
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
    
    log('Write complete', { durationMs: Date.now() - writeStart });
    log('Process complete');
    return 'Success';

  } catch (error) {
    log('Process failed', {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    
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