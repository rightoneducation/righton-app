import { generateClient } from "aws-amplify/api";
import { 
  signUp, 
  confirmSignUp, 
  signIn, 
  signInWithRedirect, 
  signOut as amplifySignOut, 
  fetchAuthSession,
  getCurrentUser,
  resetPassword, 
  SignInOutput,
  resendSignUpCode,
  confirmResetPassword,
  type ResetPasswordOutput,
  ResendSignUpCodeOutput,
  ConfirmSignUpOutput,
  AuthSession,
  decodeJWT,
  updateUserAttributes,
  ConfirmResetPasswordInput
} from 'aws-amplify/auth';
import { uploadData, downloadData } from 'aws-amplify/storage';
import { IAuthAPIClient } from './interfaces/IAuthAPIClient';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { userCleaner } from "../../graphql";
import { IUserProfile } from "../../Models/IUserProfile";
import { GraphQLAuthMode } from './interfaces/IAuthAPIClient';

export class AuthAPIClient
  implements IAuthAPIClient
{
  isUserAuth: boolean;

  constructor(){
    this.isUserAuth = false;
  }

  async verifyAuth(): Promise<boolean> {
    const session = await fetchAuthSession();
    if (session && session.tokens && session.tokens.accessToken) {
        return true;
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

  async getFirstAndLastName(): Promise<{firstName: string, lastName: string}> {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    let firstName = '';
    let lastName = '';
    if (!idToken) throw new Error('No ID token in session');
    const { payload } = decodeJWT(String(idToken));
    if (payload && payload.given_name && payload.family_name) {
      firstName = String(payload.given_name);
      lastName = String(payload.family_name);
    }
    return {firstName, lastName};
  }

  async getCurrentSession(): Promise<AuthSession> {
    const session =  await fetchAuthSession();
    return session;
  }

  async awsUserCleaner(user: IUserProfile, authOverride?: GraphQLAuthMode): Promise<void> {
    const authSession = await fetchAuthSession();
    const authMode: GraphQLAuthMode =
      authOverride ?? (this.isUserAuth ? "userPool" : "iam");
    const input = JSON.stringify({user: user, authSession: authSession});
    const variables = { input };
    const client = generateClient({});
    client.graphql({query: userCleaner, variables, authMode: authMode });
  }
  
  async updateCognitoUsername(newUsername: string): Promise<void> {
    try {
      await updateUserAttributes({
        userAttributes: {
          nickname: newUsername,
        }
      });
    } catch (error) {
      console.error('Failed to update username in Cognito:', error);
      throw new Error('Could not update username in Cognito');
    }
  }

  async getUserNickname(): Promise<string | null> {
    try {
      const attributes = await fetchUserAttributes();
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

  async getUserEmail(): Promise<string | null> {
    try {
      const userAttributes = await fetchUserAttributes();
      if(userAttributes && userAttributes.email != undefined){
        return userAttributes.email; // Email is stored under "email" key
      } else {
        return null
      }

    } catch (error) {
      console.error("Error fetching user attributes:", error);
      return null;
    }
  }

  async awsSignUp(username: string, email: string, password: string) {
    try {
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
    }catch (e: any) {
      // aws sets some generic error messages, so we add our own code in
      console.log(e);
      const [ _, msg ] = e.message.split('|', 2); 
      throw new Error(`${msg}`);
    }
  }

  // not using a hub listener here and elsewhere as we need more fine-grained control over
  // auth state handling (particularly with federated sign-in)
  async awsConfirmSignUp(email: string, code: string): Promise<ConfirmSignUpOutput> {
    try {
    const response = await confirmSignUp({username: email, confirmationCode: code});
    console.log('here');
    console.log(response);
    return response;
    } catch (e: any) {
      throw new Error (e);
    }
  }

  async awsSignIn(username: string, password: string): Promise<SignInOutput> {
    let user;
    try{
      user = await signIn({username: username, password: password}); 
    } catch (e: any) {
      console.log("E: ", e)
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


  async awsConfirmResetPassword(input: ConfirmResetPasswordInput): Promise<void> {
    await confirmResetPassword(input);
  };

  async awsSignOut(): Promise<void> {
    await amplifySignOut();   
  }

  async awsResendConfirmationCode(email: string): Promise<ResendSignUpCodeOutput> {
    const response = await resendSignUpCode({username: email});
    return response;
  }

  async awsUploadImagePrivate <String>(
    image: File,
  ): Promise<String> {
    const user = (await fetchAuthSession()).identityId;
    const result = await uploadData({
      path: `private/${user}/${image.name}`,
      data: image,
      options: { contentType: image.type }
    }).result;
    return result as String
  }

  async awsUploadImagePublic <String>(
    image: File,
  ): Promise<String> {
    const result = await uploadData({
      path: `public/${image.name}`,
      data: image,
      options: { contentType: image.type }
    }).result;
    return result as String
  }

  async awsDownloadImagePublic(
  ) {
    const { body } = await downloadData({ 
      path: 'public/test.png' 
    }).result;
    const blob = await body.blob();
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  }

  async awsDownloadImagePrivate(
  ) {
    const user = (await fetchAuthSession()).identityId;
    const { body } = await downloadData({ 
      path: `private/${user}/test.png`
    }).result;
    const blob = await body.blob();
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  }
}

