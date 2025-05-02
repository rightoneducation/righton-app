import React from 'react';
import { Navigate, useMatch } from 'react-router-dom';
import { useTheme, CircularProgress } from '@mui/material';
import { useCentralDataDispatch, useCentralDataState } from '../hooks/context/useCentralDataContext';
import { UserStatusType } from '../lib/CentralModels';
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';

interface AuthGuardProps {
  handleLogOut: () => void;
  validateUser?: () => void;
  children: JSX.Element | null;
}

export default function AuthGuard ({
   handleLogOut,
   validateUser,
   children
}: AuthGuardProps){
  const theme = useTheme();
  const isLibrary = useMatch('/library');
  const isAuthPage = useMatch('/auth');
  const isSignupPage = useMatch('/signup');
  const isLoginPage = useMatch('/login');
  const isNextStep = useMatch('/nextstep');
  
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();


  // switch to render content based on Auth status of User
  // auth status is determined by the validateUser function in CentralDataManager
  switch (centralData.userStatus) {
    // if a user is not logged in and tries to access a page that requires auth
    case UserStatusType.LOGGEDOUT:
      if (isLibrary || isAuthPage || isNextStep) {
        return <Navigate to="/" replace />;
      }
      break;
    // this triggers both on a broken account and during the google signup/signin process
    case UserStatusType.INCOMPLETE:
      // Auth page is redirect from Google Login or Sign Up
      // we need to redirect to either / or /nextstep, respectively
      if (isAuthPage) {
        
        return <Navigate to="/nextstep" replace />;
      }
      // if the user is not moving through the Google process, their credentials are broken
      // and we need to log them out
      if (!isNextStep){
        handleLogOut();
        centralDataDispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDOUT });
      }
      break;
    // intermediate state while determining userStatus via validateUser in CentralDataManager
    // happens on page load and whenever validateUser is called
    case UserStatusType.LOADING:
      return <SignUpMainContainer> <CircularProgress style={{color: theme.palette.primary.darkBlueCardColor}}/> </SignUpMainContainer>      
    // when a user successfull is logged in with aws and local credentials
    case UserStatusType.LOGGEDIN:
    default:
      if (isAuthPage || isLoginPage || isSignupPage) {
        return <Navigate to="/" replace />;
      }
      break; 
  }
  return children as JSX.Element;
}