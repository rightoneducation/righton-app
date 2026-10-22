import { useCallback, useEffect, useMemo } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachClassroom } from '../api/Models/IMicroCoachClassroom';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from './context/useMicroCoachDataContext';

export interface UseClassroomsResult {
  classrooms: IMicroCoachClassroom[];
  selectedClassroomId: string | null;
  selectedClassroom: IMicroCoachClassroom | null;
  selectClassroom: (classroomId: string) => void;
  status: MicroCoachDataStatus;
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
      dispatch({
        type: 'SET_CLASSROOMS_STATUS',
        payload: MicroCoachDataStatus.IDLE,
      });
      dispatch({ type: 'SET_CLASSROOMS_ERROR', payload: null });
      return undefined;
    }

    const activeUserId = userId;
    dispatch({ type: 'SET_CLASSROOMS', payload: [] });
    dispatch({ type: 'SET_SELECTED_CLASSROOM_ID', payload: null });
    dispatch({
      type: 'SET_CLASSROOMS_STATUS',
      payload: MicroCoachDataStatus.LOADING,
    });
    dispatch({ type: 'SET_CLASSROOMS_ERROR', payload: null });

    async function loadClassrooms() {
      try {
        const fetchedClassrooms =
          await apiClients.classroom.getClassroomsByUserId(activeUserId);
        if (cancelled) return;

        const sortedClassrooms = [...fetchedClassrooms].sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt),
        );
        dispatch({ type: 'SET_CLASSROOMS', payload: sortedClassrooms });
        dispatch({
          type: 'SET_SELECTED_CLASSROOM_ID',
          payload: sortedClassrooms[0]?.id ?? null,
        });
        dispatch({
          type: 'SET_CLASSROOMS_STATUS',
          payload: MicroCoachDataStatus.READY,
        });
      } catch (error) {
        if (cancelled) return;

        dispatch({
          type: 'SET_CLASSROOMS_ERROR',
          payload:
            error instanceof Error
              ? error
              : new Error('Failed to load classrooms'),
        });
        dispatch({
          type: 'SET_CLASSROOMS_STATUS',
          payload: MicroCoachDataStatus.ERROR,
        });
      }
    }

    loadClassrooms();

    return () => {
      cancelled = true;
    };
  }, [apiClients, dispatch, userId]);

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
