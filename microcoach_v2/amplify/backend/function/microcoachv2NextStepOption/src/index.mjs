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
 *      reports issues and its output parses; otherwise the draft stands.
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
 *                          instructionalApproach, rationale } (required)
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
import { loadSecret } from './util/loadsecrets.mjs';
import { templateById, formatForInfill, formatDesignGuidance } from './util/activityLibrary.mjs';
import { matchStandard } from './util/ccssCode.mjs';
import {
  CONTENT_VERSION,
  EXAMPLE_TYPES,
  activityPlanSchemaFor,
  discussionDraftSchema,
  toStoredDiscussion,
  toStoredFacilitate,
  incompleteSystems,
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
const VALIDATOR_MODEL                = vco.model ?? 'o3-mini';
const VALIDATOR_SYSTEM_PROMPT        = vco.systemPrompt ?? 'You are a math accuracy reviewer. Output only valid JSON.';
const DISCUSSION_MODEL        = cdo.model ?? MODEL;
const REVIEW_MODEL            = cdo.reviewModel ?? VALIDATOR_MODEL;
const MAX_DURATION            = nso.maxDurationMinutes ?? 15;
const DEFAULT_DURATION        = nso.targetDurationMinutes ?? 12;
const STRATEGY_TAGS           = nso.strategyTags ?? [];
// How many LVN strategies per factor get a full description in the prompt.
// Defaults to all of them: a field that is not in the prompt cannot be ablated,
// so nothing is filtered before there is evidence to filter on.
const MAX_LVN_STRATEGY_DETAIL = nso.maxLvnStrategyDetail ?? Infinity;
const ALLOWED_DURATION_BUCKETS = nso.allowedDurationBuckets ?? [];
const INCORRECT_EXAMPLE_RULES = nso.incorrectWorkedExampleRules ?? [];
const INCORRECT_EXAMPLE_FEW_SHOT = nso.incorrectWorkedExampleFewShot ?? [];
const DESIGN_PRINCIPLES       = nso.designPrinciples ?? [];
const CLASSROOM_FEASIBILITY   = nso.classroomFeasibility ?? [];
const PHASE_DURATIONS         = nso.phaseDurations ?? { beforeClass: '5 min', facilitate: '8-10 min', discussion: '3-5 min' };

// Cardinality, as schema bounds: the one form of guidance the model reliably honours.
const BOUNDS = {
  examplesMin: nso.examples?.min ?? 1,
  examplesMax: nso.examples?.max ?? 3,
  beforeClassMin: nso.setupSteps?.min ?? 2,
  beforeClassMax: nso.setupSteps?.max ?? 3,
  howToRunMin: nso.activitySteps?.min ?? 4,
  howToRunMax: nso.activitySteps?.max ?? 6,
  questionCount: cdo.questionCount ?? 3,
  watchForMin: cdo.watchFors?.min ?? 1,
  watchForMax: cdo.watchFors?.max ?? 3,
};

// ── Schemas ───────────────────────────────────────────────────────────────────

const strategyTagSchema = STRATEGY_TAGS.length >= 2
  ? z.enum(STRATEGY_TAGS.map((t) => t.name))
  : z.string();

/** The row-level fields stored beside the content on MicroCoachActivity. */
const RowFields = z.object({
  targets: z.string().describe('The specific skill this activity builds, in plain skill language (e.g. "Applying integer sign rules in algebraic expressions"). Not ontology IDs.'),
  instructionalMove: z.string().describe('What the teacher concretely does, beginning with a verb, 2-4 sentences, naming the error pattern this activity addresses.'),
  strategyTag: strategyTagSchema.describe(`Exactly one of: ${STRATEGY_TAGS.map((t) => t.name).join(', ')}`),
  durationMinutes: z.number().int().max(MAX_DURATION).describe(`Class minutes for the activity and closing discussion together, within one of: ${ALLOWED_DURATION_BUCKETS.map((b) => b.label).join(', ')}`),
  aiReasoning: z.string().describe('Internal: why this design enacts the template for this need. Not shown to teachers.'),
});

const DiscussionDraft = discussionDraftSchema(BOUNDS);

const DiscussionReview = z.object({
  issues: z.array(z.object({
    component: z.string().describe('Which part: "takeaway", "question 2", "watch for 1", …'),
    problem: z.string().describe('What fails the check, and why'),
  })).describe('Empty when every check passes'),
  corrected: DiscussionDraft.describe('The discussion with every issue fixed; unchanged when there are none'),
});

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

function restoreLostEscapes(text) {
  return text
    .replace(/[\r\t\f\b](?=[a-zA-Z])/g, (c) => `\\${LOST_ESCAPE_LETTER[c]}`)
    .replace(/\$\$[^$]*\$\$|\$[^$]*\$/g, (span) => span.replace(/\n(?=[a-zA-Z])/g, '\\n'));
}

function sanitizeStrings(value) {
  if (typeof value === 'string') {
    // Two or more backslashes before a letter or a space are an over-escaped command,
    // which LaTeX reads as a line break rather than the command meant. Strings
    // with a begin-environment (cases, aligned) keep theirs: there it is the row break.
    const cleaned = restoreLostEscapes(value).replace(CONTROL_CHARS, '');
    const unescaped = /\\begin\{/.test(cleaned) ? cleaned : cleaned.replace(/\\{2,}(?=[a-zA-Z ])/g, '\\');
    return unescaped.replace(/ {2,}/g, ' ').trim();
  }
  if (Array.isArray(value)) return value.map(sanitizeStrings);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, sanitizeStrings(v)]));
  }
  return value;
}

