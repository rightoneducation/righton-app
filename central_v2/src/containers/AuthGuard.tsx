import React from 'react';
import { Navigate, useMatch } from 'react-router-dom';
import { useCentralDataState } from '../hooks/context/useCentralDataContext';
import { UserStatusType } from '../lib/CentralModels';

interface AuthGuardProps {
  children: JSX.Element | null;
}

export default function AuthGuard ({ children }: AuthGuardProps){
  const isLibrary = useMatch('/library');
  const { userStatus } = useCentralDataState();

  if (userStatus === UserStatusType.INCOMPLETE) {
    return <Navigate to="/nextstep" replace />;
  }

  if (isLibrary && userStatus === UserStatusType.LOGGEDOUT) {
    return <Navigate to="/" replace />;
  }

  return children as JSX.Element;
}