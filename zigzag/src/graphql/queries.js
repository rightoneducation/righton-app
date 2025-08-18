/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
export const getDailyQuestion = /* GraphQL */ `
  query GetDailyQuestion($id: ID!) {
    getDailyQuestion(id: $id) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listDailyQuestions = /* GraphQL */ `
  query ListDailyQuestions(
    $filter: ModelDailyQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDailyQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
