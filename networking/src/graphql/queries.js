/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTemp = /* GraphQL */ `
  query GetTemp($id: ID!) {
    getTemp(id: $id) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTemps = /* GraphQL */ `
  query ListTemps(
    $filter: ModelTempFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTemps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
