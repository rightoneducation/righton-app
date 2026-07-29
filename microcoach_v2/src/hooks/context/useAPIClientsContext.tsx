import { useContext } from 'react';
import { APIClientsContext } from '../../lib/context/APIClientsContext';

// eslint-disable-next-line import/prefer-default-export
export const useAPIClientsContext = () => useContext(APIClientsContext);
