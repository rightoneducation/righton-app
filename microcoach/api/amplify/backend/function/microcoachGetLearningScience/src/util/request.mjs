// create request for REST API using API key
export async function createAndSignRequest(url, apiKey ) {  
  const headers = {
    'Content-Type': 'application/json'
  };

  if (apiKey) {
    headers['x-api-key'] = apiKey;
  } else {
    console.error('WARNING: No API key available!', {
      timestamp: new Date().toISOString(),
      apiKeyExists: !!apiKey
    });
  }

  const requestConfig = {
    url,
    options: {
      method: 'GET',
      headers
    }
  };
  return requestConfig;
}