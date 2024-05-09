
export interface IAuthAPIClient {
  handleGoogleSignIn(googleCredential: string): Promise<Boolean>;
}