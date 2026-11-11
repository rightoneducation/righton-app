/**
 * microcoachv2NextStepOption — one Wave 2 activity for one selected template.
 *
 * The template is chosen upstream (microcoachv2LLMSelectTemplate); this Lambda
 * fills it, producing the content the app renders: src/lib/ActivityContentModels.ts,
 * `schemaVersion: 2`, mirrored in util/activityContent.mjs. Three model calls:
 *
 *   1. The activity: why this activity, durations, before class, how to run it
 *      (with groupings) and the template's own artifact (`facilitate`), from the
 *      template's infill, the doc's design guidance, the instructional need, the
 *      selection rationale and the multiple-choice evidence. The existing math
 *      reviewers then check the artifact (worked examples, problem statements).
 *   2. The closing discussion, written from the instructional need and the
 *      finished artifact in the doc's order: takeaway first, then 3 discussion
 *      questions and 1-3 Watch for sets anchored to it.
 *   3. A reasoning-model review against the doc's Mathematical Accuracy and
 *      Coherence Check. Its corrected discussion replaces the draft only when it
 *      reports issues and its output parses; otherwise the draft stands. The same
 *      pass checks the artifact's teacher-view labels and notes (✓/✗, verdicts,
 *      direction words) and returns targeted fixes, applied by id
 *      (applyLabelFixes); it cannot reach student-facing text or the math.
 *
 * The doc's general guidance lives in util/activityLibrary.json `designGuidance`
 * and is rendered per prompt by formatDesignGuidance, so it is tuned in one place.
 *
 * Input (`event.arguments.input` from AppSync, or `event.input` from a direct
 * invoke), JSON strings unless noted:
 *   misconception        { title, description, ccssStandard, learningScienceConnection?,
 *                          wrongAnswers: [{ questionNumber, letter, explanation? }],
 *                          instructionalNeed?: { text, evidenceUsed }, evidence? }
 *   selectedTemplate     one pick from LLMSelectTemplate: { templateId,
 *                          instructionalApproach, studentsDo?, rationale } (required)
 *   siblingProblems      optional, JSON array of the student-facing problems the
 *                          other activity for this need already uses (it ran first)
 *   siblingPick          optional, the other pick for the same need (same shape):
 *                          the activity is told what students do there, to differ
 *   learningScienceData  { standards: KgQueryType[] }
 *   evidence             optional { questions: [{ questionNumber, questionText,
 *                          correctAnswer, answerChoices: [{ letter, content,
 *                          isCorrect, studentCount }] }] } — the linked questions
 *   classroomContext     optional { subject, cohortSize }
 *   stopAfter            optional 'activity' — return after call 1 and its
 *                          checks, with `content.discussion` null (replay harness)
 *   contextData          optional reference lessons (ContextData NEXT_STEP_LESSON)
 *   trace                boolean — echo `_trace`
 *
 * Output (a JSON string): { templateId, activityType, targets, instructionalMove,
 * strategyTag, durationMinutes, aiReasoning, content: IActivityContent }.
 * Throws when the template is unknown or has no content type (RightOn!).
 */
import { createHash } from 'node:crypto';
import { loadSecret } from './util/loadsecrets.mjs';
import { templateById, formatForInfill, formatDesignGuidance } from './util/activityLibrary.mjs';
import { matchStandard } from './util/ccssCode.mjs';
import {
  CONTENT_VERSION,
  EXAMPLE_TYPES,
  activityPlanSchemaFor,
  discussionDraftSchema,
  plannedClassMinutes,
  toStoredDurations,
  toStoredDiscussion,
  toStoredFacilitate,
  incompleteSystems,
  selfCorrectingStrategies,
  normalizeGeneratedMath,
  stripTextLabels,
  withFixedRunSteps,
  teacherLabels,
  applyLabelFixes,
  checkableRows,
  checkedProblems,
  rowLabel,
  tidyGeneratedWork,
  renumberSteps,
  cleanCaseStudentText,
  STUDENT_TEXT_RULE,
} from './util/activityContent.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from './util/config.json' assert { type: 'json' };

const nso = config?.nextStepOption ?? {};
const vco = nso.validator ?? {};
const cdo = nso.closingDiscussion ?? {};
const ws  = config?.writingStyle ?? {};
const MODEL                          = nso.model ?? 'gpt-4o';
const VALIDATOR_MODEL                = vco.model ?? 'gpt-5-mini';
const VALIDATOR_SYSTEM_PROMPT        = vco.systemPrompt ?? 'You are a math accuracy reviewer. Output only valid JSON.';
const DISCUSSION_MODEL        = cdo.model ?? MODEL;
const REVIEW_MODEL            = cdo.reviewModel ?? VALIDATOR_MODEL;
// Asked for at the target; a takeaway over the maximum is rewritten once. Not a
// schema cap: a hard cap on a string truncates it mid-clause (v37's "Then compare to the:").
const TAKEAWAY_TARGET_CHARS   = 300;
const TAKEAWAY_MAX_CHARS      = cdo.takeawayMaxChars ?? 350;
const MAX_DURATION            = nso.maxDurationMinutes ?? 15;
const MAX_COMPLETION_TOKENS   = nso.maxCompletionTokens ?? 20_000;
const FINAL_CHECK_LATEST_START_MS = 420_000;
const DEFAULT_DURATION        = nso.targetDurationMinutes ?? 12;
const STRATEGY_TAGS           = nso.strategyTags ?? [];
// How many LVN strategies per factor get a full description in the prompt.
// Defaults to all of them: a field that is not in the prompt cannot be ablated,
// so nothing is filtered before there is evidence to filter on.
const MAX_LVN_STRATEGY_DETAIL = nso.maxLvnStrategyDetail ?? Infinity;
const INCORRECT_EXAMPLE_RULES = nso.incorrectWorkedExampleRules ?? [];
const INCORRECT_EXAMPLE_FEW_SHOT = nso.incorrectWorkedExampleFewShot ?? [];
const DESIGN_PRINCIPLES       = nso.designPrinciples ?? [];
const CLASSROOM_FEASIBILITY   = nso.classroomFeasibility ?? [];
// Realistic-pacing guidance for the per-step minute estimates (config, so it reads
// as part of the prompt's design rather than code).
const PACING_GUIDANCE         = nso.pacingGuidance ?? [];

// Cardinality, as schema bounds: the one form of guidance the model reliably honours.
const BOUNDS = {
  examplesMin: nso.examples?.min ?? 1,
  examplesMax: nso.examples?.max ?? 3,
  beforeClassMin: nso.setupSteps?.min ?? 2,
  beforeClassMax: nso.setupSteps?.max ?? 3,
  howToRunMin: nso.activitySteps?.min ?? 4,
  howToRunMax: nso.activitySteps?.max ?? 6,
  questionCount: cdo.questionCount ?? 3,
  discussionMinutesMin: cdo.minutes?.min ?? 2,
  discussionMinutesMax: cdo.minutes?.max ?? 5,
  watchForMin: cdo.watchFors?.min ?? 1,
  watchForMax: cdo.watchFors?.max ?? 3,
};

// ── Schemas ───────────────────────────────────────────────────────────────────

const strategyTagSchema = STRATEGY_TAGS.length >= 2
  ? z.enum(STRATEGY_TAGS.map((t) => t.name))
  : z.string();

/** The row-level fields stored beside the content on MicroCoachActivity. */
const RowFields = z.object({
  targets: z.string().describe('The specific skill this activity builds, in plain words with no math, symbols or LaTeX (e.g. "Applying integer sign rules in algebraic expressions"). Not ontology IDs.'),
  instructionalMove: z.string().describe('What the teacher concretely does, beginning with a verb, 2-4 sentences, naming the error pattern this activity addresses.'),
  strategyTag: strategyTagSchema.describe(`Exactly one of: ${STRATEGY_TAGS.map((t) => t.name).join(', ')}`),
  aiReasoning: z.string().describe('Internal: why this design enacts the template for this need. Not shown to teachers.'),
});

// Built per activity: each question's minutes are bounded by the discussion time
// that activity reserved.
const discussionSchemasFor = (minutesMax) => {
  const DiscussionDraft = discussionDraftSchema(BOUNDS, minutesMax);
  const DiscussionReview = z.object({
    issues: z.array(z.object({
      component: z.string().describe('Which part: "takeaway", "question 2", "watch for 1", …'),
      problem: z.string().describe('What fails the check, and why'),
    })).describe('Empty when every check passes'),
    corrected: DiscussionDraft.describe('The discussion with every issue fixed; unchanged when there are none'),
    // The artifact's teacher-view labels and notes are checked in the same pass:
    // the reviewer already reads the artifact to check the discussion against it.
    artifactFixes: z.array(z.object({
      id: z.string().describe('The id of a listed label or teacher note, exactly as listed'),
      label: z.string().nullable().describe('For a label: the corrected value, one of its allowed values. null for a note.'),
      text: z.string().nullable().describe('For a teacher note: the corrected note. null for a label.'),
      problem: z.string().describe('What was wrong, and why'),
    })).describe('One per artifact label or teacher note that is mathematically wrong. Empty when all are right.'),
  });
  return { DiscussionDraft, DiscussionReview };
};

/**
 * Strip control characters from every string in the generated activity.
 *
 * The model reaches for them as invisible separators when a field asks for an
 * "inline sequence". Nothing renders them, so the page looks right while the bytes
 * travel on into the PDF and the database. Tabs and newlines are kept.
 */
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F​-‍﻿]/g;

/**
 * Put back LaTeX commands that JSON parsing turned into control characters.
 *
 * When the model writes a command with a single backslash inside its JSON
 * ("\rightarrow", "\frac", "\times", "\beta", "\neq"), the backslash and the
 * first letter form a valid JSON escape, so parsing yields a carriage return,
 * form feed, tab, backspace or newline followed by the rest of the command
 * ("ightarrow", "rac"). Run 10-09 v29 stored "12ightarrow 3y" this way. A carriage
 * return, tab, form feed or backspace directly before a letter is never intended
 * in this content, so it is restored wherever it appears. A newline before a
 * letter is ordinary prose outside math, so it is restored only inside $…$.
 * Must run before CONTROL_CHARS, which would otherwise delete the form feed and
 * backspace and leave "rac" and "egin" with nothing to show what they were.
 */
const LOST_ESCAPE_LETTER = { '\r': 'r', '\t': 't', '\f': 'f', '\b': 'b' };

