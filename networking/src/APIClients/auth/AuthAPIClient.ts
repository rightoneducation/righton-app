import { IAuthAPIClient } from './interfaces/IAuthAPIClient';
import { Auth } from "aws-amplify";
import { jwtDecode } from 'jwt-decode';   

export class AuthAPIClient
  implements IAuthAPIClient
{
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
}