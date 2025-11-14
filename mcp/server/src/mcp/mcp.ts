import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ccssDictionary } from "./resources/CCSSDictionary.js";
import { referenceSchema } from "./resources/ReferenceSchema.js";
import { getGameSessionsByClassroomId, getStudentHistory } from "./functions/MCPServerFunctions.js";

// MCP server definition with resources
export const getServer = (GRAPHQL_ENDPOINT: string) => {
  const server = new McpServer({
    name: "righton-mcp",
    version: "1.0.0",
    capabilities: {
      resources: {
        "ccss": {
          "schema": "resources/CCSSDictionary.js",
          "description": "Structured Dictionary of CCSS Standards",
          "handlers": {
            "get": async () => {
              return ccssDictionary;
            }
          }
        },
        "referenceSchema": {
          "schema": "resources/referenceSchema.js",
          "description": "Reference Schema for the RightOn database",
          "handlers": {
            "get": async () => {
              return referenceSchema;
            }
          }
        }
      }
    },
  });

  //MCP tool registrations
  server.registerTool("getGameSessionsByClassroomId", {
    description: "Fetch game sessions for a classroom",
    inputSchema: {
      classroomId: z.string()
    },
    annotations: {
      category: 'game-session'
    }
  }, async ({ classroomId }) => {
    const result = await getGameSessionsByClassroomId(GRAPHQL_ENDPOINT || '', classroomId);
    
    // Extract items from GraphQL response structure
    let gameSessions = [];
    if (result && typeof result === 'object' && 'data' in result) {
      const responseData = result as any;
      if (responseData.data && 
          responseData.data.gameSessionByClassroomId && 
          responseData.data.gameSessionByClassroomId.items) {
        gameSessions = responseData.data.gameSessionByClassroomId.items;
      }
    }
    
    // Return the most recent 3 game sessions (or all if less than 3)
    const resultToReturn = gameSessions.slice(0, 3);
    
    return {
      content: [
        {
          type: "text",
          text: gameSessions.length === 0 
            ? `No game sessions found for classroom ID: ${classroomId}`
            : JSON.stringify(resultToReturn, null, 2)
        }
      ]
    };
  });

  server.registerTool("getStudentHistory", {
    description: "Fetch student history by globalStudentId",
    inputSchema: {
      globalStudentId: z.string()
    },
    annotations: {
      category: 'student-history'
    }
  }, async ({ globalStudentId }) => {
    const result = await getStudentHistory(GRAPHQL_ENDPOINT || '', globalStudentId);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  });

  return server;
}