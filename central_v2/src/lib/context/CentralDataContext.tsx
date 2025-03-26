import { createContext, Dispatch } from 'react';
import { ICentralDataState } from './ICentralDataState';
import { CentralDataAction } from '../reducer/CentralDataReducer';

export interface CentralDataContextType {
  centralData: ICentralDataState;
  centralDataDispatch: React.Dispatch<CentralDataAction>;
}

export const CentralDataContext = createContext<CentralDataContextType | undefined>(
  undefined,
);