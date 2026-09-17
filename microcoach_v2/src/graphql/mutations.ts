/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../AWSAPI";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createMicroCoachUser = /* GraphQL */ `mutation CreateMicroCoachUser(
  $input: CreateMicroCoachUserInput!
  $condition: ModelMicroCoachUserConditionInput
) {
  createMicroCoachUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateMicroCoachUserMutationVariables,
  APITypes.CreateMicroCoachUserMutation
>;
export const updateMicroCoachUser = /* GraphQL */ `mutation UpdateMicroCoachUser(
  $input: UpdateMicroCoachUserInput!
  $condition: ModelMicroCoachUserConditionInput
) {
  updateMicroCoachUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateMicroCoachUserMutationVariables,
  APITypes.UpdateMicroCoachUserMutation
>;
export const deleteMicroCoachUser = /* GraphQL */ `mutation DeleteMicroCoachUser(
  $input: DeleteMicroCoachUserInput!
  $condition: ModelMicroCoachUserConditionInput
) {
  deleteMicroCoachUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteMicroCoachUserMutationVariables,
  APITypes.DeleteMicroCoachUserMutation
>;
export const createMicroCoachClassroom = /* GraphQL */ `mutation CreateMicroCoachClassroom(
  $input: CreateMicroCoachClassroomInput!
  $condition: ModelMicroCoachClassroomConditionInput
) {
  createMicroCoachClassroom(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateMicroCoachClassroomMutationVariables,
  APITypes.CreateMicroCoachClassroomMutation
>;
export const updateMicroCoachClassroom = /* GraphQL */ `mutation UpdateMicroCoachClassroom(
  $input: UpdateMicroCoachClassroomInput!
  $condition: ModelMicroCoachClassroomConditionInput
) {
  updateMicroCoachClassroom(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateMicroCoachClassroomMutationVariables,
  APITypes.UpdateMicroCoachClassroomMutation
>;
export const deleteMicroCoachClassroom = /* GraphQL */ `mutation DeleteMicroCoachClassroom(
  $input: DeleteMicroCoachClassroomInput!
  $condition: ModelMicroCoachClassroomConditionInput
) {
  deleteMicroCoachClassroom(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteMicroCoachClassroomMutationVariables,
  APITypes.DeleteMicroCoachClassroomMutation
>;
export const createMicroCoachStudent = /* GraphQL */ `mutation CreateMicroCoachStudent(
  $input: CreateMicroCoachStudentInput!
  $condition: ModelMicroCoachStudentConditionInput
) {
  createMicroCoachStudent(input: $input, condition: $condition) {
    id
    classId
    name
    externalId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateMicroCoachStudentMutationVariables,
  APITypes.CreateMicroCoachStudentMutation
>;
export const updateMicroCoachStudent = /* GraphQL */ `mutation UpdateMicroCoachStudent(
  $input: UpdateMicroCoachStudentInput!
  $condition: ModelMicroCoachStudentConditionInput
) {
  updateMicroCoachStudent(input: $input, condition: $condition) {
    id
    classId
    name
    externalId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateMicroCoachStudentMutationVariables,
  APITypes.UpdateMicroCoachStudentMutation
>;
export const deleteMicroCoachStudent = /* GraphQL */ `mutation DeleteMicroCoachStudent(
  $input: DeleteMicroCoachStudentInput!
  $condition: ModelMicroCoachStudentConditionInput
) {
  deleteMicroCoachStudent(input: $input, condition: $condition) {
    id
    classId
    name
    externalId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteMicroCoachStudentMutationVariables,
  APITypes.DeleteMicroCoachStudentMutation
>;
export const createMicroCoachSession = /* GraphQL */ `mutation CreateMicroCoachSession(
  $input: CreateMicroCoachSessionInput!
  $condition: ModelMicroCoachSessionConditionInput
) {
  createMicroCoachSession(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateMicroCoachSessionMutationVariables,
  APITypes.CreateMicroCoachSessionMutation
>;
export const updateMicroCoachSession = /* GraphQL */ `mutation UpdateMicroCoachSession(
  $input: UpdateMicroCoachSessionInput!
  $condition: ModelMicroCoachSessionConditionInput
) {
  updateMicroCoachSession(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateMicroCoachSessionMutationVariables,
  APITypes.UpdateMicroCoachSessionMutation
>;
export const deleteMicroCoachSession = /* GraphQL */ `mutation DeleteMicroCoachSession(
  $input: DeleteMicroCoachSessionInput!
  $condition: ModelMicroCoachSessionConditionInput
) {
  deleteMicroCoachSession(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteMicroCoachSessionMutationVariables,
  APITypes.DeleteMicroCoachSessionMutation
>;
export const createMicroCoachAssessment = /* GraphQL */ `mutation CreateMicroCoachAssessment(
  $input: CreateMicroCoachAssessmentInput!
  $condition: ModelMicroCoachAssessmentConditionInput
) {
  createMicroCoachAssessment(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateMicroCoachAssessmentMutationVariables,
  APITypes.CreateMicroCoachAssessmentMutation
>;
export const updateMicroCoachAssessment = /* GraphQL */ `mutation UpdateMicroCoachAssessment(
  $input: UpdateMicroCoachAssessmentInput!
  $condition: ModelMicroCoachAssessmentConditionInput
) {
  updateMicroCoachAssessment(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateMicroCoachAssessmentMutationVariables,
  APITypes.UpdateMicroCoachAssessmentMutation
>;
export const deleteMicroCoachAssessment = /* GraphQL */ `mutation DeleteMicroCoachAssessment(
  $input: DeleteMicroCoachAssessmentInput!
  $condition: ModelMicroCoachAssessmentConditionInput
) {
  deleteMicroCoachAssessment(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteMicroCoachAssessmentMutationVariables,
  APITypes.DeleteMicroCoachAssessmentMutation
>;
export const createMicroCoachMisconception = /* GraphQL */ `mutation CreateMicroCoachMisconception(
  $input: CreateMicroCoachMisconceptionInput!
  $condition: ModelMicroCoachMisconceptionConditionInput
) {
  createMicroCoachMisconception(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateMicroCoachMisconceptionMutationVariables,
  APITypes.CreateMicroCoachMisconceptionMutation
>;
export const updateMicroCoachMisconception = /* GraphQL */ `mutation UpdateMicroCoachMisconception(
  $input: UpdateMicroCoachMisconceptionInput!
  $condition: ModelMicroCoachMisconceptionConditionInput
) {
  updateMicroCoachMisconception(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateMicroCoachMisconceptionMutationVariables,
  APITypes.UpdateMicroCoachMisconceptionMutation
>;
export const deleteMicroCoachMisconception = /* GraphQL */ `mutation DeleteMicroCoachMisconception(
  $input: DeleteMicroCoachMisconceptionInput!
  $condition: ModelMicroCoachMisconceptionConditionInput
) {
  deleteMicroCoachMisconception(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteMicroCoachMisconceptionMutationVariables,
  APITypes.DeleteMicroCoachMisconceptionMutation
>;
export const createMicroCoachActivity = /* GraphQL */ `mutation CreateMicroCoachActivity(
  $input: CreateMicroCoachActivityInput!
  $condition: ModelMicroCoachActivityConditionInput
) {
  createMicroCoachActivity(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateMicroCoachActivityMutationVariables,
  APITypes.CreateMicroCoachActivityMutation
>;
export const updateMicroCoachActivity = /* GraphQL */ `mutation UpdateMicroCoachActivity(
  $input: UpdateMicroCoachActivityInput!
  $condition: ModelMicroCoachActivityConditionInput
) {
  updateMicroCoachActivity(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateMicroCoachActivityMutationVariables,
  APITypes.UpdateMicroCoachActivityMutation
>;
export const deleteMicroCoachActivity = /* GraphQL */ `mutation DeleteMicroCoachActivity(
  $input: DeleteMicroCoachActivityInput!
  $condition: ModelMicroCoachActivityConditionInput
) {
  deleteMicroCoachActivity(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteMicroCoachActivityMutationVariables,
  APITypes.DeleteMicroCoachActivityMutation
>;
export const createMicroCoachSavedPlan = /* GraphQL */ `mutation CreateMicroCoachSavedPlan(
  $input: CreateMicroCoachSavedPlanInput!
  $condition: ModelMicroCoachSavedPlanConditionInput
) {
  createMicroCoachSavedPlan(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateMicroCoachSavedPlanMutationVariables,
  APITypes.CreateMicroCoachSavedPlanMutation
>;
export const updateMicroCoachSavedPlan = /* GraphQL */ `mutation UpdateMicroCoachSavedPlan(
  $input: UpdateMicroCoachSavedPlanInput!
  $condition: ModelMicroCoachSavedPlanConditionInput
) {
  updateMicroCoachSavedPlan(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateMicroCoachSavedPlanMutationVariables,
  APITypes.UpdateMicroCoachSavedPlanMutation
>;
export const deleteMicroCoachSavedPlan = /* GraphQL */ `mutation DeleteMicroCoachSavedPlan(
  $input: DeleteMicroCoachSavedPlanInput!
  $condition: ModelMicroCoachSavedPlanConditionInput
) {
  deleteMicroCoachSavedPlan(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteMicroCoachSavedPlanMutationVariables,
  APITypes.DeleteMicroCoachSavedPlanMutation
>;
export const createContextData = /* GraphQL */ `mutation CreateContextData(
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
` as GeneratedMutation<
  APITypes.CreateContextDataMutationVariables,
  APITypes.CreateContextDataMutation
>;
export const updateContextData = /* GraphQL */ `mutation UpdateContextData(
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
` as GeneratedMutation<
  APITypes.UpdateContextDataMutationVariables,
  APITypes.UpdateContextDataMutation
>;
export const deleteContextData = /* GraphQL */ `mutation DeleteContextData(
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
` as GeneratedMutation<
  APITypes.DeleteContextDataMutationVariables,
  APITypes.DeleteContextDataMutation
>;
export const createMicroCoachPipelineRun = /* GraphQL */ `mutation CreateMicroCoachPipelineRun(
  $input: CreateMicroCoachPipelineRunInput!
  $condition: ModelMicroCoachPipelineRunConditionInput
) {
  createMicroCoachPipelineRun(input: $input, condition: $condition) {
    id
    classroomName
    sessionLabel
    condition
    version
    gitSha
    amplifyEnv
    startedAt
    misconceptionCount
    manifest
    output
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateMicroCoachPipelineRunMutationVariables,
  APITypes.CreateMicroCoachPipelineRunMutation
>;
export const updateMicroCoachPipelineRun = /* GraphQL */ `mutation UpdateMicroCoachPipelineRun(
  $input: UpdateMicroCoachPipelineRunInput!
  $condition: ModelMicroCoachPipelineRunConditionInput
) {
  updateMicroCoachPipelineRun(input: $input, condition: $condition) {
    id
    classroomName
    sessionLabel
    condition
    version
    gitSha
    amplifyEnv
    startedAt
    misconceptionCount
    manifest
    output
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateMicroCoachPipelineRunMutationVariables,
  APITypes.UpdateMicroCoachPipelineRunMutation
>;
export const deleteMicroCoachPipelineRun = /* GraphQL */ `mutation DeleteMicroCoachPipelineRun(
  $input: DeleteMicroCoachPipelineRunInput!
  $condition: ModelMicroCoachPipelineRunConditionInput
) {
  deleteMicroCoachPipelineRun(input: $input, condition: $condition) {
    id
    classroomName
    sessionLabel
    condition
    version
    gitSha
    amplifyEnv
    startedAt
    misconceptionCount
    manifest
    output
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteMicroCoachPipelineRunMutationVariables,
  APITypes.DeleteMicroCoachPipelineRunMutation
>;
export const createMicroCoachPipelineRun = /* GraphQL */ `
  mutation CreateMicroCoachPipelineRun(
    $input: CreateMicroCoachPipelineRunInput!
    $condition: ModelMicroCoachPipelineRunConditionInput
  ) {
    createMicroCoachPipelineRun(input: $input, condition: $condition) {
      id
      classroomName
      sessionLabel
      condition
      version
      gitSha
      amplifyEnv
      startedAt
      misconceptionCount
      manifest
      output
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateMicroCoachPipelineRun = /* GraphQL */ `
  mutation UpdateMicroCoachPipelineRun(
    $input: UpdateMicroCoachPipelineRunInput!
    $condition: ModelMicroCoachPipelineRunConditionInput
  ) {
    updateMicroCoachPipelineRun(input: $input, condition: $condition) {
      id
      classroomName
      sessionLabel
      condition
      version
      gitSha
      amplifyEnv
      startedAt
      misconceptionCount
      manifest
      output
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteMicroCoachPipelineRun = /* GraphQL */ `
  mutation DeleteMicroCoachPipelineRun(
    $input: DeleteMicroCoachPipelineRunInput!
    $condition: ModelMicroCoachPipelineRunConditionInput
  ) {
    deleteMicroCoachPipelineRun(input: $input, condition: $condition) {
      id
      classroomName
      sessionLabel
      condition
      version
      gitSha
      amplifyEnv
      startedAt
      misconceptionCount
      manifest
      output
      createdAt
      updatedAt
      __typename
    }
  }
`;
