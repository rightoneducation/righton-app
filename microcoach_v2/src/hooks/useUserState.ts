import { useCallback, useMemo, useState } from 'react';
import { IAPIClients, IUser } from '../api';
import { UserStatusType } from '../lib/MicroCoachModels';

// Signed-in user state, owned by RootLayout and passed down as props (see
// App.tsx). Deliberately plain useState rather than a reducer or a context:
// three fields, no cross-field invariants beyond "clear them together", and a
// preliminary app that doesn't yet warrant either. Context/reducer can come
// back when the shape earns it.
export interface IUserState {
  userProfile: IUser | null;
  userStatus: UserStatusType;
  userErrorString: string;
  // Credential login: authenticates against Cognito, then sets state on success.
  // Requires email + password, so it is only for the email/password form.
  // Resolves to the signed-in profile, or null when sign-in failed — callers
  // navigate on success, and userErrorString carries the reason on failure.
  signIn: (user: IUser) => Promise<IUser | null>;
  // State transition only, for callers who are ALREADY authenticated — the
  // Google return leg, the on-load session restore, the end of the signup
  // wizard. Those profiles carry no password and must not be re-authenticated.
  setSignedInUser: (profile: IUser, status?: UserStatusType) => void;
  signOut: () => void;
  // Edit the signed-in user's own profile; merges onto the current value.
  updateUserProfile: (changes: Partial<IUser>) => void;
  // Google federation succeeded but no backend User row exists yet — carry the
  // name across into the signup wizard.
  advanceGoogleSignUp: (firstName: string, lastName: string) => void;
  setUserStatus: (status: UserStatusType) => void;
  setUserErrorString: (message: string) => void;
}

// Screens receive the user handle as a prop, alongside their screenSize.
export interface UserProps {
  user: IUserState;
}

export function useUserState(apiClients: IAPIClients): IUserState {
  const [userProfile, setUserProfile] = useState<IUser | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatusType>(
    UserStatusType.LOADING,
  );
  const [userErrorString, setUserErrorString] = useState('');

  const signIn = useCallback(
    async (user: IUser) => {
      if (!user || !user.email || !user.password) {
        console.error('email or password not present for sign in');
        setUserErrorString('Enter your email and password.');
        return null;
      }
      try {
        /*
         * loginAndRetrieveUserProfile rather than awsSignIn: awsSignIn only
         * authenticates and returns no profile, which forced callers to invent
         * one from form values. This resolves the session and reads the real
         * User row, so state gets `id` / `cognitoId` and nothing fabricated.
         */
        const profile = await apiClients.user.loginAndRetrieveUserProfile(
          user.email,
          user.password,
        );
        if (!profile) {
          // Cognito accepted the credentials but no User row is linked to that
          // identity — a half-finished signup, not a wrong password.
          console.error('Signed in but no user profile found');
          setUserErrorString('We could not find your account. Please sign up.');
          return null;
        }
        setUserProfile(profile);
        setUserErrorString('');
        setUserStatus(UserStatusType.LOGGEDIN);
        return profile;
      } catch (e) {
        console.error('Sign in call failed with:');
        console.error(e);
        setUserErrorString('That email or password was not recognised.');
      }
      return null;
    },
    // The useState setters are stable, so apiClients is the only real dependency.
    [apiClients],
  );

  const setSignedInUser = useCallback(
    (profile: IUser, status: UserStatusType = UserStatusType.LOGGEDIN) => {
      setUserProfile(profile);
      setUserStatus(status);
    },
    [],
  );

  const signOut = useCallback(() => {
    
    setUserProfile(null);
    setUserErrorString('');
    setUserStatus(UserStatusType.LOGGEDOUT);
  }, []);

  const updateUserProfile = useCallback((changes: Partial<IUser>) => {
    setUserProfile((prev) => ({ ...(prev ?? {}), ...changes }) as IUser);
  }, []);

  const advanceGoogleSignUp = useCallback(
    (firstName: string, lastName: string) => {
      setUserProfile(
        (prev) =>
          ({
            ...(prev ?? {}),
            firstName,
            lastName,
          }) as IUser,
      );
      setUserStatus(UserStatusType.GOOGLE_SIGNUP);
    },
    [],
  );

  return useMemo(
    () => ({
      userProfile,
      userStatus,
      userErrorString,
      signIn,
      setSignedInUser,
      signOut,
      updateUserProfile,
      advanceGoogleSignUp,
      setUserStatus,
      setUserErrorString,
    }),
    [
      userProfile,
      userStatus,
      userErrorString,
      signIn,
      setSignedInUser,
      signOut,
      updateUserProfile,
      advanceGoogleSignUp,
    ],
  );
}

export default useUserState;
