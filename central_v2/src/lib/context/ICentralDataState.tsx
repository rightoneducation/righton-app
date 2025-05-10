import {
  IGameTemplate,
  PublicPrivateType,
  SortDirection,
  SortType,
  GradeTarget,
  IUserProfile,
  IQuestionTemplate,
} from '@righton/networking';
import { ISelectedGame, ISelectedQuestion, UserStatusType } from '../CentralModels';

export interface ICentralDataState {
  userProfile: IUserProfile;
  userStatus: UserStatusType;
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
  isFavTabOpen: boolean;
  publicPrivate: PublicPrivateType;
  sort: {
    field: SortType;
    direction: SortDirection | null;
  }
}