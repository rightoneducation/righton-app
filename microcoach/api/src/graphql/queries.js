/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getClassroom = /* GraphQL */ `
  query GetClassroom($id: ID!) {
    getClassroom(id: $id) {
      id
      classroomName
      grade
      subject
      state
      schoolYear
      cohortSize
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
          externalId
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
      assessments {
        items {
          id
          classroomId
          assessmentCode
          type
          weekNumber
          administeredAt
          topic
          ccssStandards
          durationMinutes
          calculatorAllowed
          classPercentCorrect
          questions {
            questionNumber
            questionType
            correctAnswer
            pointValue
            ccssStandard
            classPercentCorrect
            __typename
          }
          sourceAssessmentId
          studentResponses {
            items {
              id
              assessmentId
              studentId
              totalScore
              createdAt
              updatedAt
              assessmentStudentResponsesId
              __typename
            }
            nextToken
            __typename
          }
          createdAt
          updatedAt
          classroomAssessmentsId
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
        grade
        subject
        state
        schoolYear
        cohortSize
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
            externalId
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
        assessments {
          items {
            id
            classroomId
            assessmentCode
            type
            weekNumber
            administeredAt
            topic
            ccssStandards
            durationMinutes
            calculatorAllowed
            classPercentCorrect
            questions {
              questionNumber
              questionType
              correctAnswer
              pointValue
              ccssStandard
              classPercentCorrect
              __typename
            }
            sourceAssessmentId
            studentResponses {
              nextToken
              __typename
            }
            createdAt
            updatedAt
            classroomAssessmentsId
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
      name
      externalId
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
        name
        externalId
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
export const getSavedNextStep = /* GraphQL */ `
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
export const listSavedNextSteps = /* GraphQL */ `
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
export const getAssessment = /* GraphQL */ `
  query GetAssessment($id: ID!) {
    getAssessment(id: $id) {
      id
      classroomId
      assessmentCode
      type
      weekNumber
      administeredAt
      topic
      ccssStandards
      durationMinutes
      calculatorAllowed
      classPercentCorrect
      questions {
        questionNumber
        questionType
        correctAnswer
        pointValue
        ccssStandard
        classPercentCorrect
        __typename
      }
      sourceAssessmentId
      studentResponses {
        items {
          id
          assessmentId
          studentId
          totalScore
          questionResponses {
            questionNumber
            response
            isCorrect
            pointsEarned
            __typename
          }
          createdAt
          updatedAt
          assessmentStudentResponsesId
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      classroomAssessmentsId
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
        classroomId
        assessmentCode
        type
        weekNumber
        administeredAt
        topic
        ccssStandards
        durationMinutes
        calculatorAllowed
        classPercentCorrect
        questions {
          questionNumber
          questionType
          correctAnswer
          pointValue
          ccssStandard
          classPercentCorrect
          __typename
        }
        sourceAssessmentId
        studentResponses {
          items {
            id
            assessmentId
            studentId
            totalScore
            questionResponses {
              questionNumber
              response
              isCorrect
              pointsEarned
              __typename
            }
            createdAt
            updatedAt
            assessmentStudentResponsesId
            __typename
          }
          nextToken
          __typename
        }
        createdAt
        updatedAt
        classroomAssessmentsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getStudentResponse = /* GraphQL */ `
  query GetStudentResponse($id: ID!) {
    getStudentResponse(id: $id) {
      id
      assessmentId
      studentId
      totalScore
      questionResponses {
        questionNumber
        response
        isCorrect
        pointsEarned
        __typename
      }
      createdAt
      updatedAt
      assessmentStudentResponsesId
      __typename
    }
  }
`;
export const listStudentResponses = /* GraphQL */ `
  query ListStudentResponses(
    $filter: ModelStudentResponseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStudentResponses(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        assessmentId
        studentId
        totalScore
        questionResponses {
          questionNumber
          response
          isCorrect
          pointsEarned
          __typename
        }
        createdAt
        updatedAt
        assessmentStudentResponsesId
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
      rtdLesson {
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
        rtdLesson {
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
        grade
        subject
        state
        schoolYear
        cohortSize
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
            externalId
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
        assessments {
          items {
            id
            classroomId
            assessmentCode
            type
            weekNumber
            administeredAt
            topic
            ccssStandards
            durationMinutes
            calculatorAllowed
            classPercentCorrect
            questions {
              questionNumber
              questionType
              correctAnswer
              pointValue
              ccssStandard
              classPercentCorrect
              __typename
            }
            sourceAssessmentId
            studentResponses {
              nextToken
              __typename
            }
            createdAt
            updatedAt
            classroomAssessmentsId
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
export const savedNextStepsByClassroomId = /* GraphQL */ `
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
export const assessmentsByClassroomId = /* GraphQL */ `
  query AssessmentsByClassroomId(
    $classroomId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelAssessmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    assessmentsByClassroomId(
      classroomId: $classroomId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomId
        assessmentCode
        type
        weekNumber
        administeredAt
        topic
        ccssStandards
        durationMinutes
        calculatorAllowed
        classPercentCorrect
        questions {
          questionNumber
          questionType
          correctAnswer
          pointValue
          ccssStandard
          classPercentCorrect
          __typename
        }
        sourceAssessmentId
        studentResponses {
          items {
            id
            assessmentId
            studentId
            totalScore
            questionResponses {
              questionNumber
              response
              isCorrect
              pointsEarned
              __typename
            }
            createdAt
            updatedAt
            assessmentStudentResponsesId
            __typename
          }
          nextToken
          __typename
        }
        createdAt
        updatedAt
        classroomAssessmentsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const studentResponsesByAssessmentId = /* GraphQL */ `
  query StudentResponsesByAssessmentId(
    $assessmentId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelStudentResponseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    studentResponsesByAssessmentId(
      assessmentId: $assessmentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        assessmentId
        studentId
        totalScore
        questionResponses {
          questionNumber
          response
          isCorrect
          pointsEarned
          __typename
        }
        createdAt
        updatedAt
        assessmentStudentResponsesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const studentResponsesByStudentId = /* GraphQL */ `
  query StudentResponsesByStudentId(
    $studentId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelStudentResponseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    studentResponsesByStudentId(
      studentId: $studentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        assessmentId
        studentId
        totalScore
        questionResponses {
          questionNumber
          response
          isCorrect
          pointsEarned
          __typename
        }
        createdAt
        updatedAt
        assessmentStudentResponsesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
