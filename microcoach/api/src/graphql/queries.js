/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getClassroom = /* GraphQL */ `
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
export const listClassrooms = /* GraphQL */ `
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
        analytics
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getClassroomSession = /* GraphQL */ `
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
export const listClassroomSessions = /* GraphQL */ `
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
  }
`;
export const getStudentAnswer = /* GraphQL */ `
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
export const listStudentAnswers = /* GraphQL */ `
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
