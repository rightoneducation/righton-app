import fetch from 'node-fetch';
import JSONLogger from '../../utils/jsonLogger.js';

const logger = new JSONLogger('ext-mcp-server');
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const API_KEY = process.env.API_KEY;
const SECRET_NAME = process.env.SECRET_NAME;

if (!GRAPHQL_ENDPOINT) {
  throw new Error('GRAPHQL_ENDPOINT environment variable is required');
}

if (!API_KEY) {
  throw new Error('Either API_KEY environment variable is required');
}

if (!SECRET_NAME) {
  throw new Error('SECRET_NAME environment variable is required');
}

// create request for GraphQL API using API key or Cognito token
export async function createAndSignRequest(query: string, variables: any) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (API_KEY) {
    headers['x-api-key'] = API_KEY;
  }

  return {
    url: GRAPHQL_ENDPOINT,
    options: {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables })
    }
  };
}

// Normalize CCSS code to match database format
function normalizeCCSSCode(ccss: string): string[] {
  logger.info('normalize_ccss_input', { input: ccss });
  
  // Remove any "CCSS.Math.Content." prefix if present
  let code = ccss.replace(/^CCSS\.Math\.Content\./, '');
  
  // Check if it's a high school code (starts with letter like A-REI, F-IF, etc.)
  const hsPattern = /^([A-Z]+)[.\-](.+)$/;
  const hsMatch = code.match(hsPattern);
  
  if (hsMatch) {
    // High school: format is domain-cluster.standard (e.g., A-REI.1)
    // Replace only the FIRST dot with hyphen, keep remaining dots
    const firstDotIndex = code.indexOf('.');
    if (firstDotIndex > 0) {
      const normalized = code.substring(0, firstDotIndex) + '-' + code.substring(firstDotIndex + 1);
      const result = [
        normalized,
        `CCSS.Math.Content.HS${normalized}`  // Also try full format
      ];
      logger.info('normalize_ccss_hs_pattern', { input: ccss, output: result });
      return result;
    }
  }
  
  // Check if it's already in grade.domain.cluster.standard format (e.g., 8.EE.8.a)
  if (/^\d+\./.test(code)) {
    logger.info('normalize_ccss_already_correct', { input: ccss, output: [code] });
    return [code];
  }
  
  // Otherwise, it might be domain.cluster.standard (e.g., EE.C.8)
  // We need to try common grades (6, 7, 8 for middle school)
  const domainPattern = /^([A-Z]+)\.(.+)$/;
  const domainMatch = code.match(domainPattern);
  
  if (domainMatch) {
    const domain = domainMatch[1];
    const rest = domainMatch[2];
    
    // Try grades 6, 7, 8 (most common for domains like EE, NS, SP, etc.)
    const result = [
      `6.${domain}.${rest}`,
      `7.${domain}.${rest}`,
      `8.${domain}.${rest}`,
      code  // Also try original in case it's correct
    ];
    logger.info('normalize_ccss_domain_pattern', { input: ccss, domain, rest, output: result });
    return result;
  }
  
  // Return original if we can't parse it
  logger.info('normalize_ccss_no_pattern', { input: ccss, output: [code] });
  return [code];
}

// Helper function for getting gameSessions by classroomId
export async function getLearningComponentsByCCSS<T>(ccss: string): Promise<T | null> {
  const possibleCodes = normalizeCCSSCode(ccss);
  
  // Build OR condition for all possible code formats
  const whereConditions = possibleCodes
    .map(code => `{ statementCode: "${code}" }`)
    .join(', ');
  
  const learningScienceDataQuery = `
  {
  standardsFrameworkItems(where: { 
    AND: [
      { OR: [${whereConditions}] },
      { statementType: "Standard" }
    ]
  }) {
    statementCode
    description
    statementType
    
    # Learning science context
    learningComponentssupports {
      description
    }
    
    # Prerequisites to check against student history
    standardsFrameworkItemsbuildsTowards {
      statementCode
      description
    }
    
    # Related standards to assess if struggle is broad or narrow
    relatesToStandardsFrameworkItems {
      statementCode
      description
    }
  }
}`;

  logger.info('graphql_query_executing', { query: learningScienceDataQuery });

  try {
    const variables = { 
      ccss
    };
    const { url, options } = await createAndSignRequest(learningScienceDataQuery, variables);
    const response = await fetch(url!, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json() as T;
    logger.info('graphql_response_received', { result });
    return result;
  } catch (error) {
    logger.error('graphql_request_error', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    return null;
  }
}