import { 
  CentralQuestionTemplateInput, 
  IGameTemplate, 
  IQuestionTemplate, 
  IncorrectCard, 
  PublicPrivateType, 
  SortDirection, 
  SortType, 
  GradeTarget, 
  IUserProfile 
} from "@righton/networking";

export enum UserStatusType {
  LOGGEDIN,
  LOGGEDOUT,
  INCOMPLETE,
  LOADING,
  GOOGLE_SIGNIN,
  GOOGLE_SIGNUP,
  GOOGLE_ERROR,
  NONVERIFIED,
}

export enum ScreenType {
  GAMES,
  QUESTIONS,
  LIBRARY,
  LOGIN,
  SIGNUP, 
  CREATEGAME,
  CLONEGAME,
  EDITGAME,
  VIEWGAME,
  CREATEQUESTION,
  CLONEQUESTION,
  EDITQUESTION,
  CONFIRMATION,
  NEXTSTEP,
  USERPROFILE,
  AUTH,
  PASSWORDRESET
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
  QUESTION,
}

export type CallType = {
  gameQuestionType: GameQuestionType;
  publicPrivateType: PublicPrivateType;
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
  timesPlayed: number;
}

export interface ISelectedGame {
  game: IGameTemplate | null;
  profilePic: string;
  createdName: string;
  lastModified: Date;
  timesPlayed: number;
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

export const userProfileInit = {
    title: 'Title...',
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    gamesUsed: 0,
}

// initialize centralDataState
export const initCentralDataState: ICentralDataState = {
  userProfile: userProfileInit,
  userStatus: UserStatusType.LOADING,
  userErrorString: '',
  recommendedGames: [],
  mostPopularGames: [],
  searchedGames: [],
  publicGames: [],
  privateGames: [],
  draftGames: [],
  favGames: [],
  selectedGame: {
    game: null,
    profilePic: '',
    createdName: '',
    lastModified: new Date(),
    timesPlayed: 0
  },
  recommendedQuestions: [],
  mostPopularQuestions: [],
  searchedQuestions: [],
  publicQuestions: [],
  privateQuestions: [],
  draftQuestions: [],
  favQuestions: [],
  selectedQuestion: {
    question: null,
    profilePic: '',
    createdName: '',
    lastModified: new Date(),
    timesPlayed: 0
  },
  nextToken: null,
  isLoading: false,
  isLoadingInfiniteScroll: false,
  searchTerms: '',
  selectedGrades: [],
  isLibraryInit: true,
  isTabsOpen: false,
  openTab: LibraryTabEnum.PUBLIC,
  isFavTabOpen: false,
  publicPrivate: PublicPrivateType.PUBLIC,
  sort: {
    field: SortType.listGameTemplates,
    direction: SortDirection.ASC,
  }
}


export interface ICentralDataState {
  userProfile: IUserProfile;
  userStatus: UserStatusType;
  userErrorString: string;
  recommendedGames: IGameTemplate[];
  mostPopularGames: IGameTemplate[];
  searchedGames: IGameTemplate[];
  publicGames: IGameTemplate[];
  privateGames: IGameTemplate[];
  draftGames: IGameTemplate[];
  favGames: IGameTemplate[];
  selectedGame: ISelectedGame | null; // this is state that holds a game that has been selected from any of the above lists
  recommendedQuestions: IQuestionTemplate[];
  mostPopularQuestions: IQuestionTemplate[];
  publicQuestions: IQuestionTemplate[];
  privateQuestions: IQuestionTemplate[];
  searchedQuestions: IQuestionTemplate[];
  draftQuestions: IQuestionTemplate[];
  favQuestions: IQuestionTemplate[];
  selectedQuestion: ISelectedQuestion | null; // this is state that holds a question that has been selected from any of the above lists
  nextToken: string | null;
  isLoading: boolean;
  isLoadingInfiniteScroll: boolean;
  searchTerms: string;
  selectedGrades: GradeTarget[];
  isLibraryInit: boolean;
  isTabsOpen: boolean;
  openTab: LibraryTabEnum;
  isFavTabOpen: boolean;
  publicPrivate: PublicPrivateType;
  sort: {
    field: SortType;
    direction: SortDirection | null;
  }
}