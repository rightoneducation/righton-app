import { useContext, Dispatch, Context } from 'react';
import { IHostTeamAnswers } from '@righton/networking';
import { IAction } from '../../lib/reducer/IHostTeamAnswersReducer';

export const useTSHostTeamAnswersContext = (context: Context<IHostTeamAnswers | undefined>) => {
  const localHostTeamAnswersContext = useContext( context );
  if (!localHostTeamAnswersContext)
    throw new Error ("No HostTeamAnswersContext found");
  return localHostTeamAnswersContext;
}

export const useTSDispatchContext = (context: Context<Dispatch<IAction> | undefined>) => {
  const localDispatchContext = useContext( context );
  if (!localDispatchContext)
    throw new Error ("No DispatchContext found");
  return localDispatchContext;
}