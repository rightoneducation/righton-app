"use strict";
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContextData = exports.updateContextData = exports.createContextData = exports.deleteSavedNextStep = exports.updateSavedNextStep = exports.createSavedNextStep = exports.deleteActivity = exports.updateActivity = exports.createActivity = exports.deleteMisconception = exports.updateMisconception = exports.createMisconception = exports.deleteStudentResponse = exports.updateStudentResponse = exports.createStudentResponse = exports.deleteAssessment = exports.updateAssessment = exports.createAssessment = exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.deleteSession = exports.updateSession = exports.createSession = exports.deleteClassroom = exports.updateClassroom = exports.createClassroom = exports.ingestPPQ = exports.generateNextStepOption = exports.generateNextStep = exports.getAnalysis = exports.getLearningScience = void 0;
exports.getLearningScience = `
  mutation GetLearningScience($input: GetLearningScienceInput!) {
    getLearningScience(input: $input)
  }
`;
exports.getAnalysis = `
  mutation GetAnalysis($input: GetAnalysisInput!) {
    getAnalysis(input: $input)
  }
`;
exports.generateNextStep = `
  mutation GenerateNextStep($input: GenerateNextStepInput!) {
    generateNextStep(input: $input)
  }
`;
exports.generateNextStepOption = `
  mutation GenerateNextStepOption($input: GenerateNextStepOptionInput!) {
    generateNextStepOption(input: $input)
  }
`;
exports.ingestPPQ = `
  mutation IngestPPQ($input: IngestPPQInput!) {
    ingestPPQ(input: $input)
  }
`;
exports.createClassroom = `
  mutation CreateClassroom(
    $input: CreateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    createClassroom(input: $input, condition: $condition) {
      id
      classroomName
      grade
      subject
      state
      schoolYear
      cohortSize
      currentWeek
      students {
        items {
          id
          classroomId
          name
          externalId
          performanceX
          performanceY
          confidenceLevel
          status
          createdAt
          updatedAt
          classroomStudentsId
          __typename
        }
        nextToken
        __typename
      }
      sessions {
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
          assessments {
            items {
              id
              classroomId
              sessionId
              assessmentCode
              type
              weekNumber
              administeredAt
              topic
              ccssStandards
              durationMinutes
              calculatorAllowed
              classPercentCorrect
              sourceAssessmentId
              createdAt
              updatedAt
              sessionAssessmentsId
              __typename
            }
            nextToken
            __typename
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
              prerequisiteGapCodes
              impactedObjectiveCodes
              postPpqImprovement
              createdAt
              updatedAt
              classroomMisconceptionsId
              sessionMisconceptionsId
              __typename
            }
            nextToken
            __typename
          }
          pregeneratedNextSteps
          createdAt
          updatedAt
          classroomSessionsId
          __typename
        }
        nextToken
        __typename
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
            __typename
          }
          prerequisiteGapCodes
          impactedObjectiveCodes
          activities {
            items {
              id
              misconceptionId
              classroomId
              sessionId
              type
              status
              title
              summary
              durationMinutes
              format
              aiReasoning
              aiGenerated
              sourceContextDataIds
              completedAt
              postPpqImprovement
              createdAt
              updatedAt
              misconceptionActivitiesId
              __typename
            }
            nextToken
            __typename
          }
          postPpqImprovement
          createdAt
          updatedAt
          classroomMisconceptionsId
          sessionMisconceptionsId
          __typename
        }
        nextToken
        __typename
      }
      savedNextSteps {
        items {
          id
          classroomId
          sessionId
          activityId
          status
          completedAt
          sortOrder
          misconceptionId
          misconceptionTitle
          targetObjectiveStandard
          priority
          studentCount
          studentPercent
          occurrence
          misconceptionSummary
          successIndicators
          activityTitle
          activityTime
          activityFormat
          activitySummary
          aiReasoning
          evidence {
            source
            mostCommonError
            sampleStudentWork
            aiThinkingPattern
            __typename
          }
          tabs {
            overview {
              whatStudentsDo
              whatYouDo
              importance
              __typename
            }
            activitySteps {
              setup
              problem
              coreActivity
              discussionQuestions
              __typename
            }
            materials {
              required
              optional
              __typename
            }
            studentGroupings {
              aiRecommendation
              __typename
            }
            __typename
          }
          createdAt
          updatedAt
          classroomSavedNextStepsId
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
exports.updateClassroom = `
  mutation UpdateClassroom(
    $input: UpdateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    updateClassroom(input: $input, condition: $condition) {
      id
      classroomName
      grade
      subject
      state
      schoolYear
      cohortSize
      currentWeek
      students {
        items {
          id
          classroomId
          name
          externalId
          performanceX
          performanceY
          confidenceLevel
          status
          createdAt
          updatedAt
          classroomStudentsId
          __typename
        }
        nextToken
        __typename
      }
      sessions {
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
          assessments {
            items {
              id
              classroomId
              sessionId
              assessmentCode
              type
              weekNumber
              administeredAt
              topic
              ccssStandards
              durationMinutes
              calculatorAllowed
              classPercentCorrect
              sourceAssessmentId
              createdAt
              updatedAt
              sessionAssessmentsId
              __typename
            }
            nextToken
            __typename
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
              prerequisiteGapCodes
              impactedObjectiveCodes
              postPpqImprovement
              createdAt
              updatedAt
              classroomMisconceptionsId
              sessionMisconceptionsId
              __typename
            }
            nextToken
            __typename
          }
          pregeneratedNextSteps
          createdAt
          updatedAt
          classroomSessionsId
          __typename
        }
        nextToken
        __typename
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
            __typename
          }
          prerequisiteGapCodes
          impactedObjectiveCodes
          activities {
            items {
              id
              misconceptionId
              classroomId
              sessionId
              type
              status
              title
              summary
              durationMinutes
              format
              aiReasoning
              aiGenerated
              sourceContextDataIds
              completedAt
              postPpqImprovement
              createdAt
              updatedAt
              misconceptionActivitiesId
              __typename
            }
            nextToken
            __typename
          }
          postPpqImprovement
          createdAt
          updatedAt
          classroomMisconceptionsId
          sessionMisconceptionsId
          __typename
        }
        nextToken
        __typename
      }
      savedNextSteps {
        items {
          id
          classroomId
          sessionId
          activityId
          status
          completedAt
          sortOrder
          misconceptionId
          misconceptionTitle
          targetObjectiveStandard
          priority
          studentCount
          studentPercent
          occurrence
          misconceptionSummary
          successIndicators
          activityTitle
          activityTime
          activityFormat
          activitySummary
          aiReasoning
          evidence {
            source
            mostCommonError
            sampleStudentWork
            aiThinkingPattern
            __typename
          }
          tabs {
            overview {
              whatStudentsDo
              whatYouDo
              importance
              __typename
            }
            activitySteps {
              setup
              problem
              coreActivity
              discussionQuestions
              __typename
            }
            materials {
              required
              optional
              __typename
            }
            studentGroupings {
              aiRecommendation
              __typename
            }
            __typename
          }
          createdAt
          updatedAt
          classroomSavedNextStepsId
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
exports.deleteClassroom = `
  mutation DeleteClassroom(
    $input: DeleteClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    deleteClassroom(input: $input, condition: $condition) {
      id
      classroomName
      grade
      subject
      state
      schoolYear
      cohortSize
      currentWeek
      students {
        items {
          id
          classroomId
          name
          externalId
          performanceX
          performanceY
          confidenceLevel
          status
          createdAt
          updatedAt
          classroomStudentsId
          __typename
        }
        nextToken
        __typename
      }
      sessions {
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
          assessments {
            items {
              id
              classroomId
              sessionId
              assessmentCode
              type
              weekNumber
              administeredAt
              topic
              ccssStandards
              durationMinutes
              calculatorAllowed
              classPercentCorrect
              sourceAssessmentId
              createdAt
              updatedAt
              sessionAssessmentsId
              __typename
            }
            nextToken
            __typename
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
              prerequisiteGapCodes
              impactedObjectiveCodes
              postPpqImprovement
              createdAt
              updatedAt
              classroomMisconceptionsId
              sessionMisconceptionsId
              __typename
            }
            nextToken
            __typename
          }
          pregeneratedNextSteps
          createdAt
          updatedAt
          classroomSessionsId
          __typename
        }
        nextToken
        __typename
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
            __typename
          }
          prerequisiteGapCodes
          impactedObjectiveCodes
          activities {
            items {
              id
              misconceptionId
              classroomId
              sessionId
              type
              status
              title
              summary
              durationMinutes
              format
              aiReasoning
              aiGenerated
              sourceContextDataIds
              completedAt
              postPpqImprovement
              createdAt
              updatedAt
              misconceptionActivitiesId
              __typename
            }
            nextToken
            __typename
          }
          postPpqImprovement
          createdAt
          updatedAt
          classroomMisconceptionsId
          sessionMisconceptionsId
          __typename
        }
        nextToken
        __typename
      }
      savedNextSteps {
        items {
          id
          classroomId
          sessionId
          activityId
          status
          completedAt
          sortOrder
          misconceptionId
          misconceptionTitle
          targetObjectiveStandard
          priority
          studentCount
          studentPercent
          occurrence
          misconceptionSummary
          successIndicators
          activityTitle
          activityTime
          activityFormat
          activitySummary
          aiReasoning
          evidence {
            source
            mostCommonError
            sampleStudentWork
            aiThinkingPattern
            __typename
          }
          tabs {
            overview {
              whatStudentsDo
              whatYouDo
              importance
              __typename
            }
            activitySteps {
              setup
              problem
              coreActivity
              discussionQuestions
              __typename
            }
            materials {
              required
              optional
              __typename
            }
            studentGroupings {
              aiRecommendation
              __typename
            }
            __typename
          }
          createdAt
          updatedAt
          classroomSavedNextStepsId
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
exports.createSession = `
  mutation CreateSession(
    $input: CreateSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    createSession(input: $input, condition: $condition) {
      id
      classroomId
      sessionLabel
      weekNumber
      topic
      ccssStandards
      status
      ppqAssessmentId
      postPpqAssessmentId
      assessments {
        items {
          id
          classroomId
          sessionId
          assessmentCode
          type
          weekNumber
          administeredAt
          topic
          ccssStandards
          durationMinutes
          calculatorAllowed
          classPercentCorrect
          questions {
            questionNumber
            questionType
            correctAnswer
            pointValue
            ccssStandard
            classPercentCorrect
            __typename
          }
          studentResponses {
            items {
              id
              assessmentId
              studentId
              totalScore
              createdAt
              updatedAt
              assessmentStudentResponsesId
              __typename
            }
            nextToken
            __typename
          }
          sourceAssessmentId
          createdAt
          updatedAt
          sessionAssessmentsId
          __typename
        }
        nextToken
        __typename
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
            __typename
          }
          prerequisiteGapCodes
          impactedObjectiveCodes
          activities {
            items {
              id
              misconceptionId
              classroomId
              sessionId
              type
              status
              title
              summary
              durationMinutes
              format
              aiReasoning
              aiGenerated
              sourceContextDataIds
              completedAt
              postPpqImprovement
              createdAt
              updatedAt
              misconceptionActivitiesId
              __typename
            }
            nextToken
            __typename
          }
          postPpqImprovement
          createdAt
          updatedAt
          classroomMisconceptionsId
          sessionMisconceptionsId
          __typename
        }
        nextToken
        __typename
      }
      pregeneratedNextSteps
      createdAt
      updatedAt
      classroomSessionsId
      __typename
    }
  }
