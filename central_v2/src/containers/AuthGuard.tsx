import React from 'react';
import { Navigate, useMatch, useNavigate  } from 'react-router-dom';
import { useCentralDataState } from '../hooks/context/useCentralDataContext';
import { UserStatusType } from '../lib/CentralModels';

interface AuthGuardProps {
  children: JSX.Element | null;
}

export default function AuthGuard ({ children }: AuthGuardProps){
  const isLibrary = useMatch('/library');
  const isSignupPage = useMatch("/signup");  
  const isLoginPage = useMatch("/login");    
  const navigate = useNavigate(); 

  const { userStatus } = useCentralDataState();
  console.log(userStatus)
  
  if (userStatus === UserStatusType.INCOMPLETE) {
    return <Navigate to="/nextstep" replace />;
  }
  if (userStatus === UserStatusType.LOGGEDIN && isSignupPage || isLoginPage){
    console.log("navigating user to the current page they are in.");
    return navigate(-1)
  }

  if (isLibrary && userStatus === UserStatusType.LOGGEDOUT) {
    return <Navigate to="/" replace />;
  }

  return children as JSX.Element;
}