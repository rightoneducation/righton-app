import fetch from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const API_KEY = process.env.API_KEY;
const COGNITO_ACCESS_TOKEN = process.env.COGNITO_ACCESS_TOKEN;

if (!GRAPHQL_ENDPOINT) {
  throw new Error('GRAPHQL_ENDPOINT environment variable is required');
}

if (!API_KEY && !COGNITO_ACCESS_TOKEN) {
  throw new Error('Either API_KEY or COGNITO_ACCESS_TOKEN environment variable is required');
}

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
    const { url, options } = await createAndSignRequest(gameSessionByClassroomId, variables);
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
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making GraphQL request:", error);
    return null;
  }
}



