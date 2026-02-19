"use strict";
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.savedNextStepsByClassroomId = exports.classroomsByClassroomName = exports.listClassroomTrends = exports.getClassroomTrend = exports.listSavedNextSteps = exports.getSavedNextStep = exports.listLearningGaps = exports.getLearningGap = exports.listStudents = exports.getStudent = exports.listClassrooms = exports.getClassroom = void 0;
exports.getClassroom = `
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
          ccssStandards {
            targetObjective {
              standard
              description
              __typename
            }
            impactedObjectives {
              standard
              description
              __typename
            }
            prerequisiteGaps {
              standard
              description
              __typename
            }
            __typename
          }
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
      savedNextSteps {
        items {
          id
          classroomId
          status
          completedAt
          sortOrder
          gapGroupId
          gapGroupTitle
          targetObjectiveStandard
          priority
          studentCount
          studentPercent
          occurrence
          misconceptionSummary
          successIndicators
          gaps
          moveId
          moveTitle
          moveTime
          moveFormat
          moveSummary
          aiReasoning
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
          classroomSavedNextStepsId
          __typename
        }
        nextToken
        __typename
      }
      students {
        items {
          id
          classroomId
          name
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
exports.listClassrooms = `
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
            ccssStandards {
              __typename
            }
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
        savedNextSteps {
          items {
            id
            classroomId
            status
            completedAt
            sortOrder
            gapGroupId
            gapGroupTitle
            targetObjectiveStandard
            priority
            studentCount
            studentPercent
            occurrence
            misconceptionSummary
            successIndicators
            gaps
            moveId
            moveTitle
            moveTime
            moveFormat
            moveSummary
            aiReasoning
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
            classroomSavedNextStepsId
            __typename
          }
          nextToken
          __typename
        }
        students {
          items {
            id
            classroomId
            name
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
exports.getStudent = `
  query GetStudent($id: ID!) {
    getStudent(id: $id) {
      id
      classroomId
      name
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
exports.listStudents = `
  query ListStudents(
    $filter: ModelStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStudents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        classroomId
        name
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
exports.getLearningGap = `
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
      ccssStandards {
        targetObjective {
          standard
          description
          __typename
        }
        impactedObjectives {
          standard
          description
          __typename
        }
        prerequisiteGaps {
          standard
          description
          __typename
        }
        __typename
      }
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
exports.listLearningGaps = `
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
        ccssStandards {
          targetObjective {
            standard
            description
            __typename
          }
          impactedObjectives {
            standard
            description
            __typename
          }
          prerequisiteGaps {
            standard
            description
            __typename
          }
          __typename
        }
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
exports.getSavedNextStep = `
  query GetSavedNextStep($id: ID!) {
    getSavedNextStep(id: $id) {
      id
      classroomId
      status
      completedAt
      sortOrder
      gapGroupId
      gapGroupTitle
      targetObjectiveStandard
      priority
      studentCount
      studentPercent
      occurrence
      misconceptionSummary
      successIndicators
      gaps
      moveId
      moveTitle
      moveTime
      moveFormat
      moveSummary
      aiReasoning
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
      classroomSavedNextStepsId
      __typename
    }
  }
`;
exports.listSavedNextSteps = `
  query ListSavedNextSteps(
    $filter: ModelSavedNextStepFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSavedNextSteps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        classroomId
        status
        completedAt
        sortOrder
        gapGroupId
        gapGroupTitle
        targetObjectiveStandard
        priority
        studentCount
        studentPercent
        occurrence
        misconceptionSummary
        successIndicators
        gaps
        moveId
        moveTitle
        moveTime
        moveFormat
        moveSummary
        aiReasoning
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
        classroomSavedNextStepsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
exports.getClassroomTrend = `
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
exports.listClassroomTrends = `
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
exports.classroomsByClassroomName = `
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
            ccssStandards {
              __typename
            }
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
        savedNextSteps {
          items {
            id
            classroomId
            status
            completedAt
            sortOrder
            gapGroupId
            gapGroupTitle
            targetObjectiveStandard
            priority
            studentCount
            studentPercent
            occurrence
            misconceptionSummary
            successIndicators
            gaps
            moveId
            moveTitle
            moveTime
            moveFormat
            moveSummary
            aiReasoning
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
            classroomSavedNextStepsId
            __typename
          }
          nextToken
          __typename
        }
        students {
          items {
            id
            classroomId
            name
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
exports.savedNextStepsByClassroomId = `
  query SavedNextStepsByClassroomId(
    $classroomId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelSavedNextStepFilterInput
    $limit: Int
    $nextToken: String
  ) {
    savedNextStepsByClassroomId(
      classroomId: $classroomId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomId
        status
        completedAt
        sortOrder
        gapGroupId
        gapGroupTitle
        targetObjectiveStandard
        priority
        studentCount
        studentPercent
        occurrence
        misconceptionSummary
        successIndicators
        gaps
        moveId
        moveTitle
        moveTime
        moveFormat
        moveSummary
        aiReasoning
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
        classroomSavedNextStepsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
