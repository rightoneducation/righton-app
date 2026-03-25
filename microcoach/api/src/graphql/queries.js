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
      currentWeek
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
      sessions {
        items {
          id
          classroomId
          sessionLabel
          weekNumber
          topic
          ccssStandards
          status
          publishStatus
          ppqAssessmentId
          postPpqAssessmentId
          assessments {
            items {
              id
              classroomId
              sessionId
              assessmentCode
              type
              weekNumber
              administeredAt
              topic
              ccssStandards
              durationMinutes
              calculatorAllowed
              classPercentCorrect
              sourceAssessmentId
              createdAt
              updatedAt
              sessionAssessmentsId
              __typename
            }
            nextToken
            __typename
          }
          misconceptions {
            items {
              id
              classroomId
              sessionId
              ccssStandard
              title
              description
              aiReasoning
              studentCount
              studentPercent
              severity
              priority
              occurrence
              successIndicators
              prerequisiteGapCodes
              impactedObjectiveCodes
              postPpqImprovement
              createdAt
              updatedAt
              classroomMisconceptionsId
              sessionMisconceptionsId
              __typename
            }
            nextToken
            __typename
          }
          pregeneratedNextSteps
          createdAt
          updatedAt
          classroomSessionsId
          __typename
        }
        nextToken
        __typename
      }
      misconceptions {
        items {
          id
          classroomId
          sessionId
          ccssStandard
          title
          description
          aiReasoning
          studentCount
          studentPercent
          severity
          priority
          occurrence
          successIndicators
          evidence {
            source
            mostCommonError
            sampleStudentWork
            aiThinkingPattern
            __typename
          }
          prerequisiteGapCodes
          impactedObjectiveCodes
          activities {
            items {
              id
              misconceptionId
              classroomId
              sessionId
              type
              status
              title
              summary
              durationMinutes
              format
              aiReasoning
              aiGenerated
              sourceContextDataIds
              completedAt
              postPpqImprovement
              createdAt
              updatedAt
              misconceptionActivitiesId
              __typename
            }
            nextToken
            __typename
          }
          postPpqImprovement
          createdAt
          updatedAt
          classroomMisconceptionsId
          sessionMisconceptionsId
          __typename
        }
        nextToken
        __typename
      }
      savedNextSteps {
        items {
          id
          classroomId
          sessionId
          activityId
          status
          completedAt
          sortOrder
          misconceptionId
          misconceptionTitle
          targetObjectiveStandard
          priority
          studentCount
          studentPercent
          occurrence
          misconceptionSummary
          successIndicators
          activityTitle
          activityTime
          activityFormat
          activitySummary
          aiReasoning
          evidence
          tabs
          createdAt
          updatedAt
          classroomSavedNextStepsId
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
        currentWeek
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
        sessions {
          items {
            id
            classroomId
            sessionLabel
            weekNumber
            topic
            ccssStandards
            status
            publishStatus
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
            createdAt
            updatedAt
            classroomSessionsId
            __typename
          }
          nextToken
          __typename
        }
        misconceptions {
          items {
            id
            classroomId
            sessionId
            ccssStandard
            title
            description
            aiReasoning
            studentCount
            studentPercent
            severity
            priority
            occurrence
            successIndicators
            evidence {
              source
              mostCommonError
              sampleStudentWork
              aiThinkingPattern
              __typename
            }
            prerequisiteGapCodes
            impactedObjectiveCodes
            activities {
              nextToken
              __typename
            }
            postPpqImprovement
            createdAt
            updatedAt
            classroomMisconceptionsId
            sessionMisconceptionsId
            __typename
          }
          nextToken
          __typename
        }
        savedNextSteps {
          items {
            id
            classroomId
            sessionId
            activityId
            status
            completedAt
            sortOrder
            misconceptionId
            misconceptionTitle
            targetObjectiveStandard
            priority
            studentCount
            studentPercent
            occurrence
            misconceptionSummary
            successIndicators
            activityTitle
            activityTime
            activityFormat
            activitySummary
            aiReasoning
            evidence
            tabs
            createdAt
            updatedAt
            classroomSavedNextStepsId
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
export const getSession = /* GraphQL */ `
  query GetSession($id: ID!) {
    getSession(id: $id) {
      id
      classroomId
      sessionLabel
      weekNumber
      topic
      ccssStandards
      status
      publishStatus
      ppqAssessmentId
      postPpqAssessmentId
      assessments {
        items {
          id
          classroomId
          sessionId
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
          sourceAssessmentId
          createdAt
          updatedAt
          sessionAssessmentsId
          __typename
        }
        nextToken
        __typename
      }
      misconceptions {
        items {
          id
          classroomId
          sessionId
          ccssStandard
          title
          description
          aiReasoning
          studentCount
          studentPercent
          severity
          priority
          occurrence
          successIndicators
          evidence {
            source
            mostCommonError
            sampleStudentWork
            aiThinkingPattern
            __typename
          }
          prerequisiteGapCodes
          impactedObjectiveCodes
          activities {
            items {
              id
              misconceptionId
              classroomId
              sessionId
              type
              status
              title
              summary
              durationMinutes
              format
              aiReasoning
              aiGenerated
              sourceContextDataIds
              completedAt
              postPpqImprovement
              createdAt
              updatedAt
              misconceptionActivitiesId
              __typename
            }
            nextToken
            __typename
          }
          postPpqImprovement
          createdAt
          updatedAt
          classroomMisconceptionsId
          sessionMisconceptionsId
          __typename
        }
        nextToken
        __typename
      }
      pregeneratedNextSteps
      createdAt
      updatedAt
      classroomSessionsId
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
        classroomId
        sessionLabel
        weekNumber
        topic
        ccssStandards
        status
        publishStatus
        ppqAssessmentId
        postPpqAssessmentId
        assessments {
          items {
            id
            classroomId
            sessionId
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
            studentResponses {
              nextToken
              __typename
            }
            sourceAssessmentId
            createdAt
            updatedAt
            sessionAssessmentsId
            __typename
          }
          nextToken
          __typename
        }
        misconceptions {
          items {
            id
            classroomId
            sessionId
            ccssStandard
            title
            description
            aiReasoning
            studentCount
            studentPercent
            severity
            priority
            occurrence
            successIndicators
            evidence {
              source
              mostCommonError
              sampleStudentWork
              aiThinkingPattern
              __typename
            }
            prerequisiteGapCodes
            impactedObjectiveCodes
            activities {
              nextToken
              __typename
            }
            postPpqImprovement
            createdAt
            updatedAt
            classroomMisconceptionsId
            sessionMisconceptionsId
            __typename
          }
          nextToken
          __typename
        }
        pregeneratedNextSteps
        createdAt
        updatedAt
        classroomSessionsId
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
export const getAssessment = /* GraphQL */ `
  query GetAssessment($id: ID!) {
    getAssessment(id: $id) {
      id
      classroomId
      sessionId
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
            confidence
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
      sourceAssessmentId
      createdAt
      updatedAt
      sessionAssessmentsId
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
        sessionId
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
              confidence
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
        sourceAssessmentId
        createdAt
        updatedAt
        sessionAssessmentsId
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
        confidence
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
          confidence
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
export const getMisconception = /* GraphQL */ `
  query GetMisconception($id: ID!) {
    getMisconception(id: $id) {
      id
      classroomId
      sessionId
      ccssStandard
      title
      description
      aiReasoning
      studentCount
      studentPercent
      severity
      priority
      occurrence
      successIndicators
      evidence {
        source
        mostCommonError
        sampleStudentWork
        aiThinkingPattern
        __typename
      }
      prerequisiteGapCodes
      impactedObjectiveCodes
      activities {
        items {
          id
          misconceptionId
          classroomId
          sessionId
          type
          status
          title
          summary
          durationMinutes
          format
          aiReasoning
          aiGenerated
          sourceContextDataIds
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
              incorrectWorkedExamples
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
          completedAt
          postPpqImprovement
          createdAt
          updatedAt
          misconceptionActivitiesId
          __typename
        }
        nextToken
        __typename
      }
      postPpqImprovement
      createdAt
      updatedAt
      classroomMisconceptionsId
      sessionMisconceptionsId
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
        classroomId
        sessionId
        ccssStandard
        title
        description
        aiReasoning
        studentCount
        studentPercent
        severity
        priority
        occurrence
        successIndicators
        evidence {
          source
          mostCommonError
          sampleStudentWork
          aiThinkingPattern
          __typename
        }
        prerequisiteGapCodes
        impactedObjectiveCodes
        activities {
          items {
            id
            misconceptionId
            classroomId
            sessionId
            type
            status
            title
            summary
            durationMinutes
            format
            aiReasoning
            aiGenerated
            sourceContextDataIds
            tabs {
              __typename
            }
            completedAt
            postPpqImprovement
            createdAt
            updatedAt
            misconceptionActivitiesId
            __typename
          }
          nextToken
          __typename
        }
        postPpqImprovement
        createdAt
        updatedAt
        classroomMisconceptionsId
        sessionMisconceptionsId
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
      classroomId
      sessionId
      type
      status
      title
      summary
      durationMinutes
      format
      aiReasoning
      aiGenerated
      sourceContextDataIds
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
          incorrectWorkedExamples
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
      completedAt
      postPpqImprovement
      createdAt
      updatedAt
      misconceptionActivitiesId
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
        classroomId
        sessionId
        type
        status
        title
        summary
        durationMinutes
        format
        aiReasoning
        aiGenerated
        sourceContextDataIds
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
            incorrectWorkedExamples
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
        completedAt
        postPpqImprovement
        createdAt
        updatedAt
        misconceptionActivitiesId
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
      sessionId
      activityId
      status
      completedAt
      sortOrder
      misconceptionId
      misconceptionTitle
      targetObjectiveStandard
      priority
      studentCount
      studentPercent
      occurrence
      misconceptionSummary
      successIndicators
      activityTitle
      activityTime
      activityFormat
      activitySummary
      aiReasoning
      evidence
      tabs
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
        sessionId
        activityId
        status
        completedAt
        sortOrder
        misconceptionId
        misconceptionTitle
        targetObjectiveStandard
        priority
        studentCount
        studentPercent
        occurrence
        misconceptionSummary
        successIndicators
        activityTitle
        activityTime
        activityFormat
        activitySummary
        aiReasoning
        evidence
        tabs
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
        currentWeek
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
        sessions {
          items {
            id
            classroomId
            sessionLabel
            weekNumber
            topic
            ccssStandards
            status
            publishStatus
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
            createdAt
            updatedAt
            classroomSessionsId
            __typename
          }
          nextToken
          __typename
        }
        misconceptions {
          items {
            id
            classroomId
            sessionId
            ccssStandard
            title
            description
            aiReasoning
            studentCount
            studentPercent
            severity
            priority
            occurrence
            successIndicators
            evidence {
              source
              mostCommonError
              sampleStudentWork
              aiThinkingPattern
              __typename
            }
            prerequisiteGapCodes
            impactedObjectiveCodes
            activities {
              nextToken
              __typename
            }
            postPpqImprovement
            createdAt
            updatedAt
            classroomMisconceptionsId
            sessionMisconceptionsId
            __typename
          }
          nextToken
          __typename
        }
        savedNextSteps {
          items {
            id
            classroomId
            sessionId
            activityId
            status
            completedAt
            sortOrder
            misconceptionId
            misconceptionTitle
            targetObjectiveStandard
            priority
            studentCount
            studentPercent
            occurrence
            misconceptionSummary
            successIndicators
            activityTitle
            activityTime
            activityFormat
            activitySummary
            aiReasoning
            evidence
            tabs
            createdAt
            updatedAt
            classroomSavedNextStepsId
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
export const sessionsByClassroomId = /* GraphQL */ `
  query SessionsByClassroomId(
    $classroomId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    sessionsByClassroomId(
      classroomId: $classroomId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomId
        sessionLabel
        weekNumber
        topic
        ccssStandards
        status
        publishStatus
        ppqAssessmentId
        postPpqAssessmentId
        assessments {
          items {
            id
            classroomId
            sessionId
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
            studentResponses {
              nextToken
              __typename
            }
            sourceAssessmentId
            createdAt
            updatedAt
            sessionAssessmentsId
            __typename
          }
          nextToken
          __typename
        }
        misconceptions {
          items {
            id
            classroomId
            sessionId
            ccssStandard
            title
            description
            aiReasoning
            studentCount
            studentPercent
            severity
            priority
            occurrence
            successIndicators
            evidence {
              source
              mostCommonError
              sampleStudentWork
              aiThinkingPattern
              __typename
            }
            prerequisiteGapCodes
            impactedObjectiveCodes
            activities {
              nextToken
              __typename
            }
            postPpqImprovement
            createdAt
            updatedAt
            classroomMisconceptionsId
            sessionMisconceptionsId
            __typename
          }
          nextToken
          __typename
        }
        pregeneratedNextSteps
        createdAt
        updatedAt
        classroomSessionsId
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
        sessionId
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
              confidence
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
        sourceAssessmentId
        createdAt
        updatedAt
        sessionAssessmentsId
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
        classroomId
        sessionId
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
              confidence
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
        sourceAssessmentId
        createdAt
        updatedAt
        sessionAssessmentsId
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
          confidence
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
          confidence
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
export const misconceptionsByClassroomId = /* GraphQL */ `
  query MisconceptionsByClassroomId(
    $classroomId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMisconceptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    misconceptionsByClassroomId(
      classroomId: $classroomId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomId
        sessionId
        ccssStandard
        title
        description
        aiReasoning
        studentCount
        studentPercent
        severity
        priority
        occurrence
        successIndicators
        evidence {
          source
          mostCommonError
          sampleStudentWork
          aiThinkingPattern
          __typename
        }
        prerequisiteGapCodes
        impactedObjectiveCodes
        activities {
          items {
            id
            misconceptionId
            classroomId
            sessionId
            type
            status
            title
            summary
            durationMinutes
            format
            aiReasoning
            aiGenerated
            sourceContextDataIds
            tabs {
              __typename
            }
            completedAt
            postPpqImprovement
            createdAt
            updatedAt
            misconceptionActivitiesId
            __typename
          }
          nextToken
          __typename
        }
        postPpqImprovement
        createdAt
        updatedAt
        classroomMisconceptionsId
        sessionMisconceptionsId
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
        classroomId
        sessionId
        ccssStandard
        title
        description
        aiReasoning
        studentCount
        studentPercent
        severity
        priority
        occurrence
        successIndicators
        evidence {
          source
          mostCommonError
          sampleStudentWork
          aiThinkingPattern
          __typename
        }
        prerequisiteGapCodes
        impactedObjectiveCodes
        activities {
          items {
            id
            misconceptionId
            classroomId
            sessionId
            type
            status
            title
            summary
            durationMinutes
            format
            aiReasoning
            aiGenerated
            sourceContextDataIds
            tabs {
              __typename
            }
            completedAt
            postPpqImprovement
            createdAt
            updatedAt
            misconceptionActivitiesId
            __typename
          }
          nextToken
          __typename
        }
        postPpqImprovement
        createdAt
        updatedAt
        classroomMisconceptionsId
        sessionMisconceptionsId
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
        classroomId
        sessionId
        type
        status
        title
        summary
        durationMinutes
        format
        aiReasoning
        aiGenerated
        sourceContextDataIds
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
            incorrectWorkedExamples
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
        completedAt
        postPpqImprovement
        createdAt
        updatedAt
        misconceptionActivitiesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const activitiesByClassroomId = /* GraphQL */ `
  query ActivitiesByClassroomId(
    $classroomId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelActivityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    activitiesByClassroomId(
      classroomId: $classroomId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        misconceptionId
        classroomId
        sessionId
        type
        status
        title
        summary
        durationMinutes
        format
        aiReasoning
        aiGenerated
        sourceContextDataIds
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
            incorrectWorkedExamples
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
        completedAt
        postPpqImprovement
        createdAt
        updatedAt
        misconceptionActivitiesId
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
        classroomId
        sessionId
        type
        status
        title
        summary
        durationMinutes
        format
        aiReasoning
        aiGenerated
        sourceContextDataIds
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
            incorrectWorkedExamples
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
        completedAt
        postPpqImprovement
        createdAt
        updatedAt
        misconceptionActivitiesId
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
        sessionId
        activityId
        status
        completedAt
        sortOrder
        misconceptionId
        misconceptionTitle
        targetObjectiveStandard
        priority
        studentCount
        studentPercent
        occurrence
        misconceptionSummary
        successIndicators
        activityTitle
        activityTime
        activityFormat
        activitySummary
        aiReasoning
        evidence
        tabs
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
export const savedNextStepsBySessionId = /* GraphQL */ `
  query SavedNextStepsBySessionId(
    $sessionId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelSavedNextStepFilterInput
    $limit: Int
    $nextToken: String
  ) {
    savedNextStepsBySessionId(
      sessionId: $sessionId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        classroomId
        sessionId
        activityId
        status
        completedAt
        sortOrder
        misconceptionId
        misconceptionTitle
        targetObjectiveStandard
        priority
        studentCount
        studentPercent
        occurrence
        misconceptionSummary
        successIndicators
        activityTitle
        activityTime
        activityFormat
        activitySummary
        aiReasoning
        evidence
        tabs
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
