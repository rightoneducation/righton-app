import { loadSecret } from './util/loadsecrets.mjs';
import { templateById, formatForInfill } from './util/activityLibrary.mjs';
import { matchStandard } from './util/ccssCode.mjs';
import {
  phasesSchemaFor,
  CONTENT_TYPES,
  readActivityProblem,
  writeActivityProblem,
} from './util/activityContent.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from './util/config.json' assert { type: 'json' };

const nso = config?.nextStepOption ?? {};
const vco = nso.validator ?? {};
const ws  = config?.writingStyle ?? {};
const MODEL                          = nso.model ?? 'gpt-4o';
const VALIDATOR_MODEL                = vco.model ?? 'o3-mini';
const VALIDATOR_SYSTEM_PROMPT        = vco.systemPrompt ?? 'You are a math accuracy reviewer. Output only valid JSON.';
const VALIDATOR_PROBLEM_INSTRUCTIONS = vco.problemReviewInstructions ?? 'Is the problem mathematically correct? If it contains errors, return the corrected version. If correct, return it unchanged. Return JSON: { "problem": "<corrected or original problem>" }';
const MAX_DURATION            = nso.maxDurationMinutes ?? 30;
const DEFAULT_DURATION        = nso.targetDurationMinutes ?? 30;
const DISALLOWED_METHODS      = nso.disallowedTeachingMethods ?? [];
const GROUPS_MIN              = nso.studentGroups?.min ?? 2;
const GROUPS_MAX              = nso.studentGroups?.max ?? 3;
// Phase cardinality. These four config keys were written when the phases were
// designed and then read by nothing, so every count drifted above its ceiling —
// the checklist ran to 4 against a max of 3, facilitation to 8 against 6. They are
// schema bounds now rather than prose, because a bound is the only form the model
// reliably honours.
const CHECKLIST_MIN           = nso.setupSteps?.min ?? 2;
const CHECKLIST_MAX           = nso.setupSteps?.max ?? 3;
const FACILITATION_MIN        = nso.activitySteps?.min ?? 4;
const FACILITATION_MAX        = nso.activitySteps?.max ?? 6;
const DISCUSSION_MIN          = nso.discussionQuestions?.min ?? 2;
const DISCUSSION_MAX          = nso.discussionQuestions?.max ?? 3;
const STRATEGY_TAGS           = nso.strategyTags ?? [];
// How many LVN strategies per factor get a full description in the prompt.
// Defaults to all of them: a field that is not in the prompt cannot be ablated,
// so nothing is filtered before there is evidence to filter on. Set
// `nextStepOption.maxLvnStrategyDetail` in prompt-config.json to cap it later.
const MAX_LVN_STRATEGY_DETAIL = nso.maxLvnStrategyDetail ?? Infinity;
const ALLOWED_DURATION_BUCKETS = nso.allowedDurationBuckets ?? [];
const INCORRECT_EXAMPLES_COUNT     = nso.incorrectWorkedExamplesCount ?? 2;
// How much longer than the original a reviewed problem may be before the review is
// treated as having produced something other than a problem. See
// validateActivityProblem.
const PROBLEM_GROWTH_LIMIT         = nso.problemGrowthLimit ?? 1.5;
const INCORRECT_EXAMPLE_RULES      = nso.incorrectWorkedExampleRules ?? [];
const INCORRECT_EXAMPLE_FEW_SHOT   = nso.incorrectWorkedExampleFewShot ?? [];
const DESIGN_PRINCIPLES            = nso.designPrinciples ?? [];
const CLASSROOM_FEASIBILITY        = nso.classroomFeasibility ?? [];
const UDL_REQUIREMENTS             = nso.udlRequirements ?? [];

/*
 * The worked-example count lives once, in incorrectWorkedExamplesCount, and is
 * enforced as a .length() on the schema. Prose that mentions the count reads it
 * from there too: a hard-coded "2–3" beside a schema pinned to 2 let the summary
 * and prep checklist promise three examples the activity did not contain (v27).
 */
const withExampleCount = (text) =>
  text.replaceAll('{incorrectWorkedExamplesCount}', String(INCORRECT_EXAMPLES_COUNT));
