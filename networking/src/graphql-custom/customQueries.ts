export const getGameSessionVersion = /* GraphQL */ `
  query GetGameSession($id: ID!) {
    getGameSession(id: $id) {
      id
      updatedAt
      currentState
      currentQuestionIndex
      startTime
      __typename
    }
  }
`;
