import { IAuthAPIClient } from './interfaces/IAuthAPIClient';
// import { client } from '../BaseAPIClient';
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
    console.log(user);
    const currentUser = true;
    // await client.federatedSignIn(
    //   'google',
    //   { token: googleCredential, expires_at: token.exp },
    //   user
    // );
    // const currentUser = await client.currentAuthenticatedUser();
    // console.log(currentUser);
    if (currentUser)
      return true;
    return false;
  }
}