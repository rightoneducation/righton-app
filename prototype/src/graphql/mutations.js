/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
export const createDiscardedExplanation = /* GraphQL */ `
  mutation CreateDiscardedExplanation(
    $input: CreateDiscardedExplanationInput!
    $condition: ModelDiscardedExplanationConditionInput
  ) {
    createDiscardedExplanation(input: $input, condition: $condition) {
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
export const updateDiscardedExplanation = /* GraphQL */ `
  mutation UpdateDiscardedExplanation(
    $input: UpdateDiscardedExplanationInput!
    $condition: ModelDiscardedExplanationConditionInput
  ) {
    updateDiscardedExplanation(input: $input, condition: $condition) {
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
export const deleteDiscardedExplanation = /* GraphQL */ `
  mutation DeleteDiscardedExplanation(
    $input: DeleteDiscardedExplanationInput!
    $condition: ModelDiscardedExplanationConditionInput
  ) {
    deleteDiscardedExplanation(input: $input, condition: $condition) {
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
