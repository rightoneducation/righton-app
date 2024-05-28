
export interface IAuthAPIClient {
  isUserAuth: boolean;
  init(): Promise<void>;
  configAmplify(awsconfig: any): void;
  authEvents(payload: any): void;
  authListener(): void;
  awsSignUp(email: string, password: string): void;
  awsConfirmSignUp(email: string, code: string): void;
  awsSignIn(email: string, password: string): void;
  awsSignInFederated(): void;
  awsSignOut(): void;
  verifyAuth(): Promise<boolean>;
}