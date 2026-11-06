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

export const GROUPING_KINDS = ['INDIVIDUAL', 'PAIRS', 'TWO_GROUPS', 'WHOLE_CLASS'];
const GroupingKind = z.enum(GROUPING_KINDS);

// ── Shared pieces ─────────────────────────────────────────────────────────────

// Teacher-only remark on a step. `text` is null for a bare CORRECT marker; the
// component supplies the "(Correct)" / "← (Error: …)" wrapper so it translates.
const StepAnnotation = z.object({
  kind: z.enum(['CORRECT', 'ERROR']),
  text: z.string().nullable().describe('The note itself, or null for a bare CORRECT marker'),
});

// One definition for every student-facing field: the answer reached students in
// four templates, each time through a field with its own narrower rule (v53-v56).
export const STUDENT_TEXT_RULE = 'Student-facing text is only what the student wrote or what students are asked to do. Student work reads as the student wrote it, with no narrator: never "the student", "instead of", what is correct, or the right answer. Work that goes wrong never shows that it is wrong: no check that fails, no note on the mistake. Instructions and questions never state a result.';

const STEP_TEXT_RULE = `${STUDENT_TEXT_RULE} Never a correctness label such as "CORRECT:", "ERROR:" or "INCORRECT:": labels go in the teacher-only field.`;

// Generated with an annotation on every step (NONE for an unremarked one): a
// nullable annotation let the model leave all of them null and write "CORRECT:"
// and "ERROR:" into the step text students see (v43), giving the slip away. The
// stored shape keeps null for an unremarked step, as the app expects.
function exampleStepFor(mode) {
  const text = z.string().describe(`The step as a student sees it. ${STEP_TEXT_RULE}`);
  if (mode === 'stored') {
    return z.object({
      step: z.number().int().describe('1-based position in the solution'),
      text,
      annotation: StepAnnotation.nullable().describe('Teacher view only. null for an unremarked step.'),
    });
  }
  return z.object({
    step: z.number().int().describe('1-based position in the solution'),
    text,
    annotation: z.object({
      kind: z.enum(['CORRECT', 'ERROR', 'NONE']).describe('Teacher view only: CORRECT for a valid step before the slip, ERROR for the first invalid step, NONE for the steps after it'),
      text: z.string().nullable().describe('The note itself, or null for a bare marker'),
    }),
  });
}

const WorkLine = z.object({
  text: z.string().describe(`One line of the student work, as written. ${STEP_TEXT_RULE}`),
  status: z.enum(['CORRECT', 'INCORRECT', 'NEUTRAL']).describe('Teacher view only: whether this line is right. NEUTRAL for a line that just restates the problem.'),
});

// No upper limit on an example's lines. A cap left no room for an error at the end of
// a long solve: examples ended with no error (v53, v57, v61) or crammed several steps
// into one line (v59). The template docs set no limit, and the output cap stops a runaway.
const ONLY_THE_MOVES_THAT_MATTER = 'Only the moves that matter: do not spend a line restating the problem.';

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

/**
 * A template's steps are fixed by Design (issues #2826, #2832): the count, order,
 * titles and groupings come from the library, and the model writes only each
 * required step's body and minutes. `title` is generated so the model anchors each
 * body to its step; withFixedRunSteps then overwrites it by position.
 *
 * An optional step ("Repeat steps 1-3 … as time allows") is not generated at all:
 * its text is the library's and it carries no minutes, so it stays out of the
 * activity's class time.
 */
const requiredRunSteps = (runSteps) => runSteps.filter((s) => !s.optional);

function fixedRunStep(runSteps) {
  return z.object({
    title: z.enum(requiredRunSteps(runSteps).map((s) => s.title)).describe('This step\'s title, exactly as listed, in the listed order'),
    body: runStepFields.body,
    minutes: runStepFor('generate').shape.minutes,
  });
}

