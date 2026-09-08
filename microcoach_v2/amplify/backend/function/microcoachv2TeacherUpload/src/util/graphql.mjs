// ── Upload mutations (from upload.ts) ──────────────────────────────────────

export const GET_CLASSROOM = /* GraphQL */ `
  query GetClassroom($id: ID!) {
    getClassroom(id: $id) {
      id
      classroomName
      grade
      subject
      state
      schoolYear
      cohortSize
      students {
        items {
          id
          name
          externalId
          classroomId
          performanceX
          performanceY
          confidenceLevel
          status
        }
      }
    }
  }
`;

export const CREATE_STUDENT = /* GraphQL */ `
  mutation CreateStudent($input: CreateStudentInput!) {
    createStudent(input: $input) { id name externalId classroomId }
  }
`;

export const CREATE_SESSION = /* GraphQL */ `
  mutation CreateSession($input: CreateSessionInput!) {
    createSession(input: $input) { id classroomId sessionLabel weekNumber topic ccssStandards status }
  }
`;

export const UPDATE_SESSION = /* GraphQL */ `
  mutation UpdateSession($input: UpdateSessionInput!) {
    updateSession(input: $input) { id ppqAssessmentId postPpqAssessmentId status pregeneratedNextSteps }
  }
`;

export const CREATE_ASSESSMENT = /* GraphQL */ `
  mutation CreateAssessment($input: CreateAssessmentInput!) {
    createAssessment(input: $input) { id classroomId sessionId assessmentCode type weekNumber }
  }
`;

export const CREATE_STUDENT_RESPONSE = /* GraphQL */ `
  mutation CreateStudentResponse($input: CreateStudentResponseInput!) {
    createStudentResponse(input: $input) { id assessmentId studentId totalScore }
  }
`;

export const CREATE_MISCONCEPTION = /* GraphQL */ `
  mutation CreateMisconception($input: CreateMisconceptionInput!) {
    createMisconception(input: $input) { id classroomId sessionId ccssStandard title }
  }
`;

export const CREATE_ACTIVITY = /* GraphQL */ `
  mutation CreateActivity($input: CreateActivityInput!) {
    createActivity(input: $input) { id misconceptionId classroomId sessionId type status title }
  }
`;

// ── Generate queries (from generate-next-steps.ts) ─────────────────────────

export const SESSIONS_BY_CLASSROOM = /* GraphQL */ `
  query SessionsByClassroomId($classroomId: ID!) {
    sessionsByClassroomId(classroomId: $classroomId) {
      items {
        id
        classroomId
        sessionLabel
        weekNumber
        topic
        ccssStandards
        status
        ppqAssessmentId
        postPpqAssessmentId
      }
    }
  }
`;

export const GET_SESSION = /* GraphQL */ `
  query GetSession($id: ID!) {
    getSession(id: $id) {
      id
      classroomId
      sessionLabel
      weekNumber
      topic
      ccssStandards
      status
      assessments {
        items {
          id
          classroomId
          sessionId
          assessmentCode
          type
          weekNumber
          topic
          ccssStandards
          classPercentCorrect
          questions {
            questionNumber
            questionType
            correctAnswer
            pointValue
            ccssStandard
            classPercentCorrect
          }
        }
      }
      misconceptions {
        items {
          id
          classroomId
          sessionId
          ccssStandard
          title
          description
          aiReasoning
          studentCount
          studentPercent
          severity
          priority
          occurrence
          successIndicators
          evidence {
            source
            mostCommonError
            sampleStudentWork
            aiThinkingPattern
          }
        }
      }
    }
  }
`;

export const LIST_CONTEXT_DATA = /* GraphQL */ `
  query ListContextData($filter: ModelContextDataFilterInput, $limit: Int) {
    listContextData(filter: $filter, limit: $limit) {
      items {
        id
        type
        title
        gradeLevel
        ccssStandards
        isReference
        weekNumber
      }
    }
  }
`;

export const STUDENT_RESPONSES_BY_ASSESSMENT = /* GraphQL */ `
  query StudentResponsesByAssessmentId($assessmentId: ID!) {
    studentResponsesByAssessmentId(assessmentId: $assessmentId, limit: 1000) {
      items {
        studentId
        questionResponses {
          questionNumber
          response
          isCorrect
          confidence
        }
      }
    }
  }
`;

export const UPDATE_CLASSROOM_WEEK = /* GraphQL */ `
  mutation UpdateClassroom($input: UpdateClassroomInput!) {
    updateClassroom(input: $input) {
      id
      currentWeek
    }
  }
`;

export const CREATE_CONTEXT_DATA = /* GraphQL */ `
  mutation CreateContextData($input: CreateContextDataInput!) {
    createContextData(input: $input) { id type title gradeLevel ccssStandards isReference }
  }
`;

export const INGEST_PPQ = /* GraphQL */ `
  mutation IngestPPQ($input: IngestPPQInput!) {
    ingestPPQ(input: $input)
  }
`;
