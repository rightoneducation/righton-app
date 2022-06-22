/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGameSession = /* GraphQL */ `
  subscription OnCreateGameSession {
    onCreateGameSession {
      id
      game {
        id
        title
        description
        imageUrl
        isAdvanced
        grade
        questions {
          nextToken
        }
      }
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
        }
        nextToken
      }
      currentQuestion
      currentState
      gameCode
      updatedAt
      createdAt
      gameSessionGameId
    }
  }
`;
export const onUpdateGameSession = /* GraphQL */ `
  subscription OnUpdateGameSession {
    onUpdateGameSession {
      id
      game {
        id
        title
        description
        imageUrl
        isAdvanced
        grade
        questions {
          nextToken
        }
      }
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
        }
        nextToken
      }
      currentQuestion
      currentState
      gameCode
      updatedAt
      createdAt
      gameSessionGameId
    }
  }
`;
export const onDeleteGameSession = /* GraphQL */ `
  subscription OnDeleteGameSession {
    onDeleteGameSession {
      id
      game {
        id
        title
        description
        imageUrl
        isAdvanced
        grade
        questions {
          nextToken
        }
      }
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
        }
        nextToken
      }
      currentQuestion
      currentState
      gameCode
      updatedAt
      createdAt
      gameSessionGameId
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
        question
        answer
        trickAnswers
        imageUrl
        instructions
        grade
        gameQuestionsId
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
        question
        answer
        trickAnswers
        imageUrl
        instructions
        grade
        gameQuestionsId
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
        question
        answer
        trickAnswers
        imageUrl
        instructions
        grade
        gameQuestionsId
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
          question
          answer
          trickAnswers
          imageUrl
          instructions
          grade
          gameQuestionsId
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
      isFacilitator
      memberAnswers {
        items {
          id
          isChosen
          text
          createdAt
          updatedAt
          teamMemberMemberAnswersId
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
          question
          answer
          trickAnswers
          imageUrl
          instructions
          grade
          gameQuestionsId
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
      isFacilitator
      memberAnswers {
        items {
          id
          isChosen
          text
          createdAt
          updatedAt
          teamMemberMemberAnswersId
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
          question
          answer
          trickAnswers
          imageUrl
          instructions
          grade
          gameQuestionsId
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
      isFacilitator
      memberAnswers {
        items {
          id
          isChosen
          text
          createdAt
          updatedAt
          teamMemberMemberAnswersId
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
