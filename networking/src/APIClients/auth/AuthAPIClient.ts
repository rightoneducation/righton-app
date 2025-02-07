import { Amplify  } from "aws-amplify";
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
  type ResetPasswordOutput
} from 'aws-amplify/auth';
import amplifyconfig from "../../amplifyconfiguration.json";
import { IAuthAPIClient } from './interfaces/IAuthAPIClient';
import { fetchUserAttributes } from 'aws-amplify/auth';

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
      this.authEvents(payload);
      }
    );
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
  

  async awsConfirmSignUp(email: string, code: string): Promise<void> {
    await confirmSignUp({username: email, confirmationCode: code});
  }

  async awsSignIn(username: string, password: string): Promise<SignInOutput> {
    const session = await fetchAuthSession();
    console.log(session);
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

  async verifyAuth(): Promise<boolean> {
    const session = await fetchAuthSession();
    console.log(session);
    if (session && session.tokens && session.tokens.accessToken) {
      const groups = session.tokens.accessToken.payload["cognito:groups"];
      if (Array.isArray(groups) && groups.includes('Teacher_Auth')) {
        return true;
      }
    };
    return false;
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
}