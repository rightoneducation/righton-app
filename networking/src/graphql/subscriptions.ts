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
            isHintEnabled
            isConfidenceEnabled
            isShortAnswerEnabled
            gameSessionId
            __typename
          }
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
                  answerContents
                  isTrickAnswer
                  confidenceLevel
                  createdAt
                  updatedAt
                  teamMemberAnswersId
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
          isHintEnabled
          isConfidenceEnabled
          isShortAnswerEnabled
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
          questionId
          isChosen
          text
          answerContents
          isTrickAnswer
          confidenceLevel
          createdAt
          updatedAt
          teamMemberAnswersId
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
        imageUrl
        instructions
        standard
        cluster
        domain
        grade
        order
        isHintEnabled
        isConfidenceEnabled
        isShortAnswerEnabled
        gameSessionId
        __typename
      }
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
              answerContents
              isTrickAnswer
              confidenceLevel
              createdAt
              updatedAt
              teamMemberAnswersId
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
        imageUrl
        instructions
        standard
        cluster
        domain
        grade
        order
        isHintEnabled
        isConfidenceEnabled
        isShortAnswerEnabled
        gameSessionId
        __typename
      }
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
              answerContents
              isTrickAnswer
              confidenceLevel
              createdAt
              updatedAt
              teamMemberAnswersId
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
            isHintEnabled
            isConfidenceEnabled
            isShortAnswerEnabled
            gameSessionId
            __typename
          }
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
                  answerContents
                  isTrickAnswer
                  confidenceLevel
                  createdAt
                  updatedAt
                  teamMemberAnswersId
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
          isHintEnabled
          isConfidenceEnabled
          isShortAnswerEnabled
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
            isHintEnabled
            isConfidenceEnabled
            isShortAnswerEnabled
            gameSessionId
            __typename
          }
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
                  answerContents
                  isTrickAnswer
                  confidenceLevel
                  createdAt
                  updatedAt
                  teamMemberAnswersId
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
          isHintEnabled
          isConfidenceEnabled
          isShortAnswerEnabled
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
            isHintEnabled
            isConfidenceEnabled
            isShortAnswerEnabled
            gameSessionId
            __typename
          }
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
                  answerContents
                  isTrickAnswer
                  confidenceLevel
                  createdAt
                  updatedAt
                  teamMemberAnswersId
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
          isHintEnabled
          isConfidenceEnabled
          isShortAnswerEnabled
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
        imageUrl
        instructions
        standard
        cluster
        domain
        grade
        order
        isHintEnabled
        isConfidenceEnabled
        isShortAnswerEnabled
        gameSessionId
        __typename
      }
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
              answerContents
              isTrickAnswer
              confidenceLevel
              createdAt
              updatedAt
              teamMemberAnswersId
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
        imageUrl
        instructions
        standard
        cluster
        domain
        grade
        order
        isHintEnabled
        isConfidenceEnabled
        isShortAnswerEnabled
        gameSessionId
        __typename
      }
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
              answerContents
              isTrickAnswer
              confidenceLevel
              createdAt
              updatedAt
              teamMemberAnswersId
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
        imageUrl
        instructions
        standard
        cluster
        domain
        grade
        order
        isHintEnabled
        isConfidenceEnabled
        isShortAnswerEnabled
        gameSessionId
        __typename
      }
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
              answerContents
              isTrickAnswer
              confidenceLevel
              createdAt
              updatedAt
              teamMemberAnswersId
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
          questionId
          isChosen
          text
          answerContents
          isTrickAnswer
          confidenceLevel
          createdAt
          updatedAt
          teamMemberAnswersId
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
          questionId
          isChosen
          text
          answerContents
          isTrickAnswer
          confidenceLevel
          createdAt
          updatedAt
          teamMemberAnswersId
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
          questionId
          isChosen
          text
          answerContents
          isTrickAnswer
          confidenceLevel
          createdAt
          updatedAt
          teamMemberAnswersId
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
      questionId
      isChosen
      text
      answerContents
      isTrickAnswer
      confidenceLevel
      createdAt
      updatedAt
      teamMemberAnswersId
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
      questionId
      isChosen
      text
      answerContents
      isTrickAnswer
      confidenceLevel
      createdAt
      updatedAt
      teamMemberAnswersId
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
      questionId
      isChosen
      text
      answerContents
      isTrickAnswer
      confidenceLevel
      createdAt
      updatedAt
      teamMemberAnswersId
      __typename
    }
  }
`;
