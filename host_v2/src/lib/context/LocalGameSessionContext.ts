import { createContext, Dispatch } from 'react';
import { IGameSession} from '@righton/networking';
import { IAction } from '../reducer/IGameSessionReducer';

export const LocalGameSessionContext = createContext<IGameSession | undefined>(undefined);
export const LocalGameSessionDispatchContext = createContext<Dispatch<IAction> | undefined>(undefined);