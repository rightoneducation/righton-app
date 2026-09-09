/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $cognitoId: String
  ) {
    onCreateUser(filter: $filter, cognitoId: $cognitoId) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $cognitoId: String
  ) {
    onUpdateUser(filter: $filter, cognitoId: $cognitoId) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $cognitoId: String
  ) {
    onDeleteUser(filter: $filter, cognitoId: $cognitoId) {
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
export const onCreateClass = /* GraphQL */ `
  subscription OnCreateClass($filter: ModelSubscriptionClassFilterInput) {
    onCreateClass(filter: $filter) {
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
              isRecommendedFocus
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
export const onUpdateClass = /* GraphQL */ `
  subscription OnUpdateClass($filter: ModelSubscriptionClassFilterInput) {
    onUpdateClass(filter: $filter) {
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
              isRecommendedFocus
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
export const onDeleteClass = /* GraphQL */ `
  subscription OnDeleteClass($filter: ModelSubscriptionClassFilterInput) {
    onDeleteClass(filter: $filter) {
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
              isRecommendedFocus
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
export const onCreateStudent = /* GraphQL */ `
  subscription OnCreateStudent($filter: ModelSubscriptionStudentFilterInput) {
    onCreateStudent(filter: $filter) {
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
export const onUpdateStudent = /* GraphQL */ `
  subscription OnUpdateStudent($filter: ModelSubscriptionStudentFilterInput) {
    onUpdateStudent(filter: $filter) {
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
export const onDeleteStudent = /* GraphQL */ `
  subscription OnDeleteStudent($filter: ModelSubscriptionStudentFilterInput) {
    onDeleteStudent(filter: $filter) {
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
export const onCreateSession = /* GraphQL */ `
  subscription OnCreateSession($filter: ModelSubscriptionSessionFilterInput) {
    onCreateSession(filter: $filter) {
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
          isRecommendedFocus
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
export const onUpdateSession = /* GraphQL */ `
  subscription OnUpdateSession($filter: ModelSubscriptionSessionFilterInput) {
    onUpdateSession(filter: $filter) {
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
          isRecommendedFocus
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
export const onDeleteSession = /* GraphQL */ `
  subscription OnDeleteSession($filter: ModelSubscriptionSessionFilterInput) {
    onDeleteSession(filter: $filter) {
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
          isRecommendedFocus
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
export const onCreateAssessment = /* GraphQL */ `
  subscription OnCreateAssessment(
    $filter: ModelSubscriptionAssessmentFilterInput
  ) {
    onCreateAssessment(filter: $filter) {
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
export const onUpdateAssessment = /* GraphQL */ `
  subscription OnUpdateAssessment(
    $filter: ModelSubscriptionAssessmentFilterInput
  ) {
    onUpdateAssessment(filter: $filter) {
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
export const onDeleteAssessment = /* GraphQL */ `
  subscription OnDeleteAssessment(
    $filter: ModelSubscriptionAssessmentFilterInput
  ) {
    onDeleteAssessment(filter: $filter) {
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
export const onCreateMisconception = /* GraphQL */ `
  subscription OnCreateMisconception(
    $filter: ModelSubscriptionMisconceptionFilterInput
  ) {
    onCreateMisconception(filter: $filter) {
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
      isRecommendedFocus
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
export const onUpdateMisconception = /* GraphQL */ `
  subscription OnUpdateMisconception(
    $filter: ModelSubscriptionMisconceptionFilterInput
  ) {
    onUpdateMisconception(filter: $filter) {
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
      isRecommendedFocus
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
export const onDeleteMisconception = /* GraphQL */ `
  subscription OnDeleteMisconception(
    $filter: ModelSubscriptionMisconceptionFilterInput
  ) {
    onDeleteMisconception(filter: $filter) {
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
      isRecommendedFocus
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
export const onCreateActivity = /* GraphQL */ `
  subscription OnCreateActivity($filter: ModelSubscriptionActivityFilterInput) {
    onCreateActivity(filter: $filter) {
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
export const onUpdateActivity = /* GraphQL */ `
  subscription OnUpdateActivity($filter: ModelSubscriptionActivityFilterInput) {
    onUpdateActivity(filter: $filter) {
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
export const onDeleteActivity = /* GraphQL */ `
  subscription OnDeleteActivity($filter: ModelSubscriptionActivityFilterInput) {
    onDeleteActivity(filter: $filter) {
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
export const onCreateSavedPlan = /* GraphQL */ `
  subscription OnCreateSavedPlan(
    $filter: ModelSubscriptionSavedPlanFilterInput
  ) {
    onCreateSavedPlan(filter: $filter) {
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
export const onUpdateSavedPlan = /* GraphQL */ `
  subscription OnUpdateSavedPlan(
    $filter: ModelSubscriptionSavedPlanFilterInput
  ) {
    onUpdateSavedPlan(filter: $filter) {
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
export const onDeleteSavedPlan = /* GraphQL */ `
  subscription OnDeleteSavedPlan(
    $filter: ModelSubscriptionSavedPlanFilterInput
  ) {
    onDeleteSavedPlan(filter: $filter) {
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
