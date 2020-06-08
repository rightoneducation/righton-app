// @flow
// this is an auto generated file. This will be overwritten

export const getGames = /* GraphQL */ `
  query GetGames($GameID: String!) {
    getGames(GameID: $GameID) {
      GameID
      Title
      Description
      Grade
      Question1
      Question2
      Question3
      Question4
      Question5
    }
  }
`;
export const listGames = /* GraphQL */ `
  query ListGames(
    $filter: TableGamesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGames(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        GameID
        Title
        Description
        Grade
        Question1
        Question2
        Question3
        Question4
        Question5
      }
      nextToken
    }
  }
`;
