/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
          trickiestAnswerIDs
          score
          createdAt
          updatedAt
          gameSessionTeamsId
          teamQuestionId
          teamQuestionGameSessionId
        }
        nextToken
      }
      currentQuestionId
      currentState
      gameCode
      isAdvanced
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
          gameSessionId
        }
        nextToken
      }
      createdAt
      updatedAt
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
          trickiestAnswerIDs
          score
          createdAt
          updatedAt
          gameSessionTeamsId
          teamQuestionId
          teamQuestionGameSessionId
        }
        nextToken
      }
      currentQuestionId
      currentState
      gameCode
      isAdvanced
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
          gameSessionId
        }
        nextToken
      }
      createdAt
      updatedAt
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
          trickiestAnswerIDs
          score
          createdAt
          updatedAt
          gameSessionTeamsId
          teamQuestionId
          teamQuestionGameSessionId
        }
        nextToken
      }
      currentQuestionId
      currentState
      gameCode
      isAdvanced
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
          gameSessionId
        }
        nextToken
      }
      createdAt
      updatedAt
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
        answer
        wrongAnswers
        imageUrl
        instructions
        standard
        cluster
        domain
        grade
        gameSessionId
        gameSession {
          id
          gameId
          startTime
          phaseOneTime
          phaseTwoTime
          currentQuestionId
          currentState
          gameCode
          isAdvanced
          imageUrl
          description
          title
          currentTimer
          createdAt
          updatedAt
        }
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
      teamQuestionGameSessionId
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
        answer
        wrongAnswers
        imageUrl
        instructions
        standard
        cluster
        domain
        grade
        gameSessionId
        gameSession {
          id
          gameId
          startTime
          phaseOneTime
          phaseTwoTime
          currentQuestionId
          currentState
          gameCode
          isAdvanced
          imageUrl
          description
          title
          currentTimer
          createdAt
          updatedAt
        }
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
      teamQuestionGameSessionId
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
        answer
        wrongAnswers
        imageUrl
        instructions
        standard
        cluster
        domain
        grade
        gameSessionId
        gameSession {
          id
          gameId
          startTime
          phaseOneTime
          phaseTwoTime
          currentQuestionId
          currentState
          gameCode
          isAdvanced
          imageUrl
          description
          title
          currentTimer
          createdAt
          updatedAt
        }
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
      teamQuestionGameSessionId
    }
  }
`;
export const onCreateTeamMember = /* GraphQL */ `
  subscription OnCreateTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
  ) {
    onCreateTeamMember(filter: $filter) {
      id
      team {
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
        teamQuestionGameSessionId
      }
      isFacilitator
      answers {
        items {
          id
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
export const onUpdateTeamMember = /* GraphQL */ `
  subscription OnUpdateTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
  ) {
    onUpdateTeamMember(filter: $filter) {
      id
      team {
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
        teamQuestionGameSessionId
      }
      isFacilitator
      answers {
        items {
          id
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
export const onDeleteTeamMember = /* GraphQL */ `
  subscription OnDeleteTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
  ) {
    onDeleteTeamMember(filter: $filter) {
      id
      team {
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
        teamQuestionGameSessionId
      }
      isFacilitator
      answers {
        items {
          id
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
export const onCreateTeamAnswer = /* GraphQL */ `
  subscription OnCreateTeamAnswer(
    $filter: ModelSubscriptionTeamAnswerFilterInput
  ) {
    onCreateTeamAnswer(filter: $filter) {
      id
      isChosen
      text
      createdAt
      updatedAt
      teamMemberAnswersId
    }
  }
`;
export const onUpdateTeamAnswer = /* GraphQL */ `
  subscription OnUpdateTeamAnswer(
    $filter: ModelSubscriptionTeamAnswerFilterInput
  ) {
    onUpdateTeamAnswer(filter: $filter) {
      id
      isChosen
      text
      createdAt
      updatedAt
      teamMemberAnswersId
    }
  }
`;
export const onDeleteTeamAnswer = /* GraphQL */ `
  subscription OnDeleteTeamAnswer(
    $filter: ModelSubscriptionTeamAnswerFilterInput
  ) {
    onDeleteTeamAnswer(filter: $filter) {
      id
      isChosen
      text
      createdAt
      updatedAt
      teamMemberAnswersId
    }
  }
`;
