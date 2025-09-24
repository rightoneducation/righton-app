/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id?: string | null,
  email: string,
  userName?: string | null,
  password?: string | null,
  points?: number | null,
  currentStreak?: number | null,
  maxStreak?: number | null,
  globalRank?: number | null,
  topSubjects?: Array< string | null > | null,
  accuracy?: number | null,
  hasAnsweredToday?: boolean | null,
  lastAnsweredDate?: string | null,
  sessions?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelUserConditionInput = {
  email?: ModelStringInput | null,
  userName?: ModelStringInput | null,
  password?: ModelStringInput | null,
  points?: ModelIntInput | null,
  currentStreak?: ModelIntInput | null,
  maxStreak?: ModelIntInput | null,
  globalRank?: ModelIntInput | null,
  topSubjects?: ModelStringInput | null,
  accuracy?: ModelFloatInput | null,
  hasAnsweredToday?: ModelBooleanInput | null,
  lastAnsweredDate?: ModelStringInput | null,
  sessions?: ModelStringInput | null,
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

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type User = {
  __typename: "User",
  id: string,
  email: string,
  userName?: string | null,
  password?: string | null,
  points?: number | null,
  currentStreak?: number | null,
  maxStreak?: number | null,
  globalRank?: number | null,
  topSubjects?: Array< string | null > | null,
  accuracy?: number | null,
  hasAnsweredToday?: boolean | null,
  lastAnsweredDate?: string | null,
  sessions?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type UpdateUserInput = {
  id: string,
  email?: string | null,
  userName?: string | null,
  password?: string | null,
  points?: number | null,
  currentStreak?: number | null,
  maxStreak?: number | null,
  globalRank?: number | null,
  topSubjects?: Array< string | null > | null,
  accuracy?: number | null,
  hasAnsweredToday?: boolean | null,
  lastAnsweredDate?: string | null,
  sessions?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreateDailyQuestionInput = {
  id?: string | null,
  createdAt?: string | null,
  topic?: string | null,
  imageUrl?: string | null,
  shareCount?: number | null,
  question?: string | null,
  answerAnalytics?: string | null,
  comments?: string | null,
};

export type ModelDailyQuestionConditionInput = {
  createdAt?: ModelStringInput | null,
  topic?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  shareCount?: ModelIntInput | null,
  question?: ModelStringInput | null,
  answerAnalytics?: ModelStringInput | null,
  comments?: ModelStringInput | null,
  and?: Array< ModelDailyQuestionConditionInput | null > | null,
  or?: Array< ModelDailyQuestionConditionInput | null > | null,
  not?: ModelDailyQuestionConditionInput | null,
  updatedAt?: ModelStringInput | null,
};

export type DailyQuestion = {
  __typename: "DailyQuestion",
  id: string,
  createdAt?: string | null,
  topic?: string | null,
  imageUrl?: string | null,
  shareCount?: number | null,
  question?: string | null,
  answerAnalytics?: string | null,
  comments?: string | null,
  updatedAt: string,
};

export type UpdateDailyQuestionInput = {
  id: string,
  createdAt?: string | null,
  topic?: string | null,
  imageUrl?: string | null,
  shareCount?: number | null,
  question?: string | null,
  answerAnalytics?: string | null,
  comments?: string | null,
};

export type DeleteDailyQuestionInput = {
  id: string,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  email?: ModelStringInput | null,
  userName?: ModelStringInput | null,
  password?: ModelStringInput | null,
  points?: ModelIntInput | null,
  currentStreak?: ModelIntInput | null,
  maxStreak?: ModelIntInput | null,
  globalRank?: ModelIntInput | null,
  topSubjects?: ModelStringInput | null,
  accuracy?: ModelFloatInput | null,
  hasAnsweredToday?: ModelBooleanInput | null,
  lastAnsweredDate?: ModelStringInput | null,
  sessions?: ModelStringInput | null,
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

export type ModelDailyQuestionFilterInput = {
  id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  topic?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  shareCount?: ModelIntInput | null,
  question?: ModelStringInput | null,
  answerAnalytics?: ModelStringInput | null,
  comments?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelDailyQuestionFilterInput | null > | null,
  or?: Array< ModelDailyQuestionFilterInput | null > | null,
  not?: ModelDailyQuestionFilterInput | null,
};

export type ModelDailyQuestionConnection = {
  __typename: "ModelDailyQuestionConnection",
  items:  Array<DailyQuestion | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  email?: ModelSubscriptionStringInput | null,
  userName?: ModelSubscriptionStringInput | null,
  password?: ModelSubscriptionStringInput | null,
  points?: ModelSubscriptionIntInput | null,
  currentStreak?: ModelSubscriptionIntInput | null,
  maxStreak?: ModelSubscriptionIntInput | null,
  globalRank?: ModelSubscriptionIntInput | null,
  topSubjects?: ModelSubscriptionStringInput | null,
  accuracy?: ModelSubscriptionFloatInput | null,
  hasAnsweredToday?: ModelSubscriptionBooleanInput | null,
  lastAnsweredDate?: ModelSubscriptionStringInput | null,
  sessions?: ModelSubscriptionStringInput | null,
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

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionDailyQuestionFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  topic?: ModelSubscriptionStringInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  shareCount?: ModelSubscriptionIntInput | null,
  question?: ModelSubscriptionStringInput | null,
  answerAnalytics?: ModelSubscriptionStringInput | null,
  comments?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionDailyQuestionFilterInput | null > | null,
  or?: Array< ModelSubscriptionDailyQuestionFilterInput | null > | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    email: string,
    userName?: string | null,
    password?: string | null,
    points?: number | null,
    currentStreak?: number | null,
    maxStreak?: number | null,
    globalRank?: number | null,
    topSubjects?: Array< string | null > | null,
    accuracy?: number | null,
    hasAnsweredToday?: boolean | null,
    lastAnsweredDate?: string | null,
    sessions?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
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
    email: string,
    userName?: string | null,
    password?: string | null,
    points?: number | null,
    currentStreak?: number | null,
    maxStreak?: number | null,
    globalRank?: number | null,
    topSubjects?: Array< string | null > | null,
    accuracy?: number | null,
    hasAnsweredToday?: boolean | null,
    lastAnsweredDate?: string | null,
    sessions?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
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
    email: string,
    userName?: string | null,
    password?: string | null,
    points?: number | null,
    currentStreak?: number | null,
    maxStreak?: number | null,
    globalRank?: number | null,
    topSubjects?: Array< string | null > | null,
    accuracy?: number | null,
    hasAnsweredToday?: boolean | null,
    lastAnsweredDate?: string | null,
    sessions?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type CreateDailyQuestionMutationVariables = {
  input: CreateDailyQuestionInput,
  condition?: ModelDailyQuestionConditionInput | null,
};

export type CreateDailyQuestionMutation = {
  createDailyQuestion?:  {
    __typename: "DailyQuestion",
    id: string,
    createdAt?: string | null,
    topic?: string | null,
    imageUrl?: string | null,
    shareCount?: number | null,
    question?: string | null,
    answerAnalytics?: string | null,
    comments?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateDailyQuestionMutationVariables = {
  input: UpdateDailyQuestionInput,
  condition?: ModelDailyQuestionConditionInput | null,
};

export type UpdateDailyQuestionMutation = {
  updateDailyQuestion?:  {
    __typename: "DailyQuestion",
    id: string,
    createdAt?: string | null,
    topic?: string | null,
    imageUrl?: string | null,
    shareCount?: number | null,
    question?: string | null,
    answerAnalytics?: string | null,
    comments?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteDailyQuestionMutationVariables = {
  input: DeleteDailyQuestionInput,
  condition?: ModelDailyQuestionConditionInput | null,
};

export type DeleteDailyQuestionMutation = {
  deleteDailyQuestion?:  {
    __typename: "DailyQuestion",
    id: string,
    createdAt?: string | null,
    topic?: string | null,
    imageUrl?: string | null,
    shareCount?: number | null,
    question?: string | null,
    answerAnalytics?: string | null,
    comments?: string | null,
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
    email: string,
    userName?: string | null,
    password?: string | null,
    points?: number | null,
    currentStreak?: number | null,
    maxStreak?: number | null,
    globalRank?: number | null,
    topSubjects?: Array< string | null > | null,
    accuracy?: number | null,
    hasAnsweredToday?: boolean | null,
    lastAnsweredDate?: string | null,
    sessions?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
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
      email: string,
      userName?: string | null,
      password?: string | null,
      points?: number | null,
      currentStreak?: number | null,
      maxStreak?: number | null,
      globalRank?: number | null,
      topSubjects?: Array< string | null > | null,
      accuracy?: number | null,
      hasAnsweredToday?: boolean | null,
      lastAnsweredDate?: string | null,
      sessions?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetDailyQuestionQueryVariables = {
  id: string,
};

export type GetDailyQuestionQuery = {
  getDailyQuestion?:  {
    __typename: "DailyQuestion",
    id: string,
    createdAt?: string | null,
    topic?: string | null,
    imageUrl?: string | null,
    shareCount?: number | null,
    question?: string | null,
    answerAnalytics?: string | null,
    comments?: string | null,
    updatedAt: string,
  } | null,
};

export type ListDailyQuestionsQueryVariables = {
  filter?: ModelDailyQuestionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDailyQuestionsQuery = {
  listDailyQuestions?:  {
    __typename: "ModelDailyQuestionConnection",
    items:  Array< {
      __typename: "DailyQuestion",
      id: string,
      createdAt?: string | null,
      topic?: string | null,
      imageUrl?: string | null,
      shareCount?: number | null,
      question?: string | null,
      answerAnalytics?: string | null,
      comments?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserByEmailQueryVariables = {
  email: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserByEmailQuery = {
  userByEmail?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      email: string,
      userName?: string | null,
      password?: string | null,
      points?: number | null,
      currentStreak?: number | null,
      maxStreak?: number | null,
      globalRank?: number | null,
      topSubjects?: Array< string | null > | null,
      accuracy?: number | null,
      hasAnsweredToday?: boolean | null,
      lastAnsweredDate?: string | null,
      sessions?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    email: string,
    userName?: string | null,
    password?: string | null,
    points?: number | null,
    currentStreak?: number | null,
    maxStreak?: number | null,
    globalRank?: number | null,
    topSubjects?: Array< string | null > | null,
    accuracy?: number | null,
    hasAnsweredToday?: boolean | null,
    lastAnsweredDate?: string | null,
    sessions?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    email: string,
    userName?: string | null,
    password?: string | null,
    points?: number | null,
    currentStreak?: number | null,
    maxStreak?: number | null,
    globalRank?: number | null,
    topSubjects?: Array< string | null > | null,
    accuracy?: number | null,
    hasAnsweredToday?: boolean | null,
    lastAnsweredDate?: string | null,
    sessions?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    email: string,
    userName?: string | null,
    password?: string | null,
    points?: number | null,
    currentStreak?: number | null,
    maxStreak?: number | null,
    globalRank?: number | null,
    topSubjects?: Array< string | null > | null,
    accuracy?: number | null,
    hasAnsweredToday?: boolean | null,
    lastAnsweredDate?: string | null,
    sessions?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnCreateDailyQuestionSubscriptionVariables = {
  filter?: ModelSubscriptionDailyQuestionFilterInput | null,
};

export type OnCreateDailyQuestionSubscription = {
  onCreateDailyQuestion?:  {
    __typename: "DailyQuestion",
    id: string,
    createdAt?: string | null,
    topic?: string | null,
    imageUrl?: string | null,
    shareCount?: number | null,
    question?: string | null,
    answerAnalytics?: string | null,
    comments?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateDailyQuestionSubscriptionVariables = {
  filter?: ModelSubscriptionDailyQuestionFilterInput | null,
};

export type OnUpdateDailyQuestionSubscription = {
  onUpdateDailyQuestion?:  {
    __typename: "DailyQuestion",
    id: string,
    createdAt?: string | null,
    topic?: string | null,
    imageUrl?: string | null,
    shareCount?: number | null,
    question?: string | null,
    answerAnalytics?: string | null,
    comments?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteDailyQuestionSubscriptionVariables = {
  filter?: ModelSubscriptionDailyQuestionFilterInput | null,
};

export type OnDeleteDailyQuestionSubscription = {
  onDeleteDailyQuestion?:  {
    __typename: "DailyQuestion",
    id: string,
    createdAt?: string | null,
    topic?: string | null,
    imageUrl?: string | null,
    shareCount?: number | null,
    question?: string | null,
    answerAnalytics?: string | null,
    comments?: string | null,
    updatedAt: string,
  } | null,
};
