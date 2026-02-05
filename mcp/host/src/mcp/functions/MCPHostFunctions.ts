import { query } from '@anthropic-ai/claude-agent-sdk';
import { v4 as uuidv4 } from 'uuid';
import { MCPClientClass } from '../client/MCPClientClass.js';
import { writeMCPResultToTable } from '../../utils/writeToTable.js';
import { execSync } from 'child_process';

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
      headers: {
        'Accept': 'application/json, text/event-stream'
      }
    };
  }
  
  if (isCZIEnabled && process.env.EXT_MCP_ENDPOINT && process.env.EXT_MCP_KEY && process.env.EXT_MCP_USER) {
    mcpServers['ext-mcp-server'] = {
      type: 'http' as const,
      url: process.env.EXT_MCP_ENDPOINT,
      headers: {
        'Accept': 'application/json, text/event-stream',
        'x-api-key': process.env.EXT_MCP_KEY,
        'x-user': process.env.EXT_MCP_USER
      }
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

  let timeoutWarning: NodeJS.Timeout | undefined;

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

    log('Creating query generator');
    console.log('[SYNC] About to call query() function');
    let q: any;
    try {
      // CRITICAL: Explicitly pass env to ensure PATH is preserved when SDK spawns child process
      // The SDK's ProcessTransport may spawn with a custom env that doesn't include PATH,
      // causing "spawn node ENOENT" errors in Docker. By explicitly passing process.env,
      // we ensure PATH and all other environment variables are available to the child process.
      
      // CRITICAL: Capture stderr from child process to see why it's crashing
      let childStderrBuffer = '';
      const stderrCallback = (data: string) => {
        childStderrBuffer += data;
        process.stderr.write(`[CHILD_STDERR] ${data.substring(0, 1000)}\n`);
        // Keep only last 5000 chars
        if (childStderrBuffer.length > 5000) {
          childStderrBuffer = childStderrBuffer.slice(-5000);
        }
      };
      
      q = query({
        prompt: optimizedPrompt,
        options: {
          model: modelToUse,
          systemPrompt: fullSystemPrompt,
          mcpServers: mcpServers,
          disallowedTools: disallowedTools,
          maxTurns: maxTurnsValue,
          permissionMode: 'default', // Use default permission mode, respecting .claude/settings.json
          settingSources: ['project'], // SDK will read permissions from .claude/settings.json
          env: process.env, // Explicitly pass full environment including PATH
          stderr: stderrCallback, // Capture child process stderr to diagnose crashes
          outputFormat: {
            type: 'json_schema',
            schema: CLASSROOM_ANALYSIS_JSON_SCHEMA
          }
          // No agents config - single agent handles everything
        }
      });
      
      // Store stderr buffer reference for later access
      (q as any)._stderrBuffer = childStderrBuffer;
      console.log('[SYNC] query() returned, type:', typeof q);
      console.log('[SYNC] query() result:', q);
      
      // Monitor child process if it exists (ProcessTransport spawns a child lazily)
      const transport = (q as any).transport;
      process.stderr.write(`[CHILD_PROCESS] Transport type: ${transport ? transport.constructor.name : 'null'}\n`);
      process.stderr.write(`[CHILD_PROCESS] Transport has process: ${!!transport?.process}\n`);
      process.stderr.write(`[CHILD_PROCESS] Transport process type: ${transport?.process ? transport.process.constructor.name : 'N/A'}\n`);
      
      // Check if transport has options with env
      if (transport?.options?.env) {
        const envKeys = Object.keys(transport.options.env);
        process.stderr.write(`[ENV_CHECK] Transport options.env has ${envKeys.length} keys\n`);
        process.stderr.write(`[ENV_CHECK] Transport options.env.PATH exists: ${!!transport.options.env.PATH}\n`);
        if (transport.options.env.PATH) {
          process.stderr.write(`[ENV_CHECK] Transport options.env.PATH: ${transport.options.env.PATH.substring(0, 200)}...\n`);
        } else {
          process.stderr.write(`[ENV_CHECK] WARNING: Transport options.env.PATH is MISSING!\n`);
        }
      } else {
        process.stderr.write(`[ENV_CHECK] Transport options.env is not set\n`);
      }
      
      // Log environment that could affect child process spawning
      process.stderr.write(`[ENV_CHECK] NODE: ${process.env.NODE || 'not set'}\n`);
      process.stderr.write(`[ENV_CHECK] PATH: ${process.env.PATH?.substring(0, 200) || 'not set'}\n`);
      process.stderr.write(`[ENV_CHECK] PWD: ${process.env.PWD || process.cwd()}\n`);
      
      // Check if node executable is available
      try {
        const nodePath = execSync('which node', { encoding: 'utf-8', timeout: 1000 }).trim();
        process.stderr.write(`[ENV_CHECK] Node executable found at: ${nodePath}\n`);
        
        // Check node version
        try {
          const nodeVersion = execSync('node --version', { encoding: 'utf-8', timeout: 1000 }).trim();
          process.stderr.write(`[ENV_CHECK] Node version: ${nodeVersion}\n`);
        } catch (e) {
          process.stderr.write(`[ENV_CHECK] Could not get node version: ${e instanceof Error ? e.message : String(e)}\n`);
        }
      } catch (e) {
        process.stderr.write(`[ENV_CHECK] ERROR finding node: ${e instanceof Error ? e.message : String(e)}\n`);
      }
      
      // Check resource limits that could affect child process spawning
      try {
        const ulimitN = execSync('ulimit -n', { encoding: 'utf-8', timeout: 1000 }).trim();
        process.stderr.write(`[ENV_CHECK] File descriptor limit (ulimit -n): ${ulimitN}\n`);
      } catch (e) {
        process.stderr.write(`[ENV_CHECK] Could not check file descriptor limit: ${e instanceof Error ? e.message : String(e)}\n`);
      }
      
      try {
        const ulimitU = execSync('ulimit -u', { encoding: 'utf-8', timeout: 1000 }).trim();
        process.stderr.write(`[ENV_CHECK] Process limit (ulimit -u): ${ulimitU}\n`);
      } catch (e) {
        process.stderr.write(`[ENV_CHECK] Could not check process limit: ${e instanceof Error ? e.message : String(e)}\n`);
      }
      
      // Check if we're in a container (EC2 indicator)
      try {
        const cgroup = execSync('cat /proc/self/cgroup 2>/dev/null | head -1', { encoding: 'utf-8', timeout: 1000 }).trim();
        if (cgroup) {
          process.stderr.write(`[ENV_CHECK] Cgroup info: ${cgroup.substring(0, 200)}\n`);
        }
      } catch (e) {
        // Ignore - not in a container or can't read cgroup
      }
      
      // Check memory info
      try {
        const memInfo = execSync('cat /proc/meminfo 2>/dev/null | head -3', { encoding: 'utf-8', timeout: 1000 }).trim();
        if (memInfo) {
          process.stderr.write(`[ENV_CHECK] Memory info: ${memInfo}\n`);
        }
      } catch (e) {
        // Ignore - can't read meminfo
      }
      
      // Check if Agent SDK CLI file exists
      try {
        const fs = await import('fs');
        const cliPath = '/app/node_modules/@anthropic-ai/claude-agent-sdk/cli.js';
        const cliExists = fs.existsSync(cliPath);
        process.stderr.write(`[ENV_CHECK] Agent SDK CLI exists: ${cliExists} (${cliPath})\n`);
        if (cliExists) {
          const stats = fs.statSync(cliPath);
          process.stderr.write(`[ENV_CHECK] CLI file size: ${stats.size} bytes, executable: ${(stats.mode & parseInt('111', 8)) !== 0}\n`);
        }
      } catch (e) {
        process.stderr.write(`[ENV_CHECK] Could not check CLI file: ${e instanceof Error ? e.message : String(e)}\n`);
      }
      
      // Monitor transport state changes
      if (transport) {
        // Check for exit error before iteration
        if (transport.exitError) {
          process.stderr.write(`[CHILD_PROCESS] Transport has exit error before iteration: ${transport.exitError}\n`);
        }
        
        // CRITICAL: Try to access the actual child process from the transport
        // The SDK may store it in a private property like _process
        let actualChildProcess: any = null;
        if (transport.process) {
          // Check if it's a wrapper - try to get the actual process
          actualChildProcess = transport.process;
          // Try common private property names
          if ((transport as any)._process) {
            actualChildProcess = (transport as any)._process;
            process.stderr.write(`[CHILD_PROCESS] Found _process property on transport\n`);
          }
          // Check if process has a _handle or similar
          if (actualChildProcess && (actualChildProcess as any)._handle) {
            process.stderr.write(`[CHILD_PROCESS] Process has _handle property\n`);
          }
        }
        
        // Monitor when child process spawns (it may spawn lazily during iteration)
        const originalProcess = transport.process;
        let processCheckCount = 0;
        const processCheckInterval = setInterval(() => {
          processCheckCount++;
          const currentProcess = transport.process;
          
          // Try to get PID - if it exists, the process has spawned
          let currentPid: number | undefined = undefined;
          if (currentProcess) {
            try {
              currentPid = currentProcess.pid;
            } catch (e) {
              // PID might not be accessible yet
            }
          }
          
          if (currentPid !== undefined && currentPid !== null) {
            process.stderr.write(`[CHILD_PROCESS] Child process spawned with PID ${currentPid} (check #${processCheckCount})\n`);
            clearInterval(processCheckInterval);
            setupChildProcessMonitoring(currentProcess);
          } else if (currentProcess && currentProcess !== originalProcess) {
            process.stderr.write(`[CHILD_PROCESS] Child process object changed (check #${processCheckCount})\n`);
            clearInterval(processCheckInterval);
            setupChildProcessMonitoring(currentProcess);
          } else if (processCheckCount > 40) {
            // Stop checking after 20 seconds (40 * 500ms)
            process.stderr.write(`[CHILD_PROCESS] Stopped checking for child process after 20 seconds\n`);
            clearInterval(processCheckInterval);
          }
        }, 500);
        
        // Setup monitoring if process already exists and has a PID
        if (transport.process) {
          try {
            const pid = transport.process.pid;
            if (pid !== undefined && pid !== null) {
              process.stderr.write(`[CHILD_PROCESS] Process already has PID ${pid}, setting up monitoring\n`);
              setupChildProcessMonitoring(transport.process);
            } else {
              process.stderr.write(`[CHILD_PROCESS] Process exists but PID is ${pid}, will monitor when PID appears\n`);
            }
          } catch (e) {
            process.stderr.write(`[CHILD_PROCESS] Could not access process.pid: ${e instanceof Error ? e.message : String(e)}\n`);
          }
        }
        
        // Also monitor transport.stdout/stderr directly if available
        if (transport.processStdout) {
          process.stderr.write(`[CHILD_PROCESS] Transport has processStdout, setting up direct monitoring\n`);
          transport.processStdout.on('data', (data: Buffer) => {
            process.stderr.write(`[CHILD_PROCESS_STDOUT_DIRECT] ${data.toString().substring(0, 1000)}\n`);
          });
          transport.processStdout.on('error', (err: Error) => {
            process.stderr.write(`[CHILD_PROCESS] processStdout error: ${err.message}\n`);
          });
        }
      } else {
        process.stderr.write(`[CHILD_PROCESS] No transport found\n`);
      }
      
      // Helper function to monitor child process
      function setupChildProcessMonitoring(childProcess: any) {
        process.stderr.write(`[CHILD_PROCESS] Setting up monitoring for PID: ${childProcess.pid}\n`);
        process.stderr.write(`[CHILD_PROCESS] Process type: ${childProcess.constructor.name}\n`);
        process.stderr.write(`[CHILD_PROCESS] Process killed: ${childProcess.killed}\n`);
        process.stderr.write(`[CHILD_PROCESS] Process exit code: ${childProcess.exitCode}\n`);
        process.stderr.write(`[CHILD_PROCESS] Process signal: ${childProcess.signalCode}\n`);
        
        // CRITICAL: Capture ALL stdout/stderr from child process to see why it's crashing
        let stdoutBuffer = '';
        let stderrBuffer = '';
        
        childProcess.on('exit', (code: number | null, signal: string | null) => {
          process.stderr.write(`[CHILD_PROCESS] Child process exited with code ${code}, signal ${signal}\n`);
          if (code !== 0 && code !== null) {
            process.stderr.write(`[CHILD_PROCESS] Child process exited abnormally - this may cause parent to exit\n`);
            process.stderr.write(`[CHILD_PROCESS] Captured stdout (last 2000 chars): ${stdoutBuffer.slice(-2000)}\n`);
            process.stderr.write(`[CHILD_PROCESS] Captured stderr (last 2000 chars): ${stderrBuffer.slice(-2000)}\n`);
          }
        });
        
        childProcess.on('error', (error: Error) => {
          process.stderr.write(`[CHILD_PROCESS] Child process error: ${error.message}\n`);
          process.stderr.write(`[CHILD_PROCESS] Error name: ${error.name}\n`);
          process.stderr.write(`[CHILD_PROCESS] Error code: ${(error as any).code || 'N/A'}\n`);
          process.stderr.write(`[CHILD_PROCESS] Stack: ${error.stack}\n`);
        });
        
        // Monitor stdio if available - capture ALL output
        if (childProcess.stdout) {
          childProcess.stdout.on('data', (data: Buffer) => {
            const text = data.toString();
            stdoutBuffer += text;
            process.stderr.write(`[CHILD_PROCESS_STDOUT] ${text.substring(0, 1000)}\n`);
            // If buffer gets too large, keep only last 5000 chars
            if (stdoutBuffer.length > 5000) {
              stdoutBuffer = stdoutBuffer.slice(-5000);
            }
          });
          childProcess.stdout.on('error', (err: Error) => {
            process.stderr.write(`[CHILD_PROCESS] stdout error: ${err.message}\n`);
          });
        } else {
          process.stderr.write(`[CHILD_PROCESS] WARNING: childProcess.stdout is null/undefined\n`);
        }
        
        if (childProcess.stderr) {
          childProcess.stderr.on('data', (data: Buffer) => {
            const text = data.toString();
            stderrBuffer += text;
            process.stderr.write(`[CHILD_PROCESS_STDERR] ${text.substring(0, 1000)}\n`);
            // If buffer gets too large, keep only last 5000 chars
            if (stderrBuffer.length > 5000) {
              stderrBuffer = stderrBuffer.slice(-5000);
            }
          });
          childProcess.stderr.on('error', (err: Error) => {
            process.stderr.write(`[CHILD_PROCESS] stderr error: ${err.message}\n`);
          });
        } else {
          process.stderr.write(`[CHILD_PROCESS] WARNING: childProcess.stderr is null/undefined\n`);
        }
      }
    } catch (e) {
      console.error('[SYNC] ERROR calling query():', e);
      throw e;
    }

    log('Query generator created, starting message loop');
    console.log('[SYNC] After query() call, before iteration');
    // Process messages from the generator
    let finalResult: string | undefined;
    let structuredData: any = undefined;
    let toolCalls: Array<{name: string, args: any}> = [];
    
    // Main agentic loop from query
    log('About to await first message from generator');
    let messageCount = 0;

    try {
      log('Generator inspection', {
        type: typeof q,
        isAsyncIterable: Symbol.asyncIterator in (q as any)
      });
    } catch (e) {
      log('Error inspecting generator', {
        message: e instanceof Error ? e.message : String(e),
        error: e
      });
    }
    
    // Add timeout warning to detect if generator is truly hanging
    timeoutWarning = setTimeout(() => {
      log('WARNING: Generator has not yielded any messages after 30 seconds. MCP initialization may be hanging.');
    }, 30000);
    
    log('Starting generator iteration', { generatorReady: true });
    
    // Wrap entire iteration in comprehensive try-catch
    let iterationError: any = null;
    try {
      log('BEFORE for-await: About to start iteration', { 
        generatorType: typeof q,
        hasSymbolAsyncIterator: Symbol.asyncIterator in (q as any),
        generatorString: String(q).substring(0, 200)
      });
      
      // Don't wait for initialization - let the generator handle it naturally
      // The generator will yield initialization messages and handle errors internally
      // Explicitly awaiting initialization can cause hangs when MCP servers are involved
      const transport = (q as any).transport;
      
      // Enhanced transport state logging
      process.stderr.write(`[TRANSPORT_STATE] Before iteration:\n`);
      process.stderr.write(`[TRANSPORT_STATE]   - Transport exists: ${!!transport}\n`);
      process.stderr.write(`[TRANSPORT_STATE]   - Transport type: ${transport ? transport.constructor.name : 'N/A'}\n`);
      process.stderr.write(`[TRANSPORT_STATE]   - Transport ready: ${transport?._ready || 'N/A'}\n`);
      process.stderr.write(`[TRANSPORT_STATE]   - Transport closed: ${transport?._closed || 'N/A'}\n`);
      process.stderr.write(`[TRANSPORT_STATE]   - Transport exit error: ${transport?.exitError || 'none'}\n`);
      process.stderr.write(`[TRANSPORT_STATE]   - Transport process: ${transport?.process ? `PID ${transport.process.pid || 'undefined'}` : 'none'}\n`);
      
      if (transport?.exitError) {
        process.stderr.write(`[FATAL] Transport already has exit error: ${transport.exitError}\n`);
        throw new Error(`Child process failed before iteration: ${transport.exitError}`);
      }
      
      // Monitor transport for spawn errors during iteration
      if (transport) {
        // Check transport properties that might indicate spawn issues
        const transportKeys = Object.keys(transport);
        process.stderr.write(`[TRANSPORT_STATE] Transport keys: ${transportKeys.join(', ')}\n`);
        
        // Monitor for exit errors that might occur during spawn
        const originalExitError = transport.exitError;
        const exitErrorCheckInterval = setInterval(() => {
          if (transport.exitError && transport.exitError !== originalExitError) {
            process.stderr.write(`[FATAL] Transport exit error detected during iteration: ${transport.exitError}\n`);
            clearInterval(exitErrorCheckInterval);
          }
        }, 100);
        
        // Clear interval after 30 seconds
        setTimeout(() => clearInterval(exitErrorCheckInterval), 30000);
      }
      
      // Monitor initialization in background for diagnostics only
      if ((q as any).initialization) {
        (q as any).initialization.catch((initError: any) => {
          process.stderr.write(`[FATAL] Initialization promise rejected: ${initError instanceof Error ? initError.message : String(initError)}\n`);
          if (transport?.exitError) {
            process.stderr.write(`[FATAL] Transport exit error: ${transport.exitError}\n`);
          }
        });
      }
      
      // Create iterator explicitly to catch any immediate errors
      const iterator = (q as any)[Symbol.asyncIterator]();
      log('Iterator created successfully', { iteratorType: typeof iterator });
      
      log('Entering for-await loop', { aboutToIterate: true });
      process.stderr.write(`[SYNC] RIGHT BEFORE for-await loop - if process exits, this is the last log\n`);
      process.stderr.write(`[SYNC] Process PID: ${process.pid}\n`);
      process.stderr.write(`[SYNC] Timestamp: ${new Date().toISOString()}\n`);
      
      // CRITICAL: Log transport env before iteration to verify PATH is present
      if (transport?.options?.env) {
        process.stderr.write(`[PRE_ITERATION] Transport options.env keys: ${Object.keys(transport.options.env).length}\n`);
        process.stderr.write(`[PRE_ITERATION] Transport options.env.PATH exists: ${!!transport.options.env.PATH}\n`);
        if (transport.options.env.PATH) {
          process.stderr.write(`[PRE_ITERATION] Transport options.env.PATH: ${transport.options.env.PATH.substring(0, 200)}...\n`);
        } else {
          process.stderr.write(`[PRE_ITERATION] ERROR: Transport options.env.PATH is MISSING - spawn will fail!\n`);
        }
        // Log a few other critical env vars for comparison
        process.stderr.write(`[PRE_ITERATION] Transport options.env.NODE_ENV: ${transport.options.env.NODE_ENV || 'not set'}\n`);
        process.stderr.write(`[PRE_ITERATION] Transport options.env.PWD: ${transport.options.env.PWD || 'not set'}\n`);
      } else {
        process.stderr.write(`[PRE_ITERATION] ERROR: Transport options.env is not set at all!\n`);
      }
      
      // Check if initialization promise exists and its state
      if ((q as any).initialization) {
        process.stderr.write(`[PRE_ITERATION] Initialization promise exists\n`);
        // CRITICAL: Handle initialization promise rejection BEFORE iteration
        // If initialization fails (e.g., child process spawn fails), it will reject
        // and we need to catch it to prevent unhandled rejection that might trigger SIGTERM
        (q as any).initialization.then(() => {
          process.stderr.write(`[PRE_ITERATION] Initialization promise resolved successfully\n`);
        }).catch((err: any) => {
          process.stderr.write(`[FATAL] Initialization promise rejected BEFORE iteration: ${err instanceof Error ? err.message : String(err)}\n`);
          process.stderr.write(`[FATAL] Initialization error stack: ${err instanceof Error ? err.stack : 'No stack'}\n`);
          process.stderr.write(`[FATAL] Initialization error type: ${err instanceof Error ? err.constructor.name : typeof err}\n`);
          if (transport?.exitError) {
            process.stderr.write(`[FATAL] Transport exit error: ${transport.exitError}\n`);
            process.stderr.write(`[FATAL] Transport exit error message: ${transport.exitError instanceof Error ? transport.exitError.message : String(transport.exitError)}\n`);
          }
          // Don't throw - let the iteration handle it, but log extensively
        });
      } else {
        process.stderr.write(`[PRE_ITERATION] No initialization promise found\n`);
      }
      
      process.stderr.write(`[SYNC] Starting async iteration...\n`);
      
      // CRITICAL: Check if abort controller is already aborted - this could cause issues
      if (transport?.abortController) {
        const isAborted = transport.abortController.signal.aborted;
        process.stderr.write(`[TRANSPORT_STATE] Abort controller aborted: ${isAborted}\n`);
        if (isAborted) {
          process.stderr.write(`[FATAL] Abort controller is already aborted - this may cause SIGTERM\n`);
        }
      }
      
      // Check transport state right before iteration starts
      if (transport) {
        process.stderr.write(`[TRANSPORT_STATE] Right before iteration:\n`);
        process.stderr.write(`[TRANSPORT_STATE]   - Process exists: ${!!transport.process}\n`);
        if (transport.process) {
          process.stderr.write(`[TRANSPORT_STATE]   - Process PID: ${transport.process.pid || 'undefined'}\n`);
          process.stderr.write(`[TRANSPORT_STATE]   - Process type: ${transport.process.constructor.name}\n`);
        }
        process.stderr.write(`[TRANSPORT_STATE]   - Exit error: ${transport.exitError || 'none'}\n`);
        process.stderr.write(`[TRANSPORT_STATE]   - Transport ready: ${transport.ready || 'false'}\n`);
      }
      
      // CRITICAL: Add a small delay to see if SIGTERM arrives during this window
      // This will help us determine if SIGTERM is sent immediately when iteration starts
      // or if it's sent by something else
      await new Promise(resolve => setTimeout(resolve, 50));
      process.stderr.write(`[SYNC] After 50ms delay, still alive - proceeding with iteration\n`);
      
      for await (const msg of q) {
        // CRITICAL: Check for transport errors on EVERY iteration
        // The SDK may set exitError during iteration if child process fails to spawn
        if (transport?.exitError) {
          const errorMsg = transport.exitError instanceof Error ? transport.exitError.message : String(transport.exitError);
          process.stderr.write(`[FATAL] Transport exit error detected during iteration: ${errorMsg}\n`);
          process.stderr.write(`[FATAL] Transport exit error type: ${transport.exitError instanceof Error ? transport.exitError.constructor.name : typeof transport.exitError}\n`);
          process.stderr.write(`[FATAL] Transport exit error stack: ${transport.exitError instanceof Error ? transport.exitError.stack : 'No stack'}\n`);
          
          // Log captured stderr from child process
          const stderrBuffer = (q as any)._stderrBuffer;
          if (stderrBuffer && stderrBuffer.length > 0) {
            process.stderr.write(`[FATAL] Child process stderr output (${stderrBuffer.length} chars):\n${stderrBuffer.slice(-5000)}\n`);
          } else {
            process.stderr.write(`[FATAL] No stderr captured from child process\n`);
          }
          
          // Check if this is a spawn error (ENOENT, etc.)
          if (errorMsg.includes('spawn') || errorMsg.includes('ENOENT') || errorMsg.includes('Failed to spawn')) {
            process.stderr.write(`[FATAL] This is a spawn error - child process failed to start\n`);
            process.stderr.write(`[FATAL] This likely means PATH is missing or node executable not found\n`);
          }
          // Don't throw immediately - let the iteration continue to see if SDK handles it
          // But log extensively so we can diagnose
        }
        
        // Check transport state after first iteration to see if child spawned
        if (messageCount === 0 && transport) {
          process.stderr.write(`[TRANSPORT_STATE] After first iteration:\n`);
          process.stderr.write(`[TRANSPORT_STATE]   - Process exists: ${!!transport.process}\n`);
          if (transport.process) {
            process.stderr.write(`[TRANSPORT_STATE]   - Process PID: ${transport.process.pid || 'undefined'}\n`);
          }
          process.stderr.write(`[TRANSPORT_STATE]   - Exit error: ${transport.exitError || 'none'}\n`);
        }
        process.stderr.write(`[SYNC] INSIDE for-await loop - got message type: ${msg?.type}\n`);
        try {
          log('INSIDE LOOP: Generator yielded message', { 
            messageType: msg?.type, 
            messageCount: messageCount + 1,
            hasMsg: !!msg,
            msgKeys: msg ? Object.keys(msg) : []
          });
          
          if (messageCount === 0) {
            clearTimeout(timeoutWarning);
            log('FIRST MESSAGE RECEIVED', {
              type: msg?.type,
              subtype: (msg as any)?.subtype,
              hasMcpServers: !!(msg as any)?.mcp_servers,
              allKeys: msg ? Object.keys(msg) : [],
              msgPreview: msg ? JSON.stringify(msg).substring(0, 500) : 'null'
            });
          }
          messageCount++;
          
          // Check MCP server connection status from init message
          try {
            if (msg?.type === 'system' && (msg as any)?.subtype === 'init') {
              const mcpServers = (msg as any)?.mcp_servers || [];
              log('MCP server connection status', {
                serverCount: mcpServers.length,
                servers: mcpServers.map((s: any) => ({
                  name: s?.name,
                  status: s?.status,
                  error: s?.error
                }))
              });
              
              const failedServers = mcpServers.filter((s: any) => s?.status === 'failed');
              if (failedServers.length > 0) {
                log('MCP connection failures detected', {
                  failedCount: failedServers.length,
                  failedServers: failedServers.map((s: any) => ({
                    name: s?.name,
                    status: s?.status,
                    error: s?.error,
                    fullServerObject: s
                  }))
                });
              }
            }
          } catch (e) {
            log('Error processing MCP server status', { error: e instanceof Error ? e.message : String(e) });
          }
          
          // Track tool calls
          try {
            if (msg?.type === 'assistant' && msg?.message?.content) {
              for (const content of msg.message.content) {
                if (content?.type === 'tool_use') {
                  toolCalls.push({
                    name: content.name,
                    args: content.input
                  });
                  log('Tool use detected', {
                    toolName: content.name,
                    toolArgs: content.input,
                    toolId: content.id
                  });
                }
              }
            }
          } catch (e) {
            log('Error processing tool calls', { error: e instanceof Error ? e.message : String(e) });
          }
          
          // Log tool results
          try {
            if (msg?.type === 'user' && msg?.message?.content) {
              for (const content of msg.message.content) {
                if (content?.type === 'tool_result') {
                  log('Tool result received', {
                    toolName: content.name,
                    toolId: content.tool_use_id,
                    isError: content.is_error || false,
                    resultPreview: typeof content.content === 'string' 
                      ? content.content.substring(0, 500)
                      : JSON.stringify(content.content).substring(0, 500),
                    resultLength: typeof content.content === 'string'
                      ? content.content.length
                      : JSON.stringify(content.content).length
                  });
                }
              }
            }
          } catch (e) {
            log('Error processing tool results', { error: e instanceof Error ? e.message : String(e) });
          }

          // Log messages for debugging
          try {
            log('Message received', {
              type: msg?.type,
              subtype: (msg as any)?.subtype || undefined,
              hasToolUse: msg?.type === 'assistant' && msg?.message?.content?.some((c: any) => c?.type === 'tool_use')
            });
          } catch (e) {
            log('Error logging message', { error: e instanceof Error ? e.message : String(e) });
          }

          // Handle final result
          try {
            if (msg?.type === 'result') {
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
          } catch (e) {
            log('Error processing result message', { error: e instanceof Error ? e.message : String(e) });
            throw e;
          }
        } catch (loopError) {
          log('ERROR INSIDE LOOP ITERATION', {
            error: loopError instanceof Error ? loopError.message : String(loopError),
            stack: loopError instanceof Error ? loopError.stack : undefined,
            errorType: loopError instanceof Error ? loopError.constructor.name : typeof loopError,
            messageCount: messageCount
          });
          // Continue to next iteration instead of breaking
          continue;
        }
      }
      
      log('AFTER for-await: Loop completed normally', { totalMessages: messageCount });
    } catch (iterationError) {
      const errorCode = -32000; // Connection/transport error per JSON-RPC spec
      process.stderr.write(`[FATAL] ERROR IN GENERATOR ITERATION (JSON-RPC ${errorCode})\n`);
      process.stderr.write(`[FATAL] Error: ${iterationError instanceof Error ? iterationError.message : String(iterationError)}\n`);
      process.stderr.write(`[FATAL] Error type: ${iterationError instanceof Error ? iterationError.constructor.name : typeof iterationError}\n`);
      process.stderr.write(`[FATAL] Error name: ${iterationError instanceof Error ? iterationError.name : 'Unknown'}\n`);
      process.stderr.write(`[FATAL] Stack: ${iterationError instanceof Error ? iterationError.stack : 'No stack'}\n`);
      process.stderr.write(`[FATAL] Message count: ${messageCount}\n`);
      
      log('FATAL ERROR IN GENERATOR ITERATION', {
        error: iterationError instanceof Error ? iterationError.message : String(iterationError),
        stack: iterationError instanceof Error ? iterationError.stack : undefined,
        errorType: iterationError instanceof Error ? iterationError.constructor.name : typeof iterationError,
        errorName: iterationError instanceof Error ? iterationError.name : 'Unknown',
        messageCount: messageCount,
        jsonRpcErrorCode: errorCode
      });
      throw iterationError; // Re-throw to outer catch
    }

    log('After generator iteration', { messageCount, hasFinalResult: !!finalResult });
    
    if (!finalResult) {
      throw new Error('No result received from query');
    }


    log('Writing result');
    const writeStart = Date.now();
    
    // Write successful result to DynamoDB via AppSync
    if (!structuredData) {
      // If structured data is not available (e.g., permission error or non-JSON response)
      const errorMessage = finalResult || 'No structured output received';
      await writeMCPResultToTable({
        id: responseId,
        status: 'error',
        error: errorMessage,
        toolCalls: toolCalls
      });
      throw new Error(errorMessage);
    }
    
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
    if (timeoutWarning) clearTimeout(timeoutWarning);
    
    const errorCode = -32603; // Internal error per JSON-RPC spec
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Log to stderr per MCP best practices
    process.stderr.write(`[FATAL] Process failed (JSON-RPC ${errorCode})\n`);
    process.stderr.write(`[FATAL] Error: ${errorMessage}\n`);
    process.stderr.write(`[FATAL] Error type: ${error instanceof Error ? error.constructor.name : typeof error}\n`);
    process.stderr.write(`[FATAL] Stack: ${error instanceof Error ? error.stack : 'No stack'}\n`);
    process.stderr.write(`[FATAL] Response ID: ${responseId}\n`);
    
    log('Process failed', {
      message: errorMessage,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack : undefined,
      jsonRpcErrorCode: errorCode
    });
    
    try {
      await writeMCPResultToTable({
        id: responseId,
        status: 'error',
        error: errorMessage
      });
    } catch (writeError) {
      process.stderr.write(`[FATAL] Failed to write error to table: ${writeError}\n`);
    }
    
    throw error;
  }
}

export async function disconnectMCP(){
  for (const client of mcpClients.values()){
    await client.disconnect();
  }
  mcpClients.clear();
}