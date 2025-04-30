import React from 'react';
import { Navigate, useMatch, useNavigate } from 'react-router-dom';
import { userProfileLocalStorage } from '@righton/networking';
import { useCentralDataDispatch, useCentralDataState } from '../hooks/context/useCentralDataContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { UserStatusType } from '../lib/CentralModels';
import { userProfileInit } from '../lib/context/CentralDataContext';


interface AuthGuardProps {
  isValidatingUser?: boolean;
  children: JSX.Element | null;
}

export default function AuthGuard ({
   isValidatingUser,
   children
}: AuthGuardProps){
  const isLibrary = useMatch('/library');
  const isAuthPage = useMatch('/auth');
  const isSignupPage = useMatch('/signup');
  const isLoginPage = useMatch('/login');
  const isNextStepPage = useMatch('/nextstep');

  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const navigate = useNavigate();
  
  // if user is logged in, but profile is not set, set it from local storage
  if (centralData.userStatus === UserStatusType.LOGGEDIN && centralData.userProfile === userProfileInit) {
    const localStorageUserProfile = window.localStorage.getItem(userProfileLocalStorage);
    const newUserProfile = localStorageUserProfile ? JSON.parse(localStorageUserProfile as string) : userProfileInit;
    centralDataDispatch({ type: 'SET_USER_PROFILE', payload: newUserProfile });
    return <Navigate to="/" replace />;
  }

  if (isAuthPage) {
    console.log('User Status:', centralData.userStatus);
    if (centralData.userStatus === UserStatusType.INCOMPLETE)
      navigate('/nextstep');
    else
      navigate('/');
    return null;
  }

  // In case user tries to go to login or signup page dont let them. Send them to the home page as the design team wanted.
  if (centralData.userStatus === UserStatusType.LOGGEDIN && (isLoginPage || isSignupPage)){
    console.log("User trying to access signup and login redirecting. In AuthGuard!!")
    return <Navigate to="/" replace />;
  }
  

  if (isLibrary && !isValidatingUser && centralData.userStatus === UserStatusType.LOGGEDOUT) {
    return <Navigate to="/" replace />;
  }

  return children as JSX.Element;
}