`;
exports.updateSession = `
  mutation UpdateSession(
    $input: UpdateSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    updateSession(input: $input, condition: $condition) {
      id
      classroomId
      sessionLabel
      weekNumber
      topic
      ccssStandards
      status
      ppqAssessmentId
      postPpqAssessmentId
      assessments {
        items {
          id
          classroomId
          sessionId
          assessmentCode
          type
          weekNumber
          administeredAt
          topic
          ccssStandards
          durationMinutes
          calculatorAllowed
          classPercentCorrect
          questions {
            questionNumber
            questionType
            correctAnswer
            pointValue
            ccssStandard
            classPercentCorrect
            __typename
          }
          studentResponses {
            items {
              id
              assessmentId
              studentId
              totalScore
              createdAt
              updatedAt
              assessmentStudentResponsesId
              __typename
            }
            nextToken
            __typename
          }
          sourceAssessmentId
          createdAt
          updatedAt
          sessionAssessmentsId
          __typename
        }
        nextToken
        __typename
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
            __typename
          }
          prerequisiteGapCodes
          impactedObjectiveCodes
          activities {
            items {
              id
              misconceptionId
              classroomId
              sessionId
              type
              status
              title
              summary
              durationMinutes
              format
              aiReasoning
              aiGenerated
              sourceContextDataIds
              completedAt
              postPpqImprovement
              createdAt
              updatedAt
              misconceptionActivitiesId
              __typename
            }
            nextToken
            __typename
          }
          postPpqImprovement
          createdAt
          updatedAt
          classroomMisconceptionsId
          sessionMisconceptionsId
          __typename
        }
        nextToken
        __typename
      }
      pregeneratedNextSteps
      createdAt
      updatedAt
      classroomSessionsId
      __typename
    }
  }
