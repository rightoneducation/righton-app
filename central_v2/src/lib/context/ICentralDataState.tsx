import {
  IGameTemplate,
  PublicPrivateType,
  SortDirection,
  SortType,
  GradeTarget,
  IUserProfile,
  IQuestionTemplate,
} from '@righton/networking';
import { UserStatusType } from '../CentralModels';

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
  recommendedQuestions: IQuestionTemplate[];
  mostPopularQuestions: IQuestionTemplate[];
  publicQuestions: IQuestionTemplate[];
  privateQuestions: IQuestionTemplate[];
  searchedQuestions: IQuestionTemplate[];
  draftQuestions: IQuestionTemplate[];
  favQuestions: IQuestionTemplate[];
  nextToken: string | null;
  isLoading: boolean;
  isLoadingInfiniteScroll: boolean;
  searchTerms: string;
  selectedGrades: GradeTarget[];
  isTabsOpen: boolean;
  isFavTabOpen: boolean;
  publicPrivate: PublicPrivateType;
  sort: {
    field: SortType;
    direction: SortDirection | null;
  }
}