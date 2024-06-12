import { createContext, Dispatch } from 'react';
import { APIClients } from '@righton/networking';

export const APIClientsContext = createContext<APIClients | undefined>(undefined);