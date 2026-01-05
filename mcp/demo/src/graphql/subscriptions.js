/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMCPParsedResult = /* GraphQL */ `
  subscription OnCreateMCPParsedResult(
    $filter: ModelSubscriptionMCPParsedResultFilterInput
  ) {
    onCreateMCPParsedResult(filter: $filter) {
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
export const onUpdateMCPParsedResult = /* GraphQL */ `
  subscription OnUpdateMCPParsedResult(
    $filter: ModelSubscriptionMCPParsedResultFilterInput
  ) {
    onUpdateMCPParsedResult(filter: $filter) {
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
export const onDeleteMCPParsedResult = /* GraphQL */ `
  subscription OnDeleteMCPParsedResult(
    $filter: ModelSubscriptionMCPParsedResultFilterInput
  ) {
    onDeleteMCPParsedResult(filter: $filter) {
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
