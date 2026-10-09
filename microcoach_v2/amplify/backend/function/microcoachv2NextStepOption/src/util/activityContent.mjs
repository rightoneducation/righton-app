/**
 * Activity content, Wave 2 (`schemaVersion: 2`).
 *
 * These schemas mirror src/lib/ActivityContentModels.ts field for field: that
 * file is what the app renders, and what this Lambda returns is stored as-is in
 * the MicroCoachActivity row's `phases`. Nothing checks the two automatically
 * across the CRA/Lambda boundary, so change them together. (seed/eval/scripts/
 * checkContentContract.mjs parses the hand-seeded activities against
 * activityContentSchemaFor, which catches drift in one direction.)
 *
 * Content is generated in two calls (see index.mjs), so it is described by two
 * schemas that combine into the stored shape:
 *   - activityPlanSchemaFor: why, durations, before class, how to run, and the
 *     template's own artifact (`facilitate`);
 *   - DiscussionDraft: the closing discussion, takeaway first so the model
 *     writes need → takeaway → questions + Watch for in that order.
 *
 * Cardinality lives in the schema rather than in prose: a bound is the one form
 * of guidance the model reliably honours (see microcoachv2LLMGenInstrNeed and the
 * zod-bounds note in the pipeline memory).
 */

import { z } from 'zod';

export const CONTENT_VERSION = 2;

export const GROUPING_KINDS = ['INDIVIDUAL', 'PAIRS', 'WHOLE_CLASS'];
const GroupingKind = z.enum(GROUPING_KINDS);

// ── Shared pieces ─────────────────────────────────────────────────────────────

// Teacher-only remark on a step. `text` is null for a bare CORRECT marker; the
// component supplies the "(Correct)" / "← (Error: …)" wrapper so it translates.
const StepAnnotation = z.object({
  kind: z.enum(['CORRECT', 'ERROR']),
  text: z.string().nullable().describe('The note itself, or null for a bare CORRECT marker'),
});

const ExampleStep = z.object({
  step: z.number().int().describe('1-based position in the solution'),
  text: z.string().describe('The step as a student sees it. No correctness marker of its own.'),
  annotation: StepAnnotation.nullable().describe('Teacher view only. null for an unremarked step.'),
});

const WorkLine = z.object({
  text: z.string().describe('One line of the student work, as written'),
  status: z.enum(['CORRECT', 'INCORRECT', 'NEUTRAL']).describe('Teacher view only: whether this line is right. NEUTRAL for a line that just restates the problem.'),
});

const RunStep = z.object({
  title: z.string().describe('Short step name, e.g. "Show Example 1" or "Compare and revise"'),
  body: z.string().describe('What the teacher and students do in this step, 1-2 short sentences'),
  groupings: z.array(GroupingKind).max(2).describe('How students are grouped for this step: one value; two only when the teacher chooses between them ("Pairs or Whole Class"); empty for a step that does not regroup, such as "Repeat with other examples"'),
});

// ── Facilitate: one artifact per template ─────────────────────────────────────

/**
 * How an example states its problem.
 *
 * Generated as two single-purpose fields: `task`, the instruction alone, and
 * `math`, the expression alone. Stored (and rendered) as `prompt`, the full
 * problem, and `problem`, the math shown on the tile. When the model wrote
 * `prompt` and `problem` directly, the two overlapped: tightening one moved
 * its content into the other (instructions in `problem`, student work and hints
 * in `prompt`, the math twice). With one job per field there is nothing to
 * move, and the stored pair is built from them by toStoredFacilitate.
 */
const TASK_MAX = 80;
// One or more $…$ spans separated only by commas or semicolons: the schema itself
// leaves no room for words around the math (a bound, not a describe).
const MATH_ONLY = /^\s*\$[^$]+\$(\s*[,;]\s*\$[^$]+\$)*\s*$/;

