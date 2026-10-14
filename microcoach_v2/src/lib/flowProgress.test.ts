import { SessionStatus } from '../AWSAPI';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { Translate } from './activityMarks';
import {
  FlowStep,
  buildFlowSteps,
  buildPendingFlowSteps,
  defaultWeekFor,
  deriveCurrentStep,
  hasChosenActivity,
  sessionForWeek,
  sortSessionsLatestFirst,
  stepCta,
} from './flowProgress';

const t: Translate = (key) => key;

const session = (overrides: Partial<IMicroCoachSession> = {}): IMicroCoachSession => ({
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
  pregeneratedNextSteps: null,
  evaluationResults: null,
  questionStats: [],
  createdAt: '2026-10-12T15:00:00.000Z',
  updatedAt: '2026-10-12T15:00:00.000Z',
  ...overrides,
});

describe('deriveCurrentStep', () => {
  it('is ASSESS with no session', () => {
    expect(deriveCurrentStep(null, false)).toBe(FlowStep.ASSESS);
  });

  it('is ASSESS while the files are still being analyzed', () => {
    expect(
      deriveCurrentStep(session({ status: SessionStatus.DATA_INGESTED }), true),
    ).toBe(FlowStep.ASSESS);
  });

  it('is UNDERSTAND once results are in and no plan is saved', () => {
    expect(deriveCurrentStep(session(), false)).toBe(FlowStep.UNDERSTAND);
  });

  it('never reports CHOOSE (nothing persisted separates it from UNDERSTAND)', () => {
    expect(deriveCurrentStep(session(), false)).not.toBe(FlowStep.CHOOSE);
  });

  it('is REASSESS once a plan is saved', () => {
    expect(deriveCurrentStep(session(), true)).toBe(FlowStep.REASSESS);
  });

  it('is REFLECT once the MIU 2 assessment is attached, plan or not', () => {
    const reassessed = session({ postPpqAssessmentId: 'a2' });
    expect(deriveCurrentStep(reassessed, true)).toBe(FlowStep.REFLECT);
    expect(deriveCurrentStep(reassessed, false)).toBe(FlowStep.REFLECT);
  });

  it('is DONE for a completed session, ahead of every other signal', () => {
    expect(
      deriveCurrentStep(
        session({ status: SessionStatus.COMPLETED, postPpqAssessmentId: 'a2' }),
        true,
      ),
    ).toBe(FlowStep.DONE);
  });
});

describe('buildFlowSteps', () => {
  const states = (current: FlowStep) =>
    buildFlowSteps(current, t).map((step) => step.state);

  it('marks steps before the current one complete and after it upcoming', () => {
    expect(states(FlowStep.CHOOSE)).toEqual([
      'COMPLETE',
      'COMPLETE',
      'CURRENT',
      'UPCOMING',
      'UPCOMING',
    ]);
  });

  it('marks every step complete when DONE', () => {
    expect(states(FlowStep.DONE)).toEqual(Array(5).fill('COMPLETE'));
  });

  it('makes completed steps and Assess clickable, never upcoming ones', () => {
    const steps = buildFlowSteps(FlowStep.UNDERSTAND, t);
    expect(steps.map((step) => step.isClickable)).toEqual([
      true,
      false,
      false,
      false,
      false,
    ]);
    const later = buildFlowSteps(FlowStep.REFLECT, t);
    expect(later.map((step) => step.isClickable)).toEqual([
      true,
      true,
      true,
      true,
      false,
    ]);
  });

  it('links a completed Select Activity to My Activity', () => {
    const steps = buildFlowSteps(FlowStep.REASSESS, t);
    expect(steps[2].path).toBe('/myactivity');
  });

  it('numbers steps from 1 and labels them by key', () => {
    const steps = buildFlowSteps(FlowStep.ASSESS, t);
    expect(steps.map((step) => step.order)).toEqual([1, 2, 3, 4, 5]);
    expect(steps[0].label).toBe('dashboard.steps.ASSESS');
  });
});

describe('buildPendingFlowSteps', () => {
  it('has no current step and nothing clickable', () => {
    const steps = buildPendingFlowSteps(t);
    expect(steps.every((step) => step.state === 'UPCOMING')).toBe(true);
    expect(steps.some((step) => step.isClickable)).toBe(false);
  });
});

describe('hasChosenActivity', () => {
  it.each([
    [FlowStep.ASSESS, false],
    [FlowStep.UNDERSTAND, false],
    [FlowStep.CHOOSE, false],
    [FlowStep.REASSESS, true],
    [FlowStep.REFLECT, true],
    [FlowStep.DONE, true],
  ])('%s → %s', (step, expected) => {
    expect(hasChosenActivity(step)).toBe(expected);
  });
});

describe('stepCta', () => {
  it.each([
    [FlowStep.ASSESS, '/upload-miu'],
    [FlowStep.UNDERSTAND, '/review'],
    [FlowStep.CHOOSE, '/review'],
    [FlowStep.REASSESS, '/upload-reassess'],
    [FlowStep.REFLECT, '/reflect'],
    [FlowStep.DONE, '/upload-miu'],
  ])('%s → %s', (step, path) => {
    expect(stepCta(step).path).toBe(path);
  });
});

describe('sortSessionsLatestFirst', () => {
  it('orders by week number when both have one, else by creation time', () => {
    const sorted = sortSessionsLatestFirst([
      session({ id: 'w8', weekNumber: 8, createdAt: '2026-10-20T00:00:00Z' }),
      session({ id: 'w9', weekNumber: 9, createdAt: '2026-10-01T00:00:00Z' }),
      session({ id: 'none-late', createdAt: '2026-10-30T00:00:00Z' }),
    ]);
    expect(sorted.map((s) => s.id)).toEqual(['none-late', 'w9', 'w8']);
  });
});

describe('sessionForWeek', () => {
  const earlier = session({ id: 'early', createdAt: '2026-10-12T15:00:00.000Z' });
  const later = session({ id: 'late', createdAt: '2026-10-14T15:00:00.000Z' });
  const lastWeek = session({ id: 'last', createdAt: '2026-10-07T15:00:00.000Z' });

  it("takes the week's latest session", () => {
    expect(sessionForWeek([earlier, lastWeek, later], '2026-10-12')?.id).toBe('late');
  });

  it('is null for a week with no session', () => {
    expect(sessionForWeek([earlier, later], '2026-10-19')).toBeNull();
  });
});

describe('defaultWeekFor', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 9, 21, 12));
  });
  afterEach(() => jest.useRealTimers());

  it('opens on the week of an open loop', () => {
    expect(defaultWeekFor([session({ createdAt: '2026-10-14T15:00:00.000Z' })])).toBe(
      '2026-10-12',
    );
  });

  it('opens on the current week once the latest loop is complete', () => {
    expect(
      defaultWeekFor([
        session({ status: SessionStatus.COMPLETED, createdAt: '2026-10-14T15:00:00.000Z' }),
      ]),
    ).toBe('2026-10-19');
  });

  it('opens on the current week with no sessions', () => {
    expect(defaultWeekFor([])).toBe('2026-10-19');
  });
});
