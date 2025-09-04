/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../../AWSMobileApi";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateUser = /* GraphQL */ `subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
  onCreateUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
  onUpdateUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
  onDeleteUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onCreateDailyQuestion = /* GraphQL */ `subscription OnCreateDailyQuestion(
  $filter: ModelSubscriptionDailyQuestionFilterInput
) {
  onCreateDailyQuestion(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateDailyQuestionSubscriptionVariables,
  APITypes.OnCreateDailyQuestionSubscription
>;
export const onUpdateDailyQuestion = /* GraphQL */ `subscription OnUpdateDailyQuestion(
  $filter: ModelSubscriptionDailyQuestionFilterInput
) {
  onUpdateDailyQuestion(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateDailyQuestionSubscriptionVariables,
  APITypes.OnUpdateDailyQuestionSubscription
>;
export const onDeleteDailyQuestion = /* GraphQL */ `subscription OnDeleteDailyQuestion(
  $filter: ModelSubscriptionDailyQuestionFilterInput
) {
  onDeleteDailyQuestion(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteDailyQuestionSubscriptionVariables,
  APITypes.OnDeleteDailyQuestionSubscription
>;
