import { useCallback, useEffect, useMemo } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from './context/useMicroCoachDataContext';

export type SessionsStatus = MicroCoachDataStatus;

export interface UseSessionsResult {
  sessions: IMicroCoachSession[];
  selectedSessionId: string | null;
  selectedSession: IMicroCoachSession | null;
  selectSession: (sessionId: string) => void;
  status: SessionsStatus;
  error: Error | null;
}

export function useSessions(
  apiClients: IAPIClients,
  classId: string | null,
): UseSessionsResult {
  const { sessions, selectedSessionId, sessionsStatus, sessionsError } =
    useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();

  useEffect(() => {
    let cancelled = false;

    if (!classId) {
      dispatch({ type: 'SET_SESSIONS', payload: [] });
      dispatch({ type: 'SET_SELECTED_SESSION_ID', payload: null });
      dispatch({ type: 'SET_SESSIONS_STATUS', payload: 'idle' });
      dispatch({ type: 'SET_SESSIONS_ERROR', payload: null });
      return undefined;
    }

    const activeClassId = classId;
    dispatch({ type: 'SET_SESSIONS', payload: [] });
    dispatch({ type: 'SET_SELECTED_SESSION_ID', payload: null });
    dispatch({ type: 'SET_SESSIONS_STATUS', payload: 'loading' });
    dispatch({ type: 'SET_SESSIONS_ERROR', payload: null });

    async function loadSessions() {
      try {
        const fetchedSessions =
          await apiClients.session.getSessionsByClassId(activeClassId);
        if (cancelled) return;

        dispatch({ type: 'SET_SESSIONS', payload: fetchedSessions });
        dispatch({ type: 'SET_SESSIONS_STATUS', payload: 'ready' });
      } catch (error) {
        if (cancelled) return;

        dispatch({
          type: 'SET_SESSIONS_ERROR',
          payload:
            error instanceof Error
              ? error
              : new Error('Failed to load sessions'),
        });
        dispatch({ type: 'SET_SESSIONS_STATUS', payload: 'error' });
      }
    }

    loadSessions();

    return () => {
      cancelled = true;
    };
  }, [apiClients, classId, dispatch]);

  const selectSession = useCallback(
    (sessionId: string) => {
      dispatch({ type: 'SET_SELECTED_SESSION_ID', payload: sessionId });
    },
    [dispatch],
  );

  return useMemo(() => {
    const selectedSession =
      sessions.find((session) => session.id === selectedSessionId) ?? null;

    return {
      sessions,
      selectedSessionId,
      selectedSession,
      selectSession,
      status: sessionsStatus,
      error: sessionsError,
    };
  }, [
    selectSession,
    selectedSessionId,
    sessions,
    sessionsError,
    sessionsStatus,
  ]);
}
