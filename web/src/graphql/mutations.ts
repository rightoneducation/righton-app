/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const deleteGame = /* GraphQL */ `
  mutation DeleteGame($id: Int!) {
    deleteGame(id: $id) {
      id
      title
      description
      cluster
      domain
      grade
      standard
      questions {
        id
        text
        answer
        imageUrl
        instructions
        updatedAt
        createdAt
        cluster
        domain
        grade
        standard
      }
      updatedAt
      createdAt
    }
  }
`;
export const createGame = /* GraphQL */ `
  mutation CreateGame($game: CreateGameInput!) {
    createGame(game: $game) {
      id
      title
      description
      cluster
      domain
      grade
      standard
      questions {
        id
        text
        answer
        imageUrl
        instructions
        updatedAt
        createdAt
        cluster
        domain
        grade
        standard
      }
      updatedAt
      createdAt
    }
  }
`;
export const updateGame = /* GraphQL */ `
  mutation UpdateGame($game: UpdateGameInput!) {
    updateGame(game: $game) {
      id
      title
      description
      cluster
      domain
      grade
      standard
      questions {
        id
        text
        answer
        imageUrl
        instructions
        updatedAt
        createdAt
        cluster
        domain
        grade
        standard
      }
      updatedAt
      createdAt
    }
  }
`;
export const deleteQuestion = /* GraphQL */ `
  mutation DeleteQuestion($id: Int!) {
    deleteQuestion(id: $id) {
      id
      text
      answer
      imageUrl
      instructions
      updatedAt
      createdAt
      cluster
      domain
      grade
      standard
    }
  }
`;
export const createQuestion = /* GraphQL */ `
  mutation CreateQuestion($question: CreateQuestionInput!) {
    createQuestion(question: $question) {
      id
      text
      answer
      imageUrl
      instructions
      updatedAt
      createdAt
      cluster
      domain
      grade
      standard
    }
  }
`;
export const updateQuestion = /* GraphQL */ `
  mutation UpdateQuestion($question: UpdateQuestionInput!) {
    updateQuestion(question: $question) {
      id
      text
      answer
      imageUrl
      instructions
      updatedAt
      createdAt
      cluster
      domain
      grade
      standard
    }
  }
`;
export const createGameQuestion = /* GraphQL */ `
  mutation CreateGameQuestion($gameQuestion: CreateGameQuestionInput!) {
    createGameQuestion(gameQuestion: $gameQuestion) {
      id
      title
      description
      cluster
      domain
      grade
      standard
      questions {
        id
        text
        answer
        imageUrl
        instructions
        updatedAt
        createdAt
        cluster
        domain
        grade
        standard
      }
      updatedAt
      createdAt
    }
  }
`;
export const createGameStatus = /* GraphQL */ `
  mutation CreateGameStatus($gameID: Int!) {
    createGameStatus(gameID: $gameID) {
      gameID
      screenID
      title
      text
      ... on QuestionScreen {
        answers
      }
      ... on ScorecardScreen {
        scores {
          teamName
          teamScore
        }
      }
    }
  }
`;
export const updateGameStatus = /* GraphQL */ `
  mutation UpdateGameStatus($gameID: Int!, $screenData: ScreenInput!) {
    updateGameStatus(gameID: $gameID, screenData: $screenData) {
      gameID
      screenID
      title
      text
      ... on QuestionScreen {
        answers
      }
      ... on ScorecardScreen {
        scores {
          teamName
          teamScore
        }
      }
    }
  }
`;
