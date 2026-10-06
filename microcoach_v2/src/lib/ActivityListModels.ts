import { FlowStep } from './flowProgress';
import { weekOf } from './weeks';

// The rows behind This Week and Past Activities. Mocked for now
// (lib/mocks/mockClassActivity.ts): both screens span every class, and the only
// fetch today (useSessions) is per class.

/** One class's place in this week's loop (dashboard/v2 Dashboard2). */
export interface IWeeklyClassProgress {
  id: string;
  className: string;
  studentCount: number;
  step: Exclude<FlowStep, FlowStep.DONE>;
  // Files are in but the pipeline has not reported back yet.
  isAwaitingResults: boolean;
}

/** One completed class-week activity (v2 Dashboard3). */
export interface IPastActivity {
  id: string;
  className: string;
  studentCount: number;
  activityName: string;
  // YYYY-MM-DD.
  completedAt: string;
}

export enum ActivitySortOrder {
  RECENT_FIRST = 'RECENT_FIRST',
  OLDEST_FIRST = 'OLDEST_FIRST',
  BY_CLASS = 'BY_CLASS',
}

export interface IPastActivityGroup {
  // The week's Monday key, or null for the ungrouped by-class list.
  weekStart: string | null;
  rows: IPastActivity[];
}

const byClass = (a: IPastActivity, b: IPastActivity) =>
  a.className.localeCompare(b.className);

/**
 * Date orders group under week headings (v2 Dashboard3_a), classes A-Z within
 * a week. By class is one flat list, oldest first within a class as drawn
 * (Dashboard3_b; design marked this order for further review).
 */
export function groupPastActivities(
  rows: IPastActivity[],
  order: ActivitySortOrder,
): IPastActivityGroup[] {
  if (order === ActivitySortOrder.BY_CLASS) {
    const sorted = [...rows].sort(
      (a, b) => byClass(a, b) || a.completedAt.localeCompare(b.completedAt),
    );
    return [{ weekStart: null, rows: sorted }];
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
      weekStart,
      rows: [...weekRows].sort(byClass),
    }));
}
