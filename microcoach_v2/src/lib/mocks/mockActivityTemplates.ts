/*
 * MOCK — DELETE when the real per-template content lands (planned 2026-10-08).
 *
 * The Select Activity cards show each template's name, a "why" lead-in, a
 * numbered run-of-show and the grouping sequence it moves through. None of
 * that is in the activity data yet, so this stands in, copied from the
 * SelectActivity frame: Spot the Slip is the frame's left card, My Favorite No
 * its right one, and the other four reuse them until their content exists.
 *
 * Only ActivityCard reads it. To remove: delete this file and the
 * `mockActivityTemplate` import there. Deliberately untranslated — Spanish keys
 * for throwaway copy would only have to be hunted down later.
 */
import { ActivityType } from '../PipelineModels';

export type GroupingKind = 'INDIVIDUAL' | 'PAIRS' | 'WHOLE_CLASS';

export interface IMockRunStep {
  text: string;
  // null for a step that repeats earlier ones rather than regrouping.
  grouping: GroupingKind | null;
}

export interface IMockActivityTemplate {
  name: string;
  // The card adds the misconception's title (bold) after this.
  whyLeadIn: string;
  steps: IMockRunStep[];
}

const SPOT_THE_SLIP: IMockActivityTemplate = {
  name: 'Spot the Slip',
  whyLeadIn:
    'Students will examine a worked solution, identify the first step where the reasoning goes off track, explain why the mistake happened, and work together to correct it. This activity helps address the misconception of',
  steps: [
    { text: 'Show Example 1 — Individual think time', grouping: 'INDIVIDUAL' },
    { text: 'Attempt a fix — Individual', grouping: 'INDIVIDUAL' },
    { text: 'Pairs compare and revise', grouping: 'PAIRS' },
    { text: 'Repeat with other examples', grouping: null },
    { text: 'Whole-class synthesis', grouping: 'WHOLE_CLASS' },
  ],
};

const MY_FAVORITE_NO: IMockActivityTemplate = {
  name: 'My Favorite No',
  whyLeadIn:
    'Students will analyze a common incorrect answer (or an anonymous student response), discuss why someone might have chosen it, identify what the reasoning gets right, and determine how to improve it. This activity helps address the misconception of',
  steps: [
    { text: 'Show Example 1 — Individual think time', grouping: 'INDIVIDUAL' },
    { text: 'Pairs discuss student reasoning', grouping: 'PAIRS' },
    { text: 'Pairs determine how to improve it', grouping: 'PAIRS' },
    { text: 'Repeat with other examples', grouping: null },
    { text: 'Whole-class synthesis', grouping: 'WHOLE_CLASS' },
  ],
};

const MOCK_TEMPLATES: Record<ActivityType, IMockActivityTemplate> = {
  INCORRECT_WORKED_EXAMPLES: SPOT_THE_SLIP,
  FAVORITE_NO: MY_FAVORITE_NO,
  COMPARE_THE_THINKING: { ...MY_FAVORITE_NO, name: 'Compare the Thinking' },
  MULTIPLE_REPRESENTATIONS: { ...SPOT_THE_SLIP, name: 'Make the Connections' },
  MATH_DETECTIVE: { ...SPOT_THE_SLIP, name: 'Math Detective' },
  MAKE_YOUR_CASE: { ...MY_FAVORITE_NO, name: 'Make Your Case' },
};

export function mockActivityTemplate(type: ActivityType): IMockActivityTemplate {
  return MOCK_TEMPLATES[type] ?? SPOT_THE_SLIP;
}

export interface IGroupingRun {
  kind: GroupingKind;
  // The step this grouping starts at: unique per run, so it doubles as a key.
  fromStep: number;
}

/**
 * The groupings in run order, a new entry each time the grouping changes:
 * Individual › Pairs › Whole Class.
 */
export function groupingSequence(steps: IMockRunStep[]): IGroupingRun[] {
  return steps.reduce<IGroupingRun[]>((sequence, step, index) => {
    if (step.grouping && sequence[sequence.length - 1]?.kind !== step.grouping) {
      sequence.push({ kind: step.grouping, fromStep: index });
    }
    return sequence;
  }, []);
}
