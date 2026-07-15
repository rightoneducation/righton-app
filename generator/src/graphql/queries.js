/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSavedExplanation = /* GraphQL */ `
  query GetSavedExplanation($id: ID!) {
    getSavedExplanation(id: $id) {
      id
      question
      correctAnswer
      wrongAnswer
      genExplanation
      discardedExplanations
      version
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listSavedExplanations = /* GraphQL */ `
  query ListSavedExplanations(
    $filter: ModelSavedExplanationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSavedExplanations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        question
        correctAnswer
        wrongAnswer
        genExplanation
        discardedExplanations
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
      reason
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
        reason
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
export const getRefinedData = /* GraphQL */ `
  query GetRefinedData($id: ID!) {
    getRefinedData(id: $id) {
      id
      originalText
      targetComplexity
      pastAnalysis
      refinedText
      analysisData
      assignedComplexity
      finalReasoning
      analysisDataExplanation
      complexityMatchesTarget
      complexityMatchExplanation
      promptContent
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listRefinedData = /* GraphQL */ `
  query ListRefinedData(
    $filter: ModelRefinedDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRefinedData(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        originalText
        targetComplexity
        pastAnalysis
        refinedText
        analysisData
        assignedComplexity
        finalReasoning
        analysisDataExplanation
        complexityMatchesTarget
        complexityMatchExplanation
        promptContent
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
