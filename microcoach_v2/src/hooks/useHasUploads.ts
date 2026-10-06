import { useEffect, useState } from 'react';
import { IAPIClients } from '../api';

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
 * the signal.
 *
 * Answered, cheapest first, by: what this device remembers; `knownUploaded`
 * (the selected class's own sessions, already fetched); one session query per
 * class (a teacher has a handful). `classIds` is null until the class list has
 * loaded. A failed fetch leaves the answer unknown rather than claiming "no".
 */
export function useHasUploads(
  apiClients: IAPIClients,
  userId: string | null,
  classIds: string[] | null,
  knownUploaded: boolean,
): HasUploads {
  const remembered = readRemembered(userId);
  const isKnownTrue = remembered || knownUploaded;
  const classKey = classIds?.join(',') ?? null;
  const [result, setResult] = useState<{
    classKey: string;
    hasUploads: boolean;
  } | null>(null);

  useEffect(() => {
    if (knownUploaded) remember(userId);
  }, [knownUploaded, userId]);

  useEffect(() => {
    if (isKnownTrue || classKey === null) return undefined;
    if (!classKey) {
      setResult({ classKey, hasUploads: false });
      return undefined;
    }

    let cancelled = false;
    Promise.all(
      classKey
        .split(',')
        .map((id) => apiClients.session.getSessionsByClassId(id)),
    )
      .then((lists) => {
        if (cancelled) return;
        const hasUploads = lists.some((list) => list.length > 0);
        if (hasUploads) remember(userId);
        setResult({ classKey, hasUploads });
      })
      .catch((error) => {
        console.error('Could not check for earlier uploads', error);
      });
    return () => {
      cancelled = true;
    };
  }, [apiClients, classKey, isKnownTrue, userId]);

  if (isKnownTrue) return true;
  return result !== null && result.classKey === classKey
    ? result.hasUploads
    : null;
}
