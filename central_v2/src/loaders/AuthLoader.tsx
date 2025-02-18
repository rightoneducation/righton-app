import React from 'react';
import { IAPIClients } from '@righton/networking';

export const AuthLoader = async (apiClients: IAPIClients): Promise<boolean> => { // eslint-disable-line
  const session = await apiClients.auth.verifyAuth();
  console.log(session);
  return session;
}