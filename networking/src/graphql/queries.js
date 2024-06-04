/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPublicGameTemplate = /* GraphQL */ `
  query GetPublicGameTemplate($id: ID!) {
    getPublicGameTemplate(id: $id) {
      id
      owner
      title
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
export const listPublicGameTemplates = /* GraphQL */ `
  query ListPublicGameTemplates(
    $filter: ModelPublicGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPublicGameTemplates(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const publicGameTemplatesByDate = /* GraphQL */ `
  query PublicGameTemplatesByDate(
    $type: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicGameTemplatesByDate(
      type: $type
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const publicGameTemplatesByGrade = /* GraphQL */ `
  query PublicGameTemplatesByGrade(
    $type: String!
    $grade: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicGameTemplatesByGrade(
      type: $type
      grade: $grade
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const publicGameTemplatesByPublicQuestionTemplatesCount = /* GraphQL */ `
  query PublicGameTemplatesByPublicQuestionTemplatesCount(
    $type: String!
    $questionTemplatesCount: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicGameTemplatesByPublicQuestionTemplatesCount(
      type: $type
      questionTemplatesCount: $questionTemplatesCount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const getPrivateGameTemplate = /* GraphQL */ `
  query GetPrivateGameTemplate($id: ID!) {
    getPrivateGameTemplate(id: $id) {
      id
      owner
      title
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
export const listPrivateGameTemplates = /* GraphQL */ `
  query ListPrivateGameTemplates(
    $filter: ModelPrivateGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPrivateGameTemplates(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const privateGameTemplatesByDate = /* GraphQL */ `
  query PrivateGameTemplatesByDate(
    $type: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPrivateGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateGameTemplatesByDate(
      type: $type
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const privateGameTemplatesByGrade = /* GraphQL */ `
  query PrivateGameTemplatesByGrade(
    $type: String!
    $grade: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPrivateGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateGameTemplatesByGrade(
      type: $type
      grade: $grade
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const privateGameTemplatesByPrivateQuestionTemplatesCount = /* GraphQL */ `
  query PrivateGameTemplatesByPrivateQuestionTemplatesCount(
    $type: String!
    $questionTemplatesCount: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPrivateGameTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateGameTemplatesByPrivateQuestionTemplatesCount(
      type: $type
      questionTemplatesCount: $questionTemplatesCount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const getPublicQuestionTemplate = /* GraphQL */ `
  query GetPublicQuestionTemplate($id: ID!) {
    getPublicQuestionTemplate(id: $id) {
      id
      owner
      title
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
export const listPublicQuestionTemplates = /* GraphQL */ `
  query ListPublicQuestionTemplates(
    $filter: ModelPublicQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPublicQuestionTemplates(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const publicQuestionTemplatesByDate = /* GraphQL */ `
  query PublicQuestionTemplatesByDate(
    $type: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicQuestionTemplatesByDate(
      type: $type
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const publicQuestionTemplatesByGrade = /* GraphQL */ `
  query PublicQuestionTemplatesByGrade(
    $type: String!
    $grade: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicQuestionTemplatesByGrade(
      type: $type
      grade: $grade
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const publicQuestionTemplatesByPublicGameTemplatesCount = /* GraphQL */ `
  query PublicQuestionTemplatesByPublicGameTemplatesCount(
    $type: String!
    $gameTemplatesCount: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPublicQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    publicQuestionTemplatesByPublicGameTemplatesCount(
      type: $type
      gameTemplatesCount: $gameTemplatesCount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const getPrivateQuestionTemplate = /* GraphQL */ `
  query GetPrivateQuestionTemplate($id: ID!) {
    getPrivateQuestionTemplate(id: $id) {
      id
      owner
      title
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
export const listPrivateQuestionTemplates = /* GraphQL */ `
  query ListPrivateQuestionTemplates(
    $filter: ModelPrivateQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPrivateQuestionTemplates(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const privateQuestionTemplatesByDate = /* GraphQL */ `
  query PrivateQuestionTemplatesByDate(
    $type: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPrivateQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateQuestionTemplatesByDate(
      type: $type
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const privateQuestionTemplatesByGrade = /* GraphQL */ `
  query PrivateQuestionTemplatesByGrade(
    $type: String!
    $grade: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPrivateQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateQuestionTemplatesByGrade(
      type: $type
      grade: $grade
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const privateQuestionTemplatesByPrivateGameTemplatesCount = /* GraphQL */ `
  query PrivateQuestionTemplatesByPrivateGameTemplatesCount(
    $type: String!
    $gameTemplatesCount: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPrivateQuestionTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    privateQuestionTemplatesByPrivateGameTemplatesCount(
      type: $type
      gameTemplatesCount: $gameTemplatesCount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
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
      nextToken
      __typename
    }
  }
`;
export const getGameSession = /* GraphQL */ `
  query GetGameSession($id: ID!) {
    getGameSession(id: $id) {
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
export const listGameSessions = /* GraphQL */ `
  query ListGameSessions(
    $filter: ModelGameSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGameSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        gameId
        startTime
        phaseOneTime
        phaseTwoTime
        currentQuestionIndex
        currentState
        gameCode
        isAdvancedMode
        imageUrl
        description
        title
        currentTimer
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const gameSessionByState = /* GraphQL */ `
  query GameSessionByState(
    $currentState: GameSessionState!
    $sortDirection: ModelSortDirection
    $filter: ModelGameSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    gameSessionByState(
      currentState: $currentState
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        gameId
        startTime
        phaseOneTime
        phaseTwoTime
        currentQuestionIndex
        currentState
        gameCode
        isAdvancedMode
        imageUrl
        description
        title
        currentTimer
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const gameSessionByCode = /* GraphQL */ `
  query GameSessionByCode(
    $gameCode: Int!
    $sortDirection: ModelSortDirection
    $filter: ModelGameSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    gameSessionByCode(
      gameCode: $gameCode
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        gameId
        startTime
        phaseOneTime
        phaseTwoTime
        currentQuestionIndex
        currentState
        gameCode
        isAdvancedMode
        imageUrl
        description
        title
        currentTimer
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getQuestion = /* GraphQL */ `
  query GetQuestion($id: ID!, $order: Int!, $gameSessionId: ID!) {
    getQuestion(id: $id, order: $order, gameSessionId: $gameSessionId) {
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
  }
`;
export const listQuestions = /* GraphQL */ `
  query ListQuestions(
    $id: ID
    $orderGameSessionId: ModelQuestionPrimaryCompositeKeyConditionInput
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listQuestions(
      id: $id
      orderGameSessionId: $orderGameSessionId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getTeam = /* GraphQL */ `
  query GetTeam($id: ID!) {
    getTeam(id: $id) {
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
export const listTeams = /* GraphQL */ `
  query ListTeams(
    $filter: ModelTeamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeams(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const getTeamMember = /* GraphQL */ `
  query GetTeamMember($id: ID!) {
    getTeamMember(id: $id) {
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
export const listTeamMembers = /* GraphQL */ `
  query ListTeamMembers(
    $filter: ModelTeamMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeamMembers(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const getTeamAnswer = /* GraphQL */ `
  query GetTeamAnswer($id: ID!) {
    getTeamAnswer(id: $id) {
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
export const listTeamAnswers = /* GraphQL */ `
  query ListTeamAnswers(
    $filter: ModelTeamAnswerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeamAnswers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getPublicGameQuestions = /* GraphQL */ `
  query GetPublicGameQuestions($id: ID!) {
    getPublicGameQuestions(id: $id) {
      id
      publicGameTemplateID
      publicQuestionTemplateID
      publicGameTemplate {
        id
        owner
        title
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
        owner
        title
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
export const listPublicGameQuestions = /* GraphQL */ `
  query ListPublicGameQuestions(
    $filter: ModelPublicGameQuestionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPublicGameQuestions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
  }
`;
export const getPrivateGameQuestions = /* GraphQL */ `
  query GetPrivateGameQuestions($id: ID!) {
    getPrivateGameQuestions(id: $id) {
      id
      privateGameTemplateID
      privateQuestionTemplateID
      privateGameTemplate {
        id
        owner
        title
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
        owner
        title
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
export const listPrivateGameQuestions = /* GraphQL */ `
  query ListPrivateGameQuestions(
    $filter: ModelPrivateGameQuestionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPrivateGameQuestions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
  }
`;
