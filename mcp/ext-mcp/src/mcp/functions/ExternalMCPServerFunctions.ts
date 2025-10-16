import fetch from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const API_KEY = process.env.API_KEY;

if (!GRAPHQL_ENDPOINT) {
  throw new Error('GRAPHQL_ENDPOINT environment variable is required');
}

if (!API_KEY) {
  throw new Error('Either API_KEY environment variable is required');
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

// Helper function for getting gameSessions by classroomId
export async function getLearningComponentsByCCSS<T>(ccss: string): Promise<T | null> {
  const learningScienceDataQuery = `
  {
  standardsFrameworkItems(where: { statementCode: "${ccss}" }) {
    description
    
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

  try {
    const variables = { 
      ccss
    };
    const { url, options } = await createAndSignRequest(learningScienceDataQuery, variables);
    const response = await fetch(url!, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making GraphQL request:", error);
    return null;
  }
}