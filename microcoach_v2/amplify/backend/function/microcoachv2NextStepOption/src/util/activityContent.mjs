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

const runStepFields = {
  title: z.string().describe('Short step name, e.g. "Show Example 1" or "Compare and revise"'),
  body: z.string().describe('What the teacher and students do in this step, 1-2 short sentences'),
  groupings: z.array(GroupingKind).max(2).describe('How students are grouped for this step: one value; two only when the teacher chooses between them ("Pairs or Whole Class"); empty for a step that does not regroup, such as "Repeat with other examples"'),
};

// Minutes are planned per step, so the time a teacher sees is the sum of what the
// steps ask for rather than a label written beside them. Activities generated
// before 2026-10-19 (and the hand-seeded ones) have none, so the stored shape
// leaves it optional.
const STEP_MINUTES_MAX = 8;
function runStepFor(mode) {
  const minutes = z.number().int().min(1).max(STEP_MINUTES_MAX)
    .describe('Realistic class minutes for this step with a class of about 28: the time students actually need to read, work the math, talk in pairs and share out, plus any regrouping. Not an ideal pace.');
  return z.object({ ...runStepFields, minutes: mode === 'stored' ? minutes.optional() : minutes });
}

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
// One $…$ span and nothing else: the schema itself leaves no room for words
// around the math (a bound, not a describe).
const ONE_EXPRESSION = /^\s*\$[^$]+\$\s*$/;
const Expression = z.string().regex(ONE_EXPRESSION);

/**
 * The math as a declared shape. A system is its own variant that needs at least
 * two expressions, so strict mode cannot produce a "system" with one inequality
 * (v30 stored "Graph the solution set of the system: $y + x > 2$", its second
 * inequality missing). The kind comes first, so the model commits to it before
 * writing anything else; one expression per item also leaves no place for
 * "\quad\text{and}\quad" between them.
 */
const MathStatement = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('SINGLE'),
    expressions: z.array(Expression).length(1).describe('The one expression, equation or inequality, e.g. ["$x - 2y \\geq -3$"]'),
  }),
  z.object({
    kind: z.literal('SYSTEM'),
    expressions: z.array(Expression).min(2).max(3).describe('Every equation or inequality of the system, one per item, e.g. ["$y + x > 2$", "$y \\leq 3x - 2$"]. All of them: the work and the answers may only use what is listed here.'),
  }),
]);

