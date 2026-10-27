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
 * Switching class makes useSessions load that class's sessions (from the
 * cross-class data when it holds them, else a fetch) and select the latest,
 * so the navigation waits until the list on hand is the target class's before
 * selecting the target session. A failed session fetch still navigates, with
 * the class selected, and so does a loaded list that lacks the target: the
 * page then shows the class's latest session rather than waiting for one that
 * will not arrive.
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
    // This effect can run before useSessions' own (child effects first), so a
    // READY list may still be the previous class's: check whose it is.
    // An empty list says nothing about whose it is; a row that names a
    // session came from that class's list, so it is never empty for it.
    const loaded =
      sessions.status === MicroCoachDataStatus.READY &&
      sessions.sessions.every((session) => session.classId === pending.classId) &&
      !(pending.sessionId && sessions.sessions.length === 0);
    if (!failed && !loaded) return;
    const hasTarget =
      pending.sessionId === null ||
      sessions.sessions.some((session) => session.id === pending.sessionId);
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
