import { useOutletContext } from 'react-router-dom';
import { APIClients } from '../api';
import { IUserState } from './useUserState';
import { IPlanItemsState } from './usePlanItems';

// The single shared-state read in the app. RootLayout owns the user state and
// hands it (with the API clients) through the router's Outlet; AppSwitch reads
// it once here and passes both down as ordinary props. Mutable state shared by
// sibling routes has to live above them, and Outlet context is React Router's
// own channel for that — this replaces the app's own providers.
export interface IAppOutletContext {
  apiClients: APIClients;
  user: IUserState;
  plan: IPlanItemsState;
}

// eslint-disable-next-line import/prefer-default-export
export const useAppOutletContext = () => useOutletContext<IAppOutletContext>();
