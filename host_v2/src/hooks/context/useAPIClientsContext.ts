import { useContext, Dispatch, Context } from 'react';
import { IAPIClients } from '@righton/networking';

export const useTSAPIClientsContext = (context: Context<IAPIClients | undefined>) => {
  const APIClientsContext = useContext( context );
  if (!APIClientsContext)
    throw new Error ("No APIClientsContext found");
  return APIClientsContext;
}
