import React, { ReactElement, useEffect } from 'react';
import { Navigate, useMatch, useSearchParams } from 'react-router-dom';
import { ScreenSize, UserStatusType } from '../lib/MicroCoachModels';
import { IUserState } from '../hooks/useUserState';
import LandingSkeleton from '../components/LandingSkeleton';

interface AuthGuardProps {
  children: ReactElement;
  user: IUserState;
  handleLogOut: () => void;
  screenSize: ScreenSize;
  /**
   * Whether this screen's content actually depends on knowing who the user is.
   * Public screens render immediately while the check is still in flight —
   * blocking them would keep their own fetches (copy, imagery) from starting,
   * which is what turns independent work into a waterfall.
   */
  requiresAuth: boolean;
}

// Route guard mirroring central_v2's AuthGuard: switches on userStatus and
// handles the Google OAuth error surfaced on the /auth callback. Rendered
// inside AppContainer, so anything returned here replaces the body only.
export default function AuthGuard({
  children,
  user,
  handleLogOut,
  screenSize,
  requiresAuth,
}: AuthGuardProps) {
  const { userStatus, setUserStatus, setUserErrorString } = user;
  const [search] = useSearchParams();

  const isLandingPage = Boolean(useMatch('/'));
  const isAuthPage = Boolean(useMatch('/auth'));
  const isLoginPage = Boolean(useMatch('/login'));
  const isSignupPage = Boolean(useMatch('/signup'));

  // Google OAuth failure (e.g. duplicate account) comes back as ?error_description
  const errorDescription = search.get('error_description');

  // These three transitions used to run during render, which writes to the
  // provider while a child is rendering — React warns, and with plain state it
  // would also render one frame against the stale status. Effects instead; the
  // redirects below still render immediately.
  useEffect(() => {
    if (!errorDescription) return;
    setUserStatus(UserStatusType.LOGGEDOUT);
    setUserErrorString(errorDescription.split('|', 2)[1] ?? errorDescription);
  }, [errorDescription, setUserStatus, setUserErrorString]);

  useEffect(() => {
    // GOOGLE_SIGNIN is a transient hand-off state — settle it to LOGGEDIN.
    if (userStatus === UserStatusType.GOOGLE_SIGNIN) {
      setUserStatus(UserStatusType.LOGGEDIN);
    }
  }, [userStatus, setUserStatus]);

  useEffect(() => {
    if (userStatus === UserStatusType.INCOMPLETE) handleLogOut();
  }, [userStatus, handleLogOut]);

  if (errorDescription) return <Navigate to="/signup" replace />;

  switch (userStatus) {
    // /googlesignup and /confirmation were retired with the old auth pages;
    // the wizard handles both of those states in-flow now.
    case UserStatusType.GOOGLE_SIGNUP:
      return <Navigate to="/signup" replace />;
    case UserStatusType.GOOGLE_SIGNIN:
      return <Navigate to="/" replace />;
    case UserStatusType.GOOGLE_ERROR:
      return <Navigate to="/signup" replace />;
    case UserStatusType.INCOMPLETE:
      return <Navigate to="/" replace />;
    case UserStatusType.LOADING:
      // Public screens render straight away — nothing on them depends on the
      // answer, and holding them would stall their own loading too. Only
      // screens whose content is the auth state wait, and those are small
      // centred cards where a blank beat beats a wrong-shaped skeleton.
      if (!requiresAuth) return children;
      return isLandingPage ? <LandingSkeleton screenSize={screenSize} /> : null;
    case UserStatusType.NONVERIFIED:
      return isSignupPage ? children : <Navigate to="/signup/verify" replace />;
    case UserStatusType.LOGGEDOUT:
      // No protected app screens yet; allow auth pages + landing through.
      return children;
    case UserStatusType.LOGGEDIN:
    default:
      // Signed in → keep users off the auth pages.
      return isAuthPage || isLoginPage || isSignupPage ? (
        <Navigate to="/" replace />
      ) : (
        children
      );
  }
}
