import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getLearningComponentsByCCSS } from "./functions/ExternalMCPServerFunctions.js";
import { LearningScienceDataResponse } from "./types/ExternalMCPTypes.js";
import JSONLogger from "../utils/jsonLogger.js";

const logger = new JSONLogger('ext-mcp-server');

// MCP server definition with resources
export const getServer = () => {
  const server = new McpServer({
    name: "righton-mcp",
    version: "1.0.0",
  });

  //MCP tool registrations
  server.registerTool("getLearningScienceDatabyCCSS", {
    description: `Fetch learning science data and pedagogical context for a CCSS (Common Core State Standards) code. 
    Returns learning components, prerequisite standards, and related standards to help understand student struggles.
    
    Note: Question data includes a 'ccssCode' field with the complete CCSS code already constructed (e.g., '8.EE.C.8' or 'A.REI.1').`,
    inputSchema: {
      ccss: z.string().describe("Complete CCSS code from question.ccssCode field (e.g., '8.EE.C.8' or 'A.REI.1')")
    }
  }, async ({ ccss }) => {
    logger.info('tool_called', { 
      tool: 'getLearningScienceDatabyCCSS', 
      ccss 
    });
    
    const result = await getLearningComponentsByCCSS<LearningScienceDataResponse> (ccss);
    
    // Extract items from GraphQL response structure
    let learningScienceData = [];
    if (result && typeof result === 'object' && 'data' in result) {
      const responseData = result as any;
      if (responseData.data && 
          responseData.data.standardsFrameworkItems &&
          Array.isArray(responseData.data.standardsFrameworkItems)) {
        learningScienceData = responseData.data.standardsFrameworkItems;
      }
    }
    
    // Return the most recent 3 learning science data (or all if less than 3)
    const resultToReturn = learningScienceData.slice(0, 3);
    
    logger.info('tool_result', {
      tool: 'getLearningScienceDatabyCCSS',
      ccss,
      totalFound: learningScienceData.length,
      returned: resultToReturn.length
    });
    
    return {
      content: [
        {
          type: "text",
            text:
            learningScienceData.length === 0 
            ? `No learning science data found for CCSS: ${ccss}`
            : JSON.stringify(resultToReturn, null, 2)
        }
      ]
    };
  });

  return server;
}