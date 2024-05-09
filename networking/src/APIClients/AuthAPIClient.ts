import { IAuthAPIClient } from './interfaces/IAuthAPIClient';
import { Auth } from "aws-amplify";
import { jwtDecode } from 'jwt-decode';   
import awsconfig from "../aws-exports";

export class AuthAPIClient
  implements IAuthAPIClient
{
  constructor () {
    this.configAmplify(awsconfig);
  }
  async handleGoogleSignIn(googleCredential: string): Promise<Boolean> {
    const token = jwtDecode(googleCredential) as any;
    const user = {
      email: token.email,
      name: token.name
    };
    await Auth.federatedSignIn(
      'google',
      { token: googleCredential, expires_at: token.exp },
      user
    );
    const currentUser = await Auth.currentAuthenticatedUser();
    console.log(currentUser);
    if (currentUser)
      return true;
    return false;
  }

  configAmplify(awsconfig: any) {
    Auth.configure(awsconfig);
  }
}