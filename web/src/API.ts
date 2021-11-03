/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Game = {
  __typename: "Game",
  id: number,
  title?: string | null,
  description?: string | null,
  cluster?: string | null,
  domain?: string | null,
  grade?: string | null,
  standard?: string | null,
  questions?:  Array<Question | null > | null,
  updatedAt: string,
  createdAt: string,
};

export type Question = {
  __typename: "Question",
  id: number,
  text: string,
  answer: string,
  imageUrl?: string | null,
  instructions?: string | null,
  updatedAt: string,
  createdAt: string,
};

export type CreateGameInput = {
  title: string,
  description?: string | null,
  cluster?: string | null,
  domain?: string | null,
  grade?: string | null,
  standard?: string | null,
  questions?: Array< CreateQuestionInput | null > | null,
};

export type CreateQuestionInput = {
  text: string,
  answer: string,
  imageUrl?: string | null,
  instructions?: string | null,
};

export type UpdateGameInput = {
  id: number,
  title?: string | null,
  description?: string | null,
  cluster?: string | null,
  domain?: string | null,
  grade?: string | null,
  standard?: string | null,
};

export type UpdateQuestionInput = {
  id: number,
  text?: string | null,
  answer?: string | null,
  imageUrl?: string | null,
  instructions?: string | null,
};

export type DeleteGameMutationVariables = {
  id: number,
};

export type DeleteGameMutation = {
  deleteGame?:  {
    __typename: "Game",
    id: number,
    title?: string | null,
    description?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    questions?:  Array< {
      __typename: "Question",
      id: number,
      text: string,
      answer: string,
      imageUrl?: string | null,
      instructions?: string | null,
      updatedAt: string,
      createdAt: string,
    } | null > | null,
    updatedAt: string,
    createdAt: string,
  } | null,
};

export type CreateGameMutationVariables = {
  game: CreateGameInput,
};

export type CreateGameMutation = {
  createGame?:  {
    __typename: "Game",
    id: number,
    title?: string | null,
    description?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    questions?:  Array< {
      __typename: "Question",
      id: number,
      text: string,
      answer: string,
      imageUrl?: string | null,
      instructions?: string | null,
      updatedAt: string,
      createdAt: string,
    } | null > | null,
    updatedAt: string,
    createdAt: string,
  } | null,
};

export type UpdateGameMutationVariables = {
  game: UpdateGameInput,
};

export type UpdateGameMutation = {
  updateGame?:  {
    __typename: "Game",
    id: number,
    title?: string | null,
    description?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    questions?:  Array< {
      __typename: "Question",
      id: number,
      text: string,
      answer: string,
      imageUrl?: string | null,
      instructions?: string | null,
      updatedAt: string,
      createdAt: string,
    } | null > | null,
    updatedAt: string,
    createdAt: string,
  } | null,
};

export type DeleteQuestionMutationVariables = {
  id: number,
};

export type DeleteQuestionMutation = {
  deleteQuestion?:  {
    __typename: "Question",
    id: number,
    text: string,
    answer: string,
    imageUrl?: string | null,
    instructions?: string | null,
    updatedAt: string,
    createdAt: string,
  } | null,
};

export type CreateQuestionMutationVariables = {
  question: CreateQuestionInput,
};

export type CreateQuestionMutation = {
  createQuestion?:  {
    __typename: "Question",
    id: number,
    text: string,
    answer: string,
    imageUrl?: string | null,
    instructions?: string | null,
    updatedAt: string,
    createdAt: string,
  } | null,
};

export type UpdateQuestionMutationVariables = {
  question: UpdateQuestionInput,
};

export type UpdateQuestionMutation = {
  updateQuestion?:  {
    __typename: "Question",
    id: number,
    text: string,
    answer: string,
    imageUrl?: string | null,
    instructions?: string | null,
    updatedAt: string,
    createdAt: string,
  } | null,
};

export type GetGameQueryVariables = {
  id: number,
};

export type GetGameQuery = {
  getGame?:  {
    __typename: "Game",
    id: number,
    title?: string | null,
    description?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    questions?:  Array< {
      __typename: "Question",
      id: number,
      text: string,
      answer: string,
      imageUrl?: string | null,
      instructions?: string | null,
      updatedAt: string,
      createdAt: string,
    } | null > | null,
    updatedAt: string,
    createdAt: string,
  } | null,
};

export type ListGamesQuery = {
  listGames?:  Array< {
    __typename: "Game",
    id: number,
    title?: string | null,
    description?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    questions?:  Array< {
      __typename: "Question",
      id: number,
      text: string,
      answer: string,
      imageUrl?: string | null,
      instructions?: string | null,
      updatedAt: string,
      createdAt: string,
    } | null > | null,
    updatedAt: string,
    createdAt: string,
  } | null > | null,
};

export type GetQuestionQueryVariables = {
  id: number,
};

export type GetQuestionQuery = {
  getQuestion?:  {
    __typename: "Question",
    id: number,
    text: string,
    answer: string,
    imageUrl?: string | null,
    instructions?: string | null,
    updatedAt: string,
    createdAt: string,
  } | null,
};

export type ListQuestionsQuery = {
  listQuestions?:  Array< {
    __typename: "Question",
    id: number,
    text: string,
    answer: string,
    imageUrl?: string | null,
    instructions?: string | null,
    updatedAt: string,
    createdAt: string,
  } | null > | null,
};

export type OnCreateGameSubscription = {
  onCreateGame?:  {
    __typename: "Game",
    id: number,
    title?: string | null,
    description?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    questions?:  Array< {
      __typename: "Question",
      id: number,
      text: string,
      answer: string,
      imageUrl?: string | null,
      instructions?: string | null,
      updatedAt: string,
      createdAt: string,
    } | null > | null,
    updatedAt: string,
    createdAt: string,
  } | null,
};

export type OnCreateQuestionSubscription = {
  onCreateQuestion?:  {
    __typename: "Question",
    id: number,
    text: string,
    answer: string,
    imageUrl?: string | null,
    instructions?: string | null,
    updatedAt: string,
    createdAt: string,
  } | null,
};
