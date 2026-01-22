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
    processQuery(query).catch(error => {
      console.error('[POST /mcp/query] Error processing query:', error);
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

process.on('SIGTERM', async () => {
  process.exit(0);
});

start();