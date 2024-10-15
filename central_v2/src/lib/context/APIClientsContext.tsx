import { createContext, Dispatch } from 'react';
import { IAPIClients } from '@righton/networking';

export const APIClientsContext = createContext<IAPIClients | undefined>(undefined); // eslint-disable-line