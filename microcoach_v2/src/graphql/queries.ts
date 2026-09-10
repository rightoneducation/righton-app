/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMicroCoachUser = /* GraphQL */ `
  query GetMicroCoachUser($id: ID!) {
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
`;
export const listMicroCoachUsers = /* GraphQL */ `
  query ListMicroCoachUsers(
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
`;
export const getMicroCoachClassroom = /* GraphQL */ `
  query GetMicroCoachClassroom($id: ID!) {
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
`;
export const listMicroCoachClassrooms = /* GraphQL */ `
  query ListMicroCoachClassrooms(
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
`;
export const getMicroCoachStudent = /* GraphQL */ `
  query GetMicroCoachStudent($id: ID!) {
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
`;
export const listMicroCoachStudents = /* GraphQL */ `
  query ListMicroCoachStudents(
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
`;
export const getMicroCoachSession = /* GraphQL */ `
  query GetMicroCoachSession($id: ID!) {
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
`;
export const listMicroCoachSessions = /* GraphQL */ `
  query ListMicroCoachSessions(
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
`;
export const getMicroCoachAssessment = /* GraphQL */ `
  query GetMicroCoachAssessment($id: ID!) {
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
`;
export const listMicroCoachAssessments = /* GraphQL */ `
  query ListMicroCoachAssessments(
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
`;
export const getMicroCoachMisconception = /* GraphQL */ `
  query GetMicroCoachMisconception($id: ID!) {
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
`;
export const listMicroCoachMisconceptions = /* GraphQL */ `
  query ListMicroCoachMisconceptions(
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
`;
export const getMicroCoachActivity = /* GraphQL */ `
  query GetMicroCoachActivity($id: ID!) {
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
`;
export const listMicroCoachActivities = /* GraphQL */ `
  query ListMicroCoachActivities(
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
`;
export const getMicroCoachSavedPlan = /* GraphQL */ `
  query GetMicroCoachSavedPlan($id: ID!) {
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
`;
export const listMicroCoachSavedPlans = /* GraphQL */ `
  query ListMicroCoachSavedPlans(
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
`;
export const usersByCognitoId = /* GraphQL */ `
  query UsersByCognitoId(
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
`;
export const usersByEmail = /* GraphQL */ `
  query UsersByEmail(
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
`;
export const usersByRole = /* GraphQL */ `
  query UsersByRole(
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
`;
export const microCoachClassroomsByUserId = /* GraphQL */ `
  query MicroCoachClassroomsByUserId(
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
`;
export const microCoachStudentsByClassId = /* GraphQL */ `
  query MicroCoachStudentsByClassId(
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
`;
export const microCoachSessionsByClassId = /* GraphQL */ `
  query MicroCoachSessionsByClassId(
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
`;
export const microCoachAssessmentsByClassId = /* GraphQL */ `
  query MicroCoachAssessmentsByClassId(
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
`;
export const microCoachAssessmentsBySessionId = /* GraphQL */ `
  query MicroCoachAssessmentsBySessionId(
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
`;
export const microCoachMisconceptionsBySessionId = /* GraphQL */ `
  query MicroCoachMisconceptionsBySessionId(
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
`;
export const microCoachMisconceptionsByClassId = /* GraphQL */ `
  query MicroCoachMisconceptionsByClassId(
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
`;
export const microCoachActivitiesByMisconceptionId = /* GraphQL */ `
  query MicroCoachActivitiesByMisconceptionId(
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
`;
export const microCoachActivitiesBySessionId = /* GraphQL */ `
  query MicroCoachActivitiesBySessionId(
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
`;
export const microCoachActivitiesByClassId = /* GraphQL */ `
  query MicroCoachActivitiesByClassId(
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
`;
export const microCoachSavedPlansByClassId = /* GraphQL */ `
  query MicroCoachSavedPlansByClassId(
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
`;
export const microCoachSavedPlansBySessionId = /* GraphQL */ `
  query MicroCoachSavedPlansBySessionId(
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
`;
export const getContextData = /* GraphQL */ `
  query GetContextData($id: ID!) {
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
`;
export const listContextData = /* GraphQL */ `
  query ListContextData(
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
`;
