import { useCallback, useMemo } from 'react';
import { IAPIClients, IUser } from '../api';
import { UserStatusType } from '../lib/MicroCoachModels';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from './context/useMicroCoachDataContext';

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

export function useUserState(apiClients: IAPIClients): IUserState {
  const { userProfile, userStatus, userErrorString } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();

  const setUserStatus = useCallback(
    (status: UserStatusType) => {
      dispatch({ type: 'SET_USER_STATUS', payload: status });
    },
    [dispatch],
  );

  const setUserErrorString = useCallback(
    (message: string) => {
      dispatch({ type: 'SET_USER_ERROR_STRING', payload: message });
    },
    [dispatch],
  );

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
        dispatch({ type: 'SET_USER_PROFILE', payload: profile });
        dispatch({ type: 'SET_USER_ERROR_STRING', payload: '' });
        dispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDIN });
        return profile;
      } catch (e) {
        console.error('Sign in call failed with:');
        console.error(e);
        setUserErrorString('That email or password was not recognised.');
      }
      return null;
    },
    [apiClients, dispatch, setUserErrorString],
  );

  const setSignedInUser = useCallback(
    (profile: IUser, status: UserStatusType = UserStatusType.LOGGEDIN) => {
      dispatch({ type: 'SET_USER_PROFILE', payload: profile });
      dispatch({ type: 'SET_USER_STATUS', payload: status });
    },
    [dispatch],
  );

  const signOut = useCallback(() => {
    dispatch({ type: 'CLEAR_USER_PROFILE' });
    dispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDOUT });
  }, [dispatch]);

  const updateUserProfile = useCallback(
    (changes: Partial<IUser>) => {
      dispatch({ type: 'UPDATE_USER_PROFILE', payload: changes });
    },
    [dispatch],
  );

  const advanceGoogleSignUp = useCallback(
    (firstName: string, lastName: string) => {
      dispatch({
        type: 'UPDATE_USER_PROFILE',
        payload: { firstName, lastName },
      });
      dispatch({
        type: 'SET_USER_STATUS',
        payload: UserStatusType.GOOGLE_SIGNUP,
      });
    },
    [dispatch],
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
      setUserStatus,
      setUserErrorString,
    ],
  );
}

export default useUserState;
