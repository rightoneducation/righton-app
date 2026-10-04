import { SessionStatus } from '../AWSAPI';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { IMicroCoachSavedPlan } from '../api/Models/IMicroCoachSavedPlan';
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

const ORDER: FlowStep[] = [
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
  savedPlans: IMicroCoachSavedPlan[],
): FlowStep {
  if (!session || session.status === SessionStatus.DATA_INGESTED) {
    return FlowStep.ASSESS;
  }
  if (session.status === SessionStatus.COMPLETED) return FlowStep.DONE;
  if (session.postPpqAssessmentId) return FlowStep.REFLECT;
  const hasPlan = savedPlans.some(
    (plan) => plan.sessionId === session.id && plan.items.length > 0,
  );
  if (hasPlan) return FlowStep.REASSESS;
  return FlowStep.UNDERSTAND;
}

/*
 * Where each step lives once it is done. Not stepCta: that answers "what next"
 * for the current step, so CHOOSE there means go and choose (/review), while a
 * completed CHOOSE means look at what was chosen (/myplan). Its own page,
 * /review/:misconceptionId/activities, needs a misconception the stepper does
 * not have.
 */
const STEP_PATH: Record<Exclude<FlowStep, FlowStep.DONE>, string> = {
  [FlowStep.ASSESS]: '/upload-rtd',
  [FlowStep.UNDERSTAND]: '/review',
  [FlowStep.CHOOSE]: '/myplan',
  [FlowStep.REASSESS]: '/upload-rtd',
  [FlowStep.REFLECT]: '/reflect',
};

export function buildFlowSteps(current: FlowStep, t: Translate): IFlowStep[] {
  const currentIndex =
    current === FlowStep.DONE ? ORDER.length : ORDER.indexOf(current);
  return ORDER.map((step, index) => {
    let state: IFlowStep['state'] = 'UPCOMING';
    if (index < currentIndex) state = 'COMPLETE';
    else if (index === currentIndex) state = 'CURRENT';
    return {
      order: index + 1,
      label: t(`home.steps.${step}`),
      state,
      path: STEP_PATH[step as Exclude<FlowStep, FlowStep.DONE>],
      // Assess is also clickable while current: it is the way into the flow
      // for a class with no data yet, so it should not wait to be completed.
      isClickable: state === 'COMPLETE' || step === FlowStep.ASSESS,
    };
  });
}

// The dashboard's one call to action follows the current step. REASSESS is
// another upload (the post-PPQ); DONE starts the next cycle the same way.
export function stepCta(current: FlowStep): { labelKey: string; path: string } {
  switch (current) {
    case FlowStep.UNDERSTAND:
    case FlowStep.CHOOSE:
      return { labelKey: 'home.cta.UNDERSTAND', path: '/review' };
    case FlowStep.REASSESS:
      return { labelKey: 'home.cta.REASSESS', path: '/upload-rtd' };
    case FlowStep.REFLECT:
      return { labelKey: 'home.cta.REFLECT', path: '/reflect' };
    case FlowStep.ASSESS:
    case FlowStep.DONE:
    default:
      return { labelKey: 'home.cta.ASSESS', path: '/upload-rtd' };
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
