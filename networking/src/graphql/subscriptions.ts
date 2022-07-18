/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGameSession = /* GraphQL */ `
  subscription OnCreateGameSession {
    onCreateGameSession {
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
  subscription OnUpdateGameSession {
    onUpdateGameSession {
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
  subscription OnDeleteGameSession {
    onDeleteGameSession {
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
  subscription OnCreateTeam {
    onCreateTeam {
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
  subscription OnUpdateTeam {
    onUpdateTeam {
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
  subscription OnDeleteTeam {
    onDeleteTeam {
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
  subscription OnCreateTeamMember {
    onCreateTeamMember {
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
  subscription OnUpdateTeamMember {
    onUpdateTeamMember {
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
  subscription OnDeleteTeamMember {
    onDeleteTeamMember {
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
  subscription OnCreateTeamAnswer {
    onCreateTeamAnswer {
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
  subscription OnUpdateTeamAnswer {
    onUpdateTeamAnswer {
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
  subscription OnDeleteTeamAnswer {
    onDeleteTeamAnswer {
      id
      isChosen
      text
      createdAt
      updatedAt
      teamMemberAnswersId
    }
  }
`;
