/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMicroCoachUser = /* GraphQL */ `
  subscription OnCreateMicroCoachUser(
    $filter: ModelSubscriptionMicroCoachUserFilterInput
    $cognitoId: String
  ) {
    onCreateMicroCoachUser(filter: $filter, cognitoId: $cognitoId) {
      id
      cognitoId
      email
      firstName
      lastName
      classes {
        items {
          id
          userId
          sessions {
            items {
              id
              classId
              sessionLabel
              weekLabel
              weekNumber
              topic
              ccssStandards
              status
              publishStatus
              studentWorksAnalyzed
              studentsWithStrongUnderstanding
              studentsWithStrongUnderstandingIds
              studentIdsNeedingSupport
              ppqAssessmentId
              postPpqAssessmentId
              pregeneratedNextSteps
              evaluationResults
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          students {
            items {
              id
              classId
              name
              externalId
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          name
          grade
          state
          schoolYear
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      role
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateMicroCoachUser = /* GraphQL */ `
  subscription OnUpdateMicroCoachUser(
    $filter: ModelSubscriptionMicroCoachUserFilterInput
    $cognitoId: String
  ) {
    onUpdateMicroCoachUser(filter: $filter, cognitoId: $cognitoId) {
      id
      cognitoId
      email
      firstName
      lastName
      classes {
        items {
          id
          userId
          sessions {
            items {
              id
              classId
              sessionLabel
              weekLabel
              weekNumber
              topic
              ccssStandards
              status
              publishStatus
              studentWorksAnalyzed
              studentsWithStrongUnderstanding
              studentsWithStrongUnderstandingIds
              studentIdsNeedingSupport
              ppqAssessmentId
              postPpqAssessmentId
              pregeneratedNextSteps
              evaluationResults
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          students {
            items {
              id
              classId
              name
              externalId
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          name
          grade
          state
          schoolYear
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      role
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteMicroCoachUser = /* GraphQL */ `
  subscription OnDeleteMicroCoachUser(
    $filter: ModelSubscriptionMicroCoachUserFilterInput
    $cognitoId: String
  ) {
    onDeleteMicroCoachUser(filter: $filter, cognitoId: $cognitoId) {
      id
      cognitoId
      email
      firstName
      lastName
      classes {
        items {
          id
          userId
          sessions {
            items {
              id
              classId
              sessionLabel
              weekLabel
              weekNumber
              topic
              ccssStandards
              status
              publishStatus
              studentWorksAnalyzed
              studentsWithStrongUnderstanding
              studentsWithStrongUnderstandingIds
              studentIdsNeedingSupport
              ppqAssessmentId
              postPpqAssessmentId
              pregeneratedNextSteps
              evaluationResults
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          students {
            items {
              id
              classId
              name
              externalId
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          name
          grade
          state
          schoolYear
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      role
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateMicroCoachClassroom = /* GraphQL */ `
  subscription OnCreateMicroCoachClassroom(
    $filter: ModelSubscriptionMicroCoachClassroomFilterInput
  ) {
    onCreateMicroCoachClassroom(filter: $filter) {
      id
      userId
      sessions {
        items {
          id
          classId
          sessionLabel
          weekLabel
          weekNumber
          topic
          ccssStandards
          status
          publishStatus
          studentWorksAnalyzed
          studentsWithStrongUnderstanding
          studentsWithStrongUnderstandingIds
          studentIdsNeedingSupport
          ppqAssessmentId
          postPpqAssessmentId
          assessments {
            items {
              id
              classId
              sessionId
              assessmentCode
              type
              weekNumber
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          misconceptions {
            items {
              id
              sessionId
              classId
              rank
              badge
              title
              titleCased
              shortLabel
              description
              consequence
              detailStatus
              studentWork
              skillContext
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          pregeneratedNextSteps
          evaluationResults
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      students {
        items {
          id
          classId
          name
          externalId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      name
      grade
      state
      schoolYear
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateMicroCoachClassroom = /* GraphQL */ `
  subscription OnUpdateMicroCoachClassroom(
    $filter: ModelSubscriptionMicroCoachClassroomFilterInput
  ) {
    onUpdateMicroCoachClassroom(filter: $filter) {
      id
      userId
      sessions {
        items {
          id
          classId
          sessionLabel
          weekLabel
          weekNumber
          topic
          ccssStandards
          status
          publishStatus
          studentWorksAnalyzed
          studentsWithStrongUnderstanding
          studentsWithStrongUnderstandingIds
          studentIdsNeedingSupport
          ppqAssessmentId
          postPpqAssessmentId
          assessments {
            items {
              id
              classId
              sessionId
              assessmentCode
              type
              weekNumber
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          misconceptions {
            items {
              id
              sessionId
              classId
              rank
              badge
              title
              titleCased
              shortLabel
              description
              consequence
              detailStatus
              studentWork
              skillContext
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          pregeneratedNextSteps
          evaluationResults
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      students {
        items {
          id
          classId
          name
          externalId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      name
      grade
      state
      schoolYear
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteMicroCoachClassroom = /* GraphQL */ `
  subscription OnDeleteMicroCoachClassroom(
    $filter: ModelSubscriptionMicroCoachClassroomFilterInput
  ) {
    onDeleteMicroCoachClassroom(filter: $filter) {
      id
      userId
      sessions {
        items {
          id
          classId
          sessionLabel
          weekLabel
          weekNumber
          topic
          ccssStandards
          status
          publishStatus
          studentWorksAnalyzed
          studentsWithStrongUnderstanding
          studentsWithStrongUnderstandingIds
          studentIdsNeedingSupport
          ppqAssessmentId
          postPpqAssessmentId
          assessments {
            items {
              id
              classId
              sessionId
              assessmentCode
              type
              weekNumber
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          misconceptions {
            items {
              id
              sessionId
              classId
              rank
              badge
              title
              titleCased
              shortLabel
              description
              consequence
              detailStatus
              studentWork
              skillContext
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          pregeneratedNextSteps
          evaluationResults
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      students {
        items {
          id
          classId
          name
          externalId
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      name
      grade
      state
      schoolYear
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateMicroCoachStudent = /* GraphQL */ `
  subscription OnCreateMicroCoachStudent(
    $filter: ModelSubscriptionMicroCoachStudentFilterInput
  ) {
    onCreateMicroCoachStudent(filter: $filter) {
      id
      classId
      name
      externalId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateMicroCoachStudent = /* GraphQL */ `
  subscription OnUpdateMicroCoachStudent(
    $filter: ModelSubscriptionMicroCoachStudentFilterInput
  ) {
    onUpdateMicroCoachStudent(filter: $filter) {
      id
      classId
      name
      externalId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteMicroCoachStudent = /* GraphQL */ `
  subscription OnDeleteMicroCoachStudent(
    $filter: ModelSubscriptionMicroCoachStudentFilterInput
  ) {
    onDeleteMicroCoachStudent(filter: $filter) {
      id
      classId
      name
      externalId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateMicroCoachSession = /* GraphQL */ `
  subscription OnCreateMicroCoachSession(
    $filter: ModelSubscriptionMicroCoachSessionFilterInput
  ) {
    onCreateMicroCoachSession(filter: $filter) {
      id
      classId
      sessionLabel
      weekLabel
      weekNumber
      topic
      ccssStandards
      status
      publishStatus
      studentWorksAnalyzed
      studentsWithStrongUnderstanding
      studentsWithStrongUnderstandingIds
      studentIdsNeedingSupport
      ppqAssessmentId
      postPpqAssessmentId
      assessments {
        items {
          id
          classId
          sessionId
          assessmentCode
          type
          weekNumber
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      misconceptions {
        items {
          id
          sessionId
          classId
          activities {
            items {
              id
              misconceptionId
              sessionId
              classId
              activityType
              title
              isSelected
              selectLabel
              detailStatus
              routine
              durationMinutes
              durationLabel
              targets
              instructionalMove
              strategyTag
              phases
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          rank
          badge
          title
          titleCased
          shortLabel
          description
          consequence
          prevalence {
            level
            label
            studentsNeedingSupport
            studentsUnderstood
            studentsNoResponse
            totalAnalyzed
            supportSummaryLabel
            understoodSummaryLabel
            shortCountLabel
            __typename
          }
          detailStatus
          studentWork
          skillContext
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      pregeneratedNextSteps
      evaluationResults
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateMicroCoachSession = /* GraphQL */ `
  subscription OnUpdateMicroCoachSession(
    $filter: ModelSubscriptionMicroCoachSessionFilterInput
  ) {
    onUpdateMicroCoachSession(filter: $filter) {
      id
      classId
      sessionLabel
      weekLabel
      weekNumber
      topic
      ccssStandards
      status
      publishStatus
      studentWorksAnalyzed
      studentsWithStrongUnderstanding
      studentsWithStrongUnderstandingIds
      studentIdsNeedingSupport
      ppqAssessmentId
      postPpqAssessmentId
      assessments {
        items {
          id
          classId
          sessionId
          assessmentCode
          type
          weekNumber
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      misconceptions {
        items {
          id
          sessionId
          classId
          activities {
            items {
              id
              misconceptionId
              sessionId
              classId
              activityType
              title
              isSelected
              selectLabel
              detailStatus
              routine
              durationMinutes
              durationLabel
              targets
              instructionalMove
              strategyTag
              phases
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          rank
          badge
          title
          titleCased
          shortLabel
          description
          consequence
          prevalence {
            level
            label
            studentsNeedingSupport
            studentsUnderstood
            studentsNoResponse
            totalAnalyzed
            supportSummaryLabel
            understoodSummaryLabel
            shortCountLabel
            __typename
          }
          detailStatus
          studentWork
          skillContext
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      pregeneratedNextSteps
      evaluationResults
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteMicroCoachSession = /* GraphQL */ `
  subscription OnDeleteMicroCoachSession(
    $filter: ModelSubscriptionMicroCoachSessionFilterInput
  ) {
    onDeleteMicroCoachSession(filter: $filter) {
      id
      classId
      sessionLabel
      weekLabel
      weekNumber
      topic
      ccssStandards
      status
      publishStatus
      studentWorksAnalyzed
      studentsWithStrongUnderstanding
      studentsWithStrongUnderstandingIds
      studentIdsNeedingSupport
      ppqAssessmentId
      postPpqAssessmentId
      assessments {
        items {
          id
          classId
          sessionId
          assessmentCode
          type
          weekNumber
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      misconceptions {
        items {
          id
          sessionId
          classId
          activities {
            items {
              id
              misconceptionId
              sessionId
              classId
              activityType
              title
              isSelected
              selectLabel
              detailStatus
              routine
              durationMinutes
              durationLabel
              targets
              instructionalMove
              strategyTag
              phases
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
          }
          rank
          badge
          title
          titleCased
          shortLabel
          description
          consequence
          prevalence {
            level
            label
            studentsNeedingSupport
            studentsUnderstood
            studentsNoResponse
            totalAnalyzed
            supportSummaryLabel
            understoodSummaryLabel
            shortCountLabel
            __typename
          }
          detailStatus
          studentWork
          skillContext
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      pregeneratedNextSteps
      evaluationResults
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateMicroCoachAssessment = /* GraphQL */ `
  subscription OnCreateMicroCoachAssessment(
    $filter: ModelSubscriptionMicroCoachAssessmentFilterInput
  ) {
    onCreateMicroCoachAssessment(filter: $filter) {
      id
      classId
      sessionId
      assessmentCode
      type
      weekNumber
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateMicroCoachAssessment = /* GraphQL */ `
  subscription OnUpdateMicroCoachAssessment(
    $filter: ModelSubscriptionMicroCoachAssessmentFilterInput
  ) {
    onUpdateMicroCoachAssessment(filter: $filter) {
      id
      classId
      sessionId
      assessmentCode
      type
      weekNumber
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteMicroCoachAssessment = /* GraphQL */ `
  subscription OnDeleteMicroCoachAssessment(
    $filter: ModelSubscriptionMicroCoachAssessmentFilterInput
  ) {
    onDeleteMicroCoachAssessment(filter: $filter) {
      id
      classId
      sessionId
      assessmentCode
      type
      weekNumber
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateMicroCoachMisconception = /* GraphQL */ `
  subscription OnCreateMicroCoachMisconception(
    $filter: ModelSubscriptionMicroCoachMisconceptionFilterInput
  ) {
    onCreateMicroCoachMisconception(filter: $filter) {
      id
      sessionId
      classId
      activities {
        items {
          id
          misconceptionId
          sessionId
          classId
          activityType
          title
          isSelected
          selectLabel
          detailStatus
          routine
          durationMinutes
          durationLabel
          grouping {
            level
            label
            __typename
          }
          targets
          instructionalMove
          strategyTag
          phases
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      rank
      badge
      title
      titleCased
      shortLabel
      description
      consequence
      prevalence {
        level
        label
        studentsNeedingSupport
        studentsUnderstood
        studentsNoResponse
        totalAnalyzed
        supportSummaryLabel
        understoodSummaryLabel
        shortCountLabel
        __typename
      }
      detailStatus
      studentWork
      skillContext
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateMicroCoachMisconception = /* GraphQL */ `
  subscription OnUpdateMicroCoachMisconception(
    $filter: ModelSubscriptionMicroCoachMisconceptionFilterInput
  ) {
    onUpdateMicroCoachMisconception(filter: $filter) {
      id
      sessionId
      classId
      activities {
        items {
          id
          misconceptionId
          sessionId
          classId
          activityType
          title
          isSelected
          selectLabel
          detailStatus
          routine
          durationMinutes
          durationLabel
          grouping {
            level
            label
            __typename
          }
          targets
          instructionalMove
          strategyTag
          phases
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      rank
      badge
      title
      titleCased
      shortLabel
      description
      consequence
      prevalence {
        level
        label
        studentsNeedingSupport
        studentsUnderstood
        studentsNoResponse
        totalAnalyzed
        supportSummaryLabel
        understoodSummaryLabel
        shortCountLabel
        __typename
      }
      detailStatus
      studentWork
      skillContext
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteMicroCoachMisconception = /* GraphQL */ `
  subscription OnDeleteMicroCoachMisconception(
    $filter: ModelSubscriptionMicroCoachMisconceptionFilterInput
  ) {
    onDeleteMicroCoachMisconception(filter: $filter) {
      id
      sessionId
      classId
      activities {
        items {
          id
          misconceptionId
          sessionId
          classId
          activityType
          title
          isSelected
          selectLabel
          detailStatus
          routine
          durationMinutes
          durationLabel
          grouping {
            level
            label
            __typename
          }
          targets
          instructionalMove
          strategyTag
          phases
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      rank
      badge
      title
      titleCased
      shortLabel
      description
      consequence
      prevalence {
        level
        label
        studentsNeedingSupport
        studentsUnderstood
        studentsNoResponse
        totalAnalyzed
        supportSummaryLabel
        understoodSummaryLabel
        shortCountLabel
        __typename
      }
      detailStatus
      studentWork
      skillContext
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateMicroCoachActivity = /* GraphQL */ `
  subscription OnCreateMicroCoachActivity(
    $filter: ModelSubscriptionMicroCoachActivityFilterInput
  ) {
    onCreateMicroCoachActivity(filter: $filter) {
      id
      misconceptionId
      sessionId
      classId
      activityType
      title
      isSelected
      selectLabel
      detailStatus
      routine
      durationMinutes
      durationLabel
      grouping {
        level
        label
        __typename
      }
      targets
      instructionalMove
      strategyTag
      phases
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateMicroCoachActivity = /* GraphQL */ `
  subscription OnUpdateMicroCoachActivity(
    $filter: ModelSubscriptionMicroCoachActivityFilterInput
  ) {
    onUpdateMicroCoachActivity(filter: $filter) {
      id
      misconceptionId
      sessionId
      classId
      activityType
      title
      isSelected
      selectLabel
      detailStatus
      routine
      durationMinutes
      durationLabel
      grouping {
        level
        label
        __typename
      }
      targets
      instructionalMove
      strategyTag
      phases
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteMicroCoachActivity = /* GraphQL */ `
  subscription OnDeleteMicroCoachActivity(
    $filter: ModelSubscriptionMicroCoachActivityFilterInput
  ) {
    onDeleteMicroCoachActivity(filter: $filter) {
      id
      misconceptionId
      sessionId
      classId
      activityType
      title
      isSelected
      selectLabel
      detailStatus
      routine
      durationMinutes
      durationLabel
      grouping {
        level
        label
        __typename
      }
      targets
      instructionalMove
      strategyTag
      phases
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateMicroCoachSavedPlan = /* GraphQL */ `
  subscription OnCreateMicroCoachSavedPlan(
    $filter: ModelSubscriptionMicroCoachSavedPlanFilterInput
  ) {
    onCreateMicroCoachSavedPlan(filter: $filter) {
      id
      classId
      sessionId
      items {
        id
        status
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateMicroCoachSavedPlan = /* GraphQL */ `
  subscription OnUpdateMicroCoachSavedPlan(
    $filter: ModelSubscriptionMicroCoachSavedPlanFilterInput
  ) {
    onUpdateMicroCoachSavedPlan(filter: $filter) {
      id
      classId
      sessionId
      items {
        id
        status
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteMicroCoachSavedPlan = /* GraphQL */ `
  subscription OnDeleteMicroCoachSavedPlan(
    $filter: ModelSubscriptionMicroCoachSavedPlanFilterInput
  ) {
    onDeleteMicroCoachSavedPlan(filter: $filter) {
      id
      classId
      sessionId
      items {
        id
        status
        __typename
      }
      createdAt
      updatedAt
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
