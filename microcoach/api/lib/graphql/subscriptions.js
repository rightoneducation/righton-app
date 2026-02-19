"use strict";
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDeleteClassroomTrend = exports.onUpdateClassroomTrend = exports.onCreateClassroomTrend = exports.onDeleteSavedNextStep = exports.onUpdateSavedNextStep = exports.onCreateSavedNextStep = exports.onDeleteLearningGap = exports.onUpdateLearningGap = exports.onCreateLearningGap = exports.onDeleteStudent = exports.onUpdateStudent = exports.onCreateStudent = exports.onDeleteClassroom = exports.onUpdateClassroom = exports.onCreateClassroom = void 0;
exports.onCreateClassroom = `
  subscription OnCreateClassroom(
    $filter: ModelSubscriptionClassroomFilterInput
  ) {
    onCreateClassroom(filter: $filter) {
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
exports.onUpdateClassroom = `
  subscription OnUpdateClassroom(
    $filter: ModelSubscriptionClassroomFilterInput
  ) {
    onUpdateClassroom(filter: $filter) {
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
exports.onDeleteClassroom = `
  subscription OnDeleteClassroom(
    $filter: ModelSubscriptionClassroomFilterInput
  ) {
    onDeleteClassroom(filter: $filter) {
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
exports.onCreateStudent = `
  subscription OnCreateStudent($filter: ModelSubscriptionStudentFilterInput) {
    onCreateStudent(filter: $filter) {
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
exports.onUpdateStudent = `
  subscription OnUpdateStudent($filter: ModelSubscriptionStudentFilterInput) {
    onUpdateStudent(filter: $filter) {
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
exports.onDeleteStudent = `
  subscription OnDeleteStudent($filter: ModelSubscriptionStudentFilterInput) {
    onDeleteStudent(filter: $filter) {
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
exports.onCreateLearningGap = `
  subscription OnCreateLearningGap(
    $filter: ModelSubscriptionLearningGapFilterInput
  ) {
    onCreateLearningGap(filter: $filter) {
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
exports.onUpdateLearningGap = `
  subscription OnUpdateLearningGap(
    $filter: ModelSubscriptionLearningGapFilterInput
  ) {
    onUpdateLearningGap(filter: $filter) {
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
exports.onDeleteLearningGap = `
  subscription OnDeleteLearningGap(
    $filter: ModelSubscriptionLearningGapFilterInput
  ) {
    onDeleteLearningGap(filter: $filter) {
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
exports.onCreateSavedNextStep = `
  subscription OnCreateSavedNextStep(
    $filter: ModelSubscriptionSavedNextStepFilterInput
  ) {
    onCreateSavedNextStep(filter: $filter) {
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
exports.onUpdateSavedNextStep = `
  subscription OnUpdateSavedNextStep(
    $filter: ModelSubscriptionSavedNextStepFilterInput
  ) {
    onUpdateSavedNextStep(filter: $filter) {
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
exports.onDeleteSavedNextStep = `
  subscription OnDeleteSavedNextStep(
    $filter: ModelSubscriptionSavedNextStepFilterInput
  ) {
    onDeleteSavedNextStep(filter: $filter) {
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
exports.onCreateClassroomTrend = `
  subscription OnCreateClassroomTrend(
    $filter: ModelSubscriptionClassroomTrendFilterInput
  ) {
    onCreateClassroomTrend(filter: $filter) {
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
exports.onUpdateClassroomTrend = `
  subscription OnUpdateClassroomTrend(
    $filter: ModelSubscriptionClassroomTrendFilterInput
  ) {
    onUpdateClassroomTrend(filter: $filter) {
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
exports.onDeleteClassroomTrend = `
  subscription OnDeleteClassroomTrend(
    $filter: ModelSubscriptionClassroomTrendFilterInput
  ) {
    onDeleteClassroomTrend(filter: $filter) {
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
