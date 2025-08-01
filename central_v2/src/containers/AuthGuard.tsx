import React from 'react';
import { Navigate, useMatch, useSearchParams } from 'react-router-dom';
import { useTheme, CircularProgress } from '@mui/material';
import {
  useCentralDataDispatch,
  useCentralDataState,
} from '../hooks/context/useCentralDataContext';
import { UserStatusType } from '../lib/CentralModels';
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';
import Loading from '../pages/Loading';

interface AuthGuardProps {
  handleLogOut: () => void;
  children: JSX.Element | null;
}

export default function AuthGuard({ handleLogOut, children }: AuthGuardProps) {
  const theme = useTheme();
  const isLibrary = useMatch('/library');
  const isAuthPage = useMatch('/auth');
  const isSignupPage = useMatch('/signup');
  const isLoginPage = useMatch('/login');
  const isNextStep = useMatch('/nextstep');
  const [search] = useSearchParams();
  const err = search.get('error_description');

  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();

  // this specifically catches Google OAuth sign up errors for duplicate accounts
  // we need to check the routing params for the error string off /auth?error_description=...
  // we can then redirect back to the signup page with the error message
  if (err) {
    centralDataDispatch({
      type: 'SET_USER_STATUS',
      payload: UserStatusType.LOGGEDOUT,
    });
    const [, msg] = err.split('|', 2);
    centralDataDispatch({ type: 'SET_USER_ERROR_STRING', payload: msg });
    return <Navigate to="/signup" replace />;
  }

  // switch to render content based on Auth status of User
  // auth status is determined by the validateUser function in CentralDataManager
  switch (centralData.userStatus) {
    // if a user is half way through the Google Sign Up process
    case UserStatusType.GOOGLE_SIGNUP:
      break;

    // this triggers both on a broken account and during the google signup/signin process
    case UserStatusType.GOOGLE_SIGNIN:
      centralDataDispatch({
        type: 'SET_USER_STATUS',
        payload: UserStatusType.LOGGEDIN,
      });
      return <Navigate to="/" replace />;

    case UserStatusType.GOOGLE_ERROR:
      return <Navigate to="/signup" replace />;

    // if a user missing either cognito or local credentials, their account is broken and they need to sign up again
    case UserStatusType.INCOMPLETE:
      handleLogOut();
      centralDataDispatch({
        type: 'SET_USER_STATUS',
        payload: UserStatusType.LOGGEDOUT,
      });
      return <Navigate to="/" replace />;

    // intermediate state while determining userStatus via validateUser in CentralDataManager
    // happens on page load and whenever validateUser is called
    case UserStatusType.LOADING:
      return <Loading />;

    // if a user is logged out, having no cognito and local credentials
    case UserStatusType.LOGGEDOUT:
      // if logged out user tries to access pages that require authentication
      if (isLibrary || isAuthPage || isNextStep) {
        return <Navigate to="/" replace />;
      }
      break;
    case UserStatusType.NONVERIFIED:
      // if logged out user tries to access pages that require authentication
      if (!isSignupPage) {
        return <Navigate to="/signup" replace />;
      }

      break;

    // when a user successfull is logged in with aws and local credentials
    case UserStatusType.LOGGEDIN:
    default:
      // prevents logged in user from accessing auth pages
      if (isAuthPage || isLoginPage || isSignupPage) {
        return <Navigate to="/" replace />;
      }
      break;
  }
  // is user logged in or user logged out, render children
  return children as JSX.Element;
}
