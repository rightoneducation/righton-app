/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateClassroom = /* GraphQL */ `
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
export const onUpdateClassroom = /* GraphQL */ `
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
export const onDeleteClassroom = /* GraphQL */ `
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
export const onCreateStudent = /* GraphQL */ `
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
export const onUpdateStudent = /* GraphQL */ `
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
export const onDeleteStudent = /* GraphQL */ `
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
export const onCreateLearningGap = /* GraphQL */ `
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
export const onUpdateLearningGap = /* GraphQL */ `
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
export const onDeleteLearningGap = /* GraphQL */ `
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
export const onCreateSavedNextStep = /* GraphQL */ `
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
export const onUpdateSavedNextStep = /* GraphQL */ `
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
export const onDeleteSavedNextStep = /* GraphQL */ `
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
export const onCreateClassroomTrend = /* GraphQL */ `
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
export const onUpdateClassroomTrend = /* GraphQL */ `
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
export const onDeleteClassroomTrend = /* GraphQL */ `
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
