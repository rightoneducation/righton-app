import { IMicroCoachClassroom } from '../api/Models/IMicroCoachClassroom';
import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { IMicroCoachSavedPlan } from '../api/Models/IMicroCoachSavedPlan';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { IPastActivity, IWeeklyClassProgress } from './ActivityListModels';
import {
  deriveCurrentStep,
  isAwaitingResults,
  sessionForWeek,
  sortSessionsLatestFirst,
} from './flowProgress';
import {
  IMicroCoachDataState,
  IMicroCoachTables,
  MicroCoachDataStatus,
} from './MicroCoachModels';
import { IPlanItem } from './PipelineModels';
import { weekOf } from './weeks';

/*
 * The joins. Every screen-shaped value is computed here, during render, from
 * the store's tables (one row per id) and the selection. Nothing they return
 * is stored, so no two parts of a screen can disagree about which class or
 * session they describe. Hooks wrap them in useMemo keyed on the tables read.
 */

type Tables = Pick<IMicroCoachDataState, keyof IMicroCoachTables>;

/** The teacher's classes, oldest first (the order they were added). */
export function classroomList(
  tables: Pick<Tables, 'classrooms'>,
): IMicroCoachClassroom[] {
  return Object.values(tables.classrooms).sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
}

/** The selected class, or the first class when none (or a removed one) is. */
export function selectedClassId(
  state: Pick<IMicroCoachDataState, 'classrooms' | 'selection'>,
): string | null {
  const { classId } = state.selection;
  if (classId && state.classrooms[classId]) return classId;
  return classroomList(state)[0]?.id ?? null;
}

/** A class's sessions, latest first. */
export function classSessions(
  tables: Pick<Tables, 'sessions'>,
  classId: string | null,
): IMicroCoachSession[] {
  if (!classId) return [];
  return sortSessionsLatestFirst(
    Object.values(tables.sessions).filter((session) => session.classId === classId),
  );
}

/**
 * The selected session when it belongs to the selected class, else that
 * class's latest: switching class needs no second step to pick a session.
 */
export function selectedSession(
  state: Pick<IMicroCoachDataState, 'classrooms' | 'sessions' | 'selection'>,
): IMicroCoachSession | null {
  const classId = selectedClassId(state);
  if (!classId) return null;
  const { sessionId } = state.selection;
  const picked = sessionId ? state.sessions[sessionId] : undefined;
  if (picked && picked.classId === classId) return picked;
  return classSessions(state, classId)[0] ?? null;
}

export function studentCount(
  tables: Pick<Tables, 'students'>,
  classId: string,
): number {
  return Object.values(tables.students).filter(
    (student) => student.classId === classId,
  ).length;
}

/**
 * The plan saved for a session, or for the class itself when `sessionId` is
 * null (before its first upload). The latest when there are several.
 */
export function savedPlanFor(
  tables: Pick<Tables, 'savedPlans'>,
  classId: string,
  sessionId: string | null,
): IMicroCoachSavedPlan | null {
  return (
    Object.values(tables.savedPlans)
      .filter((plan) => plan.classId === classId && plan.sessionId === sessionId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] ?? null
  );
}

// Saving an activity is what moves a class on to REASSESS; a plan whose
// activities were all removed no longer does.
export const hasSavedPlan = (plan: IMicroCoachSavedPlan | null) =>
  !!plan && plan.items.length > 0;

/** A session's misconceptions, ranked, each with its activities. */
export function sessionMisconceptions(
  tables: Pick<Tables, 'misconceptions' | 'activities'>,
  sessionId: string | null,
): IMicroCoachMisconception[] {
  if (!sessionId) return [];
  const activities = Object.values(tables.activities);
  return Object.values(tables.misconceptions)
    .filter((misconception) => misconception.sessionId === sessionId)
    .sort((a, b) => a.rank - b.rank)
    .map((misconception) => ({
      ...misconception,
      nextStepActivities: activities.filter(
        (activity) => activity.misconceptionId === misconception.id,
      ),
    }));
}

