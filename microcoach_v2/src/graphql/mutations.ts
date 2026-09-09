/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      cognitoId
      email
      name
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      cognitoId
      email
      name
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      cognitoId
      email
      name
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
export const createClass = /* GraphQL */ `
  mutation CreateClass(
    $input: CreateClassInput!
    $condition: ModelClassConditionInput
  ) {
    createClass(input: $input, condition: $condition) {
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
export const updateClass = /* GraphQL */ `
  mutation UpdateClass(
    $input: UpdateClassInput!
    $condition: ModelClassConditionInput
  ) {
    updateClass(input: $input, condition: $condition) {
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
export const deleteClass = /* GraphQL */ `
  mutation DeleteClass(
    $input: DeleteClassInput!
    $condition: ModelClassConditionInput
  ) {
    deleteClass(input: $input, condition: $condition) {
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
export const createStudent = /* GraphQL */ `
  mutation CreateStudent(
    $input: CreateStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    createStudent(input: $input, condition: $condition) {
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
export const updateStudent = /* GraphQL */ `
  mutation UpdateStudent(
    $input: UpdateStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    updateStudent(input: $input, condition: $condition) {
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
export const deleteStudent = /* GraphQL */ `
  mutation DeleteStudent(
    $input: DeleteStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    deleteStudent(input: $input, condition: $condition) {
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
export const createSession = /* GraphQL */ `
  mutation CreateSession(
    $input: CreateSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    createSession(input: $input, condition: $condition) {
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
export const updateSession = /* GraphQL */ `
  mutation UpdateSession(
    $input: UpdateSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    updateSession(input: $input, condition: $condition) {
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
export const deleteSession = /* GraphQL */ `
  mutation DeleteSession(
    $input: DeleteSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    deleteSession(input: $input, condition: $condition) {
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
export const createAssessment = /* GraphQL */ `
  mutation CreateAssessment(
    $input: CreateAssessmentInput!
    $condition: ModelAssessmentConditionInput
  ) {
    createAssessment(input: $input, condition: $condition) {
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
export const updateAssessment = /* GraphQL */ `
  mutation UpdateAssessment(
    $input: UpdateAssessmentInput!
    $condition: ModelAssessmentConditionInput
  ) {
    updateAssessment(input: $input, condition: $condition) {
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
export const deleteAssessment = /* GraphQL */ `
  mutation DeleteAssessment(
    $input: DeleteAssessmentInput!
    $condition: ModelAssessmentConditionInput
  ) {
    deleteAssessment(input: $input, condition: $condition) {
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
export const createMisconception = /* GraphQL */ `
  mutation CreateMisconception(
    $input: CreateMisconceptionInput!
    $condition: ModelMisconceptionConditionInput
  ) {
    createMisconception(input: $input, condition: $condition) {
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
export const updateMisconception = /* GraphQL */ `
  mutation UpdateMisconception(
    $input: UpdateMisconceptionInput!
    $condition: ModelMisconceptionConditionInput
  ) {
    updateMisconception(input: $input, condition: $condition) {
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
export const deleteMisconception = /* GraphQL */ `
  mutation DeleteMisconception(
    $input: DeleteMisconceptionInput!
    $condition: ModelMisconceptionConditionInput
  ) {
    deleteMisconception(input: $input, condition: $condition) {
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
export const createActivity = /* GraphQL */ `
  mutation CreateActivity(
    $input: CreateActivityInput!
    $condition: ModelActivityConditionInput
  ) {
    createActivity(input: $input, condition: $condition) {
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
export const updateActivity = /* GraphQL */ `
  mutation UpdateActivity(
    $input: UpdateActivityInput!
    $condition: ModelActivityConditionInput
  ) {
    updateActivity(input: $input, condition: $condition) {
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
export const deleteActivity = /* GraphQL */ `
  mutation DeleteActivity(
    $input: DeleteActivityInput!
    $condition: ModelActivityConditionInput
  ) {
    deleteActivity(input: $input, condition: $condition) {
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
export const createSavedPlan = /* GraphQL */ `
  mutation CreateSavedPlan(
    $input: CreateSavedPlanInput!
    $condition: ModelSavedPlanConditionInput
  ) {
    createSavedPlan(input: $input, condition: $condition) {
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
export const updateSavedPlan = /* GraphQL */ `
  mutation UpdateSavedPlan(
    $input: UpdateSavedPlanInput!
    $condition: ModelSavedPlanConditionInput
  ) {
    updateSavedPlan(input: $input, condition: $condition) {
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
export const deleteSavedPlan = /* GraphQL */ `
  mutation DeleteSavedPlan(
    $input: DeleteSavedPlanInput!
    $condition: ModelSavedPlanConditionInput
  ) {
    deleteSavedPlan(input: $input, condition: $condition) {
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
