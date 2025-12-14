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

// Prompts for agents
const SYSTEM_PROMPT = [
  'You are an orchestration agent. Your ONLY job is to coordinate subagents to achieve the workflow outlined below.',
  '',
  'YOU CANNOT ACCESS DATA DIRECTLY. You must delegate all data fetching to subagents:',
  '- To get game sessions: You MUST invoke the game-session-agent subagent',
  '- To get student history: You MUST invoke the student-history-fetcher subagent', 
  '- To get learning science data: You MUST invoke the learning-science-fetcher subagent',
  '- To analyze the data: You MUST invoke the analysis-agent subagent',
  '- To generate the final output: You MUST invoke the output-generator subagent',
  '',
  'When the task requires data, you should say: "I need to invoke the [subagent-name] subagent to gather this data."',
  '',
  'You have NO direct access to mcp__custom__getGameSessionsByClassroomId or other MCP tools.',
  'Workflow:',
  '1. The game-session-agent will be invoked to fetch game session data for the given classroomId',
  '2. The student-history-fetcher will be invoked to fetch student history data for the given classroomId and the learning-science-fetcher will be invoked IN PARELLEL to get learning science data for the given classroomId',
  '3. The analysis-agent will be invoked to analyze the data',
  '4. The output-generator will be invoked to generate the final output',
].join('\n');

const GAME_SESSION_AGENT_PROMPT = [
  'You are a game session data specialist ensuring comprehensive classroom activity analysis.',
  '',
  'When invoked:',
  '1. Use getGameSessionsByClassroomId to fetch sessions for the given classroomId',
  '2. Analyze the sessions immediately',
  '3. Extract all key information systematically',
  '',
  'Extraction checklist:',
  '- All unique student IDs (globalStudentId) from teams.items',
  '- All unique CCSS codes from questions (format: grade.domain.cluster.standard)',
  '- Summary of most recent sessions and their completion status',
  '- Student response patterns and correctness',
  '- Question difficulty and performance metrics',
  '',
  'Return a clear, structured summary with:',
  '- studentIds array (all unique globalStudentId values)',
  '- ccssCodes array (all unique CCSS codes found)',
  '- Session summary with dates, completion status, and key metrics',
  '',
  'Be thorough and ensure no student IDs or CCSS codes are missed.',
].join('\n');

const STUDENT_HISTORY_FETCHER_PROMPT = [
  'Call mcp__custom__getStudentHistory with the provided globalStudentId and classroomId.',
  'Return ONLY the raw JSON result exactly as received. Do not format, analyze, or add commentary.',
].join('\n');

const LEARNING_SCIENCE_FETCHER_PROMPT = [
  'Call mcp__ext__getLearningScienceDatabyCCSS with the provided CCSS code.',
  'Return ONLY the raw JSON result exactly as received. Do not format, analyze, or add commentary.',
].join('\n');

const DISCUSSION_QUESTION_GUIDANCE = [
  'When generating discussion questions:',
  '1. Tie each question to the actual trends the class is struggling with.',
  '2. Base the question on concrete examples from the reviewed game sessions and explicitly reference the scenario or numbers from that example (e.g., restate the question text or the fraction values involved) so students recognize the context.',
  '3. Do NOT mention CCSS codes; refer to the underlying ideas in plain language.',
  '4. Avoid generic directions—anchor each question in specific situations or mistakes observed in the data, quoting or paraphrasing the exact prompt rather than saying "problem 5" or "last session."',
  '5. Do not ask the student to identify what confused them; instead, directly surface the specific misconception or error you observed so the question guides them through the tricky step.',
  '6. Frame each question around the specific misconception or error you observed in the example (describe what went wrong), but let the model decide how best to phrase the follow-up; avoid telling the student to identify their confusion.',
].join(' ');

const ANALYSIS_AGENT_PROMPT = [
  'You are a classroom performance analyst specializing in comprehensive data synthesis and insights.',
  '',
  'When invoked:',
  '1. Review all collected data systematically',
  '2. Cross-reference student mistakes with learning science misconceptions',
  '3. Identify struggling and excelling students',
  '4. Generate actionable insights and recommendations',
  '',
  'You receive:',
  '- Game session analysis with student responses and CCSS codes',
  '- Student history data showing past performance and trends',
  '- Learning science data with misconceptions and pedagogical insights',
  '',
  'Analysis process:',
  '- Cross-reference student mistakes with documented misconceptions',
  '- Identify which students are struggling with which concepts',
  '- Connect patterns across multiple game sessions',
  '- Verify trends using historical student data',
  '- Link errors to specific learning science insights',
  '',
  'For each analysis, provide:',
  '- Learning outcomes based on CCSS standards covered',
  '- Student performance assessments (struggling vs. excelling)',
  '- Evidence-based justifications for each assessment',
  `- Two targeted discussion questions for struggling students. These questions should be based on the data and the learning science data and follow ${DISCUSSION_QUESTION_GUIDANCE}`,
  '',
  'Be thorough in connecting student errors to documented misconceptions. Provide specific evidence for all assessments.',
  '',
  'Return your analysis in a clear, structured format that can be used by the output-generator subagent.',
].join('\n');

