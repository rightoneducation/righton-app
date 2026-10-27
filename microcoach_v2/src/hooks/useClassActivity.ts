import { useEffect, useMemo, useRef } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachClassroom } from '../api/Models/IMicroCoachClassroom';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { deriveCurrentStep, isAwaitingResults, sessionForWeek } from '../lib/flowProgress';
import { weekOf } from '../lib/weeks';
import {
  IClassActivityData,
  IClassRecord,
  IPastActivity,
  IWeeklyClassProgress,
} from '../lib/ActivityListModels';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from './context/useMicroCoachDataContext';

export interface UseClassActivityResult {
  // Every class's place in the given week's flow.
  week: IWeeklyClassProgress[];
  past: IPastActivity[];
  status: MicroCoachDataStatus;
}

const EMPTY: IClassActivityData = { perClass: [], past: [] };

function weekRows(perClass: IClassRecord[], weekStart: string): IWeeklyClassProgress[] {
  return perClass.map(({ classroom, sessions, studentCount, plans }) => {
    const session = sessionForWeek(sessions, weekStart);
    const hasSavedPlan =
      !!session && plans.some((plan) => plan.sessionId === session.id);
    return {
      classId: classroom.id,
      sessionId: session?.id ?? null,
      className: classroom.name,
      studentCount,
      step: deriveCurrentStep(session, hasSavedPlan),
      selectedMisconceptionId: session?.selectedMisconceptionId ?? null,
      isAwaitingResults: isAwaitingResults(session),
    };
  });
}

async function loadClassActivity(
  apiClients: IAPIClients,
  classrooms: IMicroCoachClassroom[],
): Promise<IClassActivityData> {
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

  // Every session, finished or not: an unfinished one reads Incomplete and
  // resumes at its step (rev4 PastActivities_IncompleteException).
  const pastSessions = perClass.flatMap(({ classroom, sessions, studentCount, plans }) =>
    sessions.map((session) => {
      const plan = plans.find((saved) => saved.sessionId === session.id);
      return {
        session,
        classroom,
        studentCount,
        activityId: plan?.items[0]?.id ?? null,
        step: deriveCurrentStep(session, !!plan),
      };
    }),
  );

  // One lookup per distinct activity. A failed lookup only blanks that name.
  const activityIds = Array.from(
    new Set(pastSessions.flatMap((row) => (row.activityId ? [row.activityId] : []))),
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

  const past = pastSessions.map(({ session, classroom, studentCount, activityId, step }) => ({
    id: session.id,
    classId: classroom.id,
    className: classroom.name,
    studentCount,
    activityName: activityId ? (titles.get(activityId) ?? null) : null,
    completedAt: session.updatedAt,
    step,
    isAwaitingResults: isAwaitingResults(session),
    weekStart: weekOf(session.createdAt),
    selectedMisconceptionId: session.selectedMisconceptionId,
  }));

  return { perClass, past };
}

/**
 * Fetches the cross-class lists' data into the app store: per class its
 * sessions, students and saved plans (a teacher has a handful), then one
 * lookup per completed session's activity. Called once, in the root layout, so
 * the answer outlives the pages: Home and Past Activities read it
 * (useClassActivity) and switching class reads its sessions from it.
 *
 * `classrooms` is null until the class list has loaded. It refetches when the
 * class ids change or the data is marked stale, keeping the last answer on
 * screen meanwhile, so a refresh never flashes back to a skeleton.
 */
export function useClassActivityLoader(
  apiClients: IAPIClients,
  classrooms: IMicroCoachClassroom[] | null,
): void {
  const { classActivity, classActivityKey, classActivityStatus, classActivityStale } =
    useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const requestKey =
    classrooms?.map((classroom) => classroom.id).join(',') ?? null;
  const isAnswered =
    classActivityKey === requestKey &&
    !classActivityStale &&
    classActivityStatus !== MicroCoachDataStatus.LOADING;
  // Read inside the effect, not a reason to rerun it.
  const hasDataRef = useRef(classActivity !== null);
  hasDataRef.current = classActivity !== null;

  useEffect(() => {
    if (requestKey === null || !classrooms || isAnswered) return undefined;
    if (classrooms.length === 0) {
      dispatch({
        type: 'SET_CLASS_ACTIVITY',
        payload: { key: requestKey, data: EMPTY, status: MicroCoachDataStatus.READY },
      });
      return undefined;
    }

    let cancelled = false;
    // With nothing on screen yet the lists show their skeletons; otherwise the
    // last answer stays up until this one lands.
    if (!hasDataRef.current) {
      dispatch({
        type: 'SET_CLASS_ACTIVITY',
        payload: { key: requestKey, data: null, status: MicroCoachDataStatus.LOADING },
      });
    }
    loadClassActivity(apiClients, classrooms)
      .then((data) => {
        if (cancelled) return;
        dispatch({
          type: 'SET_CLASS_ACTIVITY',
          payload: { key: requestKey, data, status: MicroCoachDataStatus.READY },
        });
      })
      .catch((error) => {
        console.error('Could not load class activity', error);
        if (cancelled || hasDataRef.current) return;
        dispatch({
          type: 'SET_CLASS_ACTIVITY',
          payload: { key: requestKey, data: EMPTY, status: MicroCoachDataStatus.ERROR },
        });
      });
    return () => {
      cancelled = true;
    };
    // classrooms is read through requestKey, which changes whenever its ids do.
  }, [apiClients, dispatch, isAnswered, requestKey]); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Home's weekly progress and Past Activities: the store's cross-class data,
 * with `weekStart` picking the week the progress rows describe (Home's week
 * dropdown). Opening either page shows what is held at once and refreshes it
 * in the background, so a session the pipeline finished since still shows up.
 */
export function useClassActivity(weekStart: string | null = null): UseClassActivityResult {
  const { classActivity, classActivityStatus } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();

  // Only an answer already on screen is refreshed: on the first visit the
  // loader is still fetching it.
  const hasData = classActivity !== null;
  useEffect(() => {
    if (hasData) dispatch({ type: 'INVALIDATE_CLASS_ACTIVITY' });
    // On arrival only, not every time the data lands.
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const perClass = classActivity?.perClass;
  const week = useMemo(
    () => (perClass && weekStart ? weekRows(perClass, weekStart) : []),
    [perClass, weekStart],
  );

  return {
    week,
    past: classActivity?.past ?? [],
    status:
      classActivityStatus === MicroCoachDataStatus.IDLE
        ? MicroCoachDataStatus.LOADING
        : classActivityStatus,
  };
}
