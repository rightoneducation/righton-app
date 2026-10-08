import { SessionStatus } from '../AWSAPI';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { IFlowStep } from './PipelineModels';
import { Translate } from './activityMarks';

// Where a class stands in the coaching loop, read off its persisted session.
// Pure: the dashboard fetches, this decides.

export enum FlowStep {
  ASSESS = 'ASSESS',
  UNDERSTAND = 'UNDERSTAND',
  CHOOSE = 'CHOOSE',
  REASSESS = 'REASSESS',
  REFLECT = 'REFLECT',
  // Past the last step: every step reads COMPLETE.
  DONE = 'DONE',
}

export const FLOW_ORDER: FlowStep[] = [
  FlowStep.ASSESS,
  FlowStep.UNDERSTAND,
  FlowStep.CHOOSE,
  FlowStep.REASSESS,
  FlowStep.REFLECT,
];

/*
 * Nothing persisted separates "reviewing misconceptions" from "choosing an
 * activity" — both are a GENERATED session with no saved plan — so CHOOSE is
 * never the current step. Saving a plan moves the class straight from
 * UNDERSTAND to REASSESS.
 *
 * Checked latest-signal-first, so a session that has moved on is placed by how
 * far it got, not by the first gap.
 */
export function deriveCurrentStep(
  session: IMicroCoachSession | null,
  // Whether a plan has been saved for this session (usePlanItems scopes its
  // items to the selected session).
  hasSavedPlan: boolean,
): FlowStep {
  if (!session || session.status === SessionStatus.DATA_INGESTED) {
    return FlowStep.ASSESS;
  }
  if (session.status === SessionStatus.COMPLETED) return FlowStep.DONE;
  if (session.postPpqAssessmentId) return FlowStep.REFLECT;
  if (hasSavedPlan) return FlowStep.REASSESS;
  return FlowStep.UNDERSTAND;
}

/*
 * Where each step lives once it is done. Not stepCta: that answers "what next"
 * for the current step, so CHOOSE there means go and choose (/review), while a
 * completed CHOOSE means look at what was chosen (/myactivity). Its own page,
 * /review/:misconceptionId/activities, needs a misconception the stepper does
 * not have.
 */
const STEP_PATH: Record<Exclude<FlowStep, FlowStep.DONE>, string> = {
  [FlowStep.ASSESS]: '/upload-miu',
  [FlowStep.UNDERSTAND]: '/review',
  [FlowStep.CHOOSE]: '/myactivity',
  [FlowStep.REASSESS]: '/upload-reassess',
  [FlowStep.REFLECT]: '/reflect',
};

export function buildFlowSteps(current: FlowStep, t: Translate): IFlowStep[] {
  const currentIndex =
    current === FlowStep.DONE ? FLOW_ORDER.length : FLOW_ORDER.indexOf(current);
  return FLOW_ORDER.map((step, index) => {
    let state: IFlowStep['state'] = 'UPCOMING';
    if (index < currentIndex) state = 'COMPLETE';
    else if (index === currentIndex) state = 'CURRENT';
    return {
      order: index + 1,
      label: t(`dashboard.steps.${step}`),
      state,
      path: STEP_PATH[step as Exclude<FlowStep, FlowStep.DONE>],
      // Assess is also clickable while current: it is the way into the flow
      // for a class with no data yet, so it should not wait to be completed.
      isClickable: state === 'COMPLETE' || step === FlowStep.ASSESS,
    };
  });
}

// The breadcrumb before the class's sessions are known: every label, none
// marked current and none linked, so it renders at once and is corrected when
// the query answers rather than guessing a step that may jump.
export function buildPendingFlowSteps(t: Translate): IFlowStep[] {
  return buildFlowSteps(FlowStep.ASSESS, t).map((step) => ({
    ...step,
    state: 'UPCOMING',
    isClickable: false,
  }));
}

// The dashboard's one call to action follows the current step. REASSESS is
// the post-activity upload (/upload-reassess); DONE starts the next cycle the same way.
export function stepCta(current: FlowStep): { labelKey: string; path: string } {
  switch (current) {
    case FlowStep.UNDERSTAND:
    case FlowStep.CHOOSE:
      return { labelKey: 'dashboard.cta.UNDERSTAND', path: '/review' };
    case FlowStep.REASSESS:
      return { labelKey: 'dashboard.cta.REASSESS', path: '/upload-reassess' };
    case FlowStep.REFLECT:
      return { labelKey: 'dashboard.cta.REFLECT', path: '/reflect' };
    case FlowStep.ASSESS:
    case FlowStep.DONE:
    default:
      return { labelKey: 'dashboard.cta.ASSESS', path: '/upload-miu' };
  }
}

// Latest first: by week when both carry one, else by creation time.
export function sortSessionsLatestFirst(
  sessions: IMicroCoachSession[],
): IMicroCoachSession[] {
  return [...sessions].sort((a, b) => {
    if (a.weekNumber != null && b.weekNumber != null && a.weekNumber !== b.weekNumber) {
      return b.weekNumber - a.weekNumber;
    }
    return b.createdAt.localeCompare(a.createdAt);
  });
}
