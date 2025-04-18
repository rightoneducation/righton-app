/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
export const onCreateDiscardedExplanation = /* GraphQL */ `
  subscription OnCreateDiscardedExplanation(
    $filter: ModelSubscriptionDiscardedExplanationFilterInput
  ) {
    onCreateDiscardedExplanation(filter: $filter) {
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
export const onUpdateDiscardedExplanation = /* GraphQL */ `
  subscription OnUpdateDiscardedExplanation(
    $filter: ModelSubscriptionDiscardedExplanationFilterInput
  ) {
    onUpdateDiscardedExplanation(filter: $filter) {
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
export const onDeleteDiscardedExplanation = /* GraphQL */ `
  subscription OnDeleteDiscardedExplanation(
    $filter: ModelSubscriptionDiscardedExplanationFilterInput
  ) {
    onDeleteDiscardedExplanation(filter: $filter) {
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