`;
exports.deleteSession = `
  mutation DeleteSession(
    $input: DeleteSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    deleteSession(input: $input, condition: $condition) {
      id
      classroomId
      sessionLabel
      weekNumber
      topic
      ccssStandards
      status
      ppqAssessmentId
      postPpqAssessmentId
      assessments {
        items {
          id
          classroomId
          sessionId
          assessmentCode
          type
          weekNumber
          administeredAt
          topic
          ccssStandards
          durationMinutes
          calculatorAllowed
          classPercentCorrect
          questions {
            questionNumber
            questionType
            correctAnswer
            pointValue
            ccssStandard
            classPercentCorrect
            __typename
          }
          studentResponses {
            items {
              id
              assessmentId
              studentId
              totalScore
              createdAt
              updatedAt
              assessmentStudentResponsesId
              __typename
            }
            nextToken
            __typename
          }
          sourceAssessmentId
          createdAt
          updatedAt
          sessionAssessmentsId
          __typename
        }
        nextToken
        __typename
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
            __typename
          }
          prerequisiteGapCodes
          impactedObjectiveCodes
          activities {
            items {
              id
              misconceptionId
              classroomId
              sessionId
              type
              status
              title
              summary
              durationMinutes
              format
              aiReasoning
              aiGenerated
              sourceContextDataIds
              completedAt
              postPpqImprovement
              createdAt
              updatedAt
              misconceptionActivitiesId
              __typename
            }
            nextToken
            __typename
          }
          postPpqImprovement
          createdAt
          updatedAt
          classroomMisconceptionsId
          sessionMisconceptionsId
          __typename
        }
        nextToken
        __typename
      }
      pregeneratedNextSteps
      createdAt
      updatedAt
      classroomSessionsId
      __typename
    }
  }