/** The generated steps as stored: fixed title and groupings, generated body and minutes. */
export function withFixedRunSteps(generatedSteps, runSteps) {
  let next = 0;
  return runSteps.map(({ title, groupings, guidance, optional }) => {
    if (optional) return { title, body: guidance, groupings };
    const { body, minutes } = generatedSteps[next];
    next += 1;
    return { title, body, groupings, minutes };
  });
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
// around the math (a bound, not a describe). No whitespace around it and a length
// limit, because strict mode lets the model write whatever the pattern allows: with
// `\s*` here, a second item with no math left to put in it (the whole system already
// written as one \begin{cases}) became an endless run of whitespace, and the call
// ran until the Lambda died. The longest of 271 saved expressions is 54 characters.
const ONE_EXPRESSION = /^\$[^$]{1,200}\$$/;
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
    expressions: z.array(Expression).min(2).max(3).describe('Every equation or inequality of the system, one per item, e.g. ["$y + x > 2$", "$y \\leq 3x - 2$"]. All of them: the work and the answers may only use what is listed here. Never the whole system in one item (no \\begin{cases}), and never a note or words (no \\text{}) as an item.'),
  }),
]);

// Student-facing instruction and math, generated apart (see above).
const generatedProblem = () => ({
  math: MathStatement.describe('The problem\'s math, with no words. SYSTEM for a system (list every equation or inequality in it), SINGLE otherwise. Never a point or answer choices to pick from.'),
  task: z.string().max(TASK_MAX).describe('The instruction alone: one short imperative or question about the problem, under 60 characters, with no trailing punctuation, e.g. "Graph the inequality", "Solve for $x$", "Find a solution of the system". Student-facing: never student work, a description of a response, a hint, or how to solve it, and never a second clause about the student work, how it is shown or comparing to it ("Then compare to…"): the activity shows the work itself. Never a multiple-choice stem ("Which graph…", "Which of the following…"): the student sees no answer choices, so restate the question as an open problem that needs no given value, e.g. "Find a solution of the system" or "Graph the system".'),
});

function problemFields(mode) {
  if (mode === 'stored') {
    return {
      prompt: z.string().describe('The full problem: the task and its math'),
      problem: z.string().describe('The math alone, shown on the example tile'),
    };
  }
  return generatedProblem();
}

function spotTheSlip({ examplesMin, examplesMax }, mode) {
  return z.object({
    type: z.literal('INCORRECT_WORKED_EXAMPLES'),
    examples: z.array(z.object({
      ...problemFields(mode),
      slip: z.string().describe('Teacher view only: the slip in 3-6 words, e.g. "Flipped inequality when testing"'),
      steps: z.array(exampleStepFor(mode)).min(3).describe(`The full worked solution. Annotate correct steps before the slip CORRECT, the FIRST invalid step ERROR, and the later steps (consequences of the slip) NONE. ${ONLY_THE_MOVES_THAT_MATTER}`),
      finalOutcome: z.string().describe('Teacher view only: what the incorrect reasoning arrives at, one sentence'),
    })).min(examplesMin).max(examplesMax).describe('Each example is a DIFFERENT problem (different numbers or a different expression) showing the same need, so the teacher can choose among them — never the same problem repeated.'),
  });
}

function favoriteNo({ examplesMin, examplesMax }, mode) {
  return z.object({
    type: z.literal('FAVORITE_NO'),
    examples: z.array(z.object({
      ...problemFields(mode),
      work: z.array(WorkLine).min(2).describe(`The response, line by line. The error must sit inside partly sound reasoning: keep the sound lines marked CORRECT. ${ONLY_THE_MOVES_THAT_MATTER}`),
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
      workSummary: z.array(WorkLine).min(2).describe(`The response in brief, in short lines as ONE student wrote them. This is the evidence students investigate. ${ONLY_THE_MOVES_THAT_MATTER}`),
      stages: z.array(z.object({
        kind: z.enum(['INVESTIGATE', 'SOLVE', 'GENERALIZE']),
        ask: z.string().describe('Student-facing question for this stage'),
        answer: z.string().describe('Teacher view only: what the stage should land on. INVESTIGATE: the underlying issue and the evidence for it. SOLVE: the revised step and a check that it works. GENERALIZE: the rule to post.'),
      })).length(3).describe('Exactly three, in order: INVESTIGATE, SOLVE, GENERALIZE.'),
    })).min(examplesMin).max(examplesMax).describe('Each example is a DIFFERENT problem (different numbers or a different expression) showing the same need, so the teacher can choose among them — never the same problem repeated.'),
  });
}

