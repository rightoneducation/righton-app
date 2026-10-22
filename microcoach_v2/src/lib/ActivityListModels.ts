import { FlowStep } from './flowProgress';
import { weekOf } from './weeks';

// The rows behind This Week and Past Activities, assembled across every class
// by hooks/useClassActivity.ts.

/** One class's place in this week's loop (dashboard/v2 Dashboard2). */
export interface IWeeklyClassProgress {
  classId: string;
  // This week's session, or null when the class has not uploaded yet.
  sessionId: string | null;
  className: string;
  studentCount: number;
  step: FlowStep;
  // Files are in but the pipeline has not reported back yet.
  isAwaitingResults: boolean;
}

/** One session, finished or not (v2 Dashboard3, rev4 Incomplete). */
export interface IPastActivity {
  // The session's id.
  id: string;
  classId: string;
  className: string;
  studentCount: number;
  // The saved plan's first activity; null when it has none or the lookup failed.
  activityName: string | null;
  // The session's updatedAt: nothing records completion itself. For an
  // unfinished session, when it was last worked on.
  completedAt: string;
  // DONE once completed; otherwise where the session stopped.
  step: FlowStep;
  // Files are in but the pipeline has not reported back yet.
  isAwaitingResults: boolean;
  // The week the session is for, which an upload pre-fills.
  weekStart: string;
}

export enum ActivitySortOrder {
  RECENT_FIRST = 'RECENT_FIRST',
  OLDEST_FIRST = 'OLDEST_FIRST',
  BY_CLASS = 'BY_CLASS',
}

// A heading and its cards: a school week (date orders) or a class (By class).
export interface IPastActivityGroup {
  key: string;
  // The week's Monday key; null when grouped by class.
  weekStart: string | null;
  // The class name; null when grouped by week.
  className: string | null;
  rows: IPastActivity[];
}

const byClass = (a: IPastActivity, b: IPastActivity) =>
  a.className.localeCompare(b.className);

/**
 * Date orders group under week headings (rev2 PastActivities), classes A-Z
 * within a week. By class is one flat list.
 */
export function groupPastActivities(
  rows: IPastActivity[],
  order: ActivitySortOrder,
): IPastActivityGroup[] {
  if (order === ActivitySortOrder.BY_CLASS) {
    // One group per class, A-Z, headed by its name in place of the week.
    // rev2 design note: most recently completed, then activity name, order
    // the activities within a class.
    const classes = new Map<string, IPastActivity[]>();
    rows.forEach((row) => {
      classes.set(row.classId, [...(classes.get(row.classId) ?? []), row]);
    });
    return Array.from(classes.entries())
      .map(([classId, classRows]) => ({
        key: classId,
        weekStart: null,
        className: classRows[0].className,
        rows: [...classRows].sort(
          (a, b) =>
            b.completedAt.localeCompare(a.completedAt) ||
            (a.activityName ?? '').localeCompare(b.activityName ?? ''),
        ),
      }))
      .sort((a, b) => a.className.localeCompare(b.className));
  }

  const groups = new Map<string, IPastActivity[]>();
  rows.forEach((row) => {
    const week = weekOf(row.completedAt);
    groups.set(week, [...(groups.get(week) ?? []), row]);
  });
  const direction = order === ActivitySortOrder.OLDEST_FIRST ? 1 : -1;
  return Array.from(groups.entries())
    .sort(([a], [b]) => direction * a.localeCompare(b))
    .map(([weekStart, weekRows]) => ({
      key: weekStart,
      weekStart,
      className: null,
      rows: [...weekRows].sort(byClass),
    }));
}
