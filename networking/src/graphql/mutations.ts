/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
export const createQuestion = /* GraphQL */ `
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
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
export const updateQuestion = /* GraphQL */ `
  mutation UpdateQuestion(
    $input: UpdateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    updateQuestion(input: $input, condition: $condition) {
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
export const deleteQuestion = /* GraphQL */ `
  mutation DeleteQuestion(
    $input: DeleteQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    deleteQuestion(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
      teamMemberAnswersId
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
      createdAt
      updatedAt
      teamMemberAnswersId
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
      createdAt
      updatedAt
      teamMemberAnswersId
    }
  }
`;