const exampleLabels = () =>
  Array.from({ length: INCORRECT_EXAMPLES_COUNT }, (_, i) => `"Example ${i + 1}"`).join(', ');
const FORMAT_CONSTRAINTS           = nso.formatConstraints ?? {};
const WHOLE_CLASS_DESC             = FORMAT_CONSTRAINTS.wholeClass?.description ?? '';
const SPLIT_CLASS_DESC             = FORMAT_CONSTRAINTS.splitClass?.description ?? '';
const SPLIT_CLASS_STRUCTURES       = FORMAT_CONSTRAINTS.splitClass?.structures ?? [];
const SPLIT_CLASS_AVOID            = FORMAT_CONSTRAINTS.splitClass?.avoid ?? [];

// ── Schema ────────────────────────────────────────────────────────────────────
// Generates ONE next step activity option for a single misconception + format.
// Called once per format per misconception in parallel by the seed script.

// Build enum dynamically from config; fall back to string if list is empty
const strategyTagSchema = STRATEGY_TAGS.length >= 2
  ? z.enum(STRATEGY_TAGS.map(t => t.name))
  : z.string();

const NextStepActivity = z.object({
  type: z.literal('NEXT_STEP'),
  status: z.literal('GENERATED'),
  title: z.string().describe('Short, action-oriented activity title. Do NOT include format name, parentheticals, or any label beyond the title itself.'),
  summary: z.string().describe('1-2 sentence description of the activity'),
  targets: z.string().describe(
    'The specific skill this activity targets, expressed in plain skill language ' +
    '(e.g. "Distributing multiplication across addition/subtraction", ' +
    '"Applying integer sign rules in algebraic expressions"). Not ontology IDs.'
  ),
  mathematicalTakeaway: z.string().describe(
    'One sentence: what students should understand when this is done — the mathematical ' +
    'statement they should be able to make. What they leave understanding, never what ' +
    'they did during the activity.'
  ),
  instructionalMove: z.string().describe(
    'What the teacher concretely does to address the misconception. ' +
    'Begin with a verb (Model, Facilitate, Guide, Compare, Have students…). ' +
    '2–4 sentences max. Executable without additional prep documents. ' +
    'Must explicitly reference the misconception error pattern.'
  ),
  strategyTag: strategyTagSchema.describe(
    `Exactly one of the allowed strategy tags: ${STRATEGY_TAGS.map(t => t.name).join(', ')}`
  ),
  durationMinutes: z.number().int().max(MAX_DURATION).describe(
    `Duration in minutes. Choose a value within one of these allowed buckets: ` +
    ALLOWED_DURATION_BUCKETS.map(b => b.label).join(', ')
  ),
  format: z.enum(['whole_class', 'split_class']),
  aiReasoning: z.string().describe('Why this specific activity design targets this specific misconception'),
  aiGenerated: z.literal(true),
});

/**
 * Strip control characters from every string in the generated activity.
 *
 * The model reaches for them as invisible separators when a field asks for an
 * "inline sequence" — v25 came back with U+0003 between each step of
 * `problemChecklist` and its ✓/✗ mark. Nothing renders them, so the page looks
 * right while the bytes travel on into the PDF and the database. Wave 1 had the
 * same class of problem with a literal CRLF inside `activityStructure`.
 *
 * Tabs and newlines are kept: `problem` legitimately carries paragraph breaks.
 * Everything else below U+0020, plus the C1 range and the zero-width/BOM
 * characters, goes. Runs over the whole structure rather than the one field,
 * because the next field to ask for a separator will not be this one.
 */
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g;

