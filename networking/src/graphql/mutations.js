/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      userName
      dynamoId
      cognitoId
      title
      firstName
      lastName
      email
      password
      gamesMade
      gamesUsed
      questionsMade
      frontIdPath
      backIdPath
      profilePicPath
      favoriteGameTemplateIds
      favoriteQuestionTemplateIds
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      userName
      dynamoId
      cognitoId
      title
      firstName
      lastName
      email
      password
      gamesMade
      gamesUsed
      questionsMade
      frontIdPath
      backIdPath
      profilePicPath
      favoriteGameTemplateIds
      favoriteQuestionTemplateIds
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      userName
      dynamoId
      cognitoId
      title
      firstName
      lastName
      email
      password
      gamesMade
      gamesUsed
      questionsMade
      frontIdPath
      backIdPath
      profilePicPath
      favoriteGameTemplateIds
      favoriteQuestionTemplateIds
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createPublicGameTemplate = /* GraphQL */ `
  mutation CreatePublicGameTemplate(
    $input: CreatePublicGameTemplateInput!
    $condition: ModelPublicGameTemplateConditionInput
  ) {
    createPublicGameTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      description
      lowerCaseDescription
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      timesPlayed
      questionTemplates {
        nextToken
        __typename
      }
      questionTemplatesCount
      questionTemplatesOrder
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const updatePublicGameTemplate = /* GraphQL */ `
  mutation UpdatePublicGameTemplate(
    $input: UpdatePublicGameTemplateInput!
    $condition: ModelPublicGameTemplateConditionInput
  ) {
    updatePublicGameTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      description
      lowerCaseDescription
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      timesPlayed
      questionTemplates {
        nextToken
        __typename
      }
      questionTemplatesCount
      questionTemplatesOrder
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const deletePublicGameTemplate = /* GraphQL */ `
  mutation DeletePublicGameTemplate(
    $input: DeletePublicGameTemplateInput!
    $condition: ModelPublicGameTemplateConditionInput
  ) {
    deletePublicGameTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      description
      lowerCaseDescription
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      timesPlayed
      questionTemplates {
        nextToken
        __typename
      }
      questionTemplatesCount
      questionTemplatesOrder
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const createPrivateGameTemplate = /* GraphQL */ `
  mutation CreatePrivateGameTemplate(
    $input: CreatePrivateGameTemplateInput!
    $condition: ModelPrivateGameTemplateConditionInput
  ) {
    createPrivateGameTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      description
      lowerCaseDescription
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      timesPlayed
      questionTemplates {
        nextToken
        __typename
      }
      questionTemplatesCount
      questionTemplatesOrder
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const updatePrivateGameTemplate = /* GraphQL */ `
  mutation UpdatePrivateGameTemplate(
    $input: UpdatePrivateGameTemplateInput!
    $condition: ModelPrivateGameTemplateConditionInput
  ) {
    updatePrivateGameTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      description
      lowerCaseDescription
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      timesPlayed
      questionTemplates {
        nextToken
        __typename
      }
      questionTemplatesCount
      questionTemplatesOrder
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const deletePrivateGameTemplate = /* GraphQL */ `
  mutation DeletePrivateGameTemplate(
    $input: DeletePrivateGameTemplateInput!
    $condition: ModelPrivateGameTemplateConditionInput
  ) {
    deletePrivateGameTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      description
      lowerCaseDescription
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      timesPlayed
      questionTemplates {
        nextToken
        __typename
      }
      questionTemplatesCount
      questionTemplatesOrder
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const createDraftGameTemplate = /* GraphQL */ `
  mutation CreateDraftGameTemplate(
    $input: CreateDraftGameTemplateInput!
    $condition: ModelDraftGameTemplateConditionInput
  ) {
    createDraftGameTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      description
      lowerCaseDescription
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      timesPlayed
      questionTemplates {
        nextToken
        __typename
      }
      questionTemplatesCount
      questionTemplatesOrder
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const updateDraftGameTemplate = /* GraphQL */ `
  mutation UpdateDraftGameTemplate(
    $input: UpdateDraftGameTemplateInput!
    $condition: ModelDraftGameTemplateConditionInput
  ) {
    updateDraftGameTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      description
      lowerCaseDescription
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      timesPlayed
      questionTemplates {
        nextToken
        __typename
      }
      questionTemplatesCount
      questionTemplatesOrder
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const deleteDraftGameTemplate = /* GraphQL */ `
  mutation DeleteDraftGameTemplate(
    $input: DeleteDraftGameTemplateInput!
    $condition: ModelDraftGameTemplateConditionInput
  ) {
    deleteDraftGameTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      description
      lowerCaseDescription
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      timesPlayed
      questionTemplates {
        nextToken
        __typename
      }
      questionTemplatesCount
      questionTemplatesOrder
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const createPublicQuestionTemplate = /* GraphQL */ `
  mutation CreatePublicQuestionTemplate(
    $input: CreatePublicQuestionTemplateInput!
    $condition: ModelPublicQuestionTemplateConditionInput
  ) {
    createPublicQuestionTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      timesPlayed
      gameTemplates {
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const updatePublicQuestionTemplate = /* GraphQL */ `
  mutation UpdatePublicQuestionTemplate(
    $input: UpdatePublicQuestionTemplateInput!
    $condition: ModelPublicQuestionTemplateConditionInput
  ) {
    updatePublicQuestionTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      timesPlayed
      gameTemplates {
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const deletePublicQuestionTemplate = /* GraphQL */ `
  mutation DeletePublicQuestionTemplate(
    $input: DeletePublicQuestionTemplateInput!
    $condition: ModelPublicQuestionTemplateConditionInput
  ) {
    deletePublicQuestionTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      timesPlayed
      gameTemplates {
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const createPrivateQuestionTemplate = /* GraphQL */ `
  mutation CreatePrivateQuestionTemplate(
    $input: CreatePrivateQuestionTemplateInput!
    $condition: ModelPrivateQuestionTemplateConditionInput
  ) {
    createPrivateQuestionTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      timesPlayed
      gameTemplates {
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const updatePrivateQuestionTemplate = /* GraphQL */ `
  mutation UpdatePrivateQuestionTemplate(
    $input: UpdatePrivateQuestionTemplateInput!
    $condition: ModelPrivateQuestionTemplateConditionInput
  ) {
    updatePrivateQuestionTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      timesPlayed
      gameTemplates {
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const deletePrivateQuestionTemplate = /* GraphQL */ `
  mutation DeletePrivateQuestionTemplate(
    $input: DeletePrivateQuestionTemplateInput!
    $condition: ModelPrivateQuestionTemplateConditionInput
  ) {
    deletePrivateQuestionTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      timesPlayed
      gameTemplates {
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const createDraftQuestionTemplate = /* GraphQL */ `
  mutation CreateDraftQuestionTemplate(
    $input: CreateDraftQuestionTemplateInput!
    $condition: ModelDraftQuestionTemplateConditionInput
  ) {
    createDraftQuestionTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      timesPlayed
      gameTemplates {
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const updateDraftQuestionTemplate = /* GraphQL */ `
  mutation UpdateDraftQuestionTemplate(
    $input: UpdateDraftQuestionTemplateInput!
    $condition: ModelDraftQuestionTemplateConditionInput
  ) {
    updateDraftQuestionTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      timesPlayed
      gameTemplates {
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const deleteDraftQuestionTemplate = /* GraphQL */ `
  mutation DeleteDraftQuestionTemplate(
    $input: DeleteDraftQuestionTemplateInput!
    $condition: ModelDraftQuestionTemplateConditionInput
  ) {
    deleteDraftQuestionTemplate(input: $input, condition: $condition) {
      id
      userId
      publicPrivateType
      title
      lowerCaseTitle
      version
      choices
      instructions
      answerSettings
      ccss
      domain
      cluster
      grade
      gradeFilter
      standard
      imageUrl
      timesPlayed
      gameTemplates {
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
      owner
      __typename
    }
  }
`;
export const createGameSession = /* GraphQL */ `
  mutation CreateGameSession(
    $input: CreateGameSessionInput!
    $condition: ModelGameSessionConditionInput
  ) {
    createGameSession(input: $input, condition: $condition) {
      id
      gameId
      startTime
      phaseOneTime
      phaseTwoTime
      teams {
        nextToken
        __typename
      }
      currentQuestionIndex
      currentState
      gameCode
      isAdvancedMode
      imageUrl
      description
      title
      currentTimer
      sessionData
      questions {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateGameSession = /* GraphQL */ `
  mutation UpdateGameSession(
    $input: UpdateGameSessionInput!
    $condition: ModelGameSessionConditionInput
  ) {
    updateGameSession(input: $input, condition: $condition) {
      id
      gameId
      startTime
      phaseOneTime
      phaseTwoTime
      teams {
        nextToken
        __typename
      }
      currentQuestionIndex
      currentState
      gameCode
      isAdvancedMode
      imageUrl
      description
      title
      currentTimer
      sessionData
      questions {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteGameSession = /* GraphQL */ `
  mutation DeleteGameSession(
    $input: DeleteGameSessionInput!
    $condition: ModelGameSessionConditionInput
  ) {
    deleteGameSession(input: $input, condition: $condition) {
      id
      gameId
      startTime
      phaseOneTime
      phaseTwoTime
      teams {
        nextToken
        __typename
      }
      currentQuestionIndex
      currentState
      gameCode
      isAdvancedMode
      imageUrl
      description
      title
      currentTimer
      sessionData
      questions {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createQuestion = /* GraphQL */ `
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
      id
      text
      choices
      answerSettings
      answerData
      hints
      imageUrl
      instructions
      standard
      cluster
      domain
      grade
      order
      isConfidenceEnabled
      isShortAnswerEnabled
      isHintEnabled
      gameSessionId
      __typename
    }
  }
`;
export const updateQuestion = /* GraphQL */ `
  mutation UpdateQuestion(
    $input: UpdateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    updateQuestion(input: $input, condition: $condition) {
      id
      text
      choices
      answerSettings
      answerData
      hints
      imageUrl
      instructions
      standard
      cluster
      domain
      grade
      order
      isConfidenceEnabled
      isShortAnswerEnabled
      isHintEnabled
      gameSessionId
      __typename
    }
  }
`;
export const deleteQuestion = /* GraphQL */ `
  mutation DeleteQuestion(
    $input: DeleteQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    deleteQuestion(input: $input, condition: $condition) {
      id
      text
      choices
      answerSettings
      answerData
      hints
      imageUrl
      instructions
      standard
      cluster
      domain
      grade
      order
      isConfidenceEnabled
      isShortAnswerEnabled
      isHintEnabled
      gameSessionId
      __typename
    }
  }
`;
export const createTeam = /* GraphQL */ `
  mutation CreateTeam(
    $input: CreateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    createTeam(input: $input, condition: $condition) {
      id
      name
      question {
        id
        text
        choices
        answerSettings
        answerData
        hints
        imageUrl
        instructions
        standard
        cluster
        domain
        grade
        order
        isConfidenceEnabled
        isShortAnswerEnabled
        isHintEnabled
        gameSessionId
        __typename
      }
      teamMembers {
        nextToken
        __typename
      }
      score
      selectedAvatarIndex
      createdAt
      updatedAt
      gameSessionTeamsId
      teamQuestionId
      teamQuestionOrder
      teamQuestionGameSessionId
      __typename
    }
  }
`;
export const updateTeam = /* GraphQL */ `
  mutation UpdateTeam(
    $input: UpdateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    updateTeam(input: $input, condition: $condition) {
      id
      name
      question {
        id
        text
        choices
        answerSettings
        answerData
        hints
        imageUrl
        instructions
        standard
        cluster
        domain
        grade
        order
        isConfidenceEnabled
        isShortAnswerEnabled
        isHintEnabled
        gameSessionId
        __typename
      }
      teamMembers {
        nextToken
        __typename
      }
      score
      selectedAvatarIndex
      createdAt
      updatedAt
      gameSessionTeamsId
      teamQuestionId
      teamQuestionOrder
      teamQuestionGameSessionId
      __typename
    }
  }
`;
export const deleteTeam = /* GraphQL */ `
  mutation DeleteTeam(
    $input: DeleteTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    deleteTeam(input: $input, condition: $condition) {
      id
      name
      question {
        id
        text
        choices
        answerSettings
        answerData
        hints
        imageUrl
        instructions
        standard
        cluster
        domain
        grade
        order
        isConfidenceEnabled
        isShortAnswerEnabled
        isHintEnabled
        gameSessionId
        __typename
      }
      teamMembers {
        nextToken
        __typename
      }
      score
      selectedAvatarIndex
      createdAt
      updatedAt
      gameSessionTeamsId
      teamQuestionId
      teamQuestionOrder
      teamQuestionGameSessionId
      __typename
    }
  }
`;
export const createTeamMember = /* GraphQL */ `
  mutation CreateTeamMember(
    $input: CreateTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    createTeamMember(input: $input, condition: $condition) {
      id
      isFacilitator
      answers {
        nextToken
        __typename
      }
      deviceId
      createdAt
      updatedAt
      teamTeamMembersId
      __typename
    }
  }
`;
export const updateTeamMember = /* GraphQL */ `
  mutation UpdateTeamMember(
    $input: UpdateTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    updateTeamMember(input: $input, condition: $condition) {
      id
      isFacilitator
      answers {
        nextToken
        __typename
      }
      deviceId
      createdAt
      updatedAt
      teamTeamMembersId
      __typename
    }
  }
`;
export const deleteTeamMember = /* GraphQL */ `
  mutation DeleteTeamMember(
    $input: DeleteTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    deleteTeamMember(input: $input, condition: $condition) {
      id
      isFacilitator
      answers {
        nextToken
        __typename
      }
      deviceId
      createdAt
      updatedAt
      teamTeamMembersId
      __typename
    }
  }
`;
export const createTeamAnswer = /* GraphQL */ `
  mutation CreateTeamAnswer(
    $input: CreateTeamAnswerInput!
    $condition: ModelTeamAnswerConditionInput
  ) {
    createTeamAnswer(input: $input, condition: $condition) {
      id
      isCorrect
      isSubmitted
      isShortAnswerEnabled
      currentState
      currentQuestionIndex
      questionId
      teamMemberAnswersId
      teamAnswersId
      teamName
      text
      answer
      confidenceLevel
      hint
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTeamAnswer = /* GraphQL */ `
  mutation UpdateTeamAnswer(
    $input: UpdateTeamAnswerInput!
    $condition: ModelTeamAnswerConditionInput
  ) {
    updateTeamAnswer(input: $input, condition: $condition) {
      id
      isCorrect
      isSubmitted
      isShortAnswerEnabled
      currentState
      currentQuestionIndex
      questionId
      teamMemberAnswersId
      teamAnswersId
      teamName
      text
      answer
      confidenceLevel
      hint
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTeamAnswer = /* GraphQL */ `
  mutation DeleteTeamAnswer(
    $input: DeleteTeamAnswerInput!
    $condition: ModelTeamAnswerConditionInput
  ) {
    deleteTeamAnswer(input: $input, condition: $condition) {
      id
      isCorrect
      isSubmitted
      isShortAnswerEnabled
      currentState
      currentQuestionIndex
      questionId
      teamMemberAnswersId
      teamAnswersId
      teamName
      text
      answer
      confidenceLevel
      hint
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createPublicGameQuestions = /* GraphQL */ `
  mutation CreatePublicGameQuestions(
    $input: CreatePublicGameQuestionsInput!
    $condition: ModelPublicGameQuestionsConditionInput
  ) {
    createPublicGameQuestions(input: $input, condition: $condition) {
      id
      publicGameTemplateID
      publicQuestionTemplateID
      publicGameTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        phaseOneTime
        phaseTwoTime
        imageUrl
        timesPlayed
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      publicQuestionTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updatePublicGameQuestions = /* GraphQL */ `
  mutation UpdatePublicGameQuestions(
    $input: UpdatePublicGameQuestionsInput!
    $condition: ModelPublicGameQuestionsConditionInput
  ) {
    updatePublicGameQuestions(input: $input, condition: $condition) {
      id
      publicGameTemplateID
      publicQuestionTemplateID
      publicGameTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        phaseOneTime
        phaseTwoTime
        imageUrl
        timesPlayed
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      publicQuestionTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deletePublicGameQuestions = /* GraphQL */ `
  mutation DeletePublicGameQuestions(
    $input: DeletePublicGameQuestionsInput!
    $condition: ModelPublicGameQuestionsConditionInput
  ) {
    deletePublicGameQuestions(input: $input, condition: $condition) {
      id
      publicGameTemplateID
      publicQuestionTemplateID
      publicGameTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        phaseOneTime
        phaseTwoTime
        imageUrl
        timesPlayed
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      publicQuestionTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createPrivateGameQuestions = /* GraphQL */ `
  mutation CreatePrivateGameQuestions(
    $input: CreatePrivateGameQuestionsInput!
    $condition: ModelPrivateGameQuestionsConditionInput
  ) {
    createPrivateGameQuestions(input: $input, condition: $condition) {
      id
      privateGameTemplateID
      privateQuestionTemplateID
      privateGameTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        phaseOneTime
        phaseTwoTime
        imageUrl
        timesPlayed
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      privateQuestionTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updatePrivateGameQuestions = /* GraphQL */ `
  mutation UpdatePrivateGameQuestions(
    $input: UpdatePrivateGameQuestionsInput!
    $condition: ModelPrivateGameQuestionsConditionInput
  ) {
    updatePrivateGameQuestions(input: $input, condition: $condition) {
      id
      privateGameTemplateID
      privateQuestionTemplateID
      privateGameTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        phaseOneTime
        phaseTwoTime
        imageUrl
        timesPlayed
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      privateQuestionTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deletePrivateGameQuestions = /* GraphQL */ `
  mutation DeletePrivateGameQuestions(
    $input: DeletePrivateGameQuestionsInput!
    $condition: ModelPrivateGameQuestionsConditionInput
  ) {
    deletePrivateGameQuestions(input: $input, condition: $condition) {
      id
      privateGameTemplateID
      privateQuestionTemplateID
      privateGameTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        phaseOneTime
        phaseTwoTime
        imageUrl
        timesPlayed
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      privateQuestionTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createDraftGameQuestions = /* GraphQL */ `
  mutation CreateDraftGameQuestions(
    $input: CreateDraftGameQuestionsInput!
    $condition: ModelDraftGameQuestionsConditionInput
  ) {
    createDraftGameQuestions(input: $input, condition: $condition) {
      id
      draftGameTemplateID
      draftQuestionTemplateID
      draftGameTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        phaseOneTime
        phaseTwoTime
        imageUrl
        timesPlayed
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      draftQuestionTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateDraftGameQuestions = /* GraphQL */ `
  mutation UpdateDraftGameQuestions(
    $input: UpdateDraftGameQuestionsInput!
    $condition: ModelDraftGameQuestionsConditionInput
  ) {
    updateDraftGameQuestions(input: $input, condition: $condition) {
      id
      draftGameTemplateID
      draftQuestionTemplateID
      draftGameTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        phaseOneTime
        phaseTwoTime
        imageUrl
        timesPlayed
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      draftQuestionTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteDraftGameQuestions = /* GraphQL */ `
  mutation DeleteDraftGameQuestions(
    $input: DeleteDraftGameQuestionsInput!
    $condition: ModelDraftGameQuestionsConditionInput
  ) {
    deleteDraftGameQuestions(input: $input, condition: $condition) {
      id
      draftGameTemplateID
      draftQuestionTemplateID
      draftGameTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        description
        lowerCaseDescription
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        phaseOneTime
        phaseTwoTime
        imageUrl
        timesPlayed
        questionTemplatesCount
        questionTemplatesOrder
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      draftQuestionTemplate {
        id
        userId
        publicPrivateType
        title
        lowerCaseTitle
        version
        choices
        instructions
        answerSettings
        ccss
        domain
        cluster
        grade
        gradeFilter
        standard
        imageUrl
        timesPlayed
        gameTemplatesCount
        createdAt
        updatedAt
        type
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createGameSessionFromTemplate = /* GraphQL */ `
  mutation CreateGameSessionFromTemplate(
    $input: CreateGameSessionFromTemplateInput!
  ) {
    createGameSessionFromTemplate(input: $input)
  }
`;
export const teacherIdAuth = /* GraphQL */ `
  mutation TeacherIdAuth($input: TeacherIdAuthInput!) {
    teacherIdAuth(input: $input)
  }
`;
export const userCleaner = /* GraphQL */ `
  mutation UserCleaner($input: String!) {
    userCleaner(input: $input)
  }
`;
export const uploadExternalImageToS3 = /* GraphQL */ `
  mutation UploadExternalImageToS3($input: UploadExternalImageToS3Input) {
    uploadExternalImageToS3(input: $input)
  }
`;
export const waegen = /* GraphQL */ `
  mutation Waegen($input: WaeGenInput) {
    waegen(input: $input)
  }
`;
export const waeregen = /* GraphQL */ `
  mutation Waeregen($input: WaeRegenInput) {
    waeregen(input: $input)
  }
`;
export const deleteUnverifiedUser = /* GraphQL */ `
  mutation DeleteUnverifiedUser($input: DeleteUnverifiedUserInput) {
    deleteUnverifiedUser(input: $input)
  }
`;
export const updateUserPass = /* GraphQL */ `
  mutation UpdateUserPass($input: UpdateUserPassInput) {
    updateUserPass(input: $input)
  }
`;