`;
exports.createStudent = `
  mutation CreateStudent(
    $input: CreateStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    createStudent(input: $input, condition: $condition) {
      id
      classroomId
      name
      externalId
      performanceX
      performanceY
      confidenceLevel
      status
      createdAt
      updatedAt
      classroomStudentsId
      __typename
    }
  }
`;
exports.updateStudent = `
  mutation UpdateStudent(
    $input: UpdateStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    updateStudent(input: $input, condition: $condition) {
      id
      classroomId
      name
      externalId
      performanceX
      performanceY
      confidenceLevel
      status
      createdAt
      updatedAt
      classroomStudentsId
      __typename
    }
  }
`;
exports.deleteStudent = `
  mutation DeleteStudent(
    $input: DeleteStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    deleteStudent(input: $input, condition: $condition) {
      id
      classroomId
      name
      externalId
      performanceX
      performanceY
      confidenceLevel
      status
      createdAt
      updatedAt
      classroomStudentsId
      __typename
    }
  }
`;
exports.createAssessment = `
  mutation CreateAssessment(
    $input: CreateAssessmentInput!
    $condition: ModelAssessmentConditionInput
  ) {
    createAssessment(input: $input, condition: $condition) {
      id
      classroomId
      sessionId
      assessmentCode
      type
      weekNumber
      administeredAt
      topic
      ccssStandards
      durationMinutes
      calculatorAllowed
      classPercentCorrect
      questions {
        questionNumber
        questionType
        correctAnswer
        pointValue
        ccssStandard
        classPercentCorrect
        __typename
      }
      studentResponses {
        items {
          id
          assessmentId
          studentId
          totalScore
          questionResponses {
            questionNumber
            response
            isCorrect
            pointsEarned
            confidence
            __typename
          }
          createdAt
          updatedAt
          assessmentStudentResponsesId
          __typename
        }
        nextToken
        __typename
      }
      sourceAssessmentId
      createdAt
      updatedAt
      sessionAssessmentsId
      __typename
    }
  }
