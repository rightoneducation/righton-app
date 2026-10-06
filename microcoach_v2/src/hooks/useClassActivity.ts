import { useCallback, useEffect, useState } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachClassroom } from '../api/Models/IMicroCoachClassroom';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { SessionStatus } from '../AWSAPI';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { deriveCurrentStep } from '../lib/flowProgress';
import { IPastActivity, IWeeklyClassProgress } from '../lib/ActivityListModels';
import { weekOf } from '../lib/weeks';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from './context/useMicroCoachDataContext';

export interface UseClassActivityResult {
  thisWeek: IWeeklyClassProgress[];
  past: IPastActivity[];
  status: MicroCoachDataStatus;
  // Deletes the session; resolves false when the delete failed.
  removeSession: (sessionId: string) => Promise<boolean>;
}

interface ClassActivity {
  thisWeek: IWeeklyClassProgress[];
  past: IPastActivity[];
}

const EMPTY: ClassActivity = { thisWeek: [], past: [] };

// The latest session created in the current calendar week, if any.
function thisWeeksSession(
  sessions: IMicroCoachSession[],
  currentWeek: string,
): IMicroCoachSession | null {
  return (
    sessions
      .filter((session) => weekOf(session.createdAt) === currentWeek)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null
  );
}

async function loadClassActivity(
  apiClients: IAPIClients,
  classrooms: IMicroCoachClassroom[],
): Promise<ClassActivity> {
  const currentWeek = weekOf(new Date().toISOString());

  const perClass = await Promise.all(
    classrooms.map(async (classroom) => {
      const [sessions, students, plans] = await Promise.all([
        apiClients.session.getSessionsByClassId(classroom.id),
        apiClients.student.getStudentsByClassId(classroom.id),
        apiClients.savedPlan.getSavedPlansByClassId(classroom.id),
      ]);
      return { classroom, sessions, studentCount: students.length, plans };
    }),
  );

  const thisWeek = perClass.map(({ classroom, sessions, studentCount, plans }) => {
    const current = thisWeeksSession(sessions, currentWeek);
    const hasSavedPlan =
      !!current && plans.some((plan) => plan.sessionId === current.id);
    return {
      classId: classroom.id,
      sessionId: current?.id ?? null,
      className: classroom.name,
      studentCount,
      step: deriveCurrentStep(current, hasSavedPlan),
      isAwaitingResults: current?.status === SessionStatus.DATA_INGESTED,
    };
  });

  const completed = perClass.flatMap(({ classroom, sessions, studentCount, plans }) =>
    sessions
      .filter((session) => session.status === SessionStatus.COMPLETED)
      .map((session) => ({
        session,
        classroom,
        studentCount,
        activityId:
          plans.find((plan) => plan.sessionId === session.id)?.items[0]?.id ??
          null,
      })),
  );

  // One lookup per distinct activity. A failed lookup only blanks that name.
  const activityIds = Array.from(
    new Set(completed.flatMap((row) => (row.activityId ? [row.activityId] : []))),
  );
  const titles = new Map(
    await Promise.all(
      activityIds.map(async (id) => {
        const activity = await apiClients.activity
          .getActivity(id)
          .catch(() => null);
        return [id, activity?.title ?? null] as const;
      }),
    ),
  );

  const past = completed.map(({ session, classroom, studentCount, activityId }) => ({
    id: session.id,
    classId: classroom.id,
    className: classroom.name,
    studentCount,
    activityName: activityId ? (titles.get(activityId) ?? null) : null,
    completedAt: session.updatedAt,
  }));

  return { thisWeek, past };
}

/**
 * This Week and Past Activities span every class, while the app-level
 * useSessions follows only the selected one, so this fetches on its own: per
 * class its sessions, students and saved plans (a teacher has a handful), then
 * one lookup per completed session's activity.
 *
 * `classrooms` is null until the class list has loaded.
 */
export function useClassActivity(
  apiClients: IAPIClients,
  classrooms: IMicroCoachClassroom[] | null,
): UseClassActivityResult {
  const { sessions: selectedClassSessions, selectedSessionId } =
    useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const classKey = classrooms?.map((classroom) => classroom.id).join(',') ?? null;
  // Bumped after a delete to refetch.
  const [reloadToken, setReloadToken] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    data: ClassActivity;
    status: MicroCoachDataStatus;
  } | null>(null);
  const requestKey = classKey === null ? null : `${classKey}#${reloadToken}`;

  useEffect(() => {
    if (requestKey === null || !classrooms) return undefined;
    if (classrooms.length === 0) {
      setResult({ key: requestKey, data: EMPTY, status: MicroCoachDataStatus.READY });
      return undefined;
    }

    let cancelled = false;
    loadClassActivity(apiClients, classrooms)
      .then((data) => {
        if (!cancelled) {
          setResult({ key: requestKey, data, status: MicroCoachDataStatus.READY });
        }
      })
      .catch((error) => {
        console.error('Could not load class activity', error);
        if (!cancelled) {
          setResult({ key: requestKey, data: EMPTY, status: MicroCoachDataStatus.ERROR });
        }
      });
    return () => {
      cancelled = true;
    };
    // classrooms is read through requestKey, which changes whenever its ids do.
  }, [apiClients, requestKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeSession = useCallback(
    async (sessionId: string) => {
      try {
        const deleted = await apiClients.session.deleteSession(sessionId);
        if (!deleted) return false;
        // The app-wide session list (the selected class's) must not keep a
        // deleted session, or the dashboard, Review and Reflect would point at it.
        if (selectedClassSessions.some((session) => session.id === sessionId)) {
          const remaining = selectedClassSessions.filter(
            (session) => session.id !== sessionId,
          );
          dispatch({ type: 'SET_SESSIONS', payload: remaining });
          if (selectedSessionId === sessionId) {
            dispatch({
              type: 'SET_SELECTED_SESSION_ID',
              payload: remaining[0]?.id ?? null,
            });
          }
        }
        setReloadToken((token) => token + 1);
        return true;
      } catch (error) {
        console.error('Could not delete session', error);
        return false;
      }
    },
    [apiClients, dispatch, selectedClassSessions, selectedSessionId],
  );

  // Keep the last answer on screen while a refetch runs, so a delete does not
  // flash the list back to a spinner.
  const isCurrent = result !== null && result.key === requestKey;
  let status = MicroCoachDataStatus.LOADING;
  if (isCurrent) status = result.status;
  else if (result !== null && result.status === MicroCoachDataStatus.READY) {
    status = MicroCoachDataStatus.READY;
  }

  return {
    thisWeek: result?.data.thisWeek ?? [],
    past: result?.data.past ?? [],
    status,
    removeSession,
  };
}
