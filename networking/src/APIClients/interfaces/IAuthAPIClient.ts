
export interface IAuthAPIClient {
  configAmplify(awsconfig: any): void;
  handleGoogleSignIn(googleCredential: string): Promise<Boolean>;
}