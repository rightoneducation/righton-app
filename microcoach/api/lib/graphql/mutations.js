"use strict";
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClassroomTrend = exports.updateClassroomTrend = exports.createClassroomTrend = exports.deleteSavedNextStep = exports.updateSavedNextStep = exports.createSavedNextStep = exports.deleteLearningGap = exports.updateLearningGap = exports.createLearningGap = exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.deleteClassroom = exports.updateClassroom = exports.createClassroom = exports.getAnalytics = exports.getLearningScience = void 0;
exports.getLearningScience = `
  mutation GetLearningScience($input: GetLearningScienceInput!) {
    getLearningScience(input: $input)
  }
`;
exports.getAnalytics = `
  mutation GetAnalytics($input: GetAnalyticsInput!) {
    getAnalytics(input: $input)
  }
`;
exports.createClassroom = `
  mutation CreateClassroom(
    $input: CreateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    createClassroom(input: $input, condition: $condition) {
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
exports.updateClassroom = `
  mutation UpdateClassroom(
    $input: UpdateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    updateClassroom(input: $input, condition: $condition) {
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
exports.deleteClassroom = `
  mutation DeleteClassroom(
    $input: DeleteClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    deleteClassroom(input: $input, condition: $condition) {
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
exports.createStudent = `
  mutation CreateStudent(
    $input: CreateStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    createStudent(input: $input, condition: $condition) {
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
exports.updateStudent = `
  mutation UpdateStudent(
    $input: UpdateStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    updateStudent(input: $input, condition: $condition) {
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
exports.deleteStudent = `
  mutation DeleteStudent(
    $input: DeleteStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    deleteStudent(input: $input, condition: $condition) {
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
exports.createLearningGap = `
  mutation CreateLearningGap(
    $input: CreateLearningGapInput!
    $condition: ModelLearningGapConditionInput
  ) {
    createLearningGap(input: $input, condition: $condition) {
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
exports.updateLearningGap = `
  mutation UpdateLearningGap(
    $input: UpdateLearningGapInput!
    $condition: ModelLearningGapConditionInput
  ) {
    updateLearningGap(input: $input, condition: $condition) {
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
exports.deleteLearningGap = `
  mutation DeleteLearningGap(
    $input: DeleteLearningGapInput!
    $condition: ModelLearningGapConditionInput
  ) {
    deleteLearningGap(input: $input, condition: $condition) {
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
exports.createSavedNextStep = `
  mutation CreateSavedNextStep(
    $input: CreateSavedNextStepInput!
    $condition: ModelSavedNextStepConditionInput
  ) {
    createSavedNextStep(input: $input, condition: $condition) {
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
exports.updateSavedNextStep = `
  mutation UpdateSavedNextStep(
    $input: UpdateSavedNextStepInput!
    $condition: ModelSavedNextStepConditionInput
  ) {
    updateSavedNextStep(input: $input, condition: $condition) {
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
exports.deleteSavedNextStep = `
  mutation DeleteSavedNextStep(
    $input: DeleteSavedNextStepInput!
    $condition: ModelSavedNextStepConditionInput
  ) {
    deleteSavedNextStep(input: $input, condition: $condition) {
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
exports.createClassroomTrend = `
  mutation CreateClassroomTrend(
    $input: CreateClassroomTrendInput!
    $condition: ModelClassroomTrendConditionInput
  ) {
    createClassroomTrend(input: $input, condition: $condition) {
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
exports.updateClassroomTrend = `
  mutation UpdateClassroomTrend(
    $input: UpdateClassroomTrendInput!
    $condition: ModelClassroomTrendConditionInput
  ) {
    updateClassroomTrend(input: $input, condition: $condition) {
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
exports.deleteClassroomTrend = `
  mutation DeleteClassroomTrend(
    $input: DeleteClassroomTrendInput!
    $condition: ModelClassroomTrendConditionInput
  ) {
    deleteClassroomTrend(input: $input, condition: $condition) {
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
