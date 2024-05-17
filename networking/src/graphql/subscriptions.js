/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePublicGameTemplate = /* GraphQL */ `
  subscription OnCreatePublicGameTemplate(
    $filter: ModelSubscriptionPublicGameTemplateFilterInput
    $owner: String
  ) {
    onCreatePublicGameTemplate(filter: $filter, owner: $owner) {
      id
      title
      owner
      version
      description
      domain
      cluster
      grade
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      questionTemplates {
        nextToken
        __typename
      }
      questionTemplatesCount
      createdAt
      updatedAt
      type
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
      title
      owner
      version
      description
      domain
      cluster
      grade
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      questionTemplates {
        nextToken
        __typename
      }
      questionTemplatesCount
      createdAt
      updatedAt
      type
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
      title
      owner
      version
      description
      domain
      cluster
      grade
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      questionTemplates {
        nextToken
        __typename
      }
      questionTemplatesCount
      createdAt
      updatedAt
      type
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
      title
      owner
      version
      description
      domain
      cluster
      grade
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      questionTemplates {
        nextToken
        __typename
      }
      questionTemplatesCount
      createdAt
      updatedAt
      type
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
      title
      owner
      version
      description
      domain
      cluster
      grade
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      questionTemplates {
        nextToken
        __typename
      }
      questionTemplatesCount
      createdAt
      updatedAt
      type
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
      title
      owner
      version
      description
      domain
      cluster
      grade
      standard
      phaseOneTime
      phaseTwoTime
      imageUrl
      questionTemplates {
        nextToken
        __typename
      }
      questionTemplatesCount
      createdAt
      updatedAt
      type
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
      title
      owner
      version
      choices
      instructions
      answerSettings
      domain
      cluster
      grade
      standard
      imageUrl
      gameTemplates {
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
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
      title
      owner
      version
      choices
      instructions
      answerSettings
      domain
      cluster
      grade
      standard
      imageUrl
      gameTemplates {
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
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
      title
      owner
      version
      choices
      instructions
      answerSettings
      domain
      cluster
      grade
      standard
      imageUrl
      gameTemplates {
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
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
      title
      owner
      version
      choices
      instructions
      answerSettings
      domain
      cluster
      grade
      standard
      imageUrl
      gameTemplates {
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
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
      title
      owner
      version
      choices
      instructions
      answerSettings
      domain
      cluster
      grade
      standard
      imageUrl
      gameTemplates {
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
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
      title
      owner
      version
      choices
      instructions
      answerSettings
      domain
      cluster
      grade
      standard
      imageUrl
      gameTemplates {
        nextToken
        __typename
      }
      gameTemplatesCount
      createdAt
      updatedAt
      type
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
        responses
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
        responses
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
        responses
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
export const onCreateTeamMember = /* GraphQL */ `
  subscription OnCreateTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
  ) {
    onCreateTeamMember(filter: $filter) {
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
export const onUpdateTeamMember = /* GraphQL */ `
  subscription OnUpdateTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
  ) {
    onUpdateTeamMember(filter: $filter) {
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
export const onDeleteTeamMember = /* GraphQL */ `
  subscription OnDeleteTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
  ) {
    onDeleteTeamMember(filter: $filter) {
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
export const onCreateTeamAnswer = /* GraphQL */ `
  subscription OnCreateTeamAnswer(
    $filter: ModelSubscriptionTeamAnswerFilterInput
  ) {
    onCreateTeamAnswer(filter: $filter) {
      id
      isSubmitted
      isShortAnswerEnabled
      currentState
      currentQuestionIndex
      questionId
      teamMemberAnswersId
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
      isSubmitted
      isShortAnswerEnabled
      currentState
      currentQuestionIndex
      questionId
      teamMemberAnswersId
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
      isSubmitted
      isShortAnswerEnabled
      currentState
      currentQuestionIndex
      questionId
      teamMemberAnswersId
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
        title
        owner
        version
        description
        domain
        cluster
        grade
        standard
        phaseOneTime
        phaseTwoTime
        imageUrl
        questionTemplatesCount
        createdAt
        updatedAt
        type
        __typename
      }
      publicQuestionTemplate {
        id
        title
        owner
        version
        choices
        instructions
        answerSettings
        domain
        cluster
        grade
        standard
        imageUrl
        gameTemplatesCount
        createdAt
        updatedAt
        type
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
        title
        owner
        version
        description
        domain
        cluster
        grade
        standard
        phaseOneTime
        phaseTwoTime
        imageUrl
        questionTemplatesCount
        createdAt
        updatedAt
        type
        __typename
      }
      publicQuestionTemplate {
        id
        title
        owner
        version
        choices
        instructions
        answerSettings
        domain
        cluster
        grade
        standard
        imageUrl
        gameTemplatesCount
        createdAt
        updatedAt
        type
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
        title
        owner
        version
        description
        domain
        cluster
        grade
        standard
        phaseOneTime
        phaseTwoTime
        imageUrl
        questionTemplatesCount
        createdAt
        updatedAt
        type
        __typename
      }
      publicQuestionTemplate {
        id
        title
        owner
        version
        choices
        instructions
        answerSettings
        domain
        cluster
        grade
        standard
        imageUrl
        gameTemplatesCount
        createdAt
        updatedAt
        type
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
        title
        owner
        version
        description
        domain
        cluster
        grade
        standard
        phaseOneTime
        phaseTwoTime
        imageUrl
        questionTemplatesCount
        createdAt
        updatedAt
        type
        __typename
      }
      privateQuestionTemplate {
        id
        title
        owner
        version
        choices
        instructions
        answerSettings
        domain
        cluster
        grade
        standard
        imageUrl
        gameTemplatesCount
        createdAt
        updatedAt
        type
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
        title
        owner
        version
        description
        domain
        cluster
        grade
        standard
        phaseOneTime
        phaseTwoTime
        imageUrl
        questionTemplatesCount
        createdAt
        updatedAt
        type
        __typename
      }
      privateQuestionTemplate {
        id
        title
        owner
        version
        choices
        instructions
        answerSettings
        domain
        cluster
        grade
        standard
        imageUrl
        gameTemplatesCount
        createdAt
        updatedAt
        type
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
        title
        owner
        version
        description
        domain
        cluster
        grade
        standard
        phaseOneTime
        phaseTwoTime
        imageUrl
        questionTemplatesCount
        createdAt
        updatedAt
        type
        __typename
      }
      privateQuestionTemplate {
        id
        title
        owner
        version
        choices
        instructions
        answerSettings
        domain
        cluster
        grade
        standard
        imageUrl
        gameTemplatesCount
        createdAt
        updatedAt
        type
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
export const onTeamMemberUpdateByTeamId = /* GraphQL */ `
  subscription OnTeamMemberUpdateByTeamId($teamTeamMembersId: ID!) {
    onTeamMemberUpdateByTeamId(teamTeamMembersId: $teamTeamMembersId) {
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
        responses
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
        responses
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
