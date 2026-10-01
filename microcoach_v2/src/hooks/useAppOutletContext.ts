import { useOutletContext } from 'react-router-dom';
import { APIClients } from '../api';
import { UseClassroomsResult } from './useClassrooms';
import { IPlanItemsState } from './usePlanItems';
import { UseSessionsResult } from './useSessions';
import { IUserState } from './useUserState';

// RootLayout passes the API clients through the router's Outlet. Shared data
// lives in MicroCoachDataContext, and AppSwitch creates the action handlers.
export interface IAppOutletContext {
  apiClients: APIClients;
  user: IUserState;
  classrooms: UseClassroomsResult;
  sessions: UseSessionsResult;
  plan: IPlanItemsState;
}

// eslint-disable-next-line import/prefer-default-export
export const useAppOutletContext = () => useOutletContext<IAppOutletContext>();