function problemFields(mode) {
  if (mode === 'stored') {
    return {
      prompt: z.string().describe('The full problem: the task and its math'),
      problem: z.string().describe('The math alone, shown on the example tile'),
    };
  }
  return {
    task: z.string().max(TASK_MAX).describe('The instruction alone, as a short imperative or question with no trailing punctuation, e.g. "Graph the inequality", "Solve for $x$", "Find a solution of the system". Student-facing: never student work, a description of a response, a hint, or how to solve it. Never a multiple-choice stem ("Which graph…", "Which of the following…"): the student sees no answer choices, so restate the question as an open problem that needs no given value, e.g. "Find a solution of the system" or "Graph the system".'),
    math: z.string().regex(MATH_ONLY).describe('Only the LaTeX for the problem, with no words: the expression, equation or inequality, e.g. "$x - 2y \\geq -3$"; a system as its parts joined by a comma, e.g. "$y + x > 2$, $y \\leq 3x - 2$" (never \\begin{cases}). Never a point or answer choices to pick from, and never words such as "point:", "and" or "options:".'),
  };
}

function spotTheSlip({ examplesMin, examplesMax }, mode) {
  return z.object({
    type: z.literal('INCORRECT_WORKED_EXAMPLES'),
    examples: z.array(z.object({
      ...problemFields(mode),
      slip: z.string().describe('Teacher view only: the slip in 3-6 words, e.g. "Flipped inequality when testing"'),
      steps: z.array(ExampleStep).min(3).max(6).describe('The full worked solution. Annotate correct steps before the slip CORRECT, the FIRST invalid step ERROR, and leave the later steps (consequences of the slip) unannotated.'),
      finalOutcome: z.string().describe('Teacher view only: what the incorrect reasoning arrives at, one sentence'),
    })).min(examplesMin).max(examplesMax).describe('Each example is a DIFFERENT problem (different numbers or a different expression) showing the same need, so the teacher can choose among them — never the same problem repeated.'),
  });
}

function favoriteNo({ examplesMin, examplesMax }, mode) {
  return z.object({
    type: z.literal('FAVORITE_NO'),
    examples: z.array(z.object({
      ...problemFields(mode),
      work: z.array(WorkLine).min(2).max(6).describe('The response, line by line. The error must sit inside partly sound reasoning: keep the sound lines marked CORRECT.'),
      notice: z.array(z.object({
        kind: z.enum(['PRESERVE', 'REVISE']),
        text: z.string(),
      })).min(2).max(4).describe('Teacher view only: what the reasoning gets right or is productively attending to (PRESERVE, listed first), then what needs to change (REVISE).'),
      sourceNote: z.string().describe('Teacher view only: one or two sentences saying this represents one plausible way a student might reason toward the answer, not any one student\'s work, and that a real (anonymous) student response can replace it.'),
    })).min(examplesMin).max(examplesMax).describe('Each example is a DIFFERENT problem (different numbers or a different expression) showing the same need, so the teacher can choose among them — never the same problem repeated.'),
  });
}

function mathDetective({ examplesMin, examplesMax }, mode) {
  return z.object({
    type: z.literal('MATH_DETECTIVE'),
    examples: z.array(z.object({
      ...problemFields(mode),
      workSummary: z.array(WorkLine).min(2).max(5).describe('The response in brief: 2-5 short moves of ONE student\'s attempt. This is the evidence students investigate.'),
      stages: z.array(z.object({
        kind: z.enum(['INVESTIGATE', 'SOLVE', 'GENERALIZE']),
        ask: z.string().describe('Student-facing question for this stage'),
        answer: z.string().describe('Teacher view only: what the stage should land on. INVESTIGATE: the underlying issue and the evidence for it. SOLVE: the revised step and a check that it works. GENERALIZE: the rule to post.'),
      })).length(3).describe('Exactly three, in order: INVESTIGATE, SOLVE, GENERALIZE.'),
    })).min(examplesMin).max(examplesMax).describe('Each example is a DIFFERENT problem (different numbers or a different expression) showing the same need, so the teacher can choose among them — never the same problem repeated.'),
  });
}

const Tone = z.enum(['ERROR', 'SUCCESS', 'NEUTRAL']);

