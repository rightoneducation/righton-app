import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { Hub, CookieStorage  } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { 
  signUp, 
  confirmSignUp, 
  signIn, 
  signInWithRedirect, 
  signOut, 
  fetchAuthSession,
  getCurrentUser,
  resetPassword, 
  SignInOutput,
  resendSignUpCode,
  type ResetPasswordOutput,
  ResendSignUpCodeOutput,
  ConfirmSignUpOutput
} from 'aws-amplify/auth';
import amplifyconfig from "../../amplifyconfiguration.json";
import { IAuthAPIClient } from './interfaces/IAuthAPIClient';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { userCleaner } from '../../graphql';

export class AuthAPIClient
  implements IAuthAPIClient
{
  isUserAuth: boolean;

  constructor(){
    this.isUserAuth = false;
    this.configAmplify(amplifyconfig);
    this.authListener();
  }
  async init(): Promise<void> {
    this.authEvents(null); 
    this.isUserAuth = await this.verifyAuth();
    if (this.isUserAuth) {
       console.log("User is authenticated on page load.");
    }
 }

  configAmplify(awsconfig: any): void {
    Amplify.configure(awsconfig);
    // change userPools auth storage to cookies so that auth persists across central/host apps for signed-in teachers
    cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());
  }

  authEvents (payload: any): void {
    if (!payload) {
      this.isUserAuth = false;
      return;
    }
    switch (payload.event) {
      case 'signedIn':
      case 'signInWithRedirect':
        this.isUserAuth = true;
        break;
      default:
        this.isUserAuth = false;
        break;
    }
  }

  authListener() {
    Hub.listen('auth', ({ payload }) => {
      console.log('auth event detected')
      this.authEvents(payload);
      }
    );
  }

  async awsCleanUser(input: string): Promise<void> {
    const authMode = this.isUserAuth ? "userPool" : "iam"
    const variables = { input }
    const client = generateClient({});
    const response = client.graphql({query: userCleaner, variables, authMode: authMode });
    console.log(response);
  }

  async awsSignUp(username: string, email: string, password: string) {
    await signUp({
      username: email,
      password: password,
      options: {
        userAttributes: {
          nickname: username,
          email: email,
        },
      }
    });
  }

  async getUserNickname(): Promise<string | null> {
    try {
      const attributes = await fetchUserAttributes();
      console.log("User Attributes:", attributes);
      if (attributes && attributes.nickname !== undefined) {
        return attributes.nickname;
      } else {
        return null; // Ensure undefined is converted to null
      }
    } catch (error) {
      console.error("Error fetching user attributes:", error);
      return null;
    }
  }
  

  async awsConfirmSignUp(email: string, code: string): Promise<ConfirmSignUpOutput> {
    const response = await confirmSignUp({username: email, confirmationCode: code});
    return response;
  }

  async awsSignIn(username: string, password: string): Promise<SignInOutput> {
    let user;
    try{
      user = await signIn({username: username, password: password}); 
    } catch (e: any) {
      throw new Error (e);
    }
    return user;
  }

  async awsSignInFederated (): Promise<void> {
    await signInWithRedirect(
      {provider: 'Google'}
    );
  }

  async awsResetPassword (username: string): Promise<ResetPasswordOutput> {
    const output = await resetPassword({ username });
    return output
  }

  async awsSignOut(): Promise<void> {
    await signOut();
  }

  // async verifyAuth(): Promise<boolean> {
  //   const session = await fetchAuthSession();
  //   if (session && session.tokens && session.tokens.accessToken) {
  //     const groups = session.tokens.accessToken.payload["cognito:groups"];
  //     if (Array.isArray(groups) && groups.includes('Teacher_Auth')) {
  //       return true;
  //     }
  //   };
  //   return false;
  // }

  async verifyAuth(): Promise<boolean> {
    try {
       const session = await fetchAuthSession();
       return !!session?.tokens?.accessToken; // If accessToken exists, user is authenticated
    } catch (error) {
       console.error("Error verifying auth:", error);
       return false;
    }
  }

   async verifyGameOwner(gameOwner: string): Promise<boolean> {
    const { username } = await getCurrentUser();
    if (username === gameOwner)
      return true;
    return false;
   }

   async verifyQuestionOwner(questionOwner: string): Promise<boolean> {
    const { username } = await getCurrentUser();
    if (username === questionOwner)
      return true;
    return false;
   }

   async getCurrentUserName(): Promise<string>{
    const { username } = await getCurrentUser();
    return username
   }

   async resendConfirmationCode(email: string): Promise<ResendSignUpCodeOutput> {
    const response = await resendSignUpCode({username: email});
    return response;
   }
}