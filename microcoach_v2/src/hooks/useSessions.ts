import { useCallback, useEffect, useMemo, useState } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';

export type SessionsStatus = 'idle' | 'loading' | 'ready' | 'error';

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
  const [sessions, setSessions] = useState<IMicroCoachSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [sessionsStatus, setSessionsStatus] =
    useState<SessionsStatus>('idle');
  const [sessionsError, setSessionsError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!classId) {
      setSessions([]);
      setSelectedSessionId(null);
      setSessionsStatus('idle');
      setSessionsError(null);
      return undefined;
    }

    const activeClassId = classId;
    setSessions([]);
    setSelectedSessionId(null);
    setSessionsStatus('loading');
    setSessionsError(null);

    async function loadSessions() {
      try {
        const fetchedSessions =
          await apiClients.session.getSessionsByClassId(activeClassId);
        if (cancelled) return;

        setSessions(fetchedSessions);
        setSessionsStatus('ready');
      } catch (error) {
        if (cancelled) return;

        setSessionsError(
          error instanceof Error
            ? error
            : new Error('Failed to load sessions'),
        );
        setSessionsStatus('error');
      }
    }

    loadSessions();

    return () => {
      cancelled = true;
    };
  }, [apiClients, classId]);

  const selectSession = useCallback((sessionId: string) => {
    setSelectedSessionId(sessionId);
  }, []);

  return useMemo(
    () => {
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
    },
    [
      selectSession,
      selectedSessionId,
      sessions,
      sessionsError,
      sessionsStatus,
    ],
  );
}
