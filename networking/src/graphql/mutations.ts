/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGame = /* GraphQL */ `
  mutation CreateGame(
    $input: CreateGameInput!
    $condition: ModelGameConditionInput
  ) {
    createGame(input: $input, condition: $condition) {
      id
      phaseOneTime
      phaseTwoTime
      title
      description
      imageUrl
      questions
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateGame = /* GraphQL */ `
  mutation UpdateGame(
    $input: UpdateGameInput!
    $condition: ModelGameConditionInput
  ) {
    updateGame(input: $input, condition: $condition) {
      id
      phaseOneTime
      phaseTwoTime
      title
      description
      imageUrl
      questions
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteGame = /* GraphQL */ `
  mutation DeleteGame(
    $input: DeleteGameInput!
    $condition: ModelGameConditionInput
  ) {
    deleteGame(input: $input, condition: $condition) {
      id
      phaseOneTime
      phaseTwoTime
      title
      description
      imageUrl
      questions
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createGameQuestion = /* GraphQL */ `
  mutation CreateGameQuestion(
    $input: CreateGameQuestionInput!
    $condition: ModelGameQuestionConditionInput
  ) {
    createGameQuestion(input: $input, condition: $condition) {
      id
      text
      choices
      imageUrl
      instructions
      cluster
      domain
      grade
      standard
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateGameQuestion = /* GraphQL */ `
  mutation UpdateGameQuestion(
    $input: UpdateGameQuestionInput!
    $condition: ModelGameQuestionConditionInput
  ) {
    updateGameQuestion(input: $input, condition: $condition) {
      id
      text
      choices
      imageUrl
      instructions
      cluster
      domain
      grade
      standard
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteGameQuestion = /* GraphQL */ `
  mutation DeleteGameQuestion(
    $input: DeleteGameQuestionInput!
    $condition: ModelGameQuestionConditionInput
  ) {
    deleteGameQuestion(input: $input, condition: $condition) {
      id
      text
      choices
      imageUrl
      instructions
      cluster
      domain
      grade
      standard
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createGameSession = /* GraphQL */ `
  mutation CreateGameSession(
    $input: CreateGameSessionInput!
    $condition: ModelGameSessionConditionInput
  ) {
    createGameSession(input: $input, condition: $condition) {
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
export const updateGameSession = /* GraphQL */ `
  mutation UpdateGameSession(
    $input: UpdateGameSessionInput!
    $condition: ModelGameSessionConditionInput
  ) {
    updateGameSession(input: $input, condition: $condition) {
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
export const deleteGameSession = /* GraphQL */ `
  mutation DeleteGameSession(
    $input: DeleteGameSessionInput!
    $condition: ModelGameSessionConditionInput
  ) {
    deleteGameSession(input: $input, condition: $condition) {
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
export const createQuestion = /* GraphQL */ `
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
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
      __typename
    }
  }
`;
export const updateQuestion = /* GraphQL */ `
  mutation UpdateQuestion(
    $input: UpdateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    updateQuestion(input: $input, condition: $condition) {
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
      __typename
    }
  }
`;
export const deleteQuestion = /* GraphQL */ `
  mutation DeleteQuestion(
    $input: DeleteQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    deleteQuestion(input: $input, condition: $condition) {
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
      __typename
    }
  }
`;
export const createTeam = /* GraphQL */ `
  mutation CreateTeam(
    $input: CreateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    createTeam(input: $input, condition: $condition) {
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
export const updateTeam = /* GraphQL */ `
  mutation UpdateTeam(
    $input: UpdateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    updateTeam(input: $input, condition: $condition) {
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
export const deleteTeam = /* GraphQL */ `
  mutation DeleteTeam(
    $input: DeleteTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    deleteTeam(input: $input, condition: $condition) {
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
export const createTeamMember = /* GraphQL */ `
  mutation CreateTeamMember(
    $input: CreateTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    createTeamMember(input: $input, condition: $condition) {
      id
      isFacilitator
      answers {
        items {
          id
          questionId
          isChosen
          text
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
export const updateTeamMember = /* GraphQL */ `
  mutation UpdateTeamMember(
    $input: UpdateTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    updateTeamMember(input: $input, condition: $condition) {
      id
      isFacilitator
      answers {
        items {
          id
          questionId
          isChosen
          text
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
export const deleteTeamMember = /* GraphQL */ `
  mutation DeleteTeamMember(
    $input: DeleteTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    deleteTeamMember(input: $input, condition: $condition) {
      id
      isFacilitator
      answers {
        items {
          id
          questionId
          isChosen
          text
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
export const createTeamAnswer = /* GraphQL */ `
  mutation CreateTeamAnswer(
    $input: CreateTeamAnswerInput!
    $condition: ModelTeamAnswerConditionInput
  ) {
    createTeamAnswer(input: $input, condition: $condition) {
      id
      questionId
      isChosen
      text
      isTrickAnswer
      confidenceLevel
      createdAt
      updatedAt
      teamMemberAnswersId
      __typename
    }
  }
`;
export const updateTeamAnswer = /* GraphQL */ `
  mutation UpdateTeamAnswer(
    $input: UpdateTeamAnswerInput!
    $condition: ModelTeamAnswerConditionInput
  ) {
    updateTeamAnswer(input: $input, condition: $condition) {
      id
      questionId
      isChosen
      text
      isTrickAnswer
      confidenceLevel
      createdAt
      updatedAt
      teamMemberAnswersId
      __typename
    }
  }
`;
export const deleteTeamAnswer = /* GraphQL */ `
  mutation DeleteTeamAnswer(
    $input: DeleteTeamAnswerInput!
    $condition: ModelTeamAnswerConditionInput
  ) {
    deleteTeamAnswer(input: $input, condition: $condition) {
      id
      questionId
      isChosen
      text
      isTrickAnswer
      confidenceLevel
      createdAt
      updatedAt
      teamMemberAnswersId
      __typename
    }
  }
`;
