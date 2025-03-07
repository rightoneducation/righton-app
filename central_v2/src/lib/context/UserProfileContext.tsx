import { createContext, Dispatch } from 'react';
import { IUserProfile } from '@righton/networking';
import { IAction } from '../reducer/IUserProfileReducer';

export const UserProfileContext = createContext<IUserProfile | undefined>( // eslint-disable-line
  undefined,
);

export const UserProfileDispatchContext = createContext<Dispatch<IAction> | undefined>( // eslint-disable-line
  undefined,
);