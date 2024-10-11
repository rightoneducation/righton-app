
export interface IAuthAPIClient {
  isUserAuth: boolean;
  init(): Promise<void>;
  configAmplify(awsconfig: any): void;
  authEvents(payload: any): void;
  authListener(): void;
  awsSignUp(username: string, email: string, password: string): void;
  awsConfirmSignUp(email: string, code: string): void;
  awsSignIn(email: string, password: string): void;
  awsSignInFederated(): void;
  awsSignOut(): void;
  verifyAuth(): Promise<boolean>;
  verifyGameOwner(gameOwner: string): Promise<boolean>;
  verifyQuestionOwner(questionOwner: string): Promise<boolean>;
  getCurrentUserName(): Promise<string>;
}