const parseMaybe = (raw, fallback) => {
  if (raw == null) return fallback;
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
};

// ── Prompt pieces ─────────────────────────────────────────────────────────────

const MATH_FORMATTING = `## Math formatting
Use LaTeX for every mathematical expression: $...$ inline, $$...$$ for a standalone equation. Never use Unicode math symbols (≤ ≥ ≠ × ÷ √ π ½ ²) or caret/underscore notation outside the delimiters. Fractions are $\\frac{a}{b}$, inequalities $\\leq$ / $\\geq$, multiplication $\\times$. Write each command with ONE backslash: never \\\\ (a line break) or \\  (a forced space), and never a placeholder symbol such as \\square — write the real symbol or words instead. Plain prose stays plain English — only the math goes inside delimiters.`;

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
  INCORRECT_WORKED_EXAMPLES: () => `\`facilitate.examples\`: ${BOUNDS.examplesMin}-${BOUNDS.examplesMax} incorrect worked solutions, each a different instance of the error. Each has its \`task\` and \`math\`, a 3-6 word \`slip\` (teacher only), the full step-by-step work, and a one-sentence \`finalOutcome\` (teacher only). Annotate the steps before the slip CORRECT, the FIRST invalid step ERROR, and leave its consequences unannotated.

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
  FAVORITE_NO: () => `\`facilitate.examples\`: ${BOUNDS.examplesMin}-${BOUNDS.examplesMax} incorrect responses, each revealing a mathematical idea, intuition, strategy, or assumption worth preserving — not a procedural slip, arithmetic mistake, or random answer. \`work\` is the response line by line, with the sound lines marked CORRECT so the error sits inside partly sound reasoning. \`notice\` (teacher only) lists what the reasoning gets right (PRESERVE, first) and then what needs to change (REVISE). \`sourceNote\` (teacher only) says this is one plausible way a student might reason toward the answer, not any one student's work, and that a real anonymous response can replace it. \`task\` and \`math\` state only the problem students solve — never the response, a description of it, or what is wrong with it; the response belongs in \`work\`.`,
  MATH_DETECTIVE: () => `\`facilitate.examples\`: ${BOUNDS.examplesMin}-${BOUNDS.examplesMax} incorrect responses, each pointing to a deeper mathematical issue to investigate — not a single localized slip. \`workSummary\` is one student's attempt in 2-5 short moves (the evidence). \`stages\`, in order: INVESTIGATE (ask what is going wrong and what idea, assumption, model, or representation might be behind it; answer with the issue and the evidence for it, naming another plausible interpretation when there is one), SOLVE (ask students to revise the reasoning; answer with the revised step and a check that it works on the original or a related example), GENERALIZE (ask for a rule that prevents the issue; answer with the rule to post). Student-facing \`ask\` text never gives the answer away. \`task\` and \`math\` state only the problem the student was solving, rewritten as an open problem when the original was multiple choice (the student's chosen answer belongs in \`workSummary\`) — never the student's work, a description of what the student did, or the error; those belong in \`workSummary\` and the teacher-only answers.`,
  COMPARE_THE_THINKING: () => `\`facilitate\`: one \`problem\` and exactly two strategies, A and B, with equal visual weight. Use CORRECT_VS_INCORRECT when the opportunity is to examine the misconception through the contrast; BOTH_CORRECT when it is to compare valid strategies (efficiency, generalizability, representation, assumptions). Verdicts, step highlights and notes are teacher only: highlight ERROR on the first invalid step and SUCCESS on the step that makes an approach work. Each strategy gets 1-2 notes on what it reveals about the thinking behind it. The comparison must have a clear mathematical purpose, not be a "which one is right?" exercise.`,
  MAKE_YOUR_CASE: () => `\`facilitate\`: a \`claim\` students can genuinely defend, challenge, or refine with evidence — not obviously true or false, and never a mathematically indefensible position. \`resolution\` (teacher only) is what the mathematics supports; use CONDITIONAL with the refined claim when it holds only under conditions. \`studentSteps\` are 1-3 short instructions for building a case. \`examples\` are 2-4 cases to bring in, each with what it shows (teacher only). \`arguments\` (teacher reference) hold at least one substantive SUPPORT and one substantive CHALLENGE — a counterexample, boundary condition, assumption, or limitation — never a deliberately weak one.`,
};

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
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
  const evidence            = parseMaybe(input.evidence, null);

  // The template fixes the content shape. RightOn! has no content type (it renders
  // as the game), and an unknown id is a caller bug; neither can be generated.
  const template    = templateById(selectedTemplate?.templateId);
  const contentType = template?.contentType ?? null;
  if (!template) throw new Error(`unknown templateId "${selectedTemplate?.templateId}"`);
  if (!contentType) throw new Error(`template "${template.id}" has no content type and cannot be generated`);
  const planSchema = activityPlanSchemaFor(contentType, BOUNDS);
  const ActivitySchema = RowFields.merge(planSchema);
  const hasExamples = EXAMPLE_TYPES.includes(contentType);

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

