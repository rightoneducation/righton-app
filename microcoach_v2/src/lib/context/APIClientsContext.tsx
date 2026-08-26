import { createContext } from 'react';
import { APIClients } from '../../api';

// Holds the constructed MicroCoach API clients (auth / user / dataManager).
// eslint-disable-next-line import/prefer-default-export
export const APIClientsContext = createContext<APIClients | null>(null);