`;
exports.updateAssessment = `
  mutation UpdateAssessment(
    $input: UpdateAssessmentInput!
    $condition: ModelAssessmentConditionInput
  ) {
    updateAssessment(input: $input, condition: $condition) {
      id
      classroomId
      sessionId
      assessmentCode
      type
      weekNumber
      administeredAt
      topic
      ccssStandards
      durationMinutes
      calculatorAllowed
      classPercentCorrect
      questions {
        questionNumber
        questionType
        correctAnswer
        pointValue
        ccssStandard
        classPercentCorrect
        __typename
      }
      studentResponses {
        items {
          id
          assessmentId
          studentId
          totalScore
          questionResponses {
            questionNumber
            response
            isCorrect
            pointsEarned
            confidence
            __typename
          }
          createdAt
          updatedAt
          assessmentStudentResponsesId
          __typename
        }
        nextToken
        __typename
      }
      sourceAssessmentId
      createdAt
      updatedAt
      sessionAssessmentsId
      __typename
    }
  }
`;
exports.deleteAssessment = `
  mutation DeleteAssessment(
    $input: DeleteAssessmentInput!
    $condition: ModelAssessmentConditionInput
  ) {
    deleteAssessment(input: $input, condition: $condition) {
      id
      classroomId
      sessionId
      assessmentCode
      type
      weekNumber
      administeredAt
      topic
      ccssStandards
      durationMinutes
      calculatorAllowed
      classPercentCorrect
      questions {
        questionNumber
        questionType
        correctAnswer
        pointValue
        ccssStandard
        classPercentCorrect
        __typename
      }
      studentResponses {
        items {
          id
          assessmentId
          studentId
          totalScore
          questionResponses {
            questionNumber
            response
            isCorrect
            pointsEarned
            confidence
            __typename
          }
          createdAt
          updatedAt
          assessmentStudentResponsesId
          __typename
        }
        nextToken
        __typename
      }
      sourceAssessmentId
      createdAt
      updatedAt
      sessionAssessmentsId
      __typename
    }
  }
`;
exports.createStudentResponse = `
  mutation CreateStudentResponse(
    $input: CreateStudentResponseInput!
    $condition: ModelStudentResponseConditionInput
  ) {
    createStudentResponse(input: $input, condition: $condition) {
      id
      assessmentId
      studentId
      totalScore
      questionResponses {
        questionNumber
        response
        isCorrect
        pointsEarned
        confidence
        __typename
      }
      createdAt
      updatedAt
      assessmentStudentResponsesId
      __typename
    }
  }
`;
exports.updateStudentResponse = `
  mutation UpdateStudentResponse(
    $input: UpdateStudentResponseInput!
    $condition: ModelStudentResponseConditionInput
  ) {
    updateStudentResponse(input: $input, condition: $condition) {
      id
      assessmentId
      studentId
      totalScore
      questionResponses {
        questionNumber
        response
        isCorrect
        pointsEarned
        confidence
        __typename
      }
      createdAt
      updatedAt
      assessmentStudentResponsesId
      __typename
    }
  }
`;
exports.deleteStudentResponse = `
  mutation DeleteStudentResponse(
    $input: DeleteStudentResponseInput!
    $condition: ModelStudentResponseConditionInput
  ) {
    deleteStudentResponse(input: $input, condition: $condition) {
      id
      assessmentId
      studentId
      totalScore
      questionResponses {
        questionNumber
        response
        isCorrect
        pointsEarned
        confidence
        __typename
      }
      createdAt
      updatedAt
      assessmentStudentResponsesId
      __typename
    }
  }
`;
exports.createMisconception = `
  mutation CreateMisconception(
    $input: CreateMisconceptionInput!
    $condition: ModelMisconceptionConditionInput
  ) {
    createMisconception(input: $input, condition: $condition) {
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
        __typename
      }
      prerequisiteGapCodes
      impactedObjectiveCodes
      activities {
        items {
          id
          misconceptionId
          classroomId
          sessionId
          type
          status
          title
          summary
          durationMinutes
          format
          aiReasoning
          aiGenerated
          sourceContextDataIds
          tabs {
            overview {
              whatStudentsDo
              whatYouDo
              importance
              __typename
            }
            activitySteps {
              setup
              problem
              coreActivity
              discussionQuestions
              __typename
            }
            materials {
              required
              optional
              __typename
            }
            studentGroupings {
              aiRecommendation
              __typename
            }
            __typename
          }
          completedAt
          postPpqImprovement
          createdAt
          updatedAt
          misconceptionActivitiesId
          __typename
        }
        nextToken
        __typename
      }
      postPpqImprovement
      createdAt
      updatedAt
      classroomMisconceptionsId
      sessionMisconceptionsId
      __typename
    }
  }