function sanitizeStrings(value) {
  // Collapse the double space a removed separator leaves behind ("dashed)  ✓").
  // Spaces only — a tab or a newline may be carrying structure.
  if (typeof value === 'string') {
    return value.replace(CONTROL_CHARS, '').replace(/ {2,}/g, ' ').trim();
  }
  if (Array.isArray(value)) return value.map(sanitizeStrings);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, sanitizeStrings(v)]));
  }
  return value;
}

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const apiSecret = await loadSecret(apiSecretName);
  const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
  const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
  if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');

  const openai = new OpenAI({ apiKey });

  // Declared here rather than alongside the activity-generation inputs below,
  // because the planning branch returns before reaching them and reads this.
  const wantTrace = (event?.arguments?.input?.trace ?? event?.input?.trace) === true;

  // Wave 1 had a planning call here that assigned a distinct invented structure to
  // each misconception, so a session felt varied. Wave 2 does not invent structures:
  // the template is chosen upstream and the activity infills it, so variety comes
  // from the templates themselves and the planner has nothing left to decide.

  // ── Parse activity-generation inputs ──────────────────────────────────────
  const rawMisconception        = event?.arguments?.input?.misconception        ?? event?.input?.misconception;
  const rawLearningScienceData  = event?.arguments?.input?.learningScienceData  ?? event?.input?.learningScienceData;
  const rawClassroomContext     = event?.arguments?.input?.classroomContext     ?? event?.input?.classroomContext;
  const rawContextData          = event?.arguments?.input?.contextData          ?? event?.input?.contextData;
  const preferredFormat         = event?.arguments?.input?.preferredFormat      ?? event?.input?.preferredFormat ?? 'whole_class';
  // The template chosen upstream by microcoachv2LLMSelectTemplate. Its id resolves
  // against activityLibrary.json for the classroom flow, facilitation and views the
  // activity has to enact, and its `contentType` fixes the output shape. Optional so
  // the old prose-only behaviour still works for a caller that does not pass one.
  const rawSelectedTemplate     = event?.arguments?.input?.selectedTemplate     ?? event?.input?.selectedTemplate ?? null;

  // Eval instrumentation. Additive and inert unless explicitly requested, so
  // production callers see byte-identical responses.
  const traceSubCalls = [];
  const recordSubCall = (label, model, completion, extra = {}) => {
    if (!wantTrace) return;
    traceSubCalls.push({ label, model, usage: completion?.usage ?? null, ...extra });
  };

  if (rawMisconception == null)       throw new Error('misconception is required');
  if (rawLearningScienceData == null) throw new Error('learningScienceData is required');

  const misconception       = typeof rawMisconception       === 'string' ? JSON.parse(rawMisconception)       : rawMisconception;
  const learningScienceData = typeof rawLearningScienceData === 'string' ? JSON.parse(rawLearningScienceData) : rawLearningScienceData;
  const classroomContext    = typeof rawClassroomContext    === 'string' ? JSON.parse(rawClassroomContext)    : (rawClassroomContext ?? {});
  const contextDataItems    = rawContextData ? (typeof rawContextData === 'string' ? JSON.parse(rawContextData) : rawContextData) : [];
  const selectedTemplate    = rawSelectedTemplate ? (typeof rawSelectedTemplate === 'string' ? JSON.parse(rawSelectedTemplate) : rawSelectedTemplate) : null;

  // Resolve the template and its output shape. A template with no `contentType`
  // (RightOn!, which renders as the game rather than a generated layout) falls back
  // to prose, as does a caller that passed no template at all.
  const template     = selectedTemplate?.templateId ? templateById(selectedTemplate.templateId) : null;
  const contentType  = template?.contentType ?? null;
  const phasesSchema = contentType
    ? phasesSchemaFor(contentType, {
      groupsMin: GROUPS_MIN, groupsMax: GROUPS_MAX,
      checklistMin: CHECKLIST_MIN, checklistMax: CHECKLIST_MAX,
      facilitationMin: FACILITATION_MIN, facilitationMax: FACILITATION_MAX,
      discussionMin: DISCUSSION_MIN, discussionMax: DISCUSSION_MAX,
      exampleCount: INCORRECT_EXAMPLES_COUNT,
    })
    : null;
  if (selectedTemplate?.templateId && !template) {
    console.warn(`[microcoachNextStepOption] unknown templateId "${selectedTemplate.templateId}" — generating prose only`);
  }
  if (contentType && !phasesSchema) {
    console.warn(`[microcoachNextStepOption] no content schema for "${contentType}" (known: ${CONTENT_TYPES.join(', ')}) — generating prose only`);
  }

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

  // Format-specific instructions injected into the prompt
  const formatInstructions = preferredFormat === 'split_class' ? `
## Split Class Format Requirements
${SPLIT_CLASS_DESC}

Allowed structures for this format:
${SPLIT_CLASS_STRUCTURES.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}

Avoid:
${SPLIT_CLASS_AVOID.map(a => `  - ${a}`).join('\n')}
`.trim() : `
## Whole Class Format Requirements
${WHOLE_CLASS_DESC}
`.trim();

  // The schema the model answers against. With a template it carries `phases`,
  // whose `activity` member is the typed layout the frontend renders; without one
  // it is the original prose-only shape.
  const ActivitySchema = phasesSchema
    ? NextStepActivity.extend({ phases: phasesSchema })
    : NextStepActivity;

  // The template's own brief — classroom flow, worked examples, facilitation
  // prompts, student/teacher views. formatForInfill already renders exactly this.
  const templateSection = template ? `
## The activity template you must enact

${formatForInfill(template)}

This template is not a label applied after the fact. The activity you generate must
follow its classroom flow and its defining instructional move; an activity that could
equally have come from another template has failed, however good it is on its own.
${selectedTemplate?.instructionalApproach ? `
The move this template was selected to enact for THIS need: ${selectedTemplate.instructionalApproach}` : ''}
` : '';

  // How the typed content has to come back, when a template fixed the shape.
  const contentSection = phasesSchema ? `
## Activity content — \`phases\`

Fill \`phases\` as well as the fields above. \`phases.activity.type\` must be exactly
"${contentType}" — it selects the layout this activity renders in, so no other value
will display.

- \`beforeClass.checklist\`: what the teacher prepares beforehand, including anything that must be printed or laid out. Keep it to what fits the time budget.
- \`beforeClass.groupFormation\`: ${GROUPS_MIN}-${GROUPS_MAX} groups differentiated by how severely each cohort holds this misconception, plus guidance on how to place students from a quick formative check. **Order the groups weakest first** — the first group needs the most support, the last the least. Give each a short \`label\` ("Group A") and put the descriptor in \`description\`. Do not list student names; they are assigned from the response data after you answer. Group formation happens inside the same ${MAX_DURATION}-minute budget, so keep the placement move to something that costs a minute or two.
- \`activity\`: the activity itself, in the shape the schema gives for ${contentType}. This is what students see, so the mathematics must be correct and complete — real problems, real steps, real numbers drawn from the student evidence above, never placeholders.
- \`facilitation.steps\`: how to run it, following the template's classroom flow.
- \`discussion.questions\`: the closing questions, drawn from the template's facilitation prompts.

Where the schema marks a field teacher-only, it must not give away what students are
meant to work out — the template's Views section says what each view may show.
${contentType === 'INCORRECT_WORKED_EXAMPLES' ? `
**Critical rules for the incorrect worked examples in \`activity.examples\`** (these are the most common failure mode):
${INCORRECT_EXAMPLE_RULES.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

Each example must show a complete problem and the full incorrect work step by step —
not just the wrong answer — reflect this specific error pattern rather than a random
mistake, and be self-contained enough to put on a board with no further prep. Annotate
the FIRST invalid step with kind ERROR; the steps after it are consequences, not the error.

There are exactly ${INCORRECT_EXAMPLES_COUNT} examples, labelled ${exampleLabels()}. The summary, the
beforeClass checklist and the facilitation steps must refer to exactly that many, by those
labels — never to a further example, and never by letters (A, B, C).
${INCORRECT_EXAMPLE_FEW_SHOT.length ? `
**Few-shot examples** — study the difference between CORRECT and INCORRECT example design:
${INCORRECT_EXAMPLE_FEW_SHOT.map(ex => `
Misconception: ${ex.misconception}
\u2713 ${ex.good.label}
  Problem: ${ex.good.problem}
  Incorrect work: ${ex.good.incorrectWork}
\u2717 ${ex.bad.label}
  Problem: ${ex.bad.problem}
  Incorrect work: ${ex.bad.incorrectWork}
`).join('\n')}` : ''}` : ''}
` : '';

  const userContent = `
