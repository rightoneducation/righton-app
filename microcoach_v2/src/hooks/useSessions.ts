import { useCallback, useEffect, useMemo, useRef } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { sortSessionsLatestFirst } from '../lib/flowProgress';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from './context/useMicroCoachDataContext';

export interface UseSessionsResult {
  sessions: IMicroCoachSession[];
  selectedSessionId: string | null;
  selectedSession: IMicroCoachSession | null;
  selectSession: (sessionId: string) => void;
  // Records the misconception picked on Review on the selected session, which
  // moves the class to Select Activity. Optimistic; rolled back on failure.
  selectMisconception: (misconceptionId: string) => void;
  status: MicroCoachDataStatus;
  error: Error | null;
}

export function useSessions(
  apiClients: IAPIClients,
  classId: string | null,
): UseSessionsResult {
  const {
    sessions,
    selectedSessionId,
    sessionsStatus,
    sessionsError,
    classActivity,
    classActivityStatus,
  } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  // The cross-class data already holds every class's sessions; read inside
  // the effect so it answers a class switch without refetching, but its
  // arrival is not itself a reason to rerun.
  const cachedRef = useRef<IMicroCoachSession[] | null>(null);
  cachedRef.current =
    (classActivityStatus === MicroCoachDataStatus.READY &&
      classActivity?.perClass.find((record) => record.classroom.id === classId)
        ?.sessions) ||
    null;

  useEffect(() => {
    let cancelled = false;

    if (!classId) {
      dispatch({ type: 'SET_SESSIONS', payload: [] });
      dispatch({ type: 'SET_SELECTED_SESSION_ID', payload: null });
      dispatch({
        type: 'SET_SESSIONS_STATUS',
        payload: MicroCoachDataStatus.IDLE,
      });
      dispatch({ type: 'SET_SESSIONS_ERROR', payload: null });
      return undefined;
    }

    const cached = cachedRef.current;
    if (cached) {
      const sortedSessions = sortSessionsLatestFirst(cached);
      dispatch({ type: 'SET_SESSIONS', payload: sortedSessions });
      dispatch({
        type: 'SET_SELECTED_SESSION_ID',
        payload: sortedSessions[0]?.id ?? null,
      });
      dispatch({
        type: 'SET_SESSIONS_STATUS',
        payload: MicroCoachDataStatus.READY,
      });
      dispatch({ type: 'SET_SESSIONS_ERROR', payload: null });
      return undefined;
    }

    const activeClassId = classId;
    dispatch({ type: 'SET_SESSIONS', payload: [] });
    dispatch({ type: 'SET_SELECTED_SESSION_ID', payload: null });
    dispatch({
      type: 'SET_SESSIONS_STATUS',
      payload: MicroCoachDataStatus.LOADING,
    });
    dispatch({ type: 'SET_SESSIONS_ERROR', payload: null });

    async function loadSessions() {
      try {
        const fetchedSessions =
          await apiClients.session.getSessionsByClassId(activeClassId);
        if (cancelled) return;

        const sortedSessions = sortSessionsLatestFirst(fetchedSessions);
        dispatch({ type: 'SET_SESSIONS', payload: sortedSessions });
        dispatch({
          type: 'SET_SELECTED_SESSION_ID',
          payload: sortedSessions[0]?.id ?? null,
        });
        dispatch({
          type: 'SET_SESSIONS_STATUS',
          payload: MicroCoachDataStatus.READY,
        });
      } catch (error) {
        if (cancelled) return;

        dispatch({
          type: 'SET_SESSIONS_ERROR',
          payload:
            error instanceof Error
              ? error
              : new Error('Failed to load sessions'),
        });
        dispatch({
          type: 'SET_SESSIONS_STATUS',
          payload: MicroCoachDataStatus.ERROR,
        });
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

  const selectedSession =
    sessions.find((session) => session.id === selectedSessionId) ?? null;
  const selectMisconception = useCallback(
    (misconceptionId: string) => {
      if (!selectedSession) return;
      const { id, selectedMisconceptionId: previous } = selectedSession;
      if (previous === misconceptionId) return;
      dispatch({
        type: 'UPDATE_SESSION',
        payload: { id, changes: { selectedMisconceptionId: misconceptionId } },
      });
      apiClients.session
        .setSelectedMisconception(id, misconceptionId)
        .catch((error) => {
          dispatch({
            type: 'UPDATE_SESSION',
            payload: { id, changes: { selectedMisconceptionId: previous } },
          });
          // eslint-disable-next-line no-console
          console.error('[useSessions] Failed to save the picked misconception', error);
        });
    },
    [apiClients, dispatch, selectedSession],
  );

  return useMemo(
    () => ({
      sessions,
      selectedSessionId,
      selectedSession,
      selectSession,
      selectMisconception,
      status: sessionsStatus,
      error: sessionsError,
    }),
    [
      selectMisconception,
      selectedSession,
      selectSession,
      selectedSessionId,
      sessions,
      sessionsError,
      sessionsStatus,
    ],
  );
}
