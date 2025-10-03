import fetch from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_MOBILE_GRAPHQLAPIENDPOINTOUTPUT;
const API_KEY = process.env.API_KEY;
const COGNITO_ACCESS_TOKEN = process.env.COGNITO_ACCESS_TOKEN;

// create request for GraphQL API using API key or Cognito token
export async function createAndSignRequest(query: string, variables: any) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  // Use Cognito token if available, otherwise fall back to API key
  if (COGNITO_ACCESS_TOKEN) {
    headers['Authorization'] = COGNITO_ACCESS_TOKEN;
  } else if (API_KEY) {
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

// Helper function for making GraphQL API requests
export async function getGames<T>(url: string): Promise<T | null> {
  const listGameSessions = /* GraphQL */ `query ListGameSessions(
    $filter: ModelGameSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGameSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        gameCode
        gameId
        startTime
        phaseOneTime
        phaseTwoTime
        currentQuestionIndex
        currentState
        isAdvancedMode
        imageUrl
        description
        title
        currentTimer
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }`;

  try {
    const { url, options } = await createAndSignRequest(listGameSessions, { 
      filter: null, 
      limit: 100, 
      nextToken: null 
    });
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

// Function to get games by teacher ID
export async function getGamesByTeacherId(url: string, teacherId: string): Promise<any[]> {
  // This would need to be implemented based on your GraphQL schema
  // For now, returning empty array as placeholder
  return [];
}