You are an expert K-12 math instructional coach designing a targeted intervention activity for early-career teachers.

## Writing Style Requirements
Apply these rules to every string you generate:
- **Instructional moves and steps**: ${ws.instructionalMoves ?? 'Short sentences. One action per sentence. Plain conversational language. Active voice.'}
- **Descriptions**: ${ws.descriptions ?? 'Short sentences. Plain language. No run-ons.'}

## RightOn Design Principles
Every activity MUST explicitly follow these principles:

${DESIGN_PRINCIPLES.map((p, i) => `${i + 1}. **${p.split(':')[0]}**: ${p.split(':').slice(1).join(':').trim()}`).join('\n')}

${templateSection}
## Classroom Feasibility
This activity will be used in a live classroom by an early-career teacher. It must:
${CLASSROOM_FEASIBILITY.map(r => `- ${r}`).join('\n')}

## UDL-Informed Instruction
Provide multiple entry points for participation:
${UDL_REQUIREMENTS.map(r => `- ${withExampleCount(r)}`).join('\n')}
${contentSection}
## Math Formatting Requirements
Always use LaTeX for mathematical expressions. Never use Unicode math symbols or caret/underscore ASCII notation outside of LaTeX delimiters. Wrap ALL math in LaTeX delimiters:
- Inline math: $...$ (e.g. $\\frac{2}{3} \\div \\frac{3}{4}$, $-6x + 12$, $x^2$)
- Display/block math (standalone equations): $$...$$ on its own line
Specific rules:
- Exponents: $x^2$, $x^3$, $10^4$ (never x², x³ outside delimiters)
- Subscripts: $x_1$, $x_2$, $x_n$ (never x₁, x₂ outside delimiters)
- Fractions: $\\frac{a}{b}$ (never a/b or a÷b for fractions)
- Multiplication: $a \\times b$ (never × outside delimiters or *)
- Division: $a \\div b$ (never ÷ outside delimiters)
- Square root: $\\sqrt{x}$ (never √x outside delimiters)
- Inequalities: $\\leq$, $\\geq$, $\\neq$ (never ≤ ≥ ≠ outside delimiters)
- Approximately equal: $\\approx$ (never ≈ outside delimiters)
- Negative numbers: $-6$ (standard minus inside delimiters)
- Pi: $\\pi$ (never π outside delimiters)
- Angle/theta: $\\angle ABC$, $\\theta$ (never ∠ABC, θ outside delimiters)
- Absolute value: $|x|$ (inside delimiters)
Plain prose text should remain as normal English — only wrap actual math expressions in delimiters. Example: "Students who multiply $\\frac{2}{3}$ by the reciprocal will get $\\frac{8}{9}$, but a common error is to get $\\frac{4}{9}$."
${examplesSection}
${knowledgeGraphSection}
${lvnSection ? lvnSection + '\n' : ''}

