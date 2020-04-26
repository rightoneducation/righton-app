/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateGamesInput = {
  cluster?: string | null,
  description?: string | null,
  domain?: string | null,
  grade?: string | null,
  q1?: string | null,
  q2?: string | null,
  q3?: string | null,
  q4?: string | null,
  q5?: string | null,
  standard?: string | null,
  title: string,
};

export type UpdateGamesInput = {
  GameID: string,
  cluster?: string | null,
  description?: string | null,
  domain?: string | null,
  grade?: string | null,
  q1?: string | null,
  q2?: string | null,
  q3?: string | null,
  q4?: string | null,
  q5?: string | null,
  standard?: string | null,
  title?: string | null,
};

export type DeleteGamesInput = {
  GameID: string,
};

export type TableGamesFilterInput = {
  GameID?: TableStringFilterInput | null,
  cluster?: TableStringFilterInput | null,
  description?: TableStringFilterInput | null,
  domain?: TableStringFilterInput | null,
  grade?: TableStringFilterInput | null,
  standard?: TableStringFilterInput | null,
  title?: TableStringFilterInput | null,
};

export type TableStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type CreateGamesMutationVariables = {
  input: CreateGamesInput,
};

export type CreateGamesMutation = {
  createGames:  {
    __typename: "Games",
    GameID: string,
    cluster: string | null,
    description: string | null,
    domain: string | null,
    grade: string | null,
    q1: string | null,
    q2: string | null,
    q3: string | null,
    q4: string | null,
    q5: string | null,
    standard: string | null,
    title: string,
  } | null,
};

export type UpdateGamesMutationVariables = {
  input: UpdateGamesInput,
};

export type UpdateGamesMutation = {
  updateGames:  {
    __typename: "Games",
    GameID: string,
    cluster: string | null,
    description: string | null,
    domain: string | null,
    grade: string | null,
    q1: string | null,
    q2: string | null,
    q3: string | null,
    q4: string | null,
    q5: string | null,
    standard: string | null,
    title: string,
  } | null,
};

export type DeleteGamesMutationVariables = {
  input: DeleteGamesInput,
};

export type DeleteGamesMutation = {
  deleteGames:  {
    __typename: "Games",
    GameID: string,
    cluster: string | null,
    description: string | null,
    domain: string | null,
    grade: string | null,
    q1: string | null,
    q2: string | null,
    q3: string | null,
    q4: string | null,
    q5: string | null,
    standard: string | null,
    title: string,
  } | null,
};

export type GetGamesQueryVariables = {
  GameID: string,
};

export type GetGamesQuery = {
  getGames:  {
    __typename: "Games",
    GameID: string,
    cluster: string | null,
    description: string | null,
    domain: string | null,
    grade: string | null,
    q1: string | null,
    q2: string | null,
    q3: string | null,
    q4: string | null,
    q5: string | null,
    standard: string | null,
    title: string,
  } | null,
};

export type ListGamesQueryVariables = {
  filter?: TableGamesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGamesQuery = {
  listGames:  {
    __typename: "GamesConnection",
    items:  Array< {
      __typename: "Games",
      GameID: string,
      cluster: string | null,
      description: string | null,
      domain: string | null,
      grade: string | null,
      q1: string | null,
      q2: string | null,
      q3: string | null,
      q4: string | null,
      q5: string | null,
      standard: string | null,
      title: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateGamesSubscriptionVariables = {
  GameID?: string | null,
  cluster?: string | null,
  description?: string | null,
  domain?: string | null,
  grade?: string | null,
};

export type OnCreateGamesSubscription = {
  onCreateGames:  {
    __typename: "Games",
    GameID: string,
    cluster: string | null,
    description: string | null,
    domain: string | null,
    grade: string | null,
    q1: string | null,
    q2: string | null,
    q3: string | null,
    q4: string | null,
    q5: string | null,
    standard: string | null,
    title: string,
  } | null,
};

export type OnUpdateGamesSubscriptionVariables = {
  GameID?: string | null,
  cluster?: string | null,
  description?: string | null,
  domain?: string | null,
  grade?: string | null,
};

export type OnUpdateGamesSubscription = {
  onUpdateGames:  {
    __typename: "Games",
    GameID: string,
    cluster: string | null,
    description: string | null,
    domain: string | null,
    grade: string | null,
    q1: string | null,
    q2: string | null,
    q3: string | null,
    q4: string | null,
    q5: string | null,
    standard: string | null,
    title: string,
  } | null,
};

export type OnDeleteGamesSubscriptionVariables = {
  GameID?: string | null,
  cluster?: string | null,
  description?: string | null,
  domain?: string | null,
  grade?: string | null,
};

export type OnDeleteGamesSubscription = {
  onDeleteGames:  {
    __typename: "Games",
    GameID: string,
    cluster: string | null,
    description: string | null,
    domain: string | null,
    grade: string | null,
    q1: string | null,
    q2: string | null,
    q3: string | null,
    q4: string | null,
    q5: string | null,
    standard: string | null,
    title: string,
  } | null,
};
