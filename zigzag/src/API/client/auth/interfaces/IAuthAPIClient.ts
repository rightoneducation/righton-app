// // GraphQLAuthMode isn't exposed in Amplify, so we need to define it ourselves
// export type GraphQLAuthMode =
//   | 'apiKey'
//   | 'oidc'
//   | 'userPool'
//   | 'iam'
//   | 'identityPool'
//   | 'lambda'
//   | 'none';


// export interface IAuthAPIClient {
//   isUserAuth: boolean;
//   verifyAuth(): Promise<boolean>;
//   getCurrentUserName(): Promise<string>;
//   getFirstAndLastName(): Promise<{firstName: string, lastName: string}>;
//   getCurrentSession(): Promise<AuthSession>;
//   updateCognitoUsername(newUsername: string): Promise<void>;
//   getUserNickname(): Promise<string | null>;
//   awsUserCleaner(userProfile: IUserProfile, authOverride?: GraphQLAuthMode): Promise<void>;
//   awsSignUp(username: string, email: string, password: string): void;
//   awsConfirmSignUp(email: string, code: string): Promise<ConfirmSignUpOutput>;
//   awsSignIn(email: string, password: string): Promise<SignInOutput>;
//   awsSignInFederated(): void;
//   awsSignOut(): Promise<void>;
//   awsResetPassword (username: string): Promise<ResetPasswordOutput>;
//   awsConfirmResetPassword(input: ConfirmResetPasswordInput): Promise<void>;
//   awsResendConfirmationCode(email: string): Promise<ResendSignUpCodeOutput>;
//   getUserEmail(): Promise<string | null>;
// }