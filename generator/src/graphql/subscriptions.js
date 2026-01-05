/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSavedExplanation = /* GraphQL */ `
  subscription OnCreateSavedExplanation(
    $filter: ModelSubscriptionSavedExplanationFilterInput
  ) {
    onCreateSavedExplanation(filter: $filter) {
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
export const onUpdateSavedExplanation = /* GraphQL */ `
  subscription OnUpdateSavedExplanation(
    $filter: ModelSubscriptionSavedExplanationFilterInput
  ) {
    onUpdateSavedExplanation(filter: $filter) {
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
export const onDeleteSavedExplanation = /* GraphQL */ `
  subscription OnDeleteSavedExplanation(
    $filter: ModelSubscriptionSavedExplanationFilterInput
  ) {
    onDeleteSavedExplanation(filter: $filter) {
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
export const onCreateDiscardedExplanation = /* GraphQL */ `
  subscription OnCreateDiscardedExplanation(
    $filter: ModelSubscriptionDiscardedExplanationFilterInput
  ) {
    onCreateDiscardedExplanation(filter: $filter) {
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
export const onUpdateDiscardedExplanation = /* GraphQL */ `
  subscription OnUpdateDiscardedExplanation(
    $filter: ModelSubscriptionDiscardedExplanationFilterInput
  ) {
    onUpdateDiscardedExplanation(filter: $filter) {
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
export const onDeleteDiscardedExplanation = /* GraphQL */ `
  subscription OnDeleteDiscardedExplanation(
    $filter: ModelSubscriptionDiscardedExplanationFilterInput
  ) {
    onDeleteDiscardedExplanation(filter: $filter) {
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
export const onCreateQuestions = /* GraphQL */ `
  subscription OnCreateQuestions(
    $filter: ModelSubscriptionQuestionsFilterInput
  ) {
    onCreateQuestions(filter: $filter) {
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
export const onUpdateQuestions = /* GraphQL */ `
  subscription OnUpdateQuestions(
    $filter: ModelSubscriptionQuestionsFilterInput
  ) {
    onUpdateQuestions(filter: $filter) {
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
export const onDeleteQuestions = /* GraphQL */ `
  subscription OnDeleteQuestions(
    $filter: ModelSubscriptionQuestionsFilterInput
  ) {
    onDeleteQuestions(filter: $filter) {
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
export const onCreateRefinedData = /* GraphQL */ `
  subscription OnCreateRefinedData(
    $filter: ModelSubscriptionRefinedDataFilterInput
  ) {
    onCreateRefinedData(filter: $filter) {
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
export const onUpdateRefinedData = /* GraphQL */ `
  subscription OnUpdateRefinedData(
    $filter: ModelSubscriptionRefinedDataFilterInput
  ) {
    onUpdateRefinedData(filter: $filter) {
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
export const onDeleteRefinedData = /* GraphQL */ `
  subscription OnDeleteRefinedData(
    $filter: ModelSubscriptionRefinedDataFilterInput
  ) {
    onDeleteRefinedData(filter: $filter) {
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
