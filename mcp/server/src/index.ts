import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getGames, getGamesByTeacherId } from "./RightOnFunctions.js";

const GRAPHQL_ENDPOINT = process.env.API_MOBILE_GRAPHQLAPIENDPOINTOUTPUT;

// aws stuff for querying the graphql api

// register server
const server = new McpServer({
  name: "righton-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {
      "games": {
        "schema": "resources/schema.graphql",
        "description": "Game sessions from the RightOn database",
        "handlers": {
          "get": async (id: string) => {
            const games = await getGames(GRAPHQL_ENDPOINT || '');
            // Find specific game by ID
            if (games && typeof games === 'object' && 'data' in games) {
              const gameItems = (games as any).data?.listGameSessions?.items;
              const game = gameItems?.find((g: any) => g.id === id);
              return game || null;
            }
            return null;
          }
        }
      }
    },
    tools: {},
  },
});

// pseudo-code function to identify struggling students
async function identifyStrugglingStudents(teacherId: string) {
  const games = await getGamesByTeacherId(GRAPHQL_ENDPOINT || '', teacherId);
  
  // idea here would be to pull down some student data and then analyze it to id issues
  // we could then return a list of students with issues
  // and recommend games to play to help them improve
  
  // struggling students could be those with < 50% accuracy
  const studentsWithWrongAnswers = games.filter((game: any) => game.accuracy < 50);
  const strugglingStudents = studentsWithWrongAnswers.map((game: any) => game.studentId);
  
  return strugglingStudents;
}

server.tool("getGames", async () => {
  const result = await getGames(GRAPHQL_ENDPOINT || '');
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2)
      }
    ]
  };
});

server.tool("identifyStrugglingStudents", async () => {
  // This would need to get teacherId from the request parameters
  const teacherId = "example-teacher-id"; // In real implementation, get from request
  const result = await identifyStrugglingStudents(teacherId);
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2)
      }
    ]
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});