`;
exports.updateMisconception = `
  mutation UpdateMisconception(
    $input: UpdateMisconceptionInput!
    $condition: ModelMisconceptionConditionInput
  ) {
    updateMisconception(input: $input, condition: $condition) {
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
        __typename
      }
      prerequisiteGapCodes
      impactedObjectiveCodes
      activities {
        items {
          id
          misconceptionId
          classroomId
          sessionId
          type
          status
          title
          summary
          durationMinutes
          format
          aiReasoning
          aiGenerated
          sourceContextDataIds
          tabs {
            overview {
              whatStudentsDo
              whatYouDo
              importance
              __typename
            }
            activitySteps {
              setup
              problem
              coreActivity
              discussionQuestions
              __typename
            }
            materials {
              required
              optional
              __typename
            }
            studentGroupings {
              aiRecommendation
              __typename
            }
            __typename
          }
          completedAt
          postPpqImprovement
          createdAt
          updatedAt
          misconceptionActivitiesId
          __typename
        }
        nextToken
        __typename
      }
      postPpqImprovement
      createdAt
      updatedAt
      classroomMisconceptionsId
      sessionMisconceptionsId
      __typename
    }
  }
`;
exports.deleteMisconception = `
  mutation DeleteMisconception(
    $input: DeleteMisconceptionInput!
    $condition: ModelMisconceptionConditionInput
  ) {
    deleteMisconception(input: $input, condition: $condition) {
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
        __typename
      }
      prerequisiteGapCodes
      impactedObjectiveCodes
      activities {
        items {
          id
          misconceptionId
          classroomId
          sessionId
          type
          status
          title
          summary
          durationMinutes
          format
          aiReasoning
          aiGenerated
          sourceContextDataIds
          tabs {
            overview {
              whatStudentsDo
              whatYouDo
              importance
              __typename
            }
            activitySteps {
              setup
              problem
              coreActivity
              discussionQuestions
              __typename
            }
            materials {
              required
              optional
              __typename
            }
            studentGroupings {
              aiRecommendation
              __typename
            }
            __typename
          }
          completedAt
          postPpqImprovement
          createdAt
          updatedAt
          misconceptionActivitiesId
          __typename
        }
        nextToken
        __typename
      }
      postPpqImprovement
      createdAt
      updatedAt
      classroomMisconceptionsId
      sessionMisconceptionsId
      __typename
    }
  }
`;
exports.createActivity = `
  mutation CreateActivity(
    $input: CreateActivityInput!
    $condition: ModelActivityConditionInput
  ) {
    createActivity(input: $input, condition: $condition) {
      id
      misconceptionId
      classroomId
      sessionId
      type
      status
      title
      summary
      durationMinutes
      format
      aiReasoning
      aiGenerated
      sourceContextDataIds
      tabs {
        overview {
          whatStudentsDo
          whatYouDo
          importance
          __typename
        }
        activitySteps {
          setup
          problem
          coreActivity
          discussionQuestions
          __typename
        }
        materials {
          required
          optional
          __typename
        }
        studentGroupings {
          groups {
            name
            description
            students
            __typename
          }
          highFlyers {
            students
            description
            __typename
          }
          aiRecommendation
          __typename
        }
        __typename
      }
      completedAt
      postPpqImprovement
      createdAt
      updatedAt
      misconceptionActivitiesId
      __typename
    }
  }
`;
exports.updateActivity = `
  mutation UpdateActivity(
    $input: UpdateActivityInput!
    $condition: ModelActivityConditionInput
  ) {
    updateActivity(input: $input, condition: $condition) {
      id
      misconceptionId
      classroomId
      sessionId
      type
      status
      title
      summary
      durationMinutes
      format
      aiReasoning
      aiGenerated
      sourceContextDataIds
      tabs {
        overview {
          whatStudentsDo
          whatYouDo
          importance
          __typename
        }
        activitySteps {
          setup
          problem
          coreActivity
          discussionQuestions
          __typename
        }
        materials {
          required
          optional
          __typename
        }
        studentGroupings {
          groups {
            name
            description
            students
            __typename
          }
          highFlyers {
            students
            description
            __typename
          }
          aiRecommendation
          __typename
        }
        __typename
      }
      completedAt
      postPpqImprovement
      createdAt
      updatedAt
      misconceptionActivitiesId
      __typename
    }
  }
