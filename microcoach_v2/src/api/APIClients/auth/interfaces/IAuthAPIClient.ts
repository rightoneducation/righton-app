import {
  SignInOutput,
  ResendSignUpCodeOutput,
  ConfirmSignUpOutput,
  type ResetPasswordOutput,
  AuthSession,
  ConfirmResetPasswordInput,
} from 'aws-amplify/auth';

// GraphQLAuthMode isn't exposed in Amplify, so we define it ourselves.
export type GraphQLAuthMode =
  | 'apiKey'
  | 'oidc'
  | 'userPool'
  | 'iam'
  | 'identityPool'
  | 'lambda'
  | 'none';

// Pure-Cognito auth surface for MicroCoach v2. Mirrors central_v2's
// networking AuthAPIClient, trimmed to what MicroCoach needs (no game/question
// ownership checks, no Teacher-ID S3 image uploads, no userCleaner).
export interface IAuthAPIClient {
  isUserAuth: boolean;
  verifyAuth(): Promise<boolean>;
  getCurrentUserName(): Promise<string>;
  getFirstAndLastName(): Promise<{ firstName: string; lastName: string }>;
  getCurrentSession(): Promise<AuthSession>;
  updateCognitoUsername(newUsername: string): Promise<void>;
  getUserNickname(): Promise<string | null>;
  getUserEmail(): Promise<string | null>;
  awsSignUp(username: string, email: string, password: string): Promise<void>;
  awsConfirmSignUp(email: string, code: string): Promise<ConfirmSignUpOutput>;
  awsSignIn(email: string, password: string): Promise<SignInOutput>;
  awsSignInFederated(): Promise<void>;
  awsResetPassword(username: string): Promise<ResetPasswordOutput>;
  awsConfirmResetPassword(input: ConfirmResetPasswordInput): Promise<void>;
  awsSignOut(): Promise<void>;
  awsResendConfirmationCode(email: string): Promise<ResendSignUpCodeOutput>;
}