// A relation symbol the model wrote as a literal "\u2265" escape or as the Unicode
// character itself, where the command was asked for. v37 stored "$\u2265$" this way
// (and lost the "$\leq$" beside it). Both become the command.
const RELATION_COMMAND = { '2264': '\\leq', '2265': '\\geq', '2260': '\\neq', '≤': '\\leq', '≥': '\\geq', '≠': '\\neq' };

function restoreLostEscapes(text) {
  return text
    .replace(/\\text(greater|less)(?![a-zA-Z])/g, (_, word) => (word === 'greater' ? '>' : '<'))
    .replace(/\\u(226[045])(?![0-9a-fA-F])/g, (_, code) => `${RELATION_COMMAND[code]} `)
    .replace(/\$[^$]*\$/g, (span) => span.replace(/[≤≥≠]/g, (c) => `${RELATION_COMMAND[c]} `))
    .replace(/(\\(?:leq|geq|neq)) +(?=[$}\s,.;:)]|$)/g, '$1')
    .replace(/[\r\t\f\b](?=[a-zA-Z])/g, (c) => `\\${LOST_ESCAPE_LETTER[c]}`)
    .replace(/\$\$[^$]*\$\$|\$[^$]*\$/g, (span) => span.replace(/\n(?=[a-zA-Z])/g, '\\n'));
}

function sanitizeStrings(value) {
  if (typeof value === 'string') {
    // Two or more backslashes before a letter or a space are an over-escaped command,
    // which LaTeX reads as a line break rather than the command meant. Strings
    // with a begin-environment (cases, aligned) keep theirs: there it is the row break.
    // Any other "\u2192" the model wrote as literal text shows as those characters, so make it the character.
    const cleaned = restoreLostEscapes(value).replace(CONTROL_CHARS, '')
      .replace(/\\+u([0-9a-fA-F]{4})(?![0-9a-fA-F])/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
    const unescaped = /\\begin\{/.test(cleaned) ? cleaned : cleaned.replace(/\\{2,}(?=[a-zA-Z ])/g, '\\');
    return unescaped.replace(/ {2,}/g, ' ').trim();
  }
  if (Array.isArray(value)) return value.map(sanitizeStrings);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, sanitizeStrings(v)]));
  }
  return value;
}

/**
 * A model call that failed because the model itself can't be used (retired,
 * renamed, or not available to this key), as opposed to a bad answer or a timeout.
 * v43: OpenAI retired o3-mini and the worked-example check quietly fell back on
 * every call. The fallback still keeps the teacher's activity whole, but a
 * configuration fault must be loud for us: it is logged as an error naming the
 * model and the config key, and recorded on the sub-call so the run surfaces it.
 */
function modelUnavailable(err) {
  const status = err?.status ?? err?.response?.status;
  const code = err?.code ?? err?.error?.code;
  const message = String(err?.message ?? '');
  return status === 404
    || code === 'model_not_found'
    || /model[^.]*(deprecated|does not exist|not found|decommission)/i.test(message);
}

function reportModelUnavailable(label, model, configKey, err) {
  console.error(`[microcoachv2NextStepOption] MODEL UNAVAILABLE: "${model}" (${configKey}) failed for ${label}: ${err?.message ?? err}. The step was skipped and its input kept; change ${configKey} in util/config.json.`);
}

const parseMaybe = (raw, fallback) => {
  if (raw == null) return fallback;
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
};

// ── Prompt pieces ─────────────────────────────────────────────────────────────

const MATH_FORMATTING = `## Math formatting
Use LaTeX for every mathematical expression: $...$ inline, $$...$$ for a standalone equation. Never use Unicode math symbols (≤ ≥ ≠ × ÷ √ π ½ ²) anywhere, inside the delimiters included, never a \\u escape such as \\u2265, and never caret/underscore notation outside the delimiters. Fractions are $\\frac{a}{b}$, inequalities $\\leq$ / $\\geq$ / $\\neq$, multiplication $\\times$. Every $...$ holds the math it stands for: never leave one empty, e.g. "$>$ versus $\\geq$", not "$>$ versus $$". Write each command with ONE backslash: never \\\\ (a line break) or \\  (a forced space), and never a placeholder symbol such as \\square or \\Box — write the real symbol or words instead. Never \\textgreater or \\textless: write $>$ and $<$. Keep a whole expression inside one pair of delimiters, never split around punctuation: $(x, y)$, not $($x$, $y$)$. Plain prose stays plain English — only the math goes inside delimiters. When words name a side of one line, say above or below (for a non-vertical line), or name the inequality or a test point. Never use right, left or diagonal words such as upper-left for the side of one line.`;

function renderNeed(misconception) {
  const need = misconception.instructionalNeed;
  if (!need?.text) return '';
  return `## The instructional need
${need.text}
${need.evidenceUsed?.length ? `Evidence it rests on:\n${need.evidenceUsed.map((e) => `  - ${e}`).join('\n')}` : ''}`.trim();
}

function renderMisconception(misconception) {
  const answers = (misconception.wrongAnswers ?? []).map((w) =>
    `  - Q${w.questionNumber}, answer ${w.letter}${w.explanation ? ` — one possible reasoning pathway: ${w.explanation}` : ''}`);
  return `## The misconception
**Title**: ${misconception.title}
**What the error is**: ${misconception.description}
${misconception.learningScienceConnection ? `**Learning science connection**: ${misconception.learningScienceConnection}` : ''}
**CCSS**: ${misconception.ccssStandard ?? 'unknown'}
${misconception.evidenceBasis === 'inferred'
    ? '**Evidence basis**: inferred — this is the most plausible reading of the answers chosen, and other explanations fit the same answers. Treat it as an interpretation to test with students, not a known fact about their thinking.'
    : misconception.evidenceBasis === 'grounded'
      ? '**Evidence basis**: grounded — the answer choices themselves support this reading. It is still an interpretation of what students chose: some may have got there another way.'
      : ''}
${answers.length ? `**Linked wrong answers** (observed choices; the reasoning given is an interpretation, not what every student who chose it thought):\n${answers.join('\n')}` : ''}`.trim();
}

function renderEvidence(evidence) {
  const questions = evidence?.questions ?? [];
  if (!questions.length) return '';
  return `## The questions behind it (multiple-choice evidence)
${questions.map((q) => {
    const choices = (q.answerChoices ?? []).map((o) =>
      `    ${o.letter}${o.isCorrect ? ' (correct)' : ''}: ${o.content ?? '—'}${o.studentCount != null ? ` — chosen by ${o.studentCount}` : ''}`);
    return `- Q${q.questionNumber}: ${q.questionText ?? '(no question text)'}\n${choices.join('\n')}`;
  }).join('\n')}`;
}

const FACILITATE_INSTRUCTIONS = {
  INCORRECT_WORKED_EXAMPLES: () => `\`facilitate.examples\`: ${BOUNDS.examplesMin}-${BOUNDS.examplesMax} incorrect worked solutions, each a different instance of the error. Each has its \`task\` and \`math\`, a 3-6 word \`slip\` (teacher only), the full step-by-step work, and a one-sentence \`finalOutcome\` (teacher only). Annotate the steps before the slip CORRECT, the FIRST invalid step ERROR, and its consequences NONE. One step must show the slip: when the error is in the final answer, the last step records that answer. Step text is what students see: never write a correctness label ("CORRECT:", "ERROR:") into it.

Critical rules for the worked examples:
${INCORRECT_EXAMPLE_RULES.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}
${INCORRECT_EXAMPLE_FEW_SHOT.length ? `
Study the difference between a well-built and a badly built example:
${INCORRECT_EXAMPLE_FEW_SHOT.map((ex) => `Misconception: ${ex.misconception}
✓ ${ex.good.label}
  Problem: ${ex.good.problem}
  Incorrect work: ${ex.good.incorrectWork}
✗ ${ex.bad.label}
  Problem: ${ex.bad.problem}
  Incorrect work: ${ex.bad.incorrectWork}`).join('\n\n')}` : ''}`,
  FAVORITE_NO: () => `\`facilitate.examples\`: ${BOUNDS.examplesMin}-${BOUNDS.examplesMax} incorrect responses, each revealing a mathematical idea, intuition, strategy, or assumption worth preserving — not a procedural slip, arithmetic mistake, or random answer. \`work\` is the response line by line, with the sound lines marked CORRECT so the error sits inside partly sound reasoning. One line must show the error, marked INCORRECT: when the error is in the final answer, the last line records that answer. \`notice\` (teacher only) lists what the reasoning gets right (PRESERVE, first) and then what needs to change (REVISE). \`sourceNote\` (teacher only) says this is one plausible way a student might reason toward the answer, not any one student's work, and that a real anonymous response can replace it. \`task\` and \`math\` state only the problem students solve — never the response, a description of it, or what is wrong with it; the response belongs in \`work\`.`,
  MATH_DETECTIVE: () => `\`facilitate.issue\`: one short plain sentence naming the underlying mathematical issue the examples share. Students see it, so it names the issue and never the fix, a corrected value, or which line shows it. \`facilitate.examples\`: ${BOUNDS.examplesMin}-${BOUNDS.examplesMax} incorrect responses, each pointing to that deeper issue to investigate — not a single localized slip, and never a correct solution. \`workSummary\` is one student's attempt in short lines as they wrote them (the evidence). One line must show the error, marked INCORRECT: when the error is in the final answer, the last line records that answer. Set \`isEvidence\` true on the one or two lines that give the strongest evidence of the issue, and false on every other line. \`evidenceNotes\`: what those lines show about the issue and why the reasoning does not work. \`stages\`, in order: INVESTIGATE (ask what the response suggests about how the student is interpreting or using the idea, not where the error is; answer with what students should notice), SOLVE (ask students to point to evidence in the response, test whether it supports their explanation, and consider whether another explanation fits; answer with what the evidence shows, naming another plausible interpretation when there is one), REVISE_AND_CHECK (ask how the reasoning could be revised and how to test the revision on this problem and another example; answer with the revised reasoning and a worked check on both). Never ask students to rewrite a named step or write a rule. Student-facing \`ask\` text never gives the answer away. \`task\` and \`math\` state only the problem the student was solving, rewritten as an open problem when the original was multiple choice (the student's chosen answer belongs in \`workSummary\`) — never the student's work, a description of what the student did, or the error; those belong in \`workSummary\` and the teacher-only answers.`,
  COMPARE_THE_THINKING: () => `\`facilitate\`: one problem, as its \`task\` and \`math\`, and exactly two strategies, A and B, with equal visual weight. Use CORRECT_VS_INCORRECT when the opportunity is to examine the misconception through the contrast; BOTH_CORRECT when it is to compare valid strategies (efficiency, generalizability, representation, assumptions). Verdicts, step highlights and notes are teacher only: highlight ERROR on the first invalid step and SUCCESS on the step that makes a correct approach work. An INCORRECT approach stays wrong through its last step: its student never notices, tests for or corrects the mistake, and none of its steps is marked SUCCESS. Each strategy gets 1-2 notes on what it reveals about the thinking behind it. The comparison must have a clear mathematical purpose, not be a "which one is right?" exercise.`,
  MAKE_YOUR_CASE: () => `\`facilitate\`: a \`claim\` students can genuinely defend, challenge, or refine with evidence — not obviously true or false, and never a mathematically indefensible position. \`resolution\` (teacher only) is what the mathematics supports; use CONDITIONAL with the refined claim when it holds only under conditions. Students see only \`claim\`, \`studentSteps\` and each example's \`prompt\`; everything else is teacher only. \`studentSteps\` are 1-3 short instructions for building a case. \`examples\` are 2-4 cases to bring in: each \`prompt\` only names the case for students to work out, e.g. "Check $(1,3)$ in $y > 2x$", and each \`answer\` is required and never empty: the worked result and what it shows. \`arguments\` (teacher reference) hold at least one substantive SUPPORT and one substantive CHALLENGE — a counterexample, boundary condition, assumption, or limitation — never a deliberately weak one.`,
};