function problemFields(mode) {
  if (mode === 'stored') {
    return {
      prompt: z.string().describe('The full problem: the task and its math'),
      problem: z.string().describe('The math alone, shown on the example tile'),
    };
  }
  return {
    math: MathStatement.describe('The problem\'s math, with no words. SYSTEM for a system (list every equation or inequality in it), SINGLE otherwise. Never a point or answer choices to pick from.'),
    task: z.string().max(TASK_MAX).describe('The instruction alone, as a short imperative or question with no trailing punctuation, e.g. "Graph the inequality", "Solve for $x$", "Find a solution of the system". Student-facing: never student work, a description of a response, a hint, or how to solve it. Never a multiple-choice stem ("Which graph…", "Which of the following…"): the student sees no answer choices, so restate the question as an open problem that needs no given value, e.g. "Find a solution of the system" or "Graph the system".'),
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
// `onFallback` is told each time, so the run can count how often this guard
// covered for the generator.
const NAMES_A_POINT = /\b(the|this|that|a specific|the given) point\b/i;
const IS_A_POINT = /^\s*\$\s*\(.*\)\s*\$\s*$/;
const ANSWERABLE_FALLBACK = 'Find a solution';

const expressionsOf = (math) => (math?.expressions ?? []).map((e) => String(e).trim());

export function toStoredFacilitate(facilitate, onFallback = () => {}) {
  if (!EXAMPLE_TYPES.includes(facilitate?.type)) return facilitate;
  return {
    ...facilitate,
    examples: facilitate.examples.map(({ task, math, ...rest }) => {
      const expressions = expressionsOf(math);
      const joined = expressions.join(', ');
      const missingPoint = NAMES_A_POINT.test(task ?? '') && !expressions.some((e) => IS_A_POINT.test(e));
      if (missingPoint) onFallback({ task, math: joined });
      const instruction = (missingPoint ? ANSWERABLE_FALLBACK : String(task ?? '')).trim().replace(/[.:?]\s*$/, '');
      return { problem: joined, prompt: instruction ? `${instruction}: ${joined}` : joined, ...rest };
    }),
  };
}

/**
 * Generated examples whose instruction names a system but whose math is not one
 * (declared SINGLE, or fewer than two expressions). The schema forces a SYSTEM to
 * list two or more; this catches the model declaring SINGLE under "Graph the
 * system". The handler regenerates the activity once when any are found.
 */
const NAMES_A_SYSTEM = /\bsystems?\b/i;

export function incompleteSystems(facilitate) {
  if (!EXAMPLE_TYPES.includes(facilitate?.type)) return [];
  return (facilitate.examples ?? []).flatMap(({ task, math }, i) => (
    NAMES_A_SYSTEM.test(task ?? '') && (math?.kind !== 'SYSTEM' || expressionsOf(math).length < 2)
      ? [{ example: i + 1, task, math: expressionsOf(math).join(', ') }]
      : []
  ));
}

/**
 * Templates whose grouping pattern runs one way, smallest to largest
 * (Individual → pairs → whole class). The others are left out on purpose: Make
 * Your Case's re-vote is individual again by design ("Revisit the claim"), and
 * Math Detective and Compare the Thinking start at pairs or the whole class.
 */
export const ORDERED_GROUPING_TYPES = ['FAVORITE_NO', 'INCORRECT_WORKED_EXAMPLES'];

const GROUPING_RANK = Object.fromEntries(GROUPING_KINDS.map((kind, i) => [kind, i]));

/**
 * Run steps that go back to a smaller grouping after the class has reached a
 * larger one (dev QA 2026-10-28: My Favorite No as Individual → Pairs → Whole
 * class → Pairs). A step offering two groupings counts as the smaller; a step
 * that doesn't regroup is skipped. The handler regenerates once when any are
 * found.
 */
export function groupingRegressions(plan, contentType) {
  if (!ORDERED_GROUPING_TYPES.includes(contentType)) return [];
  let peak = -1;
  return (plan?.howToRun ?? []).flatMap((step, i) => {
    const ranks = (step.groupings ?? []).map((kind) => GROUPING_RANK[kind]);
    if (!ranks.length) return [];
    const rank = Math.min(...ranks);
    const isBack = rank < peak;
    peak = Math.max(peak, rank);
    return isBack ? [{ step: i + 1, title: step.title, groupings: step.groupings }] : [];
  });
}

const DEFAULT_BOUNDS = {
  examplesMin: 1, examplesMax: 3,
  beforeClassMin: 2, beforeClassMax: 3,
  howToRunMin: 4, howToRunMax: 6,
  discussionMinutesMin: 2, discussionMinutesMax: 5,
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
  const beforeClass = z.object({
    steps: z.array(z.string()).min(b.beforeClassMin).max(b.beforeClassMax).describe('What the teacher prepares before class, one sentence each'),
    groupingRationale: z.string().describe('1-2 sentences: why students are grouped this way for this activity'),
  });
  const howToRun = z.array(runStepFor(mode)).min(b.howToRunMin).max(b.howToRunMax).describe('The run-of-show, following the template\'s classroom flow and grouping pattern');
  const why = z.string().describe('2-3 teacher-facing sentences: the student need, why this template\'s move fits it, and how the activity addresses it. Not a description of the steps.');
  if (mode === 'stored') {
    return z.object({
      whyThisActivity: why,
      durations: z.object({ beforeClass: z.string(), facilitate: z.string(), discussion: z.string() }),
      beforeClass,
      howToRun,
      facilitate,
    });
  }
  // Generated: minutes, not duration labels. The durations are computed from them
  // (toStoredDurations), so the time shown always matches what the steps ask for.
  return z.object({
    whyThisActivity: why,
    beforeClass,
    beforeClassMinutes: z.number().int().min(1).max(15).describe('Teacher prep before class, in minutes. Outside class time.'),
    howToRun,
    discussionMinutes: z.number().int().min(b.discussionMinutesMin).max(b.discussionMinutesMax).describe('Class minutes reserved for the closing discussion that follows the steps above. The teacher runs one discussion question in it.'),
    facilitate,
  });
}

/**
 * Class minutes the generated plan asks for: its steps plus the discussion it
 * reserves. Prep before class is outside the window.
 */
export function plannedClassMinutes(plan) {
  const steps = (plan?.howToRun ?? []).reduce((sum, s) => sum + (s.minutes ?? 0), 0);
  return { steps, discussion: plan?.discussionMinutes ?? 0, total: steps + (plan?.discussionMinutes ?? 0) };
}

/**
 * The stored durations, computed: the steps' sum, and the longest discussion
 * question (the teacher runs one of the three, so whichever they pick fits).
 */
export function toStoredDurations(plan, discussionQuestions = null) {
  const { steps, discussion } = plannedClassMinutes(plan);
  const longest = discussionQuestions?.length
    ? Math.max(...discussionQuestions.map((q) => q.minutes ?? 0))
    : discussion;
  return {
    beforeClass: `${plan.beforeClassMinutes} min`,
    facilitate: `${steps} min`,
    discussion: `${longest} min`,
  };
}

// ── Call 2: the closing discussion ────────────────────────────────────────────

export const QUESTION_PURPOSES = ['TEST', 'GENERALIZE', 'APPLY', 'CHALLENGE', 'CONNECT'];

/**
 * Field order is the generation order the doc asks for: the takeaway is written
 * first and anchors the questions and Watch for sets that follow. `purpose` is
 * the question type, kept for the trace and stripped before storage.
 */
// `minutesMax` is the discussion time the activity reserved: each question is an
// alternative the teacher may run alone, so each must fit it by itself.
export function discussionDraftSchema(bounds = {}, minutesMax = DEFAULT_BOUNDS.discussionMinutesMax) {
  const b = { ...DEFAULT_BOUNDS, ...bounds };
  return z.object({
    takeaway: z.string().describe('The one central mathematical idea students should leave with, in 1-2 sentences of mathematics: not a description of the activity, not a restatement of the need, and no list of edge cases or conditions (those go in a question\'s teacher answer)'),
    questions: z.array(z.object({
      purpose: z.enum(QUESTION_PURPOSES),
      question: z.string().describe('Student-facing'),
      answer: z.string().describe('Teacher view only: the mathematically correct answer or what to listen for, 1-3 sentences'),
      minutes: z.number().int().min(1).max(minutesMax).describe(`Realistic minutes to run this question alone with the whole class: think time, a few responses, and the teacher drawing out the point. At most ${minutesMax}, the time reserved for the discussion.`),
    })).length(b.questionCount).describe(`${b.questionCount} alternatives: the teacher picks the one that best fits the class and runs it alone`),
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
    questions: draft.questions.map(({ question, answer, minutes }) => ({ question, answer, ...(minutes != null && { minutes }) })),
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
      questions: z.array(z.object({ question: z.string(), answer: z.string(), minutes: z.number().int().optional() })).length(b.questionCount),
      watchFors: z.array(z.object({
        watchFor: z.string(), tryAsking: z.string(), howToRespond: z.string(),
      })).min(b.watchForMin).max(b.watchForMax),
      takeaway: z.string(),
    }),
  });
}