## Misconception to Address

**Title**: ${misconception.title}
**Cognitive Error**: ${misconception.description}
${misconception.isCore ? '**[Core misconception]**' : ''}
**Frequency**: ${misconception.frequency ?? 'unknown'} students affected
${misconception.evidence?.mostCommonError ? `**Most Common Error**: ${misconception.evidence.mostCommonError}` : ''}
${misconception.evidence?.aiThinkingPattern ? `**Student Thinking Pattern**: ${misconception.evidence.aiThinkingPattern}` : ''}
${misconception.successIndicators?.length ? `**Success Indicators** (what mastery looks like):\n${misconception.successIndicators.map((s) => `  - ${s}`).join('\n')}` : ''}

## Classroom Context
Subject: ${classroomContext.subject ?? 'math'} | Class size: ${classroomContext.cohortSize ?? 'unknown'}

---

## Your Task

Generate ONE classroom-ready next step activity that directly addresses the cognitive error above.

${formatInstructions}

The activity MUST:
- Target the **specific** cognitive error pattern identified in the misconception
- Connect to the prerequisite knowledge gaps and downstream standards from the knowledge graph
- Use format: **"${preferredFormat}"** — do not use any other format
- Be completable in <= ${MAX_DURATION} minutes end to end — setup, the activity itself AND the closing discussion all fit inside that budget (target: ${DEFAULT_DURATION} minutes). Teachers have no more than ${MAX_DURATION} minutes of class time for this, so an activity that needs longer is not usable. Cut scope rather than overrunning: fewer steps or a shorter problem is better than an activity a teacher cannot finish.
${DISALLOWED_METHODS.length ? `- NOT use these teaching methods: ${DISALLOWED_METHODS.join(', ')}` : ''}

