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
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  console.log(centralData.userStatus === UserStatusType.INCOMPLETE);
  // if user is incomplete, send them to nextstep to correct
  if (centralData.userStatus === UserStatusType.INCOMPLETE) {
    return <Navigate to="/nextstep" replace />;
  }
  // if user is logged in, but profile is not set, set it from local storage
  if (centralData.userStatus === UserStatusType.LOGGEDIN && centralData.userProfile === userProfileInit) {
    const localStorageUserProfile = window.localStorage.getItem(userProfileLocalStorage);
    const newUserProfile = localStorageUserProfile ? JSON.parse(localStorageUserProfile as string) : userProfileInit;
    centralDataDispatch({ type: 'SET_USER_PROFILE', payload: newUserProfile });
  }

  if (isLibrary && !isValidatingUser && centralData.userStatus === UserStatusType.LOGGEDOUT) {
    return <Navigate to="/" replace />;
  }

  return children as JSX.Element;
}