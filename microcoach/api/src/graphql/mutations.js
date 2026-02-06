/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLearningScience = /* GraphQL */ `
  mutation GetLearningScience($input: GetLearningScienceInput!) {
    getLearningScience(input: $input)
  }
`;
export const getAnalytics = /* GraphQL */ `
  mutation GetAnalytics($input: GetAnalyticsInput!) {
    getAnalytics(input: $input)
  }
`;
export const createClassroom = /* GraphQL */ `
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
export const updateClassroom = /* GraphQL */ `
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
export const deleteClassroom = /* GraphQL */ `
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
export const createClassroomSession = /* GraphQL */ `
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
export const updateClassroomSession = /* GraphQL */ `
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
export const deleteClassroomSession = /* GraphQL */ `
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
export const createStudentAnswer = /* GraphQL */ `
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
export const updateStudentAnswer = /* GraphQL */ `
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
export const deleteStudentAnswer = /* GraphQL */ `
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
