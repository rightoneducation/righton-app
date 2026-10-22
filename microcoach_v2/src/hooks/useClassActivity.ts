import { useEffect, useMemo, useState } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachClassroom } from '../api/Models/IMicroCoachClassroom';
import { IMicroCoachSavedPlan } from '../api/Models/IMicroCoachSavedPlan';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { deriveCurrentStep, isAwaitingResults, sessionForWeek } from '../lib/flowProgress';
import { weekOf } from '../lib/weeks';
import { IPastActivity, IWeeklyClassProgress } from '../lib/ActivityListModels';

export interface UseClassActivityResult {
  // Every class's place in the given week's flow.
  week: IWeeklyClassProgress[];
  past: IPastActivity[];
  status: MicroCoachDataStatus;
}

// One class as fetched; the week's rows are built from these, so picking
// another week does not refetch.
interface ClassRecord {
  classroom: IMicroCoachClassroom;
  sessions: IMicroCoachSession[];
  studentCount: number;
  plans: IMicroCoachSavedPlan[];
}

interface ClassActivity {
  perClass: ClassRecord[];
  past: IPastActivity[];
}

const EMPTY: ClassActivity = { perClass: [], past: [] };

function weekRows(perClass: ClassRecord[], weekStart: string): IWeeklyClassProgress[] {
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
      isAwaitingResults: isAwaitingResults(session),
    };
  });
}

async function loadClassActivity(
  apiClients: IAPIClients,
  classrooms: IMicroCoachClassroom[],
): Promise<ClassActivity> {
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
  }));

  return { perClass, past };
}

/**
 * Home's weekly progress and Past Activities span every class, while the app-level
 * useSessions follows only the selected one, so this fetches on its own: per
 * class its sessions, students and saved plans (a teacher has a handful), then
 * one lookup per completed session's activity.
 *
 * `classrooms` is null until the class list has loaded. `weekStart` picks the
 * week the progress rows describe (Home's week dropdown).
 */
export function useClassActivity(
  apiClients: IAPIClients,
  classrooms: IMicroCoachClassroom[] | null,
  weekStart: string | null = null,
): UseClassActivityResult {
  const requestKey =
    classrooms?.map((classroom) => classroom.id).join(',') ?? null;
  const [result, setResult] = useState<{
    key: string;
    data: ClassActivity;
    status: MicroCoachDataStatus;
  } | null>(null);

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

  // Keep the last answer on screen while a refetch runs (the class list
  // changed), so the list does not flash back to a spinner.
  const isCurrent = result !== null && result.key === requestKey;
  let status = MicroCoachDataStatus.LOADING;
  if (isCurrent) status = result.status;
  else if (result !== null && result.status === MicroCoachDataStatus.READY) {
    status = MicroCoachDataStatus.READY;
  }

  const perClass = result?.data.perClass;
  const week = useMemo(
    () => (perClass && weekStart ? weekRows(perClass, weekStart) : []),
    [perClass, weekStart],
  );

  return {
    week,
    past: result?.data.past ?? [],
    status,
  };
}
