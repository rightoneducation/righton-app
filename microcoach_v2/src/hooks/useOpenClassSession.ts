import { useNavigate } from 'react-router-dom';
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
 * pages behind it (Review, Reflect, upload) read the app-wide selection, so
 * this selects the class and session together, then navigates. Every class's
 * sessions are already in the store, so there is nothing to wait for.
 */
export function useOpenClassSession(
  sessions: UseSessionsResult,
): (target: OpenClassSessionTarget) => void {
  const navigate = useNavigate();
  return (target) => {
    sessions.select(target.classId, target.sessionId);
    navigate(target.path, { state: target.state });
  };
}
