/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../AWSAPI";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getMicroCoachUser = /* GraphQL */ `query GetMicroCoachUser($id: ID!) {
  getMicroCoachUser(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMicroCoachUserQueryVariables,
  APITypes.GetMicroCoachUserQuery
>;
export const listMicroCoachUsers = /* GraphQL */ `query ListMicroCoachUsers(
  $filter: ModelMicroCoachUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listMicroCoachUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
            nextToken
            __typename
          }
          students {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMicroCoachUsersQueryVariables,
  APITypes.ListMicroCoachUsersQuery
>;
export const getMicroCoachClassroom = /* GraphQL */ `query GetMicroCoachClassroom($id: ID!) {
  getMicroCoachClassroom(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMicroCoachClassroomQueryVariables,
  APITypes.GetMicroCoachClassroomQuery
>;
export const listMicroCoachClassrooms = /* GraphQL */ `query ListMicroCoachClassrooms(
  $filter: ModelMicroCoachClassroomFilterInput
  $limit: Int
  $nextToken: String
) {
  listMicroCoachClassrooms(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
          assessments {
            nextToken
            __typename
          }
          misconceptions {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMicroCoachClassroomsQueryVariables,
  APITypes.ListMicroCoachClassroomsQuery
>;
export const getMicroCoachStudent = /* GraphQL */ `query GetMicroCoachStudent($id: ID!) {
  getMicroCoachStudent(id: $id) {
    id
    classId
    name
    externalId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMicroCoachStudentQueryVariables,
  APITypes.GetMicroCoachStudentQuery
>;
export const listMicroCoachStudents = /* GraphQL */ `query ListMicroCoachStudents(
  $filter: ModelMicroCoachStudentFilterInput
  $limit: Int
  $nextToken: String
) {
  listMicroCoachStudents(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
}
` as GeneratedQuery<
  APITypes.ListMicroCoachStudentsQueryVariables,
  APITypes.ListMicroCoachStudentsQuery
>;
export const getMicroCoachSession = /* GraphQL */ `query GetMicroCoachSession($id: ID!) {
  getMicroCoachSession(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMicroCoachSessionQueryVariables,
  APITypes.GetMicroCoachSessionQuery
>;
export const listMicroCoachSessions = /* GraphQL */ `query ListMicroCoachSessions(
  $filter: ModelMicroCoachSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  listMicroCoachSessions(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
          activities {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMicroCoachSessionsQueryVariables,
  APITypes.ListMicroCoachSessionsQuery
>;
export const getMicroCoachAssessment = /* GraphQL */ `query GetMicroCoachAssessment($id: ID!) {
  getMicroCoachAssessment(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMicroCoachAssessmentQueryVariables,
  APITypes.GetMicroCoachAssessmentQuery
>;
export const listMicroCoachAssessments = /* GraphQL */ `query ListMicroCoachAssessments(
  $filter: ModelMicroCoachAssessmentFilterInput
  $limit: Int
  $nextToken: String
) {
  listMicroCoachAssessments(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
}
` as GeneratedQuery<
  APITypes.ListMicroCoachAssessmentsQueryVariables,
  APITypes.ListMicroCoachAssessmentsQuery
>;
export const getMicroCoachMisconception = /* GraphQL */ `query GetMicroCoachMisconception($id: ID!) {
  getMicroCoachMisconception(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMicroCoachMisconceptionQueryVariables,
  APITypes.GetMicroCoachMisconceptionQuery
>;
export const listMicroCoachMisconceptions = /* GraphQL */ `query ListMicroCoachMisconceptions(
  $filter: ModelMicroCoachMisconceptionFilterInput
  $limit: Int
  $nextToken: String
) {
  listMicroCoachMisconceptions(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMicroCoachMisconceptionsQueryVariables,
  APITypes.ListMicroCoachMisconceptionsQuery
>;
export const getMicroCoachActivity = /* GraphQL */ `query GetMicroCoachActivity($id: ID!) {
  getMicroCoachActivity(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMicroCoachActivityQueryVariables,
  APITypes.GetMicroCoachActivityQuery
>;
export const listMicroCoachActivities = /* GraphQL */ `query ListMicroCoachActivities(
  $filter: ModelMicroCoachActivityFilterInput
  $limit: Int
  $nextToken: String
) {
  listMicroCoachActivities(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
}
` as GeneratedQuery<
  APITypes.ListMicroCoachActivitiesQueryVariables,
  APITypes.ListMicroCoachActivitiesQuery
>;
export const getMicroCoachSavedPlan = /* GraphQL */ `query GetMicroCoachSavedPlan($id: ID!) {
  getMicroCoachSavedPlan(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMicroCoachSavedPlanQueryVariables,
  APITypes.GetMicroCoachSavedPlanQuery
>;
export const listMicroCoachSavedPlans = /* GraphQL */ `query ListMicroCoachSavedPlans(
  $filter: ModelMicroCoachSavedPlanFilterInput
  $limit: Int
  $nextToken: String
) {
  listMicroCoachSavedPlans(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMicroCoachSavedPlansQueryVariables,
  APITypes.ListMicroCoachSavedPlansQuery
>;
export const usersByCognitoId = /* GraphQL */ `query UsersByCognitoId(
  $cognitoId: String!
  $sortDirection: ModelSortDirection
  $filter: ModelMicroCoachUserFilterInput
  $limit: Int
  $nextToken: String
) {
  usersByCognitoId(
    cognitoId: $cognitoId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
            nextToken
            __typename
          }
          students {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UsersByCognitoIdQueryVariables,
  APITypes.UsersByCognitoIdQuery
>;
export const usersByEmail = /* GraphQL */ `query UsersByEmail(
  $email: String!
  $sortDirection: ModelSortDirection
  $filter: ModelMicroCoachUserFilterInput
  $limit: Int
  $nextToken: String
) {
  usersByEmail(
    email: $email
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
            nextToken
            __typename
          }
          students {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UsersByEmailQueryVariables,
  APITypes.UsersByEmailQuery
>;
export const usersByRole = /* GraphQL */ `query UsersByRole(
  $role: UserRole!
  $sortDirection: ModelSortDirection
  $filter: ModelMicroCoachUserFilterInput
  $limit: Int
  $nextToken: String
) {
  usersByRole(
    role: $role
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
            nextToken
            __typename
          }
          students {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UsersByRoleQueryVariables,
  APITypes.UsersByRoleQuery
>;
export const microCoachClassroomsByUserId = /* GraphQL */ `query MicroCoachClassroomsByUserId(
  $userId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMicroCoachClassroomFilterInput
  $limit: Int
  $nextToken: String
) {
  microCoachClassroomsByUserId(
    userId: $userId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
          assessments {
            nextToken
            __typename
          }
          misconceptions {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MicroCoachClassroomsByUserIdQueryVariables,
  APITypes.MicroCoachClassroomsByUserIdQuery
>;
export const microCoachStudentsByClassId = /* GraphQL */ `query MicroCoachStudentsByClassId(
  $classId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMicroCoachStudentFilterInput
  $limit: Int
  $nextToken: String
) {
  microCoachStudentsByClassId(
    classId: $classId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
}
` as GeneratedQuery<
  APITypes.MicroCoachStudentsByClassIdQueryVariables,
  APITypes.MicroCoachStudentsByClassIdQuery
>;
export const microCoachSessionsByClassId = /* GraphQL */ `query MicroCoachSessionsByClassId(
  $classId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMicroCoachSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  microCoachSessionsByClassId(
    classId: $classId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
          activities {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MicroCoachSessionsByClassIdQueryVariables,
  APITypes.MicroCoachSessionsByClassIdQuery
>;
export const microCoachAssessmentsByClassId = /* GraphQL */ `query MicroCoachAssessmentsByClassId(
  $classId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMicroCoachAssessmentFilterInput
  $limit: Int
  $nextToken: String
) {
  microCoachAssessmentsByClassId(
    classId: $classId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
}
` as GeneratedQuery<
  APITypes.MicroCoachAssessmentsByClassIdQueryVariables,
  APITypes.MicroCoachAssessmentsByClassIdQuery
>;
export const microCoachAssessmentsBySessionId = /* GraphQL */ `query MicroCoachAssessmentsBySessionId(
  $sessionId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMicroCoachAssessmentFilterInput
  $limit: Int
  $nextToken: String
) {
  microCoachAssessmentsBySessionId(
    sessionId: $sessionId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
}
` as GeneratedQuery<
  APITypes.MicroCoachAssessmentsBySessionIdQueryVariables,
  APITypes.MicroCoachAssessmentsBySessionIdQuery
>;
export const microCoachMisconceptionsBySessionId = /* GraphQL */ `query MicroCoachMisconceptionsBySessionId(
  $sessionId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMicroCoachMisconceptionFilterInput
  $limit: Int
  $nextToken: String
) {
  microCoachMisconceptionsBySessionId(
    sessionId: $sessionId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MicroCoachMisconceptionsBySessionIdQueryVariables,
  APITypes.MicroCoachMisconceptionsBySessionIdQuery
>;
export const microCoachMisconceptionsByClassId = /* GraphQL */ `query MicroCoachMisconceptionsByClassId(
  $classId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMicroCoachMisconceptionFilterInput
  $limit: Int
  $nextToken: String
) {
  microCoachMisconceptionsByClassId(
    classId: $classId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MicroCoachMisconceptionsByClassIdQueryVariables,
  APITypes.MicroCoachMisconceptionsByClassIdQuery
>;
export const microCoachActivitiesByMisconceptionId = /* GraphQL */ `query MicroCoachActivitiesByMisconceptionId(
  $misconceptionId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMicroCoachActivityFilterInput
  $limit: Int
  $nextToken: String
) {
  microCoachActivitiesByMisconceptionId(
    misconceptionId: $misconceptionId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
}
` as GeneratedQuery<
  APITypes.MicroCoachActivitiesByMisconceptionIdQueryVariables,
  APITypes.MicroCoachActivitiesByMisconceptionIdQuery
>;
export const microCoachActivitiesBySessionId = /* GraphQL */ `query MicroCoachActivitiesBySessionId(
  $sessionId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMicroCoachActivityFilterInput
  $limit: Int
  $nextToken: String
) {
  microCoachActivitiesBySessionId(
    sessionId: $sessionId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
}
` as GeneratedQuery<
  APITypes.MicroCoachActivitiesBySessionIdQueryVariables,
  APITypes.MicroCoachActivitiesBySessionIdQuery
>;
export const microCoachActivitiesByClassId = /* GraphQL */ `query MicroCoachActivitiesByClassId(
  $classId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMicroCoachActivityFilterInput
  $limit: Int
  $nextToken: String
) {
  microCoachActivitiesByClassId(
    classId: $classId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
}
` as GeneratedQuery<
  APITypes.MicroCoachActivitiesByClassIdQueryVariables,
  APITypes.MicroCoachActivitiesByClassIdQuery
>;
export const microCoachSavedPlansByClassId = /* GraphQL */ `query MicroCoachSavedPlansByClassId(
  $classId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMicroCoachSavedPlanFilterInput
  $limit: Int
  $nextToken: String
) {
  microCoachSavedPlansByClassId(
    classId: $classId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MicroCoachSavedPlansByClassIdQueryVariables,
  APITypes.MicroCoachSavedPlansByClassIdQuery
>;
export const microCoachSavedPlansBySessionId = /* GraphQL */ `query MicroCoachSavedPlansBySessionId(
  $sessionId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMicroCoachSavedPlanFilterInput
  $limit: Int
  $nextToken: String
) {
  microCoachSavedPlansBySessionId(
    sessionId: $sessionId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MicroCoachSavedPlansBySessionIdQueryVariables,
  APITypes.MicroCoachSavedPlansBySessionIdQuery
>;
export const getContextData = /* GraphQL */ `query GetContextData($id: ID!) {
  getContextData(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetContextDataQueryVariables,
  APITypes.GetContextDataQuery
>;
export const listContextData = /* GraphQL */ `query ListContextData(
  $filter: ModelContextDataFilterInput
  $limit: Int
  $nextToken: String
) {
  listContextData(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListContextDataQueryVariables,
  APITypes.ListContextDataQuery
>;
export const getMicroCoachPipelineRun = /* GraphQL */ `query GetMicroCoachPipelineRun($id: ID!) {
  getMicroCoachPipelineRun(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMicroCoachPipelineRunQueryVariables,
  APITypes.GetMicroCoachPipelineRunQuery
>;
export const listMicroCoachPipelineRuns = /* GraphQL */ `query ListMicroCoachPipelineRuns(
  $filter: ModelMicroCoachPipelineRunFilterInput
  $limit: Int
  $nextToken: String
) {
  listMicroCoachPipelineRuns(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMicroCoachPipelineRunsQueryVariables,
  APITypes.ListMicroCoachPipelineRunsQuery
>;
export const getMicroCoachPipelineRun = /* GraphQL */ `
  query GetMicroCoachPipelineRun($id: ID!) {
    getMicroCoachPipelineRun(id: $id) {
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
export const listMicroCoachPipelineRuns = /* GraphQL */ `
  query ListMicroCoachPipelineRuns(
    $filter: ModelMicroCoachPipelineRunFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMicroCoachPipelineRuns(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