Requirements for each field:
- **title**: Short, action-oriented title only (e.g. "Keep-Change-Flip Error Analysis"). Do NOT append the format name, a parenthetical, or any other label — just the title.
- **summary**: 1-2 sentences; what the activity is and why it targets this error
- **targets**: The specific skill this activity builds, in plain skill language (not ontology IDs)
- **mathematicalTakeaway**: One sentence stating what students should leave understanding. Three different things, do not blur them: the misconception is what mathematical thinking is getting in the way, the instructional need is what students need to understand, and the takeaway is what they should leave understanding. Write the mathematics, not the lesson.
    Good: "When an inequality is rewritten in slope-intercept form, the resulting coefficients represent the slope and y-intercept of the boundary line."
    Not: "Students compared two graphs and discussed which side to shade"
- **instructionalMove**: What the teacher concretely does — begin with a verb, 2–4 sentences, must reference the error pattern and name the activity structure being used
- **strategyTag**: Must be exactly one of: ${STRATEGY_TAGS.map(t => `"${t.name}"`).join(', ')}${lvnFactors.length ? '. Use the LVN factors above to select the best fit.' : ''}
- **durationMinutes**: Choose a value within one of these buckets: ${ALLOWED_DURATION_BUCKETS.map(b => b.label).join(', ')}
- **aiReasoning**: Explain specifically WHY this activity structure and format targets this cognitive error

Return JSON matching the schema.
`.trim();

  /**
   * Reviews the worked examples in `phases.activity.examples` for arithmetic
   * accuracy. INCORRECT_WORKED_EXAMPLES only — it is the one content type that
   * carries examples, and its `prompt` is reviewed here rather than through
   * validateActivityProblem so the problem and the work attempting it are
   * judged together.
   *
   * Annotations are structural, not prose: `steps[].annotation.kind === 'ERROR'`
   * is what the UI keys the error row off, so an annotation is carried over from
   * the original by index unless the reviewer returns a well-formed one of its
   * own, and a result with no ERROR step at all is discarded in favour of the
   * original. Without that, a reviewer that "cleaned up" the intentional error
   * would produce an example with nothing wrong in it.
   */
  const validateWorkedExamples = async (examples, misconceptionTitle, ccssStandard) => {
    if (!examples?.length) return examples;
    const prompt = `You are a K-12 math accuracy reviewer checking incorrect worked examples for a ${ccssStandard} intervention on "${misconceptionTitle}".

