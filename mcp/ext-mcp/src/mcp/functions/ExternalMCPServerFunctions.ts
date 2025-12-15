import fetch from 'node-fetch';

const getGraphQLEndpoint = () => process.env.GRAPHQL_ENDPOINT!;
const getAPIKey = () => process.env.API_KEY;

// create request for GraphQL API using API key or Cognito token
export async function createAndSignRequest(query: string, variables: any) {
  console.log('[Ext-MCPServerFunctions] createAndSignRequest called', {
    timestamp: new Date().toISOString(),
    queryName: query.substring(0, 100).replace(/\s+/g, ' '),
    variables: JSON.stringify(variables),
    hasAPIKey: !!getAPIKey(),
    apiKeyLength: getAPIKey()?.length || 0,
    graphQLEndpoint: getGraphQLEndpoint() || 'NOT SET',
    endpointLength: getGraphQLEndpoint()?.length || 0
  });
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  const apiKey = getAPIKey();
  if (apiKey) {
    headers['x-api-key'] = apiKey;
    console.log('[Ext-MCPServerFunctions] Using API key for authentication', {
      timestamp: new Date().toISOString(),
      keyPrefix: apiKey.substring(0, 10) + '...',
      keyLength: apiKey.length
    });
  } else {
    console.error('[Ext-MCPServerFunctions] WARNING: No API key available!', {
      timestamp: new Date().toISOString(),
      apiKeyExists: !!apiKey
    });
  }

  const requestConfig = {
    url: getGraphQLEndpoint(),
    options: {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables })
    }
  };
  
  console.log('[Ext-MCPServerFunctions] Request configuration', {
    timestamp: new Date().toISOString(),
    url: requestConfig.url,
    method: requestConfig.options.method,
    headers: Object.keys(requestConfig.options.headers),
    bodyLength: requestConfig.options.body.length,
    headerKeys: Object.keys(headers)
  });

  return requestConfig;
}

// Normalize CCSS code to match database format
function normalizeCCSSCode(ccss: string): string[] {
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
      return result;
    }
  }
  
  // Check if it's already in grade.domain.cluster.standard format (e.g., 8.EE.8.a)
  if (/^\d+\./.test(code)) {
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
    return result;
  }
  
  // Return original if we can't parse it
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
  standardsFrameworkItems(
    where: {
      AND: [
        { OR: [${whereConditions}] },
        { jurisdiction: "Multi-State" },
        { statementType: "Standard" }
      ]
    }
  ) {
    identifier
    statementCode
    description
    standardsFrameworkItemsbuildsTowards {
      identifier
      statementCode
      description
    }
    buildsTowardsStandardsFrameworkItems {
      identifier
      statementCode
      description
    }
    standardsFrameworkItemshasChild {
      identifier
      statementCode
      description
    }
    standardsFrameworkItemsrelatesTo {
      identifier
      statementCode
      description
    }
    learningComponentssupports {
      identifier
      description
    }
  }
}
`;

  try {
    const variables = { 
      ccss
    };
    console.log('[Ext-MCPServerFunctions] getLearningComponentsByCCSS starting request', {
      timestamp: new Date().toISOString(),
      ccss,
      normalizedCodes: normalizeCCSSCode(ccss),
      url: getGraphQLEndpoint() || 'NOT PROVIDED'
    });
    
    const { url: requestUrl, options } = await createAndSignRequest(learningScienceDataQuery, variables);
    
    console.log('[Ext-MCPServerFunctions] Making fetch request', {
      timestamp: new Date().toISOString(),
      url: requestUrl,
      method: options.method,
      hasAPIKeyHeader: !!options.headers['x-api-key'],
      headerCount: Object.keys(options.headers).length
    });
    
    const response = await fetch(requestUrl!, options);
    
    console.log('[Ext-MCPServerFunctions] Fetch response received', {
      timestamp: new Date().toISOString(),
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Ext-MCPServerFunctions] HTTP error response', {
        timestamp: new Date().toISOString(),
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText.substring(0, 1000)
      });
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText.substring(0, 500)}`);
    }
    
    const data = await response.json() as any;
    
    console.log('[Ext-MCPServerFunctions] GraphQL response parsed', {
      timestamp: new Date().toISOString(),
      hasData: !!data?.data,
      hasErrors: !!data?.errors,
      errors: data?.errors,
      dataKeys: data ? Object.keys(data) : [],
      responsePreview: JSON.stringify(data).substring(0, 500)
    });
    
    if (data?.errors) {
      console.error('[Ext-MCPServerFunctions] GraphQL errors in response', {
        timestamp: new Date().toISOString(),
        errors: data.errors,
        errorCount: Array.isArray(data.errors) ? data.errors.length : 0
      });
    }
    
    return data as T;
  } catch (error) {
    console.error('[Ext-MCPServerFunctions] Error making GraphQL request', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ccss,
      url: getGraphQLEndpoint() || 'NOT PROVIDED'
    });
    return null;
  }
}

// Explore standards with rich relationship data
export async function exploreLearningScienceData<T>(limit: number = 50): Promise<T | null> {
  const exploreQuery = `
  {
  standardsFrameworkItems(
    where: { 
      AND: [
        { statementType: "Standard" },
        { OR: [
          { gradeLevel_INCLUDES: "6" },
          { gradeLevel_INCLUDES: "7" },
          { gradeLevel_INCLUDES: "8" }
        ]}
      ]
    }
    options: { limit: ${limit} }
  ) {
    statementCode
    description
    statementType
    gradeLevel
    
    # Learning science context
    learningComponentssupports {
      description
      identifier
    }
    
    # What builds TO this standard (prerequisites - incoming)
    standardsFrameworkItemsbuildsTowards {
      statementCode
      description
    }
    
    # What this standard builds TOWARDS (next steps - outgoing)
    buildsTowardsStandardsFrameworkItems {
      statementCode
      description
    }
    
    # Related standards (outgoing)
    relatesToStandardsFrameworkItems {
      statementCode
      description
    }
    
    # Related standards (incoming)
    standardsFrameworkItemsrelatesTo {
      statementCode
      description
    }
    
    # Parent/child (outgoing)
    hasChildStandardsFrameworkItems {
      statementCode
      description
    }
    
    # Parent/child (incoming)
    standardsFrameworkItemshasChild {
      statementCode
      description
    }
    
    # Educational materials using this standard
    lessonshasEducationalAlignment {
      name
      identifier
    }
    
    activitieshasEducationalAlignment {
      name
      identifier
    }
    
    courseshasEducationalAlignment {
      name
      identifier
    }
  }
}`;

  try {
    const variables = {};
    const { url, options } = await createAndSignRequest(exploreQuery, variables);
    const response = await fetch(url!, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json() as T;
    return result;
  } catch (error) {
    return null;
  }
}