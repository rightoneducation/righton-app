import React, { createContext, Dispatch, ReactNode, useReducer } from 'react';
import {
  IMicroCoachDataState,
  initMicroCoachDataState,
} from '../MicroCoachModels';
import {
  microCoachDataReducer,
  MicroCoachDataAction,
} from '../reducer/MicroCoachDataReducer';

export const MicroCoachDataStateContext = createContext<
  IMicroCoachDataState | undefined
>(undefined);

export const MicroCoachDataDispatchContext = createContext<
  Dispatch<MicroCoachDataAction> | undefined
>(undefined);

export function MicroCoachDataProvider({ children }: { children: ReactNode }) {
  const [microCoachData, microCoachDataDispatch] = useReducer(
    microCoachDataReducer,
    initMicroCoachDataState,
  );

  return (
    <MicroCoachDataStateContext.Provider value={microCoachData}>
      <MicroCoachDataDispatchContext.Provider value={microCoachDataDispatch}>
        {children}
      </MicroCoachDataDispatchContext.Provider>
    </MicroCoachDataStateContext.Provider>
  );
}
