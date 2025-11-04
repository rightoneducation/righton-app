/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMCPParsedResult = /* GraphQL */ `
  query GetMCPParsedResult($id: ID!) {
    getMCPParsedResult(id: $id) {
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listMCPParsedResults = /* GraphQL */ `
  query ListMCPParsedResults(
    $filter: ModelMCPParsedResultFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMCPParsedResults(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