// ── Teacher-view labels, for the accuracy review ──────────────────────────────

/**
 * The teacher-view parts of an artifact the accuracy review may correct: the
 * correctness labels (line status, step annotation, verdict, highlight) and the
 * teacher-only prose. Each has a path id the review names it by. Student-facing
 * text and the math are deliberately absent, so a correction cannot reach them —
 * a problem reviewer that could rewrite the math was removed for changing it.
 *
 * `allowed` is the label's value set, with NONE standing for null; prose has none.
 */
const LABEL_SPECS = {
  INCORRECT_WORKED_EXAMPLES: [
    { list: 'examples', items: 'steps', path: 'annotation.kind', allowed: ['CORRECT', 'ERROR', 'NONE'] },
    { list: 'examples', items: 'steps', path: 'annotation.text' },
    { list: 'examples', path: 'finalOutcome' },
  ],
  FAVORITE_NO: [
    { list: 'examples', items: 'work', path: 'status', allowed: ['CORRECT', 'INCORRECT', 'NEUTRAL'] },
    { list: 'examples', items: 'notice', path: 'kind', allowed: ['PRESERVE', 'REVISE'] },
    { list: 'examples', items: 'notice', path: 'text' },
  ],
  MATH_DETECTIVE: [
    { list: 'examples', items: 'workSummary', path: 'status', allowed: ['CORRECT', 'INCORRECT', 'NEUTRAL'] },
    { list: 'examples', items: 'stages', path: 'answer' },
  ],
  COMPARE_THE_THINKING: [
    { list: 'strategies', path: 'verdict', allowed: ['CORRECT', 'INCORRECT', 'STRONGER', 'NONE'] },
    { list: 'strategies', items: 'steps', path: 'highlight', allowed: ['ERROR', 'SUCCESS', 'NONE'] },
    { list: 'strategies', items: 'notes', path: 'text' },
  ],
  MAKE_YOUR_CASE: [
    { path: 'resolution.verdict', allowed: ['TRUE', 'FALSE', 'CONDITIONAL'] },
    { path: 'resolution.why' },
    { list: 'examples', path: 'answer' },
    { list: 'arguments', path: 'text' },
  ],
};

