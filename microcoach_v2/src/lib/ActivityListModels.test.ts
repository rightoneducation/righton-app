import {
  ActivitySortOrder,
  IPastActivity,
  groupPastActivities,
} from './ActivityListModels';
import { FlowStep } from './flowProgress';
import { weekOf } from './weeks';

const row = (
  id: string,
  className: string,
  completedAt: string,
  activityName: string | null = null,
): IPastActivity => ({
  id,
  classId: `class-${className}`,
  className,
  studentCount: 24,
  activityName,
  completedAt,
  step: FlowStep.DONE,
  isAwaitingResults: false,
  weekStart: weekOf(completedAt),
  selectedMisconceptionId: null,
});

// Week 8 = Oct 12-16, Week 9 = Oct 19-23 (2026). Midday UTC keeps every
// timestamp on the same local day in US time zones.
const rows = [
  row('joy-w9', 'Joy', '2026-10-22T16:00:00.000Z', 'Compare the Thinking'),
  row('grace-w8', 'Grace', '2026-10-15T16:00:00.000Z', 'My Favorite No'),
  row('justice-w9', 'Justice', '2026-10-21T16:00:00.000Z', 'Spot the Slip'),
  row('grace-w9', 'Grace', '2026-10-23T16:00:00.000Z', 'Math Detective'),
];

const ids = (order: ActivitySortOrder) =>
  groupPastActivities(rows, order).map((group) => ({
    weekStart: group.weekStart,
    className: group.className,
    rows: group.rows.map((r) => r.id),
  }));

describe('groupPastActivities', () => {
  it('newest first: weeks newest first, classes A-Z within a week', () => {
    expect(ids(ActivitySortOrder.RECENT_FIRST)).toEqual([
      {
        weekStart: '2026-10-19',
        className: null,
        rows: ['grace-w9', 'joy-w9', 'justice-w9'],
      },
      { weekStart: '2026-10-12', className: null, rows: ['grace-w8'] },
    ]);
  });

  it('oldest first: weeks oldest first', () => {
    expect(
      ids(ActivitySortOrder.OLDEST_FIRST).map((group) => group.weekStart),
    ).toEqual(['2026-10-12', '2026-10-19']);
  });

  it('by class: a group per class, A-Z, newest first within each', () => {
    expect(ids(ActivitySortOrder.BY_CLASS)).toEqual([
      { weekStart: null, className: 'Grace', rows: ['grace-w9', 'grace-w8'] },
      { weekStart: null, className: 'Joy', rows: ['joy-w9'] },
      { weekStart: null, className: 'Justice', rows: ['justice-w9'] },
    ]);
  });

  it('by class: same class and time falls back to activity name A-Z', () => {
    const tie = '2026-10-22T16:00:00.000Z';
    const grouped = groupPastActivities(
      [row('b', 'Hope', tie, 'Spot the Slip'), row('a', 'Hope', tie, 'Math Detective')],
      ActivitySortOrder.BY_CLASS,
    );
    expect(grouped[0].rows.map((r) => r.activityName)).toEqual([
      'Math Detective',
      'Spot the Slip',
    ]);
  });

  it('returns no groups for no rows (date orders)', () => {
    expect(groupPastActivities([], ActivitySortOrder.RECENT_FIRST)).toEqual([]);
  });
});
