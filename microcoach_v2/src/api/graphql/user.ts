/* eslint-disable */
// Hand-written GraphQL operations for the `User` @model.
// After `amplify push` + `amplify codegen`, these can be replaced by the
// generated ops if preferred — the field selection here matches the schema.

const USER_FIELDS = `
  id
  cognitoId
  email
  teacherName
  classes {
    id
    name
  }
  role
  createdAt
  updatedAt
  owner
`;

export const createUser = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!, $condition: ModelUserConditionInput) {
    createUser(input: $input, condition: $condition) {
      ${USER_FIELDS}
    }
  }
`;

export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!, $condition: ModelUserConditionInput) {
    updateUser(input: $input, condition: $condition) {
      ${USER_FIELDS}
    }
  }
`;

export const deleteUser = /* GraphQL */ `
  mutation DeleteUser($input: DeleteUserInput!, $condition: ModelUserConditionInput) {
    deleteUser(input: $input, condition: $condition) {
      ${USER_FIELDS}
    }
  }
`;

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      ${USER_FIELDS}
    }
  }
`;

export const usersByCognitoId = /* GraphQL */ `
  query UsersByCognitoId(
    $cognitoId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    usersByCognitoId(
      cognitoId: $cognitoId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${USER_FIELDS}
      }
      nextToken
    }
  }
`;

export const usersByEmail = /* GraphQL */ `
  query UsersByEmail(
    $email: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    usersByEmail(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${USER_FIELDS}
      }
      nextToken
    }
  }
`;

export const usersByRole = /* GraphQL */ `
  query UsersByRole(
    $role: UserRole!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    usersByRole(
      role: $role
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        ${USER_FIELDS}
      }
      nextToken
    }
  }
`;
