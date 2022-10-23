/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
          question {
            id
            text
            choices
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
          choices
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
export const onTeamMemberUpdateByTeamId = /* GraphQL */ `
  subscription OnTeamMemberUpdateByTeamId($teamId: ID!) {
    onTeamMemberUpdateByTeamId(teamId: $teamId) {
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
          question {
            id
            text
            choices
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
          choices
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
          question {
            id
            text
            choices
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
          choices
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
          question {
            id
            text
            choices
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
          choices
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
export const onCreateTeam = /* GraphQL */ `
  subscription OnCreateTeam {
    onCreateTeam {
      id
      name
      question {
        id
        text
        choices
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
export const onUpdateTeam = /* GraphQL */ `
  subscription OnUpdateTeam {
    onUpdateTeam {
      id
      name
      question {
        id
        text
        choices
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
export const onDeleteTeam = /* GraphQL */ `
  subscription OnDeleteTeam {
    onDeleteTeam {
      id
      name
      question {
        id
        text
        choices
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
export const onCreateTeamMember = /* GraphQL */ `
  subscription OnCreateTeamMember {
    onCreateTeamMember {
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
export const onUpdateTeamMember = /* GraphQL */ `
  subscription OnUpdateTeamMember {
    onUpdateTeamMember {
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
export const onDeleteTeamMember = /* GraphQL */ `
  subscription OnDeleteTeamMember {
    onDeleteTeamMember {
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
export const onCreateTeamAnswer = /* GraphQL */ `
  subscription OnCreateTeamAnswer {
    onCreateTeamAnswer {
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
export const onUpdateTeamAnswer = /* GraphQL */ `
  subscription OnUpdateTeamAnswer {
    onUpdateTeamAnswer {
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
export const onDeleteTeamAnswer = /* GraphQL */ `
  subscription OnDeleteTeamAnswer {
    onDeleteTeamAnswer {
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
