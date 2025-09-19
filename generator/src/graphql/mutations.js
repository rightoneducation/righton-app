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
export const createQuestions = /* GraphQL */ `
  mutation CreateQuestions(
    $input: CreateQuestionsInput!
    $condition: ModelQuestionsConditionInput
  ) {
    createQuestions(input: $input, condition: $condition) {
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
export const updateQuestions = /* GraphQL */ `
  mutation UpdateQuestions(
    $input: UpdateQuestionsInput!
    $condition: ModelQuestionsConditionInput
  ) {
    updateQuestions(input: $input, condition: $condition) {
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
export const deleteQuestions = /* GraphQL */ `
  mutation DeleteQuestions(
    $input: DeleteQuestionsInput!
    $condition: ModelQuestionsConditionInput
  ) {
    deleteQuestions(input: $input, condition: $condition) {
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
export const createDebug = /* GraphQL */ `
  mutation CreateDebug(
    $input: CreateDebugInput!
    $condition: ModelDebugConditionInput
  ) {
    createDebug(input: $input, condition: $condition) {
      id
      question
      debug
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateDebug = /* GraphQL */ `
  mutation UpdateDebug(
    $input: UpdateDebugInput!
    $condition: ModelDebugConditionInput
  ) {
    updateDebug(input: $input, condition: $condition) {
      id
      question
      debug
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteDebug = /* GraphQL */ `
  mutation DeleteDebug(
    $input: DeleteDebugInput!
    $condition: ModelDebugConditionInput
  ) {
    deleteDebug(input: $input, condition: $condition) {
      id
      question
      debug
      createdAt
      updatedAt
      __typename
    }
  }
`;
