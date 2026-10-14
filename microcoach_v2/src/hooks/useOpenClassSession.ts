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
 * selected, and so does a loaded list that lacks the target: the page then
 * shows the class's latest session rather than waiting for one that will not
 * arrive.
 */
export function useOpenClassSession(
  classrooms: UseClassroomsResult,
  sessions: UseSessionsResult,
): (target: OpenClassSessionTarget) => void {
  const navigate = useNavigate();
  // awaitingReload: the class is being switched, so the session list on hand
  // is the old class's until useSessions reports LOADING for the new one.
  const [pending, setPending] = useState<
    (OpenClassSessionTarget & { awaitingReload: boolean }) | null
  >(null);
  const { selectSession } = sessions;

  useEffect(() => {
    if (!pending || classrooms.selectedClassroomId !== pending.classId) return;
    if (pending.awaitingReload) {
      // This effect can run before useSessions' own (child effects first), so
      // READY here may still describe the previous class.
      if (sessions.status === MicroCoachDataStatus.LOADING) {
        setPending({ ...pending, awaitingReload: false });
      }
      return;
    }
    const failed = sessions.status === MicroCoachDataStatus.ERROR;
    const loaded = sessions.status === MicroCoachDataStatus.READY;
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
    const isSwitching = classrooms.selectedClassroomId !== target.classId;
    if (isSwitching) classrooms.selectClassroom(target.classId);
    setPending({ ...target, awaitingReload: isSwitching });
  };
}
