/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

<<<<<<< HEAD
//onUpdateGameSession

=======
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
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
<<<<<<< HEAD
      phaseOneTime
      phaseTwoTime
      imageUrl
=======
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
      questions {
        id
        text
        answer
        imageUrl
        instructions
        updatedAt
        createdAt
<<<<<<< HEAD
        cluster
        domain
        grade
        standard
        wrongAnswers
=======
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
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
      answer
      imageUrl
      instructions
      updatedAt
      createdAt
<<<<<<< HEAD
      cluster
      domain
      grade
      standard
      wrongAnswers
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
=======
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
    }
  }
`;
