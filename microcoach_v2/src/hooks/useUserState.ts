import { useCallback, useMemo, useState } from 'react';
import { IUserProfile } from '../api';
import { UserStatusType } from '../lib/MicroCoachModels';

// Signed-in user state, owned by RootLayout and passed down as props (see
// App.tsx). Deliberately plain useState rather than a reducer or a context:
// three fields, no cross-field invariants beyond "clear them together", and a
// preliminary app that doesn't yet warrant either. Context/reducer can come
// back when the shape earns it.
export interface IUserState {
  userProfile: IUserProfile | null;
  userStatus: UserStatusType;
  userErrorString: string;
  // A profile becomes the signed-in user (login, signup, on-load resolve).
  signIn: (profile: IUserProfile, status?: UserStatusType) => void;
  signOut: () => void;
  // Edit the signed-in user's own profile; merges onto the current value.
  updateUserProfile: (changes: Partial<IUserProfile>) => void;
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

export function useUserState(): IUserState {
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatusType>(
    UserStatusType.LOADING,
  );
  const [userErrorString, setUserErrorString] = useState('');

  const signIn = useCallback(
    (profile: IUserProfile, status: UserStatusType = UserStatusType.LOGGEDIN) => {
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

  const updateUserProfile = useCallback((changes: Partial<IUserProfile>) => {
    setUserProfile((prev) => ({ ...(prev ?? {}), ...changes }) as IUserProfile);
  }, []);

  const advanceGoogleSignUp = useCallback(
    (firstName: string, lastName: string) => {
      setUserProfile(
        (prev) =>
          ({
            ...(prev ?? {}),
            teacherName: `${firstName} ${lastName}`.trim(),
          }) as IUserProfile,
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
      signOut,
      updateUserProfile,
      advanceGoogleSignUp,
    ],
  );
}

export default useUserState;
