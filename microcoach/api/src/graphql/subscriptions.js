/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateClassroom = /* GraphQL */ `
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
export const onUpdateClassroom = /* GraphQL */ `
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
export const onDeleteClassroom = /* GraphQL */ `
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
export const onCreateClassroomSession = /* GraphQL */ `
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
export const onUpdateClassroomSession = /* GraphQL */ `
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
export const onDeleteClassroomSession = /* GraphQL */ `
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
export const onCreateStudentAnswer = /* GraphQL */ `
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
export const onUpdateStudentAnswer = /* GraphQL */ `
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
export const onDeleteStudentAnswer = /* GraphQL */ `
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