/** A saved plan's items, joined to the activity and misconception they name. */
export function planItemsFor(
  plan: IMicroCoachSavedPlan | null,
  misconceptions: IMicroCoachMisconception[],
): IPlanItem[] {
  return (plan?.items ?? []).flatMap((savedItem): IPlanItem[] => {
    const misconception = misconceptions.find((item) =>
      item.nextStepActivities.some((activity) => activity.id === savedItem.id),
    );
    const activity = misconception?.nextStepActivities.find(
      (item) => item.id === savedItem.id,
    );
    if (!misconception || !activity) return [];
    return [
      {
        id: activity.id,
        status: savedItem.status,
        activityId: activity.id,
        activityTitle: activity.routine.name,
        skillCode: misconception.skillContext?.focusSkill.code ?? '',
        misconceptionId: misconception.id,
        misconceptionTitle: misconception.titleCased,
        prevalence: misconception.prevalence,
        grouping: activity.grouping ?? { level: 'WHOLE_CLASS', label: '' },
      },
    ];
  });
}

/**
 * Several loads read as one: ERROR when any failed, LOADING while any has not
 * answered, READY once all have. A stale load still counts as answered.
 */
export function combinedLoad(
  loads: IMicroCoachDataState['loads'],
  keys: string[],
): { status: MicroCoachDataStatus; error: Error | null } {
  const states = keys.map((key) => loads[key]);
  const failed = states.find((load) => load?.status === MicroCoachDataStatus.ERROR);
  if (failed) return { status: MicroCoachDataStatus.ERROR, error: failed.error };
  if (states.some((load) => !load || load.status !== MicroCoachDataStatus.READY)) {
    return { status: MicroCoachDataStatus.LOADING, error: null };
  }
  return { status: MicroCoachDataStatus.READY, error: null };
}

/** Every class's place in a school week's flow (Home's weekly progress and card). */
export function weekRows(
  tables: Pick<Tables, 'classrooms' | 'sessions' | 'students' | 'savedPlans'>,
  weekStart: string,
): IWeeklyClassProgress[] {
  return classroomList(tables).map((classroom) => {
    const session = sessionForWeek(classSessions(tables, classroom.id), weekStart);
    const plan = session ? savedPlanFor(tables, classroom.id, session.id) : null;
    return {
      classId: classroom.id,
      sessionId: session?.id ?? null,
      className: classroom.name,
      studentCount: studentCount(tables, classroom.id),
      step: deriveCurrentStep(session, hasSavedPlan(plan)),
      selectedMisconceptionId: session?.selectedMisconceptionId ?? null,
      isAwaitingResults: isAwaitingResults(session),
    };
  });
}

/**
 * Every session of every class, finished or not: an unfinished one reads
 * Incomplete and resumes at its step (rev4 PastActivities_IncompleteException).
 * The activity name is its saved activity's title, when that row is held.
 */
export function pastActivities(
  tables: Pick<
    Tables,
    'classrooms' | 'sessions' | 'students' | 'savedPlans' | 'activities'
  >,
): IPastActivity[] {
  return classroomList(tables).flatMap((classroom) =>
    classSessions(tables, classroom.id).map((session) => {
      const plan = savedPlanFor(tables, classroom.id, session.id);
      const activityId = plan?.items[0]?.id ?? null;
      return {
        id: session.id,
        classId: classroom.id,
        className: classroom.name,
        studentCount: studentCount(tables, classroom.id),
        activityName: activityId
          ? (tables.activities[activityId]?.title ?? null)
          : null,
        completedAt: session.updatedAt,
        step: deriveCurrentStep(session, hasSavedPlan(plan)),
        isAwaitingResults: isAwaitingResults(session),
        weekStart: weekOf(session.createdAt),
        selectedMisconceptionId: session.selectedMisconceptionId,
      };
    }),
  );
}
