/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateGameSessionInput = {
  id?: string | null,
  gameId: number,
  startTime?: string | null,
  phaseOneTime: number,
  phaseTwoTime: number,
  currentQuestionId?: number | null,
  currentState: GameSessionState,
  gameCode: number,
  isAdvanced: boolean,
  imageUrl?: string | null,
  description?: string | null,
  title?: string | null,
};

export enum GameSessionState {
  NOT_STARTED = "NOT_STARTED",
  TEAMS_JOINING = "TEAMS_JOINING",
  CHOOSE_CORRECT_ANSWER = "CHOOSE_CORRECT_ANSWER",
  PHASE_1_RESULTS = "PHASE_1_RESULTS",
  CHOOSE_TRICKIEST_ANSWER = "CHOOSE_TRICKIEST_ANSWER",
  PHASE_2_RESULTS = "PHASE_2_RESULTS",
  FINAL_RESULTS = "FINAL_RESULTS",
  FINISHED = "FINISHED",
}


export type ModelGameSessionConditionInput = {
  gameId?: ModelIntInput | null,
  startTime?: ModelStringInput | null,
  phaseOneTime?: ModelIntInput | null,
  phaseTwoTime?: ModelIntInput | null,
  currentQuestionId?: ModelIntInput | null,
  currentState?: ModelGameSessionStateInput | null,
  gameCode?: ModelIntInput | null,
  isAdvanced?: ModelBooleanInput | null,
  imageUrl?: ModelStringInput | null,
  description?: ModelStringInput | null,
  title?: ModelStringInput | null,
  and?: Array< ModelGameSessionConditionInput | null > | null,
  or?: Array< ModelGameSessionConditionInput | null > | null,
  not?: ModelGameSessionConditionInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
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

export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelGameSessionStateInput = {
  eq?: GameSessionState | null,
  ne?: GameSessionState | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type GameSession = {
  __typename: "GameSession",
  id: string,
  gameId: number,
  startTime?: string | null,
  phaseOneTime: number,
  phaseTwoTime: number,
  teams?: ModelTeamConnection | null,
  currentQuestionId?: number | null,
  currentState: GameSessionState,
  gameCode: number,
  isAdvanced: boolean,
  imageUrl?: string | null,
  description?: string | null,
  title?: string | null,
  questions?: ModelQuestionConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelTeamConnection = {
  __typename: "ModelTeamConnection",
  items:  Array<Team | null >,
  nextToken?: string | null,
};

export type Team = {
  __typename: "Team",
  id: string,
  name: string,
  question: Question,
  trickiestAnswerIDs?: Array< string | null > | null,
  teamMembers?: ModelTeamMemberConnection | null,
  score: number,
  createdAt: string,
  updatedAt: string,
  gameSessionTeamsId?: string | null,
  teamQuestionId: string,
  teamQuestionGameSessionId: string,
};

export type Question = {
  __typename: "Question",
  id: number,
  text: string,
  answer?: string | null,
  wrongAnswers?: string | null,
  imageUrl?: string | null,
  instructions?: string | null,
  standard?: string | null,
  cluster?: string | null,
  domain?: string | null,
  grade?: string | null,
  gameSessionId: string,
  gameSession?: GameSession | null,
};

export type ModelTeamMemberConnection = {
  __typename: "ModelTeamMemberConnection",
  items:  Array<TeamMember | null >,
  nextToken?: string | null,
};

export type TeamMember = {
  __typename: "TeamMember",
  id: string,
  team: Team,
  isFacilitator?: boolean | null,
  answers?: ModelTeamAnswerConnection | null,
  deviceId: string,
  createdAt: string,
  updatedAt: string,
  teamTeamMembersId?: string | null,
};

export type ModelTeamAnswerConnection = {
  __typename: "ModelTeamAnswerConnection",
  items:  Array<TeamAnswer | null >,
  nextToken?: string | null,
};

export type TeamAnswer = {
  __typename: "TeamAnswer",
  id: string,
  isChosen?: boolean | null,
  text?: string | null,
  createdAt: string,
  updatedAt: string,
  teamMemberAnswersId?: string | null,
};

export type ModelQuestionConnection = {
  __typename: "ModelQuestionConnection",
  items:  Array<Question | null >,
  nextToken?: string | null,
};

export type UpdateGameSessionInput = {
  id: string,
  gameId?: number | null,
  startTime?: string | null,
  phaseOneTime?: number | null,
  phaseTwoTime?: number | null,
  currentQuestionId?: number | null,
  currentState?: GameSessionState | null,
  gameCode?: number | null,
  isAdvanced?: boolean | null,
  imageUrl?: string | null,
  description?: string | null,
  title?: string | null,
};

export type DeleteGameSessionInput = {
  id: string,
};

export type CreateQuestionInput = {
  id?: number | null,
  text: string,
  answer?: string | null,
  wrongAnswers?: string | null,
  imageUrl?: string | null,
  instructions?: string | null,
  standard?: string | null,
  cluster?: string | null,
  domain?: string | null,
  grade?: string | null,
  gameSessionId: string,
};

export type ModelQuestionConditionInput = {
  text?: ModelStringInput | null,
  answer?: ModelStringInput | null,
  wrongAnswers?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  instructions?: ModelStringInput | null,
  standard?: ModelStringInput | null,
  cluster?: ModelStringInput | null,
  domain?: ModelStringInput | null,
  grade?: ModelStringInput | null,
  and?: Array< ModelQuestionConditionInput | null > | null,
  or?: Array< ModelQuestionConditionInput | null > | null,
  not?: ModelQuestionConditionInput | null,
};

export type UpdateQuestionInput = {
  id: number,
  text?: string | null,
  answer?: string | null,
  wrongAnswers?: string | null,
  imageUrl?: string | null,
  instructions?: string | null,
  standard?: string | null,
  cluster?: string | null,
  domain?: string | null,
  grade?: string | null,
  gameSessionId: string,
};

export type DeleteQuestionInput = {
  id: number,
  gameSessionId: string,
};

export type CreateTeamInput = {
  id?: string | null,
  name: string,
  trickiestAnswerIDs?: Array< string | null > | null,
  score: number,
  gameSessionTeamsId?: string | null,
  teamQuestionId: string,
  teamQuestionGameSessionId: string,
};

export type ModelTeamConditionInput = {
  name?: ModelStringInput | null,
  trickiestAnswerIDs?: ModelIDInput | null,
  score?: ModelIntInput | null,
  and?: Array< ModelTeamConditionInput | null > | null,
  or?: Array< ModelTeamConditionInput | null > | null,
  not?: ModelTeamConditionInput | null,
  gameSessionTeamsId?: ModelIDInput | null,
  teamQuestionId?: ModelIDInput | null,
  teamQuestionGameSessionId?: ModelIDInput | null,
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

export type UpdateTeamInput = {
  id: string,
  name?: string | null,
  trickiestAnswerIDs?: Array< string | null > | null,
  score?: number | null,
  gameSessionTeamsId?: string | null,
  teamQuestionId: string,
  teamQuestionGameSessionId: string,
};

export type DeleteTeamInput = {
  id: string,
};

export type CreateTeamMemberInput = {
  id?: string | null,
  isFacilitator?: boolean | null,
  deviceId: string,
  teamTeamMembersId?: string | null,
};

export type ModelTeamMemberConditionInput = {
  isFacilitator?: ModelBooleanInput | null,
  deviceId?: ModelIDInput | null,
  and?: Array< ModelTeamMemberConditionInput | null > | null,
  or?: Array< ModelTeamMemberConditionInput | null > | null,
  not?: ModelTeamMemberConditionInput | null,
  teamTeamMembersId?: ModelIDInput | null,
};

export type UpdateTeamMemberInput = {
  id: string,
  isFacilitator?: boolean | null,
  deviceId?: string | null,
  teamTeamMembersId?: string | null,
};

export type DeleteTeamMemberInput = {
  id: string,
};

export type CreateTeamAnswerInput = {
  id?: string | null,
  isChosen?: boolean | null,
  text?: string | null,
  teamMemberAnswersId?: string | null,
};

export type ModelTeamAnswerConditionInput = {
  isChosen?: ModelBooleanInput | null,
  text?: ModelStringInput | null,
  and?: Array< ModelTeamAnswerConditionInput | null > | null,
  or?: Array< ModelTeamAnswerConditionInput | null > | null,
  not?: ModelTeamAnswerConditionInput | null,
  teamMemberAnswersId?: ModelIDInput | null,
};

export type UpdateTeamAnswerInput = {
  id: string,
  isChosen?: boolean | null,
  text?: string | null,
  teamMemberAnswersId?: string | null,
};

export type DeleteTeamAnswerInput = {
  id: string,
};

export type ModelGameSessionFilterInput = {
  id?: ModelIDInput | null,
  gameId?: ModelIntInput | null,
  startTime?: ModelStringInput | null,
  phaseOneTime?: ModelIntInput | null,
  phaseTwoTime?: ModelIntInput | null,
  currentQuestionId?: ModelIntInput | null,
  currentState?: ModelGameSessionStateInput | null,
  gameCode?: ModelIntInput | null,
  isAdvanced?: ModelBooleanInput | null,
  imageUrl?: ModelStringInput | null,
  description?: ModelStringInput | null,
  title?: ModelStringInput | null,
  and?: Array< ModelGameSessionFilterInput | null > | null,
  or?: Array< ModelGameSessionFilterInput | null > | null,
  not?: ModelGameSessionFilterInput | null,
};

export type ModelGameSessionConnection = {
  __typename: "ModelGameSessionConnection",
  items:  Array<GameSession | null >,
  nextToken?: string | null,
};

export type ModelIDKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelQuestionFilterInput = {
  id?: ModelIntInput | null,
  text?: ModelStringInput | null,
  answer?: ModelStringInput | null,
  wrongAnswers?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  instructions?: ModelStringInput | null,
  standard?: ModelStringInput | null,
  cluster?: ModelStringInput | null,
  domain?: ModelStringInput | null,
  grade?: ModelStringInput | null,
  gameSessionId?: ModelIDInput | null,
  and?: Array< ModelQuestionFilterInput | null > | null,
  or?: Array< ModelQuestionFilterInput | null > | null,
  not?: ModelQuestionFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelTeamFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  trickiestAnswerIDs?: ModelIDInput | null,
  score?: ModelIntInput | null,
  and?: Array< ModelTeamFilterInput | null > | null,
  or?: Array< ModelTeamFilterInput | null > | null,
  not?: ModelTeamFilterInput | null,
  gameSessionTeamsId?: ModelIDInput | null,
  teamQuestionId?: ModelIDInput | null,
  teamQuestionGameSessionId?: ModelIDInput | null,
};

export type ModelTeamMemberFilterInput = {
  id?: ModelIDInput | null,
  isFacilitator?: ModelBooleanInput | null,
  deviceId?: ModelIDInput | null,
  and?: Array< ModelTeamMemberFilterInput | null > | null,
  or?: Array< ModelTeamMemberFilterInput | null > | null,
  not?: ModelTeamMemberFilterInput | null,
  teamTeamMembersId?: ModelIDInput | null,
};

export type ModelTeamAnswerFilterInput = {
  id?: ModelIDInput | null,
  isChosen?: ModelBooleanInput | null,
  text?: ModelStringInput | null,
  and?: Array< ModelTeamAnswerFilterInput | null > | null,
  or?: Array< ModelTeamAnswerFilterInput | null > | null,
  not?: ModelTeamAnswerFilterInput | null,
  teamMemberAnswersId?: ModelIDInput | null,
};

export type CreateGameSessionMutationVariables = {
  input: CreateGameSessionInput,
  condition?: ModelGameSessionConditionInput | null,
};

export type CreateGameSessionMutation = {
  createGameSession?:  {
    __typename: "GameSession",
    id: string,
    gameId: number,
    startTime?: string | null,
    phaseOneTime: number,
    phaseTwoTime: number,
    teams?:  {
      __typename: "ModelTeamConnection",
      items:  Array< {
        __typename: "Team",
        id: string,
        name: string,
        trickiestAnswerIDs?: Array< string | null > | null,
        score: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId: string,
        teamQuestionGameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    currentQuestionId?: number | null,
    currentState: GameSessionState,
    gameCode: number,
    isAdvanced: boolean,
    imageUrl?: string | null,
    description?: string | null,
    title?: string | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      items:  Array< {
        __typename: "Question",
        id: number,
        text: string,
        answer?: string | null,
        wrongAnswers?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        gameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateGameSessionMutationVariables = {
  input: UpdateGameSessionInput,
  condition?: ModelGameSessionConditionInput | null,
};

export type UpdateGameSessionMutation = {
  updateGameSession?:  {
    __typename: "GameSession",
    id: string,
    gameId: number,
    startTime?: string | null,
    phaseOneTime: number,
    phaseTwoTime: number,
    teams?:  {
      __typename: "ModelTeamConnection",
      items:  Array< {
        __typename: "Team",
        id: string,
        name: string,
        trickiestAnswerIDs?: Array< string | null > | null,
        score: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId: string,
        teamQuestionGameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    currentQuestionId?: number | null,
    currentState: GameSessionState,
    gameCode: number,
    isAdvanced: boolean,
    imageUrl?: string | null,
    description?: string | null,
    title?: string | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      items:  Array< {
        __typename: "Question",
        id: number,
        text: string,
        answer?: string | null,
        wrongAnswers?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        gameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteGameSessionMutationVariables = {
  input: DeleteGameSessionInput,
  condition?: ModelGameSessionConditionInput | null,
};

export type DeleteGameSessionMutation = {
  deleteGameSession?:  {
    __typename: "GameSession",
    id: string,
    gameId: number,
    startTime?: string | null,
    phaseOneTime: number,
    phaseTwoTime: number,
    teams?:  {
      __typename: "ModelTeamConnection",
      items:  Array< {
        __typename: "Team",
        id: string,
        name: string,
        trickiestAnswerIDs?: Array< string | null > | null,
        score: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId: string,
        teamQuestionGameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    currentQuestionId?: number | null,
    currentState: GameSessionState,
    gameCode: number,
    isAdvanced: boolean,
    imageUrl?: string | null,
    description?: string | null,
    title?: string | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      items:  Array< {
        __typename: "Question",
        id: number,
        text: string,
        answer?: string | null,
        wrongAnswers?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        gameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateQuestionMutationVariables = {
  input: CreateQuestionInput,
  condition?: ModelQuestionConditionInput | null,
};

export type CreateQuestionMutation = {
  createQuestion?:  {
    __typename: "Question",
    id: number,
    text: string,
    answer?: string | null,
    wrongAnswers?: string | null,
    imageUrl?: string | null,
    instructions?: string | null,
    standard?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    gameSessionId: string,
    gameSession?:  {
      __typename: "GameSession",
      id: string,
      gameId: number,
      startTime?: string | null,
      phaseOneTime: number,
      phaseTwoTime: number,
      teams?:  {
        __typename: "ModelTeamConnection",
        nextToken?: string | null,
      } | null,
      currentQuestionId?: number | null,
      currentState: GameSessionState,
      gameCode: number,
      isAdvanced: boolean,
      imageUrl?: string | null,
      description?: string | null,
      title?: string | null,
      questions?:  {
        __typename: "ModelQuestionConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type UpdateQuestionMutationVariables = {
  input: UpdateQuestionInput,
  condition?: ModelQuestionConditionInput | null,
};

export type UpdateQuestionMutation = {
  updateQuestion?:  {
    __typename: "Question",
    id: number,
    text: string,
    answer?: string | null,
    wrongAnswers?: string | null,
    imageUrl?: string | null,
    instructions?: string | null,
    standard?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    gameSessionId: string,
    gameSession?:  {
      __typename: "GameSession",
      id: string,
      gameId: number,
      startTime?: string | null,
      phaseOneTime: number,
      phaseTwoTime: number,
      teams?:  {
        __typename: "ModelTeamConnection",
        nextToken?: string | null,
      } | null,
      currentQuestionId?: number | null,
      currentState: GameSessionState,
      gameCode: number,
      isAdvanced: boolean,
      imageUrl?: string | null,
      description?: string | null,
      title?: string | null,
      questions?:  {
        __typename: "ModelQuestionConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type DeleteQuestionMutationVariables = {
  input: DeleteQuestionInput,
  condition?: ModelQuestionConditionInput | null,
};

export type DeleteQuestionMutation = {
  deleteQuestion?:  {
    __typename: "Question",
    id: number,
    text: string,
    answer?: string | null,
    wrongAnswers?: string | null,
    imageUrl?: string | null,
    instructions?: string | null,
    standard?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    gameSessionId: string,
    gameSession?:  {
      __typename: "GameSession",
      id: string,
      gameId: number,
      startTime?: string | null,
      phaseOneTime: number,
      phaseTwoTime: number,
      teams?:  {
        __typename: "ModelTeamConnection",
        nextToken?: string | null,
      } | null,
      currentQuestionId?: number | null,
      currentState: GameSessionState,
      gameCode: number,
      isAdvanced: boolean,
      imageUrl?: string | null,
      description?: string | null,
      title?: string | null,
      questions?:  {
        __typename: "ModelQuestionConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type CreateTeamMutationVariables = {
  input: CreateTeamInput,
  condition?: ModelTeamConditionInput | null,
};

export type CreateTeamMutation = {
  createTeam?:  {
    __typename: "Team",
    id: string,
    name: string,
    question:  {
      __typename: "Question",
      id: number,
      text: string,
      answer?: string | null,
      wrongAnswers?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      gameSessionId: string,
      gameSession?:  {
        __typename: "GameSession",
        id: string,
        gameId: number,
        startTime?: string | null,
        phaseOneTime: number,
        phaseTwoTime: number,
        currentQuestionId?: number | null,
        currentState: GameSessionState,
        gameCode: number,
        isAdvanced: boolean,
        imageUrl?: string | null,
        description?: string | null,
        title?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
    },
    trickiestAnswerIDs?: Array< string | null > | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        deviceId: string,
        createdAt: string,
        updatedAt: string,
        teamTeamMembersId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId: string,
    teamQuestionGameSessionId: string,
  } | null,
};

export type UpdateTeamMutationVariables = {
  input: UpdateTeamInput,
  condition?: ModelTeamConditionInput | null,
};

export type UpdateTeamMutation = {
  updateTeam?:  {
    __typename: "Team",
    id: string,
    name: string,
    question:  {
      __typename: "Question",
      id: number,
      text: string,
      answer?: string | null,
      wrongAnswers?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      gameSessionId: string,
      gameSession?:  {
        __typename: "GameSession",
        id: string,
        gameId: number,
        startTime?: string | null,
        phaseOneTime: number,
        phaseTwoTime: number,
        currentQuestionId?: number | null,
        currentState: GameSessionState,
        gameCode: number,
        isAdvanced: boolean,
        imageUrl?: string | null,
        description?: string | null,
        title?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
    },
    trickiestAnswerIDs?: Array< string | null > | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        deviceId: string,
        createdAt: string,
        updatedAt: string,
        teamTeamMembersId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId: string,
    teamQuestionGameSessionId: string,
  } | null,
};

export type DeleteTeamMutationVariables = {
  input: DeleteTeamInput,
  condition?: ModelTeamConditionInput | null,
};

export type DeleteTeamMutation = {
  deleteTeam?:  {
    __typename: "Team",
    id: string,
    name: string,
    question:  {
      __typename: "Question",
      id: number,
      text: string,
      answer?: string | null,
      wrongAnswers?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      gameSessionId: string,
      gameSession?:  {
        __typename: "GameSession",
        id: string,
        gameId: number,
        startTime?: string | null,
        phaseOneTime: number,
        phaseTwoTime: number,
        currentQuestionId?: number | null,
        currentState: GameSessionState,
        gameCode: number,
        isAdvanced: boolean,
        imageUrl?: string | null,
        description?: string | null,
        title?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
    },
    trickiestAnswerIDs?: Array< string | null > | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        deviceId: string,
        createdAt: string,
        updatedAt: string,
        teamTeamMembersId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId: string,
    teamQuestionGameSessionId: string,
  } | null,
};

export type CreateTeamMemberMutationVariables = {
  input: CreateTeamMemberInput,
  condition?: ModelTeamMemberConditionInput | null,
};

export type CreateTeamMemberMutation = {
  createTeamMember?:  {
    __typename: "TeamMember",
    id: string,
    team:  {
      __typename: "Team",
      id: string,
      name: string,
      question:  {
        __typename: "Question",
        id: number,
        text: string,
        answer?: string | null,
        wrongAnswers?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        gameSessionId: string,
      },
      trickiestAnswerIDs?: Array< string | null > | null,
      teamMembers?:  {
        __typename: "ModelTeamMemberConnection",
        nextToken?: string | null,
      } | null,
      score: number,
      createdAt: string,
      updatedAt: string,
      gameSessionTeamsId?: string | null,
      teamQuestionId: string,
      teamQuestionGameSessionId: string,
    },
    isFacilitator?: boolean | null,
    answers?:  {
      __typename: "ModelTeamAnswerConnection",
      items:  Array< {
        __typename: "TeamAnswer",
        id: string,
        isChosen?: boolean | null,
        text?: string | null,
        createdAt: string,
        updatedAt: string,
        teamMemberAnswersId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    deviceId: string,
    createdAt: string,
    updatedAt: string,
    teamTeamMembersId?: string | null,
  } | null,
};

export type UpdateTeamMemberMutationVariables = {
  input: UpdateTeamMemberInput,
  condition?: ModelTeamMemberConditionInput | null,
};

export type UpdateTeamMemberMutation = {
  updateTeamMember?:  {
    __typename: "TeamMember",
    id: string,
    team:  {
      __typename: "Team",
      id: string,
      name: string,
      question:  {
        __typename: "Question",
        id: number,
        text: string,
        answer?: string | null,
        wrongAnswers?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        gameSessionId: string,
      },
      trickiestAnswerIDs?: Array< string | null > | null,
      teamMembers?:  {
        __typename: "ModelTeamMemberConnection",
        nextToken?: string | null,
      } | null,
      score: number,
      createdAt: string,
      updatedAt: string,
      gameSessionTeamsId?: string | null,
      teamQuestionId: string,
      teamQuestionGameSessionId: string,
    },
    isFacilitator?: boolean | null,
    answers?:  {
      __typename: "ModelTeamAnswerConnection",
      items:  Array< {
        __typename: "TeamAnswer",
        id: string,
        isChosen?: boolean | null,
        text?: string | null,
        createdAt: string,
        updatedAt: string,
        teamMemberAnswersId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    deviceId: string,
    createdAt: string,
    updatedAt: string,
    teamTeamMembersId?: string | null,
  } | null,
};

export type DeleteTeamMemberMutationVariables = {
  input: DeleteTeamMemberInput,
  condition?: ModelTeamMemberConditionInput | null,
};

export type DeleteTeamMemberMutation = {
  deleteTeamMember?:  {
    __typename: "TeamMember",
    id: string,
    team:  {
      __typename: "Team",
      id: string,
      name: string,
      question:  {
        __typename: "Question",
        id: number,
        text: string,
        answer?: string | null,
        wrongAnswers?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        gameSessionId: string,
      },
      trickiestAnswerIDs?: Array< string | null > | null,
      teamMembers?:  {
        __typename: "ModelTeamMemberConnection",
        nextToken?: string | null,
      } | null,
      score: number,
      createdAt: string,
      updatedAt: string,
      gameSessionTeamsId?: string | null,
      teamQuestionId: string,
      teamQuestionGameSessionId: string,
    },
    isFacilitator?: boolean | null,
    answers?:  {
      __typename: "ModelTeamAnswerConnection",
      items:  Array< {
        __typename: "TeamAnswer",
        id: string,
        isChosen?: boolean | null,
        text?: string | null,
        createdAt: string,
        updatedAt: string,
        teamMemberAnswersId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    deviceId: string,
    createdAt: string,
    updatedAt: string,
    teamTeamMembersId?: string | null,
  } | null,
};

export type CreateTeamAnswerMutationVariables = {
  input: CreateTeamAnswerInput,
  condition?: ModelTeamAnswerConditionInput | null,
};

export type CreateTeamAnswerMutation = {
  createTeamAnswer?:  {
    __typename: "TeamAnswer",
    id: string,
    isChosen?: boolean | null,
    text?: string | null,
    createdAt: string,
    updatedAt: string,
    teamMemberAnswersId?: string | null,
  } | null,
};

export type UpdateTeamAnswerMutationVariables = {
  input: UpdateTeamAnswerInput,
  condition?: ModelTeamAnswerConditionInput | null,
};

export type UpdateTeamAnswerMutation = {
  updateTeamAnswer?:  {
    __typename: "TeamAnswer",
    id: string,
    isChosen?: boolean | null,
    text?: string | null,
    createdAt: string,
    updatedAt: string,
    teamMemberAnswersId?: string | null,
  } | null,
};

export type DeleteTeamAnswerMutationVariables = {
  input: DeleteTeamAnswerInput,
  condition?: ModelTeamAnswerConditionInput | null,
};

export type DeleteTeamAnswerMutation = {
  deleteTeamAnswer?:  {
    __typename: "TeamAnswer",
    id: string,
    isChosen?: boolean | null,
    text?: string | null,
    createdAt: string,
    updatedAt: string,
    teamMemberAnswersId?: string | null,
  } | null,
};

export type GetGameSessionQueryVariables = {
  id: string,
};

export type GetGameSessionQuery = {
  getGameSession?:  {
    __typename: "GameSession",
    id: string,
    gameId: number,
    startTime?: string | null,
    phaseOneTime: number,
    phaseTwoTime: number,
    teams?:  {
      __typename: "ModelTeamConnection",
      items:  Array< {
        __typename: "Team",
        id: string,
        name: string,
        trickiestAnswerIDs?: Array< string | null > | null,
        score: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId: string,
        teamQuestionGameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    currentQuestionId?: number | null,
    currentState: GameSessionState,
    gameCode: number,
    isAdvanced: boolean,
    imageUrl?: string | null,
    description?: string | null,
    title?: string | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      items:  Array< {
        __typename: "Question",
        id: number,
        text: string,
        answer?: string | null,
        wrongAnswers?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        gameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListGameSessionsQueryVariables = {
  filter?: ModelGameSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGameSessionsQuery = {
  listGameSessions?:  {
    __typename: "ModelGameSessionConnection",
    items:  Array< {
      __typename: "GameSession",
      id: string,
      gameId: number,
      startTime?: string | null,
      phaseOneTime: number,
      phaseTwoTime: number,
      teams?:  {
        __typename: "ModelTeamConnection",
        nextToken?: string | null,
      } | null,
      currentQuestionId?: number | null,
      currentState: GameSessionState,
      gameCode: number,
      isAdvanced: boolean,
      imageUrl?: string | null,
      description?: string | null,
      title?: string | null,
      questions?:  {
        __typename: "ModelQuestionConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetQuestionQueryVariables = {
  id: number,
  gameSessionId: string,
};

export type GetQuestionQuery = {
  getQuestion?:  {
    __typename: "Question",
    id: number,
    text: string,
    answer?: string | null,
    wrongAnswers?: string | null,
    imageUrl?: string | null,
    instructions?: string | null,
    standard?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    gameSessionId: string,
    gameSession?:  {
      __typename: "GameSession",
      id: string,
      gameId: number,
      startTime?: string | null,
      phaseOneTime: number,
      phaseTwoTime: number,
      teams?:  {
        __typename: "ModelTeamConnection",
        nextToken?: string | null,
      } | null,
      currentQuestionId?: number | null,
      currentState: GameSessionState,
      gameCode: number,
      isAdvanced: boolean,
      imageUrl?: string | null,
      description?: string | null,
      title?: string | null,
      questions?:  {
        __typename: "ModelQuestionConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type ListQuestionsQueryVariables = {
  id?: number | null,
  gameSessionId?: ModelIDKeyConditionInput | null,
  filter?: ModelQuestionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListQuestionsQuery = {
  listQuestions?:  {
    __typename: "ModelQuestionConnection",
    items:  Array< {
      __typename: "Question",
      id: number,
      text: string,
      answer?: string | null,
      wrongAnswers?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      gameSessionId: string,
      gameSession?:  {
        __typename: "GameSession",
        id: string,
        gameId: number,
        startTime?: string | null,
        phaseOneTime: number,
        phaseTwoTime: number,
        currentQuestionId?: number | null,
        currentState: GameSessionState,
        gameCode: number,
        isAdvanced: boolean,
        imageUrl?: string | null,
        description?: string | null,
        title?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTeamQueryVariables = {
  id: string,
};

export type GetTeamQuery = {
  getTeam?:  {
    __typename: "Team",
    id: string,
    name: string,
    question:  {
      __typename: "Question",
      id: number,
      text: string,
      answer?: string | null,
      wrongAnswers?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      gameSessionId: string,
      gameSession?:  {
        __typename: "GameSession",
        id: string,
        gameId: number,
        startTime?: string | null,
        phaseOneTime: number,
        phaseTwoTime: number,
        currentQuestionId?: number | null,
        currentState: GameSessionState,
        gameCode: number,
        isAdvanced: boolean,
        imageUrl?: string | null,
        description?: string | null,
        title?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
    },
    trickiestAnswerIDs?: Array< string | null > | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        deviceId: string,
        createdAt: string,
        updatedAt: string,
        teamTeamMembersId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId: string,
    teamQuestionGameSessionId: string,
  } | null,
};

export type ListTeamsQueryVariables = {
  filter?: ModelTeamFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTeamsQuery = {
  listTeams?:  {
    __typename: "ModelTeamConnection",
    items:  Array< {
      __typename: "Team",
      id: string,
      name: string,
      question:  {
        __typename: "Question",
        id: number,
        text: string,
        answer?: string | null,
        wrongAnswers?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        gameSessionId: string,
      },
      trickiestAnswerIDs?: Array< string | null > | null,
      teamMembers?:  {
        __typename: "ModelTeamMemberConnection",
        nextToken?: string | null,
      } | null,
      score: number,
      createdAt: string,
      updatedAt: string,
      gameSessionTeamsId?: string | null,
      teamQuestionId: string,
      teamQuestionGameSessionId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTeamMemberQueryVariables = {
  id: string,
};

export type GetTeamMemberQuery = {
  getTeamMember?:  {
    __typename: "TeamMember",
    id: string,
    team:  {
      __typename: "Team",
      id: string,
      name: string,
      question:  {
        __typename: "Question",
        id: number,
        text: string,
        answer?: string | null,
        wrongAnswers?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        gameSessionId: string,
      },
      trickiestAnswerIDs?: Array< string | null > | null,
      teamMembers?:  {
        __typename: "ModelTeamMemberConnection",
        nextToken?: string | null,
      } | null,
      score: number,
      createdAt: string,
      updatedAt: string,
      gameSessionTeamsId?: string | null,
      teamQuestionId: string,
      teamQuestionGameSessionId: string,
    },
    isFacilitator?: boolean | null,
    answers?:  {
      __typename: "ModelTeamAnswerConnection",
      items:  Array< {
        __typename: "TeamAnswer",
        id: string,
        isChosen?: boolean | null,
        text?: string | null,
        createdAt: string,
        updatedAt: string,
        teamMemberAnswersId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    deviceId: string,
    createdAt: string,
    updatedAt: string,
    teamTeamMembersId?: string | null,
  } | null,
};

export type ListTeamMembersQueryVariables = {
  filter?: ModelTeamMemberFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTeamMembersQuery = {
  listTeamMembers?:  {
    __typename: "ModelTeamMemberConnection",
    items:  Array< {
      __typename: "TeamMember",
      id: string,
      team:  {
        __typename: "Team",
        id: string,
        name: string,
        trickiestAnswerIDs?: Array< string | null > | null,
        score: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId: string,
        teamQuestionGameSessionId: string,
      },
      isFacilitator?: boolean | null,
      answers?:  {
        __typename: "ModelTeamAnswerConnection",
        nextToken?: string | null,
      } | null,
      deviceId: string,
      createdAt: string,
      updatedAt: string,
      teamTeamMembersId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTeamAnswerQueryVariables = {
  id: string,
};

export type GetTeamAnswerQuery = {
  getTeamAnswer?:  {
    __typename: "TeamAnswer",
    id: string,
    isChosen?: boolean | null,
    text?: string | null,
    createdAt: string,
    updatedAt: string,
    teamMemberAnswersId?: string | null,
  } | null,
};

export type ListTeamAnswersQueryVariables = {
  filter?: ModelTeamAnswerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTeamAnswersQuery = {
  listTeamAnswers?:  {
    __typename: "ModelTeamAnswerConnection",
    items:  Array< {
      __typename: "TeamAnswer",
      id: string,
      isChosen?: boolean | null,
      text?: string | null,
      createdAt: string,
      updatedAt: string,
      teamMemberAnswersId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GameSessionByStateQueryVariables = {
  currentState: GameSessionState,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGameSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GameSessionByStateQuery = {
  gameSessionByState?:  {
    __typename: "ModelGameSessionConnection",
    items:  Array< {
      __typename: "GameSession",
      id: string,
      gameId: number,
      startTime?: string | null,
      phaseOneTime: number,
      phaseTwoTime: number,
      teams?:  {
        __typename: "ModelTeamConnection",
        nextToken?: string | null,
      } | null,
      currentQuestionId?: number | null,
      currentState: GameSessionState,
      gameCode: number,
      isAdvanced: boolean,
      imageUrl?: string | null,
      description?: string | null,
      title?: string | null,
      questions?:  {
        __typename: "ModelQuestionConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GameSessionByCodeQueryVariables = {
  gameCode: number,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelGameSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GameSessionByCodeQuery = {
  gameSessionByCode?:  {
    __typename: "ModelGameSessionConnection",
    items:  Array< {
      __typename: "GameSession",
      id: string,
      gameId: number,
      startTime?: string | null,
      phaseOneTime: number,
      phaseTwoTime: number,
      teams?:  {
        __typename: "ModelTeamConnection",
        nextToken?: string | null,
      } | null,
      currentQuestionId?: number | null,
      currentState: GameSessionState,
      gameCode: number,
      isAdvanced: boolean,
      imageUrl?: string | null,
      description?: string | null,
      title?: string | null,
      questions?:  {
        __typename: "ModelQuestionConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateGameSessionSubscription = {
  onCreateGameSession?:  {
    __typename: "GameSession",
    id: string,
    gameId: number,
    startTime?: string | null,
    phaseOneTime: number,
    phaseTwoTime: number,
    teams?:  {
      __typename: "ModelTeamConnection",
      items:  Array< {
        __typename: "Team",
        id: string,
        name: string,
        trickiestAnswerIDs?: Array< string | null > | null,
        score: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId: string,
        teamQuestionGameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    currentQuestionId?: number | null,
    currentState: GameSessionState,
    gameCode: number,
    isAdvanced: boolean,
    imageUrl?: string | null,
    description?: string | null,
    title?: string | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      items:  Array< {
        __typename: "Question",
        id: number,
        text: string,
        answer?: string | null,
        wrongAnswers?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        gameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateGameSessionSubscription = {
  onUpdateGameSession?:  {
    __typename: "GameSession",
    id: string,
    gameId: number,
    startTime?: string | null,
    phaseOneTime: number,
    phaseTwoTime: number,
    teams?:  {
      __typename: "ModelTeamConnection",
      items:  Array< {
        __typename: "Team",
        id: string,
        name: string,
        trickiestAnswerIDs?: Array< string | null > | null,
        score: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId: string,
        teamQuestionGameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    currentQuestionId?: number | null,
    currentState: GameSessionState,
    gameCode: number,
    isAdvanced: boolean,
    imageUrl?: string | null,
    description?: string | null,
    title?: string | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      items:  Array< {
        __typename: "Question",
        id: number,
        text: string,
        answer?: string | null,
        wrongAnswers?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        gameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteGameSessionSubscription = {
  onDeleteGameSession?:  {
    __typename: "GameSession",
    id: string,
    gameId: number,
    startTime?: string | null,
    phaseOneTime: number,
    phaseTwoTime: number,
    teams?:  {
      __typename: "ModelTeamConnection",
      items:  Array< {
        __typename: "Team",
        id: string,
        name: string,
        trickiestAnswerIDs?: Array< string | null > | null,
        score: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId: string,
        teamQuestionGameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    currentQuestionId?: number | null,
    currentState: GameSessionState,
    gameCode: number,
    isAdvanced: boolean,
    imageUrl?: string | null,
    description?: string | null,
    title?: string | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      items:  Array< {
        __typename: "Question",
        id: number,
        text: string,
        answer?: string | null,
        wrongAnswers?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        gameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTeamSubscription = {
  onCreateTeam?:  {
    __typename: "Team",
    id: string,
    name: string,
    question:  {
      __typename: "Question",
      id: number,
      text: string,
      answer?: string | null,
      wrongAnswers?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      gameSessionId: string,
      gameSession?:  {
        __typename: "GameSession",
        id: string,
        gameId: number,
        startTime?: string | null,
        phaseOneTime: number,
        phaseTwoTime: number,
        currentQuestionId?: number | null,
        currentState: GameSessionState,
        gameCode: number,
        isAdvanced: boolean,
        imageUrl?: string | null,
        description?: string | null,
        title?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
    },
    trickiestAnswerIDs?: Array< string | null > | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        deviceId: string,
        createdAt: string,
        updatedAt: string,
        teamTeamMembersId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId: string,
    teamQuestionGameSessionId: string,
  } | null,
};

export type OnUpdateTeamSubscription = {
  onUpdateTeam?:  {
    __typename: "Team",
    id: string,
    name: string,
    question:  {
      __typename: "Question",
      id: number,
      text: string,
      answer?: string | null,
      wrongAnswers?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      gameSessionId: string,
      gameSession?:  {
        __typename: "GameSession",
        id: string,
        gameId: number,
        startTime?: string | null,
        phaseOneTime: number,
        phaseTwoTime: number,
        currentQuestionId?: number | null,
        currentState: GameSessionState,
        gameCode: number,
        isAdvanced: boolean,
        imageUrl?: string | null,
        description?: string | null,
        title?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
    },
    trickiestAnswerIDs?: Array< string | null > | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        deviceId: string,
        createdAt: string,
        updatedAt: string,
        teamTeamMembersId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId: string,
    teamQuestionGameSessionId: string,
  } | null,
};

export type OnDeleteTeamSubscription = {
  onDeleteTeam?:  {
    __typename: "Team",
    id: string,
    name: string,
    question:  {
      __typename: "Question",
      id: number,
      text: string,
      answer?: string | null,
      wrongAnswers?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      gameSessionId: string,
      gameSession?:  {
        __typename: "GameSession",
        id: string,
        gameId: number,
        startTime?: string | null,
        phaseOneTime: number,
        phaseTwoTime: number,
        currentQuestionId?: number | null,
        currentState: GameSessionState,
        gameCode: number,
        isAdvanced: boolean,
        imageUrl?: string | null,
        description?: string | null,
        title?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
    },
    trickiestAnswerIDs?: Array< string | null > | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        deviceId: string,
        createdAt: string,
        updatedAt: string,
        teamTeamMembersId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId: string,
    teamQuestionGameSessionId: string,
  } | null,
};

export type OnCreateTeamMemberSubscription = {
  onCreateTeamMember?:  {
    __typename: "TeamMember",
    id: string,
    team:  {
      __typename: "Team",
      id: string,
      name: string,
      question:  {
        __typename: "Question",
        id: number,
        text: string,
        answer?: string | null,
        wrongAnswers?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        gameSessionId: string,
      },
      trickiestAnswerIDs?: Array< string | null > | null,
      teamMembers?:  {
        __typename: "ModelTeamMemberConnection",
        nextToken?: string | null,
      } | null,
      score: number,
      createdAt: string,
      updatedAt: string,
      gameSessionTeamsId?: string | null,
      teamQuestionId: string,
      teamQuestionGameSessionId: string,
    },
    isFacilitator?: boolean | null,
    answers?:  {
      __typename: "ModelTeamAnswerConnection",
      items:  Array< {
        __typename: "TeamAnswer",
        id: string,
        isChosen?: boolean | null,
        text?: string | null,
        createdAt: string,
        updatedAt: string,
        teamMemberAnswersId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    deviceId: string,
    createdAt: string,
    updatedAt: string,
    teamTeamMembersId?: string | null,
  } | null,
};

export type OnUpdateTeamMemberSubscription = {
  onUpdateTeamMember?:  {
    __typename: "TeamMember",
    id: string,
    team:  {
      __typename: "Team",
      id: string,
      name: string,
      question:  {
        __typename: "Question",
        id: number,
        text: string,
        answer?: string | null,
        wrongAnswers?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        gameSessionId: string,
      },
      trickiestAnswerIDs?: Array< string | null > | null,
      teamMembers?:  {
        __typename: "ModelTeamMemberConnection",
        nextToken?: string | null,
      } | null,
      score: number,
      createdAt: string,
      updatedAt: string,
      gameSessionTeamsId?: string | null,
      teamQuestionId: string,
      teamQuestionGameSessionId: string,
    },
    isFacilitator?: boolean | null,
    answers?:  {
      __typename: "ModelTeamAnswerConnection",
      items:  Array< {
        __typename: "TeamAnswer",
        id: string,
        isChosen?: boolean | null,
        text?: string | null,
        createdAt: string,
        updatedAt: string,
        teamMemberAnswersId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    deviceId: string,
    createdAt: string,
    updatedAt: string,
    teamTeamMembersId?: string | null,
  } | null,
};

export type OnDeleteTeamMemberSubscription = {
  onDeleteTeamMember?:  {
    __typename: "TeamMember",
    id: string,
    team:  {
      __typename: "Team",
      id: string,
      name: string,
      question:  {
        __typename: "Question",
        id: number,
        text: string,
        answer?: string | null,
        wrongAnswers?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        gameSessionId: string,
      },
      trickiestAnswerIDs?: Array< string | null > | null,
      teamMembers?:  {
        __typename: "ModelTeamMemberConnection",
        nextToken?: string | null,
      } | null,
      score: number,
      createdAt: string,
      updatedAt: string,
      gameSessionTeamsId?: string | null,
      teamQuestionId: string,
      teamQuestionGameSessionId: string,
    },
    isFacilitator?: boolean | null,
    answers?:  {
      __typename: "ModelTeamAnswerConnection",
      items:  Array< {
        __typename: "TeamAnswer",
        id: string,
        isChosen?: boolean | null,
        text?: string | null,
        createdAt: string,
        updatedAt: string,
        teamMemberAnswersId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    deviceId: string,
    createdAt: string,
    updatedAt: string,
    teamTeamMembersId?: string | null,
  } | null,
};

export type OnCreateTeamAnswerSubscription = {
  onCreateTeamAnswer?:  {
    __typename: "TeamAnswer",
    id: string,
    isChosen?: boolean | null,
    text?: string | null,
    createdAt: string,
    updatedAt: string,
    teamMemberAnswersId?: string | null,
  } | null,
};

export type OnUpdateTeamAnswerSubscription = {
  onUpdateTeamAnswer?:  {
    __typename: "TeamAnswer",
    id: string,
    isChosen?: boolean | null,
    text?: string | null,
    createdAt: string,
    updatedAt: string,
    teamMemberAnswersId?: string | null,
  } | null,
};

export type OnDeleteTeamAnswerSubscription = {
  onDeleteTeamAnswer?:  {
    __typename: "TeamAnswer",
    id: string,
    isChosen?: boolean | null,
    text?: string | null,
    createdAt: string,
    updatedAt: string,
    teamMemberAnswersId?: string | null,
  } | null,
};
