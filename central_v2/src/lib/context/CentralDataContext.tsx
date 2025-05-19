import React, { createContext, useReducer } from 'react';
import { centralDataReducer, CentralDataAction } from '../reducer/CentralDataReducer';
import { ICentralDataState, initCentralDataState } from '../CentralModels';

export interface CentralDataContextType {
  centralData: ICentralDataState;
  centralDataDispatch: React.Dispatch<CentralDataAction>;
}

export const CentralDataStateContext = createContext<ICentralDataState | undefined>(undefined);
export const CentralDataDispatchContext = createContext<React.Dispatch<any> | undefined>(undefined);

export function CentralDataProvider ({ children }: { children: React.ReactNode }) {
  const [centralData, centralDataDispatch] = useReducer(centralDataReducer, initCentralDataState);
  return (
    <CentralDataStateContext.Provider value={centralData}>
      <CentralDataDispatchContext.Provider value={centralDataDispatch}>
        {children}
      </CentralDataDispatchContext.Provider>
    </CentralDataStateContext.Provider>
  );
}