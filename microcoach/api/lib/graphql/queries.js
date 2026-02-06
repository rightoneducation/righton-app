"use strict";
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.listStudentAnswers = exports.getStudentAnswer = exports.listClassroomSessions = exports.getClassroomSession = exports.listClassrooms = exports.getClassroom = void 0;
exports.getClassroom = `
  query GetClassroom($id: ID!) {
    getClassroom(id: $id) {
      id
      userName
      sessions {
        items {
          id
          classroomId
          question
          correctAnswer
          steps
          incorrectAnswer1
          incorrectAnswer1Explanation
          incorrectAnswer2
          incorrectAnswer2Explanation
          incorrectAnswer3
          incorrectAnswer3Explanation
          createdAt
          updatedAt
          classroomSessionsId
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
exports.listClassrooms = `
  query ListClassrooms(
    $filter: ModelClassroomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassrooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userName
        sessions {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
exports.getClassroomSession = `
  query GetClassroomSession($id: ID!) {
    getClassroomSession(id: $id) {
      id
      classroomId
      question
      correctAnswer
      steps
      incorrectAnswer1
      incorrectAnswer1Explanation
      incorrectAnswer2
      incorrectAnswer2Explanation
      incorrectAnswer3
      incorrectAnswer3Explanation
      studentAnswer {
        items {
          id
          classroomSessionId
          studentId
          answer
          explanation
          confidenceLevel
          createdAt
          updatedAt
          classroomSessionStudentAnswerId
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      classroomSessionsId
      __typename
    }
  }
`;
exports.listClassroomSessions = `
  query ListClassroomSessions(
    $filter: ModelClassroomSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassroomSessions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomId
        question
        correctAnswer
        steps
        incorrectAnswer1
        incorrectAnswer1Explanation
        incorrectAnswer2
        incorrectAnswer2Explanation
        incorrectAnswer3
        incorrectAnswer3Explanation
        studentAnswer {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        classroomSessionsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
exports.getStudentAnswer = `
  query GetStudentAnswer($id: ID!) {
    getStudentAnswer(id: $id) {
      id
      classroomSessionId
      studentId
      answer
      explanation
      confidenceLevel
      createdAt
      updatedAt
      classroomSessionStudentAnswerId
      __typename
    }
  }
`;
exports.listStudentAnswers = `
  query ListStudentAnswers(
    $filter: ModelStudentAnswerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStudentAnswers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        classroomSessionId
        studentId
        answer
        explanation
        confidenceLevel
        createdAt
        updatedAt
        classroomSessionStudentAnswerId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
