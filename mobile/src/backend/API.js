/* @flow */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateGamesInput = {|
  GameID: string,
  Title: string,
  Description?: ?string,
  Grade?: ?string,
  Question1?: ?any,
  Question2?: ?any,
  Question3?: ?any,
  Question4?: ?any,
  Question5?: ?any,
|};

export type UpdateGamesInput = {|
  GameID: string,
  Title?: ?string,
  Description?: ?string,
  Grade?: ?string,
  Question1?: ?any,
  Question2?: ?any,
  Question3?: ?any,
  Question4?: ?any,
  Question5?: ?any,
|};

export type DeleteGamesInput = {|
  GameID: string,
|};

export type TableGamesFilterInput = {|
  GameID?: ?TableStringFilterInput,
  Title?: ?TableStringFilterInput,
  Description?: ?TableStringFilterInput,
  Grade?: ?TableStringFilterInput,
|};

export type TableStringFilterInput = {|
  ne?: ?string,
  eq?: ?string,
  le?: ?string,
  lt?: ?string,
  ge?: ?string,
  gt?: ?string,
  contains?: ?string,
  notContains?: ?string,
  between?: ?Array< ?string >,
  beginsWith?: ?string,
|};

export type CreateGamesMutationVariables = {|
  input: CreateGamesInput,
|};

export type CreateGamesMutation = {|
  createGames: ? {|
    __typename: "Games",
    GameID: string,
    Title: string,
    Description: ?string,
    Grade: ?string,
    Question1: ?any,
    Question2: ?any,
    Question3: ?any,
    Question4: ?any,
    Question5: ?any,
  |},
|};

export type UpdateGamesMutationVariables = {|
  input: UpdateGamesInput,
|};

export type UpdateGamesMutation = {|
  updateGames: ? {|
    __typename: "Games",
    GameID: string,
    Title: string,
    Description: ?string,
    Grade: ?string,
    Question1: ?any,
    Question2: ?any,
    Question3: ?any,
    Question4: ?any,
    Question5: ?any,
  |},
|};

export type DeleteGamesMutationVariables = {|
  input: DeleteGamesInput,
|};

export type DeleteGamesMutation = {|
  deleteGames: ? {|
    __typename: "Games",
    GameID: string,
    Title: string,
    Description: ?string,
    Grade: ?string,
    Question1: ?any,
    Question2: ?any,
    Question3: ?any,
    Question4: ?any,
    Question5: ?any,
  |},
|};

export type GetGamesQueryVariables = {|
  GameID: string,
|};

export type GetGamesQuery = {|
  getGames: ? {|
    __typename: "Games",
    GameID: string,
    Title: string,
    Description: ?string,
    Grade: ?string,
    Question1: ?any,
    Question2: ?any,
    Question3: ?any,
    Question4: ?any,
    Question5: ?any,
  |},
|};

export type ListGamesQueryVariables = {|
  filter?: ?TableGamesFilterInput,
  limit?: ?number,
  nextToken?: ?string,
|};

export type ListGamesQuery = {|
  listGames: ? {|
    __typename: "GamesConnection",
    items: ? Array<? {|
      __typename: "Games",
      GameID: string,
      Title: string,
      Description: ?string,
      Grade: ?string,
      Question1: ?any,
      Question2: ?any,
      Question3: ?any,
      Question4: ?any,
      Question5: ?any,
    |} >,
    nextToken: ?string,
  |},
|};

export type OnCreateGamesSubscriptionVariables = {|
  GameID?: ?string,
  Title?: ?string,
  Description?: ?string,
  Grade?: ?string,
  Question1?: ?any,
|};

export type OnCreateGamesSubscription = {|
  onCreateGames: ? {|
    __typename: "Games",
    GameID: string,
    Title: string,
    Description: ?string,
    Grade: ?string,
    Question1: ?any,
    Question2: ?any,
    Question3: ?any,
    Question4: ?any,
    Question5: ?any,
  |},
|};

export type OnUpdateGamesSubscriptionVariables = {|
  GameID?: ?string,
  Title?: ?string,
  Description?: ?string,
  Grade?: ?string,
  Question1?: ?any,
|};

export type OnUpdateGamesSubscription = {|
  onUpdateGames: ? {|
    __typename: "Games",
    GameID: string,
    Title: string,
    Description: ?string,
    Grade: ?string,
    Question1: ?any,
    Question2: ?any,
    Question3: ?any,
    Question4: ?any,
    Question5: ?any,
  |},
|};

export type OnDeleteGamesSubscriptionVariables = {|
  GameID?: ?string,
  Title?: ?string,
  Description?: ?string,
  Grade?: ?string,
  Question1?: ?any,
|};

export type OnDeleteGamesSubscription = {|
  onDeleteGames: ? {|
    __typename: "Games",
    GameID: string,
    Title: string,
    Description: ?string,
    Grade: ?string,
    Question1: ?any,
    Question2: ?any,
    Question3: ?any,
    Question4: ?any,
    Question5: ?any,
  |},
|};