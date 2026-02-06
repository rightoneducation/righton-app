"use strict";
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudentAnswer = exports.updateStudentAnswer = exports.createStudentAnswer = exports.deleteClassroomSession = exports.updateClassroomSession = exports.createClassroomSession = exports.deleteClassroom = exports.updateClassroom = exports.createClassroom = exports.getAnalytics = exports.getLearningScience = void 0;
exports.getLearningScience = `
  mutation GetLearningScience($input: GetLearningScienceInput!) {
    getLearningScience(input: $input)
  }
`;
exports.getAnalytics = `
  mutation GetAnalytics($input: GetAnalyticsInput!) {
    getAnalytics(input: $input)
  }
`;
exports.createClassroom = `
  mutation CreateClassroom(
    $input: CreateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    createClassroom(input: $input, condition: $condition) {
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
exports.updateClassroom = `
  mutation UpdateClassroom(
    $input: UpdateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    updateClassroom(input: $input, condition: $condition) {
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
exports.deleteClassroom = `
  mutation DeleteClassroom(
    $input: DeleteClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    deleteClassroom(input: $input, condition: $condition) {
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
exports.createClassroomSession = `
  mutation CreateClassroomSession(
    $input: CreateClassroomSessionInput!
    $condition: ModelClassroomSessionConditionInput
  ) {
    createClassroomSession(input: $input, condition: $condition) {
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
exports.updateClassroomSession = `
  mutation UpdateClassroomSession(
    $input: UpdateClassroomSessionInput!
    $condition: ModelClassroomSessionConditionInput
  ) {
    updateClassroomSession(input: $input, condition: $condition) {
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
exports.deleteClassroomSession = `
  mutation DeleteClassroomSession(
    $input: DeleteClassroomSessionInput!
    $condition: ModelClassroomSessionConditionInput
  ) {
    deleteClassroomSession(input: $input, condition: $condition) {
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
exports.createStudentAnswer = `
  mutation CreateStudentAnswer(
    $input: CreateStudentAnswerInput!
    $condition: ModelStudentAnswerConditionInput
  ) {
    createStudentAnswer(input: $input, condition: $condition) {
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
exports.updateStudentAnswer = `
  mutation UpdateStudentAnswer(
    $input: UpdateStudentAnswerInput!
    $condition: ModelStudentAnswerConditionInput
  ) {
    updateStudentAnswer(input: $input, condition: $condition) {
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
exports.deleteStudentAnswer = `
  mutation DeleteStudentAnswer(
    $input: DeleteStudentAnswerInput!
    $condition: ModelStudentAnswerConditionInput
  ) {
    deleteStudentAnswer(input: $input, condition: $condition) {
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
