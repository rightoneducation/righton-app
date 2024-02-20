/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGame = /* GraphQL */ `query GetGame($id: Int!) {
  getGame(id: $id) {
    id
    title
    description
    cluster
    domain
    grade
    standard
    phaseOneTime
    phaseTwoTime
    imageUrl
    questions {
      id
      text
      choices
      answerSettings
      imageUrl
      instructions
      updatedAt
      createdAt
      cluster
      domain
      grade
      standard
      __typename
    }
    updatedAt
    createdAt
    __typename
  }
}
`
export const listGames = /* GraphQL */ `query ListGames {
  listGames {
    id
    title
    description
    cluster
    domain
    grade
    standard
    phaseOneTime
    phaseTwoTime
    imageUrl
    questions {
      id
      text
      choices
      answerSettings
      imageUrl
      instructions
      updatedAt
      createdAt
      cluster
      domain
      grade
      standard
      __typename
    }
    updatedAt
    createdAt
    __typename
  }
}
`
export const getQuestion = /* GraphQL */ `query GetQuestion($id: Int!) {
  getQuestion(id: $id) {
    id
    text
    choices
    answerSettings
    imageUrl
    instructions
    updatedAt
    createdAt
    cluster
    domain
    grade
    standard
    __typename
  }
}
`
export const listQuestions = /* GraphQL */ `query ListQuestions {
  listQuestions {
    id
    text
    choices
    answerSettings
    imageUrl
    instructions
    updatedAt
    createdAt
    cluster
    domain
    grade
    standard
    __typename
  }
}
`