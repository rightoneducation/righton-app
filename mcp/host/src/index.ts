import express from 'express';
import cors from 'cors';
import { initMCPClient, disconnectMCP, processQuery } from './mcp/functions/MCPHostFunctions.js';

// express server for handling MCP requests
// contains a series of functions for processing queries
// also contains class for MCP clients, each that manage an individual connection to a MCP servers

const app = express();
app.use(cors());
app.use(express.json());

app.post('/mcp/query', async (req, res) => {
  try{
    const result = await processQuery(req.body.query);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;

async function start() {
  await initMCPClient([{
    name: 'custom',
    url: process.env.MCP_SERVER_URL || '',
    version: '1.0.0'
  }]);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
}

process.on('SIGTERM', async () => {
  await disconnectMCP();
  process.exit(0);
});

start();