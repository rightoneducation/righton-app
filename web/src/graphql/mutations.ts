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
    }
  }
`;
