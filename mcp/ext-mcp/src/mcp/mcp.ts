import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getLearningComponentsByCCSS, exploreLearningScienceData } from "./functions/ExternalMCPServerFunctions.js";
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

  server.registerTool("exploreLearningScienceData", {
    description: `Explore the learning science database to find middle school standards (grades 6, 7, 8) with rich relationship data.
    Returns up to 'limit' standards with all their relationships including:
    - Learning components
    - BuildsTowards relationships (prerequisites and progression)
    - RelatesTo relationships (lateral connections)
    - Parent/child hierarchies
    - Curriculum materials (lessons, activities, courses)
    
    Only returns standards for grades 6, 7, and 8.
    Use this to discover which standards have the most complete data.`,
    inputSchema: {
      limit: z.number().optional().default(50).describe("Maximum number of standards to return (default: 50)")
    }
  }, async ({ limit = 50 }) => {
    logger.info('tool_called', { 
      tool: 'exploreLearningScienceData', 
      limit 
    });
    
    const result = await exploreLearningScienceData<LearningScienceDataResponse>(limit);
    
    // Extract items from GraphQL response structure
    let allStandards = [];
    if (result && typeof result === 'object' && 'data' in result) {
      const responseData = result as any;
      if (responseData.data && 
          responseData.data.standardsFrameworkItems &&
          Array.isArray(responseData.data.standardsFrameworkItems)) {
        allStandards = responseData.data.standardsFrameworkItems;
      }
    }
    
    // Filter to standards with at least one non-empty relationship
    const connectedStandards = allStandards.filter((standard: any) => {
      return (
        (standard.learningComponentssupports && standard.learningComponentssupports.length > 0) ||
        (standard.standardsFrameworkItemsbuildsTowards && standard.standardsFrameworkItemsbuildsTowards.length > 0) ||
        (standard.buildsTowardsStandardsFrameworkItems && standard.buildsTowardsStandardsFrameworkItems.length > 0) ||
        (standard.relatesToStandardsFrameworkItems && standard.relatesToStandardsFrameworkItems.length > 0) ||
        (standard.standardsFrameworkItemsrelatesTo && standard.standardsFrameworkItemsrelatesTo.length > 0) ||
        (standard.lessonshasEducationalAlignment && standard.lessonshasEducationalAlignment.length > 0) ||
        (standard.activitieshasEducationalAlignment && standard.activitieshasEducationalAlignment.length > 0) ||
        (standard.courseshasEducationalAlignment && standard.courseshasEducationalAlignment.length > 0)
      );
    });
    
    // Sort by "richness" - count total relationships
    const rankedStandards = connectedStandards.map((standard: any) => {
      const relationshipCount = 
        (standard.learningComponentssupports?.length || 0) +
        (standard.standardsFrameworkItemsbuildsTowards?.length || 0) +
        (standard.buildsTowardsStandardsFrameworkItems?.length || 0) +
        (standard.relatesToStandardsFrameworkItems?.length || 0) +
        (standard.standardsFrameworkItemsrelatesTo?.length || 0) +
        (standard.lessonshasEducationalAlignment?.length || 0) +
        (standard.activitieshasEducationalAlignment?.length || 0) +
        (standard.courseshasEducationalAlignment?.length || 0);
      
      return { ...standard, relationshipCount };
    }).sort((a: any, b: any) => b.relationshipCount - a.relationshipCount);
    
    // Return top 10 most connected
    const resultToReturn = rankedStandards.slice(0, 10);
    
    logger.info('tool_result', {
      tool: 'exploreLearningScienceData',
      totalStandards: allStandards.length,
      connectedStandards: connectedStandards.length,
      returned: resultToReturn.length
    });
    
    return {
      content: [
        {
          type: "text",
          text: connectedStandards.length === 0 
            ? `No standards found with relationship data in the first ${limit} standards.`
            : `Found ${connectedStandards.length} standards with relationship data. Top 10 most connected:\n\n${JSON.stringify(resultToReturn, null, 2)}`
        }
      ]
    };
  });

  return server;
}