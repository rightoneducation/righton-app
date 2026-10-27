import { useMemo } from 'react';
import { IPastActivity, IWeeklyClassProgress } from '../lib/ActivityListModels';
import { loadKeys, MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { combinedLoad, pastActivities, weekRows } from '../lib/selectors';
import { useMicroCoachDataState } from './context/useMicroCoachDataContext';

export interface UseClassActivityResult {
  // Every class's place in the given week's flow.
  week: IWeeklyClassProgress[];
  past: IPastActivity[];
  status: MicroCoachDataStatus;
}

/**
 * Home's weekly progress and card, and Past Activities: joined from the
 * store's tables, with `weekStart` picking the week the progress rows
 * describe. LOADING until the class list and every class's rows have
 * answered; a background refresh (useRefreshClassesOnMount) keeps READY.
 */
export function useClassActivity(weekStart: string | null = null): UseClassActivityResult {
  const { classrooms, sessions, students, savedPlans, activities, loads, userProfile } =
    useMicroCoachDataState();

  const week = useMemo(
    () =>
      weekStart
        ? weekRows({ classrooms, sessions, students, savedPlans }, weekStart)
        : [],
    [classrooms, savedPlans, sessions, students, weekStart],
  );
  const past = useMemo(
    () => pastActivities({ classrooms, sessions, students, savedPlans, activities }),
    [activities, classrooms, savedPlans, sessions, students],
  );

  const userId = userProfile?.id ?? null;
  const { status } = combinedLoad(loads, [
    ...(userId ? [loadKeys.classrooms(userId)] : ['classrooms:']),
    ...Object.keys(classrooms).map((classId) => loadKeys.classChildren(classId)),
  ]);

  return { week, past, status };
}
