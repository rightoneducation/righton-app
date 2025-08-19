/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createDailyQuestion = /* GraphQL */ `
  mutation CreateDailyQuestion(
    $input: CreateDailyQuestionInput!
    $condition: ModelDailyQuestionConditionInput
  ) {
    createDailyQuestion(input: $input, condition: $condition) {
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
export const updateDailyQuestion = /* GraphQL */ `
  mutation UpdateDailyQuestion(
    $input: UpdateDailyQuestionInput!
    $condition: ModelDailyQuestionConditionInput
  ) {
    updateDailyQuestion(input: $input, condition: $condition) {
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
export const deleteDailyQuestion = /* GraphQL */ `
  mutation DeleteDailyQuestion(
    $input: DeleteDailyQuestionInput!
    $condition: ModelDailyQuestionConditionInput
  ) {
    deleteDailyQuestion(input: $input, condition: $condition) {
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
