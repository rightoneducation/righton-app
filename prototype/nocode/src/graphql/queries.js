/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getStoredData = /* GraphQL */ `
  query GetStoredData($id: ID!) {
    getStoredData(id: $id) {
      id
      date
      phase1Responses
      phase2Responses
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listStoredData = /* GraphQL */ `
  query ListStoredData(
    $filter: ModelStoredDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStoredData(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        date
        phase1Responses
        phase2Responses
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
