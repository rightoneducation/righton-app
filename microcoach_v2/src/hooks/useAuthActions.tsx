import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIClients } from '../api';
import { UserStatusType } from '../lib/MicroCoachModels';
import { IUserState } from './useUserState';

// On-load auth resolver + logout, adapted from central_v2's useCentralDataActions.
// Google vs Cognito is distinguished by the idToken `identities` claim; Google
// signup-vs-signin by whether a backend User row exists for the cognitoId.
//
// Split into two hooks on purpose. The resolver carries a mount effect and must
// run exactly once, from the router's root layout; `useLogOut` is effect-free so
// any screen can call it without re-triggering auth resolution. (central_v2
// keeps both in one hook called from AppSwitch, which re-fires the effect on
// every route change and re-flashes its loading state.)
//
// Auth only — app data actions live in useMicroCoachDataActions.
//
// Both take the user handle as an argument rather than reading it from a
// context, matching how they already take apiClients. RootLayout owns the
// state; see App.tsx.

export function useLogOut(apiClients: APIClients, user: IUserState) {
  const { signOut, setUserStatus } = user;
  const navigate = useNavigate();

  const handleLogOut = async () => {
    setUserStatus(UserStatusType.LOADING);
    await apiClients.user.signOut();
    signOut();
    navigate('/');
  };

  return { handleLogOut };
}

export function useAuthResolver(apiClients: APIClients, user: IUserState) {
  const { signIn, setUserStatus, advanceGoogleSignUp } = user;
  const { handleLogOut } = useLogOut(apiClients, user);

  const validateUser = async () => {
    try {
      const isAuthed = await apiClients.auth.verifyAuth();
      if (!isAuthed) {
        setUserStatus(UserStatusType.LOGGEDOUT);
        return;
      }
      const session = await apiClients.auth.getCurrentSession();
      const cognitoId = session.userSub;
      if (!cognitoId) {
        await handleLogOut();
        return;
      }
      const identities = (session.tokens?.idToken?.payload?.identities ?? []) as {
        providerName?: string;
      }[];
      const isGoogle = Array.isArray(identities)
        && identities.some((i) => i.providerName === 'Google');

      const profile = await apiClients.user.getUserByCognitoId(cognitoId);
      if (profile) {
        signIn(
          profile,
          isGoogle ? UserStatusType.GOOGLE_SIGNIN : UserStatusType.LOGGEDIN,
        );
        apiClients.user.setLocalUserProfile(profile);
      } else if (isGoogle) {
        const { firstName, lastName } = await apiClients.auth.getFirstAndLastName();
        advanceGoogleSignUp(firstName, lastName);
      } else {
        setUserStatus(UserStatusType.NONVERIFIED);
      }
    } catch (e) {
      console.error('validateUser failed', e);
      setUserStatus(UserStatusType.LOGGEDOUT);
    }
  };

  useEffect(() => {
    setUserStatus(UserStatusType.LOADING);
    validateUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { validateUser };
}
