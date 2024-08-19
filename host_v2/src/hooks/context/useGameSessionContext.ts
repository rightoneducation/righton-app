import { useContext, Dispatch, Context } from 'react';
import { IGameSession} from '@righton/networking';
import { IAction } from '../../lib/reducer/IGameSessionReducer';

export const useTSGameSessionContext = (context: Context<IGameSession | undefined>) => {
  const gameSessionContext = useContext( context );
  if (!gameSessionContext)
    throw new Error ("No GameSessionContext found");
  return gameSessionContext;
}

export const useTSDispatchContext = (context: Context<Dispatch<IAction> | undefined>) => {
  const localDispatchContext = useContext( context );
  if (!localDispatchContext)
    throw new Error ("No DispatchContext found");
  return localDispatchContext;
}