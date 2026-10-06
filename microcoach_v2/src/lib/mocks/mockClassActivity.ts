import { FlowStep } from '../flowProgress';
import { IPastActivity, IWeeklyClassProgress } from '../ActivityListModels';

// The rows drawn in dashboard/v2 Dashboard2 and Dashboard3, until a cross-class
// query exists to replace them.

export const mockWeeklyProgress: IWeeklyClassProgress[] = [
  {
    id: 'week-justice',
    className: 'Justice',
    studentCount: 24,
    step: FlowStep.UNDERSTAND,
    isAwaitingResults: false,
  },
  {
    id: 'week-joy',
    className: 'Joy',
    studentCount: 24,
    step: FlowStep.CHOOSE,
    isAwaitingResults: false,
  },
  {
    id: 'week-peace',
    className: 'Peace',
    studentCount: 24,
    step: FlowStep.ASSESS,
    isAwaitingResults: true,
  },
  {
    id: 'week-grace',
    className: 'Grace',
    studentCount: 24,
    step: FlowStep.REASSESS,
    isAwaitingResults: false,
  },
];

export const mockPastActivities: IPastActivity[] = [
  {
    id: 'past-justice-9',
    className: 'Justice',
    studentCount: 24,
    activityName: 'Spot the Slip',
    completedAt: '2026-10-22',
  },
  {
    id: 'past-joy-9',
    className: 'Joy',
    studentCount: 24,
    activityName: 'Compare the Thinking',
    completedAt: '2026-10-22',
  },
  {
    id: 'past-peace-9',
    className: 'Peace',
    studentCount: 24,
    activityName: 'Math Detective',
    completedAt: '2026-10-22',
  },
  {
    id: 'past-grace-9',
    className: 'Grace',
    studentCount: 24,
    activityName: 'Spot the Slip',
    completedAt: '2026-10-22',
  },
  {
    id: 'past-grace-8',
    className: 'Grace',
    studentCount: 24,
    activityName: 'My Favorite No',
    completedAt: '2026-10-15',
  },
  {
    id: 'past-justice-8',
    className: 'Justice',
    studentCount: 24,
    activityName: 'Make Your Case',
    completedAt: '2026-10-15',
  },
];
