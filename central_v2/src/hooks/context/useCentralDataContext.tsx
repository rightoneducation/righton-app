import { useContext, Dispatch, Context } from 'react';
import { CentralDataStateContext, CentralDataDispatchContext } from '../../lib/context/CentralDataContext';

// Custom hook to access state
export const useCentralDataState = () => {
  const context = useContext(CentralDataStateContext);
  if (!context) throw new Error('useCentralDataState must be used within a CentralDataProvider');
  return context;
};

// Custom hook to access dispatch
export const useCentralDataDispatch = () => {
  const context = useContext(CentralDataDispatchContext);
  if (!context) throw new Error('useCentralDataDispatch must be used within a CentralDataProvider');
  return context;
};