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
        nextToken
      }
      currentQuestionId
      currentState
      gameCode
      isAdvanced
      imageUrl
      description
      title
      createdAt
      questions {
        nextToken
      }
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
        nextToken
      }
      currentQuestionId
      currentState
      gameCode
      isAdvanced
      imageUrl
      description
      title
      createdAt
      questions {
        nextToken
      }
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
        nextToken
      }
      currentQuestionId
      currentState
      gameCode
      isAdvanced
      imageUrl
      description
      title
      createdAt
      questions {
        nextToken
      }
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
        trickiestAnswerIDs
        score
        createdAt
        updatedAt
        gameSessionTeamsId
        teamQuestionId
      }
      isFacilitator
      memberAnswers {
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
        trickiestAnswerIDs
        score
        createdAt
        updatedAt
        gameSessionTeamsId
        teamQuestionId
      }
      isFacilitator
      memberAnswers {
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
        trickiestAnswerIDs
        score
        createdAt
        updatedAt
        gameSessionTeamsId
        teamQuestionId
      }
      isFacilitator
      memberAnswers {
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
      teamMemberMemberAnswersId
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
      teamMemberMemberAnswersId
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
      teamMemberMemberAnswersId
    }
  }
`;
