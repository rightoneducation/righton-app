/**
 * The pipeline as drawn on /preview: the stages in run order (following
 * seed/cli/generate.ts) and the boxes drawn around them. Both the diagram and
 * the formulae section read from here, so a formula can only point at a stage
 * that is actually in the diagram.
 *
 * `who` separates the three kinds of step: an external service call, a
 * computation over the response rows, or a model call.
 */

export type Who = 'api' | 'code' | 'llm';

// A coordination doc a stage or formula was specified in. Rendered as a tag
// that opens the doc.
export interface Origin {
  label: string;
  href: string;
}

export const WAVE2_DOC: Origin = {
  label: 'Wave 2 doc',
  href: 'https://docs.google.com/document/d/1YnGsDBJGAlpy0nyE36nAogB9hl38YLav8TdP6guvdRA/edit?tab=t.0',
};

export interface Stage {
  id: string;
  label: string;
  // Plain-language line under the title, for a reader who doesn't know the code.
  subtitle: string;
  who: Who;
  where: string;
  detail: string;
  out: string[];
}

export const STAGES: Stage[] = [
  {
    id: 'session',
    label: 'Fetch classroom session',
    subtitle: "Pull in the quiz and every student's answers",
    who: 'api',
    where: 'AppSync / DynamoDB · fixture in eval mode',
    detail: 'Reads the classroom, the session\'s questions, and every student\'s responses with confidence ratings.',
    out: ['questions + answer options', 'student responses', 'confidence ratings'],
  },
  {
    id: 'kg',
    label: 'Fetch Knowledge Graph',
    subtitle: "Look up what the standards build on and lead to",
    who: 'api',
    where: 'GetLearningScience → Learning Commons',
    detail: 'Queries the knowledge graph for the session\'s standards. In eval runs, the chosen condition then excludes one section of the response before it reaches any prompt, so the run measures what that section contributes. For example, NO_PREREQ empties the prerequisite standards; NONE keeps the full graph.',
    out: ['knowledge-graph standards', 'prerequisite + dependent standards', 'one section excluded per eval condition'],
  },
  {
    id: 'count',
    label: 'Compute Response Patterns',
    subtitle: "Tally who picked which wrong answer, and how sure they were",
    who: 'code',
    where: 'generate.ts 4b',
    detail: 'Tallies which wrong option each student chose and computes the per-question confidence stats.',
    out: ['wrong-answer distribution', 'highConfWrongPct', 'avgConfidence correct / incorrect'],
  },
  {
    id: 'gen',
    label: 'Identify/Generate Misconceptions',
    subtitle: "Name the thinking behind each wrong answer",
    who: 'llm',
    where: 'LLMGenMisconception',
    detail: 'One call over the whole quiz. Names the misconceptions behind the wrong options and maps each to the options it produces.',
    out: ['misconception list', 'wrong-answer refs per misconception'],
  },
  {
    id: 'reach',
    label: 'Compute Misconception Reach',
    subtitle: "Count how many students each misconception affects",
    who: 'code',
    where: 'generate.ts 4c → computeReach.ts',
    detail: 'Runs inside the same step as Generate Misconceptions, on the lambda\'s output. Counts the distinct students who chose any option linked to a misconception, and the mean confidence of their linked picks. Not estimated.',
    out: ['studentCount', 'studentPercent', 'meanConfidence'],
  },
  {
    id: 'rubric',
    label: 'Score & Rank Misconceptions',
    subtitle: "Grade each one on the Wave 2 rubric and pick the Recommended Focus",
    who: 'code',
    where: 'ScoresCalc · misconceptionRubric.json',
    detail: 'One call over all misconceptions. Bands the measured inputs (share of class, downstream standards, mean confidence) 0–3, asks the model for Conceptual Depth 0–3, sums, ranks and keeps the top three. Rank 1 is the Recommended Focus.',
    out: ['rubric scores + total', 'priorityRank', 'isRecommendedFocus', 'retained'],
  },
  {
    id: 'need',
    label: 'Identify/Generate Instructional Needs',
    subtitle: "Decide what students need to do next",
    who: 'llm',
    where: 'LLMGenInstrNeed',
    detail: 'One call over the retained misconceptions. Writes what students need to do next and the rationale behind it. Rank and depth arrive as givens from step 6; the need inherits its misconception\'s rank.',
    out: ['instructional need', 'rationale'],
  },
  {
    id: 'select',
    label: 'Select Activity Templates',
    subtitle: "Choose the two best-fitting activity routines",
    who: 'llm',
    where: 'LLMSelectTemplate',
    detail: 'One call over all needs. Picks the two activity templates whose primary instructional move best fits each need, scoring each pick 0–3 on the Wave 2 Instructional Fit scale.',
    out: ['top two templates', 'instructionalFit 0–3', 'belowThreshold'],
  },
  {
    id: 'activity',
    label: 'Generate Activities',
    subtitle: "Write the classroom activity for each routine",
    who: 'llm',
    where: 'NextStepOption (6a planner, 6b generator)',
    detail: 'A planner call assigns activity structures across all misconceptions, then a generator call per misconception per format (whole class, split class). This is the pre-template generator: it does not yet receive the templates selected in step 8.',
    out: ['activities per misconception × format'],
  },
];


// The boxes drawn around the stages: how often each part of the pipeline runs.
// `inner` draws a dashed box around stages that are one numbered step in
// generate.ts even though they are two kinds of work.
export interface StageGroup {
  id: string;
  label: string;
  cadence: string;
  stageIds: string[];
  inner?: { label: string; stageIds: string[] };
  caveat?: string;
}

export const GROUPS: StageGroup[] = [
  { id: 'inputs', label: 'Inputs', cadence: 'once per session', stageIds: ['session', 'kg'] },
  {
    id: 'analysis',
    label: 'Misconception analysis',
    cadence: 'once per quiz',
    stageIds: ['count', 'gen', 'reach', 'rubric'],
    inner: { label: 'step 4c', stageIds: ['gen', 'reach'] },
  },
  {
    id: 'recommend',
    label: 'Recommendation',
    cadence: 'one call over all misconceptions',
    stageIds: ['need', 'select'],
  },
  {
    id: 'activity',
    label: 'Activity generation',
    cadence: 'per misconception × format',
    stageIds: ['activity'],
    caveat: 'Under construction',
  },
];
