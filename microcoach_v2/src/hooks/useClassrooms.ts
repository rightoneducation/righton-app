import { useCallback, useEffect, useMemo, useState } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachClassroom } from '../api/Models/IMicroCoachClassroom';
import { UserStatusType } from '../lib/MicroCoachModels';
import { IUserState } from './useUserState';

// The signed-in teacher's classrooms and which one they are working in. Owned
// by RootLayout beside user and plan, because the header's class switcher and
// the dashboard's chips are two views of one selection.
//
// Rows are keyed by the User row's `id`, not the Cognito sub — that is what
// MicroCoachClassroom.userId holds.
export interface IClassroomsState {
  classrooms: IMicroCoachClassroom[];
  selectedClassId: string;
  // False until the first fetch for the current user settles, so the dashboard
  // can tell "no classes" apart from "not loaded yet".
  isLoaded: boolean;
  selectClass: (id: string) => void;
  // Creates the row, appends it and selects it. Resolves null when the create
  // did not land, so the caller can show its own error.
  addClass: (name: string) => Promise<IMicroCoachClassroom | null>;
}

// Create input for a new class. id and timestamps are server-assigned; the
// parser only forwards the writable fields, so leaving them unset is safe.
export function newClassroom(userId: string, name: string): IMicroCoachClassroom {
  return {
    userId,
    name: name.trim(),
    grade: null,
    state: null,
    schoolYear: null,
  } as IMicroCoachClassroom;
}

export interface ClassroomsProps {
  classrooms: IClassroomsState;
}

export function useClassrooms(
  apiClients: IAPIClients,
  user: IUserState,
): IClassroomsState {
  const [classrooms, setClassrooms] = useState<IMicroCoachClassroom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const { userStatus } = user;
  const userId = user.userProfile?.id;
  const isSignedIn = userStatus === UserStatusType.LOGGEDIN && !!userId;
  const isAuthResolved = userStatus !== UserStatusType.LOADING;

  useEffect(() => {
    if (!isSignedIn || !userId) {
      setClassrooms([]);
      setSelectedClassId('');
      // Signed out there is nothing to fetch, so "loaded" once auth has
      // resolved — otherwise a signed-out screen would wait on it forever.
      setIsLoaded(isAuthResolved);
      return undefined;
    }
    setIsLoaded(false);
    // A sign-out or account switch mid-request must not land the previous
    // user's classes.
    let isCancelled = false;
    apiClients.classroom
      .getClassroomsByUserId(userId)
      .then((rows) => {
        if (isCancelled) return;
        const sorted = [...rows].sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt),
        );
        setClassrooms(sorted);
        setSelectedClassId((prev) =>
          sorted.some((c) => c.id === prev) ? prev : (sorted[0]?.id ?? ''),
        );
      })
      .catch((error) => {
        console.error('Could not load classrooms', error);
        if (!isCancelled) setClassrooms([]);
      })
      .finally(() => {
        if (!isCancelled) setIsLoaded(true);
      });
    return () => {
      isCancelled = true;
    };
  }, [apiClients, isSignedIn, isAuthResolved, userId]);

  const selectClass = useCallback((id: string) => setSelectedClassId(id), []);

  const addClass = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!userId || !trimmed) return null;
      try {
        const created = await apiClients.classroom.createClassroom(
          newClassroom(userId, trimmed),
        );
        if (!created) return null;
        setClassrooms((prev) => [...prev, created]);
        setSelectedClassId(created.id);
        return created;
      } catch (error) {
        console.error('Could not create classroom', error);
        return null;
      }
    },
    [apiClients, userId],
  );

  return useMemo(
    () => ({ classrooms, selectedClassId, isLoaded, selectClass, addClass }),
    [classrooms, selectedClassId, isLoaded, selectClass, addClass],
  );
}
