import 'dotenv/config.js';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { loadSecret } from './utils/loadSecrets.js';
import { getServer } from './mcp/mcp.js';

const endpointSecretName = process.env.ENDPOINT_SECRET_NAME;
if (!endpointSecretName) throw new Error('SECRET_NAME environment variable is required');

const apiSecretName = process.env.API_SECRET_NAME;
if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

const apiSecret = await loadSecret(apiSecretName);
process.env.API_KEY = JSON.parse(apiSecret)['API'];
const endpointSecret = await loadSecret(endpointSecretName);
process.env.GRAPHQL_ENDPOINT = JSON.parse(endpointSecret)['ext-endpoint'];

// server setup via express to handle get/post/delete requests
const SERVER_PORT = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 3000;
const app = express();
app.use(express.json());

// Allow CORS all domains, expose the Mcp-Session-Id header
app.use(
  cors({
      origin: '*', // Allow all origins
      exposedHeaders: ['Mcp-Session-Id']
  })
);

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// post handler function
// this uses JSON-RPC, so we will init via POST and perform all actions here as well
const postHandler = async (req: Request, res: Response) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  
  const requestMethod = req.body?.method;
  const isToolCall = requestMethod === 'tools/call';
  const isToolList = requestMethod === 'tools/list';
  
  console.log('[Ext-MCP Server] POST request received', {
    timestamp: new Date().toISOString(),
    sessionId,
    method: requestMethod,
    isToolCall,
    isToolList,
    hasBody: !!req.body,
    bodyKeys: req.body ? Object.keys(req.body) : [],
    bodyPreview: req.body ? JSON.stringify(req.body).substring(0, 1000) : 'no body'
  });
  
  if (isToolCall) {
    console.log('[Ext-MCP Server] TOOL CALL REQUEST DETECTED', {
      timestamp: new Date().toISOString(),
      sessionId,
      toolName: req.body?.params?.name,
      arguments: req.body?.params?.arguments,
      fullParams: JSON.stringify(req.body?.params)
    });
  }

  try{
    let transport: StreamableHTTPServerTransport;
        if (sessionId && transports[sessionId]) {
            // Reuse existing transport
            console.log('[Ext-MCP Server] Reusing existing transport', { sessionId, timestamp: new Date().toISOString() });
            transport = transports[sessionId];
        } else if (!sessionId && isInitializeRequest(req.body)) {
          console.log('[Ext-MCP Server] Creating new transport for initialization', { timestamp: new Date().toISOString() });
          transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: sessionId => {
                transports[sessionId] = transport;
            }
        });

        transport.onclose = () => {
          const sid = transport.sessionId;
          if (sid && transports[sid]) {
              delete transports[sid];
          }
        };

        // Connect the transport to the MCP server BEFORE handling the request
        // so responses can flow back through the same transport
        const server = getServer();
        await server.connect(transport);
        
        console.log('[Ext-MCP Server] Server connected to transport, handling request', { timestamp: new Date().toISOString() });
        await transport.handleRequest(req, res, req.body);
        console.log('[Ext-MCP Server] Request handled (new transport)', { timestamp: new Date().toISOString() });
        return; // Already handled
      } else {
        // Invalid request - no session ID or not initialization request
        console.error('[Ext-MCP Server] Invalid request - no session ID or not initialization', {
          timestamp: new Date().toISOString(),
          sessionId,
          isInitialize: isInitializeRequest(req.body),
          bodyMethod: req.body?.method
        });
        res.status(400).json({
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: 'Bad Request: No valid session ID provided'
            },
            id: null
        });
        return;
    }

      // Handle the request with existing transport - no need to reconnect
      // The existing transport is already connected to the server
      console.log('[Ext-MCP Server] Handling request with existing transport', { sessionId, timestamp: new Date().toISOString() });
      
      // Capture response to log any errors
      const originalJson = res.json.bind(res);
      res.json = function(body: any) {
        if (isToolCall) {
          console.log('[Ext-MCP Server] Tool call response', {
            timestamp: new Date().toISOString(),
            sessionId,
            hasError: !!body?.error,
            error: body?.error,
            hasResult: !!body?.result,
            resultPreview: body?.result ? JSON.stringify(body.result).substring(0, 500) : undefined
          });
        }
        return originalJson(body);
      };
      
      await transport.handleRequest(req, res, req.body);
      console.log('[Ext-MCP Server] Request handled (existing transport)', { sessionId, timestamp: new Date().toISOString() });
    } catch (error) {
        console.error('[Ext-MCP Server] Error in postHandler', {
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          sessionId,
          method: requestMethod,
          isToolCall
        });
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error',
                    data: error instanceof Error ? error.message : String(error)
                },
                id: req.body?.id || null
            });
        }
    }
};

// get handler function
// predominantly just for sse event logging
const getHandler = async (req: Request, res: Response) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }
  const lastEventId = req.headers['last-event-id'] as string | undefined;

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

// delete handler function
// used to terminate a session
const deleteHandler = async (req: Request, res: Response) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }

  try {
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  } catch (error) {
    console.error('Error handling session termination:', error);
    if (!res.headersSent) {
        res.status(500).send('Error processing session termination');
    }
  }
};

// post/get/delete handlers for server
app.post('/ext-mcp', postHandler);
app.get('/ext-mcp', getHandler);
app.delete('/ext-mcp', deleteHandler);

app.listen(SERVER_PORT, error => {
  if (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
  }
  console.log(`Ext-MCP Streamable HTTP Server listening on port ${SERVER_PORT}`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
  // Close all active transports to properly clean up resources
  for (const sessionId in transports) {
      try {
          await transports[sessionId].close();
          delete transports[sessionId];
      } catch (error) {
          console.error(`Error closing transport for session ${sessionId}:`, error);
      }
  }
  process.exit(0);
});