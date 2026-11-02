import { SessionStatus } from '../AWSAPI';
import { IMicroCoachClassroom } from '../api/Models/IMicroCoachClassroom';
import { IMicroCoachSavedPlan } from '../api/Models/IMicroCoachSavedPlan';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { FlowStep } from './flowProgress';
import {
  IMicroCoachDataState,
  initMicroCoachDataState,
  loadKeys,
  MicroCoachDataStatus,
} from './MicroCoachModels';
import {
  combinedLoad,
  pastActivities,
  selectedClassId,
  selectedSession,
  weekRows,
} from './selectors';
import { weekOf } from './weeks';

const classroom = (id: string, createdAt: string): IMicroCoachClassroom => ({
  id,
  userId: 'u1',
  name: `Class ${id}`,
  grade: null,
  state: null,
  schoolYear: null,
  createdAt,
  updatedAt: createdAt,
});

const session = (overrides: Partial<IMicroCoachSession>): IMicroCoachSession => ({
  id: 's1',
  classId: 'c1',
  sessionLabel: null,
  weekLabel: null,
  weekNumber: null,
  topic: null,
  ccssStandards: [],
  status: SessionStatus.GENERATED,
  publishStatus: null,
  studentWorksAnalyzed: null,
  studentsWithStrongUnderstanding: null,
  studentsWithStrongUnderstandingIds: [],
  studentIdsNeedingSupport: [],
  ppqAssessmentId: null,
  postPpqAssessmentId: null,
  selectedMisconceptionId: null,
  pregeneratedNextSteps: null,
  evaluationResults: null,
  questionStats: [],
  reflectionResults: [],
  createdAt: '2026-10-12T15:00:00.000Z',
  updatedAt: '2026-10-12T15:00:00.000Z',
  ...overrides,
});

const plan = (overrides: Partial<IMicroCoachSavedPlan>): IMicroCoachSavedPlan => ({
  id: 'p1',
  classId: 'c1',
  sessionId: 's1',
  items: [{ id: 'a1', status: 'SAVED' }],
  createdAt: '2026-10-13T15:00:00.000Z',
  updatedAt: '2026-10-13T15:00:00.000Z',
  ...overrides,
});

const byId = <R extends { id: string }>(rows: R[]) =>
  Object.fromEntries(rows.map((row) => [row.id, row]));

const state = (overrides: Partial<IMicroCoachDataState>): IMicroCoachDataState => ({
  ...initMicroCoachDataState,
  ...overrides,
});

const twoClasses = {
  classrooms: byId([
    classroom('c2', '2026-09-02T00:00:00.000Z'),
    classroom('c1', '2026-09-01T00:00:00.000Z'),
  ]),
  sessions: byId([
    session({ id: 's1', classId: 'c1', createdAt: '2026-10-12T15:00:00.000Z' }),
    session({ id: 's2', classId: 'c1', createdAt: '2026-10-05T15:00:00.000Z' }),
    session({ id: 's3', classId: 'c2', createdAt: '2026-10-12T16:00:00.000Z' }),
  ]),
};

describe('selection', () => {
  it('falls back to the first class added when none is selected', () => {
    expect(selectedClassId(state(twoClasses))).toBe('c1');
  });

  it('falls back to the first class when the selected one was removed', () => {
    expect(
      selectedClassId(state({ ...twoClasses, selection: { classId: 'gone', sessionId: null } })),
    ).toBe('c1');
  });

  it("is the class's latest session when none is picked", () => {
    expect(
      selectedSession(state({ ...twoClasses, selection: { classId: 'c1', sessionId: null } }))?.id,
    ).toBe('s1');
  });

  it("never pairs a class with another class's session", () => {
    expect(
      selectedSession(state({ ...twoClasses, selection: { classId: 'c2', sessionId: 's1' } }))?.id,
    ).toBe('s3');
  });

  it('keeps a picked earlier session of the selected class', () => {
    expect(
      selectedSession(state({ ...twoClasses, selection: { classId: 'c1', sessionId: 's2' } }))?.id,
    ).toBe('s2');
  });
});

describe('weekRows', () => {
  const weekStart = weekOf('2026-10-12T15:00:00.000Z');

  it("gives every class its step for the week, oldest class first", () => {
    const rows = weekRows(
      state({ ...twoClasses, savedPlans: byId([plan({})]) }),
      weekStart,
    );
    expect(rows.map((row) => [row.classId, row.sessionId, row.step])).toEqual([
      ['c1', 's1', FlowStep.REASSESS],
      ['c2', 's3', FlowStep.UNDERSTAND],
    ]);
  });

  it('does not count a plan whose activities were all removed', () => {
    const rows = weekRows(
      state({ ...twoClasses, savedPlans: byId([plan({ items: [] })]) }),
      weekStart,
    );
    expect(rows[0].step).toBe(FlowStep.UNDERSTAND);
  });
});

describe('pastActivities', () => {
  it("names a session's saved activity from the activities table", () => {
    const rows = pastActivities(
      state({
        ...twoClasses,
        savedPlans: byId([plan({})]),
        activities: {
          a1: { id: 'a1', title: 'Compare the thinking' } as IMicroCoachDataState['activities'][string],
        },
      }),
    );
    expect(rows.find((row) => row.id === 's1')?.activityName).toBe('Compare the thinking');
    expect(rows.find((row) => row.id === 's2')?.activityName).toBeNull();
  });
});

describe('combinedLoad', () => {
  const loads = {
    [loadKeys.classChildren('c1')]: {
      status: MicroCoachDataStatus.READY,
      error: null,
      stale: true,
    },
  };

  it('counts a stale load as answered', () => {
    expect(combinedLoad(loads, [loadKeys.classChildren('c1')]).status).toBe(
      MicroCoachDataStatus.READY,
    );
  });

  it('is LOADING while any key has no answer', () => {
    expect(
      combinedLoad(loads, [loadKeys.classChildren('c1'), loadKeys.classChildren('c2')]).status,
    ).toBe(MicroCoachDataStatus.LOADING);
  });
});
