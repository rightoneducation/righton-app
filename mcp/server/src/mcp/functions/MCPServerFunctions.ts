import fetch from 'node-fetch';

// Get functions for environment variables, to ensure they load after secrets are loaded
const getGraphQLEndpoint = () => process.env.GRAPHQL_ENDPOINT!;
const getAPIKey = () => process.env.API_KEY;
const getCognitoToken = () => process.env.COGNITO_ACCESS_TOKEN;

// Construct CCSS code from question fields
function constructCCSSCode(question: any): string | null {
  if (!question) return null;
  
  // Collect non-null/non-empty values in order: grade, domain, cluster, standard
  const parts: string[] = [];
  
  if (question.grade && question.grade !== 'null' && question.grade !== '<empty>') {
    parts.push(question.grade);
  }
  if (question.domain && question.domain !== 'null' && question.domain !== '<empty>') {
    parts.push(question.domain);
  }
  if (question.cluster && question.cluster !== 'null' && question.cluster !== '<empty>') {
    parts.push(question.cluster);
  }
  if (question.standard && question.standard !== 'null' && question.standard !== '<empty>') {
    parts.push(question.standard);
  }
  
  // Only return a code if we have at least grade + domain (minimum useful CCSS code)
  // Don't return incomplete codes like just "NS" or just "8"
  const hasGrade = question.grade && question.grade !== 'null' && question.grade !== '<empty>';
  const hasDomain = question.domain && question.domain !== 'null' && question.domain !== '<empty>';
  
  if (hasGrade && hasDomain && parts.length >= 2) {
    return parts.join('.');
  }
  
  return null;
}

// Add CCSS codes to questions in the response
function enrichWithCCSSCodes(data: any): any {
  if (!data) return data;
  
  // Handle game session response
  if (data.gameSessionByClassroomId?.items) {
    data.gameSessionByClassroomId.items.forEach((session: any) => {
      // Add CCSS to questions array
      if (session.questions?.items) {
        session.questions.items.forEach((question: any) => {
          question.ccssCode = constructCCSSCode(question);
        });
      }
      
      // Add CCSS to team questions
      if (session.teams?.items) {
        session.teams.items.forEach((team: any) => {
          if (team.question) {
            team.question.ccssCode = constructCCSSCode(team.question);
          }
        });
      }
    });
  }
  
  // Handle student history response
  if (data.teamByGlobalStudentId?.items) {
    data.teamByGlobalStudentId.items.forEach((team: any) => {
      if (team.question) {
        team.question.ccssCode = constructCCSSCode(team.question);
      }
    });
  }
  
  return data;
}

