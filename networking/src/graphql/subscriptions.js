/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
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
export const onCreatePublicGameTemplate = /* GraphQL */ `
  subscription OnCreatePublicGameTemplate(
    $filter: ModelSubscriptionPublicGameTemplateFilterInput
    $owner: String
  ) {
    onCreatePublicGameTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          publicGameTemplateID
          publicQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onUpdatePublicGameTemplate = /* GraphQL */ `
  subscription OnUpdatePublicGameTemplate(
    $filter: ModelSubscriptionPublicGameTemplateFilterInput
    $owner: String
  ) {
    onUpdatePublicGameTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          publicGameTemplateID
          publicQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onDeletePublicGameTemplate = /* GraphQL */ `
  subscription OnDeletePublicGameTemplate(
    $filter: ModelSubscriptionPublicGameTemplateFilterInput
    $owner: String
  ) {
    onDeletePublicGameTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          publicGameTemplateID
          publicQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onCreatePrivateGameTemplate = /* GraphQL */ `
  subscription OnCreatePrivateGameTemplate(
    $filter: ModelSubscriptionPrivateGameTemplateFilterInput
    $owner: String
  ) {
    onCreatePrivateGameTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          privateGameTemplateID
          privateQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onUpdatePrivateGameTemplate = /* GraphQL */ `
  subscription OnUpdatePrivateGameTemplate(
    $filter: ModelSubscriptionPrivateGameTemplateFilterInput
    $owner: String
  ) {
    onUpdatePrivateGameTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          privateGameTemplateID
          privateQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onDeletePrivateGameTemplate = /* GraphQL */ `
  subscription OnDeletePrivateGameTemplate(
    $filter: ModelSubscriptionPrivateGameTemplateFilterInput
    $owner: String
  ) {
    onDeletePrivateGameTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          privateGameTemplateID
          privateQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onCreateDraftGameTemplate = /* GraphQL */ `
  subscription OnCreateDraftGameTemplate(
    $filter: ModelSubscriptionDraftGameTemplateFilterInput
    $owner: String
  ) {
    onCreateDraftGameTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          draftGameTemplateID
          draftQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onUpdateDraftGameTemplate = /* GraphQL */ `
  subscription OnUpdateDraftGameTemplate(
    $filter: ModelSubscriptionDraftGameTemplateFilterInput
    $owner: String
  ) {
    onUpdateDraftGameTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          draftGameTemplateID
          draftQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onDeleteDraftGameTemplate = /* GraphQL */ `
  subscription OnDeleteDraftGameTemplate(
    $filter: ModelSubscriptionDraftGameTemplateFilterInput
    $owner: String
  ) {
    onDeleteDraftGameTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          draftGameTemplateID
          draftQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onCreatePublicQuestionTemplate = /* GraphQL */ `
  subscription OnCreatePublicQuestionTemplate(
    $filter: ModelSubscriptionPublicQuestionTemplateFilterInput
    $owner: String
  ) {
    onCreatePublicQuestionTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          publicGameTemplateID
          publicQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onUpdatePublicQuestionTemplate = /* GraphQL */ `
  subscription OnUpdatePublicQuestionTemplate(
    $filter: ModelSubscriptionPublicQuestionTemplateFilterInput
    $owner: String
  ) {
    onUpdatePublicQuestionTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          publicGameTemplateID
          publicQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onDeletePublicQuestionTemplate = /* GraphQL */ `
  subscription OnDeletePublicQuestionTemplate(
    $filter: ModelSubscriptionPublicQuestionTemplateFilterInput
    $owner: String
  ) {
    onDeletePublicQuestionTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          publicGameTemplateID
          publicQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onCreatePrivateQuestionTemplate = /* GraphQL */ `
  subscription OnCreatePrivateQuestionTemplate(
    $filter: ModelSubscriptionPrivateQuestionTemplateFilterInput
    $owner: String
  ) {
    onCreatePrivateQuestionTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          privateGameTemplateID
          privateQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onUpdatePrivateQuestionTemplate = /* GraphQL */ `
  subscription OnUpdatePrivateQuestionTemplate(
    $filter: ModelSubscriptionPrivateQuestionTemplateFilterInput
    $owner: String
  ) {
    onUpdatePrivateQuestionTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          privateGameTemplateID
          privateQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onDeletePrivateQuestionTemplate = /* GraphQL */ `
  subscription OnDeletePrivateQuestionTemplate(
    $filter: ModelSubscriptionPrivateQuestionTemplateFilterInput
    $owner: String
  ) {
    onDeletePrivateQuestionTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          privateGameTemplateID
          privateQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onCreateDraftQuestionTemplate = /* GraphQL */ `
  subscription OnCreateDraftQuestionTemplate(
    $filter: ModelSubscriptionDraftQuestionTemplateFilterInput
    $owner: String
  ) {
    onCreateDraftQuestionTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          draftGameTemplateID
          draftQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onUpdateDraftQuestionTemplate = /* GraphQL */ `
  subscription OnUpdateDraftQuestionTemplate(
    $filter: ModelSubscriptionDraftQuestionTemplateFilterInput
    $owner: String
  ) {
    onUpdateDraftQuestionTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          draftGameTemplateID
          draftQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onDeleteDraftQuestionTemplate = /* GraphQL */ `
  subscription OnDeleteDraftQuestionTemplate(
    $filter: ModelSubscriptionDraftQuestionTemplateFilterInput
    $owner: String
  ) {
    onDeleteDraftQuestionTemplate(filter: $filter, owner: $owner) {
      id
      userId
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
        items {
          id
          draftGameTemplateID
          draftQuestionTemplateID
          createdAt
          updatedAt
          owner
          __typename
        }
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
export const onCreateGameSession = /* GraphQL */ `
  subscription OnCreateGameSession(
    $filter: ModelSubscriptionGameSessionFilterInput
  ) {
    onCreateGameSession(filter: $filter) {
      id
      gameId
      startTime
      phaseOneTime
      phaseTwoTime
      teams {
        items {
          id
          name
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
        items {
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
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateGameSession = /* GraphQL */ `
  subscription OnUpdateGameSession(
    $filter: ModelSubscriptionGameSessionFilterInput
  ) {
    onUpdateGameSession(filter: $filter) {
      id
      gameId
      startTime
      phaseOneTime
      phaseTwoTime
      teams {
        items {
          id
          name
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
        items {
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
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteGameSession = /* GraphQL */ `
  subscription OnDeleteGameSession(
    $filter: ModelSubscriptionGameSessionFilterInput
  ) {
    onDeleteGameSession(filter: $filter) {
      id
      gameId
      startTime
      phaseOneTime
      phaseTwoTime
      teams {
        items {
          id
          name
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
        items {
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
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateTeam = /* GraphQL */ `
  subscription OnCreateTeam($filter: ModelSubscriptionTeamFilterInput) {
    onCreateTeam(filter: $filter) {
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
        items {
          id
          isFacilitator
          deviceId
          createdAt
          updatedAt
          teamTeamMembersId
          __typename
        }
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
export const onUpdateTeam = /* GraphQL */ `
  subscription OnUpdateTeam($filter: ModelSubscriptionTeamFilterInput) {
    onUpdateTeam(filter: $filter) {
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
        items {
          id
          isFacilitator
          deviceId
          createdAt
          updatedAt
          teamTeamMembersId
          __typename
        }
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
export const onDeleteTeam = /* GraphQL */ `
  subscription OnDeleteTeam($filter: ModelSubscriptionTeamFilterInput) {
    onDeleteTeam(filter: $filter) {
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
        items {
          id
          isFacilitator
          deviceId
          createdAt
          updatedAt
          teamTeamMembersId
          __typename
        }
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
export const onCreateTeamMember = /* GraphQL */ `
  subscription OnCreateTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
  ) {
    onCreateTeamMember(filter: $filter) {
      id
      isFacilitator
      answers {
        items {
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
export const onUpdateTeamMember = /* GraphQL */ `
  subscription OnUpdateTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
  ) {
    onUpdateTeamMember(filter: $filter) {
      id
      isFacilitator
      answers {
        items {
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
export const onDeleteTeamMember = /* GraphQL */ `
  subscription OnDeleteTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
  ) {
    onDeleteTeamMember(filter: $filter) {
      id
      isFacilitator
      answers {
        items {
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
export const onCreateTeamAnswer = /* GraphQL */ `
  subscription OnCreateTeamAnswer(
    $filter: ModelSubscriptionTeamAnswerFilterInput
  ) {
    onCreateTeamAnswer(filter: $filter) {
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
export const onUpdateTeamAnswer = /* GraphQL */ `
  subscription OnUpdateTeamAnswer(
    $filter: ModelSubscriptionTeamAnswerFilterInput
  ) {
    onUpdateTeamAnswer(filter: $filter) {
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
export const onDeleteTeamAnswer = /* GraphQL */ `
  subscription OnDeleteTeamAnswer(
    $filter: ModelSubscriptionTeamAnswerFilterInput
  ) {
    onDeleteTeamAnswer(filter: $filter) {
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
export const onCreatePublicGameQuestions = /* GraphQL */ `
  subscription OnCreatePublicGameQuestions(
    $filter: ModelSubscriptionPublicGameQuestionsFilterInput
    $owner: String
  ) {
    onCreatePublicGameQuestions(filter: $filter, owner: $owner) {
      id
      publicGameTemplateID
      publicQuestionTemplateID
      publicGameTemplate {
        id
        userId
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
      publicQuestionTemplate {
        id
        userId
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
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdatePublicGameQuestions = /* GraphQL */ `
  subscription OnUpdatePublicGameQuestions(
    $filter: ModelSubscriptionPublicGameQuestionsFilterInput
    $owner: String
  ) {
    onUpdatePublicGameQuestions(filter: $filter, owner: $owner) {
      id
      publicGameTemplateID
      publicQuestionTemplateID
      publicGameTemplate {
        id
        userId
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
      publicQuestionTemplate {
        id
        userId
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
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeletePublicGameQuestions = /* GraphQL */ `
  subscription OnDeletePublicGameQuestions(
    $filter: ModelSubscriptionPublicGameQuestionsFilterInput
    $owner: String
  ) {
    onDeletePublicGameQuestions(filter: $filter, owner: $owner) {
      id
      publicGameTemplateID
      publicQuestionTemplateID
      publicGameTemplate {
        id
        userId
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
      publicQuestionTemplate {
        id
        userId
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
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreatePrivateGameQuestions = /* GraphQL */ `
  subscription OnCreatePrivateGameQuestions(
    $filter: ModelSubscriptionPrivateGameQuestionsFilterInput
    $owner: String
  ) {
    onCreatePrivateGameQuestions(filter: $filter, owner: $owner) {
      id
      privateGameTemplateID
      privateQuestionTemplateID
      privateGameTemplate {
        id
        userId
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
      privateQuestionTemplate {
        id
        userId
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
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdatePrivateGameQuestions = /* GraphQL */ `
  subscription OnUpdatePrivateGameQuestions(
    $filter: ModelSubscriptionPrivateGameQuestionsFilterInput
    $owner: String
  ) {
    onUpdatePrivateGameQuestions(filter: $filter, owner: $owner) {
      id
      privateGameTemplateID
      privateQuestionTemplateID
      privateGameTemplate {
        id
        userId
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
      privateQuestionTemplate {
        id
        userId
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
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeletePrivateGameQuestions = /* GraphQL */ `
  subscription OnDeletePrivateGameQuestions(
    $filter: ModelSubscriptionPrivateGameQuestionsFilterInput
    $owner: String
  ) {
    onDeletePrivateGameQuestions(filter: $filter, owner: $owner) {
      id
      privateGameTemplateID
      privateQuestionTemplateID
      privateGameTemplate {
        id
        userId
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
      privateQuestionTemplate {
        id
        userId
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
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreateDraftGameQuestions = /* GraphQL */ `
  subscription OnCreateDraftGameQuestions(
    $filter: ModelSubscriptionDraftGameQuestionsFilterInput
    $owner: String
  ) {
    onCreateDraftGameQuestions(filter: $filter, owner: $owner) {
      id
      draftGameTemplateID
      draftQuestionTemplateID
      draftGameTemplate {
        id
        userId
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
      draftQuestionTemplate {
        id
        userId
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
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateDraftGameQuestions = /* GraphQL */ `
  subscription OnUpdateDraftGameQuestions(
    $filter: ModelSubscriptionDraftGameQuestionsFilterInput
    $owner: String
  ) {
    onUpdateDraftGameQuestions(filter: $filter, owner: $owner) {
      id
      draftGameTemplateID
      draftQuestionTemplateID
      draftGameTemplate {
        id
        userId
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
      draftQuestionTemplate {
        id
        userId
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
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteDraftGameQuestions = /* GraphQL */ `
  subscription OnDeleteDraftGameQuestions(
    $filter: ModelSubscriptionDraftGameQuestionsFilterInput
    $owner: String
  ) {
    onDeleteDraftGameQuestions(filter: $filter, owner: $owner) {
      id
      draftGameTemplateID
      draftQuestionTemplateID
      draftGameTemplate {
        id
        userId
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
      draftQuestionTemplate {
        id
        userId
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
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onGameSessionUpdatedById = /* GraphQL */ `
  subscription OnGameSessionUpdatedById($id: ID!) {
    onGameSessionUpdatedById(id: $id) {
      id
      gameId
      startTime
      phaseOneTime
      phaseTwoTime
      teams {
        items {
          id
          name
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
        items {
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
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onTeamMemberUpdateByTeamId = /* GraphQL */ `
  subscription OnTeamMemberUpdateByTeamId($teamTeamMembersId: ID!) {
    onTeamMemberUpdateByTeamId(teamTeamMembersId: $teamTeamMembersId) {
      id
      isFacilitator
      answers {
        items {
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
export const onTeamCreateByGameSessionId = /* GraphQL */ `
  subscription OnTeamCreateByGameSessionId($gameSessionTeamsId: ID!) {
    onTeamCreateByGameSessionId(gameSessionTeamsId: $gameSessionTeamsId) {
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
        items {
          id
          isFacilitator
          deviceId
          createdAt
          updatedAt
          teamTeamMembersId
          __typename
        }
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
export const onTeamDeleteByGameSessionId = /* GraphQL */ `
  subscription OnTeamDeleteByGameSessionId($gameSessionTeamsId: ID!) {
    onTeamDeleteByGameSessionId(gameSessionTeamsId: $gameSessionTeamsId) {
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
        items {
          id
          isFacilitator
          deviceId
          createdAt
          updatedAt
          teamTeamMembersId
          __typename
        }
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
export const onTeamUpdateByGameSessionId = /* GraphQL */ `
  subscription OnTeamUpdateByGameSessionId($gameSessionTeamsId: ID!) {
    onTeamUpdateByGameSessionId(gameSessionTeamsId: $gameSessionTeamsId) {
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
        items {
          id
          isFacilitator
          deviceId
          createdAt
          updatedAt
          teamTeamMembersId
          __typename
        }
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
