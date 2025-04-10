/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createStoredData = /* GraphQL */ `
  mutation CreateStoredData(
    $input: CreateStoredDataInput!
    $condition: ModelStoredDataConditionInput
  ) {
    createStoredData(input: $input, condition: $condition) {
      id
      date
      phase1Responses
      phase2Responses
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateStoredData = /* GraphQL */ `
  mutation UpdateStoredData(
    $input: UpdateStoredDataInput!
    $condition: ModelStoredDataConditionInput
  ) {
    updateStoredData(input: $input, condition: $condition) {
      id
      date
      phase1Responses
      phase2Responses
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteStoredData = /* GraphQL */ `
  mutation DeleteStoredData(
    $input: DeleteStoredDataInput!
    $condition: ModelStoredDataConditionInput
  ) {
    deleteStoredData(input: $input, condition: $condition) {
      id
      date
      phase1Responses
      phase2Responses
      createdAt
      updatedAt
      __typename
    }
  }
`;
