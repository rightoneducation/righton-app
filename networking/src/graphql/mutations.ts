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
      gameSessionId
      gameSession {
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
        questions {
          nextToken
        }
        createdAt
        updatedAt
      }
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
      gameSessionId
      gameSession {
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
        questions {
          nextToken
        }
        createdAt
        updatedAt
      }
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
      gameSessionId
      gameSession {
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
        questions {
          nextToken
        }
        createdAt
        updatedAt
      }
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
export const createTeamMember = /* GraphQL */ `
  mutation CreateTeamMember(
    $input: CreateTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    createTeamMember(input: $input, condition: $condition) {
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
export const updateTeamMember = /* GraphQL */ `
  mutation UpdateTeamMember(
    $input: UpdateTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    updateTeamMember(input: $input, condition: $condition) {
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
export const deleteTeamMember = /* GraphQL */ `
  mutation DeleteTeamMember(
    $input: DeleteTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    deleteTeamMember(input: $input, condition: $condition) {
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
export const createTeamAnswer = /* GraphQL */ `
  mutation CreateTeamAnswer(
    $input: CreateTeamAnswerInput!
    $condition: ModelTeamAnswerConditionInput
  ) {
    createTeamAnswer(input: $input, condition: $condition) {
      id
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
      isChosen
      text
      createdAt
      updatedAt
      teamMemberAnswersId
    }
  }
`;
