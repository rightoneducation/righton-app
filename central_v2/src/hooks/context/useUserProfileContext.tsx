import { useContext, Dispatch, Context } from 'react';
import { IUserProfile } from '@righton/networking';
import { IAction } from '../../lib/reducer/IUserProfileReducer';

export const useUserProfileContext = ( // eslint-disable-line
  context: Context<IUserProfile | undefined>,
) => {
  const UserProfileContext = useContext(context);
  if (!UserProfileContext) throw new Error('No UserProfileContext found');
  return UserProfileContext;
};

export const useUserProfileDispatchContext = (context: Context<Dispatch<IAction> | undefined>) => {
  const localDispatchContext = useContext( context );
  if (!localDispatchContext)
    throw new Error ("No DispatchContext found");
  return localDispatchContext;
}