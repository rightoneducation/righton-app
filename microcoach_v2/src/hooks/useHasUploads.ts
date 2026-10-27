import { useEffect } from 'react';
import { loadKeys, MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { combinedLoad } from '../lib/selectors';
import { useMicroCoachDataState } from './context/useMicroCoachDataContext';

// Null while it is still unknown.
export type HasUploads = boolean | null;

// Having uploaded never becomes untrue, so once seen it is remembered per user
// on this device and the greeting is right from the first paint next time.
const storageKey = (userId: string) => `microcoach.hasUploads.${userId}`;

function readRemembered(userId: string | null): boolean {
  if (!userId) return false;
  try {
    return window.localStorage.getItem(storageKey(userId)) === 'true';
  } catch {
    return false;
  }
}

function remember(userId: string | null) {
  if (!userId) return;
  try {
    window.localStorage.setItem(storageKey(userId), 'true');
  } catch {
    // Blocked storage only costs the shortcut; the fetch still answers.
  }
}

/**
 * Whether the teacher has uploaded for any class yet: the dashboard greets a first-time
 * teacher with "Welcome to MicroCoach" and a returning one with "Welcome back".
 * Nothing on the User row records a first login, so a session in any class is
 * the signal: read from the store, which holds every class's sessions.
 *
 * What this device remembers answers first, so the greeting is right before
 * the sessions arrive. `classesKnown` is false until the class list has
 * loaded. A failed fetch leaves the answer unknown rather than claiming "no".
 */
export function useHasUploads(
  userId: string | null,
  classesKnown: boolean,
): HasUploads {
  const { classrooms, sessions, loads } = useMicroCoachDataState();
  const hasSession = Object.keys(sessions).length > 0;
  const remembered = readRemembered(userId);

  useEffect(() => {
    if (hasSession) remember(userId);
  }, [hasSession, userId]);

  if (remembered || hasSession) return true;
  if (!classesKnown) return null;
  const load = combinedLoad(
    loads,
    Object.keys(classrooms).map((classId) => loadKeys.classChildren(classId)),
  );
  return load.status === MicroCoachDataStatus.READY ? false : null;
}
