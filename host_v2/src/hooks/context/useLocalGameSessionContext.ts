import { useContext, Dispatch, Context } from 'react';
import { IGameSession} from '@righton/networking';
import { IAction } from '../../lib/reducer/IGameSessionReducer';

export const useTSGameSessionContext = (context: Context<IGameSession | undefined>) => {
  const localGameSessionContext = useContext( context );
  if (!localGameSessionContext)
    throw new Error ("No GameSessionContext found");
  return localGameSessionContext;
}

export const useTSDispatchContext = (context: Context<Dispatch<IAction> | undefined>) => {
  const localDispatchContext = useContext( context );
  if (!localDispatchContext)
    throw new Error ("No DispatchContext found");
  return localDispatchContext;
}