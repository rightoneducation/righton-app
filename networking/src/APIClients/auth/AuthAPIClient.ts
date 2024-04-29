import { IAuthAPIClient } from './interfaces/IAuthAPIClient';
import { Amplify } from "aws-amplify";
import { Hub } from 'aws-amplify/utils';
import { 
  signUp, 
  confirmSignUp, 
  signIn, 
  signInWithRedirect, 
  signOut, 
  fetchAuthSession 
} from 'aws-amplify/auth';
import awsconfig from "../../aws-exports";

export class AuthAPIClient
  implements IAuthAPIClient
{
  isUserAuth: boolean;
  constructor(){
    this.isUserAuth = false;
    this.configAmplify(awsconfig);
    this.authEvents(null);
    this.authListener();
  }
  configAmplify(awsconfig: any): void {
    Amplify.configure(awsconfig);
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
    if (session && session.tokens && session.tokens.accessToken) {
      const groups = session.tokens.accessToken.payload["cognito:groups"];
      if (Array.isArray(groups) && groups.includes('Teacher_Auth')) {
        return true;
      }
    };
    return false;
  }
}