`;
exports.deleteActivity = `
  mutation DeleteActivity(
    $input: DeleteActivityInput!
    $condition: ModelActivityConditionInput
  ) {
    deleteActivity(input: $input, condition: $condition) {
      id
      misconceptionId
      classroomId
      sessionId
      type
      status
      title
      summary
      durationMinutes
      format
      aiReasoning
      aiGenerated
      sourceContextDataIds
      tabs {
        overview {
          whatStudentsDo
          whatYouDo
          importance
          __typename
        }
        activitySteps {
          setup
          problem
          coreActivity
          discussionQuestions
          __typename
        }
        materials {
          required
          optional
          __typename
        }
        studentGroupings {
          groups {
            name
            description
            students
            __typename
          }
          highFlyers {
            students
            description
            __typename
          }
          aiRecommendation
          __typename
        }
        __typename
      }
      completedAt
      postPpqImprovement
      createdAt
      updatedAt
      misconceptionActivitiesId
      __typename
    }
  }
`;
exports.createSavedNextStep = `
  mutation CreateSavedNextStep(
    $input: CreateSavedNextStepInput!
    $condition: ModelSavedNextStepConditionInput
  ) {
    createSavedNextStep(input: $input, condition: $condition) {
      id
      classroomId
      sessionId
      activityId
      status
      completedAt
      sortOrder
      misconceptionId
      misconceptionTitle
      targetObjectiveStandard
      priority
      studentCount
      studentPercent
      occurrence
      misconceptionSummary
      successIndicators
      activityTitle
      activityTime
      activityFormat
      activitySummary
      aiReasoning
      evidence {
        source
        mostCommonError
        sampleStudentWork
        aiThinkingPattern
        __typename
      }
      tabs {
        overview {
          whatStudentsDo
          whatYouDo
          importance
          __typename
        }
        activitySteps {
          setup
          problem
          coreActivity
          discussionQuestions
          __typename
        }
        materials {
          required
          optional
          __typename
        }
        studentGroupings {
          groups {
            name
            description
            students
            __typename
          }
          highFlyers {
            students
            description
            __typename
          }
          aiRecommendation
          __typename
        }
        __typename
      }
      createdAt
      updatedAt
      classroomSavedNextStepsId
      __typename
    }
  }
`;
exports.updateSavedNextStep = `
  mutation UpdateSavedNextStep(
    $input: UpdateSavedNextStepInput!
    $condition: ModelSavedNextStepConditionInput
  ) {
    updateSavedNextStep(input: $input, condition: $condition) {
      id
      classroomId
      sessionId
      activityId
      status
      completedAt
      sortOrder
      misconceptionId
      misconceptionTitle
      targetObjectiveStandard
      priority
      studentCount
      studentPercent
      occurrence
      misconceptionSummary
      successIndicators
      activityTitle
      activityTime
      activityFormat
      activitySummary
      aiReasoning
      evidence {
        source
        mostCommonError
        sampleStudentWork
        aiThinkingPattern
        __typename
      }
      tabs {
        overview {
          whatStudentsDo
          whatYouDo
          importance
          __typename
        }
        activitySteps {
          setup
          problem
          coreActivity
          discussionQuestions
          __typename
        }
        materials {
          required
          optional
          __typename
        }
        studentGroupings {
          groups {
            name
            description
            students
            __typename
          }
          highFlyers {
            students
            description
            __typename
          }
          aiRecommendation
          __typename
        }
        __typename
      }
      createdAt
      updatedAt
      classroomSavedNextStepsId
      __typename
    }
  }
