import { useContext } from 'react';
import {
  MicroCoachDataStateContext,
  MicroCoachDataDispatchContext,
} from '../../lib/context/MicroCoachDataContext';

export const useMicroCoachDataState = () => useContext(MicroCoachDataStateContext);
export const useMicroCoachDataDispatch = () => useContext(MicroCoachDataDispatchContext);
