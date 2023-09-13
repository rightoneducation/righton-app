/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateGameSessionInput = {
  id?: string | null,
  gameId: number,
  startTime?: string | null,
  phaseOneTime: number,
  phaseTwoTime: number,
  currentQuestionIndex?: number | null,
  currentState: GameSessionState,
  gameCode: number,
  isAdvancedMode: boolean,
  imageUrl?: string | null,
  description?: string | null,
  title?: string | null,
  currentTimer?: number | null,
};

export enum GameSessionState {
  NOT_STARTED = "NOT_STARTED",
  TEAMS_JOINING = "TEAMS_JOINING",
  CHOOSE_CORRECT_ANSWER = "CHOOSE_CORRECT_ANSWER",
  PHASE_1_DISCUSS = "PHASE_1_DISCUSS",
  PHASE_1_RESULTS = "PHASE_1_RESULTS",
  PHASE_2_START = "PHASE_2_START",
  CHOOSE_TRICKIEST_ANSWER = "CHOOSE_TRICKIEST_ANSWER",
  PHASE_2_DISCUSS = "PHASE_2_DISCUSS",
  PHASE_2_RESULTS = "PHASE_2_RESULTS",
  FINAL_RESULTS = "FINAL_RESULTS",
  FINISHED = "FINISHED",
}


export type ModelGameSessionConditionInput = {
  gameId?: ModelIntInput | null,
  startTime?: ModelStringInput | null,
  phaseOneTime?: ModelIntInput | null,
  phaseTwoTime?: ModelIntInput | null,
  currentQuestionIndex?: ModelIntInput | null,
  currentState?: ModelGameSessionStateInput | null,
  gameCode?: ModelIntInput | null,
  isAdvancedMode?: ModelBooleanInput | null,
  imageUrl?: ModelStringInput | null,
  description?: ModelStringInput | null,
  title?: ModelStringInput | null,
  currentTimer?: ModelIntInput | null,
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
  currentQuestionIndex?: number | null,
  currentState: GameSessionState,
  gameCode: number,
  isAdvancedMode: boolean,
  imageUrl?: string | null,
  description?: string | null,
  title?: string | null,
  currentTimer?: number | null,
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
  question?: Question | null,
  teamMembers?: ModelTeamMemberConnection | null,
  score: number,
  selectedAvatarIndex: number,
  createdAt: string,
  updatedAt: string,
  gameSessionTeamsId?: string | null,
  teamQuestionId?: string | null,
  teamQuestionOrder?: number | null,
  teamQuestionGameSessionId?: string | null,
};

export type Question = {
  __typename: "Question",
  id: number,
  text: string,
  choices?: string | null,
  imageUrl?: string | null,
  instructions?: string | null,
  standard?: string | null,
  cluster?: string | null,
  domain?: string | null,
  grade?: string | null,
  order: number,
  isHintEnabled: boolean,
  isConfidenceEnabled: boolean,
  gameSessionId: string,
};

export type ModelTeamMemberConnection = {
  __typename: "ModelTeamMemberConnection",
  items:  Array<TeamMember | null >,
  nextToken?: string | null,
};

export type TeamMember = {
  __typename: "TeamMember",
  id: string,
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
  questionId: number,
  isChosen: boolean,
  text: string,
  isTrickAnswer: boolean,
  confidenceLevel: ConfidenceLevel,
  createdAt: string,
  updatedAt: string,
  teamMemberAnswersId?: string | null,
};

export enum ConfidenceLevel {
  NOT_RATED = "NOT_RATED",
  NOT_AT_ALL = "NOT_AT_ALL",
  KINDA = "KINDA",
  QUITE = "QUITE",
  VERY = "VERY",
  TOTALLY = "TOTALLY"
}

export enum ConfidenceLevelLabels {
  NOT_RATED = "Not\nRated",
  NOT_AT_ALL = "Not At\nAll",
  KINDA = "Kinda",
  QUITE = "Quite",
  VERY = "Very",
  TOTALLY = "Totally"
}


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
  currentQuestionIndex?: number | null,
  currentState?: GameSessionState | null,
  gameCode?: number | null,
  isAdvancedMode?: boolean | null,
  imageUrl?: string | null,
  description?: string | null,
  title?: string | null,
  currentTimer?: number | null,
};

export type DeleteGameSessionInput = {
  id: string,
};

export type CreateQuestionInput = {
  id?: number | null,
  text: string,
  choices?: string | null,
  imageUrl?: string | null,
  instructions?: string | null,
  standard?: string | null,
  cluster?: string | null,
  domain?: string | null,
  grade?: string | null,
  order: number,
  isHintEnabled: boolean,
  isConfidenceEnabled: boolean,
  gameSessionId: string,
};

export type ModelQuestionConditionInput = {
  text?: ModelStringInput | null,
  choices?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  instructions?: ModelStringInput | null,
  standard?: ModelStringInput | null,
  cluster?: ModelStringInput | null,
  domain?: ModelStringInput | null,
  grade?: ModelStringInput | null,
  isHintEnabled?: ModelBooleanInput | null,
  isConfidenceEnabled?: ModelBooleanInput | null,
  and?: Array< ModelQuestionConditionInput | null > | null,
  or?: Array< ModelQuestionConditionInput | null > | null,
  not?: ModelQuestionConditionInput | null,
};

export type UpdateQuestionInput = {
  id: number,
  text?: string | null,
  choices?: string | null,
  imageUrl?: string | null,
  instructions?: string | null,
  standard?: string | null,
  cluster?: string | null,
  domain?: string | null,
  grade?: string | null,
  order: number,
  isHintEnabled?: boolean | null,
  isConfidenceEnabled?: boolean | null,
  gameSessionId: string,
};

export type DeleteQuestionInput = {
  id: number,
  order: number,
  gameSessionId: string,
};

export type CreateTeamInput = {
  id?: string | null,
  name: string,
  score: number,
  selectedAvatarIndex: number,
  gameSessionTeamsId?: string | null,
  teamQuestionId?: string | null,
  teamQuestionOrder?: number | null,
  teamQuestionGameSessionId?: string | null,
};

