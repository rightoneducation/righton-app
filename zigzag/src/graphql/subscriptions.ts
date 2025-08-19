/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
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
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
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
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
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
`;
export const onCreateDailyQuestion = /* GraphQL */ `
  subscription OnCreateDailyQuestion(
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
`;
export const onUpdateDailyQuestion = /* GraphQL */ `
  subscription OnUpdateDailyQuestion(
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
`;
export const onDeleteDailyQuestion = /* GraphQL */ `
  subscription OnDeleteDailyQuestion(
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
`;
