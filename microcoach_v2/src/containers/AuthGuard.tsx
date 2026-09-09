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
  /*
   * Exact match on purpose: `/signup` is the wizard's entry, not the whole
   * flow. Every redirect below must target a location that satisfies its own
   * condition — a guard that sends you somewhere it will then reject renders
   * <Navigate> forever and the page comes up blank. The corollary is that
   * nothing here may redirect to a wizard-internal URL (`/signup/verify` and
   * friends); the steps own those, and each one already returns to `/signup`
   * when the state it needs was never collected.
   *
   * Widening this to '/signup/*' would also break the last step: SignUpSelect
   * signs the user in from a mount effect, so LOGGEDIN's keep-out below would
   * fire while they are still on /signup/select.
   */
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
    if (userStatus === UserStatusType.INCOMPLETE) handleLogOut();
  }, [userStatus, handleLogOut]);

  if (errorDescription) return <Navigate to="/signup" replace />;

  switch (userStatus) {
    // Render in place rather than redirect, matching central_v2's
    // `case GOOGLE_SIGNUP: break`. The screen the user is on IS the handler:
    // Cognito lands them on /auth, and AuthCallback writes the backend row from
    // there. Redirecting to /signup unmounted it before it could run, and the
    // condition that sent them there (no row) was never cleared — so the Google
    // button just looped.
    case UserStatusType.GOOGLE_SIGNUP:
      return children;
    // Nothing assigns GOOGLE_SIGNIN any more — validateUser resolves a Google
    // user with a row straight to LOGGEDIN. Kept as a no-op rather than a
    // redirect: this case used to eject them from whatever page they loaded.
    case UserStatusType.GOOGLE_SIGNIN:
      return children;
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
