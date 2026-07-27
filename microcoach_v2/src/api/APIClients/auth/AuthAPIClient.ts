import {
  signUp,
  confirmSignUp,
  signIn,
  signInWithRedirect,
  signOut as amplifySignOut,
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  resetPassword,
  resendSignUpCode,
  confirmResetPassword,
  updateUserAttributes,
  decodeJWT,
  SignInOutput,
  ResendSignUpCodeOutput,
  ConfirmSignUpOutput,
  type ResetPasswordOutput,
  AuthSession,
  ConfirmResetPasswordInput,
} from 'aws-amplify/auth';
import { IAuthAPIClient } from './interfaces/IAuthAPIClient';

// Pure Cognito/Amplify auth client for MicroCoach v2. Ported from central_v2's
// networking AuthAPIClient (aws-amplify v6). Amplify.configure is called by the
// frontend (it owns the generated aws-exports), so this client only calls the
// aws-amplify/auth APIs against the globally-configured pool.
export class AuthAPIClient implements IAuthAPIClient {
  isUserAuth: boolean;

  constructor() {
    this.isUserAuth = false;
  }

  async verifyAuth(): Promise<boolean> {
    const session = await fetchAuthSession();
    if (session && session.tokens && session.tokens.accessToken) {
      return true;
    }
    return false;
  }

  async getCurrentUserName(): Promise<string> {
    const { username } = await getCurrentUser();
    return username;
  }

  async getFirstAndLastName(): Promise<{ firstName: string; lastName: string }> {
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
    return { firstName, lastName };
  }

  async getCurrentSession(): Promise<AuthSession> {
    const session = await fetchAuthSession();
    return session;
  }

  async updateCognitoUsername(newUsername: string): Promise<void> {
    try {
      await updateUserAttributes({
        userAttributes: { nickname: newUsername },
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
      }
      return null;
    } catch (error) {
      console.error('Error fetching user attributes:', error);
      return null;
    }
  }

  async getUserEmail(): Promise<string | null> {
    try {
      const userAttributes = await fetchUserAttributes();
      if (userAttributes && userAttributes.email !== undefined) {
        return userAttributes.email;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user attributes:', error);
      return null;
    }
  }

  async awsSignUp(username: string, email: string, password: string): Promise<void> {
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            nickname: username,
            email,
          },
        },
      });
    } catch (e: any) {
      // AWS sets generic error messages; we encode our own `CODE|message`.
      console.log(e);
      const [, msg] = e.message.split('|', 2);
      throw new Error(`${msg}`);
    }
  }

  async awsConfirmSignUp(email: string, code: string): Promise<ConfirmSignUpOutput> {
    try {
      const response = await confirmSignUp({ username: email, confirmationCode: code });
      return response;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async awsSignIn(username: string, password: string): Promise<SignInOutput> {
    let user;
    try {
      user = await signIn({ username, password });
    } catch (e: any) {
      console.log('E: ', e);
      throw new Error(e);
    }
    return user;
  }

  async awsSignInFederated(): Promise<void> {
    await signInWithRedirect({ provider: 'Google' });
  }

  async awsResetPassword(username: string): Promise<ResetPasswordOutput> {
    const output = await resetPassword({ username });
    return output;
  }

  async awsConfirmResetPassword(input: ConfirmResetPasswordInput): Promise<void> {
    await confirmResetPassword(input);
  }

  async awsSignOut(): Promise<void> {
    await amplifySignOut();
  }

  async awsResendConfirmationCode(email: string): Promise<ResendSignUpCodeOutput> {
    const response = await resendSignUpCode({ username: email });
    return response;
  }
}
