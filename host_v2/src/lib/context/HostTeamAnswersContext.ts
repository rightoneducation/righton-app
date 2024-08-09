import { createContext, Dispatch } from 'react';
import { IHostTeamAnswers} from '@righton/networking';
import { IAction } from '../reducer/IHostTeamAnswersReducer';

export const HostTeamAnswersContext = createContext<IHostTeamAnswers | undefined>(undefined);
export const HostTeamAnswersDispatchContext = createContext<Dispatch<IAction> | undefined>(undefined);