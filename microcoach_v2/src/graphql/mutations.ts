/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMicroCoachUser = /* GraphQL */ `
  mutation CreateMicroCoachUser(
    $input: CreateMicroCoachUserInput!
    $condition: ModelMicroCoachUserConditionInput
  ) {
    createMicroCoachUser(input: $input, condition: $condition) {
      id
      cognitoId
      email
      teacherName
      classes
      role
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateMicroCoachUser = /* GraphQL */ `
  mutation UpdateMicroCoachUser(
    $input: UpdateMicroCoachUserInput!
    $condition: ModelMicroCoachUserConditionInput
  ) {
    updateMicroCoachUser(input: $input, condition: $condition) {
      id
      cognitoId
      email
      teacherName
      classes
      role
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteMicroCoachUser = /* GraphQL */ `
  mutation DeleteMicroCoachUser(
    $input: DeleteMicroCoachUserInput!
    $condition: ModelMicroCoachUserConditionInput
  ) {
    deleteMicroCoachUser(input: $input, condition: $condition) {
      id
      cognitoId
      email
      teacherName
      classes
      role
      createdAt
      updatedAt
      __typename
    }
  }
`;
