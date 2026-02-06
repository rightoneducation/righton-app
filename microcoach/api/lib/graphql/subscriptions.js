"use strict";
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDeleteStudentAnswer = exports.onUpdateStudentAnswer = exports.onCreateStudentAnswer = exports.onDeleteClassroomSession = exports.onUpdateClassroomSession = exports.onCreateClassroomSession = exports.onDeleteClassroom = exports.onUpdateClassroom = exports.onCreateClassroom = void 0;
exports.onCreateClassroom = `
  subscription OnCreateClassroom(
    $filter: ModelSubscriptionClassroomFilterInput
  ) {
    onCreateClassroom(filter: $filter) {
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
        nextToken
        __typename
      }
      analytics
      createdAt
      updatedAt
      __typename
    }
  }
`;
exports.onUpdateClassroom = `
  subscription OnUpdateClassroom(
    $filter: ModelSubscriptionClassroomFilterInput
  ) {
    onUpdateClassroom(filter: $filter) {
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
        nextToken
        __typename
      }
      analytics
      createdAt
      updatedAt
      __typename
    }
  }
`;
exports.onDeleteClassroom = `
  subscription OnDeleteClassroom(
    $filter: ModelSubscriptionClassroomFilterInput
  ) {
    onDeleteClassroom(filter: $filter) {
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
        nextToken
        __typename
      }
      analytics
      createdAt
      updatedAt
      __typename
    }
  }
`;
exports.onCreateClassroomSession = `
  subscription OnCreateClassroomSession(
    $filter: ModelSubscriptionClassroomSessionFilterInput
  ) {
    onCreateClassroomSession(filter: $filter) {
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
exports.onUpdateClassroomSession = `
  subscription OnUpdateClassroomSession(
    $filter: ModelSubscriptionClassroomSessionFilterInput
  ) {
    onUpdateClassroomSession(filter: $filter) {
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
exports.onDeleteClassroomSession = `
  subscription OnDeleteClassroomSession(
    $filter: ModelSubscriptionClassroomSessionFilterInput
  ) {
    onDeleteClassroomSession(filter: $filter) {
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
exports.onCreateStudentAnswer = `
  subscription OnCreateStudentAnswer(
    $filter: ModelSubscriptionStudentAnswerFilterInput
  ) {
    onCreateStudentAnswer(filter: $filter) {
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
exports.onUpdateStudentAnswer = `
  subscription OnUpdateStudentAnswer(
    $filter: ModelSubscriptionStudentAnswerFilterInput
  ) {
    onUpdateStudentAnswer(filter: $filter) {
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
exports.onDeleteStudentAnswer = `
  subscription OnDeleteStudentAnswer(
    $filter: ModelSubscriptionStudentAnswerFilterInput
  ) {
    onDeleteStudentAnswer(filter: $filter) {
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
