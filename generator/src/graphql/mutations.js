/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSavedExplanation = /* GraphQL */ `
  mutation CreateSavedExplanation(
    $input: CreateSavedExplanationInput!
    $condition: ModelSavedExplanationConditionInput
  ) {
    createSavedExplanation(input: $input, condition: $condition) {
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
export const updateSavedExplanation = /* GraphQL */ `
  mutation UpdateSavedExplanation(
    $input: UpdateSavedExplanationInput!
    $condition: ModelSavedExplanationConditionInput
  ) {
    updateSavedExplanation(input: $input, condition: $condition) {
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
export const deleteSavedExplanation = /* GraphQL */ `
  mutation DeleteSavedExplanation(
    $input: DeleteSavedExplanationInput!
    $condition: ModelSavedExplanationConditionInput
  ) {
    deleteSavedExplanation(input: $input, condition: $condition) {
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
export const createDiscardedExplanation = /* GraphQL */ `
  mutation CreateDiscardedExplanation(
    $input: CreateDiscardedExplanationInput!
    $condition: ModelDiscardedExplanationConditionInput
  ) {
    createDiscardedExplanation(input: $input, condition: $condition) {
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
export const updateDiscardedExplanation = /* GraphQL */ `
  mutation UpdateDiscardedExplanation(
    $input: UpdateDiscardedExplanationInput!
    $condition: ModelDiscardedExplanationConditionInput
  ) {
    updateDiscardedExplanation(input: $input, condition: $condition) {
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
export const deleteDiscardedExplanation = /* GraphQL */ `
  mutation DeleteDiscardedExplanation(
    $input: DeleteDiscardedExplanationInput!
    $condition: ModelDiscardedExplanationConditionInput
  ) {
    deleteDiscardedExplanation(input: $input, condition: $condition) {
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