export type ModelTeamConditionInput = {
  name?: ModelStringInput | null,
  score?: ModelIntInput | null,
  selectedAvatarIndex?: ModelIntInput | null,
  and?: Array< ModelTeamConditionInput | null > | null,
  or?: Array< ModelTeamConditionInput | null > | null,
  not?: ModelTeamConditionInput | null,
  gameSessionTeamsId?: ModelIDInput | null,
  teamQuestionId?: ModelIDInput | null,
  teamQuestionOrder?: ModelIntInput | null,
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
  score?: number | null,
  selectedAvatarIndex?: number | null,
  gameSessionTeamsId?: string | null,
  teamQuestionId?: string | null,
  teamQuestionOrder?: number | null,
  teamQuestionGameSessionId?: string | null,
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
  questionId: number,
  isChosen: boolean,
  text: string,
  isTrickAnswer: boolean,
  confidenceLevel: ConfidenceLevel,
  teamMemberAnswersId?: string | null,
};

export type ModelTeamAnswerConditionInput = {
  questionId?: ModelIntInput | null,
  isChosen?: ModelBooleanInput | null,
  text?: ModelStringInput | null,
  isTrickAnswer?: ModelBooleanInput | null,
  confidenceLevel?: ModelConfidenceLevelInput | null,
  and?: Array< ModelTeamAnswerConditionInput | null > | null,
  or?: Array< ModelTeamAnswerConditionInput | null > | null,
  not?: ModelTeamAnswerConditionInput | null,
  teamMemberAnswersId?: ModelIDInput | null,
};

export type ModelConfidenceLevelInput = {
  eq?: ConfidenceLevel | null,
  ne?: ConfidenceLevel | null,
};

export type UpdateTeamAnswerInput = {
  id: string,
  questionId?: number | null,
  isChosen?: boolean | null,
  text?: string | null,
  isTrickAnswer?: boolean | null,
  confidenceLevel?: ConfidenceLevel | null,
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
  currentQuestionIndex?: ModelIntInput | null,
  currentState?: ModelGameSessionStateInput | null,
  gameCode?: ModelIntInput | null,
  isAdvancedMode?: ModelBooleanInput | null,
  imageUrl?: ModelStringInput | null,
  description?: ModelStringInput | null,
  title?: ModelStringInput | null,
  currentTimer?: ModelIntInput | null,
  and?: Array< ModelGameSessionFilterInput | null > | null,
  or?: Array< ModelGameSessionFilterInput | null > | null,
  not?: ModelGameSessionFilterInput | null,
};

export type ModelGameSessionConnection = {
  __typename: "ModelGameSessionConnection",
  items:  Array<GameSession | null >,
  nextToken?: string | null,
};

export type ModelQuestionPrimaryCompositeKeyConditionInput = {
  eq?: ModelQuestionPrimaryCompositeKeyInput | null,
  le?: ModelQuestionPrimaryCompositeKeyInput | null,
  lt?: ModelQuestionPrimaryCompositeKeyInput | null,
  ge?: ModelQuestionPrimaryCompositeKeyInput | null,
  gt?: ModelQuestionPrimaryCompositeKeyInput | null,
  between?: Array< ModelQuestionPrimaryCompositeKeyInput | null > | null,
  beginsWith?: ModelQuestionPrimaryCompositeKeyInput | null,
};

export type ModelQuestionPrimaryCompositeKeyInput = {
  order?: number | null,
  gameSessionId?: string | null,
};

export type ModelQuestionFilterInput = {
  id?: ModelIntInput | null,
  text?: ModelStringInput | null,
  choices?: ModelStringInput | null,
  imageUrl?: ModelStringInput | null,
  instructions?: ModelStringInput | null,
  standard?: ModelStringInput | null,
  cluster?: ModelStringInput | null,
  domain?: ModelStringInput | null,
  grade?: ModelStringInput | null,
  order?: ModelIntInput | null,
  isHintEnabled?: ModelBooleanInput | null,
  isConfidenceEnabled?: ModelBooleanInput | null,
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
  score?: ModelIntInput | null,
  selectedAvatarIndex?: ModelIntInput | null,
  and?: Array< ModelTeamFilterInput | null > | null,
  or?: Array< ModelTeamFilterInput | null > | null,
  not?: ModelTeamFilterInput | null,
  gameSessionTeamsId?: ModelIDInput | null,
  teamQuestionId?: ModelIDInput | null,
  teamQuestionOrder?: ModelIntInput | null,
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
  questionId?: ModelIntInput | null,
  isChosen?: ModelBooleanInput | null,
  text?: ModelStringInput | null,
  isTrickAnswer?: ModelBooleanInput | null,
  confidenceLevel?: ModelConfidenceLevelInput | null,
  and?: Array< ModelTeamAnswerFilterInput | null > | null,
  or?: Array< ModelTeamAnswerFilterInput | null > | null,
  not?: ModelTeamAnswerFilterInput | null,
  teamMemberAnswersId?: ModelIDInput | null,
};

export type ModelSubscriptionGameSessionFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  gameId?: ModelSubscriptionIntInput | null,
  startTime?: ModelSubscriptionStringInput | null,
  phaseOneTime?: ModelSubscriptionIntInput | null,
  phaseTwoTime?: ModelSubscriptionIntInput | null,
  currentQuestionIndex?: ModelSubscriptionIntInput | null,
  currentState?: ModelSubscriptionStringInput | null,
  gameCode?: ModelSubscriptionIntInput | null,
  isAdvancedMode?: ModelSubscriptionBooleanInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  title?: ModelSubscriptionStringInput | null,
  currentTimer?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionGameSessionFilterInput | null > | null,
  or?: Array< ModelSubscriptionGameSessionFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
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
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionStringInput = {
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
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionTeamFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  score?: ModelSubscriptionIntInput | null,
  selectedAvatarIndex?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionTeamFilterInput | null > | null,
  or?: Array< ModelSubscriptionTeamFilterInput | null > | null,
};

export type ModelSubscriptionTeamMemberFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  isFacilitator?: ModelSubscriptionBooleanInput | null,
  deviceId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionTeamMemberFilterInput | null > | null,
  or?: Array< ModelSubscriptionTeamMemberFilterInput | null > | null,
};

export type ModelSubscriptionTeamAnswerFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  questionId?: ModelSubscriptionIntInput | null,
  isChosen?: ModelSubscriptionBooleanInput | null,
  text?: ModelSubscriptionStringInput | null,
  isTrickAnswer?: ModelSubscriptionBooleanInput | null,
  confidenceLevel?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTeamAnswerFilterInput | null > | null,
  or?: Array< ModelSubscriptionTeamAnswerFilterInput | null > | null,
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
        question?:  {
          __typename: "Question",
          id: number,
          text: string,
          choices?: string | null,
          imageUrl?: string | null,
          instructions?: string | null,
          standard?: string | null,
          cluster?: string | null,
          domain?: string | null,
          grade?: string | null,
          order: number,
          isHintEnabled: boolean,
          isConfidenceEnabled: boolean,
          gameSessionId: string,
        } | null,
        teamMembers?:  {
          __typename: "ModelTeamMemberConnection",
          items:  Array< {
            __typename: "TeamMember",
            id: string,
            isFacilitator?: boolean | null,
            answers?:  {
              __typename: "ModelTeamAnswerConnection",
              items:  Array< {
                __typename: "TeamAnswer",
                id: string,
                questionId: number,
                isChosen: boolean,
                text: string,
                isTrickAnswer: boolean,
                confidenceLevel: ConfidenceLevel,
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
          } | null >,
          nextToken?: string | null,
        } | null,
        score: number,
        selectedAvatarIndex: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId?: string | null,
        teamQuestionOrder?: number | null,
        teamQuestionGameSessionId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    currentQuestionIndex?: number | null,
    currentState: GameSessionState,
    gameCode: number,
    isAdvancedMode: boolean,
    imageUrl?: string | null,
    description?: string | null,
    title?: string | null,
    currentTimer?: number | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      items:  Array< {
        __typename: "Question",
        id: number,
        text: string,
        choices?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        order: number,
        isHintEnabled: boolean,
        isConfidenceEnabled: boolean,
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
        question?:  {
          __typename: "Question",
          id: number,
          text: string,
          choices?: string | null,
          imageUrl?: string | null,
          instructions?: string | null,
          standard?: string | null,
          cluster?: string | null,
          domain?: string | null,
          grade?: string | null,
          order: number,
          isHintEnabled: boolean,
          isConfidenceEnabled: boolean,
          gameSessionId: string,
        } | null,
        teamMembers?:  {
          __typename: "ModelTeamMemberConnection",
          items:  Array< {
            __typename: "TeamMember",
            id: string,
            isFacilitator?: boolean | null,
            answers?:  {
              __typename: "ModelTeamAnswerConnection",
              items:  Array< {
                __typename: "TeamAnswer",
                id: string,
                questionId: number,
                isChosen: boolean,
                text: string,
                isTrickAnswer: boolean,
                confidenceLevel: ConfidenceLevel,
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
          } | null >,
          nextToken?: string | null,
        } | null,
        score: number,
        selectedAvatarIndex: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId?: string | null,
        teamQuestionOrder?: number | null,
        teamQuestionGameSessionId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    currentQuestionIndex?: number | null,
    currentState: GameSessionState,
    gameCode: number,
    isAdvancedMode: boolean,
    imageUrl?: string | null,
    description?: string | null,
    title?: string | null,
    currentTimer?: number | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      items:  Array< {
        __typename: "Question",
        id: number,
        text: string,
        choices?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        order: number,
        isHintEnabled: boolean,
        isConfidenceEnabled: boolean,
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
        question?:  {
          __typename: "Question",
          id: number,
          text: string,
          choices?: string | null,
          imageUrl?: string | null,
          instructions?: string | null,
          standard?: string | null,
          cluster?: string | null,
          domain?: string | null,
          grade?: string | null,
          order: number,
          isHintEnabled: boolean,
          isConfidenceEnabled: boolean,
          gameSessionId: string,
        } | null,
        teamMembers?:  {
          __typename: "ModelTeamMemberConnection",
          items:  Array< {
            __typename: "TeamMember",
            id: string,
            isFacilitator?: boolean | null,
            answers?:  {
              __typename: "ModelTeamAnswerConnection",
              items:  Array< {
                __typename: "TeamAnswer",
                id: string,
                questionId: number,
                isChosen: boolean,
                text: string,
                isTrickAnswer: boolean,
                confidenceLevel: ConfidenceLevel,
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
          } | null >,
          nextToken?: string | null,
        } | null,
        score: number,
        selectedAvatarIndex: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId?: string | null,
        teamQuestionOrder?: number | null,
        teamQuestionGameSessionId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    currentQuestionIndex?: number | null,
    currentState: GameSessionState,
    gameCode: number,
    isAdvancedMode: boolean,
    imageUrl?: string | null,
    description?: string | null,
    title?: string | null,
    currentTimer?: number | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      items:  Array< {
        __typename: "Question",
        id: number,
        text: string,
        choices?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        order: number,
        isHintEnabled: boolean,
        isConfidenceEnabled: boolean,
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
    choices?: string | null,
    imageUrl?: string | null,
    instructions?: string | null,
    standard?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    order: number,
    isHintEnabled: boolean,
    isConfidenceEnabled: boolean,
    gameSessionId: string,
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
    choices?: string | null,
    imageUrl?: string | null,
    instructions?: string | null,
    standard?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    order: number,
    isHintEnabled: boolean,
    isConfidenceEnabled: boolean,
    gameSessionId: string,
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
    choices?: string | null,
    imageUrl?: string | null,
    instructions?: string | null,
    standard?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    order: number,
    isHintEnabled: boolean,
    isConfidenceEnabled: boolean,
    gameSessionId: string,
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
    question?:  {
      __typename: "Question",
      id: number,
      text: string,
      choices?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      order: number,
      isHintEnabled: boolean,
      isConfidenceEnabled: boolean,
      gameSessionId: string,
    } | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        answers?:  {
          __typename: "ModelTeamAnswerConnection",
          items:  Array< {
            __typename: "TeamAnswer",
            id: string,
            questionId: number,
            isChosen: boolean,
            text: string,
            isTrickAnswer: boolean,
            confidenceLevel: ConfidenceLevel,
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
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    selectedAvatarIndex: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId?: string | null,
    teamQuestionOrder?: number | null,
    teamQuestionGameSessionId?: string | null,
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
    question?:  {
      __typename: "Question",
      id: number,
      text: string,
      choices?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      order: number,
      isHintEnabled: boolean,
      isConfidenceEnabled: boolean,
      gameSessionId: string,
    } | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        answers?:  {
          __typename: "ModelTeamAnswerConnection",
          items:  Array< {
            __typename: "TeamAnswer",
            id: string,
            questionId: number,
            isChosen: boolean,
            text: string,
            isTrickAnswer: boolean,
            confidenceLevel: ConfidenceLevel,
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
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    selectedAvatarIndex: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId?: string | null,
    teamQuestionOrder?: number | null,
    teamQuestionGameSessionId?: string | null,
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
    question?:  {
      __typename: "Question",
      id: number,
      text: string,
      choices?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      order: number,
      isHintEnabled: boolean,
      isConfidenceEnabled: boolean,
      gameSessionId: string,
    } | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        answers?:  {
          __typename: "ModelTeamAnswerConnection",
          items:  Array< {
            __typename: "TeamAnswer",
            id: string,
            questionId: number,
            isChosen: boolean,
            text: string,
            isTrickAnswer: boolean,
            confidenceLevel: ConfidenceLevel,
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
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    selectedAvatarIndex: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId?: string | null,
    teamQuestionOrder?: number | null,
    teamQuestionGameSessionId?: string | null,
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
    isFacilitator?: boolean | null,
    answers?:  {
      __typename: "ModelTeamAnswerConnection",
      items:  Array< {
        __typename: "TeamAnswer",
        id: string,
        questionId: number,
        isChosen: boolean,
        text: string,
        isTrickAnswer: boolean,
        confidenceLevel: ConfidenceLevel,
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
    isFacilitator?: boolean | null,
    answers?:  {
      __typename: "ModelTeamAnswerConnection",
      items:  Array< {
        __typename: "TeamAnswer",
        id: string,
        questionId: number,
        isChosen: boolean,
        text: string,
        isTrickAnswer: boolean,
        confidenceLevel: ConfidenceLevel,
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
    isFacilitator?: boolean | null,
    answers?:  {
      __typename: "ModelTeamAnswerConnection",
      items:  Array< {
        __typename: "TeamAnswer",
        id: string,
        questionId: number,
        isChosen: boolean,
        text: string,
        isTrickAnswer: boolean,
        confidenceLevel: ConfidenceLevel,
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
    questionId: number,
    isChosen: boolean,
    text: string,
    isTrickAnswer: boolean,
    confidenceLevel: ConfidenceLevel,
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
    questionId: number,
    isChosen: boolean,
    text: string,
    isTrickAnswer: boolean,
    confidenceLevel: ConfidenceLevel,
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
    questionId: number,
    isChosen: boolean,
    text: string,
    isTrickAnswer: boolean,
    confidenceLevel: ConfidenceLevel,
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
        question?:  {
          __typename: "Question",
          id: number,
          text: string,
          choices?: string | null,
          imageUrl?: string | null,
          instructions?: string | null,
          standard?: string | null,
          cluster?: string | null,
          domain?: string | null,
          grade?: string | null,
          order: number,
          isHintEnabled: boolean,
          isConfidenceEnabled: boolean,
          gameSessionId: string,
        } | null,
        teamMembers?:  {
          __typename: "ModelTeamMemberConnection",
          items:  Array< {
            __typename: "TeamMember",
            id: string,
            isFacilitator?: boolean | null,
            answers?:  {
              __typename: "ModelTeamAnswerConnection",
              items:  Array< {
                __typename: "TeamAnswer",
                id: string,
                questionId: number,
                isChosen: boolean,
                text: string,
                isTrickAnswer: boolean,
                confidenceLevel: ConfidenceLevel,
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
          } | null >,
          nextToken?: string | null,
        } | null,
        score: number,
        selectedAvatarIndex: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId?: string | null,
        teamQuestionOrder?: number | null,
        teamQuestionGameSessionId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    currentQuestionIndex?: number | null,
    currentState: GameSessionState,
    gameCode: number,
    isAdvancedMode: boolean,
    imageUrl?: string | null,
    description?: string | null,
    title?: string | null,
    currentTimer?: number | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      items:  Array< {
        __typename: "Question",
        id: number,
        text: string,
        choices?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        order: number,
        isHintEnabled: boolean,
        isConfidenceEnabled: boolean,
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
        items:  Array< {
          __typename: "Team",
          id: string,
          name: string,
          question?:  {
            __typename: "Question",
            id: number,
            text: string,
            choices?: string | null,
            imageUrl?: string | null,
            instructions?: string | null,
            standard?: string | null,
            cluster?: string | null,
            domain?: string | null,
            grade?: string | null,
            order: number,
            isHintEnabled: boolean,
            isConfidenceEnabled: boolean,
            gameSessionId: string,
          } | null,
          teamMembers?:  {
            __typename: "ModelTeamMemberConnection",
            items:  Array< {
              __typename: "TeamMember",
              id: string,
              isFacilitator?: boolean | null,
              answers?:  {
                __typename: "ModelTeamAnswerConnection",
                items:  Array< {
                  __typename: "TeamAnswer",
                  id: string,
                  questionId: number,
                  isChosen: boolean,
                  text: string,
                  isTrickAnswer: boolean,
                  confidenceLevel: ConfidenceLevel,
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
            } | null >,
            nextToken?: string | null,
          } | null,
          score: number,
          selectedAvatarIndex: number,
          createdAt: string,
          updatedAt: string,
          gameSessionTeamsId?: string | null,
          teamQuestionId?: string | null,
          teamQuestionOrder?: number | null,
          teamQuestionGameSessionId?: string | null,
        } | null >,
        nextToken?: string | null,
      } | null,
      currentQuestionIndex?: number | null,
      currentState: GameSessionState,
      gameCode: number,
      isAdvancedMode: boolean,
      imageUrl?: string | null,
      description?: string | null,
      title?: string | null,
      currentTimer?: number | null,
      questions?:  {
        __typename: "ModelQuestionConnection",
        items:  Array< {
          __typename: "Question",
          id: number,
          text: string,
          choices?: string | null,
          imageUrl?: string | null,
          instructions?: string | null,
          standard?: string | null,
          cluster?: string | null,
          domain?: string | null,
          grade?: string | null,
          order: number,
          isHintEnabled: boolean,
          isConfidenceEnabled: boolean,
          gameSessionId: string,
        } | null >,
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
  order: number,
  gameSessionId: string,
};

export type GetQuestionQuery = {
  getQuestion?:  {
    __typename: "Question",
    id: number,
    text: string,
    choices?: string | null,
    imageUrl?: string | null,
    instructions?: string | null,
    standard?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    order: number,
    isHintEnabled: boolean,
    isConfidenceEnabled: boolean,
    gameSessionId: string,
  } | null,
};

export type ListQuestionsQueryVariables = {
  id?: number | null,
  orderGameSessionId?: ModelQuestionPrimaryCompositeKeyConditionInput | null,
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
      choices?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      order: number,
      isHintEnabled: boolean,
      isConfidenceEnabled: boolean,
      gameSessionId: string,
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
    question?:  {
      __typename: "Question",
      id: number,
      text: string,
      choices?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      order: number,
      isHintEnabled: boolean,
      isConfidenceEnabled: boolean,
      gameSessionId: string,
    } | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        answers?:  {
          __typename: "ModelTeamAnswerConnection",
          items:  Array< {
            __typename: "TeamAnswer",
            id: string,
            questionId: number,
            isChosen: boolean,
            text: string,
            isTrickAnswer: boolean,
            confidenceLevel: ConfidenceLevel,
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
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    selectedAvatarIndex: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId?: string | null,
    teamQuestionOrder?: number | null,
    teamQuestionGameSessionId?: string | null,
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
      question?:  {
        __typename: "Question",
        id: number,
        text: string,
        choices?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        order: number,
        isHintEnabled: boolean,
        isConfidenceEnabled: boolean,
        gameSessionId: string,
      } | null,
      teamMembers?:  {
        __typename: "ModelTeamMemberConnection",
        items:  Array< {
          __typename: "TeamMember",
          id: string,
          isFacilitator?: boolean | null,
          answers?:  {
            __typename: "ModelTeamAnswerConnection",
            items:  Array< {
              __typename: "TeamAnswer",
              id: string,
              questionId: number,
              isChosen: boolean,
              text: string,
              isTrickAnswer: boolean,
              confidenceLevel: ConfidenceLevel,
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
        } | null >,
        nextToken?: string | null,
      } | null,
      score: number,
      selectedAvatarIndex: number,
      createdAt: string,
      updatedAt: string,
      gameSessionTeamsId?: string | null,
      teamQuestionId?: string | null,
      teamQuestionOrder?: number | null,
      teamQuestionGameSessionId?: string | null,
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
    isFacilitator?: boolean | null,
    answers?:  {
      __typename: "ModelTeamAnswerConnection",
      items:  Array< {
        __typename: "TeamAnswer",
        id: string,
        questionId: number,
        isChosen: boolean,
        text: string,
        isTrickAnswer: boolean,
        confidenceLevel: ConfidenceLevel,
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
      isFacilitator?: boolean | null,
      answers?:  {
        __typename: "ModelTeamAnswerConnection",
        items:  Array< {
          __typename: "TeamAnswer",
          id: string,
          questionId: number,
          isChosen: boolean,
          text: string,
          isTrickAnswer: boolean,
          confidenceLevel: ConfidenceLevel,
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
    questionId: number,
    isChosen: boolean,
    text: string,
    isTrickAnswer: boolean,
    confidenceLevel: ConfidenceLevel,
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
      questionId: number,
      isChosen: boolean,
      text: string,
      isTrickAnswer: boolean,
      confidenceLevel: ConfidenceLevel,
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
        items:  Array< {
          __typename: "Team",
          id: string,
          name: string,
          question?:  {
            __typename: "Question",
            id: number,
            text: string,
            choices?: string | null,
            imageUrl?: string | null,
            instructions?: string | null,
            standard?: string | null,
            cluster?: string | null,
            domain?: string | null,
            grade?: string | null,
            order: number,
            isHintEnabled: boolean,
            isConfidenceEnabled: boolean,
            gameSessionId: string,
          } | null,
          teamMembers?:  {
            __typename: "ModelTeamMemberConnection",
            items:  Array< {
              __typename: "TeamMember",
              id: string,
              isFacilitator?: boolean | null,
              answers?:  {
                __typename: "ModelTeamAnswerConnection",
                items:  Array< {
                  __typename: "TeamAnswer",
                  id: string,
                  questionId: number,
                  isChosen: boolean,
                  text: string,
                  isTrickAnswer: boolean,
                  confidenceLevel: ConfidenceLevel,
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
            } | null >,
            nextToken?: string | null,
          } | null,
          score: number,
          selectedAvatarIndex: number,
          createdAt: string,
          updatedAt: string,
          gameSessionTeamsId?: string | null,
          teamQuestionId?: string | null,
          teamQuestionOrder?: number | null,
          teamQuestionGameSessionId?: string | null,
        } | null >,
        nextToken?: string | null,
      } | null,
      currentQuestionIndex?: number | null,
      currentState: GameSessionState,
      gameCode: number,
      isAdvancedMode: boolean,
      imageUrl?: string | null,
      description?: string | null,
      title?: string | null,
      currentTimer?: number | null,
      questions?:  {
        __typename: "ModelQuestionConnection",
        items:  Array< {
          __typename: "Question",
          id: number,
          text: string,
          choices?: string | null,
          imageUrl?: string | null,
          instructions?: string | null,
          standard?: string | null,
          cluster?: string | null,
          domain?: string | null,
          grade?: string | null,
          order: number,
          isHintEnabled: boolean,
          isConfidenceEnabled: boolean,
          gameSessionId: string,
        } | null >,
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
        items:  Array< {
          __typename: "Team",
          id: string,
          name: string,
          question?:  {
            __typename: "Question",
            id: number,
            text: string,
            choices?: string | null,
            imageUrl?: string | null,
            instructions?: string | null,
            standard?: string | null,
            cluster?: string | null,
            domain?: string | null,
            grade?: string | null,
            order: number,
            isHintEnabled: boolean,
            isConfidenceEnabled: boolean,
            gameSessionId: string,
          } | null,
          teamMembers?:  {
            __typename: "ModelTeamMemberConnection",
            items:  Array< {
              __typename: "TeamMember",
              id: string,
              isFacilitator?: boolean | null,
              answers?:  {
                __typename: "ModelTeamAnswerConnection",
                items:  Array< {
                  __typename: "TeamAnswer",
                  id: string,
                  questionId: number,
                  isChosen: boolean,
                  text: string,
                  isTrickAnswer: boolean,
                  confidenceLevel: ConfidenceLevel,
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
            } | null >,
            nextToken?: string | null,
          } | null,
          score: number,
          selectedAvatarIndex: number,
          createdAt: string,
          updatedAt: string,
          gameSessionTeamsId?: string | null,
          teamQuestionId?: string | null,
          teamQuestionOrder?: number | null,
          teamQuestionGameSessionId?: string | null,
        } | null >,
        nextToken?: string | null,
      } | null,
      currentQuestionIndex?: number | null,
      currentState: GameSessionState,
      gameCode: number,
      isAdvancedMode: boolean,
      imageUrl?: string | null,
      description?: string | null,
      title?: string | null,
      currentTimer?: number | null,
      questions?:  {
        __typename: "ModelQuestionConnection",
        items:  Array< {
          __typename: "Question",
          id: number,
          text: string,
          choices?: string | null,
          imageUrl?: string | null,
          instructions?: string | null,
          standard?: string | null,
          cluster?: string | null,
          domain?: string | null,
          grade?: string | null,
          order: number,
          isHintEnabled: boolean,
          isConfidenceEnabled: boolean,
          gameSessionId: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnGameSessionUpdatedByIdSubscriptionVariables = {
  id: string,
};

export type OnGameSessionUpdatedByIdSubscription = {
  onGameSessionUpdatedById?:  {
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
        question?:  {
          __typename: "Question",
          id: number,
          text: string,
          choices?: string | null,
          imageUrl?: string | null,
          instructions?: string | null,
          standard?: string | null,
          cluster?: string | null,
          domain?: string | null,
          grade?: string | null,
          order: number,
          isHintEnabled: boolean,
          isConfidenceEnabled: boolean,
          gameSessionId: string,
        } | null,
        teamMembers?:  {
          __typename: "ModelTeamMemberConnection",
          items:  Array< {
            __typename: "TeamMember",
            id: string,
            isFacilitator?: boolean | null,
            answers?:  {
              __typename: "ModelTeamAnswerConnection",
              items:  Array< {
                __typename: "TeamAnswer",
                id: string,
                questionId: number,
                isChosen: boolean,
                text: string,
                isTrickAnswer: boolean,
                confidenceLevel: ConfidenceLevel,
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
          } | null >,
          nextToken?: string | null,
        } | null,
        score: number,
        selectedAvatarIndex: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId?: string | null,
        teamQuestionOrder?: number | null,
        teamQuestionGameSessionId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    currentQuestionIndex?: number | null,
    currentState: GameSessionState,
    gameCode: number,
    isAdvancedMode: boolean,
    imageUrl?: string | null,
    description?: string | null,
    title?: string | null,
    currentTimer?: number | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      items:  Array< {
        __typename: "Question",
        id: number,
        text: string,
        choices?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        order: number,
        isHintEnabled: boolean,
        isConfidenceEnabled: boolean,
        gameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnTeamMemberUpdateByTeamIdSubscriptionVariables = {
  teamTeamMembersId: string,
};

export type OnTeamMemberUpdateByTeamIdSubscription = {
  onTeamMemberUpdateByTeamId?:  {
    __typename: "TeamMember",
    id: string,
    isFacilitator?: boolean | null,
    answers?:  {
      __typename: "ModelTeamAnswerConnection",
      items:  Array< {
        __typename: "TeamAnswer",
        id: string,
        questionId: number,
        isChosen: boolean,
        text: string,
        isTrickAnswer: boolean,
        confidenceLevel: ConfidenceLevel,
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

export type OnTeamCreateByGameSessionIdSubscriptionVariables = {
  gameSessionTeamsId: string,
};

export type OnTeamCreateByGameSessionIdSubscription = {
  onTeamCreateByGameSessionId?:  {
    __typename: "Team",
    id: string,
    name: string,
    question?:  {
      __typename: "Question",
      id: number,
      text: string,
      choices?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      order: number,
      isHintEnabled: boolean,
      isConfidenceEnabled: boolean,
      gameSessionId: string,
    } | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        answers?:  {
          __typename: "ModelTeamAnswerConnection",
          items:  Array< {
            __typename: "TeamAnswer",
            id: string,
            questionId: number,
            isChosen: boolean,
            text: string,
            isTrickAnswer: boolean,
            confidenceLevel: ConfidenceLevel,
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
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    selectedAvatarIndex: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId?: string | null,
    teamQuestionOrder?: number | null,
    teamQuestionGameSessionId?: string | null,
  } | null,
};

export type OnTeamDeleteByGameSessionIdSubscriptionVariables = {
  gameSessionTeamsId: string,
};

export type OnTeamDeleteByGameSessionIdSubscription = {
  onTeamDeleteByGameSessionId?:  {
    __typename: "Team",
    id: string,
    name: string,
    question?:  {
      __typename: "Question",
      id: number,
      text: string,
      choices?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      order: number,
      isHintEnabled: boolean,
      isConfidenceEnabled: boolean,
      gameSessionId: string,
    } | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        answers?:  {
          __typename: "ModelTeamAnswerConnection",
          items:  Array< {
            __typename: "TeamAnswer",
            id: string,
            questionId: number,
            isChosen: boolean,
            text: string,
            isTrickAnswer: boolean,
            confidenceLevel: ConfidenceLevel,
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
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    selectedAvatarIndex: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId?: string | null,
    teamQuestionOrder?: number | null,
    teamQuestionGameSessionId?: string | null,
  } | null,
};

export type OnCreateGameSessionSubscriptionVariables = {
  filter?: ModelSubscriptionGameSessionFilterInput | null,
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
        question?:  {
          __typename: "Question",
          id: number,
          text: string,
          choices?: string | null,
          imageUrl?: string | null,
          instructions?: string | null,
          standard?: string | null,
          cluster?: string | null,
          domain?: string | null,
          grade?: string | null,
          order: number,
          isHintEnabled: boolean,
          isConfidenceEnabled: boolean,
          gameSessionId: string,
        } | null,
        teamMembers?:  {
          __typename: "ModelTeamMemberConnection",
          items:  Array< {
            __typename: "TeamMember",
            id: string,
            isFacilitator?: boolean | null,
            answers?:  {
              __typename: "ModelTeamAnswerConnection",
              items:  Array< {
                __typename: "TeamAnswer",
                id: string,
                questionId: number,
                isChosen: boolean,
                text: string,
                isTrickAnswer: boolean,
                confidenceLevel: ConfidenceLevel,
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
          } | null >,
          nextToken?: string | null,
        } | null,
        score: number,
        selectedAvatarIndex: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId?: string | null,
        teamQuestionOrder?: number | null,
        teamQuestionGameSessionId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    currentQuestionIndex?: number | null,
    currentState: GameSessionState,
    gameCode: number,
    isAdvancedMode: boolean,
    imageUrl?: string | null,
    description?: string | null,
    title?: string | null,
    currentTimer?: number | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      items:  Array< {
        __typename: "Question",
        id: number,
        text: string,
        choices?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        order: number,
        isHintEnabled: boolean,
        isConfidenceEnabled: boolean,
        gameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateGameSessionSubscriptionVariables = {
  filter?: ModelSubscriptionGameSessionFilterInput | null,
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
        question?:  {
          __typename: "Question",
          id: number,
          text: string,
          choices?: string | null,
          imageUrl?: string | null,
          instructions?: string | null,
          standard?: string | null,
          cluster?: string | null,
          domain?: string | null,
          grade?: string | null,
          order: number,
          isHintEnabled: boolean,
          isConfidenceEnabled: boolean,
          gameSessionId: string,
        } | null,
        teamMembers?:  {
          __typename: "ModelTeamMemberConnection",
          items:  Array< {
            __typename: "TeamMember",
            id: string,
            isFacilitator?: boolean | null,
            answers?:  {
              __typename: "ModelTeamAnswerConnection",
              items:  Array< {
                __typename: "TeamAnswer",
                id: string,
                questionId: number,
                isChosen: boolean,
                text: string,
                isTrickAnswer: boolean,
                confidenceLevel: ConfidenceLevel,
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
          } | null >,
          nextToken?: string | null,
        } | null,
        score: number,
        selectedAvatarIndex: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId?: string | null,
        teamQuestionOrder?: number | null,
        teamQuestionGameSessionId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    currentQuestionIndex?: number | null,
    currentState: GameSessionState,
    gameCode: number,
    isAdvancedMode: boolean,
    imageUrl?: string | null,
    description?: string | null,
    title?: string | null,
    currentTimer?: number | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      items:  Array< {
        __typename: "Question",
        id: number,
        text: string,
        choices?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        order: number,
        isHintEnabled: boolean,
        isConfidenceEnabled: boolean,
        gameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteGameSessionSubscriptionVariables = {
  filter?: ModelSubscriptionGameSessionFilterInput | null,
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
        question?:  {
          __typename: "Question",
          id: number,
          text: string,
          choices?: string | null,
          imageUrl?: string | null,
          instructions?: string | null,
          standard?: string | null,
          cluster?: string | null,
          domain?: string | null,
          grade?: string | null,
          order: number,
          isHintEnabled: boolean,
          isConfidenceEnabled: boolean,
          gameSessionId: string,
        } | null,
        teamMembers?:  {
          __typename: "ModelTeamMemberConnection",
          items:  Array< {
            __typename: "TeamMember",
            id: string,
            isFacilitator?: boolean | null,
            answers?:  {
              __typename: "ModelTeamAnswerConnection",
              items:  Array< {
                __typename: "TeamAnswer",
                id: string,
                questionId: number,
                isChosen: boolean,
                text: string,
                isTrickAnswer: boolean,
                confidenceLevel: ConfidenceLevel,
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
          } | null >,
          nextToken?: string | null,
        } | null,
        score: number,
        selectedAvatarIndex: number,
        createdAt: string,
        updatedAt: string,
        gameSessionTeamsId?: string | null,
        teamQuestionId?: string | null,
        teamQuestionOrder?: number | null,
        teamQuestionGameSessionId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    currentQuestionIndex?: number | null,
    currentState: GameSessionState,
    gameCode: number,
    isAdvancedMode: boolean,
    imageUrl?: string | null,
    description?: string | null,
    title?: string | null,
    currentTimer?: number | null,
    questions?:  {
      __typename: "ModelQuestionConnection",
      items:  Array< {
        __typename: "Question",
        id: number,
        text: string,
        choices?: string | null,
        imageUrl?: string | null,
        instructions?: string | null,
        standard?: string | null,
        cluster?: string | null,
        domain?: string | null,
        grade?: string | null,
        order: number,
        isHintEnabled: boolean,
        isConfidenceEnabled: boolean,
        gameSessionId: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTeamSubscriptionVariables = {
  filter?: ModelSubscriptionTeamFilterInput | null,
};

export type OnCreateTeamSubscription = {
  onCreateTeam?:  {
    __typename: "Team",
    id: string,
    name: string,
    question?:  {
      __typename: "Question",
      id: number,
      text: string,
      choices?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      order: number,
      isHintEnabled: boolean,
      isConfidenceEnabled: boolean,
      gameSessionId: string,
    } | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        answers?:  {
          __typename: "ModelTeamAnswerConnection",
          items:  Array< {
            __typename: "TeamAnswer",
            id: string,
            questionId: number,
            isChosen: boolean,
            text: string,
            isTrickAnswer: boolean,
            confidenceLevel: ConfidenceLevel,
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
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    selectedAvatarIndex: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId?: string | null,
    teamQuestionOrder?: number | null,
    teamQuestionGameSessionId?: string | null,
  } | null,
};

export type OnUpdateTeamSubscriptionVariables = {
  filter?: ModelSubscriptionTeamFilterInput | null,
};

export type OnUpdateTeamSubscription = {
  onUpdateTeam?:  {
    __typename: "Team",
    id: string,
    name: string,
    question?:  {
      __typename: "Question",
      id: number,
      text: string,
      choices?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      order: number,
      isHintEnabled: boolean,
      isConfidenceEnabled: boolean,
      gameSessionId: string,
    } | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        answers?:  {
          __typename: "ModelTeamAnswerConnection",
          items:  Array< {
            __typename: "TeamAnswer",
            id: string,
            questionId: number,
            isChosen: boolean,
            text: string,
            isTrickAnswer: boolean,
            confidenceLevel: ConfidenceLevel,
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
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    selectedAvatarIndex: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId?: string | null,
    teamQuestionOrder?: number | null,
    teamQuestionGameSessionId?: string | null,
  } | null,
};

export type OnDeleteTeamSubscriptionVariables = {
  filter?: ModelSubscriptionTeamFilterInput | null,
};

export type OnDeleteTeamSubscription = {
  onDeleteTeam?:  {
    __typename: "Team",
    id: string,
    name: string,
    question?:  {
      __typename: "Question",
      id: number,
      text: string,
      choices?: string | null,
      imageUrl?: string | null,
      instructions?: string | null,
      standard?: string | null,
      cluster?: string | null,
      domain?: string | null,
      grade?: string | null,
      order: number,
      isHintEnabled: boolean,
      isConfidenceEnabled: boolean,
      gameSessionId: string,
    } | null,
    teamMembers?:  {
      __typename: "ModelTeamMemberConnection",
      items:  Array< {
        __typename: "TeamMember",
        id: string,
        isFacilitator?: boolean | null,
        answers?:  {
          __typename: "ModelTeamAnswerConnection",
          items:  Array< {
            __typename: "TeamAnswer",
            id: string,
            questionId: number,
            isChosen: boolean,
            text: string,
            isTrickAnswer: boolean,
            confidenceLevel: ConfidenceLevel,
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
      } | null >,
      nextToken?: string | null,
    } | null,
    score: number,
    selectedAvatarIndex: number,
    createdAt: string,
    updatedAt: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId?: string | null,
    teamQuestionOrder?: number | null,
    teamQuestionGameSessionId?: string | null,
  } | null,
};

export type OnCreateTeamMemberSubscriptionVariables = {
  filter?: ModelSubscriptionTeamMemberFilterInput | null,
};

export type OnCreateTeamMemberSubscription = {
  onCreateTeamMember?:  {
    __typename: "TeamMember",
    id: string,
    isFacilitator?: boolean | null,
    answers?:  {
      __typename: "ModelTeamAnswerConnection",
      items:  Array< {
        __typename: "TeamAnswer",
        id: string,
        questionId: number,
        isChosen: boolean,
        text: string,
        isTrickAnswer: boolean,
        confidenceLevel: ConfidenceLevel,
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

export type OnUpdateTeamMemberSubscriptionVariables = {
  filter?: ModelSubscriptionTeamMemberFilterInput | null,
};

export type OnUpdateTeamMemberSubscription = {
  onUpdateTeamMember?:  {
    __typename: "TeamMember",
    id: string,
    isFacilitator?: boolean | null,
    answers?:  {
      __typename: "ModelTeamAnswerConnection",
      items:  Array< {
        __typename: "TeamAnswer",
        id: string,
        questionId: number,
        isChosen: boolean,
        text: string,
        isTrickAnswer: boolean,
        confidenceLevel: ConfidenceLevel,
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

export type OnDeleteTeamMemberSubscriptionVariables = {
  filter?: ModelSubscriptionTeamMemberFilterInput | null,
};

export type OnDeleteTeamMemberSubscription = {
  onDeleteTeamMember?:  {
    __typename: "TeamMember",
    id: string,
    isFacilitator?: boolean | null,
    answers?:  {
      __typename: "ModelTeamAnswerConnection",
      items:  Array< {
        __typename: "TeamAnswer",
        id: string,
        questionId: number,
        isChosen: boolean,
        text: string,
        isTrickAnswer: boolean,
        confidenceLevel: ConfidenceLevel,
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

export type OnCreateTeamAnswerSubscriptionVariables = {
  filter?: ModelSubscriptionTeamAnswerFilterInput | null,
};

export type OnCreateTeamAnswerSubscription = {
  onCreateTeamAnswer?:  {
    __typename: "TeamAnswer",
    id: string,
    questionId: number,
    isChosen: boolean,
    text: string,
    isTrickAnswer: boolean,
    confidenceLevel: ConfidenceLevel,
    createdAt: string,
    updatedAt: string,
    teamMemberAnswersId?: string | null,
  } | null,
};

export type OnUpdateTeamAnswerSubscriptionVariables = {
  filter?: ModelSubscriptionTeamAnswerFilterInput | null,
};

export type OnUpdateTeamAnswerSubscription = {
  onUpdateTeamAnswer?:  {
    __typename: "TeamAnswer",
    id: string,
    questionId: number,
    isChosen: boolean,
    text: string,
    isTrickAnswer: boolean,
    confidenceLevel: ConfidenceLevel,
    createdAt: string,
    updatedAt: string,
    teamMemberAnswersId?: string | null,
  } | null,
};

export type OnDeleteTeamAnswerSubscriptionVariables = {
  filter?: ModelSubscriptionTeamAnswerFilterInput | null,
};

export type OnDeleteTeamAnswerSubscription = {
  onDeleteTeamAnswer?:  {
    __typename: "TeamAnswer",
    id: string,
    questionId: number,
    isChosen: boolean,
    text: string,
    isTrickAnswer: boolean,
    confidenceLevel: ConfidenceLevel,
    createdAt: string,
    updatedAt: string,
    teamMemberAnswersId?: string | null,
  } | null,
};