const compareTheThinking = () => z.object({
  type: z.literal('COMPARE_THE_THINKING'),
  problem: z.string().describe('The one problem both strategies attempt'),
  comparison: z.enum(['CORRECT_VS_INCORRECT', 'BOTH_CORRECT']),
  strategies: z.array(z.object({
    label: z.string().describe('"A" for the first strategy, "B" for the second. One letter.'),
    verdict: z.enum(['CORRECT', 'INCORRECT', 'STRONGER']).nullable().describe('Teacher view only. STRONGER marks the more sophisticated of two correct approaches; null when the other is marked STRONGER.'),
    steps: z.array(z.object({
      step: z.number().int(),
      text: z.string(),
      highlight: z.enum(['ERROR', 'SUCCESS']).nullable().describe('Teacher view only: ERROR on the first invalid step, SUCCESS on the step that makes the approach work; null otherwise'),
    })).min(2).max(6),
    notes: z.array(z.object({
      heading: z.string().nullable().describe('e.g. "Why it works"; null for a single unheaded note'),
      text: z.string(),
      tone: Tone,
    })).min(1).max(2).describe('Teacher view only: what this approach reveals about the thinking behind it'),
  })).length(2).describe('Exactly two meaningfully different approaches, given equal weight'),
});

const makeYourCase = () => z.object({
  type: z.literal('MAKE_YOUR_CASE'),
  claim: z.string().describe('The claim, conjecture, or generalization students argue about. Genuinely arguable, not obviously true or false. Do not signal the answer.'),
  resolution: z.object({
    verdict: z.enum(['TRUE', 'FALSE', 'CONDITIONAL']),
    why: z.string().describe('Teacher view only: what the mathematics supports, and the condition or refinement when CONDITIONAL'),
  }),
  studentSteps: z.array(z.string()).min(1).max(3).describe('What students do while building a case, e.g. "Write down why you think so."'),
  examples: z.array(z.object({
    prompt: z.string().describe('A case to bring in, e.g. "Slope 2 vs slope −5"'),
    answer: z.string().describe('Teacher view only: what the case shows'),
  })).min(2).max(4),
  arguments: z.array(z.object({
    stance: z.enum(['SUPPORT', 'CHALLENGE']),
    text: z.string().describe('A substantive mathematical argument — a counterexample, boundary condition, assumption or limitation for CHALLENGE — not a deliberately weak one'),
  })).min(2).max(4).describe('Teacher reference: at least one supporting and one challenging argument'),
});

const FACILITATE_BY_TYPE = {
  INCORRECT_WORKED_EXAMPLES: spotTheSlip,
  FAVORITE_NO: favoriteNo,
  MATH_DETECTIVE: mathDetective,
  COMPARE_THE_THINKING: compareTheThinking,
  MAKE_YOUR_CASE: makeYourCase,
};

export const CONTENT_TYPES = Object.keys(FACILITATE_BY_TYPE);
/** The templates whose artifact is a set of up to three examples. */
export const EXAMPLE_TYPES = ['INCORRECT_WORKED_EXAMPLES', 'FAVORITE_NO', 'MATH_DETECTIVE'];

/** The generated artifact in its stored shape: each example's task + math → prompt + problem. */
// A task that asks about a specific point is unanswerable when the point never
// made it into the math ("Decide whether the point is a solution: $…$"). The
// prompt asks for problems that need no given value; when one slips through
// without its point, it becomes a problem a student can still answer.
const NAMES_A_POINT = /\b(the|this|that|a specific|the given) point\b/i;
const HAS_A_POINT = /;\s*\$/;
const ANSWERABLE_FALLBACK = 'Find a solution';

export function toStoredFacilitate(facilitate) {
  if (!EXAMPLE_TYPES.includes(facilitate?.type)) return facilitate;
  return {
    ...facilitate,
    examples: facilitate.examples.map(({ task, math, ...rest }) => {
      const missingPoint = NAMES_A_POINT.test(task ?? '') && !HAS_A_POINT.test(math ?? '');
      const instruction = (missingPoint ? ANSWERABLE_FALLBACK : String(task ?? '')).trim().replace(/[.:?]\s*$/, '');
      return { problem: math, prompt: instruction ? `${instruction}: ${math}` : math, ...rest };
    }),
  };
}

const DEFAULT_BOUNDS = {
  examplesMin: 1, examplesMax: 3,
  beforeClassMin: 2, beforeClassMax: 3,
  howToRunMin: 4, howToRunMax: 6,
  watchForMin: 1, watchForMax: 3,
  questionCount: 3,
};

