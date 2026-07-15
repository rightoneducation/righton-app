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
    console.log('[MCP Server] getGameSessionsByClassroomId called', {
      timestamp: new Date().toISOString(),
      classroomId,
      graphQLEndpoint: GRAPHQL_ENDPOINT || 'NOT SET',
      endpointLength: GRAPHQL_ENDPOINT?.length || 0
    });
    const result = await getGameSessionsByClassroomId(GRAPHQL_ENDPOINT || '', classroomId);
    
    console.log('[MCP Server] getGameSessionsByClassroomId result received', {
      timestamp: new Date().toISOString(),
      classroomId,
      resultType: typeof result,
      hasData: result && typeof result === 'object' && 'data' in result,
      resultKeys: result && typeof result === 'object' ? Object.keys(result) : [],
      resultPreview: result ? JSON.stringify(result).substring(0, 500) : 'null'
    });
    
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
    
    // Sort by createdAt descending (most recent first)
    gameSessions.sort((a: any, b: any) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime; // Descending order
    });
    
    // Log all game session IDs and their creation dates for debugging
    const sessionDetails = gameSessions.map((gs: any) => ({
      id: gs.id,
      title: gs.title,
      createdAt: gs.createdAt,
      currentState: gs.currentState,
      hasTeams: gs.teams?.items?.length > 0
    }));
    
    console.log('[MCP Server] getGameSessionsByClassroomId processed', {
      timestamp: new Date().toISOString(),
      classroomId,
      gameSessionsCount: gameSessions.length,
      returningCount: Math.min(gameSessions.length, 3),
      allSessionIds: gameSessions.map((gs: any) => gs.id),
      sessionDetails: sessionDetails
    });
    
    // Return the most recent 3 game sessions (or all if less than 3)
    const resultToReturn = gameSessions.slice(0, 3);
    
    console.log('[MCP Server] Returning game sessions', {
      timestamp: new Date().toISOString(),
      classroomId,
      returningIds: resultToReturn.map((gs: any) => gs.id),
      returningTitles: resultToReturn.map((gs: any) => gs.title),
      returningCreatedAt: resultToReturn.map((gs: any) => gs.createdAt)
    });
    
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