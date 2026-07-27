/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $cognitoId: String
  ) {
    onCreateUser(filter: $filter, cognitoId: $cognitoId) {
      id
      cognitoId
      email
      teacherName
      classes {
        id
        name
        __typename
      }
      role
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $cognitoId: String
  ) {
    onUpdateUser(filter: $filter, cognitoId: $cognitoId) {
      id
      cognitoId
      email
      teacherName
      classes {
        id
        name
        __typename
      }
      role
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $cognitoId: String
  ) {
    onDeleteUser(filter: $filter, cognitoId: $cognitoId) {
      id
      cognitoId
      email
      teacherName
      classes {
        id
        name
        __typename
      }
      role
      createdAt
      updatedAt
      __typename
    }
  }
`;
