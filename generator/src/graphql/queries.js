/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getQuestions = /* GraphQL */ `
  query GetQuestions($id: ID!) {
    getQuestions(id: $id) {
      id
      question
      correctAnswer
      wrongAnswers
      version
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listQuestions = /* GraphQL */ `
  query ListQuestions(
    $filter: ModelQuestionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        question
        correctAnswer
        wrongAnswers
        version
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDiscardedExplanation = /* GraphQL */ `
  query GetDiscardedExplanation($id: ID!) {
    getDiscardedExplanation(id: $id) {
      id
      question
      explanation
      discardText
      version
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listDiscardedExplanations = /* GraphQL */ `
  query ListDiscardedExplanations(
    $filter: ModelDiscardedExplanationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDiscardedExplanations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        question
        explanation
        discardText
        version
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
