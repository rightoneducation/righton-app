/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getClassroom = /* GraphQL */ `
  query GetClassroom($id: ID!) {
    getClassroom(id: $id) {
      id
      classroomName
      learningGaps {
        items {
          id
          classroomId
          title
          priority
          studentCount
          studentPercent
          occurrence
          misconceptionSummary
          successIndicators
          evidence {
            source
            mostCommonError
            sampleStudentWork
            aiThinkingPattern
            __typename
          }
          move {
            id
            title
            time
            format
            summary
            aiReasoning
            tabs {
              __typename
            }
            __typename
          }
          createdAt
          updatedAt
          classroomLearningGapsId
          __typename
        }
        nextToken
        __typename
      }
      recommendedActions {
        items {
          id
          classroomId
          priority
          title
          description
          action
          timeframe
          affectedStudents
          dataSource
          remediationType
          ccssStandard
          targetObjectives {
            standard
            description
            __typename
          }
          prerequisiteGaps {
            standard
            description
            gapDescription
            __typename
          }
          createdAt
          updatedAt
          classroomRecommendedActionsId
          __typename
        }
        nextToken
        __typename
      }
      students {
        items {
          id
          classroomId
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
      trends {
        items {
          keyInsights {
            finding
            targetStandard
            targetDescription
            gapStandard
            gapDescription
            __typename
          }
          studentPerformanceGroups {
            highPerformers {
              name
              masteryScore
              previousMastery
              masteryChange
              misconceptionScore
              previousMisconception
              misconceptionChange
              __typename
            }
            averagePerformers {
              name
              masteryScore
              previousMastery
              masteryChange
              misconceptionScore
              previousMisconception
              misconceptionChange
              __typename
            }
            strugglingStudents {
              name
              masteryScore
              previousMastery
              masteryChange
              misconceptionScore
              previousMisconception
              misconceptionChange
              __typename
            }
            biggestChanges {
              name
              masteryChange
              misconceptionChange
              topic
              __typename
            }
            __typename
          }
          confidenceIssues {
            overlyConfident {
              name
              topic
              __typename
            }
            underlyConfident {
              name
              topic
              __typename
            }
            __typename
          }
          id
          createdAt
          updatedAt
          classroomTrendsId
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
export const listClassrooms = /* GraphQL */ `
  query ListClassrooms(
    $filter: ModelClassroomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassrooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        classroomName
        learningGaps {
          items {
            id
            classroomId
            title
            priority
            studentCount
            studentPercent
            occurrence
            misconceptionSummary
            successIndicators
            evidence {
              source
              mostCommonError
              sampleStudentWork
              aiThinkingPattern
              __typename
            }
            move {
              id
              title
              time
              format
              summary
              aiReasoning
              __typename
            }
            createdAt
            updatedAt
            classroomLearningGapsId
            __typename
          }
          nextToken
          __typename
        }
        recommendedActions {
          items {
            id
            classroomId
            priority
            title
            description
            action
            timeframe
            affectedStudents
            dataSource
            remediationType
            ccssStandard
            targetObjectives {
              standard
              description
              __typename
            }
            prerequisiteGaps {
              standard
              description
              gapDescription
              __typename
            }
            createdAt
            updatedAt
            classroomRecommendedActionsId
            __typename
          }
          nextToken
          __typename
        }
        students {
          items {
            id
            classroomId
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
        trends {
          items {
            keyInsights {
              finding
              targetStandard
              targetDescription
              gapStandard
              gapDescription
              __typename
            }
            studentPerformanceGroups {
              __typename
            }
            confidenceIssues {
              __typename
            }
            id
            createdAt
            updatedAt
            classroomTrendsId
            __typename
          }
          nextToken
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
export const getStudent = /* GraphQL */ `
  query GetStudent($id: ID!) {
    getStudent(id: $id) {
      id
      classroomId
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
export const listStudents = /* GraphQL */ `
  query ListStudents(
    $filter: ModelStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStudents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        classroomId
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
  }
`;
export const getLearningGap = /* GraphQL */ `
  query GetLearningGap($id: ID!) {
    getLearningGap(id: $id) {
      id
      classroomId
      title
      priority
      studentCount
      studentPercent
      occurrence
      misconceptionSummary
      successIndicators
      evidence {
        source
        mostCommonError
        sampleStudentWork
        aiThinkingPattern
        __typename
      }
      move {
        id
        title
        time
        format
        summary
        aiReasoning
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
        __typename
      }
      createdAt
      updatedAt
      classroomLearningGapsId
      __typename
    }
  }
`;
export const listLearningGaps = /* GraphQL */ `
  query ListLearningGaps(
    $filter: ModelLearningGapFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLearningGaps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        classroomId
        title
        priority
        studentCount
        studentPercent
        occurrence
        misconceptionSummary
        successIndicators
        evidence {
          source
          mostCommonError
          sampleStudentWork
          aiThinkingPattern
          __typename
        }
        move {
          id
          title
          time
          format
          summary
          aiReasoning
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
          __typename
        }
        createdAt
        updatedAt
        classroomLearningGapsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getRecommendedAction = /* GraphQL */ `
  query GetRecommendedAction($id: ID!) {
    getRecommendedAction(id: $id) {
      id
      classroomId
      priority
      title
      description
      action
      timeframe
      affectedStudents
      dataSource
      remediationType
      ccssStandard
      targetObjectives {
        standard
        description
        __typename
      }
      prerequisiteGaps {
        standard
        description
        gapDescription
        __typename
      }
      createdAt
      updatedAt
      classroomRecommendedActionsId
      __typename
    }
  }
`;
export const listRecommendedActions = /* GraphQL */ `
  query ListRecommendedActions(
    $filter: ModelRecommendedActionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRecommendedActions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomId
        priority
        title
        description
        action
        timeframe
        affectedStudents
        dataSource
        remediationType
        ccssStandard
        targetObjectives {
          standard
          description
          __typename
        }
        prerequisiteGaps {
          standard
          description
          gapDescription
          __typename
        }
        createdAt
        updatedAt
        classroomRecommendedActionsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getClassroomTrend = /* GraphQL */ `
  query GetClassroomTrend($id: ID!) {
    getClassroomTrend(id: $id) {
      keyInsights {
        finding
        targetStandard
        targetDescription
        gapStandard
        gapDescription
        __typename
      }
      studentPerformanceGroups {
        highPerformers {
          name
          masteryScore
          previousMastery
          masteryChange
          misconceptionScore
          previousMisconception
          misconceptionChange
          __typename
        }
        averagePerformers {
          name
          masteryScore
          previousMastery
          masteryChange
          misconceptionScore
          previousMisconception
          misconceptionChange
          __typename
        }
        strugglingStudents {
          name
          masteryScore
          previousMastery
          masteryChange
          misconceptionScore
          previousMisconception
          misconceptionChange
          __typename
        }
        biggestChanges {
          name
          masteryChange
          misconceptionChange
          topic
          __typename
        }
        __typename
      }
      confidenceIssues {
        overlyConfident {
          name
          topic
          __typename
        }
        underlyConfident {
          name
          topic
          __typename
        }
        __typename
      }
      id
      createdAt
      updatedAt
      classroomTrendsId
      __typename
    }
  }
`;
export const listClassroomTrends = /* GraphQL */ `
  query ListClassroomTrends(
    $filter: ModelClassroomTrendFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassroomTrends(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        keyInsights {
          finding
          targetStandard
          targetDescription
          gapStandard
          gapDescription
          __typename
        }
        studentPerformanceGroups {
          highPerformers {
            name
            masteryScore
            previousMastery
            masteryChange
            misconceptionScore
            previousMisconception
            misconceptionChange
            __typename
          }
          averagePerformers {
            name
            masteryScore
            previousMastery
            masteryChange
            misconceptionScore
            previousMisconception
            misconceptionChange
            __typename
          }
          strugglingStudents {
            name
            masteryScore
            previousMastery
            masteryChange
            misconceptionScore
            previousMisconception
            misconceptionChange
            __typename
          }
          biggestChanges {
            name
            masteryChange
            misconceptionChange
            topic
            __typename
          }
          __typename
        }
        confidenceIssues {
          overlyConfident {
            name
            topic
            __typename
          }
          underlyConfident {
            name
            topic
            __typename
          }
          __typename
        }
        id
        createdAt
        updatedAt
        classroomTrendsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const classroomsByClassroomName = /* GraphQL */ `
  query ClassroomsByClassroomName(
    $classroomName: String!
    $sortDirection: ModelSortDirection
    $filter: ModelClassroomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    classroomsByClassroomName(
      classroomName: $classroomName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomName
        learningGaps {
          items {
            id
            classroomId
            title
            priority
            studentCount
            studentPercent
            occurrence
            misconceptionSummary
            successIndicators
            evidence {
              source
              mostCommonError
              sampleStudentWork
              aiThinkingPattern
              __typename
            }
            move {
              id
              title
              time
              format
              summary
              aiReasoning
              __typename
            }
            createdAt
            updatedAt
            classroomLearningGapsId
            __typename
          }
          nextToken
          __typename
        }
        recommendedActions {
          items {
            id
            classroomId
            priority
            title
            description
            action
            timeframe
            affectedStudents
            dataSource
            remediationType
            ccssStandard
            targetObjectives {
              standard
              description
              __typename
            }
            prerequisiteGaps {
              standard
              description
              gapDescription
              __typename
            }
            createdAt
            updatedAt
            classroomRecommendedActionsId
            __typename
          }
          nextToken
          __typename
        }
        students {
          items {
            id
            classroomId
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
        trends {
          items {
            keyInsights {
              finding
              targetStandard
              targetDescription
              gapStandard
              gapDescription
              __typename
            }
            studentPerformanceGroups {
              __typename
            }
            confidenceIssues {
              __typename
            }
            id
            createdAt
            updatedAt
            classroomTrendsId
            __typename
          }
          nextToken
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
