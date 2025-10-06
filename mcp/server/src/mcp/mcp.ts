import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ccssDictionary } from "./resources/CCSSDictionary";
import { referenceSchema } from "./resources/ReferenceSchema";
import { getGameSessionsByClassroomId, getStudentHistory } from "./functions/HelperFunctions";

// MCP server definition with resources
export const getServer = (GRAPHQL_ENDPOINT: string) => {
  const server = new McpServer({
    name: "righton-mcp",
    version: "1.0.0",
    capabilities: {
      resources: {
        "ccss": {
          "schema": "resources/CCSSDictionary.ts",
          "description": "Structured Dictionary of CCSS Standards",
          "handlers": {
            "get": async () => {
              return ccssDictionary;
            }
          }
        },
        "referenceSchema": {
          "schema": "resources/referenceSchema.ts",
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
  server.tool(
    "getGameSessionsByClassroomId",
    {
      description: "Fetch game sessions for a classroom",
      inputSchema: z.object({ classroomId: z.string() })
    },
    async ({ classroomId }) => {
      const result = await getGameSessionsByClassroomId(GRAPHQL_ENDPOINT || '', classroomId);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }
  );

  server.tool(
    "getStudentHistory",
    {
      description: "Fetch student history by globalStudentId",
      inputSchema: z.object({ globalStudentId: z.string() })
    },
    async ({ globalStudentId }) => {
      const result = await getStudentHistory(GRAPHQL_ENDPOINT || '', globalStudentId);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }
  );

  return server;
}