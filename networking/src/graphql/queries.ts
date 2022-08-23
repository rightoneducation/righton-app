/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGameSession = /* GraphQL */ `
  query GetGameSession($id: ID!) {
    getGameSession(id: $id) {
      id
      gameId
      startTime
      phaseOneTime
      phaseTwoTime
      teams {
        items {
          id
          name
          question {
            id
            text
            answer
            wrongAnswers
            imageUrl
            instructions
            standard
            cluster
            domain
            grade
            order
            gameSessionId
          }
          trickiestAnswerIDs
          teamMembers {
            items {
              id
              isFacilitator
              deviceId
              createdAt
              updatedAt
              teamTeamMembersId
            }
            nextToken
          }
          score
          createdAt
          updatedAt
          gameSessionTeamsId
          teamQuestionId
          teamQuestionOrder
          teamQuestionGameSessionId
        }
        nextToken
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
        items {
          id
          text
          answer
          wrongAnswers
          imageUrl
          instructions
          standard
          cluster
          domain
          grade
          order
          gameSessionId
        }
        nextToken
      }
      createdAt
      updatedAt
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
        teams {
          items {
            id
            name
            question {
              id
              text
              answer
              wrongAnswers
              imageUrl
              instructions
              standard
              cluster
              domain
              grade
              order
              gameSessionId
            }
            trickiestAnswerIDs
            teamMembers {
              nextToken
            }
            score
            createdAt
            updatedAt
            gameSessionTeamsId
            teamQuestionId
            teamQuestionOrder
            teamQuestionGameSessionId
          }
          nextToken
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
          items {
            id
            text
            answer
            wrongAnswers
            imageUrl
            instructions
            standard
            cluster
            domain
            grade
            order
            gameSessionId
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getQuestion = /* GraphQL */ `
  query GetQuestion($id: Int!, $order: Int!, $gameSessionId: ID!) {
    getQuestion(id: $id, order: $order, gameSessionId: $gameSessionId) {
      id
      text
      answer
      wrongAnswers
      imageUrl
      instructions
      standard
      cluster
      domain
      grade
      order
      gameSessionId
    }
  }
`;
export const listQuestions = /* GraphQL */ `
  query ListQuestions(
    $id: Int
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
        answer
        wrongAnswers
        imageUrl
        instructions
        standard
        cluster
        domain
        grade
        order
        gameSessionId
      }
      nextToken
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
        answer
        wrongAnswers
        imageUrl
        instructions
        standard
        cluster
        domain
        grade
        order
        gameSessionId
      }
      trickiestAnswerIDs
      teamMembers {
        items {
          id
          isFacilitator
          answers {
            items {
              id
              questionId
              isChosen
              text
              createdAt
              updatedAt
              teamMemberAnswersId
            }
            nextToken
          }
          deviceId
          createdAt
          updatedAt
          teamTeamMembersId
        }
        nextToken
      }
      score
      createdAt
      updatedAt
      gameSessionTeamsId
      teamQuestionId
      teamQuestionOrder
      teamQuestionGameSessionId
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
        question {
          id
          text
          answer
          wrongAnswers
          imageUrl
          instructions
          standard
          cluster
          domain
          grade
          order
          gameSessionId
        }
        trickiestAnswerIDs
        teamMembers {
          items {
            id
            isFacilitator
            answers {
              nextToken
            }
            deviceId
            createdAt
            updatedAt
            teamTeamMembersId
          }
          nextToken
        }
        score
        createdAt
        updatedAt
        gameSessionTeamsId
        teamQuestionId
        teamQuestionOrder
        teamQuestionGameSessionId
      }
      nextToken
    }
  }
`;
export const getTeamMember = /* GraphQL */ `
  query GetTeamMember($id: ID!) {
    getTeamMember(id: $id) {
      id
      isFacilitator
      answers {
        items {
          id
          questionId
          isChosen
          text
          createdAt
          updatedAt
          teamMemberAnswersId
        }
        nextToken
      }
      deviceId
      createdAt
      updatedAt
      teamTeamMembersId
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
        answers {
          items {
            id
            questionId
            isChosen
            text
            createdAt
            updatedAt
            teamMemberAnswersId
          }
          nextToken
        }
        deviceId
        createdAt
        updatedAt
        teamTeamMembersId
      }
      nextToken
    }
  }
`;
export const getTeamAnswer = /* GraphQL */ `
  query GetTeamAnswer($id: ID!) {
    getTeamAnswer(id: $id) {
      id
      questionId
      isChosen
      text
      createdAt
      updatedAt
      teamMemberAnswersId
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
        questionId
        isChosen
        text
        createdAt
        updatedAt
        teamMemberAnswersId
      }
      nextToken
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
        teams {
          items {
            id
            name
            question {
              id
              text
              answer
              wrongAnswers
              imageUrl
              instructions
              standard
              cluster
              domain
              grade
              order
              gameSessionId
            }
            trickiestAnswerIDs
            teamMembers {
              nextToken
            }
            score
            createdAt
            updatedAt
            gameSessionTeamsId
            teamQuestionId
            teamQuestionOrder
            teamQuestionGameSessionId
          }
          nextToken
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
          items {
            id
            text
            answer
            wrongAnswers
            imageUrl
            instructions
            standard
            cluster
            domain
            grade
            order
            gameSessionId
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
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
        teams {
          items {
            id
            name
            question {
              id
              text
              answer
              wrongAnswers
              imageUrl
              instructions
              standard
              cluster
              domain
              grade
              order
              gameSessionId
            }
            trickiestAnswerIDs
            teamMembers {
              nextToken
            }
            score
            createdAt
            updatedAt
            gameSessionTeamsId
            teamQuestionId
            teamQuestionOrder
            teamQuestionGameSessionId
          }
          nextToken
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
          items {
            id
            text
            answer
            wrongAnswers
            imageUrl
            instructions
            standard
            cluster
            domain
            grade
            order
            gameSessionId
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
