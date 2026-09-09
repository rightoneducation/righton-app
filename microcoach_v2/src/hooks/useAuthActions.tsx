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
  const { setSignedInUser, signOut, setUserStatus, advanceGoogleSignUp } = user;

  /*
   * A restore that fails is not a logout. This drops the local profile and
   * reports LOGGEDOUT, but deliberately leaves the Cognito tokens alone so a
   * reload can still recover — only handleLogOut, on an explicit user action,
   * destroys them. Ported from central_v2's reportRestoreFailed, which exists
   * because calling handleLogOut here revokes the refresh token and turns a
   * transient resolve failure into a permanent sign-out.
   *
   * Resolving to LOGGEDOUT (rather than a status of its own) is also what keeps
   * a half-formed account from breaking routing: a Cognito session with no
   * backend row is simply "signed out, here is signup", not a state that
   * redirects into the middle of the signup wizard.
   */
  const reportRestoreFailed = () => {
    apiClients.user.clearLocalUserProfile();
    signOut();
  };

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
        reportRestoreFailed();
        return;
      }
      const identities = (session.tokens?.idToken?.payload?.identities ?? []) as {
        providerName?: string;
      }[];
      const isGoogle = Array.isArray(identities)
        && identities.some((i) => i.providerName === 'Google');

      const profile = await apiClients.user.getUserByCognitoId(cognitoId);
      if (profile) {
        // Always LOGGEDIN, never GOOGLE_SIGNIN. That status is central_v2's
        // transient marker for the moment you return from federation; for a
        // session restore it is meaningless, and AuthGuard redirects on it —
        // which bounced every returning Google user to / from whatever page
        // they loaded, before the effect meant to settle it could run.
        setSignedInUser(profile, UserStatusType.LOGGEDIN);
        apiClients.user.setLocalUserProfile(profile);
      } else if (isGoogle) {
        const { firstName, lastName } = await apiClients.auth.getFirstAndLastName();
        advanceGoogleSignUp(firstName, lastName);
      } else {
        // Cognito session with no backend row — a signup that got part way and
        // stopped. Nothing to restore, so treat it as signed out.
        reportRestoreFailed();
      }
    } catch (e) {
      // Log name and message, not just the object: DevTools collapses it, and
      // the error name is what identifies which call threw.
      console.error('validateUser failed', (e as Error)?.name, (e as Error)?.message, e);
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
