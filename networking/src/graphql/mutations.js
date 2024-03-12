/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTemp = /* GraphQL */ `
  mutation CreateTemp(
    $input: CreateTempInput!
    $condition: ModelTempConditionInput
  ) {
    createTemp(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTemp = /* GraphQL */ `
  mutation UpdateTemp(
    $input: UpdateTempInput!
    $condition: ModelTempConditionInput
  ) {
    updateTemp(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTemp = /* GraphQL */ `
  mutation DeleteTemp(
    $input: DeleteTempInput!
    $condition: ModelTempConditionInput
  ) {
    deleteTemp(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