// ── Handler ───────────────────────────────────────────────────────────────────

// A placeholder symbol anywhere in the generated text. Looks at the JSON, so a
// backslash appears doubled; the lookahead leaves longer commands like \\squared alone.
const hasMathPlaceholder = (value) => /\\+(?:Box|square)(?![a-zA-Z])/.test(JSON.stringify(value));

// debugStream: which call this is in the container, and how long the container has lived.
const debugContainerStart = Date.now();
let debugInvocationCount = 0;
const sha = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16);

export const handler = async (event) => {
  debugInvocationCount += 1;
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const apiSecret = await loadSecret(apiSecretName);
  const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
  const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
  if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');

  const openai = new OpenAI({ apiKey });
  const input = event?.arguments?.input ?? event?.input ?? {};
  const wantTrace = input.trace === true;

  // Eval instrumentation. Additive and inert unless explicitly requested.
  const traceSubCalls = [];
  const recordSubCall = (label, model, completion, extra = {}) => {
    if (!wantTrace) return;
    traceSubCalls.push({ label, model, usage: completion?.usage ?? null, ...extra });
  };

  if (input.misconception == null)       throw new Error('misconception is required');
  if (input.learningScienceData == null) throw new Error('learningScienceData is required');
  if (input.selectedTemplate == null)    throw new Error('selectedTemplate is required');

  const misconception       = parseMaybe(input.misconception);
  const learningScienceData = parseMaybe(input.learningScienceData);
  const classroomContext    = parseMaybe(input.classroomContext, {});
  const contextDataItems    = parseMaybe(input.contextData, []);
  const selectedTemplate    = parseMaybe(input.selectedTemplate);
  const siblingPick         = input.siblingPick == null ? null : parseMaybe(input.siblingPick);
  const siblingProblems     = input.siblingProblems == null ? [] : parseMaybe(input.siblingProblems, []);
  const evidence            = parseMaybe(input.evidence, null);

  // The template fixes the content shape. RightOn! has no content type (it renders
  // as the game), and an unknown id is a caller bug; neither can be generated.
  const template    = templateById(selectedTemplate?.templateId);
  const contentType = template?.contentType ?? null;
  if (!template) throw new Error(`unknown templateId "${selectedTemplate?.templateId}"`);
  if (!contentType) throw new Error(`template "${template.id}" has no content type and cannot be generated`);
  const runSteps = template.infill.runSteps;
  const planSchema = activityPlanSchemaFor(contentType, { ...BOUNDS, runSteps });
  const ActivitySchema = RowFields.merge(planSchema);
  const hasExamples = EXAMPLE_TYPES.includes(contentType);

  // ── Call logging (CloudWatch) ──────────────────────────────────────────────
  // One line when each model call starts, one every 30 s while it is pending, and
  // one when it ends with its duration, token usage and finish reason. Two
  // Math Detective activities ran into the Lambda timeout with nothing logged
  // after the first second, so a stalled call could not be told from a slow
  // one, or which of the calls it was. A call still pending at the timeout is
  // the last "waiting" line; finish_reason "length" on an ended call means it
  // wrote until its output cap.
  const startedAt = Date.now();
  const logTag = `[microcoachNextStepOption] ${template.id} · ${String(misconception.title ?? '').slice(0, 40)}`;
  const secs = (ms) => `${Math.round(ms / 1000)}s`;
  // Diagnostic for the calls that never return (input.debugStream === true only;
  // normal runs and uploads do not stream). A non-streaming call shows nothing until
  // it finishes, so a stalled request, a runaway answer and a lost response all look
  // alike. Retries are off so one cannot hide inside the client. During reasoning a
  // healthy call can send nothing, so "no content yet" alone is not a stall.
  // These logs hold the generated text, so debugStream is for fixture tests only.
  const debugLog = (label, what) => console.log(`${logTag} · ${label} ${what}`);
  // CloudWatch caps an event at 256 KB, so long text goes out in numbered parts.
  const debugDump = (label, name, text) => {
    const PART = 100_000;
    const parts = Math.max(1, Math.ceil(text.length / PART));
    for (let i = 0; i < parts; i += 1) {
      debugLog(label, `${name} part ${i + 1}/${parts} (${text.length} chars) ${JSON.stringify(text.slice(i * PART, (i + 1) * PART))}`);
    }
  };
  // What the text looks like right now: repeating characters, a loop over a field, or
  // one string that never closes.
  const contentStats = (content) => {
    const tail = content.slice(-500);
    const keys = [...content.matchAll(/"([A-Za-z_]+)"\s*:/g)];
    const counts = {};
    for (const k of keys) counts[k[1]] = (counts[k[1]] ?? 0) + 1;
    const top = Object.entries(counts).sort((x, y) => y[1] - x[1]).slice(0, 10).map(([k, n]) => `${k}:${n}`).join(' ');
    const lastKey = keys[keys.length - 1];
    const probe = content.slice(-60);
    return `tail whitespace ${tail.length ? Math.round((tail.match(/\s/g)?.length ?? 0) * 100 / tail.length) : 0}% · tail distinct chars ${new Set(tail).size} · last 60 chars seen ${probe ? content.split(probe).length - 1 : 0}x · last key ${lastKey?.[1] ?? 'none'} · chars since it ${lastKey ? content.length - lastKey.index : content.length} · keys ${keys.length} [${top}]`;
  };
  const socketState = (s) => `destroyed ${s.destroyed} · state ${s.readyState} · bytes read ${s.bytesRead} · bytes written ${s.bytesWritten} · remote ${s.remoteAddress ?? '?'} · timeout ${s.timeout ?? '?'}`;
  // When a call goes silent: is the socket alive, is data still arriving, and can
  // this same container still reach OpenAI? Only one call is in flight per Lambda
  // invocation, so the agent's in-use socket is this call's.
  const runStallProbe = async (label, progress) => {
    const { getDefaultAgent } = await import('openai/_shims/index.mjs');
    const sockets = Object.values(getDefaultAgent(openai.baseURL).sockets ?? {}).flat();
    debugLog(label, `stall probe · silent · sockets in use ${sockets.length} · ${sockets.map(socketState).join(' | ') || 'none'}`);
    [progress.socket] = sockets;
    const before = progress.socket?.bytesRead;
    await new Promise((resolve) => { setTimeout(resolve, 20_000); });
    debugLog(label, `stall probe · bytes read over the next 20 s: ${progress.socket ? progress.socket.bytesRead - before : 'no socket'} · chunks ${progress.chunks}`);
    const timed = async (name, run) => {
      const t = Date.now();
      try {
        debugLog(label, `stall probe · ${name} ok in ${await run().then(() => Date.now() - t)} ms`);
      } catch (err) {
        debugLog(label, `stall probe · ${name} failed after ${Date.now() - t} ms · ${err?.message ?? err}`);
      }
    };
    await timed('GET /v1/models', () => openai.models.list({ timeout: 20_000, maxRetries: 0 }));
    await timed('small chat, first chunk', async () => {
      const probe = await openai.chat.completions.create({
        model: progress.model, stream: true, max_completion_tokens: 200,
        messages: [{ role: 'user', content: 'Reply with the word ok.' }],
      }, { timeout: 45_000, maxRetries: 0 });
      for await (const chunk of probe) {
        if (chunk) break;
      }
    });
    debugLog(label, `stall probe · finished · still silent ${Date.now() - (progress.lastChunkAt ?? Date.now())} ms · chunks ${progress.chunks}`);
  };
  // One line per call for the three open questions: what kind of ending was it,
  // where did any whitespace run start, and did the model write a whole system in
  // one item? Read by the investigation script, from CloudWatch or the trace.
  const SYSTEM_RELATION = /\\+(?:leq?|geq?|neq?)|<=|>=|=|<|>/g;
  const WHITESPACE_RUN = /(?:\s|\\[nrt]){200,}/;
  const debugOutcome = (label, progress, finishReason, t0, how) => {
    const { content } = progress;
    const systems = [...content.matchAll(/"kind"\s*:\s*"SYSTEM"\s*,\s*"expressions"\s*:\s*\[/g)].map((m) => {
      const rest = content.slice(m.index + m[0].length, m.index + m[0].length + 2_000);
      const items = [...rest.split(']')[0].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]);
      const first = items[0] ?? '';
      return { first: first.slice(0, 80), second: (items[1] ?? '').trim().slice(0, 60), whole: /begin\{/.test(first) || (first.match(SYSTEM_RELATION)?.length ?? 0) >= 2 };
    });
    const run = WHITESPACE_RUN.exec(content);
    let whitespace = null;
    if (run) {
      const before = content.slice(0, run.index);
      const lastKey = [...before.matchAll(/"([A-Za-z_]+)"\s*:/g)].pop()?.[1] ?? null;
      const quotes = (before.replace(/\\./g, '').match(/"/g) ?? []).length;
      const length = content.slice(run.index).match(/^(?:\s|\\[nrt])*/)[0].length;
      whitespace = { at: run.index, length, lastKey, insideString: quotes % 2 === 1, afterWholeSystem: systems.some((x) => x.whole && before.includes(x.first.slice(0, 30))) };
    }
    const silentFor = progress.lastChunkAt ? Date.now() - progress.lastChunkAt : Date.now() - t0;
    const finished = finishReason === 'stop';
    let type = 'normal';
    if (finishReason === 'length') type = 'capped';
    else if (!finished && silentFor >= 60_000) type = 'stall';
    else if (!finished) type = 'runaway';
    else if ((whitespace?.length ?? 0) >= 2_000) type = 'whitespace-ended-itself';
    const outcome = {
      how, type, seconds: Math.round((Date.now() - t0) / 1000), finish: finishReason, chunks: progress.chunks,
      chars: content.length, silentSeconds: Math.round(silentFor / 1000), wholeSystems: systems.filter((x) => x.whole).length, systems, whitespace,
    };
    debugLog(label, `outcome ${JSON.stringify(outcome)}`);
    recordSubCall('debug-outcome', null, null, outcome);
  };
  const logStreamProgress = (label, progress, t0) => {
    const now = Date.now();
    const elapsed = now - t0;
    const content = progress.content;
    debugLog(label, `progress · ${Math.round((content.length - progress.beatChars) * 1000 / Math.max(1, now - progress.beatAt))} chars/s · largest chunk gap ${progress.maxGapMs} ms · empty chunks ${progress.emptyChunks} · other chunks ${progress.otherChunks} · ${contentStats(content)}`);
    debugLog(label, `tail ${JSON.stringify(content.slice(-500))}`);
    progress.beatChars = content.length;
    progress.beatAt = now;
    if (progress.socket) debugLog(label, `socket · ${socketState(progress.socket)}`);
    // Silence: 60 s after output started, or 150 s with no output at all (headers
    // have never taken more than 70 s). Once per call, and it never touches the call.
    const silentFor = progress.lastChunkAt ? now - progress.lastChunkAt : elapsed;
    if (!progress.probed && silentFor >= (progress.lastChunkAt ? 60_000 : 150_000)) {
      progress.probed = true;
      runStallProbe(label, progress).catch((err) => debugLog(label, `stall probe error · ${err?.message ?? err}`));
    }
    // Everything so far, each time it doubles past the longest normal response.
    if (content.length >= progress.nextDumpAt) {
      debugDump(label, 'content so far', content);
      progress.nextDumpAt = content.length * 2;
    }
    // The Lambda dies at its limit with no chance to log, so keep the last text first.
    if (Date.now() - startedAt >= 560_000 && !progress.finalDump) {
      progress.finalDump = true;
      debugDump(label, 'content near the Lambda limit', content);
      debugOutcome(label, progress, null, t0, 'near-lambda-limit');
    }
  };
  const streamedCompletion = async (label, params, t0, progress) => {
    const { response_format: format, messages } = params;
    progress.model = params.model;
    debugLog(label, `request · invocation ${debugInvocationCount} in this container · container age ${secs(Date.now() - debugContainerStart)} · node ${process.version} · memory limit ${process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE ?? '?'} MB · log stream ${process.env.AWS_LAMBDA_LOG_STREAM_NAME ?? '?'} · messages ${messages.length} · prompt sha256 ${sha(JSON.stringify(messages))} · schema sha256 ${sha(JSON.stringify(format ?? null))} · schema ${JSON.stringify(format ?? null).length} chars · params ${Object.keys(params).join(',')}`);
    const { data: stream, response } = await openai.chat.completions
      // Retries stay off in targeted tests so one can't hide; an eval run asks for the
      // client's usual 2 so streaming doesn't make it more fragile than a normal run.
      .create({ ...params, stream: true, stream_options: { include_usage: true } }, { maxRetries: input.debugStreamRetries ?? 0 })
      .withResponse();
    progress.headersAt = Date.now();
    progress.beatAt = progress.headersAt;
    const headers = {};
    response.headers.forEach((value, key) => { if (key !== 'set-cookie') headers[key] = value; });
    debugLog(label, `headers in ${secs(progress.headersAt - t0)} · status ${response.status} · request ${response.headers.get('x-request-id') ?? '?'} · ${JSON.stringify(headers)}`);
    let content = '';
    let finishReason = null;
    let usage = null;
    let lastRaw = null;
    for await (const chunk of stream) {
      const now = Date.now();
      if (progress.chunks === 0) debugLog(label, `first chunk in ${secs(now - t0)} · ${JSON.stringify(chunk)}`);
      if (progress.lastChunkAt) progress.maxGapMs = Math.max(progress.maxGapMs, now - progress.lastChunkAt);
      progress.chunks += 1;
      progress.lastChunkAt = now;
      lastRaw = chunk;
      const choice = chunk.choices?.[0];
      const piece = choice?.delta?.content;
      if (piece) {
        if (!content) debugLog(label, `first content in ${secs(now - t0)}`);
        content += piece;
        progress.contentChars = content.length;
        progress.content = content;
      } else if (piece === '' || !choice) {
        progress.emptyChunks += 1;
      }
      const { content: _content, role: _role, ...otherDelta } = choice?.delta ?? {};
      if (Object.values(otherDelta).some((v) => v != null)) {
        progress.otherChunks += 1;
        if (progress.otherChunks <= 5) debugLog(label, `chunk with other fields · ${JSON.stringify(chunk)}`);
      }
      if (choice?.finish_reason) {
        finishReason = choice.finish_reason;
        debugLog(label, `finish chunk at ${secs(now - t0)} · ${JSON.stringify(chunk)}`);
      }
      if (chunk.usage) {
        usage = chunk.usage;
        debugLog(label, `usage · ${JSON.stringify(chunk.usage)}`);
      }
    }
    debugLog(label, `stream closed after ${secs(Date.now() - t0)} · finish ${finishReason ?? 'none'} · chunks ${progress.chunks} · largest chunk gap ${progress.maxGapMs} ms · last raw chunk ${JSON.stringify(lastRaw)}`);
    debugLog(label, `final · ${contentStats(content)}`);
    let parse = 'valid JSON';
    try { JSON.parse(content); } catch (err) { parse = `invalid JSON: ${err.message}`; }
    debugLog(label, `final text is ${parse}`);
    // Every debug call's whole text, so a runaway can be compared with normal ones.
    debugDump(label, 'final content', content);
    debugOutcome(label, progress, finishReason, t0, 'closed');
    return { choices: [{ message: { content }, finish_reason: finishReason }], usage };
  };
  const timedCompletion = async (label, callParams) => {
    const params = { ...callParams, max_completion_tokens: MAX_COMPLETION_TOKENS };
    const t0 = Date.now();
    const debugStream = input.debugStream === true;
    const progress = {
      headersAt: null, chunks: 0, contentChars: 0, lastChunkAt: null, content: '', beatChars: 0, beatAt: t0,
      maxGapMs: 0, emptyChunks: 0, otherChunks: 0, nextDumpAt: 12_000, finalDump: false,
    };
    console.log(`${logTag} · ${label} start (${params.model}, prompt ${params.messages.reduce((n, m) => n + String(m.content ?? '').length, 0)} chars, at ${secs(t0 - startedAt)})`);
    const heartbeat = setInterval(() => {
      const stream = debugStream
        ? ` · headers ${progress.headersAt ? 'yes' : 'no'} · chunks ${progress.chunks} · content ${progress.contentChars} chars · last chunk ${progress.lastChunkAt ? `${secs(Date.now() - progress.lastChunkAt)} ago` : 'never'}`
        : '';
      console.log(`${logTag} · ${label} still waiting after ${secs(Date.now() - t0)} (at ${secs(Date.now() - startedAt)})${stream}`);
      if (debugStream) logStreamProgress(label, progress, t0);
    }, 30_000);
    try {
      const completion = debugStream
        ? await streamedCompletion(label, params, t0, progress)
        : await openai.chat.completions.create(params);
      const u = completion?.usage ?? {};
      console.log(`${logTag} · ${label} end in ${secs(Date.now() - t0)} · finish ${completion?.choices?.[0]?.finish_reason ?? '?'} · tokens in ${u.prompt_tokens ?? '?'} out ${u.completion_tokens ?? '?'} (reasoning ${u.completion_tokens_details?.reasoning_tokens ?? '?'}) · content ${String(completion?.choices?.[0]?.message?.content ?? '').length} chars`);
      return completion;
    } catch (err) {
      console.log(`${logTag} · ${label} failed after ${secs(Date.now() - t0)}: ${err?.message ?? err}`);
      throw err;
    } finally {
      clearInterval(heartbeat);
    }
  };

  // ── Extract relevant knowledge graph context ───────────────────────────────
  // Find the standard entry matching the misconception's CCSS standard
  const standards = learningScienceData?.standards ?? [];
  const normalize = (s) => s?.replace(/\s/g, '').toLowerCase() ?? '';
  // Questions spell the code one way and the graph another — A.REI.12 against
  // HSA-REI.D.12 — so an exact string match silently dropped EVERY graph section
  // from this prompt. matchStandard tries the literal string first, then the
  // spelling-independent key. Same helper the rubric and need stages use.
  const { standard: targetStandard, matchedBy: standardMatchedBy } =
    matchStandard(misconception.ccssStandard, standards);

  const prerequisiteStandards = targetStandard?.prerequisiteStandards ?? [];
  const futureStandards       = targetStandard?.futureDependentStandards ?? [];
  const standardDescription   = targetStandard?.description ?? misconception.description ?? '';
  const learningComponents    = targetStandard?.learningComponents ?? [];
  const childStandards        = targetStandard?.childStandards ?? [];
  const relatedStandards      = targetStandard?.relatedStandards ?? [];

  // The caller deduplicates LVN entries across the session's standards, leaving a
  // `{ id, name, seeAbove: true }` stub wherever an entry already appeared in full
  // under an earlier standard. That reads correctly in a prompt that renders every
  // standard; this prompt renders ONE, so "above" may not exist. Resolve each stub
  // back to its full entry from the session-wide payload before formatting.
  const resolveSeeAbove = (allStandards) => {
    const full = { factor: new Map(), strategy: new Map(), learnerModel: new Map(), interactsWith: new Map() };
    for (const st of allStandards) {
      for (const f of st.lvnFactors ?? []) {
        if (f.seeAbove) continue;
        if (!full.factor.has(f.id)) full.factor.set(f.id, f);
        for (const x of f.strategies    ?? []) if (!x.seeAbove && !full.strategy.has(x.id))      full.strategy.set(x.id, x);
        for (const x of f.learnerModels ?? []) if (!x.seeAbove && !full.learnerModel.has(x.id))  full.learnerModel.set(x.id, x);
        for (const x of f.interactsWith ?? []) if (!x.seeAbove && !full.interactsWith.has(x.id)) full.interactsWith.set(x.id, x);
      }
    }
    const pick = (map) => (x) => (x?.seeAbove ? (map.get(x.id) ?? x) : x);
    return (factors) => factors.map((f) => {
      const resolved = pick(full.factor)(f);
      if (resolved.seeAbove) return resolved; // no full copy anywhere — leave the stub
      return {
        ...resolved,
        strategies:    (resolved.strategies    ?? []).map(pick(full.strategy)),
        learnerModels: (resolved.learnerModels ?? []).map(pick(full.learnerModel)),
        interactsWith: (resolved.interactsWith ?? []).map(pick(full.interactsWith)),
      };
    });
  };
  const lvnFactors = resolveSeeAbove(standards)(targetStandard?.lvnFactors ?? []);

  // Diagnostic: when the analysis stage emits a code the graph does not carry,
  // targetStandard is undefined and ALL graph context silently drops out of this
  // prompt. Surfaced here so it is measurable rather than invisible.
  if (!targetStandard) {
    console.warn('[microcoachNextStepOption] no targetStandard match — generating without graph context', {
      misconceptionStandard: misconception.ccssStandard,
      availableCodes: standards.map((s) => s.code),
    });
  } else if (standardMatchedBy === 'canonical') {
    console.log(`[microcoachNextStepOption] matched ${misconception.ccssStandard} → ${targetStandard.code} by canonical key`);
  }

  // ── Format knowledge graph section ────────────────────────────────────────
  const knowledgeGraphSection = `
## Knowledge Graph: Learning Context

**Standard Being Taught**: ${misconception.ccssStandard}
${standardDescription ? `**Standard Description**: ${standardDescription}` : ''}

${learningComponents.length > 0 ? `**Learning Components** (the specific sub-skills this standard decomposes into):
${learningComponents.map((c) => `  - ${c.description}`).join('\n')}
Aim the activity at whichever of these sub-skills the misconception actually blocks, rather than at the standard as a whole.` : ''}

${childStandards.length > 0 ? `**Child Standards** (finer-grained standards nested under this one):
${childStandards.map((s) => `  - ${s.code}: ${s.description}`).join('\n')}` : ''}

${relatedStandards.length > 0 ? `**Related Standards**:
${relatedStandards.map((s) => `  - ${s.code}: ${s.description}`).join('\n')}` : ''}

${prerequisiteStandards.length > 0 ? `**Prerequisite Skills** (knowledge students should have but may be missing):
${prerequisiteStandards.map((s) => `  - ${s.code}: ${s.description}`).join('\n')}
The activity should acknowledge or briefly surface these gaps where relevant.` : ''}

${futureStandards.length > 0 ? `**At-Risk Standards** (what students will struggle with later if this misconception persists):
${futureStandards.map((s) => `  - ${s.code}: ${s.description}`).join('\n')}
Framing the importance of this fix in terms of these downstream skills can motivate students.` : ''}
`.trim();

  // ── Format LVN learning science section ───────────────────────────────────
  // The graph attaches research-backed strategies to each factor. Before the
  // 2026-08 rework these were fetched and then never rendered, so the model was
  // asked to "use the LVN factors" while seeing only factor names.
  const formatFactor = (f) => {
    if (f.seeAbove) return `- **${f.name}**`;
    const strategies = f.strategies ?? [];
    const detailed   = strategies.slice(0, MAX_LVN_STRATEGY_DETAIL);
    const remaining  = strategies.slice(MAX_LVN_STRATEGY_DETAIL);
    const lines = [`- **${f.name}** (${f.category}): ${f.description}`];
    if (f.gradeLevel?.length) lines.push(`  Grade levels: ${f.gradeLevel.join(', ')}`);

    if (detailed.length > 0) {
      lines.push('  Research-backed strategies targeting this factor:');
      lines.push(...detailed.map(
        (s) => s.seeAbove
          ? `    - **${s.name}**`
          : `    - **${s.name}**${s.category ? ` (${s.category})` : ''}: ${s.description}`
      ));
    }
    if (remaining.length > 0) {
      lines.push(`    - Also linked: ${remaining.map((s) => s.name).join(', ')}`);
    }

    if (f.learnerModels?.length) {
      lines.push('  Learner models carrying this factor:');
      lines.push(...f.learnerModels.map(
        (m) => `    - **${m.name}**${m.description ? `: ${m.description}` : ''}`
      ));
    }

    if (f.interactsWith?.length) {
      lines.push('  Interacts with these other factors:');
      lines.push(...f.interactsWith.map(
        (i) => `    - **${i.name}**${i.description ? `: ${i.description}` : ''}`
      ));
    }

    return lines.join('\n');
  };

  const lvnSection = lvnFactors.length > 0 ? `
## LVN Learning Science Factors

The following research-backed factors are linked to ${misconception.ccssStandard}. Use them to guide your instructional approach and your strategy selection.

${lvnFactors.map(formatFactor).join('\n\n')}

Strategy selection guidance (choose the strategy tag that best fits the factors above):
${STRATEGY_TAGS.map(t => `- ${t.whenToUse} → **"${t.name}"**`).join('\n')}
`.trim() : '';

  // ── Format few-shot examples ───────────────────────────────────────────────
  const formatExample = (item, index) => {
    const l = item.nextStepLesson;
    if (!l) return null;
    const lines = [`### Example ${index + 1}: ${item.title}`];
    if (item.ccssStandards?.length) lines.push(`CCSS: ${item.ccssStandards.join(', ')}`);
    if (l.topic)          lines.push(`Topic: ${l.topic}`);
    if (l.targetProblem)  lines.push(`Target Problem: ${l.targetProblem}`);
    if (l.errorScenarios?.length) {
      lines.push('Error Scenarios:');
      l.errorScenarios.forEach((s) => {
        lines.push(`  - ${s.studentLabel} (${s.isCorrect ? 'correct' : 'incorrect'}): ${s.approach}`);
        if (s.reasoning?.length) s.reasoning.forEach((r) => lines.push(`      ${r}`));
      });
    }
    if (l.phases?.length) {
      lines.push('Lesson Phases:');
      l.phases.forEach((p) => {
        lines.push(`  - ${p.phaseName}${p.durationMinutes ? ` (${p.durationMinutes} min)` : ''}`);
        p.steps?.forEach((step) => lines.push(`      • ${step}`));
        p.teacherPrompts?.forEach((tp) => lines.push(`      > ${tp}`));
      });
    }
    if (l.keyTakeaways?.length) lines.push(`Key Takeaways: ${l.keyTakeaways.join(' | ')}`);
    return lines.join('\n');
  };

  const examplesSection = (() => {
    const formatted = contextDataItems
      .filter((item) => item.type === 'NEXT_STEP_LESSON' && item.nextStepLesson)
      .map(formatExample)
      .filter(Boolean);
    if (!formatted.length) return '';
    return `
## Reference Activity Examples
The following are real next step lessons used in similar classrooms. Study their structure, depth, and problem design — your output should match this level of quality.

${formatted.join('\n\n')}

---`;
  })();

  // ── Call 1: the activity ──────────────────────────────────────────────────
  const activityPrompt = `
You are an expert K-12 math instructional coach writing a classroom-ready activity for an early-career teacher. The activity template was chosen upstream for this instructional need; your job is to fill it.

## Writing style
- Instructional moves and steps: ${ws.instructionalMoves ?? 'Short sentences. One action per sentence. Plain conversational language. Active voice.'}
- Descriptions: ${ws.descriptions ?? 'Short sentences. Plain language. No run-ons.'}

## RightOn design principles
${DESIGN_PRINCIPLES.map((p, i) => `${i + 1}. ${p}`).join('\n')}

## Design guidance
${formatDesignGuidance(['purpose', 'timing', 'grouping', 'views', ...(hasExamples ? ['workedExamples'] : []), 'informationHierarchy', 'evidenceAndInference'])}

## The activity template you must enact
${formatForInfill(template)}

This template is not a label applied after the fact. The activity must follow its steps, its required grouping pattern and its defining instructional move; an activity that could equally have come from another template has failed.
${selectedTemplate.instructionalApproach ? `\nThe move this template was selected to enact for THIS need: ${selectedTemplate.instructionalApproach}` : ''}
${selectedTemplate.studentsDo ? `What students do in it: ${selectedTemplate.studentsDo}` : ''}
${selectedTemplate.rationale ? `Why it was selected: ${selectedTemplate.rationale}` : ''}
${siblingPick ? `
## The other recommendation
The teacher sees this activity next to a second one for the same need: ${templateById(siblingPick.templateId)?.title ?? siblingPick.templateId}${siblingPick.instructionalApproach ? ` (move: ${siblingPick.instructionalApproach})` : ''}.${siblingPick.studentsDo ? ` What students do there: ${siblingPick.studentsDo}` : ''} Two recommendations are worth offering only when they are different experiences for students. Make this one visibly different from it, not just differently labelled: give students a different problem or representation to work with, a different question to answer, and a different thing to produce, and let the closing discussion follow from this activity's own work.
${Array.isArray(siblingProblems) && siblingProblems.length ? `
The problems the other activity already uses:
${siblingProblems.map((p) => `- ${p}`).join('\n')}

Work with different ones here: different numbers, a different equation or system, or a different representation of the idea (a graph where the other works with the algebra, or the reverse), so students examine different evidence and come away with a different piece of the understanding. Keep the same item only when this template's move depends on it, and then have students do something different with it. This is a preference for a real difference, not variety for its own sake: never choose a weaker problem just to differ.
` : ''}` : ''}

## Classroom feasibility
${CLASSROOM_FEASIBILITY.map((r) => `- ${r}`).join('\n')}

## Pacing
The steps and the closing discussion together should take about ${DEFAULT_DURATION} minutes of class, and never more than ${MAX_DURATION}. Plan the minutes as an experienced teacher would for this class, not an ideal pace:
${PACING_GUIDANCE.map((r) => `- ${r}`).join('\n')}

${MATH_FORMATTING}
${examplesSection}
${knowledgeGraphSection}
${lvnSection ? `${lvnSection}\n` : ''}
${renderNeed(misconception)}

${renderMisconception(misconception)}

${renderEvidence(evidence)}

## Classroom context
Subject: ${classroomContext.subject ?? 'math'} | Class size: ${classroomContext.cohortSize ?? 'unknown'}

---

## What to write
- **whyThisActivity**: 2-3 teacher-facing sentences, per "Why This Activity" above. Draw on the instructional need and why the template was selected; do not mention scores, ranks, rubrics, or the word "template", and do not overstate what the evidence shows.
- **minutes** (each howToRun step), **discussionMinutes** and **beforeClassMinutes**: realistic minutes, per Pacing above. The steps' minutes plus discussionMinutes should come to about ${DEFAULT_DURATION} and must be at most ${MAX_DURATION}, which is slack for a class that runs long, not a budget to fill; if they would be over, cut content (a shorter task, a shorter share-out) rather than shrinking the estimates.
- **beforeClass.steps**: ${BOUNDS.beforeClassMin}-${BOUNDS.beforeClassMax} concrete things the teacher prepares. **beforeClass.groupingRationale**: 1-2 sentences on why students are grouped this way, from the template's priority grouping pattern.
- **howToRun**: the required steps listed under "How to run it" in the template, in that order, each with its title exactly as listed. Write only the \`body\` and \`minutes\`. The title and grouping are fixed and appear next to your body, so the body must describe students working in that grouping, following the step's guidance and specific to this activity. Leave out any step marked optional: it is filled in for you, and its time is not part of the plan.${hasExamples ? ' Refer to examples as "Example 1", "Example 2", … and never to more examples than you write.' : ''}
- ${FACILITATE_INSTRUCTIONS[contentType]()}
- \`facilitate.type\` must be exactly "${contentType}".
- Teacher-view labels (a line's status, a step's annotation or highlight, a strategy's verdict) must agree with the math. Label each line by whether the move it records is right: a line that records only a correct move, such as a solid boundary for $\\leq$, is CORRECT even inside work that goes wrong elsewhere. When teacher-only text names a region or direction (above, below, left, right, upper-left), solve for $y$ first and check the direction against the inequality and the line's slope.
- ${STUDENT_TEXT_RULE}
- Math accuracy: before you finish, recalculate every number, substitution and true or false conclusion you wrote. Each must be right and use every value it needs, apart from the intended error and what follows from it. This is only about accuracy: it adds no lines, steps or checks, and does not move or remove the intended error.${hasExamples ? `
- Every example must show, in its own work, the reasoning the instructional need names. A wrong answer being linked to this misconception is not enough: do not build an example around a different error, however legitimate. Two examples on the need beat three with one off it.
- A system's \`math\` looks exactly like {"kind":"SYSTEM","expressions":["$y + x > 2$","$y \\leq 3x - 2$"]}: each equation or inequality is its own string.
- Each example uses a different problem: a meaningfully different instance of the same need, so the teacher can choose among them. \`task\` is the instruction alone (e.g. "Graph the inequality"), \`math\` the LaTeX alone, one expression per item: SINGLE for one expression, SYSTEM for a system, listing every equation or inequality in it; they are joined into the problem students see. A system's student work and teacher answers may only use equations and inequalities that \`math\` lists, and an instruction that says "system" needs a SYSTEM. Students see no answer choices, so when a source question is multiple choice, restate it as an open problem they can answer without them and without any given value: a "which point" question becomes "Find a solution of the system", a "which graph" question becomes "Graph the inequality" or "Graph the system".` : ''}
- **targets**, **instructionalMove**, **strategyTag**${lvnFactors.length ? ' (use the LVN factors above)' : ''}, **aiReasoning**: as described in the schema.

Every problem, step and number must be mathematically correct and complete: real problems drawn from the evidence above, never placeholders. Where the schema marks a field teacher-only, the student-facing fields must not give it away.

Do not write discussion questions, Watch for sets or a takeaway: the closing discussion is written separately from the finished activity.

Return JSON matching the schema.
`.trim();

  const validateWorkedExamples = async (examples, ccssStandard) => {
    if (!examples?.length) return examples;
    const prompt = `You are a K-12 math accuracy reviewer checking incorrect worked examples for a ${ccssStandard} intervention.

Each example is INTENTIONALLY wrong at exactly one step — the step whose \`annotation.kind\` is "ERROR". Your job is to fix any UNINTENTIONAL arithmetic errors in the surrounding steps while preserving the intentional misconception error.

Rules:
- Do NOT fix or remove the step annotated ERROR (the one step that shows the wrong conceptual move), and do not move the annotation to a different step
- DO fix any arithmetic slippage in the other steps (wrong multiplication, wrong simplification, wrong sign, wrong intermediate result)
- Steps AFTER the ERROR step are consequences of it: they should follow correctly from the wrong value, not be silently repaired back to the right one
- If an example is already correct (one error only, no arithmetic slippage), return it unchanged
- CRITICAL: For each example, solve the problem correctly to find the true correct answer. Then trace the incorrect path through the steps to find the STATED answer in \`finalOutcome\` (the value the student arrives at — not their conclusion about whether it is right). If the stated answer matches the correct solution, the example fails — the misconception error is inconsequential. Replace the ENTIRE example (\`problem\`, \`prompt\`, \`slip\`, \`steps\` and \`finalOutcome\`) with a new problem of the same misconception type where the error causes a clearly wrong final answer. An error that appears only in a checking step and not in the solve step also fails this test, because the stated solution is still correct.
- Use LaTeX for all mathematical expressions ($...$ for inline, $$...$$ for display). Never use Unicode math symbols or plain ASCII math notation.
- Return a JSON array with the same length as the input. Each item: { "problem": "...", "prompt": "...", "slip": "...", "steps": [{ "step": 1, "text": "...", "annotation": { "kind": "ERROR", "text": "..." } | null }], "finalOutcome": "..." }

Examples to review:
${JSON.stringify(examples.map(e => ({ problem: e.problem, prompt: e.prompt, slip: e.slip, steps: e.steps, finalOutcome: e.finalOutcome })), null, 2)}`;

    const isAnnotation = (a) =>
      a && typeof a === 'object' && (a.kind === 'ERROR' || a.kind === 'CORRECT');
    const str = (v) => (typeof v === 'string' && v.trim() ? v : null);

    try {
      const completion = await timedCompletion('validate-worked-examples', {
        model: VALIDATOR_MODEL,
        messages: [
          { role: 'system', content: VALIDATOR_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
      });
      const raw = (completion.choices[0]?.message?.content ?? '[]').trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
      const parsed = sanitizeStrings(JSON.parse(raw));
      if (!Array.isArray(parsed) || parsed.length !== examples.length) {
        recordSubCall('validate-worked-examples', VALIDATOR_MODEL, completion, {
          fellBack: true, reason: 'shape mismatch',
        });
        return examples;
      }
      recordSubCall('validate-worked-examples', VALIDATOR_MODEL, completion, { fellBack: false });

      return parsed.map((v, i) => {
        const original = examples[i];
        if (!Array.isArray(v?.steps) || v.steps.length === 0) return original;

        const steps = v.steps.map((st, j) => ({
          step: Number.isInteger(st?.step) ? st.step : j + 1,
          text: str(st?.text) ?? original.steps[j]?.text ?? '',
          annotation: isAnnotation(st?.annotation)
            ? { kind: st.annotation.kind, text: str(st.annotation.text) }
            : original.steps[j]?.annotation ?? null,
        }));

        // An example with nothing marked wrong teaches nothing and renders with
        // no error row, so the original is the safer answer.
        if (!steps.some((st) => st.annotation?.kind === 'ERROR')) return original;
        if (steps.some((st) => st.text === '')) return original;

        return {
          ...original,
          problem: str(v?.problem) ?? original.problem,
          prompt: str(v?.prompt) ?? original.prompt,
          slip: str(v?.slip) ?? original.slip,
          steps,
          finalOutcome: str(v?.finalOutcome) ?? original.finalOutcome,
        };
      });
    } catch (err) {
      const unavailable = modelUnavailable(err);
      if (unavailable) reportModelUnavailable('validate-worked-examples', VALIDATOR_MODEL, 'nextStepOption.validator.model', err);
      else console.warn('[microcoachNextStepOption] validateWorkedExamples failed:', err?.message);
      recordSubCall('validate-worked-examples', VALIDATOR_MODEL, null, {
        fellBack: true, reason: err?.message ?? 'error', ...(unavailable && { modelUnavailable: true }),
      });
      return examples;
    }
  };

  // ── Call 2: the closing discussion ────────────────────────────────────────
  const discussionPromptFor = (activity) => `
You are an expert K-12 math instructional coach writing the Closing Discussion for the activity below. The activity reserved ${activity.discussionMinutes} minutes for it at the end of a ${MAX_DURATION}-minute window.

${formatDesignGuidance(['closingDiscussion', 'mathematicalTakeaway', 'discussionQuestions', 'watchFor', 'evidenceAndInference'])}

${MATH_FORMATTING}

${renderNeed(misconception)}

${renderMisconception(misconception)}

${renderEvidence(evidence)}

## The activity (teacher view)
${template.title} — ${template.primaryMove}
Why this activity: ${activity.whyThisActivity}
How it runs:
${activity.howToRun.map((s, i) => `  ${i + 1}. ${s.title}${s.minutes ? ` (${s.minutes} min)` : ''}: ${s.body}`).join('\n')}
The artifact students analyze, with teacher-only fields:
${JSON.stringify(activity.facilitate, null, 2)}

---

## What to write, in this order
1. **takeaway** — start from the instructional need: what mathematical understanding addresses it? Write that understanding as mathematics, faithful to this activity, and check it is correct and appropriately precise before going on. It anchors everything after it. Keep it to the one central idea, in 1-2 sentences and at most ${TAKEAWAY_TARGET_CHARS} characters, that a teacher can land in a few minutes: state it for the kind of problem this activity uses, and leave general formulas, special cases and side conditions (dividing by a negative, a zero coefficient, a vertical line) to the teacher answer of the question they bear on.
2. **questions** — exactly ${BOUNDS.questionCount}, each building on the takeaway. They are alternatives: the teacher picks the one that best fits the class and runs it alone in the ${activity.discussionMinutes} minutes, so each must stand on its own and be answerable in that time. Give each its realistic \`minutes\` (think time, a few student responses, and the teacher drawing out the point). Tag each with its \`purpose\`; choose the purposes that best support the takeaway rather than one of each. \`answer\` is teacher-facing: the mathematically correct answer, or what to listen for when the question is open.
3. **watchFors** — ${BOUNDS.watchForMin}-${BOUNDS.watchForMax} sets: fewer strong ones over more weak ones. Ground each in the thinking this activity surfaces, describe the observable move before any interpretation, and do not repeat what a discussion question already does.${misconception.evidenceBasis === 'inferred' ? ' The misconception is inferred, so one Watch for should help the teacher test it: what a student reasoning this way would say or do, what a different route to the same answer would sound like, and a question that tells them apart.' : ''}

Return JSON matching the schema.
`.trim();

  // ── Call 3: the accuracy and coherence review ─────────────────────────────
  const shortenTakeawayPromptFor = (activity, discussion) => `You are an expert K-12 math instructional coach. Rewrite this activity's mathematical takeaway so it is one central idea a teacher can land in a few minutes: at most ${TAKEAWAY_TARGET_CHARS} characters, in 1-2 sentences of mathematics.

Keep the idea and keep it mathematically correct. Cut procedure, examples, conditions and special cases: those stay in the discussion questions. It must remain the anchor for the questions below.

## The takeaway
${discussion.takeaway}

## The discussion questions it anchors
${discussion.questions.map((q, i) => `${i + 1}. ${q.question}`).join('\n')}

${MATH_FORMATTING}`;

  const reviewPromptFor = (activity, draft) => `
You are a K-12 mathematics reviewer checking the Closing Discussion of a classroom activity before teachers see it.

${formatDesignGuidance(['accuracyCheck', 'mathematicalTakeaway', 'discussionQuestions', 'watchFor'])}

## Instructional need
${misconception.instructionalNeed?.text ?? '(not given)'}

## The activity's artifact (teacher view)
${JSON.stringify(activity.facilitate, null, 2)}

## The draft Closing Discussion
${JSON.stringify(draft, null, 2)}

## The artifact's teacher-view labels and notes
${teacherLabels(activity.facilitate).map((l) => (l.allowed
    ? `- ${l.id} = ${l.current} (allowed: ${l.allowed.join(', ')})`
    : `- ${l.id} (teacher note)`)).join('\n')}

---

Work through the mathematical accuracy and coherence check above, item by item. Solve every mathematical claim, answer, counterexample and condition yourself rather than trusting the draft. Check each question's premise as well as its answer: an answer that endorses an invalid move under some "condition" is an error, however carefully it is hedged.

- \`issues\`: one entry per failed check, naming the component and what is wrong. Empty when everything passes.
- \`corrected\`: the discussion with every issue fixed, in the same shape and with the same number of questions. When there are no issues, return the draft unchanged. Do not restyle wording that passes the check.
- Takeaway focus: the takeaway must be the one central idea in 1-2 sentences and at most ${TAKEAWAY_TARGET_CHARS} characters. When accuracy needs a condition or special case, do not append it to the takeaway — state the takeaway for the kind of problem the activity uses, and put the qualification in the teacher answer of the question it bears on. A takeaway that bundles conditions or edge cases is an issue to fix.
- \`artifactFixes\`: check every label and teacher note listed above against the math, as teachers will rely on them to facilitate. Student work is meant to contain the error, so correct the label, never the work: a label is right when it says whether the move its line or step records is right. A line that records only a correct move (a solid boundary for $\\leq$) is CORRECT even inside wrong work. For every direction word in a teacher note (above, below, left, right, upper-left, …), solve for $y$ and check it against the inequality and the line's slope; a note that hedges between directions ("above/right", "lower/upper depends") is wrong when one is correct. Give a label fix as \`label\` with one of its allowed values, a note fix as the whole corrected note in \`text\`. Use only the ids listed. If a fix changes what the discussion should say, fix the discussion too. Empty when everything is right.

${MATH_FORMATTING}
`.trim();

  // The last look at an activity, with one job: is the math in each row true? The code
  // picks the rows and the schema requires a verdict on each one: left to choose, the
  // model skipped most teacher notes and never reached v57's wrong point. It only flags,
  // for the run report: all 4 fixes it made in live runs (v58-v60) wrote wrong content
  // into correct text, such as v60's "$y > -x + 2$" becoming another problem's "$y > 2x + 4$".
  const mathCheckPromptFor = (rows, intendedRows, content) => `
Your only job: is the math in each row true?

Work out every number, point, substitution, calculation and true or false result in the row yourself, then give one verdict per row. Wording, teaching choices, labels and alignment are not your concern.

If a row has no math, it passes.

Here are a few examples. They only illustrate the idea and are not a list of what to look for. Check all the math in every row, including kinds of error not shown here.

Wrong:
- "tests a boundary point of $y = 4x + 1$, such as $(1,3)$": $4(1) + 1 = 5$, not $3$, so it is not on the line.
- "boundary point $(0,1)$ and nearby point $(2,9)$ for $y = 4x + 1$": $4(2) + 1 = 9$, so $(2,9)$ is on the line, not near it.
- "Check $(1,2)$ in $y \\geq x - 6$: $2 \\geq 1$, true": $1 - 6 = -5$.
- "$3x + y = 10$ with $x = 2$ gives $y = 5$": $6 + y = 10$, so $y = 4$.

Right as written:
- "the student writes $3 > 3$ is true, so the point works": it describes a planned error.
- "a student says $0 < -1$ is true": it describes a student's mistaken belief.
- "If $(0,0)$ lies on the boundary, pick another point": it is a condition and does not say the point is on the line.
- "One possible argument is that $(0,4)$ should count": it is a position someone might argue.

## The problems in this activity (not to be changed)
${checkedProblems(content.facilitate).map((p) => `- ${p}`).join('\n')}

## Planned errors, and notes explaining them (meant to be wrong: no verdict)
${intendedRows.map((r) => `- ${JSON.stringify(r.text)}`).join('\n') || '(none)'}

## The rows
Each row belongs to the part of the activity named in its brackets. Check it against that part's own problem.
${rows.map((r, i) => `- r${i} [${rowLabel(r.id)}]: ${JSON.stringify(r.text)}`).join('\n')}
`.trim();

  /** One structured completion, parsed and sanitized against `schema`. */
  const structuredCall = async (label, model, systemPrompt, userPrompt, schema, name) => {
    const callModel = () => timedCompletion(label, {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: zodResponseFormat(schema, name),
    });
    let completion = await callModel();
    // A response that hit the output cap is cut off mid-JSON, so it can't be used.
    // Normal responses stay well under the cap, and the same prompt usually finishes
    // on a second try, so regenerate once and record it.
    if (completion.choices[0]?.finish_reason === 'length') {
      const capped = completion;
      recordSubCall(label, model, capped, { fellBack: false, outputCapped: true });
      completion = await callModel();
      const fixed = completion.choices[0]?.finish_reason !== 'length';
      recordSubCall('retry-output-cap', null, null, { call: label, cap: MAX_COMPLETION_TOKENS, fixed });
      if (!fixed) throw new Error(`${label}: reached the ${MAX_COMPLETION_TOKENS}-token output cap twice`);
    }
    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error(`${label}: empty completion content`);
    recordSubCall(label, model, completion, { fellBack: false });
    return sanitizeStrings(schema.parse(JSON.parse(raw)));
  };

  const RowVerdict = z.object({
    work: z.string().describe('The math in this row worked out, or "no math"'),
    isRight: z.boolean(),
  });

  // Reports only, and a failure or a late start reports nothing: it never changes the
  // activity. The Lambda stops at 600 s and this call can follow a retry elsewhere.
  const runFinalCheck = async (content) => {
    if (Date.now() - startedAt > FINAL_CHECK_LATEST_START_MS) {
      recordSubCall('final-check-skipped', null, null, { atSeconds: Math.round((Date.now() - startedAt) / 1000) });
      return [];
    }
    try {
      const all = checkableRows(content).filter((r) => r.text.trim());
      const rows = all.filter((r) => !r.intended);
      const verdicts = await structuredCall(
        'final-check-math', REVIEW_MODEL, VALIDATOR_SYSTEM_PROMPT,
        mathCheckPromptFor(rows, all.filter((r) => r.intended), content),
        z.object(Object.fromEntries(rows.map((_, i) => [`r${i}`, RowVerdict]))), 'mathCheck',
      );
      const flags = rows.flatMap((row, i) => {
        const verdict = verdicts[`r${i}`];
        return verdict.isRight ? [] : [{ id: row.id, text: row.text, why: verdict.work }];
      });
      recordSubCall('final-check-rows', null, null, { rows: rows.length, wrong: flags.length });
      if (flags.length > 0) recordSubCall('final-check-flagged', null, null, { flags });
      return flags;
    } catch (err) {
      const unavailable = modelUnavailable(err);
      if (unavailable) reportModelUnavailable('final-check', REVIEW_MODEL, 'nextStepOption.closingDiscussion.reviewModel', err);
      else console.warn('[microcoachNextStepOption] final check failed:', err?.message);
      recordSubCall('final-check', REVIEW_MODEL, null, {
        fellBack: true, reason: err?.message ?? 'error', ...(unavailable && { modelUnavailable: true }),
      });
      return [];
    }
  };

  try {
    // Replay harness only (seed/eval/scripts/replayFinalCheck.mjs): the final check
    // on an activity that is already written. Nothing in production sets this.
    if (input.finalCheckOnly != null) {
      const flags = await runFinalCheck(input.finalCheckOnly);
      return JSON.stringify({ flags, _trace: { subCalls: traceSubCalls } });
    }

    // Every attempt's math is put in shape before the checks below read it: a
    // system written as one \begin{cases} expression is split into its rows, and
    // an item that is only a \text{} note is dropped (see normalizeGeneratedMath).
    const generateActivity = async () => {
      const attempt = await structuredCall(
        'generate-activity', MODEL,
        'You are an expert K-12 math instructional coach. Output exclusively valid JSON.',
        activityPrompt, ActivitySchema, 'activity',
      );
      tidyGeneratedWork(attempt.facilitate, (cut) => recordSubCall('runaway-text-cut', null, null, cut));
      normalizeGeneratedMath(attempt.facilitate, (fix) => recordSubCall('math-normalized', null, null, fix));
      stripTextLabels(attempt.facilitate, (fix) => recordSubCall('label-in-text', null, null, fix));
      cleanCaseStudentText(
        attempt.facilitate,
        (fix) => recordSubCall('case-text-cleaned', null, null, fix),
        (left) => recordSubCall('case-result-left', null, null, left),
      );
      attempt.howToRun = withFixedRunSteps(attempt.howToRun, runSteps);
      return attempt;
    };
    let generated = await generateActivity();
    // An instruction that names a system over math that is not one ("Graph the
    // system: $y + x > 2$") cannot be answered. Regenerate once; keep whichever
    // attempt has fewer such examples, and record both counts so evaluation can
    // see how often this fired and whether the retry fixed it.
    const incomplete = incompleteSystems(generated.facilitate);
    if (incomplete.length) {
      const retried = await generateActivity();
      const stillIncomplete = incompleteSystems(retried.facilitate);
      recordSubCall('retry-incomplete-system', null, null, {
        before: incomplete, after: stillIncomplete, fixed: stillIncomplete.length === 0,
      });
      if (stillIncomplete.length < incomplete.length) generated = retried;
    }
    // A plan whose steps and reserved discussion run past the class window does not
    // fit the lesson it is for. Regenerate once, keep the shorter plan, and record
    // both totals so evaluation can see how often this fired.
    const planned = plannedClassMinutes(generated);
    if (planned.total > MAX_DURATION) {
      const retried = await generateActivity();
      const replanned = plannedClassMinutes(retried);
      recordSubCall('retry-over-time', null, null, {
        before: planned, after: replanned, limit: MAX_DURATION, fixed: replanned.total <= MAX_DURATION,
      });
      if (replanned.total < planned.total && incompleteSystems(retried.facilitate).length <= incompleteSystems(generated.facilitate).length) {
        generated = retried;
      }
    }
    // A wrong approach that corrects itself ends right under a "Wrong approach"
    // label and gives students the answer. Regenerate once, keep the attempt with
    // fewer such steps as long as it is no worse on the checks above, and record
    // both so evaluation can see how often this fired.
    const selfCorrecting = selfCorrectingStrategies(generated.facilitate);
    if (selfCorrecting.length) {
      const retried = await generateActivity();
      const stillSelfCorrecting = selfCorrectingStrategies(retried.facilitate);
      recordSubCall('retry-self-correcting-strategy', null, null, {
        before: selfCorrecting, after: stillSelfCorrecting, fixed: stillSelfCorrecting.length === 0,
      });
      const noWorse = incompleteSystems(retried.facilitate).length <= incompleteSystems(generated.facilitate).length
        && (plannedClassMinutes(retried).total <= MAX_DURATION
          || plannedClassMinutes(retried).total <= plannedClassMinutes(generated).total);
      if (stillSelfCorrecting.length < selfCorrecting.length && noWorse) generated = retried;
    }
    const {
      targets, instructionalMove, strategyTag, aiReasoning, ...activity
    } = generated;

    // ── Math accuracy review of the artifact ─────────────────────────────────
    // Generated examples carry task + math; the stored shape carries prompt +
    // problem (see problemFields in util/activityContent.mjs). Only Spot the
    // Slip's worked examples are reviewed, problem and work together. The other
    // templates' problems are not: they are drawn from the assessment's own
    // questions, and the single-problem reviewer that used to check them made
    // them worse — it turned "and" into "or" in a system for a union-vs-
    // intersection misconception (contradicting the activity's own verdicts) and
    // swapped a point the activity relied on.
    activity.facilitate = toStoredFacilitate(activity.facilitate, ({ task, math }) =>
      recordSubCall('answerable-fallback', null, null, { before: task, math, after: 'Find a solution' }));
    if (activity.facilitate.type === 'INCORRECT_WORKED_EXAMPLES') {
      activity.facilitate.examples = await validateWorkedExamples(
        activity.facilitate.examples,
        misconception.ccssStandard,
      );
    }
    renumberSteps(activity.facilitate);

    // Replay harness only (seed/eval/scripts/replayActivity.mjs): stop once the
    // activity is built, skipping the closing discussion and its review. Nothing
    // in production sets this.
    if (input.stopAfter === 'activity') {
      return JSON.stringify({
        templateId: template.id,
        activityType: contentType,
        targets, instructionalMove, strategyTag, aiReasoning,
        durationMinutes: plannedClassMinutes(activity).total,
        content: {
          schemaVersion: CONTENT_VERSION,
          whyThisActivity: activity.whyThisActivity,
          durations: toStoredDurations(activity),
          beforeClass: activity.beforeClass,
          howToRun: activity.howToRun,
          facilitate: activity.facilitate,
          discussion: null,
        },
        _trace: { stoppedAfter: 'activity', subCalls: traceSubCalls },
      });
    }

    // ── Closing discussion, then its review ──────────────────────────────────
    const { DiscussionDraft, DiscussionReview } = discussionSchemasFor(activity.discussionMinutes);
    const discussionPrompt = discussionPromptFor(activity);
    const generateDiscussion = () => structuredCall(
      'generate-discussion', DISCUSSION_MODEL,
      'You are an expert K-12 math instructional coach. Output exclusively valid JSON.',
      discussionPrompt, DiscussionDraft, 'closingDiscussion',
    );
    let draft = await generateDiscussion();
    // A placeholder such as $y \\;\\Box\\; mx+b$ reaches students as a literal box, and
    // the prompt's ban alone doesn't stop it (v44, v51). Regenerate once, and keep the
    // first draft if the retry fails, since a failed retry shouldn't lose the activity.
    if (hasMathPlaceholder(draft)) {
      let retried = null;
      try {
        retried = await generateDiscussion();
      } catch (err) {
        console.warn('[microcoachNextStepOption] placeholder retry failed — keeping the draft:', err?.message);
      }
      const fixed = retried != null && !hasMathPlaceholder(retried);
      recordSubCall('retry-placeholder', null, null, { fixed });
      if (fixed) draft = retried;
    }

    let discussion = draft;
    let review = null;
    let artifactFixes = null;
    const reviewPrompt = reviewPromptFor(activity, draft);
    try {
      review = await structuredCall(
        'review-discussion', REVIEW_MODEL, VALIDATOR_SYSTEM_PROMPT,
        reviewPrompt, DiscussionReview, 'discussionReview',
      );
      // A clean review keeps the draft verbatim: a reviewer with nothing to fix
      // has no business rewording what passed.
      if (review.issues.length > 0) discussion = review.corrected;
      if (review.artifactFixes.length > 0) {
        const fixed = applyLabelFixes(activity.facilitate, review.artifactFixes);
        activity.facilitate = fixed.facilitate;
        artifactFixes = fixed;
        recordSubCall('review-artifact-labels', null, null, {
          proposed: review.artifactFixes.length, applied: fixed.applied, rejected: fixed.rejected,
        });
      }
    } catch (err) {
      const unavailable = modelUnavailable(err);
      if (unavailable) reportModelUnavailable('review-discussion', REVIEW_MODEL, 'nextStepOption.closingDiscussion.reviewModel', err);
      else console.warn('[microcoachNextStepOption] discussion review failed — keeping the draft:', err?.message);
      recordSubCall('review-discussion', REVIEW_MODEL, null, {
        fellBack: true, reason: err?.message ?? 'error', ...(unavailable && { modelUnavailable: true }),
      });
    }

    // A takeaway over the limit is rewritten once on its own, leaving the questions
    // and Watch for sets it anchors as they are. Kept only if shorter; a failure keeps
    // what was written.
    if (discussion.takeaway.length > TAKEAWAY_MAX_CHARS) {
      const before = discussion.takeaway;
      try {
        const { takeaway } = await structuredCall(
          'shorten-takeaway', REVIEW_MODEL, VALIDATOR_SYSTEM_PROMPT,
          shortenTakeawayPromptFor(activity, discussion), z.object({ takeaway: z.string() }), 'takeaway',
        );
        if (takeaway.trim() && takeaway.length < before.length) discussion = { ...discussion, takeaway };
        recordSubCall('retry-takeaway-length', null, null, {
          before: before.length, after: discussion.takeaway.length, fixed: discussion.takeaway.length <= TAKEAWAY_MAX_CHARS,
        });
      } catch (err) {
        const unavailable = modelUnavailable(err);
        if (unavailable) reportModelUnavailable('shorten-takeaway', REVIEW_MODEL, 'nextStepOption.closingDiscussion.reviewModel', err);
        else console.warn('[microcoachNextStepOption] takeaway rewrite failed — keeping it:', err?.message);
        recordSubCall('shorten-takeaway', REVIEW_MODEL, null, {
          fellBack: true, reason: err?.message ?? 'error', ...(unavailable && { modelUnavailable: true }),
        });
      }
    }

    // The review or the rewrite can bring one back, so check what will be stored.
    if (hasMathPlaceholder(discussion)) recordSubCall('placeholder-left', null, null, {});

    // The teacher runs one of the three questions, so the class time is the steps
    // plus the longest question. Over the window means a question outgrew the time
    // its activity reserved; record it rather than trim what was written.
    const storedDiscussion = toStoredDiscussion(discussion);
    const durationMinutes = plannedClassMinutes(activity).steps
      + Math.max(...storedDiscussion.questions.map((q) => q.minutes ?? 0));
    if (durationMinutes > MAX_DURATION) {
      recordSubCall('over-time', null, null, { minutes: durationMinutes, limit: MAX_DURATION });
    }

    const content = {
      schemaVersion: CONTENT_VERSION,
      whyThisActivity: activity.whyThisActivity,
      durations: toStoredDurations(activity, storedDiscussion.questions),
      beforeClass: activity.beforeClass,
      howToRun: activity.howToRun,
      facilitate: activity.facilitate,
      discussion: storedDiscussion,
    };
    await runFinalCheck(content);

    const output = {
      templateId: template.id,
      activityType: contentType,
      targets,
      instructionalMove,
      strategyTag,
      durationMinutes,
      aiReasoning,
      content,
    };

    console.log(`${logTag} · done in ${secs(Date.now() - startedAt)} · ${durationMinutes} min planned`);
    if (wantTrace) {
      return JSON.stringify({
        ...output,
        _trace: {
          resolvedPrompt: activityPrompt,
          discussionPrompt,
          reviewPrompt,
          model: MODEL,
          discussionModel: DISCUSSION_MODEL,
          reviewModel: REVIEW_MODEL,
          // The question purposes are stripped from the stored content; kept here
          // so a run shows which kinds of question the model chose.
          discussionDraft: draft,
          discussionReview: review ? {
            issues: review.issues,
            applied: review.issues.length > 0,
            artifactFixes: review.artifactFixes,
            artifactFixesApplied: artifactFixes?.applied ?? [],
            artifactFixesRejected: artifactFixes?.rejected ?? [],
          } : null,
          targetStandardMatched: Boolean(targetStandard),
          targetStandardCode: targetStandard?.code ?? null,
          misconceptionStandard: misconception.ccssStandard ?? null,
          availableStandardCodes: standards.map((s) => s.code),
          graphUnits: {
            learningComponents: learningComponents.length,
            prerequisites: prerequisiteStandards.length,
            downstream: futureStandards.length,
            lvnFactors: lvnFactors.length,
            lvnStrategies: lvnFactors.reduce((n, f) => n + (f.strategies?.length ?? 0), 0),
          },
          subCalls: traceSubCalls,
        },
      });
    }
    return JSON.stringify(output);
  } catch (error) {
    console.error('[microcoachNextStepOption] Error', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
