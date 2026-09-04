export const GET_SESSION = /* GraphQL */ `
  query GetSession($id: ID!) {
    getSession(id: $id) {
      id
      classroomId
      status
      publishStatus
      pregeneratedNextSteps
      evaluationResults
    }
  }
`;

export const UPDATE_SESSION = /* GraphQL */ `
  mutation UpdateSession($input: UpdateSessionInput!) {
    updateSession(input: $input) {
      id
      status
      publishStatus
      pregeneratedNextSteps
      evaluationResults
    }
  }
`;
