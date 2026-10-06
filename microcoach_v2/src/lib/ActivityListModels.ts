import { FlowStep } from './flowProgress';

// The rows behind This Week and Past Activities. Mocked for now
// (lib/mocks/mockClassActivity.ts): both screens span every class, and the only
// fetch today (useClassProgress) is per class.

/** One class's place in this week's loop (Dashboard2). */
export interface IWeeklyClassProgress {
  id: string;
  className: string;
  studentCount: number;
  step: Exclude<FlowStep, FlowStep.DONE>;
  // Files are in but the pipeline has not reported back yet.
  isAwaitingResults: boolean;
  createdAt: string;
}

/** One class-week, finished or abandoned (Dashboard3). */
export interface IPastActivity {
  id: string;
  className: string;
  weekStart: string;
  // Null while the week still needs its MIU files.
  completedAt: string | null;
  studentWorkCount: number;
}

export enum ActivitySortOrder {
  RECENT_FIRST = 'RECENT_FIRST',
  OLDEST_FIRST = 'OLDEST_FIRST',
  BY_CLASS = 'BY_CLASS',
}

/** Sorts by `dateOf`, or by class name with the most recent first within it. */
export function sortActivities<T extends { className: string }>(
  rows: T[],
  order: ActivitySortOrder,
  dateOf: (row: T) => string,
): T[] {
  const byRecent = (a: T, b: T) => dateOf(b).localeCompare(dateOf(a));
  return [...rows].sort((a, b) => {
    if (order === ActivitySortOrder.OLDEST_FIRST) return -byRecent(a, b);
    if (order === ActivitySortOrder.BY_CLASS) {
      return a.className.localeCompare(b.className) || byRecent(a, b);
    }
    return byRecent(a, b);
  });
}
