import { createContext, Dispatch } from 'react';
import { IGameSession} from '@righton/networking';
import { IAction } from '../reducer/IGameSessionReducer';

export const GameSessionContext = createContext<IGameSession | undefined>(undefined);
export const GameSessionDispatchContext = createContext<Dispatch<IAction> | undefined>(undefined);