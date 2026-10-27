import { useMemo } from 'react';
import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { sessionMisconceptions } from '../lib/selectors';
import { useMicroCoachDataState } from './context/useMicroCoachDataContext';
import { useAppOutletContext } from './useAppOutletContext';
import { useSessionChildrenLoader } from './loaders';

export interface UseSessionMisconceptionsResult {
  // Ranked, each with its activities.
  misconceptions: IMicroCoachMisconception[];
  status: MicroCoachDataStatus;
  error: Error | null;
}

/**
 * A session's misconceptions, for the pages that show them (Review, Select
 * Activity, the activity flow, My Activity, Reflect). Asking for them is what
 * fetches them, once per session: Home never does, so picking a class there
 * runs no query.
 */
export function useSessionMisconceptions(
  session: IMicroCoachSession | null,
): UseSessionMisconceptionsResult {
  const { apiClients } = useAppOutletContext();
  const load = useSessionChildrenLoader(apiClients, session);
  const { misconceptions, activities } = useMicroCoachDataState();
  const sessionId = session?.id ?? null;

  const list = useMemo(
    () => sessionMisconceptions({ misconceptions, activities }, sessionId),
    [activities, misconceptions, sessionId],
  );
  return { misconceptions: list, status: load.status, error: load.error };
}
