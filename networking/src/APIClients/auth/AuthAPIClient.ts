import { IAuthAPIClient } from './interfaces/IAuthAPIClient';
import { Amplify } from "aws-amplify";
import { Hub } from 'aws-amplify/utils';
import { signUp, confirmSignUp, signIn, signInWithRedirect, signOut } from 'aws-amplify/auth';
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
  configAmplify(awsconfig: any) {
    Amplify.configure(awsconfig);
  }

  authEvents (payload: any) {
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

  async awsConfirmSignUp(email: string, code: string) {
    await confirmSignUp({username: email, confirmationCode: code});
  }

  async awsSignIn(email: string, password: string) {
    await signIn({username: email, password: password});
  }

  async awsSignInFederated () {
    await signInWithRedirect(
      {provider: 'Google'}
    );
  }

  async awsSignOut() {
    await signOut();
  }
}