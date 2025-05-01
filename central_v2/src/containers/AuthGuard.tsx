import React from 'react';
import { Navigate, useMatch } from 'react-router-dom';
import { useTheme, CircularProgress } from '@mui/material';
import { useCentralDataDispatch, useCentralDataState } from '../hooks/context/useCentralDataContext';
import { UserStatusType } from '../lib/CentralModels';
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';


interface AuthGuardProps {
  handleLogOut: () => void;
  children: JSX.Element | null;
}

export default function AuthGuard ({
   handleLogOut,
   children
}: AuthGuardProps){
  const theme = useTheme();
  const isLibrary = useMatch('/library');
  const isAuthPage = useMatch('/auth');
  const isSignupPage = useMatch('/signup');
  const isLoginPage = useMatch('/login');
  
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();

  console.log('AUTH_STATUS');
  console.log(isLibrary);
  const userStatusMap = [
    'UserStatusType.LOGGEDIN',
    'UserStatusType.LOGGEDOUT',
    'UserStatusType.INCOMPLETE',
    'UserStatusType.LOADING'
  ]
  console.log(userStatusMap[centralData.userStatus]);
  console.log(centralData.userProfile);


  switch (centralData.userStatus) {
    case UserStatusType.LOGGEDOUT:
      if (isLibrary) {
        return <Navigate to="/" replace />;
      }
      break;
    case UserStatusType.INCOMPLETE:
      if (isAuthPage) {
        return <Navigate to="/nextstep" replace />;
      }
      handleLogOut();
      centralDataDispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDOUT });
      break;
    case UserStatusType.LOADING:
      return <SignUpMainContainer> <CircularProgress style={{color: theme.palette.primary.darkBlueCardColor}}/> </SignUpMainContainer>      
    case UserStatusType.LOGGEDIN:
    default:
      if (isAuthPage || isLoginPage || isSignupPage) {
        return <Navigate to="/" replace />;
      }
      break; 
  }
  return children as JSX.Element;
}