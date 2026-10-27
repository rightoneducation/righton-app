import { useCallback, useMemo } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachClassroom } from '../api/Models/IMicroCoachClassroom';
import { loadKeys, MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { classroomList, selectedClassId } from '../lib/selectors';
import { useClassroomsLoader } from './loaders';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from './context/useMicroCoachDataContext';

export interface UseClassroomsResult {
  classrooms: IMicroCoachClassroom[];
  selectedClassroomId: string | null;
  selectedClassroom: IMicroCoachClassroom | null;
  // Selects the class and, with it, its latest session.
  selectClassroom: (classroomId: string) => void;
  status: MicroCoachDataStatus;
  error: Error | null;
}

export function useClassrooms(
  apiClients: IAPIClients,
  userId: string | null,
): UseClassroomsResult {
  useClassroomsLoader(apiClients, userId);
  const { classrooms, selection, loads } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();

  const selectClassroom = useCallback(
    (classroomId: string) => {
      dispatch({ type: 'SELECT', classId: classroomId, sessionId: null });
    },
    [dispatch],
  );

  const load = userId ? loads[loadKeys.classrooms(userId)] : undefined;
  let status = MicroCoachDataStatus.IDLE;
  if (userId) status = load?.status ?? MicroCoachDataStatus.LOADING;
  const error = load?.error ?? null;

  return useMemo(() => {
    const list = classroomList({ classrooms });
    const selectedId = selectedClassId({ classrooms, selection });
    return {
      classrooms: list,
      selectedClassroomId: selectedId,
      selectedClassroom: selectedId ? classrooms[selectedId] : null,
      selectClassroom,
      status,
      error,
    };
  }, [classrooms, error, selectClassroom, selection, status]);
}
