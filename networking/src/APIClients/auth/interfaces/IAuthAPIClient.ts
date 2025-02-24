import {
  SignInOutput,
  ResendSignUpCodeOutput,
  ConfirmSignUpOutput,
  type ResetPasswordOutput,
  AuthSession
} from 'aws-amplify/auth';
import { IUserProfile } from "../../../Models/IUserProfile";

export interface IAuthAPIClient {
  isUserAuth: boolean;
  init(): Promise<void>;
  configAmplify(awsconfig: any): void;
  verifyAuth(): Promise<boolean>;
  verifyGameOwner(gameOwner: string): Promise<boolean>;
  verifyQuestionOwner(questionOwner: string): Promise<boolean>;
  getCurrentUserName(): Promise<string>;
  getCurrentSession(): Promise<AuthSession>;
  getUserNickname(): Promise<string | null>;
  authEvents(payload: any): void;
  authListener(): void;
  awsUserCleaner(userProfile: IUserProfile): Promise<void>;
  awsSignUp(username: string, email: string, password: string): void;
  awsConfirmSignUp(email: string, code: string): Promise<ConfirmSignUpOutput>;
  awsSignIn(email: string, password: string): Promise<SignInOutput>;
  awsSignInFederated(): void;
  awsSignOut(): void;
  awsResetPassword (username: string): Promise<ResetPasswordOutput>
  awsResendConfirmationCode(email: string): Promise<ResendSignUpCodeOutput>;
  awsUploadImagePublic<String>( 
    teacherIdImage: File,
  ): Promise<String>;
  awsUploadImagePrivate<String>( 
    teacherIdImage: File,
  ): Promise<String>;
  awsDownloadImagePublic(): Promise<string>;
  awsDownloadImagePrivate(): Promise<string>;
}