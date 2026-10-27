import { useMemo } from 'react';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { IReflect } from '../lib/PipelineModels';
import buildReflectionResults from '../lib/reflectionResults';
import { useSessionMisconceptions } from './useSessionMisconceptions';

export interface UseReflectionResultsResult {
  reflect: IReflect;
  status: MicroCoachDataStatus;
  error: Error | null;
}

// Reflect is derived from the session's results plus its misconceptions and
// their activities.
export default function useReflectionResults(
  session: IMicroCoachSession | null,
): UseReflectionResultsResult {
  const { misconceptions, status, error } = useSessionMisconceptions(session);
  const reflect = useMemo(
    () => buildReflectionResults(session, misconceptions),
    [misconceptions, session],
  );
  return { reflect, status, error };
}
