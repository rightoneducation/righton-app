import { useCallback, useEffect, useMemo } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachClassroom } from '../api/Models/IMicroCoachClassroom';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from './context/useMicroCoachDataContext';

export type ClassroomsStatus = MicroCoachDataStatus;

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
  const { classrooms, selectedClassroomId, classroomsStatus, classroomsError } =
    useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();

  useEffect(() => {
    let cancelled = false;

    if (!userId) {
      dispatch({ type: 'SET_CLASSROOMS', payload: [] });
      dispatch({ type: 'SET_SELECTED_CLASSROOM_ID', payload: null });
      dispatch({ type: 'SET_CLASSROOMS_STATUS', payload: 'idle' });
      dispatch({ type: 'SET_CLASSROOMS_ERROR', payload: null });
      return undefined;
    }

    const activeUserId = userId;
    dispatch({ type: 'SET_CLASSROOMS', payload: [] });
    dispatch({ type: 'SET_SELECTED_CLASSROOM_ID', payload: null });
    dispatch({ type: 'SET_CLASSROOMS_STATUS', payload: 'loading' });
    dispatch({ type: 'SET_CLASSROOMS_ERROR', payload: null });

    async function loadClassrooms() {
      try {
        // eslint-disable-next-line no-console
        console.log('[useClassrooms] Fetching classrooms', {
          userId: activeUserId,
        });
        const fetchedClassrooms =
          await apiClients.classroom.getClassroomsByUserId(activeUserId);
        // eslint-disable-next-line no-console
        console.log('[useClassrooms] Fetched classrooms', fetchedClassrooms);
        if (cancelled) return;

        dispatch({ type: 'SET_CLASSROOMS', payload: fetchedClassrooms });
        dispatch({ type: 'SET_CLASSROOMS_STATUS', payload: 'ready' });
      } catch (error) {
        if (cancelled) return;

        // eslint-disable-next-line no-console
        console.error('[useClassrooms] Fetch failed', error);
        dispatch({
          type: 'SET_CLASSROOMS_ERROR',
          payload:
            error instanceof Error
              ? error
              : new Error('Failed to load classrooms'),
        });
        dispatch({ type: 'SET_CLASSROOMS_STATUS', payload: 'error' });
      }
    }

    loadClassrooms();

    return () => {
      cancelled = true;
    };
  }, [apiClients, dispatch, userId]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[useClassrooms] State updated', {
      status: classroomsStatus,
      selectedClassroomId,
      classrooms,
    });
  }, [classrooms, classroomsStatus, selectedClassroomId]);

  const selectClassroom = useCallback(
    (classroomId: string) => {
      dispatch({ type: 'SET_SELECTED_CLASSROOM_ID', payload: classroomId });
    },
    [dispatch],
  );

  return useMemo(() => {
    const selectedClassroom =
      classrooms.find((classroom) => classroom.id === selectedClassroomId) ??
      null;

    return {
      classrooms,
      selectedClassroomId,
      selectedClassroom,
      selectClassroom,
      status: classroomsStatus,
      error: classroomsError,
    };
  }, [
    classrooms,
    classroomsError,
    classroomsStatus,
    selectClassroom,
    selectedClassroomId,
  ]);
}