// create request for GraphQL API using API key or Cognito token
export async function createAndSignRequest(query: string, variables: any) {
  console.log('[MCPServerFunctions] createAndSignRequest called', {
    timestamp: new Date().toISOString(),
    queryName: query.substring(0, 100).replace(/\s+/g, ' '),
    variables: JSON.stringify(variables),
    hasCognitoToken: !!getCognitoToken(),
    hasAPIKey: !!getAPIKey(),
    cognitoTokenLength: getCognitoToken()?.length || 0,
    apiKeyLength: getAPIKey()?.length || 0,
    graphQLEndpoint: getGraphQLEndpoint() || 'NOT SET',
    endpointLength: getGraphQLEndpoint()?.length || 0
  });
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  const cognitoToken = getCognitoToken();
  const apiKey = getAPIKey();
  // Use Cognito token if available, otherwise fall back to API key
  if (cognitoToken) {
    headers['Authorization'] = cognitoToken;
    console.log('[MCPServerFunctions] Using Cognito token for authentication', {
      timestamp: new Date().toISOString(),
      tokenPrefix: cognitoToken.substring(0, 20) + '...',
      tokenLength: cognitoToken.length
    });
  } else if (apiKey) {
    headers['x-api-key'] = apiKey;
    console.log('[MCPServerFunctions] Using API key for authentication', {
      timestamp: new Date().toISOString(),
      keyPrefix: apiKey.substring(0, 10) + '...',
      keyLength: apiKey.length
    });
  } else {
    console.error('[MCPServerFunctions] WARNING: No authentication method available!', {
      timestamp: new Date().toISOString(),
      cognitoTokenExists: !!cognitoToken,
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
  
  console.log('[MCPServerFunctions] Request configuration', {
    timestamp: new Date().toISOString(),
    url: requestConfig.url,
    method: requestConfig.options.method,
    headers: Object.keys(requestConfig.options.headers),
    bodyLength: requestConfig.options.body.length,
    headerKeys: Object.keys(headers)
  });

  return requestConfig;
}

// Helper function for getting gameSessions by classroomId
export async function getGameSessionsByClassroomId<T>(url: string, classroomId: string): Promise<T | null> {
  const gameSessionByClassroomId = /* GraphQL */ `
  query GameSessionByClassroomId(
    $classroomId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelGameSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    gameSessionByClassroomId(
      classroomId: $classroomId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomId
        gameId
        startTime
        phaseOneTime
        phaseTwoTime
        teams {
          items {
            id
            globalStudentId
            name
            question {
              id
              text
              choices
              answerSettings
              answerData
              hints
              imageUrl
              instructions
              standard
              cluster
              domain
              grade
              order
              isConfidenceEnabled
              isShortAnswerEnabled
              isHintEnabled
              gameSessionId
              __typename
            }
            teamMembers {
              items {
                id
                isFacilitator
                answers {
                  items {
                    id
                    isCorrect
                    isSubmitted
                    isShortAnswerEnabled
                    currentState
                    currentQuestionIndex
                    questionId
                    teamMemberAnswersId
                    teamAnswersId
                    teamName
                    text
                    answer
                    confidenceLevel
                    hint
                    createdAt
                    updatedAt
                    __typename
                  }
                  nextToken
                  __typename
                }
                deviceId
                createdAt
                updatedAt
                teamTeamMembersId
                __typename
              }
              nextToken
              __typename
            }
            score
            selectedAvatarIndex
            createdAt
            updatedAt
            gameSessionTeamsId
            teamQuestionId
            teamQuestionOrder
            teamQuestionGameSessionId
            __typename
          }
          nextToken
          __typename
        }
        currentQuestionIndex
        currentState
        gameCode
        isAdvancedMode
        imageUrl
        description
        title
        currentTimer
        sessionData
        questions {
          items {
            id
            text
            choices
            answerSettings
            answerData
            hints
            imageUrl
            instructions
            standard
            cluster
            domain
            grade
            order
            isConfidenceEnabled
            isShortAnswerEnabled
            isHintEnabled
            gameSessionId
            __typename
          }
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

  try {
    const variables = { 
      classroomId, 
      filter: null,
      limit: 100, 
      nextToken: null
    };
    console.log('[MCPServerFunctions] getGameSessionsByClassroomId starting request', {
      timestamp: new Date().toISOString(),
      classroomId,
      limit: 100,
      url: url || 'NOT PROVIDED'
    });
    
    const { url: requestUrl, options } = await createAndSignRequest(gameSessionByClassroomId, variables);
    
    console.log('[MCPServerFunctions] Making fetch request', {
      timestamp: new Date().toISOString(),
      url: requestUrl,
      method: options.method,
      hasAuthHeader: !!options.headers['Authorization'],
      hasAPIKeyHeader: !!options.headers['x-api-key'],
      headerCount: Object.keys(options.headers).length
    });
    
    const response = await fetch(requestUrl!, options);
    
    console.log('[MCPServerFunctions] Fetch response received', {
      timestamp: new Date().toISOString(),
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[MCPServerFunctions] HTTP error response', {
        timestamp: new Date().toISOString(),
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText.substring(0, 1000)
      });
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText.substring(0, 500)}`);
    }
    
    const data = await response.json() as any;
    
    console.log('[MCPServerFunctions] GraphQL response parsed', {
      timestamp: new Date().toISOString(),
      hasData: !!data?.data,
      hasErrors: !!data?.errors,
      errors: data?.errors,
      dataKeys: data ? Object.keys(data) : [],
      responsePreview: JSON.stringify(data).substring(0, 500)
    });
    
    if (data?.errors) {
      console.error('[MCPServerFunctions] GraphQL errors in response', {
        timestamp: new Date().toISOString(),
        errors: data.errors,
        errorCount: Array.isArray(data.errors) ? data.errors.length : 0
      });
    }
    
    return enrichWithCCSSCodes(data) as T;
  } catch (error) {
    console.error('[MCPServerFunctions] Error making GraphQL request', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      classroomId,
      url: url || 'NOT PROVIDED'
    });
    return null;
  }
}


// Helper function for getting gameSessions by classroomId
export async function getStudentHistory<T>(url: string, globalStudentId: string): Promise<T | null> {
  const teamByGlobalStudentId = /* GraphQL */ `
  query TeamByGlobalStudentId(
    $globalStudentId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelTeamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamByGlobalStudentId(
      globalStudentId: $globalStudentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        globalStudentId
        name
        question {
          id
          text
          choices
          answerSettings
          answerData
          hints
          imageUrl
          instructions
          standard
          cluster
          domain
          grade
          order
          isConfidenceEnabled
          isShortAnswerEnabled
          isHintEnabled
          gameSessionId
          __typename
        }
        teamMembers {
          items {
            id
            isFacilitator
            answers {
              items {
                id
                isCorrect
                isSubmitted
                isShortAnswerEnabled
                currentState
                currentQuestionIndex
                questionId
                teamMemberAnswersId
                teamAnswersId
                teamName
                text
                answer
                confidenceLevel
                hint
                createdAt
                updatedAt
                __typename
              }
              nextToken
              __typename
            }
            deviceId
            createdAt
            updatedAt
            teamTeamMembersId
            __typename
          }
          nextToken
          __typename
        }
        score
        selectedAvatarIndex
        createdAt
        updatedAt
        gameSessionTeamsId
        teamQuestionId
        teamQuestionOrder
        teamQuestionGameSessionId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
  try {
    const { url, options } = await createAndSignRequest(teamByGlobalStudentId, { 
      globalStudentId, 
      filter: null, 
      limit: 100, 
      nextToken: null 
    });
        const response = await fetch(url!, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return enrichWithCCSSCodes(data) as T;
  } catch (error) {
    console.error("Error making GraphQL request:", error);
    return null;
  }
}