`;
exports.deleteSavedNextStep = `
  mutation DeleteSavedNextStep(
    $input: DeleteSavedNextStepInput!
    $condition: ModelSavedNextStepConditionInput
  ) {
    deleteSavedNextStep(input: $input, condition: $condition) {
      id
      classroomId
      sessionId
      activityId
      status
      completedAt
      sortOrder
      misconceptionId
      misconceptionTitle
      targetObjectiveStandard
      priority
      studentCount
      studentPercent
      occurrence
      misconceptionSummary
      successIndicators
      activityTitle
      activityTime
      activityFormat
      activitySummary
      aiReasoning
      evidence {
        source
        mostCommonError
        sampleStudentWork
        aiThinkingPattern
        __typename
      }
      tabs {
        overview {
          whatStudentsDo
          whatYouDo
          importance
          __typename
        }
        activitySteps {
          setup
          problem
          coreActivity
          discussionQuestions
          __typename
        }
        materials {
          required
          optional
          __typename
        }
        studentGroupings {
          groups {
            name
            description
            students
            __typename
          }
          highFlyers {
            students
            description
            __typename
          }
          aiRecommendation
          __typename
        }
        __typename
      }
      createdAt
      updatedAt
      classroomSavedNextStepsId
      __typename
    }
  }
`;
exports.createContextData = `
  mutation CreateContextData(
    $input: CreateContextDataInput!
    $condition: ModelContextDataConditionInput
  ) {
    createContextData(input: $input, condition: $condition) {
      id
      type
      title
      gradeLevel
      weekNumber
      ccssStandards
      assessmentCode
      isReference
      nextStepLesson {
        targetAssessmentCode
        targetQuestionNumbers
        topic
        targetProblem
        errorScenarios {
          studentLabel
          isCorrect
          approach
          reasoning
          __typename
        }
        phases {
          phaseName
          durationMinutes
          steps
          teacherPrompts
          __typename
        }
        keyTakeaways
        independentProblems
        exitTicket
        __typename
      }
      exemplarQuestions {
        questionNumber
        questionText
        ccssStandard
        correctAnswer
        pointValue
        answerChoices {
          label
          text
          __typename
        }
        misconceptions {
          description
          targetAnswer
          __typename
        }
        sourceNote
        __typename
      }
      strategy {
        name
        description
        steps
        applicableGrades
        applicableStandards
        examples
        __typename
      }
      walkthroughData {
        quarter
        schools {
          schoolCode
          rubricScores
          notes
          __typename
        }
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
exports.updateContextData = `
  mutation UpdateContextData(
    $input: UpdateContextDataInput!
    $condition: ModelContextDataConditionInput
  ) {
    updateContextData(input: $input, condition: $condition) {
      id
      type
      title
      gradeLevel
      weekNumber
      ccssStandards
      assessmentCode
      isReference
      nextStepLesson {
        targetAssessmentCode
        targetQuestionNumbers
        topic
        targetProblem
        errorScenarios {
          studentLabel
          isCorrect
          approach
          reasoning
          __typename
        }
        phases {
          phaseName
          durationMinutes
          steps
          teacherPrompts
          __typename
        }
        keyTakeaways
        independentProblems
        exitTicket
        __typename
      }
      exemplarQuestions {
        questionNumber
        questionText
        ccssStandard
        correctAnswer
        pointValue
        answerChoices {
          label
          text
          __typename
        }
        misconceptions {
          description
          targetAnswer
          __typename
        }
        sourceNote
        __typename
      }
      strategy {
        name
        description
        steps
        applicableGrades
        applicableStandards
        examples
        __typename
      }
      walkthroughData {
        quarter
        schools {
          schoolCode
          rubricScores
          notes
          __typename
        }
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
exports.deleteContextData = `
  mutation DeleteContextData(
    $input: DeleteContextDataInput!
    $condition: ModelContextDataConditionInput
  ) {
    deleteContextData(input: $input, condition: $condition) {
      id
      type
      title
      gradeLevel
      weekNumber
      ccssStandards
      assessmentCode
      isReference
      nextStepLesson {
        targetAssessmentCode
        targetQuestionNumbers
        topic
        targetProblem
        errorScenarios {
          studentLabel
          isCorrect
          approach
          reasoning
          __typename
        }
        phases {
          phaseName
          durationMinutes
          steps
          teacherPrompts
          __typename
        }
        keyTakeaways
        independentProblems
        exitTicket
        __typename
      }
      exemplarQuestions {
        questionNumber
        questionText
        ccssStandard
        correctAnswer
        pointValue
        answerChoices {
          label
          text
          __typename
        }
        misconceptions {
          description
          targetAnswer
          __typename
        }
        sourceNote
        __typename
      }
      strategy {
        name
        description
        steps
        applicableGrades
        applicableStandards
        examples
        __typename
      }
      walkthroughData {
        quarter
        schools {
          schoolCode
          rubricScores
          notes
          __typename
        }
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
