import React from 'react';
import { Navigate, useMatch } from 'react-router-dom';
import { userProfileLocalStorage } from '@righton/networking';
import { useCentralDataDispatch, useCentralDataState } from '../hooks/context/useCentralDataContext';
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
  const isSignupPage = useMatch('/signup');
  const isLoginPage = useMatch('/login');
  const isNextStepPage = useMatch('/nextstep');

  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  console.log("Inside AuthGuard!!");
  // if user is incomplete, send them to nextstep to correct
  if (centralData.userStatus === UserStatusType.INCOMPLETE && !isNextStepPage) {
    console.log("Sending user to nextstep because profile incomplete. Inside AuthGuard!!")
    return <Navigate to="/nextstep" replace />;

  }
  // if user is logged in, but profile is not set, set it from local storage
  if (centralData.userStatus === UserStatusType.LOGGEDIN && centralData.userProfile === userProfileInit) {
    const localStorageUserProfile = window.localStorage.getItem(userProfileLocalStorage);
    const newUserProfile = localStorageUserProfile ? JSON.parse(localStorageUserProfile as string) : userProfileInit;
    centralDataDispatch({ type: 'SET_USER_PROFILE', payload: newUserProfile });
    console.log("Fetching user local storage inside AuthGuard!!")
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