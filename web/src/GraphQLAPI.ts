/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

<<<<<<< HEAD
export type Game = {
  __typename: "Game",
  id: number,
  title?: string | null,
  description?: string | null,
  cluster?: string | null,
  domain?: string | null,
  grade?: string | null,
  standard?: string | null,
  phaseOneTime?: number | null,
  phaseTwoTime?: number | null,
  imageUrl?: string | null,
  questions?:  Array<Question | null > | null,
  updatedAt: string,
  createdAt: string,
=======
export type CreateGameInput = {
  id?: string | null,
  title: string,
  cluster?: string | null,
  description?: string | null,
  domain?: string | null,
  grade?: string | null,
  standard?: string | null,
};

export type ModelGameConditionInput = {
  title?: ModelStringInput | null,
  cluster?: ModelStringInput | null,
  description?: ModelStringInput | null,
  domain?: ModelStringInput | null,
  grade?: ModelStringInput | null,
  standard?: ModelStringInput | null,
  and?: Array< ModelGameConditionInput | null > | null,
  or?: Array< ModelGameConditionInput | null > | null,
  not?: ModelGameConditionInput | null,
};

export type ModelStringInput = {
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
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type Game = {
  __typename: "Game",
  id: string,
  title: string,
  cluster?: string | null,
  description?: string | null,
  domain?: string | null,
  grade?: string | null,
  standard?: string | null,
  questions?: ModelGameQuestionConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelGameQuestionConnection = {
  __typename: "ModelGameQuestionConnection",
  items?:  Array<GameQuestion | null > | null,
  nextToken?: string | null,
};

export type GameQuestion = {
  __typename: "GameQuestion",
  id: string,
  gameId: string,
  questionId: string,
  game: Game,
  question: Question,
  createdAt: string,
  updatedAt: string,
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
};

export type Question = {
  __typename: "Question",
<<<<<<< HEAD
  id: number,
  text: string,
  answer: string,
  imageUrl?: string | null,
  instructions?: string | null,
  updatedAt: string,
  createdAt: string,
  cluster?: string | null,
  domain?: string | null,
  grade?: string | null,
  standard?: string | null,
  wrongAnswers?: string | null,
};

export type CreateGameInput = {
  title: string,
  description?: string | null,
  cluster?: string | null,
  domain?: string | null,
  grade?: string | null,
  standard?: string | null,
  phaseOneTime?: number | null,
  phaseTwoTime?: number | null,
  imageUrl?: string | null,
  questions?: Array< CreateQuestionInput | null > | null,
};

export type CreateQuestionInput = {
  text: string,
  answer: string,
  gameId?: string | null,
  imageUrl?: string | null,
  instructions?: string | null,
  cluster?: string | null,
  domain?: string | null,
  grade?: string | null,
  standard?: string | null,
  wrongAnswers?: string | null,
};

export type UpdateGameInput = {
  id: number,
  title?: string | null,
  description?: string | null,
  cluster?: string | null,
  domain?: string | null,
  grade?: string | null,
  standard?: string | null,
  phaseOneTime?: number | null,
  phaseTwoTime?: number | null,
  imageUrl?: string | null,
  questions?: Array< UpdateQuestionInput | null > | null,
};

export type UpdateQuestionInput = {
  id: number,
  text?: string | null,
  answer?: string | null,
  imageUrl?: string | null,
  instructions?: string | null,
  cluster?: string | null,
  domain?: string | null,
  grade?: string | null,
  standard?: string | null,
  wrongAnswers?: string | null,
};

export type CreateGameQuestionInput = {
  questionId: string,
  gameId: string,
};

export type Screen = {
  __typename: "Screen",
  gameID: number,
  screenID: ScreenID,
  title: string,
  text?: string | null,
};

export type JoinScreen = {
  __typename: "JoinScreen",
  gameID: number,
  screenID: ScreenID,
  title: string,
  text?: string | null,
};

export enum ScreenID {
  JoinScreen = "JoinScreen",
  QuestionScreen = "QuestionScreen",
  ScorecardScreen = "ScorecardScreen",
}


export type QuestionScreen = {
  __typename: "QuestionScreen",
  gameID: number,
  screenID: ScreenID,
  title: string,
  text?: string | null,
  answers: Array< string | null >,
};

export type ScorecardScreen = {
  __typename: "ScorecardScreen",
  gameID: number,
  screenID: ScreenID,
  title: string,
  text?: string | null,
  scores:  Array<Score | null >,
};

export type Score = {
  __typename: "Score",
  teamName: string,
  teamScore: number,
};

export type ScreenInput = {
  screenID: ScreenID,
  title: string,
  text: string,
  answers?: Array< string | null > | null,
  scores?: Array< ScoreInput | null > | null,
};

export type ScoreInput = {
  teamName: string,
  teamScore: number,
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
    phaseOneTime?: number | null,
    phaseTwoTime?: number | null,
    imageUrl?: string | null,
    questions?:  Array< {
      __typename: "Question",
      id: number,
      text: string,
      answer: string,
      imageUrl?: string | null,
      instructions?: string | null,
      updatedAt: string,
      createdAt: string,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      standard?: string | null,
      wrongAnswers?: string | null,
    } | null > | null,
    updatedAt: string,
    createdAt: string,
  } | null,
};

export type CreateGameMutationVariables = {
  game: CreateGameInput,
=======
  id: string,
  text: string,
  answer: string,
  imageURL?: string | null,
  instructions?: string | null,
  games?: ModelGameQuestionConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateGameInput = {
  id: string,
  title?: string | null,
  cluster?: string | null,
  description?: string | null,
  domain?: string | null,
  grade?: string | null,
  standard?: string | null,
};

export type DeleteGameInput = {
  id: string,
};

export type CreateQuestionInput = {
  id?: string | null,
  text: string,
  answer: string,
  imageURL?: string | null,
  instructions?: string | null,
};

export type ModelQuestionConditionInput = {
  text?: ModelStringInput | null,
  answer?: ModelStringInput | null,
  imageURL?: ModelStringInput | null,
  instructions?: ModelStringInput | null,
  and?: Array< ModelQuestionConditionInput | null > | null,
  or?: Array< ModelQuestionConditionInput | null > | null,
  not?: ModelQuestionConditionInput | null,
};

export type UpdateQuestionInput = {
  id: string,
  text?: string | null,
  answer?: string | null,
  imageURL?: string | null,
  instructions?: string | null,
};

export type DeleteQuestionInput = {
  id: string,
};

export type ModelGameFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  cluster?: ModelStringInput | null,
  description?: ModelStringInput | null,
  domain?: ModelStringInput | null,
  grade?: ModelStringInput | null,
  standard?: ModelStringInput | null,
  and?: Array< ModelGameFilterInput | null > | null,
  or?: Array< ModelGameFilterInput | null > | null,
  not?: ModelGameFilterInput | null,
};

export type ModelIDInput = {
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
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelGameConnection = {
  __typename: "ModelGameConnection",
  items?:  Array<Game | null > | null,
  nextToken?: string | null,
};

export type ModelQuestionFilterInput = {
  id?: ModelIDInput | null,
  text?: ModelStringInput | null,
  answer?: ModelStringInput | null,
  imageURL?: ModelStringInput | null,
  instructions?: ModelStringInput | null,
  and?: Array< ModelQuestionFilterInput | null > | null,
  or?: Array< ModelQuestionFilterInput | null > | null,
  not?: ModelQuestionFilterInput | null,
};

export type ModelQuestionConnection = {
  __typename: "ModelQuestionConnection",
  items?:  Array<Question | null > | null,
  nextToken?: string | null,
};

export type CreateGameMutationVariables = {
  input: CreateGameInput,
  condition?: ModelGameConditionInput | null,
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
};

export type CreateGameMutation = {
  createGame?:  {
    __typename: "Game",
<<<<<<< HEAD
    id: number,
    title?: string | null,
    description?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    phaseOneTime?: number | null,
    phaseTwoTime?: number | null,
    imageUrl?: string | null,
    questions?:  Array< {
      __typename: "Question",
      id: number,
      text: string,
      answer: string,
      imageUrl?: string | null,
      instructions?: string | null,
      updatedAt: string,
      createdAt: string,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      standard?: string | null,
      wrongAnswers?: string | null,
    } | null > | null,
    updatedAt: string,
    createdAt: string,
=======
    id: string,
    title: string,
    cluster?: string | null,
    description?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    questions?:  {
      __typename: "ModelGameQuestionConnection",
      items?:  Array< {
        __typename: "GameQuestion",
        id: string,
        gameId: string,
        questionId: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
  } | null,
};

export type UpdateGameMutationVariables = {
<<<<<<< HEAD
  game: UpdateGameInput,
=======
  input: UpdateGameInput,
  condition?: ModelGameConditionInput | null,
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
};

export type UpdateGameMutation = {
  updateGame?:  {
    __typename: "Game",
<<<<<<< HEAD
    id: number,
    title?: string | null,
    description?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    phaseOneTime?: number | null,
    phaseTwoTime?: number | null,
    imageUrl?: string | null,
    questions?:  Array< {
      __typename: "Question",
      id: number,
      text: string,
      answer: string,
      imageUrl?: string | null,
      instructions?: string | null,
      updatedAt: string,
      createdAt: string,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      standard?: string | null,
      wrongAnswers?: string | null,
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
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    wrongAnswers?: string | null,
=======
    id: string,
    title: string,
    cluster?: string | null,
    description?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    questions?:  {
      __typename: "ModelGameQuestionConnection",
      items?:  Array< {
        __typename: "GameQuestion",
        id: string,
        gameId: string,
        questionId: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteGameMutationVariables = {
  input: DeleteGameInput,
  condition?: ModelGameConditionInput | null,
};

export type DeleteGameMutation = {
  deleteGame?:  {
    __typename: "Game",
    id: string,
    title: string,
    cluster?: string | null,
    description?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    questions?:  {
      __typename: "ModelGameQuestionConnection",
      items?:  Array< {
        __typename: "GameQuestion",
        id: string,
        gameId: string,
        questionId: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
  } | null,
};

export type CreateQuestionMutationVariables = {
<<<<<<< HEAD
  question: CreateQuestionInput,
=======
  input: CreateQuestionInput,
  condition?: ModelQuestionConditionInput | null,
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
};

export type CreateQuestionMutation = {
  createQuestion?:  {
    __typename: "Question",
<<<<<<< HEAD
    id: number,
    text: string,
    answer: string,
    imageUrl?: string | null,
    instructions?: string | null,
    updatedAt: string,
    createdAt: string,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    wrongAnswers?: string | null,
=======
    id: string,
    text: string,
    answer: string,
    imageURL?: string | null,
    instructions?: string | null,
    games?:  {
      __typename: "ModelGameQuestionConnection",
      items?:  Array< {
        __typename: "GameQuestion",
        id: string,
        gameId: string,
        questionId: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
  } | null,
};

export type UpdateQuestionMutationVariables = {
<<<<<<< HEAD
  question: UpdateQuestionInput,
=======
  input: UpdateQuestionInput,
  condition?: ModelQuestionConditionInput | null,
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
};

export type UpdateQuestionMutation = {
  updateQuestion?:  {
    __typename: "Question",
<<<<<<< HEAD
    id: number,
    text: string,
    answer: string,
    imageUrl?: string | null,
    instructions?: string | null,
    updatedAt: string,
    createdAt: string,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    wrongAnswers?: string | null,
  } | null,
};

export type CreateGameQuestionMutationVariables = {
  gameQuestion: CreateGameQuestionInput,
};

export type CreateGameQuestionMutation = {
  createGameQuestion?:  {
    __typename: "Game",
    id: number,
    title?: string | null,
    description?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    phaseOneTime?: number | null,
    phaseTwoTime?: number | null,
    imageUrl?: string | null,
    questions?:  Array< {
      __typename: "Question",
      id: number,
      text: string,
      answer: string,
      imageUrl?: string | null,
      instructions?: string | null,
      updatedAt: string,
      createdAt: string,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      standard?: string | null,
      wrongAnswers?: string | null,
    } | null > | null,
    updatedAt: string,
    createdAt: string,
  } | null,
};

export type CreateGameStatusMutationVariables = {
  gameID: number,
};

export type CreateGameStatusMutation = {
  createGameStatus: ( {
      __typename: "JoinScreen",
      gameID: number,
      screenID: ScreenID,
      title: string,
      text?: string | null,
    } | {
      __typename: "QuestionScreen",
      gameID: number,
      screenID: ScreenID,
      title: string,
      text?: string | null,
      answers: Array< string | null >,
    } | {
      __typename: "ScorecardScreen",
      gameID: number,
      screenID: ScreenID,
      title: string,
      text?: string | null,
      scores:  Array< {
        __typename: string,
        teamName: string,
        teamScore: number,
      } | null >,
    }
  ) | null,
};

export type UpdateGameStatusMutationVariables = {
  gameID: number,
  screenData: ScreenInput,
};

export type UpdateGameStatusMutation = {
  updateGameStatus: ( {
      __typename: "JoinScreen",
      gameID: number,
      screenID: ScreenID,
      title: string,
      text?: string | null,
    } | {
      __typename: "QuestionScreen",
      gameID: number,
      screenID: ScreenID,
      title: string,
      text?: string | null,
      answers: Array< string | null >,
    } | {
      __typename: "ScorecardScreen",
      gameID: number,
      screenID: ScreenID,
      title: string,
      text?: string | null,
      scores:  Array< {
        __typename: string,
        teamName: string,
        teamScore: number,
      } | null >,
    }
  ) | null,
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
    phaseOneTime?: number | null,
    phaseTwoTime?: number | null,
    imageUrl?: string | null,
    questions?:  Array< {
      __typename: "Question",
      id: number,
      text: string,
      answer: string,
      imageUrl?: string | null,
      instructions?: string | null,
      updatedAt: string,
      createdAt: string,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      standard?: string | null,
      wrongAnswers?: string | null,
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
    phaseOneTime?: number | null,
    phaseTwoTime?: number | null,
    imageUrl?: string | null,
    questions?:  Array< {
      __typename: "Question",
      id: number,
      text: string,
      answer: string,
      imageUrl?: string | null,
      instructions?: string | null,
      updatedAt: string,
      createdAt: string,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      standard?: string | null,
      wrongAnswers?: string | null,
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
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    wrongAnswers?: string | null,
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
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    wrongAnswers?: string | null,
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
    phaseOneTime?: number | null,
    phaseTwoTime?: number | null,
    imageUrl?: string | null,
    questions?:  Array< {
      __typename: "Question",
      id: number,
      text: string,
      answer: string,
      imageUrl?: string | null,
      instructions?: string | null,
      updatedAt: string,
      createdAt: string,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      standard?: string | null,
      wrongAnswers?: string | null,
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
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    wrongAnswers?: string | null,
  } | null,
};

export type SubscribeToGameStatusUpdatesSubscriptionVariables = {
  gameID: number,
};

export type SubscribeToGameStatusUpdatesSubscription = {
  subscribeToGameStatusUpdates: ( {
      __typename: "JoinScreen",
      gameID: number,
      screenID: ScreenID,
      title: string,
      text?: string | null,
    } | {
      __typename: "QuestionScreen",
      gameID: number,
      screenID: ScreenID,
      title: string,
      text?: string | null,
      answers: Array< string | null >,
    } | {
      __typename: "ScorecardScreen",
      gameID: number,
      screenID: ScreenID,
      title: string,
      text?: string | null,
      scores:  Array< {
        __typename: string,
        teamName: string,
        teamScore: number,
      } | null >,
    }
  ) | null,
};
=======
    id: string,
    text: string,
    answer: string,
    imageURL?: string | null,
    instructions?: string | null,
    games?:  {
      __typename: "ModelGameQuestionConnection",
      items?:  Array< {
        __typename: "GameQuestion",
        id: string,
        gameId: string,
        questionId: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteQuestionMutationVariables = {
  input: DeleteQuestionInput,
  condition?: ModelQuestionConditionInput | null,
};

export type DeleteQuestionMutation = {
  deleteQuestion?:  {
    __typename: "Question",
    id: string,
    text: string,
    answer: string,
    imageURL?: string | null,
    instructions?: string | null,
    games?:  {
      __typename: "ModelGameQuestionConnection",
      items?:  Array< {
        __typename: "GameQuestion",
        id: string,
        gameId: string,
        questionId: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GameQueryVariables = {
  id: string,
};

export type GameQuery = {
  game?:  {
    __typename: "Game",
    id: string,
    title: string,
    cluster?: string | null,
    description?: string | null,
    domain?: string | null,
    grade?: string | null,
    standard?: string | null,
    questions?:  {
      __typename: "ModelGameQuestionConnection",
      items?:  Array< {
        __typename: "GameQuestion",
        id: string,
        gameId: string,
        questionId: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GamesQueryVariables = {
  filter?: ModelGameFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GamesQuery = {
  games?:  {
    __typename: "ModelGameConnection",
    items?:  Array< {
      __typename: "Game",
      id: string,
      title: string,
      cluster?: string | null,
      description?: string | null,
      domain?: string | null,
      grade?: string | null,
      standard?: string | null,
      questions?:  {
        __typename: "ModelGameQuestionConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type QuestionQueryVariables = {
  id: string,
};

export type QuestionQuery = {
  question?:  {
    __typename: "Question",
    id: string,
    text: string,
    answer: string,
    imageURL?: string | null,
    instructions?: string | null,
    games?:  {
      __typename: "ModelGameQuestionConnection",
      items?:  Array< {
        __typename: "GameQuestion",
        id: string,
        gameId: string,
        questionId: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type QuestionsQueryVariables = {
  filter?: ModelQuestionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type QuestionsQuery = {
  questions?:  {
    __typename: "ModelQuestionConnection",
    items?:  Array< {
      __typename: "Question",
      id: string,
      text: string,
      answer: string,
      imageURL?: string | null,
      instructions?: string | null,
      games?:  {
        __typename: "ModelGameQuestionConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};
>>>>>>> a5965acc48bb423681b99f6268caf083ccb85864
