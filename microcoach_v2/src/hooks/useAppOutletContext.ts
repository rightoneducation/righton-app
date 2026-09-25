import { useOutletContext } from 'react-router-dom';
import { APIClients } from '../api';
import { IUserState } from './useUserState';

// RootLayout now passes the API clients and user actions through the router's
// Outlet. AppSwitch reads them here, while shared data lives in
// MicroCoachDataContext.
export interface IAppOutletContext {
  apiClients: APIClients;
  user: IUserState;
}

// eslint-disable-next-line import/prefer-default-export
export const useAppOutletContext = () => useOutletContext<IAppOutletContext>();
