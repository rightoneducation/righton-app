import { matchPath } from 'react-router-dom';

/*
 * The flow pages carry the class and session they show in the URL
 * (`?class=…&session=…`), so a history entry keeps the class it was opened
 * with: Back after a class switch returns to the old class, not the old page
 * against the new class. The store's selection is only the last one used, for
 * the screens without them (Home, a fresh visit).
 */
export const CLASS_PARAM = 'class';
export const SESSION_PARAM = 'session';

export interface ISelectionIds {
  classId: string | null;
  sessionId: string | null;
}

/** The URL's selection, or null when it names no class. */
export function readSelectionParams(params: URLSearchParams): ISelectionIds | null {
  const classId = params.get(CLASS_PARAM);
  if (!classId) return null;
  return { classId, sessionId: params.get(SESSION_PARAM) };
}

/** `path` with the selection as its query; unchanged without a class. */
export function withSelection(path: string, { classId, sessionId }: ISelectionIds): string {
  if (!classId) return path;
  const params = new URLSearchParams({ [CLASS_PARAM]: classId });
  if (sessionId) params.set(SESSION_PARAM, sessionId);
  return `${path}?${params.toString()}`;
}

/** `params` with the selection set in it; a missing session is removed. */
export function setSelectionParams(
  params: URLSearchParams,
  { classId, sessionId }: ISelectionIds,
): URLSearchParams {
  const next = new URLSearchParams(params);
  if (classId) next.set(CLASS_PARAM, classId);
  else next.delete(CLASS_PARAM);
  if (sessionId) next.set(SESSION_PARAM, sessionId);
  else next.delete(SESSION_PARAM);
  return next;
}

// The routes that show one class's session (App.tsx).
const FLOW_PATTERNS = [
  '/review',
  '/review/:misconceptionId/activities',
  '/activity/*',
  '/myactivity',
  '/reflect',
  '/upload-miu/*',
  '/upload-reassess/*',
];

export const isFlowPath = (pathname: string) =>
  FLOW_PATTERNS.some((pattern) => matchPath(pattern, pathname) !== null);
