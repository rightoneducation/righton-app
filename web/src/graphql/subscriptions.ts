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
    }
  }
`;
