import { useOutletContext } from 'react-router-dom';
import { APIClients } from '../api';

// RootLayout passes the API clients through the router's Outlet. Shared data
// lives in MicroCoachDataContext, and AppSwitch creates the action handlers.
export interface IAppOutletContext {
  apiClients: APIClients;
}

// eslint-disable-next-line import/prefer-default-export
export const useAppOutletContext = () => useOutletContext<IAppOutletContext>();
