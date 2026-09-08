/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id?: string | null,
  cognitoId: string,
  email: string,
  teacherName?: string | null,
  classes?: Array< ClassInput | null > | null,
  role: UserRole,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ClassInput = {
  id: string,
  name: string,
};

export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}


export type ModelUserConditionInput = {
  cognitoId?: ModelStringInput | null,
  email?: ModelStringInput | null,
  teacherName?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelUserRoleInput = {
  eq?: UserRole | null,
  ne?: UserRole | null,
};

export type User = {
  __typename: "User",
  id: string,
  cognitoId: string,
  email: string,
  teacherName?: string | null,
  classes?:  Array<Class | null > | null,
  role: UserRole,
  createdAt: string,
  updatedAt: string,
};

export type Class = {
  __typename: "Class",
  id: string,
  name: string,
};

export type UpdateUserInput = {
  id: string,
  cognitoId?: string | null,
  email?: string | null,
  teacherName?: string | null,
  classes?: Array< ClassInput | null > | null,
  role?: UserRole | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  cognitoId?: ModelStringInput | null,
  email?: ModelStringInput | null,
  teacherName?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  email?: ModelSubscriptionStringInput | null,
  teacherName?: ModelSubscriptionStringInput | null,
  role?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    cognitoId: string,
    email: string,
    teacherName?: string | null,
    classes?:  Array< {
      __typename: "Class",
      id: string,
      name: string,
    } | null > | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    cognitoId: string,
    email: string,
    teacherName?: string | null,
    classes?:  Array< {
      __typename: "Class",
      id: string,
      name: string,
    } | null > | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    cognitoId: string,
    email: string,
    teacherName?: string | null,
    classes?:  Array< {
      __typename: "Class",
      id: string,
      name: string,
    } | null > | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    cognitoId: string,
    email: string,
    teacherName?: string | null,
    classes?:  Array< {
      __typename: "Class",
      id: string,
      name: string,
    } | null > | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      cognitoId: string,
      email: string,
      teacherName?: string | null,
      classes?:  Array< {
        __typename: "Class",
        id: string,
        name: string,
      } | null > | null,
      role: UserRole,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UsersByCognitoIdQueryVariables = {
  cognitoId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByCognitoIdQuery = {
  usersByCognitoId?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      cognitoId: string,
      email: string,
      teacherName?: string | null,
      classes?:  Array< {
        __typename: "Class",
        id: string,
        name: string,
      } | null > | null,
      role: UserRole,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UsersByEmailQueryVariables = {
  email: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByEmailQuery = {
  usersByEmail?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      cognitoId: string,
      email: string,
      teacherName?: string | null,
      classes?:  Array< {
        __typename: "Class",
        id: string,
        name: string,
      } | null > | null,
      role: UserRole,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UsersByRoleQueryVariables = {
  role: UserRole,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByRoleQuery = {
  usersByRole?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      cognitoId: string,
      email: string,
      teacherName?: string | null,
      classes?:  Array< {
        __typename: "Class",
        id: string,
        name: string,
      } | null > | null,
      role: UserRole,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  cognitoId?: string | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    cognitoId: string,
    email: string,
    teacherName?: string | null,
    classes?:  Array< {
      __typename: "Class",
      id: string,
      name: string,
    } | null > | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  cognitoId?: string | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    cognitoId: string,
    email: string,
    teacherName?: string | null,
    classes?:  Array< {
      __typename: "Class",
      id: string,
      name: string,
    } | null > | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  cognitoId?: string | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    cognitoId: string,
    email: string,
    teacherName?: string | null,
    classes?:  Array< {
      __typename: "Class",
      id: string,
      name: string,
    } | null > | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};