Each example is INTENTIONALLY wrong at exactly one step — the step whose \`annotation.kind\` is "ERROR". Your job is to fix any UNINTENTIONAL arithmetic errors in the surrounding steps while preserving the intentional misconception error.

Rules:
- Do NOT fix or remove the step annotated ERROR (the one step that shows the wrong conceptual move), and do not move the annotation to a different step
- DO fix any arithmetic slippage in the other steps (wrong multiplication, wrong simplification, wrong sign, wrong intermediate result)
- Steps AFTER the ERROR step are consequences of it: they should follow correctly from the wrong value, not be silently repaired back to the right one
- If an example is already correct (one error only, no arithmetic slippage), return it unchanged
- CRITICAL: For each example, solve the problem correctly to find the true correct answer. Then trace the incorrect path through the steps to find the STATED answer in \`finalOutcome\` (the value the student arrives at — not their conclusion about whether it is right). If the stated answer matches the correct solution, the example fails — the misconception error is inconsequential. Replace the ENTIRE example (\`prompt\`, \`steps\` and \`finalOutcome\`) with a new problem of the same misconception type where the error causes a clearly wrong final answer. An error that appears only in a checking step and not in the solve step also fails this test, because the stated solution is still correct.
- Use LaTeX for all mathematical expressions ($...$ for inline, $$...$$ for display). Never use Unicode math symbols or plain ASCII math notation.
- Return a JSON array with the same length as the input. Each item: { "prompt": "...", "steps": [{ "step": 1, "text": "...", "annotation": { "kind": "ERROR", "text": "..." } | null }], "finalOutcome": "..." }

Examples to review:
${JSON.stringify(examples.map(e => ({ prompt: e.prompt, steps: e.steps, finalOutcome: e.finalOutcome })), null, 2)}`;

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
      const parsed = JSON.parse(raw);
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
          prompt: str(v?.prompt) ?? original.prompt,
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

  const validateActivityProblem = async (problem, misconceptionTitle, ccssStandard) => {
    try {
      const completion = await openai.chat.completions.create({
        model: VALIDATOR_MODEL,
        messages: [
          { role: 'system', content: VALIDATOR_SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Review this math problem for a ${ccssStandard} (${misconceptionTitle}) intervention activity.\nProblem: "${problem}"\n${VALIDATOR_PROBLEM_INSTRUCTIONS}\nUse LaTeX for all math ($...$ inline, $$...$$ display). Never use Unicode math symbols.`,
          },
        ],
      });
      const raw = completion.choices[0]?.message?.content ?? '{}';
      const result = JSON.parse(raw).problem;
      if (typeof result !== 'string' || !result.trim()) {
        recordSubCall('validate-activity-problem', VALIDATOR_MODEL, completion, {
          fellBack: true, reason: 'empty or non-string problem',
        });
        return problem;
      }
      // A correction should be about the size of what it corrects. On one run the
      // reviewer turned a ~520-character problem into 2,135 characters of lesson —
      // bracketed answers, a bullet list of corrections, and a closing sentence
      // describing its own edit — and all of it was written back as the problem.
      // For MATH_DETECTIVE that is fatal: the answers are the thing students are
      // supposed to work out. Growth past half again is treated as the reviewer
      // having written something other than a problem, and the original is kept.
      if (result.length > problem.length * PROBLEM_GROWTH_LIMIT) {
        recordSubCall('validate-activity-problem', VALIDATOR_MODEL, completion, {
          fellBack: true,
          reason: `reviewer expanded the problem ${problem.length}→${result.length} chars`,
        });
        return problem;
      }
      recordSubCall('validate-activity-problem', VALIDATOR_MODEL, completion, { fellBack: false });
      return result;
    } catch (err) {
      console.warn('[microcoachNextStepOption] validateActivityProblem failed:', err?.message);
      recordSubCall('validate-activity-problem', VALIDATOR_MODEL, null, {
        fellBack: true, reason: err?.message ?? 'error',
      });
      return problem;
    }
  };

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are an expert K-12 math instructional coach. Output exclusively valid JSON.' },
        { role: 'user', content: userContent },
      ],
      // `phases` is added only when a template fixed the output shape. The prose
      // fields are unchanged either way, so a caller that passes no template gets
      // byte-identical behaviour to before.
      response_format: zodResponseFormat(ActivitySchema, 'nextStepActivity'),
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty completion content');

    recordSubCall('generate-activity', MODEL, completion, { fellBack: false });

    const structured = sanitizeStrings(ActivitySchema.parse(JSON.parse(raw)));

    // ── Math accuracy review ───────────────────────────────────────────────
    // Both reviewers used to run over tabs.activitySteps, whose output nothing
    // read. They now run over the typed content the frontend actually renders.
    // A prose-only generation (no template, or a template with no content type)
    // has no activity to review, so both are skipped.
    const activityContent = structured.phases?.activity ?? null;

    if (activityContent?.type === 'INCORRECT_WORKED_EXAMPLES') {
      // The examples carry their own problem in `prompt`, reviewed alongside the
      // work attempting it rather than separately.
      activityContent.examples = await validateWorkedExamples(
        activityContent.examples,
        misconception.title,
        misconception.ccssStandard
      );
    } else if (activityContent) {
      const problem = readActivityProblem(activityContent);
      if (problem) {
        writeActivityProblem(
          activityContent,
          await validateActivityProblem(problem, misconception.title, misconception.ccssStandard)
        );
      }
    }

    if (wantTrace) {
      return JSON.stringify({
        ...structured,
        _trace: {
          resolvedPrompt: userContent,
          model: MODEL,
          preferredFormat,
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
    return JSON.stringify(structured);
  } catch (error) {
    console.error('[microcoachNextStepOption] Error', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
