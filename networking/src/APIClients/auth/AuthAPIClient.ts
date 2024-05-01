import { Amplify } from "aws-amplify";
import { Hub, CookieStorage  } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { 
  signUp, 
  confirmSignUp, 
  signIn, 
  signInWithRedirect, 
  signOut, 
  fetchAuthSession,
  fetchUserAttributes
} from 'aws-amplify/auth';
import amplifyconfig from "../../amplifyconfiguration.json";
import { IAuthAPIClient } from './interfaces/IAuthAPIClient';

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
    console.log(this.isUserAuth);
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

  async awsSignUp(email: string, password: string) {
    await signUp({
      username: email,
      password: password,
      options: {
        userAttributes: {
          email
        },
      }
    });
  }

  async awsConfirmSignUp(email: string, code: string): Promise<void> {
    await confirmSignUp({username: email, confirmationCode: code});
  }

  async awsSignIn(email: string, password: string): Promise<void> {
    await signIn({username: email, password: password});
  }

  async awsSignInFederated (): Promise<void> {
    await signInWithRedirect(
      {provider: 'Google'}
    );
  }

  async awsSignOut(): Promise<void> {
    await signOut();
  }

  async verifyAuth(): Promise<boolean> {
    const session = await fetchAuthSession();
    console.log("session");
    console.log(session);
    console.log("user attributes");
    try{
    console.log(await fetchUserAttributes());
    } catch (e) {
      console.log(e);
    }
    // const user = await getCurrentUser();
    // console.log("user");
    // console.log(user);
    if (session && session.tokens && session.tokens.accessToken) {
      const groups = session.tokens.accessToken.payload["cognito:groups"];
      if (Array.isArray(groups) && groups.includes('Teacher_Auth')) {
        return true;
      }
    };
    return false;
  }
}