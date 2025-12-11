import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { initMCPClient, disconnectMCP, processQuery } from './mcp/functions/MCPHostFunctions.js';
import { loadSecret } from './utils/loadSecrets.js';

const openaiSecretName = process.env.OPENAI_SECRET_NAME;
if (!openaiSecretName) throw new Error('OPENAI_SECRET_NAME environment variable is required');

const openaiSecret = await loadSecret(openaiSecretName);
process.env.OPENAI_API_KEY = JSON.parse(openaiSecret)['openai_api'];

const claudeSecretName = process.env.CLAUDE_SECRET_NAME;
if(!claudeSecretName) throw new Error('CLAUDE_SECRET_NAME environment variable is required');

const claudeSecret = await loadSecret(claudeSecretName);
process.env.CLAUDE_API_KEY = JSON.parse(claudeSecret)['claude-api'];

const dynamoDbEndpoint = process.env.DYNAMO_DB_ENDPOINT;
if (!dynamoDbEndpoint) throw new Error('DYNAMO_DB_ENDPOINT environment variable is required');
const dynamoDbKey = process.env.DYNAMO_DB_API;
if (!dynamoDbKey) throw new Error('DYNAMO_DB_API environment variable is required');

const dynamoDbSecret = await loadSecret(dynamoDbEndpoint);
process.env.DYNAMO_DB_ENDPOINT = JSON.parse(dynamoDbSecret)['dynamo_db_endpoint'];

const dynamoDbKeySecret = await loadSecret(dynamoDbKey);
process.env.DYNAMO_DB_API = JSON.parse(dynamoDbKeySecret)['dynamo_db_api'];

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
  try {
    const { getAllTools } = await import('./mcp/functions/MCPHostFunctions.js');
    const tools = getAllTools();
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
    res.status(500).json({ error: 'Failed to get tools', errorMessage });
  }
});

app.post('/mcp/query', async (req: Request<{}, SuccessResponse | ErrorResponse, QueryRequest>, res: Response<SuccessResponse | ErrorResponse>) => {
  try {
    const { query } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid query field' });
    }
    
    // Fire and forget - process in background
    processQuery(query).catch(error => {
      console.error('Error processing query:', error);
    });
    
    // Return immediately
    res.status(202).json({ result: 'Processing started' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    res.status(500).json({ 
      error: 'Internal server error', 
      errorMessage
    });
  }
});

const PORT = process.env.SERVER_PORT || 3000;

async function start() {
  await initMCPClient([{
    name: 'custom',
    url: process.env.MCP_SERVER_URL || '',
    version: '1.0.0'
  },
  {
    name: 'ext',
    url: process.env.EXT_MCP_SERVER_URL || '',
    version: '1.0.0'
  }
]);

  app.listen(PORT, () => {
    console.log(`MCP Host Server running on port ${PORT}`);
  })
}

process.on('SIGTERM', async () => {
  await disconnectMCP();
  process.exit(0);
});

start();