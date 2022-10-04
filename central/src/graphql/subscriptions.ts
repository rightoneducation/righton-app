/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame {
    onCreateGame {
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
export const onCreateQuestion = /* GraphQL */ `
  subscription OnCreateQuestion {
    onCreateQuestion {
      id
      text
      choices
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
export const subscribeToGameStatusUpdates = /* GraphQL */ `
  subscription SubscribeToGameStatusUpdates($gameID: Int!) {
    subscribeToGameStatusUpdates(gameID: $gameID) {
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
