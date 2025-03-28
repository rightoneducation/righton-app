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