const getPath = (obj, dotted) => dotted.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

function setPath(obj, dotted, value) {
  const keys = dotted.split('.');
  const last = keys.pop();
  const parent = keys.reduce((o, k) => (o == null ? undefined : o[k]), obj);
  // An annotation is null on an unremarked step: creating one needs its object.
  if (parent == null) {
    if (dotted.endsWith('annotation.kind')) {
      const owner = getPath(obj, keys.slice(0, -1).join('.'));
      if (owner) owner.annotation = { kind: value, text: null };
    }
    return;
  }
  parent[last] = value;
}

/** [{ id, allowed?, current }] for every correctable part of the artifact. */
export function teacherLabels(facilitate) {
  const out = [];
  for (const spec of LABEL_SPECS[facilitate?.type] ?? []) {
    const parents = spec.list
      ? (facilitate[spec.list] ?? []).map((item, i) => ({ item, id: `${spec.list}[${i}]` }))
      : [{ item: facilitate, id: '' }];
    for (const { item, id } of parents) {
      const owners = spec.items
        ? (item[spec.items] ?? []).map((sub, j) => ({ sub, id: `${id}.${spec.items}[${j}]` }))
        : [{ sub: item, id }];
      for (const { sub, id: ownerId } of owners) {
        const current = getPath(sub, spec.path);
        if (!spec.allowed && typeof current !== 'string') continue;
        out.push({
          id: `${ownerId ? `${ownerId}.` : ''}${spec.path}`,
          allowed: spec.allowed ?? null,
          current: spec.allowed ? (current ?? 'NONE') : current,
        });
      }
    }
  }
  return out;
}

