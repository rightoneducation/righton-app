import { useMemo } from 'react';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { IReflect } from '../lib/PipelineModels';
import buildReflectionResults from '../lib/reflectionResults';
import { useMicroCoachDataState } from './context/useMicroCoachDataContext';

export interface UseReflectionResultsResult {
  reflect: IReflect;
  status: MicroCoachDataStatus;
  error: Error | null;
}

// Reflect is derived from session results plus activity and misconception
// metadata that are already loaded into the shared MicroCoach data context.
export default function useReflectionResults(): UseReflectionResultsResult {
  const {
    sessions,
    selectedSessionId,
    sessionsStatus,
    sessionsError,
    misconceptions,
    misconceptionsStatus,
    misconceptionsError,
  } = useMicroCoachDataState();

  const selectedSession = useMemo(
    () =>
      sessions.find((session) => session.id === selectedSessionId) ?? null,
    [selectedSessionId, sessions],
  );
  const reflect = useMemo(
    () => buildReflectionResults(selectedSession, misconceptions),
    [misconceptions, selectedSession],
  );

  let status = MicroCoachDataStatus.LOADING;
  if (
    sessionsStatus === MicroCoachDataStatus.ERROR ||
    misconceptionsStatus === MicroCoachDataStatus.ERROR
  ) {
    status = MicroCoachDataStatus.ERROR;
  } else if (
    sessionsStatus === MicroCoachDataStatus.READY &&
    misconceptionsStatus === MicroCoachDataStatus.READY
  ) {
    status = MicroCoachDataStatus.READY;
  } else if (
    sessionsStatus === MicroCoachDataStatus.IDLE &&
    misconceptionsStatus === MicroCoachDataStatus.IDLE
  ) {
    status = MicroCoachDataStatus.IDLE;
  }

  return {
    reflect,
    status,
    error: sessionsError ?? misconceptionsError,
  };
}
