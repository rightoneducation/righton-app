import { useContext } from 'react';
import {
  MicroCoachDataDispatchContext,
  MicroCoachDataStateContext,
} from '../../lib/context/MicroCoachDataContext';

export const useMicroCoachDataState = () => {
  const context = useContext(MicroCoachDataStateContext);

  if (!context) {
    throw new Error(
      'useMicroCoachDataState must be used within a MicroCoachDataProvider',
    );
  }

  return context;
};

export const useMicroCoachDataDispatch = () => {
  const context = useContext(MicroCoachDataDispatchContext);

  if (!context) {
    throw new Error(
      'useMicroCoachDataDispatch must be used within a MicroCoachDataProvider',
    );
  }

  return context;
};
