import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IMicroCoachDataState } from '../lib/MicroCoachModels';
import { readSelectionParams, withSelection } from '../lib/selectionParams';
import { useMicroCoachDataState } from './context/useMicroCoachDataContext';

type Selection = IMicroCoachDataState['selection'];

/**
 * The selection this page shows: the URL's when it names a class, else the
 * store's last one. Raw ids: the selectors resolve them against the tables
 * (an unknown class falls back to the first, a session of another class to
 * that class's latest).
 */
export function useEffectiveSelection(): Selection {
  const [params] = useSearchParams();
  const { selection } = useMicroCoachDataState();
  const fromUrl = readSelectionParams(params);
  const classId = fromUrl?.classId ?? null;
  const sessionId = fromUrl?.sessionId ?? null;
  return useMemo(
    () => (classId ? { classId, sessionId } : selection),
    [classId, selection, sessionId],
  );
}

/**
 * Builds a flow path that keeps this page's selection, so moving within the
 * flow keeps the history entry's class.
 */
export function useSelectionPath(): (path: string) => string {
  const { classId, sessionId } = useEffectiveSelection();
  return useCallback(
    (path: string) => withSelection(path, { classId, sessionId }),
    [classId, sessionId],
  );
}
