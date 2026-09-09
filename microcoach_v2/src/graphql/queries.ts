/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        cognitoId
        email
        name
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
`;
export const getClass = /* GraphQL */ `
  query GetClass($id: ID!) {
    getClass(id: $id) {
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
export const listClasses = /* GraphQL */ `
  query ListClasses(
    $filter: ModelClassFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClasses(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
`;
export const getStudent = /* GraphQL */ `
  query GetStudent($id: ID!) {
    getStudent(id: $id) {
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
export const listStudents = /* GraphQL */ `
  query ListStudents(
    $filter: ModelStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStudents(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
`;
export const getSession = /* GraphQL */ `
  query GetSession($id: ID!) {
    getSession(id: $id) {
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
export const listSessions = /* GraphQL */ `
  query ListSessions(
    $filter: ModelSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
            activities {
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
      nextToken
      __typename
    }
  }
`;
export const getAssessment = /* GraphQL */ `
  query GetAssessment($id: ID!) {
    getAssessment(id: $id) {
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
export const listAssessments = /* GraphQL */ `
  query ListAssessments(
    $filter: ModelAssessmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAssessments(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
`;
export const getMisconception = /* GraphQL */ `
  query GetMisconception($id: ID!) {
    getMisconception(id: $id) {
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
export const listMisconceptions = /* GraphQL */ `
  query ListMisconceptions(
    $filter: ModelMisconceptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMisconceptions(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const getActivity = /* GraphQL */ `
  query GetActivity($id: ID!) {
    getActivity(id: $id) {
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
export const listActivities = /* GraphQL */ `
  query ListActivities(
    $filter: ModelActivityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listActivities(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
`;
export const getSavedPlan = /* GraphQL */ `
  query GetSavedPlan($id: ID!) {
    getSavedPlan(id: $id) {
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
export const listSavedPlans = /* GraphQL */ `
  query ListSavedPlans(
    $filter: ModelSavedPlanFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSavedPlans(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
`;
export const usersByCognitoId = /* GraphQL */ `
  query UsersByCognitoId(
    $cognitoId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
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
        name
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
`;
export const usersByEmail = /* GraphQL */ `
  query UsersByEmail(
    $email: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
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
        name
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
`;
export const usersByRole = /* GraphQL */ `
  query UsersByRole(
    $role: UserRole!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
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
        name
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
`;
export const classesByUserId = /* GraphQL */ `
  query ClassesByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelClassFilterInput
    $limit: Int
    $nextToken: String
  ) {
    classesByUserId(
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
`;
export const studentsByClassId = /* GraphQL */ `
  query StudentsByClassId(
    $classId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    studentsByClassId(
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
`;
export const sessionsByClassId = /* GraphQL */ `
  query SessionsByClassId(
    $classId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    sessionsByClassId(
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
      nextToken
      __typename
    }
  }
`;
export const assessmentsByClassId = /* GraphQL */ `
  query AssessmentsByClassId(
    $classId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelAssessmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    assessmentsByClassId(
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
`;
export const assessmentsBySessionId = /* GraphQL */ `
  query AssessmentsBySessionId(
    $sessionId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelAssessmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    assessmentsBySessionId(
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
`;
export const misconceptionsBySessionId = /* GraphQL */ `
  query MisconceptionsBySessionId(
    $sessionId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMisconceptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    misconceptionsBySessionId(
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
  }
`;
export const misconceptionsByClassId = /* GraphQL */ `
  query MisconceptionsByClassId(
    $classId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMisconceptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    misconceptionsByClassId(
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
  }
`;
export const activitiesByMisconceptionId = /* GraphQL */ `
  query ActivitiesByMisconceptionId(
    $misconceptionId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelActivityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    activitiesByMisconceptionId(
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
`;
export const activitiesBySessionId = /* GraphQL */ `
  query ActivitiesBySessionId(
    $sessionId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelActivityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    activitiesBySessionId(
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
`;
export const activitiesByClassId = /* GraphQL */ `
  query ActivitiesByClassId(
    $classId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelActivityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    activitiesByClassId(
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
`;
export const savedPlansByClassId = /* GraphQL */ `
  query SavedPlansByClassId(
    $classId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelSavedPlanFilterInput
    $limit: Int
    $nextToken: String
  ) {
    savedPlansByClassId(
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
`;
export const savedPlansBySessionId = /* GraphQL */ `
  query SavedPlansBySessionId(
    $sessionId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelSavedPlanFilterInput
    $limit: Int
    $nextToken: String
  ) {
    savedPlansBySessionId(
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
`;
