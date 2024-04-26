
export interface IAuthAPIClient {
  isUserAuth: boolean;
  configAmplify(awsconfig: any): void;
  authEvents(payload: any): void;
  authListener(): void;
  awsSignUp(email: string, password: string): void;
  awsConfirmSignUp(email: string, code: string): void;
  awsSignIn(email: string, password: string): void;
  awsSignInFederated(): void;
  awsSignOut(): void;
}