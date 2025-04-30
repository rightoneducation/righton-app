import { IGameTemplate, IQuestionTemplate} from "../../../Models";
import { IUserProfile } from "../../../Models/IUserProfile";
import { PublicPrivateType, SortDirection, SortType, GradeTarget } from "../../BaseAPIClient";

export interface ICentralDataManagerAPIClient {
  initGames: () => Promise<{ nextToken: string | null, games: IGameTemplate[] }>;
  initQuestions: () => Promise<{ nextToken: string | null, questions: IQuestionTemplate[] }>;
  searchForGameTemplates: (
    type: PublicPrivateType, 
    limit: number | null, 
    nextToken: string | null, 
    search: string, 
    sortDirection: SortDirection, 
    sortType: SortType, 
    gradeTargets: GradeTarget[],
    favIds: string[] | null
  ) => Promise<{ nextToken: string | null, games: IGameTemplate[] }>;
  searchForQuestionTemplates: (
    type: PublicPrivateType, 
    limit: number | null, 
    nextToken: string | null, 
    search: string, 
    sortDirection: SortDirection, 
    sortType: SortType, 
    gradeTargets: GradeTarget[],
    favIds: string[] | null
  ) => Promise<{ nextToken: string | null, questions: IQuestionTemplate[] }>;
  refreshLocalUserProfile: () => Promise<IUserProfile | null>;
  getLocalUserProfile: () => IUserProfile | null;
  setLocalUserProfile: (userProfile: IUserProfile) => void;
  clearLocalUserProfile: () => void;
  loginUserAndRetrieveUserProfile: (username: string, password: string) => Promise<IUserProfile | null>;
  favoriteGameTemplate: (gameId: string, user: IUserProfile) => Promise<IUserProfile | null>;
  favoriteQuestionTemplate: (questionId: string, isFavourite: boolean) => Promise<void>;
  signUpSendConfirmationCode(user: IUserProfile): Promise<void>;
  signUpConfirmAndBuildBackendUser(user: IUserProfile, confirmationCode: string, frontImage: File, backImage: File): Promise<{ updatedUser: any; images: any[] }>;
  signOut: () => void;
  signUpGoogleBuildBackendUser(user: IUserProfile, frontImage: File, backImage: File): Promise<{ updatedUser: any; images: any[] }>;
  userProfileImageUpdate(user: IUserProfile, newProfilePic: File | null, frontImage: File | string,
    backImage: File | string): Promise<{updatedUser: any}>;
}