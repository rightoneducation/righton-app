import React, { ReactElement } from 'react';
import { Navigate, useMatch, useSearchParams } from 'react-router-dom';
import { UserStatusType } from '../lib/MicroCoachModels';
import {
  useMicroCoachDataState,
  useMicroCoachDataDispatch,
} from '../hooks/context/useMicroCoachDataContext';

interface AuthGuardProps {
  children: ReactElement;
  handleLogOut: () => void;
}

// Route guard mirroring central_v2's AuthGuard: switches on userStatus and
// handles the Google OAuth error surfaced on the /auth callback.
export default function AuthGuard({ children, handleLogOut }: AuthGuardProps) {
  const microCoachData = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const [search] = useSearchParams();

  const isAuthPage = Boolean(useMatch('/auth'));
  const isLoginPage = Boolean(useMatch('/login'));
  const isSignupPage = Boolean(useMatch('/signup'));
  const isConfirmationPage = Boolean(useMatch('/confirmation'));
  const isGoogleSignupPage = Boolean(useMatch('/googlesignup'));

  // Google OAuth failure (e.g. duplicate account) comes back as ?error_description
  const errorDescription = search.get('error_description');
  if (errorDescription) {
    dispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDOUT });
    dispatch({
      type: 'SET_USER_ERROR_STRING',
      payload: errorDescription.split('|', 2)[1] ?? errorDescription,
    });
    return <Navigate to="/signup" replace />;
  }

  switch (microCoachData.userStatus) {
    case UserStatusType.GOOGLE_SIGNUP:
      return isGoogleSignupPage ? children : <Navigate to="/googlesignup" replace />;
    case UserStatusType.GOOGLE_SIGNIN:
      dispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDIN });
      return <Navigate to="/" replace />;
    case UserStatusType.GOOGLE_ERROR:
      return <Navigate to="/signup" replace />;
    case UserStatusType.INCOMPLETE:
      handleLogOut();
      return <Navigate to="/" replace />;
    case UserStatusType.LOADING:
      return <div>Loading…</div>;
    case UserStatusType.NONVERIFIED:
      return isSignupPage || isConfirmationPage ? children : <Navigate to="/confirmation" replace />;
    case UserStatusType.LOGGEDOUT:
      // No protected app screens yet; allow auth pages + landing through.
      return children;
    case UserStatusType.LOGGEDIN:
    default:
      // Signed in → keep users off the auth pages.
      return isAuthPage || isLoginPage || isSignupPage ? <Navigate to="/" replace /> : children;
  }
}
