import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { UseClassroomsResult } from './useClassrooms';
import { UseSessionsResult } from './useSessions';

export interface OpenClassSessionTarget {
  classId: string;
  // The session to open; null opens the class with its latest session.
  sessionId: string | null;
  path: string;
  state?: unknown;
}

/**
 * Opens a class's session on another page from the cross-class lists. The
 * pages behind it (Review, Reflect, upload) read the app-wide selected class
 * and session, so this selects both, then navigates.
 *
 * Switching class makes useSessions refetch and select that class's latest
 * session, so the navigation waits until the target session is in the list
 * before selecting it. A failed session fetch still navigates, with the class
 * selected.
 */
export function useOpenClassSession(
  classrooms: UseClassroomsResult,
  sessions: UseSessionsResult,
): (target: OpenClassSessionTarget) => void {
  const navigate = useNavigate();
  const [pending, setPending] = useState<OpenClassSessionTarget | null>(null);
  const { selectSession } = sessions;

  useEffect(() => {
    if (!pending || classrooms.selectedClassroomId !== pending.classId) return;
    const failed = sessions.status === MicroCoachDataStatus.ERROR;
    const hasTarget =
      pending.sessionId === null ||
      sessions.sessions.some((session) => session.id === pending.sessionId);
    if (!failed && !(sessions.status === MicroCoachDataStatus.READY && hasTarget)) {
      return;
    }
    if (pending.sessionId && hasTarget) selectSession(pending.sessionId);
    navigate(pending.path, { state: pending.state });
    setPending(null);
  }, [
    pending,
    classrooms.selectedClassroomId,
    sessions.status,
    sessions.sessions,
    selectSession,
    navigate,
  ]);

  return (target) => {
    if (classrooms.selectedClassroomId !== target.classId) {
      classrooms.selectClassroom(target.classId);
    }
    setPending(target);
  };
}