const OUTPUT_GENERATOR_PROMPT = [
  'You are a structured output generator specializing in formatting analysis results into the required JSON schema.',
  '',
  'When invoked:',
  '1. Receive analysis results from the analysis-agent',
  '2. Format the data according to the required schema',
  '3. Use the StructuredOutput tool to generate the final JSON',
  '',
  'You receive:',
  '- Analysis results with learning outcomes, student assessments, and discussion questions',
  '',
  'Output requirements:',
  '- learningOutcomes: String describing what students should learn',
  '- students: Array of student objects with name, performance (struggling/excelling), and justification',
  '- discussionQuestions: Array of two question objects with studentName and question',
  '',
  'Use the StructuredOutput tool to generate the final output. Ensure all fields match the required schema exactly.',
].join('\n');

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
      // DISCUSSION_QUESTION_REMINDER
    ].join('\n\n');

    // Explicitly set model to ensure we always use haiku, not sonnet
    const modelToUse = COMPLETIONS_MODEL; // 'claude-haiku-4-5'
    
    const maxTurnsValue = 30; // Increased from 10 to allow more turns for complex analysis

    log('Query configuration', {
      model: modelToUse,
      maxTurns: maxTurnsValue,
      mcpServerCount: Object.keys(mcpServers).length,
      disallowedToolsCount: disallowedTools.length
    });

    const q = query({
      prompt,
      options: {
        model: modelToUse, // Explicitly use haiku - never use sonnet
        systemPrompt: fullSystemPrompt,
        mcpServers: mcpServers, // CRITICAL: Must be enabled for subagents to access MCP tools
        disallowedTools: disallowedTools,
        maxTurns: maxTurnsValue,
        permissionMode: 'default', // Allow subagents to use MCP tools without permission prompts
        settingSources: ['project'], // Load project settings for MCP tool permissions
        outputFormat: {
          type: 'json_schema',
          schema: CLASSROOM_ANALYSIS_JSON_SCHEMA
        },
        agents: {
          'game-session-agent': {
            description: 'Game session data specialist. Proactively fetches and analyzes game sessions for classrooms. Use immediately when you need game session data, student IDs, or CCSS codes from classroom activities.',
            prompt: GAME_SESSION_AGENT_PROMPT,
            tools: ['mcp__custom__getGameSessionsByClassroomId'],
            model: 'haiku'
          },
          'student-history-fetcher': {
            description: 'Student history data specialist. Proactively fetches student performance history. Use immediately when you need a student\'s past performance, game results, or historical data for analysis.',
            prompt: STUDENT_HISTORY_FETCHER_PROMPT,
            tools: ['mcp__custom__getStudentHistory'],
            model: 'haiku'
          },
          'learning-science-fetcher': {
            description: 'Learning science data specialist. Proactively fetches pedagogical insights and misconceptions for CCSS standards. Use immediately when you need learning science context, common errors, or pedagogical guidance for a specific CCSS code.',
            prompt: LEARNING_SCIENCE_FETCHER_PROMPT,
            tools: ['mcp__ext__getLearningScienceDatabyCCSS'],
            model: 'haiku'
          },
          'analysis-agent': {
            description: 'Classroom performance analyst. Synthesizes game sessions, student history, and learning science data into insights and recommendations. Use proactively when all data has been collected and you need comprehensive analysis.',
            prompt: ANALYSIS_AGENT_PROMPT,
            tools: [], // No tools - pure analysis
            model: 'haiku'
          },
          'output-generator': {
            description: 'Structured output generator. Generates the final JSON output in the required schema format. Use proactively when you have completed analysis and need to generate the final structured output with learning outcomes, student assessments, and discussion questions.',
            prompt: OUTPUT_GENERATOR_PROMPT,
            tools: ['StructuredOutput'], // Only this subagent can use StructuredOutput
            model: 'haiku'
          }
        }
      }
    });

    // Process messages from the generator
    let finalResult: string | undefined;
    let structuredData: any = undefined;
    let toolCalls: Array<{name: string, args: any}> = [];
    const invokedAgents = new Set<string>(); // Track which subagents were invoked
    const subagentResults = new Map<string, any>(); // Store subagent results
    const subagentStartTimes = new Map<string, number>(); // Track start times
    

    // Main agentic loop from query - stream results as they arrive
    for await (const msg of q) {
      
      // Track subagent invocations via Task tool
      if (msg.type === 'assistant' && msg.message?.content) {
        for (const content of msg.message.content) {
          if (content.type === 'tool_use' && content.name === 'Task') {
            const agentType = content.input?.subagent_type;
            if (agentType) {
              invokedAgents.add(agentType);
              subagentStartTimes.set(content.id, Date.now());
              log('Subagent invoked', {
                agentType,
                taskId: content.id,
                description: content.input?.description
              });
            }
          }
          
          // Track other tool calls
          if (content.type === 'tool_use' && content.name !== 'Task') {
            toolCalls.push({
              name: content.name,
              args: content.input
            });
          }
        }
      }

      // Track subagent completions via tool_use_result
      if (msg.type === 'user' && 'tool_use_result' in msg) {
        const result = msg.tool_use_result as any;
        
        // Check if this is a subagent completion (has agentId or status)
        if (result && (result.agentId || result.status === 'completed')) {
          const agentId = result.agentId || 'unknown';
          const taskId = msg.parent_tool_use_id;
          const startTime = taskId ? subagentStartTimes.get(taskId) : undefined;
          const duration = startTime ? Date.now() - startTime : undefined;
          
          subagentResults.set(agentId, result);
          
          log('Subagent completed', {
            agentId,
            taskId,
            durationMs: duration,
            prompt: result.prompt,
            status: result.status
          });
        }
      }

      // Log all messages for debugging
      log('Message received', {
        type: msg.type,
        subtype: (msg as any).subtype || undefined,
        hasToolUse: msg.type === 'assistant' && msg.message?.content?.some((c: any) => c.type === 'tool_use'),
        hasToolResult: msg.type === 'user' && 'tool_use_result' in msg
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
            invokedAgents: Array.from(invokedAgents),
            totalAgentsInvoked: invokedAgents.size,
            subagentCompletions: subagentResults.size,
            modelUsage: msg.modelUsage // Log which models were actually used
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