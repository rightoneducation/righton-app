import { loadSecret } from './util/loadsecrets.mjs';
import { getLearningComponentsByCCSS } from './util/request.mjs';

export const handler = async (event) => {
    const endpointSecretName = process.env.ENDPOINT_SECRET_NAME;
    if (!endpointSecretName) throw new Error('SECRET_NAME environment variable is required');
    const apiSecretName = process.env.API_SECRET_NAME;
    if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');
    
    const apiSecret = await loadSecret(apiSecretName);
    process.env.API_KEY = JSON.parse(apiSecret)['API'];
    const endpointSecret = await loadSecret(endpointSecretName);
    process.env.GRAPHQL_ENDPOINT = JSON.parse(endpointSecret)['ext-endpoint'];

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
      
      const { url: requestUrl, options } = await createAndSignRequest(learningScienceDataQuery, variables, apiKey, graphqlEndpoint);
      
      console.log('[Ext-MCPServerFunctions] Making fetch request', {
        timestamp: new Date().toISOString(),
        url: requestUrl,
        method: options.method,
        hasAPIKeyHeader: !!options.headers['x-api-key'],
        headerCount: Object.keys(options.headers).length
      });
      
      const response = await fetch(requestUrl, options);
      
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
      
      const data = await response.json();
      
      console.log('[Ext-MCPServerFunctions] GraphQL response parsed', {
        timestamp: new Date().toISOString(),
        hasData: !!data?.data,
        hasErrors: !!data?.errors,
        errors: data?.errors,
        dataKeys: data ? Object.keys(data) : [],
        responsePreview: JSON.stringify(data).substring(0, 500)
      });
      
      if (data?.errors) {
        console.error('GraphQL errors in response', {
          timestamp: new Date().toISOString(),
          errors: data.errors,
          errorCount: Array.isArray(data.errors) ? data.errors.length : 0
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error making GraphQL request', {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        ccss,
        url: getGraphQLEndpoint() || 'NOT PROVIDED'
      });
      return null;
    }
}