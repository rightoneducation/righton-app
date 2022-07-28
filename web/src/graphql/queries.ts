/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGame = /* GraphQL */ `
  query GetGame($id: Int!) {
    getGame(id: $id) {
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
export const listGames = /* GraphQL */ `
  query ListGames {
    listGames {
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
export const getQuestion = /* GraphQL */ `
  query GetQuestion($id: Int!) {
    getQuestion(id: $id) {
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
  }
`;
export const listQuestions = /* GraphQL */ `
  query ListQuestions {
    listQuestions {
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
  }
`;
