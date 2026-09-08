/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMicroCoachUser = /* GraphQL */ `
  query GetMicroCoachUser($id: ID!) {
    getMicroCoachUser(id: $id) {
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
export const listMicroCoachUsers = /* GraphQL */ `
  query ListMicroCoachUsers(
    $filter: ModelMicroCoachUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMicroCoachUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const microCoachUsersByCognitoId = /* GraphQL */ `
  query MicroCoachUsersByCognitoId(
    $cognitoId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelMicroCoachUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    microCoachUsersByCognitoId(
      cognitoId: $cognitoId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const microCoachUsersByEmail = /* GraphQL */ `
  query MicroCoachUsersByEmail(
    $email: String!
    $sortDirection: ModelSortDirection
    $filter: ModelMicroCoachUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    microCoachUsersByEmail(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const microCoachUsersByRole = /* GraphQL */ `
  query MicroCoachUsersByRole(
    $role: UserRole!
    $sortDirection: ModelSortDirection
    $filter: ModelMicroCoachUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    microCoachUsersByRole(
      role: $role
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
