/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMicroCoachUser = /* GraphQL */ `
  subscription OnCreateMicroCoachUser(
    $filter: ModelSubscriptionMicroCoachUserFilterInput
    $cognitoId: String
  ) {
    onCreateMicroCoachUser(filter: $filter, cognitoId: $cognitoId) {
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
export const onUpdateMicroCoachUser = /* GraphQL */ `
  subscription OnUpdateMicroCoachUser(
    $filter: ModelSubscriptionMicroCoachUserFilterInput
    $cognitoId: String
  ) {
    onUpdateMicroCoachUser(filter: $filter, cognitoId: $cognitoId) {
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
export const onDeleteMicroCoachUser = /* GraphQL */ `
  subscription OnDeleteMicroCoachUser(
    $filter: ModelSubscriptionMicroCoachUserFilterInput
    $cognitoId: String
  ) {
    onDeleteMicroCoachUser(filter: $filter, cognitoId: $cognitoId) {
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