/** "examples[0].work[1].status" → "examples.0.work.1.status" */
const dottedFromId = (id) => id.replace(/\[(\d+)\]/g, '.$1');

/** Set a label by id; NONE clears it, and a cleared annotation is null as a whole, as generated. */
function setLabel(obj, id, label) {
  const dotted = dottedFromId(id);
  if (label === 'NONE' && id.endsWith('annotation.kind')) setPath(obj, dotted.replace(/\.kind$/, ''), null);
  else setPath(obj, dotted, label === 'NONE' ? null : label);
}

/**
 * Apply the review's fixes to a copy of the artifact. A fix names an id from
 * teacherLabels and gives `label` (for a label) or `text` (for prose). Anything
 * else is rejected, not guessed at. Spot the Slip must keep exactly one ERROR per
 * example — the step its whole activity is built on — so an example whose fixes
 * would break that keeps its original steps.
 */
export function applyLabelFixes(facilitate, fixes = []) {
  const known = new Map(teacherLabels(facilitate).map((l) => [l.id, l]));
  const next = structuredClone(facilitate);
  const applied = [];
  const rejected = [];
  for (const fix of fixes) {
    const target = known.get(fix?.id);
    if (!target) { rejected.push({ ...fix, reason: 'unknownId' }); continue; }
    if (target.allowed) {
      if (!target.allowed.includes(fix.label)) { rejected.push({ ...fix, reason: 'labelNotAllowed' }); continue; }
      if (fix.label === target.current) continue;
      setLabel(next, target.id, fix.label);
    } else {
      if (typeof fix.text !== 'string' || !fix.text.trim()) { rejected.push({ ...fix, reason: 'noText' }); continue; }
      if (fix.text === target.current) continue;
      setPath(next, dottedFromId(target.id), fix.text);
    }
    applied.push({ id: target.id, from: target.current, to: target.allowed ? fix.label : fix.text });
  }

  // A fix that adds a second ERROR (or removes the one there is) is dropped on its
  // own; the example's other fixes still apply. v36: the review rightly marked four
  // unlabelled correct steps CORRECT but also marked a consequence of the slip
  // ERROR, and rejecting the whole example threw the good fixes away with it.
  if (next.type === 'INCORRECT_WORKED_EXAMPLES') {
    const countErrors = (steps) => (steps ?? []).filter((s) => s.annotation?.kind === 'ERROR').length;
    next.examples = next.examples.map((ex, i) => {
      if (countErrors(ex.steps) === 1) return ex;
      const original = facilitate.examples[i];
      const candidate = structuredClone(original);
      const wasError = (j) => original.steps?.[j]?.annotation?.kind === 'ERROR';
      const onSteps = applied.filter((f) => f.id.startsWith(`examples[${i}].steps`));
      for (const a of onSteps) {
        const j = Number(a.id.match(/steps\[(\d+)\]/)[1]);
        const local = a.id.slice(`examples[${i}].`.length);
        if (a.id.endsWith('annotation.kind')) {
          if (a.to === 'ERROR' ? !wasError(j) : wasError(j)) {
            rejected.push({ id: a.id, label: a.to, reason: 'wouldNotLeaveOneError' });
            continue;
          }
          setLabel(candidate, local, a.to);
        } else {
          setPath(candidate, dottedFromId(local), a.to);
        }
      }
      if (countErrors(candidate.steps) === 1) return { ...ex, steps: candidate.steps };
      // The original itself did not have one ERROR: leave it as generated.
      for (const a of onSteps) {
        if (!rejected.some((r) => r.id === a.id)) rejected.push({ id: a.id, label: a.to, reason: 'wouldNotLeaveOneError' });
      }
      return { ...ex, steps: original.steps };
    });
  }
  const reverted = new Set(rejected.filter((r) => r.reason === 'wouldNotLeaveOneError').map((r) => r.id));
  return { facilitate: next, applied: applied.filter((a) => !reverted.has(a.id)), rejected };
}
