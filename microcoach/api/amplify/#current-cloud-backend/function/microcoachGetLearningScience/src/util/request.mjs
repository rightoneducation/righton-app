// create request for GraphQL API using API key or Cognito token
export async function createAndSignRequest(query, variables, apiKey, graphqlEndpoint) {
  console.log('[Ext-MCPServerFunctions] createAndSignRequest called', {
    timestamp: new Date().toISOString(),
    queryName: query.substring(0, 100).replace(/\s+/g, ' '),
    variables: JSON.stringify(variables),
    hasAPIKey: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    graphQLEndpoint: graphqlEndpoint || 'NOT SET',
    endpointLength: graphqlEndpoint?.length || 0
  });
  
  const headers = {
    'Content-Type': 'application/json'
  };

  if (apiKey) {
    headers['x-api-key'] = apiKey;
    console.log('Using API key for authentication', {
      timestamp: new Date().toISOString(),
      keyPrefix: apiKey.substring(0, 10) + '...',
      keyLength: apiKey.length
    });
  } else {
    console.error('WARNING: No API key available!', {
      timestamp: new Date().toISOString(),
      apiKeyExists: !!apiKey
    });
  }

  const requestConfig = {
    url: graphqlEndpoint,
    options: {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables })
    }
  };
  
  console.log('Request configuration', {
    timestamp: new Date().toISOString(),
    url: requestConfig.url,
    method: requestConfig.options.method,
    headers: Object.keys(requestConfig.options.headers),
    bodyLength: requestConfig.options.body.length,
    headerKeys: Object.keys(headers)
  });

  return requestConfig;
}