export function facilitateSchemaFor(contentType, bounds = {}, mode = 'generate') {
  const build = FACILITATE_BY_TYPE[contentType];
  return build ? build({ ...DEFAULT_BOUNDS, ...bounds }, mode) : null;
}

// ── Call 1: the activity ──────────────────────────────────────────────────────

/** What call 1 generates (`mode` 'generate'), or the same fields as stored ('stored'). */
export function activityPlanSchemaFor(contentType, bounds = {}, mode = 'generate') {
  const b = { ...DEFAULT_BOUNDS, ...bounds };
  const facilitate = facilitateSchemaFor(contentType, b, mode);
  if (!facilitate) return null;
  return z.object({
    whyThisActivity: z.string().describe('2-3 teacher-facing sentences: the student need, why this template\'s move fits it, and how the activity addresses it. Not a description of the steps.'),
    durations: z.object({
      beforeClass: z.string().describe('Prep time, e.g. "5 min"'),
      facilitate: z.string().describe('e.g. "8-10 min"'),
      discussion: z.string().describe('e.g. "3-5 min"'),
    }),
    beforeClass: z.object({
      steps: z.array(z.string()).min(b.beforeClassMin).max(b.beforeClassMax).describe('What the teacher prepares before class, one sentence each'),
      groupingRationale: z.string().describe('1-2 sentences: why students are grouped this way for this activity'),
    }),
    howToRun: z.array(RunStep).min(b.howToRunMin).max(b.howToRunMax).describe('The run-of-show, following the template\'s classroom flow and grouping pattern'),
    facilitate,
  });
}

// ── Call 2: the closing discussion ────────────────────────────────────────────

export const QUESTION_PURPOSES = ['TEST', 'GENERALIZE', 'APPLY', 'CHALLENGE', 'CONNECT'];

/**
 * Field order is the generation order the doc asks for: the takeaway is written
 * first and anchors the questions and Watch for sets that follow. `purpose` is
 * the question type, kept for the trace and stripped before storage.
 */
export function discussionDraftSchema(bounds = {}) {
  const b = { ...DEFAULT_BOUNDS, ...bounds };
  return z.object({
    takeaway: z.string().describe('The mathematical understanding students should leave with: 1-3 sentences of mathematics, not a description of the activity or a restatement of the need'),
    questions: z.array(z.object({
      purpose: z.enum(QUESTION_PURPOSES),
      question: z.string().describe('Student-facing'),
      answer: z.string().describe('Teacher view only: the mathematically correct answer or what to listen for, 1-3 sentences'),
    })).length(b.questionCount),
    watchFors: z.array(z.object({
      watchFor: z.string().describe('One specific student move: what a student might say, do, choose, or represent, then a possible interpretation'),
      tryAsking: z.string().describe('A specific student-facing prompt, in quotation marks'),
      howToRespond: z.string().describe('Concise, actionable teacher guidance, including the idea or answer to be ready to recognize'),
    })).min(b.watchForMin).max(b.watchForMax),
  });
}

/** The draft as stored: question `purpose` removed, takeaway last as the app reads it. */
export function toStoredDiscussion(draft) {
  return {
    questions: draft.questions.map(({ question, answer }) => ({ question, answer })),
    watchFors: draft.watchFors.map(({ watchFor, tryAsking, howToRespond }) => ({ watchFor, tryAsking, howToRespond })),
    takeaway: draft.takeaway,
  };
}

// ── The stored shape ──────────────────────────────────────────────────────────

/** The full stored content: what the app's ActivityContentModels.ts declares. */
export function activityContentSchemaFor(contentType, bounds = {}) {
  const b = { ...DEFAULT_BOUNDS, ...bounds };
  const plan = activityPlanSchemaFor(contentType, b, 'stored');
  if (!plan) return null;
  return plan.extend({
    schemaVersion: z.literal(CONTENT_VERSION),
    discussion: z.object({
      questions: z.array(z.object({ question: z.string(), answer: z.string() })).length(b.questionCount),
      watchFors: z.array(z.object({
        watchFor: z.string(), tryAsking: z.string(), howToRespond: z.string(),
      })).min(b.watchForMin).max(b.watchForMax),
      takeaway: z.string(),
    }),
  });
}