This template is not a label applied after the fact. The activity must follow its classroom flow, its priority grouping pattern and its defining instructional move; an activity that could equally have come from another template has failed.
${selectedTemplate.instructionalApproach ? `\nThe move this template was selected to enact for THIS need: ${selectedTemplate.instructionalApproach}` : ''}
${selectedTemplate.rationale ? `Why it was selected: ${selectedTemplate.rationale}` : ''}

## Classroom feasibility
${CLASSROOM_FEASIBILITY.map((r) => `- ${r}`).join('\n')}

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
- **durations**: \`beforeClass\` is prep outside class time. \`facilitate\` plus \`discussion\` must fit inside ${MAX_DURATION} minutes of class (target ${DEFAULT_DURATION}). Defaults to start from: before class "${PHASE_DURATIONS.beforeClass}", facilitate "${PHASE_DURATIONS.facilitate}", discussion "${PHASE_DURATIONS.discussion}".
- **beforeClass.steps**: ${BOUNDS.beforeClassMin}-${BOUNDS.beforeClassMax} concrete things the teacher prepares. **beforeClass.groupingRationale**: 1-2 sentences on why students are grouped this way, from the template's priority grouping pattern.
- **howToRun**: ${BOUNDS.howToRunMin}-${BOUNDS.howToRunMax} steps following the template's classroom flow. Give each step its grouping; leave \`groupings\` empty for a step that doesn't regroup; use two values only when the teacher chooses between them.${hasExamples ? ' Refer to examples as "Example 1", "Example 2", … and never to more examples than you write.' : ''}
- ${FACILITATE_INSTRUCTIONS[contentType]()}
- \`facilitate.type\` must be exactly "${contentType}".${hasExamples ? `
- Each example uses a different problem: a meaningfully different instance of the same need, so the teacher can choose among them. \`task\` is the instruction alone (e.g. "Graph the inequality"), \`math\` the LaTeX alone, one expression per item: SINGLE for one expression, SYSTEM for a system, listing every equation or inequality in it; they are joined into the problem students see. A system's student work and teacher answers may only use equations and inequalities that \`math\` lists, and an instruction that says "system" needs a SYSTEM. Students see no answer choices, so when a source question is multiple choice, restate it as an open problem they can answer without them and without any given value: a "which point" question becomes "Find a solution of the system", a "which graph" question becomes "Graph the inequality" or "Graph the system".` : ''}
- **targets**, **instructionalMove**, **strategyTag**${lvnFactors.length ? ' (use the LVN factors above)' : ''}, **durationMinutes**, **aiReasoning**: as described in the schema.

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
      const completion = await openai.chat.completions.create({
        model: VALIDATOR_MODEL,
        messages: [
          { role: 'system', content: VALIDATOR_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
      });
      const raw = completion.choices[0]?.message?.content ?? '[]';
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
      console.warn('[microcoachNextStepOption] validateWorkedExamples failed:', err?.message);
      recordSubCall('validate-worked-examples', VALIDATOR_MODEL, null, {
        fellBack: true, reason: err?.message ?? 'error',
      });
      return examples;
    }
  };

  // ── Call 2: the closing discussion ────────────────────────────────────────
  const discussionPromptFor = (activity) => `
You are an expert K-12 math instructional coach writing the Closing Discussion for the activity below. The teacher runs it in the last few minutes of a ${MAX_DURATION}-minute activity.

${formatDesignGuidance(['closingDiscussion', 'mathematicalTakeaway', 'discussionQuestions', 'watchFor', 'evidenceAndInference'])}

${MATH_FORMATTING}

${renderNeed(misconception)}

${renderMisconception(misconception)}

${renderEvidence(evidence)}

## The activity (teacher view)
${template.title} — ${template.primaryMove}
Why this activity: ${activity.whyThisActivity}
How it runs:
${activity.howToRun.map((s, i) => `  ${i + 1}. ${s.title}: ${s.body}`).join('\n')}
The artifact students analyze, with teacher-only fields:
${JSON.stringify(activity.facilitate, null, 2)}

---

## What to write, in this order
1. **takeaway** — start from the instructional need: what mathematical understanding addresses it? Write that understanding as mathematics, faithful to this activity, and check it is correct and appropriately precise before going on. It anchors everything after it.
2. **questions** — exactly ${BOUNDS.questionCount}, each building on the takeaway. Tag each with its \`purpose\`; choose the purposes that best support the takeaway rather than one of each. \`answer\` is teacher-facing: the mathematically correct answer, or what to listen for when the question is open.
3. **watchFors** — ${BOUNDS.watchForMin}-${BOUNDS.watchForMax} sets: fewer strong ones over more weak ones. Ground each in the thinking this activity surfaces, describe the observable move before any interpretation, and do not repeat what a discussion question already does.

Return JSON matching the schema.
`.trim();

  // ── Call 3: the accuracy and coherence review ─────────────────────────────
  const reviewPromptFor = (activity, draft) => `
You are a K-12 mathematics reviewer checking the Closing Discussion of a classroom activity before teachers see it.

${formatDesignGuidance(['accuracyCheck', 'mathematicalTakeaway', 'discussionQuestions', 'watchFor'])}

## Instructional need
${misconception.instructionalNeed?.text ?? '(not given)'}

## The activity's artifact (teacher view)
${JSON.stringify(activity.facilitate, null, 2)}

## The draft Closing Discussion
${JSON.stringify(draft, null, 2)}

---

Work through the mathematical accuracy and coherence check above, item by item. Solve every mathematical claim, answer, counterexample and condition yourself rather than trusting the draft. Check each question's premise as well as its answer: an answer that endorses an invalid move under some "condition" is an error, however carefully it is hedged.

- \`issues\`: one entry per failed check, naming the component and what is wrong. Empty when everything passes.
- \`corrected\`: the discussion with every issue fixed, in the same shape and with the same number of questions. When there are no issues, return the draft unchanged. Do not restyle wording that passes the check.

${MATH_FORMATTING}
`.trim();

  /** One structured completion, parsed and sanitized against `schema`. */
  const structuredCall = async (label, model, systemPrompt, userPrompt, schema, name) => {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: zodResponseFormat(schema, name),
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error(`${label}: empty completion content`);
    recordSubCall(label, model, completion, { fellBack: false });
    return sanitizeStrings(schema.parse(JSON.parse(raw)));
  };

  try {
    const generateActivity = () => structuredCall(
      'generate-activity', MODEL,
      'You are an expert K-12 math instructional coach. Output exclusively valid JSON.',
      activityPrompt, ActivitySchema, 'activity',
    );
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
    const {
      targets, instructionalMove, strategyTag, durationMinutes, aiReasoning, ...activity
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

    // Replay harness only (seed/eval/scripts/replayActivity.mjs): stop once the
    // activity is built, skipping the closing discussion and its review. Nothing
    // in production sets this.
    if (input.stopAfter === 'activity') {
      return JSON.stringify({
        templateId: template.id,
        activityType: contentType,
        targets, instructionalMove, strategyTag, durationMinutes, aiReasoning,
        content: {
          schemaVersion: CONTENT_VERSION,
          whyThisActivity: activity.whyThisActivity,
          durations: activity.durations,
          beforeClass: activity.beforeClass,
          howToRun: activity.howToRun,
          facilitate: activity.facilitate,
          discussion: null,
        },
        _trace: { stoppedAfter: 'activity', subCalls: traceSubCalls },
      });
    }

    // ── Closing discussion, then its review ──────────────────────────────────
    const discussionPrompt = discussionPromptFor(activity);
    const draft = await structuredCall(
      'generate-discussion', DISCUSSION_MODEL,
      'You are an expert K-12 math instructional coach. Output exclusively valid JSON.',
      discussionPrompt, DiscussionDraft, 'closingDiscussion',
    );

    let discussion = draft;
    let review = null;
    const reviewPrompt = reviewPromptFor(activity, draft);
    try {
      review = await structuredCall(
        'review-discussion', REVIEW_MODEL, VALIDATOR_SYSTEM_PROMPT,
        reviewPrompt, DiscussionReview, 'discussionReview',
      );
      // A clean review keeps the draft verbatim: a reviewer with nothing to fix
      // has no business rewording what passed.
      if (review.issues.length > 0) discussion = review.corrected;
    } catch (err) {
      console.warn('[microcoachNextStepOption] discussion review failed — keeping the draft:', err?.message);
      recordSubCall('review-discussion', REVIEW_MODEL, null, { fellBack: true, reason: err?.message ?? 'error' });
    }

    const content = {
      schemaVersion: CONTENT_VERSION,
      whyThisActivity: activity.whyThisActivity,
      durations: activity.durations,
      beforeClass: activity.beforeClass,
      howToRun: activity.howToRun,
      facilitate: activity.facilitate,
      discussion: toStoredDiscussion(discussion),
    };

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
          discussionReview: review ? { issues: review.issues, applied: review.issues.length > 0 } : null,
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
