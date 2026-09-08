/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateMicroCoachUserInput = {
  id?: string | null,
  cognitoId: string,
  email: string,
  teacherName?: string | null,
  classes?: Array< string | null > | null,
  role: UserRole,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export enum UserRole {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
}


export type ModelMicroCoachUserConditionInput = {
  cognitoId?: ModelStringInput | null,
  email?: ModelStringInput | null,
  teacherName?: ModelStringInput | null,
  classes?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMicroCoachUserConditionInput | null > | null,
  or?: Array< ModelMicroCoachUserConditionInput | null > | null,
  not?: ModelMicroCoachUserConditionInput | null,
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

export type MicroCoachUser = {
  __typename: "MicroCoachUser",
  id: string,
  cognitoId: string,
  email: string,
  teacherName?: string | null,
  classes?: Array< string | null > | null,
  role: UserRole,
  createdAt: string,
  updatedAt: string,
};

export type UpdateMicroCoachUserInput = {
  id: string,
  cognitoId?: string | null,
  email?: string | null,
  teacherName?: string | null,
  classes?: Array< string | null > | null,
  role?: UserRole | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteMicroCoachUserInput = {
  id: string,
};

export type ModelMicroCoachUserFilterInput = {
  id?: ModelIDInput | null,
  cognitoId?: ModelStringInput | null,
  email?: ModelStringInput | null,
  teacherName?: ModelStringInput | null,
  classes?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMicroCoachUserFilterInput | null > | null,
  or?: Array< ModelMicroCoachUserFilterInput | null > | null,
  not?: ModelMicroCoachUserFilterInput | null,
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

export type ModelMicroCoachUserConnection = {
  __typename: "ModelMicroCoachUserConnection",
  items:  Array<MicroCoachUser | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelSubscriptionMicroCoachUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  email?: ModelSubscriptionStringInput | null,
  teacherName?: ModelSubscriptionStringInput | null,
  classes?: ModelSubscriptionStringInput | null,
  role?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMicroCoachUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionMicroCoachUserFilterInput | null > | null,
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

export type CreateMicroCoachUserMutationVariables = {
  input: CreateMicroCoachUserInput,
  condition?: ModelMicroCoachUserConditionInput | null,
};

export type CreateMicroCoachUserMutation = {
  createMicroCoachUser?:  {
    __typename: "MicroCoachUser",
    id: string,
    cognitoId: string,
    email: string,
    teacherName?: string | null,
    classes?: Array< string | null > | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMicroCoachUserMutationVariables = {
  input: UpdateMicroCoachUserInput,
  condition?: ModelMicroCoachUserConditionInput | null,
};

export type UpdateMicroCoachUserMutation = {
  updateMicroCoachUser?:  {
    __typename: "MicroCoachUser",
    id: string,
    cognitoId: string,
    email: string,
    teacherName?: string | null,
    classes?: Array< string | null > | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMicroCoachUserMutationVariables = {
  input: DeleteMicroCoachUserInput,
  condition?: ModelMicroCoachUserConditionInput | null,
};

export type DeleteMicroCoachUserMutation = {
  deleteMicroCoachUser?:  {
    __typename: "MicroCoachUser",
    id: string,
    cognitoId: string,
    email: string,
    teacherName?: string | null,
    classes?: Array< string | null > | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetMicroCoachUserQueryVariables = {
  id: string,
};

export type GetMicroCoachUserQuery = {
  getMicroCoachUser?:  {
    __typename: "MicroCoachUser",
    id: string,
    cognitoId: string,
    email: string,
    teacherName?: string | null,
    classes?: Array< string | null > | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMicroCoachUsersQueryVariables = {
  filter?: ModelMicroCoachUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMicroCoachUsersQuery = {
  listMicroCoachUsers?:  {
    __typename: "ModelMicroCoachUserConnection",
    items:  Array< {
      __typename: "MicroCoachUser",
      id: string,
      cognitoId: string,
      email: string,
      teacherName?: string | null,
      classes?: Array< string | null > | null,
      role: UserRole,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MicroCoachUsersByCognitoIdQueryVariables = {
  cognitoId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MicroCoachUsersByCognitoIdQuery = {
  microCoachUsersByCognitoId?:  {
    __typename: "ModelMicroCoachUserConnection",
    items:  Array< {
      __typename: "MicroCoachUser",
      id: string,
      cognitoId: string,
      email: string,
      teacherName?: string | null,
      classes?: Array< string | null > | null,
      role: UserRole,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MicroCoachUsersByEmailQueryVariables = {
  email: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MicroCoachUsersByEmailQuery = {
  microCoachUsersByEmail?:  {
    __typename: "ModelMicroCoachUserConnection",
    items:  Array< {
      __typename: "MicroCoachUser",
      id: string,
      cognitoId: string,
      email: string,
      teacherName?: string | null,
      classes?: Array< string | null > | null,
      role: UserRole,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MicroCoachUsersByRoleQueryVariables = {
  role: UserRole,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MicroCoachUsersByRoleQuery = {
  microCoachUsersByRole?:  {
    __typename: "ModelMicroCoachUserConnection",
    items:  Array< {
      __typename: "MicroCoachUser",
      id: string,
      cognitoId: string,
      email: string,
      teacherName?: string | null,
      classes?: Array< string | null > | null,
      role: UserRole,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateMicroCoachUserSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachUserFilterInput | null,
  cognitoId?: string | null,
};

export type OnCreateMicroCoachUserSubscription = {
  onCreateMicroCoachUser?:  {
    __typename: "MicroCoachUser",
    id: string,
    cognitoId: string,
    email: string,
    teacherName?: string | null,
    classes?: Array< string | null > | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMicroCoachUserSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachUserFilterInput | null,
  cognitoId?: string | null,
};

export type OnUpdateMicroCoachUserSubscription = {
  onUpdateMicroCoachUser?:  {
    __typename: "MicroCoachUser",
    id: string,
    cognitoId: string,
    email: string,
    teacherName?: string | null,
    classes?: Array< string | null > | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMicroCoachUserSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachUserFilterInput | null,
  cognitoId?: string | null,
};

export type OnDeleteMicroCoachUserSubscription = {
  onDeleteMicroCoachUser?:  {
    __typename: "MicroCoachUser",
    id: string,
    cognitoId: string,
    email: string,
    teacherName?: string | null,
    classes?: Array< string | null > | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};
