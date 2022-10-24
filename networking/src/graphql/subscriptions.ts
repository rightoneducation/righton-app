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
  subscription OnTeamMemberUpdateByTeamId($teamTeamMembersId: ID!) {
    onTeamMemberUpdateByTeamId(teamTeamMembersId: $teamTeamMembersId) {
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
export const onTeamCreateByGameSessionId = /* GraphQL */ `
  subscription OnTeamCreateByGameSessionId($gameSessionTeamsId: ID!) {
    onTeamCreateByGameSessionId(gameSessionTeamsId: $gameSessionTeamsId) {
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
export const onTeamDeleteByGameSessionId = /* GraphQL */ `
  subscription OnTeamDeleteByGameSessionId($gameSessionTeamsId: ID!) {
    onTeamDeleteByGameSessionId(gameSessionTeamsId: $gameSessionTeamsId) {
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
  subscription OnCreateTeam($filter: ModelSubscriptionTeamFilterInput) {
    onCreateTeam(filter: $filter) {
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
  subscription OnUpdateTeam($filter: ModelSubscriptionTeamFilterInput) {
    onUpdateTeam(filter: $filter) {
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
  subscription OnDeleteTeam($filter: ModelSubscriptionTeamFilterInput) {
    onDeleteTeam(filter: $filter) {
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
  subscription OnCreateTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
  ) {
    onCreateTeamMember(filter: $filter) {
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
  subscription OnUpdateTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
  ) {
    onUpdateTeamMember(filter: $filter) {
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
  subscription OnDeleteTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
  ) {
    onDeleteTeamMember(filter: $filter) {
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
  subscription OnCreateTeamAnswer(
    $filter: ModelSubscriptionTeamAnswerFilterInput
  ) {
    onCreateTeamAnswer(filter: $filter) {
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
  subscription OnUpdateTeamAnswer(
    $filter: ModelSubscriptionTeamAnswerFilterInput
  ) {
    onUpdateTeamAnswer(filter: $filter) {
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
  subscription OnDeleteTeamAnswer(
    $filter: ModelSubscriptionTeamAnswerFilterInput
  ) {
    onDeleteTeamAnswer(filter: $filter) {
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
