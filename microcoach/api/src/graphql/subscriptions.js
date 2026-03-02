/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateClassroom = /* GraphQL */ `
  subscription OnCreateClassroom(
    $filter: ModelSubscriptionClassroomFilterInput
  ) {
    onCreateClassroom(filter: $filter) {
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
          pregeneratedGapGroups
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
export const onUpdateClassroom = /* GraphQL */ `
  subscription OnUpdateClassroom(
    $filter: ModelSubscriptionClassroomFilterInput
  ) {
    onUpdateClassroom(filter: $filter) {
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
          pregeneratedGapGroups
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
export const onDeleteClassroom = /* GraphQL */ `
  subscription OnDeleteClassroom(
    $filter: ModelSubscriptionClassroomFilterInput
  ) {
    onDeleteClassroom(filter: $filter) {
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
          pregeneratedGapGroups
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
export const onCreateSession = /* GraphQL */ `
  subscription OnCreateSession($filter: ModelSubscriptionSessionFilterInput) {
    onCreateSession(filter: $filter) {
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
      pregeneratedGapGroups
      createdAt
      updatedAt
      classroomSessionsId
      __typename
    }
  }
`;
export const onUpdateSession = /* GraphQL */ `
  subscription OnUpdateSession($filter: ModelSubscriptionSessionFilterInput) {
    onUpdateSession(filter: $filter) {
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
      pregeneratedGapGroups
      createdAt
      updatedAt
      classroomSessionsId
      __typename
    }
  }
`;
export const onDeleteSession = /* GraphQL */ `
  subscription OnDeleteSession($filter: ModelSubscriptionSessionFilterInput) {
    onDeleteSession(filter: $filter) {
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
      pregeneratedGapGroups
      createdAt
      updatedAt
      classroomSessionsId
      __typename
    }
  }
`;
export const onCreateStudent = /* GraphQL */ `
  subscription OnCreateStudent($filter: ModelSubscriptionStudentFilterInput) {
    onCreateStudent(filter: $filter) {
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
export const onUpdateStudent = /* GraphQL */ `
  subscription OnUpdateStudent($filter: ModelSubscriptionStudentFilterInput) {
    onUpdateStudent(filter: $filter) {
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
export const onDeleteStudent = /* GraphQL */ `
  subscription OnDeleteStudent($filter: ModelSubscriptionStudentFilterInput) {
    onDeleteStudent(filter: $filter) {
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
export const onCreateAssessment = /* GraphQL */ `
  subscription OnCreateAssessment(
    $filter: ModelSubscriptionAssessmentFilterInput
  ) {
    onCreateAssessment(filter: $filter) {
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
export const onUpdateAssessment = /* GraphQL */ `
  subscription OnUpdateAssessment(
    $filter: ModelSubscriptionAssessmentFilterInput
  ) {
    onUpdateAssessment(filter: $filter) {
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
export const onDeleteAssessment = /* GraphQL */ `
  subscription OnDeleteAssessment(
    $filter: ModelSubscriptionAssessmentFilterInput
  ) {
    onDeleteAssessment(filter: $filter) {
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
export const onCreateStudentResponse = /* GraphQL */ `
  subscription OnCreateStudentResponse(
    $filter: ModelSubscriptionStudentResponseFilterInput
  ) {
    onCreateStudentResponse(filter: $filter) {
      id
      assessmentId
      studentId
      totalScore
      questionResponses {
        questionNumber
        response
        isCorrect
        pointsEarned
        __typename
      }
      createdAt
      updatedAt
      assessmentStudentResponsesId
      __typename
    }
  }
`;
export const onUpdateStudentResponse = /* GraphQL */ `
  subscription OnUpdateStudentResponse(
    $filter: ModelSubscriptionStudentResponseFilterInput
  ) {
    onUpdateStudentResponse(filter: $filter) {
      id
      assessmentId
      studentId
      totalScore
      questionResponses {
        questionNumber
        response
        isCorrect
        pointsEarned
        __typename
      }
      createdAt
      updatedAt
      assessmentStudentResponsesId
      __typename
    }
  }
`;
export const onDeleteStudentResponse = /* GraphQL */ `
  subscription OnDeleteStudentResponse(
    $filter: ModelSubscriptionStudentResponseFilterInput
  ) {
    onDeleteStudentResponse(filter: $filter) {
      id
      assessmentId
      studentId
      totalScore
      questionResponses {
        questionNumber
        response
        isCorrect
        pointsEarned
        __typename
      }
      createdAt
      updatedAt
      assessmentStudentResponsesId
      __typename
    }
  }
`;
export const onCreateMisconception = /* GraphQL */ `
  subscription OnCreateMisconception(
    $filter: ModelSubscriptionMisconceptionFilterInput
  ) {
    onCreateMisconception(filter: $filter) {
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
export const onUpdateMisconception = /* GraphQL */ `
  subscription OnUpdateMisconception(
    $filter: ModelSubscriptionMisconceptionFilterInput
  ) {
    onUpdateMisconception(filter: $filter) {
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
export const onDeleteMisconception = /* GraphQL */ `
  subscription OnDeleteMisconception(
    $filter: ModelSubscriptionMisconceptionFilterInput
  ) {
    onDeleteMisconception(filter: $filter) {
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
export const onCreateActivity = /* GraphQL */ `
  subscription OnCreateActivity($filter: ModelSubscriptionActivityFilterInput) {
    onCreateActivity(filter: $filter) {
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
export const onUpdateActivity = /* GraphQL */ `
  subscription OnUpdateActivity($filter: ModelSubscriptionActivityFilterInput) {
    onUpdateActivity(filter: $filter) {
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
export const onDeleteActivity = /* GraphQL */ `
  subscription OnDeleteActivity($filter: ModelSubscriptionActivityFilterInput) {
    onDeleteActivity(filter: $filter) {
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
export const onCreateSavedNextStep = /* GraphQL */ `
  subscription OnCreateSavedNextStep(
    $filter: ModelSubscriptionSavedNextStepFilterInput
  ) {
    onCreateSavedNextStep(filter: $filter) {
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
export const onUpdateSavedNextStep = /* GraphQL */ `
  subscription OnUpdateSavedNextStep(
    $filter: ModelSubscriptionSavedNextStepFilterInput
  ) {
    onUpdateSavedNextStep(filter: $filter) {
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
export const onDeleteSavedNextStep = /* GraphQL */ `
  subscription OnDeleteSavedNextStep(
    $filter: ModelSubscriptionSavedNextStepFilterInput
  ) {
    onDeleteSavedNextStep(filter: $filter) {
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
export const onCreateContextData = /* GraphQL */ `
  subscription OnCreateContextData(
    $filter: ModelSubscriptionContextDataFilterInput
  ) {
    onCreateContextData(filter: $filter) {
      id
      type
      title
      gradeLevel
      weekNumber
      ccssStandards
      assessmentCode
      isReference
      rtdLesson {
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
export const onUpdateContextData = /* GraphQL */ `
  subscription OnUpdateContextData(
    $filter: ModelSubscriptionContextDataFilterInput
  ) {
    onUpdateContextData(filter: $filter) {
      id
      type
      title
      gradeLevel
      weekNumber
      ccssStandards
      assessmentCode
      isReference
      rtdLesson {
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
export const onDeleteContextData = /* GraphQL */ `
  subscription OnDeleteContextData(
    $filter: ModelSubscriptionContextDataFilterInput
  ) {
    onDeleteContextData(filter: $filter) {
      id
      type
      title
      gradeLevel
      weekNumber
      ccssStandards
      assessmentCode
      isReference
      rtdLesson {
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
