/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../../AWSMobileApi";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    email
    userName
    password
    points
    currentStreak
    maxStreak
    globalRank
    topSubjects
    accuracy
    hasAnsweredToday
    lastAnsweredDate
    sessions
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      email
      userName
      password
      points
      currentStreak
      maxStreak
      globalRank
      topSubjects
      accuracy
      hasAnsweredToday
      lastAnsweredDate
      sessions
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const getDailyQuestion = /* GraphQL */ `query GetDailyQuestion($id: ID!) {
  getDailyQuestion(id: $id) {
    id
    createdAt
    topic
    imageUrl
    shareCount
    question
    answerAnalytics
    comments
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetDailyQuestionQueryVariables,
  APITypes.GetDailyQuestionQuery
>;
export const listDailyQuestions = /* GraphQL */ `query ListDailyQuestions(
  $filter: ModelDailyQuestionFilterInput
  $limit: Int
  $nextToken: String
) {
  listDailyQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      createdAt
      topic
      imageUrl
      shareCount
      question
      answerAnalytics
      comments
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDailyQuestionsQueryVariables,
  APITypes.ListDailyQuestionsQuery
>;
export const userByEmail = /* GraphQL */ `query UserByEmail(
  $email: String!
  $sortDirection: ModelSortDirection
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  userByEmail(
    email: $email
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      email
      userName
      password
      points
      currentStreak
      maxStreak
      globalRank
      topSubjects
      accuracy
      hasAnsweredToday
      lastAnsweredDate
      sessions
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserByEmailQueryVariables,
  APITypes.UserByEmailQuery
>;
