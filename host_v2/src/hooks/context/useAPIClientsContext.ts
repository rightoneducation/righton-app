import { useContext, Dispatch, Context } from 'react';
import { APIClients } from '@righton/networking';

export const useTSAPIClientsContext = (context: Context<APIClients | undefined>) => {
  const APIClientsContext = useContext( context );
  if (!APIClientsContext)
    throw new Error ("No APIClientsContext found");
  return APIClientsContext;
}
