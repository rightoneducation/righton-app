import { IGameTemplate, IQuestionTemplate} from "../../../Models";
import { IUserProfile } from "../../../Models/IUserProfile";
import { TemplateType, SortDirection, SortType, GradeTarget } from "../../BaseAPIClient";

export interface ICentralDataManagerAPIClient {
  initGames: () => Promise<{ nextToken: string | null, games: IGameTemplate[] }>;
  initQuestions: () => Promise<{ nextToken: string | null, questions: IQuestionTemplate[] }>;
  searchForGameTemplates: (
    type: TemplateType, 
    limit: number | null, 
    nextToken: string | null, 
    search: string, 
    sortDirection: SortDirection, 
    sortType: SortType, 
    gradeTargets: GradeTarget[],
    favIds: string[] | null,
    isLibrary?: boolean,
    userId?: string
  ) => Promise<{ nextToken: string | null, games: IGameTemplate[] }>;
  searchForQuestionTemplates: (
    type: TemplateType, 
    limit: number | null, 
    nextToken: string | null, 
    search: string, 
    sortDirection: SortDirection, 
    sortType: SortType, 
    gradeTargets: GradeTarget[],
    favIds: string[] | null,
    isLibrary?: boolean,
    userId?: string
  ) => Promise<{ nextToken: string | null, questions: IQuestionTemplate[] }>;
  refreshLocalUserProfile: () => Promise<IUserProfile | null>;
  getLocalUserProfile: () => IUserProfile | null;
  setLocalUserProfile: (userProfile: IUserProfile) => void;
  clearLocalUserProfile: () => void;
  getUser: (cognitoId: string) => Promise<IUserProfile | null>;
  loginUserAndRetrieveUserProfile: (username: string, password: string) => Promise<IUserProfile | null>;
  favoriteGameTemplate: (gameId: string, user: IUserProfile) => Promise<IUserProfile | null>;
  favoriteQuestionTemplate: (questionId: string, user: IUserProfile) => Promise<IUserProfile | null>;
  signUpSendConfirmationCode(user: IUserProfile): Promise<void>;
  signUpConfirmAndBuildBackendUser(user: IUserProfile, confirmationCode: string, frontImage: File, backImage: File): Promise<{ updatedUser: any; images: any[] }>;
  signOut: () => Promise<void>;
  signUpGoogleBuildBackendUser(user: IUserProfile, frontImage: File, backImage: File): Promise<{ updatedUser: any; images: any[] }>;
  userProfileInformationUpdate(user: IUserProfile, oldUser: IUserProfile, frontImage?: File | null,
    backImage?: File | null): Promise<{updatedUser: any}>;
  userProfileImageUpdate(user: IUserProfile, newProfilePic: File | null): Promise<{updatedUser: any}>;
  removeQuestionTemplateFromGameTemplate(type: TemplateType, questionId: string, gameId: string): Promise<boolean>;
  deleteQuestionTemplate:(type: TemplateType, questionId: string, ) => void;
}