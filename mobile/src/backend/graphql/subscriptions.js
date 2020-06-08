// @flow
// this is an auto generated file. This will be overwritten

export const onCreateGames = /* GraphQL */ `
  subscription OnCreateGames(
    $GameID: String
    $Title: String
    $Description: String
    $Grade: String
    $Question1: AWSJSON
  ) {
    onCreateGames(
      GameID: $GameID
      Title: $Title
      Description: $Description
      Grade: $Grade
      Question1: $Question1
    ) {
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
export const onUpdateGames = /* GraphQL */ `
  subscription OnUpdateGames(
    $GameID: String
    $Title: String
    $Description: String
    $Grade: String
    $Question1: AWSJSON
  ) {
    onUpdateGames(
      GameID: $GameID
      Title: $Title
      Description: $Description
      Grade: $Grade
      Question1: $Question1
    ) {
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
export const onDeleteGames = /* GraphQL */ `
  subscription OnDeleteGames(
    $GameID: String
    $Title: String
    $Description: String
    $Grade: String
    $Question1: AWSJSON
  ) {
    onDeleteGames(
      GameID: $GameID
      Title: $Title
      Description: $Description
      Grade: $Grade
      Question1: $Question1
    ) {
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
