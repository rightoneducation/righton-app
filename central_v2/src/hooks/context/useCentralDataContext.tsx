import { useContext, Dispatch, Context } from 'react';
import { CentralDataContextType } from '../../lib/context/CentralDataContext';

export const useCentralDataContext = ( // eslint-disable-line
  context: Context<CentralDataContextType | undefined>,
) => {
  const CentralDataContext = useContext(context);
  if (!CentralDataContext) throw new Error('No CentralDataContext found');
  return CentralDataContext;
};
