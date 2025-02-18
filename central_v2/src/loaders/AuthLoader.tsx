import React from 'react';
import { 
  fetchAuthSession,
} from 'aws-amplify/auth';
import { AuthLocalData } from '../lib/CentralModels';

export const AuthLoader = async (): Promise<boolean> => { // eslint-disable-line
  const session = await fetchAuthSession();
  if(!!session?.tokens?.accessToken) // eslint-disable-line
    return true;
  return false;
}