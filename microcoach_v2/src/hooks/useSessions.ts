import { useCallback, useMemo } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { loadKeys, MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { classSessions, selectedClassId, selectedSession } from '../lib/selectors';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from './context/useMicroCoachDataContext';

export interface UseSessionsResult {
  // The selected class's sessions, latest first.
  sessions: IMicroCoachSession[];
  selectedSessionId: string | null;
  selectedSession: IMicroCoachSession | null;
  // Selects a class and one of its sessions together (null: its latest).
  select: (classId: string, sessionId: string | null) => void;
  selectSession: (sessionId: string) => void;
  // Records the misconception picked on Review on the selected session, which
  // moves the class to Select Activity. Optimistic; rolled back on failure.
  selectMisconception: (misconceptionId: string) => void;
  status: MicroCoachDataStatus;
  error: Error | null;
}

/** The selected class's sessions, read from the store (useClassChildrenLoader fills it). */
export function useSessions(apiClients: IAPIClients): UseSessionsResult {
  const { classrooms, sessions, selection, loads } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const classId = selectedClassId({ classrooms, selection });
  const session = selectedSession({ classrooms, sessions, selection });

  const select = useCallback(
    (nextClassId: string, sessionId: string | null) => {
      dispatch({ type: 'SELECT', classId: nextClassId, sessionId });
    },
    [dispatch],
  );

  const selectSession = useCallback(
    (sessionId: string) => {
      dispatch({
        type: 'SELECT',
        classId: sessions[sessionId]?.classId ?? classId,
        sessionId,
      });
    },
    [classId, dispatch, sessions],
  );

  const selectMisconception = useCallback(
    (misconceptionId: string) => {
      if (!session || session.selectedMisconceptionId === misconceptionId) return;
      dispatch({
        type: 'UPSERT_ROWS',
        table: 'sessions',
        rows: [{ ...session, selectedMisconceptionId: misconceptionId }],
      });
      apiClients.session
        .setSelectedMisconception(session.id, misconceptionId)
        .catch((error) => {
          dispatch({ type: 'UPSERT_ROWS', table: 'sessions', rows: [session] });
          // eslint-disable-next-line no-console
          console.error('[useSessions] Failed to save the picked misconception', error);
        });
    },
    [apiClients, dispatch, session],
  );

  const load = classId ? loads[loadKeys.classChildren(classId)] : undefined;
  let status = MicroCoachDataStatus.IDLE;
  if (classId) status = load?.status ?? MicroCoachDataStatus.LOADING;
  const error = load?.error ?? null;

  const list = useMemo(() => classSessions({ sessions }, classId), [classId, sessions]);

  return useMemo(
    () => ({
      sessions: list,
      selectedSessionId: session?.id ?? null,
      selectedSession: session,
      select,
      selectSession,
      selectMisconception,
      status,
      error,
    }),
    [error, list, select, selectMisconception, selectSession, session, status],
  );
}
