import { CentralQuestionTemplateInput, IGameTemplate, IQuestionTemplate, IncorrectCard } from "@righton/networking";

export enum UserStatusType {
  LOGGEDIN,
  LOGGEDOUT,
  INCOMPLETE,
  LOADING,
  GOOGLE_SIGNIN,
  GOOGLE_SIGNUP,
}

export enum ScreenType {
  GAMES,
  QUESTIONS,
  LIBRARY,
  LOGIN,
  SIGNUP, 
  CREATEGAME,
  CLONEGAME,
  VIEWGAME,
  CREATEQUESTION,
  CLONEQUESTION,
  CONFIRMATION,
  NEXTSTEP,
  USERPROFILE,
  AUTH
}

export enum ScreenSize {
  SMALL,
  MEDIUM,
  LARGE,
}

export enum CardType {
  CORRECT,
  INCORRECT,
}

export enum AnswerSettingsDropdownType {
  TYPE,
  PRECISION
}

export enum BorderStyle {
  DASHED_BORDER = 'dashedBorder',
  SOLID_BORDER = 'solid',
  CORNER_BORDER = 'corner',
  SVG = 'svg',
}

export enum GameQuestionType {
  GAME,
  QUESTION
}

// enum to track the highlight card in the create question flow
export enum CreateQuestionHighlightCard {
  QUESTIONCARD = 'questionCard',
  CORRECTANSWER = 'correctAnswer',
  INCORRECTANSWER1 = 'card-1',
  INCORRECTANSWER2 = 'card-2',
  INCORRECTANSWER3 = 'card-3',
}

// enum to determine between game templates and question templates for generic components like modals
export enum TemplateType {
  GAME,
  QUESTION
}

// key for storage to localStorage  
export const StorageKey = 'rightOnCentral';

// type that shapes retreived storage for createQuestion 
export type CreateQuestionLocalData = {
  draftQuestion?: CentralQuestionTemplateInput | null,
  incompleteCards?: IncorrectCard[] | null,
  completeCards?: IncorrectCard[] | null
}

// type that shapes retrieved storage for gameCreation
export type CreateGameLocalData = {
  gameTemplate: IGameTemplate | null;
}

export interface ISelectedQuestion {
  question: IQuestionTemplate | null;
  profilePic: string;
  createdName: string;
  lastModified: Date;
  numUsed: number;
}

export interface ISelectedGame {
  game: IGameTemplate | null;
  profilePic: string;
  createdName: string;
  lastModified: Date;
  numUsed: number;
}


export enum FetchType {
  EXPLORE_GAMES,
  EXPLORE_QUESTIONS,
  PUBLIC_GAMES,
  PUBLIC_QUESTIONS,
  PRIVATE_GAMES,
  PRIVATE_QUESTIONS,
  DRAFT_GAMES,
  DRAFT_QUESTIONS,
  FAVORITE_GAMES,
  FAVORITE_QUESTIONS
}

export enum LibraryTabEnum {
  PUBLIC,
  PRIVATE,
  DRAFTS,
  FAVORITES
}
