import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { CookieStorage  } from 'aws-amplify/utils';
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
  ConfirmSignUpOutput,
  AuthSession,
  decodeJWT,
  updateUserAttributes
} from 'aws-amplify/auth';
import { uploadData, downloadData } from 'aws-amplify/storage';
import amplifyconfig from "../../amplifyconfiguration.json";
import { IAuthAPIClient } from './interfaces/IAuthAPIClient';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { userCleaner, userByEmail } from "../../graphql";
import { IUserProfile } from "../../Models/IUserProfile";

export class AuthAPIClient
  implements IAuthAPIClient
{
  isUserAuth: boolean;

  constructor(){
    this.isUserAuth = false;
    this.configAmplify(amplifyconfig);
  }

  configAmplify(awsconfig: any): void {
    Amplify.configure(awsconfig);
    // change userPools auth storage to cookies so that auth persists across central/host apps for signed-in teachers
    cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());
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

  async awsUserCleaner(user: IUserProfile): Promise<void> {
    const authSession = await fetchAuthSession();
    const authMode = this.isUserAuth ? "userPool" : "iam"
    const input = JSON.stringify({user: user, authSession: authSession});
    const variables = { input };
    const client = generateClient({});
    client.graphql({query: userCleaner, variables, authMode: authMode });
  }

  async getUserByEmailDB(email: string): Promise<boolean> {
      // Determine auth mode
      // const authSession = await fetchAuthSession(); // Can still keep this if needed
      const authMode = "userPool";
  
      // 🔑 Correct way to pass variables
      const variables = { email };
  
      // Generate client
      const client = generateClient({});
  
      // Run query
      const response = await client.graphql({
        query: userByEmail, // Make sure userByEmail is imported/generated properly
        variables,
        authMode
      });
  
      // Handle response
      if ("data" in response) {
        if (response.data.userByEmail.items?.length > 0) {
          return true
        } else {
          return false
        }
      } else {
        console.error("Unexpected result from GraphQL query:", response);
        return false
      }
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

  // not using a hub listener here and elsewhere as we need more fine-grained control over
  // auth state handling (particularly with federated sign-in)
  async awsConfirmSignUp(email: string, code: string): Promise<ConfirmSignUpOutput> {
    try {
    const response = await confirmSignUp({username: email, confirmationCode: code});
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

