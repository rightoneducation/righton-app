import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { processQuery } from './mcp/functions/MCPHostFunctions.js';
import { loadSecret } from './utils/loadSecrets.js';

console.log('[INIT] Starting MCP Host Server initialization...');

const openaiSecretName = process.env.OPENAI_SECRET_NAME;
if (!openaiSecretName) throw new Error('OPENAI_SECRET_NAME environment variable is required');
console.log('[INIT] OPENAI_SECRET_NAME:', openaiSecretName);

const openaiSecret = await loadSecret(openaiSecretName);
process.env.OPENAI_API_KEY = JSON.parse(openaiSecret)['openai_api'];
console.log('[INIT] OpenAI API key loaded:', process.env.OPENAI_API_KEY ? '✓' : '✗');

const claudeSecretName = process.env.CLAUDE_SECRET_NAME;
if(!claudeSecretName) throw new Error('CLAUDE_SECRET_NAME environment variable is required');
console.log('[INIT] CLAUDE_SECRET_NAME:', claudeSecretName);

const claudeSecret = await loadSecret(claudeSecretName);
process.env.ANTHROPIC_API_KEY = JSON.parse(claudeSecret)['claude-api'];
console.log('[INIT] Claude API key loaded:', process.env.ANTHROPIC_API_KEY ? '✓' : '✗');

const dynamoDbEndpoint = process.env.DYNAMO_DB_ENDPOINT;
if (!dynamoDbEndpoint) throw new Error('DYNAMO_DB_ENDPOINT environment variable is required');
const dynamoDbKey = process.env.DYNAMO_DB_API;
if (!dynamoDbKey) throw new Error('DYNAMO_DB_API environment variable is required');
console.log('[INIT] DynamoDB secrets configured');

const dynamoDbSecret = await loadSecret(dynamoDbEndpoint);
process.env.DYNAMO_DB_ENDPOINT = JSON.parse(dynamoDbSecret)['dynamo_db_endpoint'];

const dynamoDbKeySecret = await loadSecret(dynamoDbKey);
process.env.DYNAMO_DB_API = JSON.parse(dynamoDbKeySecret)['dynamo_db_api'];
console.log('[INIT] DynamoDB endpoint loaded:', process.env.DYNAMO_DB_ENDPOINT ? '✓' : '✗');

const externalMcpSecretName = process.env.EXTERNAL_MCP_SECRET_NAME;
if (!externalMcpSecretName) throw new Error('EXTERNAL_MCP_SECRET_NAME environment variable is required');
console.log('[INIT] EXTERNAL_MCP_SECRET_NAME:', externalMcpSecretName);

const externalMcpEndpointSecret = await loadSecret(externalMcpSecretName);
process.env.EXT_MCP_ENDPOINT = JSON.parse(externalMcpEndpointSecret)['ext-mcp-endpoint'];
process.env.EXT_MCP_USER = JSON.parse(externalMcpEndpointSecret)['ext-mcp-user'];
process.env.EXT_MCP_KEY = JSON.parse(externalMcpEndpointSecret)['ext-mcp-key'];
console.log('[INIT] External MCP Configuration:');
console.log('  - EXT_MCP_ENDPOINT:', process.env.EXT_MCP_ENDPOINT || 'NOT SET');
console.log('  - EXT_MCP_USER:', process.env.EXT_MCP_USER || 'NOT SET');
console.log('  - EXT_MCP_KEY:', process.env.EXT_MCP_KEY ? '✓' : '✗');

// express server for handling MCP requests
// contains a series of functions for processing queries
// also contains class for MCP clients, each that manage an individual connection to a MCP servers

interface QueryRequest {
  query: string;
}

interface ErrorResponse {
  error: string;
  errorMessage?: string;
  errorStack?: string;
}

interface SuccessResponse {
  result: string;
}

const app = express();
app.use(cors());
app.use(express.json());

// Keep event loop alive - prevent Node.js from exiting when async operations are pending
const keepAliveInterval = setInterval(() => {
  // This keeps the event loop active
  // Log to stderr (not stdout) for debugging per MCP best practices
  if (process.env.DEBUG_EVENT_LOOP === 'true') {
    process.stderr.write(`[EVENT_LOOP] Keep-alive tick at ${Date.now()}\n`);
  }
}, 1000);

// Monitor event loop to detect premature exits
let activeHandles = 0;
let activeRequests = 0;

const monitorInterval = setInterval(() => {
  try {
    // @ts-ignore - internal API but needed for debugging
    const handles = process._getActiveHandles ? process._getActiveHandles() : [];
    // @ts-ignore
    const requests = process._getActiveRequests ? process._getActiveRequests() : [];
    const newHandles = handles.length;
    const newRequests = requests.length;
    
    if (newHandles !== activeHandles || newRequests !== activeRequests) {
      process.stderr.write(`[EVENT_LOOP_MONITOR] Active handles: ${newHandles}, Active requests: ${newRequests}\n`);
      activeHandles = newHandles;
      activeRequests = newRequests;
    }
    
    // If event loop is about to exit (no handles/requests except our own)
    if (newHandles <= 1 && newRequests === 0) {
      process.stderr.write(`[EVENT_LOOP_WARNING] Event loop may be exiting - only ${newHandles} handles remaining\n`);
    }
  } catch (e) {
    // Ignore errors in monitoring
  }
}, 500);

