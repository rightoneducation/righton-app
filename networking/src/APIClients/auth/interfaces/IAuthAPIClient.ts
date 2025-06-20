import {
  SignInOutput,
  ResendSignUpCodeOutput,
  ConfirmSignUpOutput,
  type ResetPasswordOutput,
  AuthSession,
  ConfirmResetPasswordInput,
} from 'aws-amplify/auth';
import { IUserProfile } from "../../../Models/IUserProfile";

// GraphQLAuthMode isn't exposed in Amplify, so we need to define it ourselves
export type GraphQLAuthMode =
  | 'apiKey'
  | 'oidc'
  | 'userPool'
  | 'iam'
  | 'identityPool'
  | 'lambda'
  | 'none';

export interface IAuthAPIClient {
  isUserAuth: boolean;
  verifyAuth(): Promise<boolean>;
  verifyGameOwner(gameOwner: string): Promise<boolean>;
  verifyQuestionOwner(questionOwner: string): Promise<boolean>;
  getCurrentUserName(): Promise<string>;
  getFirstAndLastName(): Promise<{firstName: string, lastName: string}>;
  getCurrentSession(): Promise<AuthSession>;
  updateCognitoUsername(newUsername: string): Promise<void>;
  getUserNickname(): Promise<string | null>;
  awsUserCleaner(userProfile: IUserProfile, authOverride?: GraphQLAuthMode): Promise<void>;
  awsSignUp(username: string, email: string, password: string): void;
  awsConfirmSignUp(email: string, code: string): Promise<ConfirmSignUpOutput>;
  awsSignIn(email: string, password: string): Promise<SignInOutput>;
  awsSignInFederated(): void;
  awsSignOut(): Promise<void>;
  awsResetPassword (username: string): Promise<ResetPasswordOutput>;
  awsConfirmResetPassword(input: ConfirmResetPasswordInput): Promise<void>;
  awsResendConfirmationCode(email: string): Promise<ResendSignUpCodeOutput>;
  awsUploadImagePublic<String>( 
    teacherIdImage: File,
  ): Promise<String>;
  awsUploadImagePrivate<String>( 
    teacherIdImage: File,
  ): Promise<String>;
  awsDownloadImagePublic(): Promise<string>;
  awsDownloadImagePrivate(): Promise<string>;
  getUserEmail(): Promise<string | null>;
}