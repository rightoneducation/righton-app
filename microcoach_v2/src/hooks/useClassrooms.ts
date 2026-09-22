import { useCallback, useEffect, useMemo, useState } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachClassroom } from '../api/Models/IMicroCoachClassroom';

export type ClassroomsStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface UseClassroomsResult {
  classrooms: IMicroCoachClassroom[];
  selectedClassroomId: string | null;
  selectedClassroom: IMicroCoachClassroom | null;
  selectClassroom: (classroomId: string) => void;
  status: ClassroomsStatus;
  error: Error | null;
}

export function useClassrooms(
  apiClients: IAPIClients,
  userId: string | null,
): UseClassroomsResult {
  const [classrooms, setClassrooms] = useState<IMicroCoachClassroom[]>([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(
    null,
  );
  const [classroomsStatus, setClassroomsStatus] =
    useState<ClassroomsStatus>('idle');
  const [classroomsError, setClassroomsError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!userId) {
      setClassrooms([]);
      setSelectedClassroomId(null);
      setClassroomsStatus('idle');
      setClassroomsError(null);
      return undefined;
    }

    const activeUserId = userId;
    setClassrooms([]);
    setSelectedClassroomId(null);
    setClassroomsStatus('loading');
    setClassroomsError(null);

    async function loadClassrooms() {
      try {
        const fetchedClassrooms =
          await apiClients.classroom.getClassroomsByUserId(activeUserId);
        if (cancelled) return;

        setClassrooms(fetchedClassrooms);
        setClassroomsStatus('ready');
      } catch (error) {
        if (cancelled) return;

        setClassroomsError(
          error instanceof Error
            ? error
            : new Error('Failed to load classrooms'),
        );
        setClassroomsStatus('error');
      }
    }

    loadClassrooms();

    return () => {
      cancelled = true;
    };
  }, [apiClients, userId]);

  const selectClassroom = useCallback((classroomId: string) => {
    setSelectedClassroomId(classroomId);
  }, []);

  return useMemo(
    () => {
      const selectedClassroom =
        classrooms.find(
          (classroom) => classroom.id === selectedClassroomId,
        ) ?? null;

      return {
        classrooms,
        selectedClassroomId,
        selectedClassroom,
        selectClassroom,
        status: classroomsStatus,
        error: classroomsError,
      };
    },
    [
      classrooms,
      classroomsError,
      classroomsStatus,
      selectClassroom,
      selectedClassroomId,
    ],
  );
}
