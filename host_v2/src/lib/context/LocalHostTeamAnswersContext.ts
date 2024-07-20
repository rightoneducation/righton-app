import { createContext, Dispatch } from 'react';
import { IHostTeamAnswers} from '@righton/networking';
import { IAction } from '../reducer/IHostTeamAnswersReducer';

export const LocalHostTeamAnswersContext = createContext<IHostTeamAnswers | undefined>(undefined);
export const LocalHostTeamAnswersDispatchContext = createContext<Dispatch<IAction> | undefined>(undefined);