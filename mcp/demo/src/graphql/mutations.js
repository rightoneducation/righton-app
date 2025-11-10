/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMCPParsedResult = /* GraphQL */ `
  mutation CreateMCPParsedResult(
    $input: CreateMCPParsedResultInput!
    $condition: ModelMCPParsedResultConditionInput
  ) {
    createMCPParsedResult(input: $input, condition: $condition) {
      id
      status
      learningOutcomes
      students {
        name
        performance
        justification
        __typename
      }
      discussionQuestions {
        studentName
        question
        __typename
      }
      toolCalls {
        name
        args
        __typename
      }
      error
      temp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateMCPParsedResult = /* GraphQL */ `
  mutation UpdateMCPParsedResult(
    $input: UpdateMCPParsedResultInput!
    $condition: ModelMCPParsedResultConditionInput
  ) {
    updateMCPParsedResult(input: $input, condition: $condition) {
      id
      status
      learningOutcomes
      students {
        name
        performance
        justification
        __typename
      }
      discussionQuestions {
        studentName
        question
        __typename
      }
      toolCalls {
        name
        args
        __typename
      }
      error
      temp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteMCPParsedResult = /* GraphQL */ `
  mutation DeleteMCPParsedResult(
    $input: DeleteMCPParsedResultInput!
    $condition: ModelMCPParsedResultConditionInput
  ) {
    deleteMCPParsedResult(input: $input, condition: $condition) {
      id
      status
      learningOutcomes
      students {
        name
        performance
        justification
        __typename
      }
      discussionQuestions {
        studentName
        question
        __typename
      }
      toolCalls {
        name
        args
        __typename
      }
      error
      temp
      createdAt
      updatedAt
      __typename
    }
  }
`;
