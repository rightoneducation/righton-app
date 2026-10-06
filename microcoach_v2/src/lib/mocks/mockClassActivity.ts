import { FlowStep } from '../flowProgress';
import { IPastActivity, IWeeklyClassProgress } from '../ActivityListModels';

// The rows drawn in dashboard/Dashboard2 and Dashboard3, until a cross-class
// query exists to replace them.

export const mockWeeklyProgress: IWeeklyClassProgress[] = [
  {
    id: 'week-justice',
    className: 'Justice',
    studentCount: 24,
    step: FlowStep.UNDERSTAND,
    isAwaitingResults: false,
    createdAt: '2025-07-07T14:00:00.000Z',
  },
  {
    id: 'week-joy',
    className: 'Joy',
    studentCount: 24,
    step: FlowStep.CHOOSE,
    isAwaitingResults: false,
    createdAt: '2025-07-07T13:00:00.000Z',
  },
  {
    id: 'week-peace',
    className: 'Peace',
    studentCount: 24,
    step: FlowStep.ASSESS,
    isAwaitingResults: true,
    createdAt: '2025-07-07T12:00:00.000Z',
  },
  {
    id: 'week-grace',
    className: 'Grace',
    studentCount: 24,
    step: FlowStep.REASSESS,
    isAwaitingResults: false,
    createdAt: '2025-07-07T11:00:00.000Z',
  },
];

export const mockPastActivities: IPastActivity[] = [
  {
    id: 'past-justice',
    className: 'Justice',
    weekStart: '2025-06-30',
    completedAt: null,
    studentWorkCount: 24,
  },
  {
    id: 'past-joy',
    className: 'Joy',
    weekStart: '2025-06-24',
    completedAt: '2025-07-03',
    studentWorkCount: 22,
  },
  {
    id: 'past-peace',
    className: 'Peace',
    weekStart: '2025-06-15',
    completedAt: '2025-07-02',
    studentWorkCount: 22,
  },
  {
    id: 'past-grace',
    className: 'Grace',
    weekStart: '2025-06-05',
    completedAt: '2025-07-01',
    studentWorkCount: 22,
  },
];