const Tone = z.enum(['ERROR', 'SUCCESS', 'NEUTRAL']);

// The one problem is generated as task + math like the examples' problems, so
// instruction and math can't run together (v37 stored "Which graph represents
// the inequality…"); toStoredFacilitate joins them into the stored `problem`.
const compareTheThinking = (_bounds, mode) => z.object({
  type: z.literal('COMPARE_THE_THINKING'),
  ...(mode === 'stored'
    ? { problem: z.string().describe('The one problem both strategies attempt: its instruction and its math') }
    : generatedProblem()),
  comparison: z.enum(['CORRECT_VS_INCORRECT', 'BOTH_CORRECT']),
  strategies: z.array(z.object({
    label: z.string().describe('"A" for the first strategy, "B" for the second. One letter.'),
    verdict: z.enum(['CORRECT', 'INCORRECT', 'STRONGER']).nullable().describe('Teacher view only. STRONGER marks the more sophisticated of two correct approaches; null when the other is marked STRONGER.'),
    steps: z.array(z.object({
      step: z.number().int(),
      text: z.string().describe(`One step of this approach. ${STEP_TEXT_RULE}`),
      highlight: z.enum(['ERROR', 'SUCCESS']).nullable().describe('Teacher view only: ERROR on the first invalid step; SUCCESS on the step that makes a correct approach work, never on a step of an INCORRECT approach; null otherwise'),
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
  studentSteps: z.array(z.string()).min(1).max(3).describe(`What students do while building a case, e.g. "Write down why you think so." ${STUDENT_TEXT_RULE}`),
  examples: z.array(z.object({
    prompt: z.string().describe(`Names a case to bring in, e.g. "Slope 2 vs slope −5". ${STUDENT_TEXT_RULE}`),
    answer: z.string().describe('Teacher view only, required and never empty: the worked result and what the case shows'),
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

function storedProblem({ task, math }, onFallback) {
  const expressions = expressionsOf(math);
  const joined = expressions.join(', ');
  const missingPoint = NAMES_A_POINT.test(task ?? '') && !expressions.some((e) => IS_A_POINT.test(e));
  if (missingPoint) onFallback({ task, math: joined });
  const instruction = (missingPoint ? ANSWERABLE_FALLBACK : String(task ?? '')).trim().replace(/[.:?]\s*$/, '');
  // An instruction that already states every expression ("Graph the inequality
  // $-6x+3y>12$ and justify…", v43) is the whole problem: appending the math again
  // would show it twice.
  const bare = (t) => t.replace(/[\s$]/g, '');
  const statesAll = expressions.length > 0 && expressions.every((e) => bare(instruction).includes(bare(e)));
  if (statesAll) return { problem: joined, prompt: instruction };
  return { problem: joined, prompt: instruction ? `${instruction}: ${joined}` : joined };
}

/** The problems a generated artifact states as task + math. */
const generatedProblemsOf = (facilitate) => {
  if (EXAMPLE_TYPES.includes(facilitate?.type)) return facilitate.examples ?? [];
  if (facilitate?.type === 'COMPARE_THE_THINKING' && facilitate.math) return [facilitate];
  return [];
};

// A short token repeated ten or more times: v59 wrote " )" hundreds of times in student work.
const REPEATED_TOKEN = /\s+(\S{1,3})(?:\s+\1){9,}/g;

/** Drop blank lines from an example's work and cut runaway repetition (v59). `onCut` is told each time. */
export function tidyGeneratedWork(facilitate, onCut = () => {}) {
  if (!EXAMPLE_TYPES.includes(facilitate?.type)) return facilitate;
  const tidy = (lines) => lines.map((line) => {
    const text = line.text.replace(REPEATED_TOKEN, '').trim();
    if (text !== line.text.trim()) onCut({ before: line.text.length, after: text.length, text });
    return { ...line, text };
  }).filter((line) => line.text);
  facilitate.examples = facilitate.examples.map((example) => {
    const key = ['steps', 'work', 'workSummary'].find((k) => Array.isArray(example[k]));
    return key ? { ...example, [key]: tidy(example[key]) } : example;
  });
  return facilitate;
}

/** Number every step 1, 2, 3 in order: v57 stored Spot the Slip steps as -6 to -1. */
export function renumberSteps(facilitate) {
  const renumber = (steps) => (steps ?? []).map((step, i) => ({ ...step, step: i + 1 }));
  (facilitate?.examples ?? []).forEach((example) => { if (example.steps) example.steps = renumber(example.steps); });
  (facilitate?.strategies ?? []).forEach((strategy) => { if (strategy.steps) strategy.steps = renumber(strategy.steps); });
  return facilitate;
}

export function toStoredFacilitate(facilitate, onFallback = () => {}) {
  if (facilitate?.type === 'COMPARE_THE_THINKING' && facilitate.math) {
    const { task, math, ...rest } = facilitate;
    return { ...rest, problem: storedProblem({ task, math }, onFallback).prompt };
  }
  if (!EXAMPLE_TYPES.includes(facilitate?.type)) return facilitate;
  return {
    ...facilitate,
    examples: facilitate.examples.map(({ task, math, ...rest }) => ({
      ...storedProblem({ task, math }, onFallback),
      ...rest,
      // Steps are generated with NONE on an unremarked step; stored, it is null.
      ...(Array.isArray(rest.steps) && {
        steps: rest.steps.map((st) => (st?.annotation?.kind === 'NONE' || st?.annotation == null ? { ...st, annotation: null } : st)),
      }),
    })),
  };
}

/**
 * Shapes the math schema can't rule out, put right after generation:
 *   - a whole system written as one \begin{cases}/aligned/array expression is
 *     split into one expression per row, and every other item is discarded;
 *   - an item that is only a note in \text{…}, or blank, is dropped.
 * v37's My Favorite No did both: SYSTEM needs two items, so the system went in
 * one as \begin{cases} and "\text{(Student work projected separately)}" filled
 * the second. The kind follows the count that is left. `onFix` is told each time,
 * so the run can count how often this covered for the generator.
 */
const ENVIRONMENT = /^\$\s*\\begin\{(cases|aligned|array|gathered)\}(?:\{[^}]*\})?([\s\S]*?)\\end\{\1\}\s*\$$/;
const NOTE_ONLY = /^\$\s*\\text\{[^}]*\}\s*[.,;:]?\s*\$$/;

const BLANK = /^\$\s*\$$/;

const rowsOf = (environment) => environment[2].split(/\\{2,}(?:\[[^\]]*\])?/)
  .map((row) => row.replace(/&/g, ' ').replace(/\s+/g, ' ').trim())
  .filter(Boolean)
  .map((row) => `$${row}$`);

function normalizedMath(math) {
  const before = expressionsOf(math);
  // A whole-system environment is the system. SYSTEM needs two items, so whatever
  // else the model listed is filler written to satisfy that: a repeat, a note, or
  // an inequality that was never in the problem. Only the environment's rows count.
  const environment = before.map((e) => e.match(ENVIRONMENT)).find(Boolean);
  const after = environment
    ? rowsOf(environment)
    : before.filter((e) => !NOTE_ONLY.test(e) && !BLANK.test(e));
  if (!after.length || (after.length === before.length && after.every((e, i) => e === before[i]))) return null;
  return { kind: after.length >= 2 ? 'SYSTEM' : 'SINGLE', expressions: after };
}

/**
 * A correctness label written into text students see ("CORRECT: Rewrite…",
 * "ERROR: Substitute…", v43 Spot the Slip) gives the slip away. The label is
 * stripped from the text. On a Spot the Slip step whose annotation is NONE it
 * becomes the annotation; a work line keeps its own status. `onFix` is told once
 * per artifact with every line it changed, so the run counts how often this
 * covered for the generator.
 */
const LEADING_LABEL = /^\s*[([]?\s*(CORRECT|ERROR|INCORRECT|WRONG|RIGHT|NONE)\s*[)\]]?\s*[:.\-–—]\s*/i;
const STEP_KIND = { CORRECT: 'CORRECT', RIGHT: 'CORRECT', ERROR: 'ERROR', INCORRECT: 'ERROR', WRONG: 'ERROR' };

export function stripTextLabels(facilitate, onFix = () => {}) {
  const fixed = [];
  const strip = (owner, where) => {
    const m = typeof owner?.text === 'string' ? owner.text.match(LEADING_LABEL) : null;
    if (!m) return null;
    const rest = owner.text.slice(m[0].length);
    owner.text = rest.charAt(0).toUpperCase() + rest.slice(1);
    fixed.push({ where, label: m[1].toUpperCase() });
    return m[1].toUpperCase();
  };
  (facilitate?.examples ?? []).forEach((ex, i) => {
    (ex.steps ?? []).forEach((st, j) => {
      const label = strip(st, `examples[${i}].steps[${j}]`);
      if (label && STEP_KIND[label] && (st.annotation == null || st.annotation.kind === 'NONE')) {
        st.annotation = { kind: STEP_KIND[label], text: st.annotation?.text ?? null };
      }
    });
    (ex.work ?? []).forEach((line, j) => strip(line, `examples[${i}].work[${j}]`));
    (ex.workSummary ?? []).forEach((line, j) => strip(line, `examples[${i}].workSummary[${j}]`));
  });
  if (fixed.length) onFix({ lines: fixed });
  return facilitate;
}

export function normalizeGeneratedMath(facilitate, onFix = () => {}) {
  generatedProblemsOf(facilitate).forEach((p, i) => {
    const fixed = normalizedMath(p.math);
    if (!fixed) return;
    onFix({ problem: i + 1, before: expressionsOf(p.math), after: fixed.expressions });
    p.math = fixed;
  });
  return facilitate;
}

/**
 * Generated examples whose instruction names a system but whose math is not one
 * (declared SINGLE, or fewer than two expressions). The schema forces a SYSTEM to
 * list two or more; this catches the model declaring SINGLE under "Graph the
 * system". The handler regenerates the activity once when any are found.
 */
const NAMES_A_SYSTEM = /\bsystems?\b/i;

export function incompleteSystems(facilitate) {
  return generatedProblemsOf(facilitate).flatMap(({ task, math }, i) => (
    NAMES_A_SYSTEM.test(task ?? '') && (math?.kind !== 'SYSTEM' || expressionsOf(math).length < 2)
      ? [{ example: i + 1, task, math: expressionsOf(math).join(', ') }]
      : []
  ));
}

/**
 * Compare the Thinking steps marked SUCCESS inside an INCORRECT approach. A wrong
 * approach has no step that makes it work, so this mark means the model wrote the
 * student correcting the mistake (v45: "...so the line should be dashed instead"),
 * which leaves a "wrong" column that ends right and hands students the answer.
 */
export function selfCorrectingStrategies(facilitate) {
  if (facilitate?.type !== 'COMPARE_THE_THINKING') return [];
  return (facilitate.strategies ?? []).flatMap((strategy) => (
    strategy.verdict === 'INCORRECT'
      ? (strategy.steps ?? [])
        .filter((step) => step.highlight === 'SUCCESS')
        .map((step) => ({ strategy: strategy.label, step: step.step, text: step.text }))
      : []
  ));
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
  const required = b.runSteps?.length ? requiredRunSteps(b.runSteps).length : 0;
  const howToRun = mode === 'generate' && required
    ? z.array(fixedRunStep(b.runSteps)).min(required).max(required).describe('The template\'s required steps, every one, in the listed order')
    : z.array(runStepFor(mode)).min(b.howToRunMin).max(b.howToRunMax).describe('The run-of-show, following the template\'s classroom flow and grouping pattern');
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
    takeaway: z.string().describe('The one central mathematical idea students should leave with, in 1-2 sentences of mathematics and at most 300 characters: not a description of the activity, not a restatement of the need, and no list of edge cases or conditions (those go in a question\'s teacher answer)'),
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
  // The review can't rewrite a step's text, so a SUCCESS it adds to a wrong
  // approach can only mislabel the step.
  if (next.type === 'COMPARE_THE_THINKING') {
    next.strategies.forEach((strategy, i) => {
      if (strategy.verdict !== 'INCORRECT') return;
      strategy.steps.forEach((step, j) => {
        const id = `strategies[${i}].steps[${j}].highlight`;
        const fix = applied.find((a) => a.id === id);
        if (step.highlight !== 'SUCCESS' || !fix) return;
        step.highlight = facilitate.strategies[i].steps[j].highlight;
        rejected.push({ id, label: fix.to, reason: 'successOnWrongApproach' });
      });
    });
  }
  const reverted = new Set(rejected
    .filter((r) => ['wouldNotLeaveOneError', 'successOnWrongApproach'].includes(r.reason))
    .map((r) => r.id));
  return { facilitate: next, applied: applied.filter((a) => !reverted.has(a.id)), rejected };
}

// ── The final check ───────────────────────────────────────────────────────────

/** The problems an activity states, labelled as the rows are, for the math check to read. */
export function checkedProblems(facilitate) {
  if (facilitate?.problem) return [`The problem: ${facilitate.problem}`];
  if (facilitate?.claim) return [`The claim students argue, which may be false: ${facilitate.claim}`];
  return (facilitate?.examples ?? []).filter((example) => example.prompt).map((example, i) => `Example ${i + 1}: ${example.prompt}`);
}

/** Teacher text that explains the planned error, whose math is meant to be wrong. */
function describesPlannedError(facilitate, id) {
  if (/^examples\[\d+\]\.finalOutcome$/.test(id)) return true;
  const step = id.match(/^examples\[(\d+)\]\.steps\[(\d+)\]\.annotation\.text$/);
  if (step) return facilitate.examples[step[1]].steps[step[2]].annotation?.kind === 'ERROR';
  const note = id.match(/^strategies\[(\d+)\]\.notes\[\d+\]\.text$/);
  if (note) return facilitate.strategies[note[1]].verdict === 'INCORRECT';
  // A supporting argument can be one the mathematics refutes.
  const argument = id.match(/^arguments\[(\d+)\]\.text$/);
  if (argument) return facilitate.arguments[argument[1]].stance === 'SUPPORT';
  return false;
}

/** A row that repeats a Make Your Case claim that isn't simply true: it is meant to be argued. */
function quotesArguableClaim(facilitate, text) {
  if (!facilitate?.claim || facilitate.resolution?.verdict === 'TRUE') return false;
  const bare = (t) => String(t).replace(/[$\s]/g, '');
  return bare(text).includes(bare(facilitate.claim));
}

/**
 * Which part of the activity a row is, for the math check. Without it the rows of
 * different examples look alike, and v60's check held Example 2's correct "$y > -x + 2$"
 * to Example 1's algebra.
 */
export function rowLabel(id) {
  const path = id.replace(/^facilitate\./, '');
  const n = (m) => Number(m) + 1;
  const part = path.match(/^examples\[(\d+)\]\.(\w+)\[(\d+)\]/);
  if (part) {
    const names = { work: 'student work line', workSummary: 'student work line', steps: 'worked step', notice: 'teacher note', stages: 'stage' };
    return `Example ${n(part[1])}, ${names[part[2]] ?? part[2]} ${n(part[3])}`;
  }
  const example = path.match(/^examples\[(\d+)\]\.(\w+)/);
  if (example) return `Example ${n(example[1])}, ${example[2]}`;
  const strategy = path.match(/^strategies\[(\d+)\]\.(steps|notes)\[(\d+)\]/);
  if (strategy) return `Strategy ${String.fromCharCode(65 + Number(strategy[1]))}, ${strategy[2] === 'steps' ? 'step' : 'teacher note'} ${n(strategy[3])}`;
  const list = path.match(/^(\w+(?:\.\w+)?)\[(\d+)\]/);
  if (list) return `${list[1]} ${n(list[2])}`;
  return path;
}

/**
 * Every string the final check reads, with an id. `audience` says who sees it,
 * from what the app and handouts show students. `intended` marks a student line at
 * or after the planned error, which is meant to be wrong, so the math check skips it.
 */
export function checkableRows(content) {
  const rows = [];
  const student = (id, text, extra = {}) => rows.push({ id: `facilitate.${id}`, audience: 'student', text, intended: false, ...extra });
  const teacher = (id, text) => { if (typeof text === 'string') rows.push({ id, audience: 'teacher', text, intended: quotesArguableClaim(content.facilitate, text) }); };
  const f = content.facilitate ?? {};

  const workLines = (lines, owner, isError, statusOf) => {
    let seenError = false;
    (lines ?? []).forEach((line, j) => {
      seenError = seenError || isError(line);
      student(`${owner}[${j}].text`, line.text, { intended: seenError, status: statusOf(line) });
    });
  };
  (f.examples ?? []).forEach((ex, i) => {
    if (f.type === 'INCORRECT_WORKED_EXAMPLES') {
      workLines(ex.steps, `examples[${i}].steps`, (s) => s.annotation?.kind === 'ERROR', (s) => s.annotation?.kind ?? 'NONE');
    }
    if (f.type === 'FAVORITE_NO') workLines(ex.work, `examples[${i}].work`, (l) => l.status === 'INCORRECT', (l) => l.status);
    if (f.type === 'MATH_DETECTIVE') {
      workLines(ex.workSummary, `examples[${i}].workSummary`, (l) => l.status === 'INCORRECT', (l) => l.status);
      (ex.stages ?? []).forEach((stage, j) => student(`examples[${i}].stages[${j}].ask`, stage.ask));
    }
    if (f.type === 'MAKE_YOUR_CASE') student(`examples[${i}].prompt`, ex.prompt);
  });
  (f.strategies ?? []).forEach((strategy, i) => {
    const hasError = (strategy.steps ?? []).some((s) => s.highlight === 'ERROR');
    workLines(
      strategy.steps,
      `strategies[${i}].steps`,
      (s) => strategy.verdict === 'INCORRECT' && (!hasError || s.highlight === 'ERROR'),
      () => strategy.verdict ?? 'NONE',
    );
  });
  (f.studentSteps ?? []).forEach((text, i) => student(`studentSteps[${i}]`, text));

  teacherLabels(f).filter((l) => !l.allowed).forEach((l) => {
    rows.push({ id: `facilitate.${l.id}`, audience: 'teacher', text: l.current, intended: describesPlannedError(f, l.id) || quotesArguableClaim(f, l.current) });
  });
  (content.beforeClass?.steps ?? []).forEach((text, i) => teacher(`beforeClass.steps[${i}]`, text));
  // A step with no minutes is the optional repeat step, whose text is fixed.
  (content.howToRun ?? []).forEach((step, i) => { if (step.minutes != null) teacher(`howToRun[${i}].body`, step.body); });
  const d = content.discussion;
  if (d) {
    teacher('discussion.takeaway', d.takeaway);
    (d.questions ?? []).forEach((q, i) => {
      teacher(`discussion.questions[${i}].question`, q.question);
      teacher(`discussion.questions[${i}].answer`, q.answer);
    });
    (d.watchFors ?? []).forEach((w, i) => {
      teacher(`discussion.watchFors[${i}].watchFor`, w.watchFor);
      teacher(`discussion.watchFors[${i}].tryAsking`, w.tryAsking);
      teacher(`discussion.watchFors[${i}].howToRespond`, w.howToRespond);
    });
  }
  return rows;
}

// Parentheticals outside the math, as [start, end] spans. A coordinate inside $...$ is left out.
function parentheticals(text) {
  const spans = [];
  let inMath = false;
  let depth = 0;
  let start = -1;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '$') inMath = !inMath;
    else if (ch === '(' && (depth > 0 || !inMath)) {
      if (depth === 0) start = i;
      depth += 1;
    } else if (ch === ')' && depth > 0) {
      depth -= 1;
      if (depth === 0) spans.push([start, i + 1]);
    }
  }
  return spans;
}

const RELATION = /(?:>=|<=|>|<|=|\\geq|\\leq|\\ge|\\le|\\neq|≥|≤|≠)/;
const hasNoLetters = (side) => !/[a-zA-Z]/.test(side.replace(/\\[a-zA-Z]+/g, ''));
const isNumberComparison = (expr) => {
  const sides = expr.split(RELATION);
  return sides.length > 1 && sides.every((side) => /\d/.test(side) && hasNoLetters(side));
};

/** A comparison of plain numbers, such as "$0 > -2$": a result, not an instruction. */
const statesResult = (text) => (String(text).match(/\$[^$]+\$/g) ?? []).some((m) => isNumberComparison(m.slice(1, -1)))
  || isNumberComparison(String(text).match(/-?\d+(?:\.\d+)?\s*(?:>=|<=|>|<|=|≥|≤)\s*-?\d+(?:\.\d+)?/)?.[0] ?? '');

const hasWords = (text) => /[A-Za-z]{3,}/.test(text.replace(/\$[^$]*\$/g, ''));

function removeParentheticals(text, shouldRemove) {
  const kept = parentheticals(text).filter(([a, b]) => shouldRemove(text.slice(a, b)));
  const out = kept.reduceRight((s, [a, b]) => s.slice(0, a).trimEnd() + s.slice(b), text).replace(/\s+([.,;:?!])/g, '$1').trim();
  return out || text;
}

/**
 * What students see in Make Your Case can't carry an answer: v58 put a worked result in a
 * step's "(for example: ...)" and labelled a case "(boundary point)". A step keeps its other
 * parentheticals, such as "(Yes / No / Undecided)". A result left outside parentheses can't
 * be cut without breaking the sentence, so `onLeft` reports it.
 */
export function cleanCaseStudentText(facilitate, onFix = () => {}, onLeft = () => {}) {
  if (facilitate?.type !== 'MAKE_YOUR_CASE') return facilitate;
  const clean = (text, where, shouldRemove) => {
    const out = removeParentheticals(text, shouldRemove);
    if (out !== text) onFix({ where, before: text, after: out });
    if (statesResult(out)) onLeft({ where, text: out });
    return out;
  };
  facilitate.studentSteps = (facilitate.studentSteps ?? []).map((text, i) => clean(text, `studentSteps[${i}]`, statesResult));
  (facilitate.examples ?? []).forEach((example, i) => {
    example.prompt = clean(example.prompt, `examples[${i}].prompt`, hasWords);
  });
  return facilitate;
}
