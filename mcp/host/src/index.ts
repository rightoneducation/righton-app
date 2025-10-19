import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { initMCPClient, disconnectMCP, processQuery } from './mcp/functions/MCPHostFunctions.js';
import { loadSecret } from './utils/loadSecrets.js';

const openaiSecretName = process.env.OPENAI_SECRET_NAME;
if (!openaiSecretName) throw new Error('OPENAI_SECRET_NAME environment variable is required');

const openaiSecret = await loadSecret(openaiSecretName);
process.env.OPENAI_API_KEY = JSON.parse(openaiSecret)['openai_api'];

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

app.post('/mcp/query', async (req: Request<{}, SuccessResponse | ErrorResponse, QueryRequest>, res: Response<SuccessResponse | ErrorResponse>) => {
  try {
    const { query } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid query field' });
    }
    
    const result = await processQuery(query);
    
    res.json({ result });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    res.status(500).json({ 
      error: 'Internal server error', 
      errorMessage,
      ...(errorStack && { errorStack })
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