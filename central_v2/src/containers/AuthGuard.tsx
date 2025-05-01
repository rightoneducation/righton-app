import React from 'react';
import { Navigate, useMatch, useNavigate } from 'react-router-dom';
import { useTheme, CircularProgress } from '@mui/material';
import { userProfileLocalStorage } from '@righton/networking';
import { useCentralDataDispatch, useCentralDataState } from '../hooks/context/useCentralDataContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { UserStatusType } from '../lib/CentralModels';
import { userProfileInit } from '../lib/context/CentralDataContext';
import { SignUpMainContainer } from '../lib/styledcomponents/SignUpStyledComponents';


interface AuthGuardProps {
  isValidatingUser?: boolean;
  handleLogOut: () => void;
  children: JSX.Element | null;
}

export default function AuthGuard ({
   isValidatingUser,
   handleLogOut,
   children
}: AuthGuardProps){
  const theme = useTheme();
  const isLibrary = useMatch('/library');
  const isAuthPage = useMatch('/auth');
  const isSignupPage = useMatch('/signup');
  const isLoginPage = useMatch('/login');
  const isNextStepPage = useMatch('/nextstep');

  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const navigate = useNavigate();
  
  console.log('AUTH_STATUS');
  const userStatusMap = [
    'UserStatusType.LOGGEDIN',
    'UserStatusType.LOGGEDOUT',
    'UserStatusType.INCOMPLETE',
    'UserStatusType.LOADING'
  ]
  console.log(userStatusMap[centralData.userStatus]);
  console.log(centralData.userProfile);

  /* case 1: user navigates to main page while logged in
  * user is logged in but they dont have centraldata.userprofile set
  * set it from local storage
  * redirect to main page
  * -> CONFIRMED

  * case 2: user navigates to main page while logged out

  */

  switch (centralData.userStatus) {
    case UserStatusType.LOGGEDIN:
      if (isAuthPage || isLoginPage || isSignupPage) {
        return <Navigate to="/" replace />;
      }
      break;
    case UserStatusType.LOGGEDOUT:
      if (isLibrary && !isValidatingUser) {
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
    default:
      return <SignUpMainContainer> <CircularProgress style={{color: theme.palette.primary.darkBlueCardColor}}/> </SignUpMainContainer>
  }
  
  return children as JSX.Element;
}