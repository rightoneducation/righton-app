import React, { createContext, useReducer, Dispatch, ReactNode } from 'react';
import { IMicroCoachDataState } from '../MicroCoachModels';
import {
  microCoachDataReducer,
  initMicroCoachDataState,
  MicroCoachDataAction,
} from '../reducer/MicroCoachDataReducer';

export const MicroCoachDataStateContext = createContext<IMicroCoachDataState>(
  initMicroCoachDataState,
);
export const MicroCoachDataDispatchContext = createContext<Dispatch<MicroCoachDataAction>>(
  () => undefined,
);

export function MicroCoachDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(microCoachDataReducer, initMicroCoachDataState);
  return (
    <MicroCoachDataStateContext.Provider value={state}>
      <MicroCoachDataDispatchContext.Provider value={dispatch}>
        {children}
      </MicroCoachDataDispatchContext.Provider>
    </MicroCoachDataStateContext.Provider>
  );
}