// Single exit handler - clears intervals and logs
process.on('exit', (code) => {
  clearInterval(keepAliveInterval);
  clearInterval(monitorInterval);
  process.stderr.write(`[EXIT] Process exiting with code ${code}, active handles: ${activeHandles}, active requests: ${activeRequests}\n`);
  process.stderr.write(`[EXIT] Exit stack: ${new Error().stack}\n`);
});

app.get('/mcp/tools', async (req: Request, res: Response) => {
  console.log('[GET /mcp/tools] Request received');
  try {
    const { getAllTools } = await import('./mcp/functions/MCPHostFunctions.js');
    const tools = getAllTools();
    console.log('[GET /mcp/tools] Total tools found:', tools.length);
    console.log('[GET /mcp/tools] Tools by server:', 
      tools.reduce((acc, t) => {
        const server = t._server || 'unknown';
        acc[server] = (acc[server] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    );
    tools.forEach(tool => {
      console.log(`[TOOL] ${tool.function?.name || 'unnamed'} (server: ${tool._server || 'unknown'})`);
    });
    res.json({ 
      total: tools.length,
      tools: tools.map(t => ({ 
        name: t.function?.name, 
        server: t._server,
        description: t.function?.description 
      }))
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[GET /mcp/tools] Error:', errorMessage);
    res.status(500).json({ error: 'Failed to get tools', errorMessage });
  }
});

app.post('/mcp/query', async (req: Request<{}, SuccessResponse | ErrorResponse, QueryRequest>, res: Response<SuccessResponse | ErrorResponse>) => {
  console.log('[POST /mcp/query] Request received');
  try {
    const { query } = req.body;
    console.log('[POST /mcp/query] Query received, length:', query?.length || 0);
    
    if (!query || typeof query !== 'string') {
      console.error('[POST /mcp/query] Invalid query:', { query, type: typeof query });
      return res.status(400).json({ error: 'Missing or invalid query field' });
    }
    
    // Try to parse and log query details
    try {
      const parsedQuery = JSON.parse(query);
      console.log('[POST /mcp/query] Parsed query:', {
        hasQuery: !!parsedQuery.query,
        isRightOnEnabled: parsedQuery.isRightOnEnabled,
        isCZIEnabled: parsedQuery.isCZIEnabled,
        responseId: parsedQuery.responseId
      });
    } catch (e) {
      console.log('[POST /mcp/query] Query is not JSON, treating as string');
    }
    
    // Fire and forget - process in background
    console.log('[POST /mcp/query] Starting background processing...');
    
    // Wrap in Promise to ensure it doesn't cause event loop to exit
    Promise.resolve().then(async () => {
      try {
        await processQuery(query);
      } catch (error) {
        const errorCode = -32603; // Internal error per JSON-RPC spec
        process.stderr.write(`[POST /mcp/query] Error processing query (JSON-RPC ${errorCode})\n`);
        process.stderr.write(`[POST /mcp/query] Error: ${error instanceof Error ? error.message : String(error)}\n`);
        process.stderr.write(`[POST /mcp/query] Error type: ${error instanceof Error ? error.constructor.name : typeof error}\n`);
        process.stderr.write(`[POST /mcp/query] Error stack: ${error instanceof Error ? error.stack : 'No stack'}\n`);
        try {
          process.stderr.write(`[POST /mcp/query] Full error: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}\n`);
        } catch (e) {
          process.stderr.write(`[POST /mcp/query] Could not stringify error: ${e}\n`);
        }
      }
    }).catch(catchError => {
      process.stderr.write(`[POST /mcp/query] FATAL: Error in error handler itself: ${catchError}\n`);
    });
    
    // Return immediately
    console.log('[POST /mcp/query] Returning 202 Accepted');
    res.status(202).json({ result: 'Processing started' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[POST /mcp/query] Error:', errorMessage);
    
    res.status(500).json({ 
      error: 'Internal server error', 
      errorMessage
    });
  }
});

const PORT = process.env.SERVER_PORT || 3000;

async function start() {
  console.log('[START] Initializing server...');
  console.log('[START] Environment variables:');
  console.log('  - SERVER_PORT:', process.env.SERVER_PORT || '3000 (default)');
  console.log('  - MCP_SERVER_URL:', process.env.MCP_SERVER_URL || 'NOT SET');
  console.log('  - EXT_MCP_SERVER_URL:', process.env.EXT_MCP_SERVER_URL || 'NOT SET');
  app.listen(PORT, () => {
    console.log(`[START] ✓ MCP Host Server running on port ${PORT}`);
    console.log(`[START] ✓ Ready to accept requests`);
  })
}

// Catch unhandled promise rejections - use stderr per MCP best practices
process.on('unhandledRejection', (reason, promise) => {
  const errorCode = -32603; // Internal error per JSON-RPC spec
  process.stderr.write(`[FATAL] Unhandled Rejection (JSON-RPC ${errorCode})\n`);
  process.stderr.write(`[FATAL] Promise: ${String(promise)}\n`);
  process.stderr.write(`[FATAL] Reason: ${reason instanceof Error ? reason.message : String(reason)}\n`);
  process.stderr.write(`[FATAL] Reason type: ${typeof reason}\n`);
  process.stderr.write(`[FATAL] Reason constructor: ${reason instanceof Error ? reason.constructor.name : 'Not an Error'}\n`);
  process.stderr.write(`[FATAL] Stack: ${reason instanceof Error ? reason.stack : 'No stack trace'}\n`);
  try {
    process.stderr.write(`[FATAL] Full reason: ${JSON.stringify(reason, Object.getOwnPropertyNames(reason), 2)}\n`);
  } catch (e) {
    process.stderr.write(`[FATAL] Could not stringify reason: ${e}\n`);
  }
  // Don't exit - let the error handler in processQuery catch it
});

// Catch uncaught exceptions - use stderr per MCP best practices
process.on('uncaughtException', (error) => {
  const errorCode = -32603; // Internal error per JSON-RPC spec
  process.stderr.write(`[FATAL] Uncaught Exception (JSON-RPC ${errorCode})\n`);
  process.stderr.write(`[FATAL] Message: ${error.message}\n`);
  process.stderr.write(`[FATAL] Error name: ${error.name}\n`);
  process.stderr.write(`[FATAL] Error type: ${error.constructor.name}\n`);
  process.stderr.write(`[FATAL] Stack: ${error.stack}\n`);
  try {
    process.stderr.write(`[FATAL] Full error: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}\n`);
  } catch (e) {
    process.stderr.write(`[FATAL] Could not stringify error: ${e}\n`);
  }
  // Don't exit immediately - log and let the process continue
  // The container restart policy will handle it if needed
});

// Override process.exit to log when it's called - use stderr
const originalExit = process.exit;
process.exit = function(code?: number) {
  const stack = new Error().stack || 'No stack trace';
  process.stderr.write(`[FATAL] process.exit() CALLED with code ${code ?? 0}\n`);
  process.stderr.write(`[FATAL] Exit stack: ${stack}\n`);
  return originalExit.call(process, code);
};

// Remove any signal handlers installed by the Agent SDK before installing our own
// The SDK may install handlers that interfere with graceful shutdown
process.removeAllListeners('SIGINT');
process.removeAllListeners('SIGTERM');

// Signal handlers - use stderr
process.on('SIGINT', () => {
  const stack = new Error().stack || 'No stack trace';
  process.stderr.write(`[FATAL] Received SIGINT\n`);
  process.stderr.write(`[FATAL] SIGINT stack: ${stack}\n`);
  // Log process state when SIGINT is received
  try {
    // @ts-ignore - internal API
    const handles = process._getActiveHandles ? process._getActiveHandles() : [];
    // @ts-ignore
    const requests = process._getActiveRequests ? process._getActiveRequests() : [];
    process.stderr.write(`[FATAL] SIGINT received - Active handles: ${handles.length}, Active requests: ${requests.length}\n`);
  } catch (e) {
    // Ignore
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  const stack = new Error().stack || 'No stack trace';
  process.stderr.write(`[FATAL] Received SIGTERM\n`);
  process.stderr.write(`[FATAL] SIGTERM stack: ${stack}\n`);
  // Log process state when SIGTERM is received
  try {
    // @ts-ignore - internal API
    const handles = process._getActiveHandles ? process._getActiveHandles() : [];
    // @ts-ignore
    const requests = process._getActiveRequests ? process._getActiveRequests() : [];
    process.stderr.write(`[FATAL] SIGTERM received - Active handles: ${handles.length}, Active requests: ${requests.length}\n`);
    // Log what handles exist
    if (handles.length > 0) {
      process.stderr.write(`[FATAL] Active handles: ${handles.map((h: any) => h.constructor?.name || typeof h).join(', ')}\n`);
    }
  } catch (e) {
    // Ignore
  }
  // CRITICAL: Don't exit immediately - log first, then give a small delay to see if we can catch more info
  // This might help us see if there's an error happening right before SIGTERM
  setTimeout(() => {
    process.exit(0);
  }, 100);
});

// Note: SIGKILL cannot be caught - it immediately terminates the process
// Attempting to listen to it causes "uv_signal_start EINVAL" error

start();