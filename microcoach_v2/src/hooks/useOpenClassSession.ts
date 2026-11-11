import { useNavigate } from 'react-router-dom';
import { withSelection } from '../lib/selectionParams';

export interface OpenClassSessionTarget {
  classId: string;
  // The session to open; null opens the class with its latest session.
  sessionId: string | null;
  path: string;
  state?: unknown;
}

/**
 * Opens a class's session on another page from the cross-class lists and the
 * flow pages' class switcher. The class and session go in the URL, which the
 * pages behind it (Review, Reflect, upload) read, so Back returns to the
 * class the teacher came from. The store follows the URL (RootLayout), so a
 * navigation the upload's leave dialog cancels leaves it untouched.
 */
export function useOpenClassSession(): (target: OpenClassSessionTarget) => void {
  const navigate = useNavigate();
  return ({ classId, sessionId, path, state }) => {
    navigate(withSelection(path, { classId, sessionId }), { state });
  };
}
