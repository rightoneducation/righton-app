import { loadSecret } from './util/loadsecrets.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from './util/config.json' assert { type: 'json' };

const nso = config?.nextStepOption ?? {};
const vco = nso.validator ?? {};
const plo = nso.planner ?? {};
const ws  = config?.writingStyle ?? {};
const MODEL                          = nso.model ?? 'gpt-4o';
const PLANNER_MODEL                  = plo.model ?? 'gpt-4o-mini';
const VALIDATOR_MODEL                = vco.model ?? 'o3-mini';
const VALIDATOR_SYSTEM_PROMPT        = vco.systemPrompt ?? 'You are a math accuracy reviewer. Output only valid JSON.';
const VALIDATOR_PROBLEM_INSTRUCTIONS = vco.problemReviewInstructions ?? 'Is the problem mathematically correct? If it contains errors, return the corrected version. If correct, return it unchanged. Return JSON: { "problem": "<corrected or original problem>" }';
const MAX_DURATION            = nso.maxDurationMinutes ?? 30;
const DEFAULT_DURATION        = nso.targetDurationMinutes ?? 30;
const DISALLOWED_METHODS      = nso.disallowedTeachingMethods ?? [];
const ACTIVITY_STEPS_MIN      = nso.activitySteps?.min ?? 4;
const ACTIVITY_STEPS_MAX      = nso.activitySteps?.max ?? 6;
const SETUP_STEPS_MIN         = nso.setupSteps?.min ?? 2;
const SETUP_STEPS_MAX         = nso.setupSteps?.max ?? 3;
const DISCUSSION_Q_MIN        = nso.discussionQuestions?.min ?? 2;
const DISCUSSION_Q_MAX        = nso.discussionQuestions?.max ?? 3;
const GROUPS_MIN              = nso.studentGroups?.min ?? 2;
const GROUPS_MAX              = nso.studentGroups?.max ?? 3;
const STRATEGY_TAGS           = nso.strategyTags ?? [];
const ALLOWED_DURATION_BUCKETS = nso.allowedDurationBuckets ?? [];
const OVERVIEW_BULLETS_MIN    = nso.overviewBullets?.min ?? 2;
const OVERVIEW_BULLETS_MAX    = nso.overviewBullets?.max ?? 4;
const INCORRECT_EXAMPLES_COUNT     = nso.incorrectWorkedExamplesCount ?? 3;
const INCORRECT_EXAMPLE_RULES      = nso.incorrectWorkedExampleRules ?? [];
const INCORRECT_EXAMPLE_FEW_SHOT   = nso.incorrectWorkedExampleFewShot ?? [];
const DESIGN_PRINCIPLES            = nso.designPrinciples ?? [];
const ACTIVITY_STRUCTURES          = nso.activityStructures?.structures ?? [];
const DISTINCTNESS_RULES           = nso.distinctnessRules ?? [];
const CLASSROOM_FEASIBILITY        = nso.classroomFeasibility ?? [];
const UDL_REQUIREMENTS             = nso.udlRequirements ?? [];
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

const OverviewBullet = z.object({
  label: z.string().describe('Short bolded action phrase (e.g. "Think", "Discuss", "Compare")'),
  detail: z.string().describe('1-2 sentences describing the action'),
});

const Overview = z.object({
  whatStudentsDo: z.array(OverviewBullet).describe(`${OVERVIEW_BULLETS_MIN}-${OVERVIEW_BULLETS_MAX} bullets describing what students do`),
  whatYouDo: z.array(OverviewBullet).describe(`${OVERVIEW_BULLETS_MIN}-${OVERVIEW_BULLETS_MAX} bullets describing what the teacher does`),
  importance: z.string().describe('Why this activity directly addresses this misconception'),
});

const IncorrectWorkedExample = z.object({
  problem: z.string().describe('The math problem statement'),
  incorrectWork: z.string().describe('Student incorrect work showing the misconception reasoning step-by-step'),
});

const ActivitySteps = z.object({
  setup: z.array(z.string()).describe('Teacher preparation steps before the activity begins'),
  problem: z.string().describe('The central problem or prompt students work on'),
  incorrectWorkedExample1: IncorrectWorkedExample.describe('First incorrect worked example showing the misconception step-by-step'),
  incorrectWorkedExample2: IncorrectWorkedExample.describe('Second incorrect worked example showing the misconception step-by-step'),
  incorrectWorkedExample3: IncorrectWorkedExample.describe('Third incorrect worked example showing the misconception step-by-step'),
  coreActivity: z.array(z.string()).describe('Step-by-step activity instructions (4-6 steps)'),
  discussionQuestions: z.array(z.string()).describe('2-3 questions for debrief / whole-class discussion'),
});

const Materials = z.object({
  required: z.array(z.string()).describe('Materials that must be available'),
  optional: z.array(z.string()).optional().describe('Nice-to-have materials'),
});

const StudentGroup = z.object({
  name: z.string().describe('Group label — e.g. "Group A: Needs Concrete Support"'),
  description: z.string().describe('Who belongs in this group and what they focus on'),
  students: z.array(z.string()).optional().describe('Student names — populated post-generation'),
});

const StudentGroupings = z.object({
  groups: z.array(StudentGroup).describe('2-3 differentiated groups based on performance'),
  aiRecommendation: z.string().describe('High-level teacher guidance on grouping strategy'),
});

const Tabs = z.object({
  overview: Overview,
  activitySteps: ActivitySteps,
  materials: Materials,
  studentGroupings: StudentGroupings,
});

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
  activityStructure: z.string().describe('The named structure used for this activity (e.g. "Favorite No", "Math Hospital / Diagnose & Repair"). Must be distinct from any previously generated activity for this misconception.'),
  aiReasoning: z.string().describe('Why this specific activity design targets this specific misconception'),
  aiGenerated: z.literal(true),
  tabs: Tabs.describe('Full structured activity content'),
});

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const apiSecret = await loadSecret(apiSecretName);
  const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
  const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
  if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');

  const openai = new OpenAI({ apiKey });

  // ── Planning mode: assign diverse structures across all misconceptions ────────
  // Triggered by planStructures: true. Runs once per classroom before generation.
  const planStructures = event?.arguments?.input?.planStructures ?? event?.input?.planStructures;
  if (planStructures) {
    const rawMisconceptions   = event?.arguments?.input?.misconceptions ?? event?.input?.misconceptions;
    const rawClassroomContext = event?.arguments?.input?.classroomContext ?? event?.input?.classroomContext;
    const misconceptions      = typeof rawMisconceptions   === 'string' ? JSON.parse(rawMisconceptions)   : (rawMisconceptions ?? []);
    const classroomCtx        = typeof rawClassroomContext === 'string' ? JSON.parse(rawClassroomContext) : (rawClassroomContext ?? {});

    const exampleStructures = ACTIVITY_STRUCTURES.length > 0
      ? ACTIVITY_STRUCTURES.map(s => `- ${s.name}: ${s.description}`).join('\n')
      : '(none provided — use your own judgment)';

    const planPrompt = `You are an instructional design planner for a middle school math coaching tool.

A teacher will see activities for ${misconceptions.length} misconception(s) in a single session.
Grade: ${classroomCtx.grade ?? 'unknown'} | Subject: ${classroomCtx.subject ?? 'math'} | Class size: ${classroomCtx.cohortSize ?? 'unknown'}

Your job: assign a diverse set of activity structures across all misconceptions so that no two misconceptions use the same structure, and the overall session feels varied and pedagogically rich.

Each misconception needs two structure assignments — one for a whole_class activity and one for a split_class activity. The two structures for a single misconception must also differ from each other.

## Example Structures (for inspiration — you are not limited to this list)
${exampleStructures}

Feel free to name structures not on this list if they better fit a misconception. What matters is that:
1. The assigned structures are diverse across all misconceptions in the session
2. Each misconception's whole_class and split_class structures differ from each other
3. The structure fits the nature of the misconception

## Misconceptions
${misconceptions.map((m, i) => `${i + 1}. "${m.title}" — ${m.description}`).join('\n')}

Return a JSON array with one entry per misconception, in the same order:
[
  { "misconceptionTitle": "...", "whole_class": "structure name", "split_class": "structure name" },
  ...
]

Return only the JSON array, no explanation.`;

    try {
      const completion = await openai.chat.completions.create({
        model: PLANNER_MODEL,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are an instructional design planner. Return only valid JSON.' },
          { role: 'user', content: planPrompt },
        ],
      });
      const raw = completion.choices[0]?.message?.content ?? '{}';
      const parsed = JSON.parse(raw);
      // Handle both { assignments: [...] } and bare array responses
      const assignments = Array.isArray(parsed) ? parsed : (parsed.assignments ?? parsed[Object.keys(parsed)[0]] ?? []);
      return JSON.stringify(assignments);
    } catch (err) {
      console.error('[microcoachNextStepOption] planStructures failed:', err?.message);
      return JSON.stringify([]);
    }
  }

  // ── Parse activity-generation inputs ──────────────────────────────────────
  const rawMisconception        = event?.arguments?.input?.misconception        ?? event?.input?.misconception;
  const rawLearningScienceData  = event?.arguments?.input?.learningScienceData  ?? event?.input?.learningScienceData;
  const rawClassroomContext     = event?.arguments?.input?.classroomContext     ?? event?.input?.classroomContext;
  const rawContextData          = event?.arguments?.input?.contextData          ?? event?.input?.contextData;
  const rawExistingActivities   = event?.arguments?.input?.existingActivities   ?? event?.input?.existingActivities;
  const suggestedStructure      = event?.arguments?.input?.suggestedStructure   ?? event?.input?.suggestedStructure ?? null;
  const preferredFormat         = event?.arguments?.input?.preferredFormat      ?? event?.input?.preferredFormat ?? 'whole_class';

  if (rawMisconception == null)       throw new Error('misconception is required');
  if (rawLearningScienceData == null) throw new Error('learningScienceData is required');

  const misconception       = typeof rawMisconception       === 'string' ? JSON.parse(rawMisconception)       : rawMisconception;
  const learningScienceData = typeof rawLearningScienceData === 'string' ? JSON.parse(rawLearningScienceData) : rawLearningScienceData;
  const classroomContext    = typeof rawClassroomContext    === 'string' ? JSON.parse(rawClassroomContext)    : (rawClassroomContext ?? {});
  const contextDataItems    = rawContextData ? (typeof rawContextData === 'string' ? JSON.parse(rawContextData) : rawContextData) : [];
  const existingActivities  = rawExistingActivities ? (typeof rawExistingActivities === 'string' ? JSON.parse(rawExistingActivities) : rawExistingActivities) : [];

  // ── Extract relevant knowledge graph context ───────────────────────────────
  // Find the standard entry matching the misconception's CCSS standard
  const standards = learningScienceData?.standards ?? [];
  const normalize = (s) => s?.replace(/\s/g, '').toLowerCase() ?? '';
  const targetStandard = standards.find(
    (s) => normalize(s.code) === normalize(misconception.ccssStandard)
  );

  const prerequisiteStandards = targetStandard?.prerequisiteStandards ?? [];
  const futureStandards       = targetStandard?.futureDependentStandards ?? [];
  const standardDescription   = targetStandard?.description ?? misconception.description ?? '';
  const lvnFactors            = targetStandard?.lvnFactors ?? [];

  // ── Format knowledge graph section ────────────────────────────────────────
  const knowledgeGraphSection = `
## Knowledge Graph: Learning Context

**Standard Being Taught**: ${misconception.ccssStandard}
${standardDescription ? `**Standard Description**: ${standardDescription}` : ''}

${prerequisiteStandards.length > 0 ? `**Prerequisite Skills** (knowledge students should have but may be missing):
${prerequisiteStandards.map((s) => `  - ${s.code}: ${s.description}`).join('\n')}
The activity should acknowledge or briefly surface these gaps where relevant.` : ''}

${futureStandards.length > 0 ? `**At-Risk Standards** (what students will struggle with later if this misconception persists):
${futureStandards.map((s) => `  - ${s.code}: ${s.description}`).join('\n')}
Framing the importance of this fix in terms of these downstream skills can motivate students.` : ''}
`.trim();

  // ── Format LVN learning science section ───────────────────────────────────
  const lvnSection = lvnFactors.length > 0 ? `
## LVN Learning Science Factors

The following research-backed factors are linked to ${misconception.ccssStandard}. Use them to guide your strategy selection.

${lvnFactors.map(f => `- **${f.name}** (${f.category}): ${f.description}`).join('\n')}

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

  const userContent = `
You are an expert K-12 math instructional coach designing a targeted intervention activity for early-career middle school teachers.

## Writing Style Requirements
Apply these rules to every string you generate:
- **Instructional moves and steps**: ${ws.instructionalMoves ?? 'Short sentences. One action per sentence. Plain conversational language. Active voice.'}
- **Descriptions**: ${ws.descriptions ?? 'Short sentences. Plain language. No run-ons.'}

## RightOn Design Principles
Every activity MUST explicitly follow these principles:

${DESIGN_PRINCIPLES.map((p, i) => `${i + 1}. **${p.split(':')[0]}**: ${p.split(':').slice(1).join(':').trim()}`).join('\n')}

## Activity Structure
Each activity must have a clearly named structure. The following are examples of strong structures — you may use one of these or design a different structure that fits the misconception and format. Whatever structure you choose, it must be meaningfully different from any other activity generated for this misconception:

${ACTIVITY_STRUCTURES.map((s, i) => `${i + 1}. **${s.name}**: ${s.description}`).join('\n')}

You are not limited to this list. If a different structure better fits the misconception, use it and name it clearly.
${suggestedStructure ? `
**Required structure for this activity: "${suggestedStructure}"**
A planning step reviewed all misconceptions in this session and assigned this structure to ensure the session feels varied and pedagogically rich. You MUST use this structure. Do not substitute a more familiar structure simply because it feels easier to generate. Do not default to your preferred template. The only acceptable reason to deviate is if this structure is genuinely impossible to apply to this specific misconception — in that case, use the closest available alternative and explain the reason clearly in aiReasoning.
` : ''}

## Classroom Feasibility
This activity will be used in a live middle school classroom by an early-career teacher. It must:
${CLASSROOM_FEASIBILITY.map(r => `- ${r}`).join('\n')}

## UDL-Informed Instruction
Provide multiple entry points for participation:
${UDL_REQUIREMENTS.map(r => `- ${r}`).join('\n')}

## Distinctness Requirement
${DISTINCTNESS_RULES.map((r, i) => `${i + 1}. ${r}`).join('\n')}
${existingActivities.length > 0 ? `
## Already Generated for This Misconception — You Must Be Genuinely Different
An activity has already been generated for this misconception. Read it carefully. Your job is to design something a teacher would experience as a fundamentally different instructional move — not a variation of the same idea.

${existingActivities.map((a, i) => `### Existing Activity ${i + 1}: "${a.title}"
- **Format**: ${a.format ?? 'unspecified'}
- **Structure**: ${a.activityStructure ?? 'unspecified'}
- **Strategy Tag**: ${a.strategyTag ?? 'unspecified'}
- **What it targets**: ${a.targets ?? 'unspecified'}
- **What the teacher does**: ${a.instructionalMove ?? 'unspecified'}
- **Summary**: ${a.summary ?? 'unspecified'}`).join('\n\n')}

Your activity MUST differ meaningfully in at least one of these four dimensions (ideally more):
1. **Instructional approach** — e.g. if the existing activity has students analyze an error, yours should have them do something structurally different: construct a correct path from scratch, compare competing strategies, or predict where errors will occur
2. **Activity structure** — must be a different named structure than any listed above
3. **Strategy tag** — must be a different tag than any listed above
4. **Representation or explanation strategy** — if the existing activity works symbolically, yours might use a visual, verbal, or concrete representation of the same misconception

Also: the title must **not be a rewording** of any title above.

If you cannot generate a genuinely distinct activity for this misconception and format, say so in the aiReasoning field — but still produce your best attempt.
` : ''}
## Math Formatting Requirements
Always use Unicode. Never use LaTeX or caret/underscore ASCII notation. Specific rules:
- Exponents: x² x³ 10⁴ (never x^2 or x^3)
- Subscripts: x₁ x₂ xₙ (never x_1 or x_n)
- Fractions: use / inline (e.g. 1/2, 3/4) or a÷b form — never \\frac
- Multiplication: × (never \\times or *)
- Division: ÷ (never \\div)
- Square root: √x (never \\sqrt or sqrt())
- Inequalities: ≤ ≥ ≠ (never <=, >=, !=)
- Approximately equal: ≈ (never ~= or approx)
- Negative numbers: use Unicode minus − (U+2212), not a hyphen-minus -
- Pi: π (never "pi")
- Angle/theta: ∠ABC, θ (never "angle ABC" or "theta")
- Absolute value: |x| (pipe characters, never abs(x))
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
Grade: ${classroomContext.grade ?? 'unknown'} | Subject: ${classroomContext.subject ?? 'math'} | Class size: ${classroomContext.cohortSize ?? 'unknown'}

---

## Your Task

Generate ONE classroom-ready next step activity that directly addresses the cognitive error above.

${formatInstructions}

The activity MUST:
- Target the **specific** cognitive error pattern identified in the misconception
- Connect to the prerequisite knowledge gaps and downstream standards from the knowledge graph
- Use format: **"${preferredFormat}"** — do not use any other format
- Be completable in <= ${MAX_DURATION} minutes (target: ${DEFAULT_DURATION} minutes)
${DISALLOWED_METHODS.length ? `- NOT use these teaching methods: ${DISALLOWED_METHODS.join(', ')}` : ''}

Requirements for each field:
- **title**: Short, action-oriented title only (e.g. "Keep-Change-Flip Error Analysis"). Do NOT append the format name, a parenthetical, or any other label — just the title.
- **activityStructure**: The named structure you chose (e.g. "Favorite No", "Math Hospital / Diagnose & Repair"). Use one of the example names or your own — must be distinct from any already-generated activity for this misconception.
- **summary**: 1-2 sentences; what the activity is and why it targets this error
- **targets**: The specific skill this activity builds, in plain skill language (not ontology IDs)
- **instructionalMove**: What the teacher concretely does — begin with a verb, 2–4 sentences, must reference the error pattern and name the activity structure being used
- **strategyTag**: Must be exactly one of: ${STRATEGY_TAGS.map(t => `"${t.name}"`).join(', ')}${lvnFactors.length ? '. Use the LVN factors above to select the best fit.' : ''}
- **durationMinutes**: Choose a value within one of these buckets: ${ALLOWED_DURATION_BUCKETS.map(b => b.label).join(', ')}
- **aiReasoning**: Explain specifically WHY this activity structure and format targets this cognitive error
- **tabs.overview.whatStudentsDo**: ${OVERVIEW_BULLETS_MIN}-${OVERVIEW_BULLETS_MAX} bullets. Each bullet: a short bold action label (e.g. "Think", "Discuss", "Compare") + 1-2 sentences. ${ws.overviewBullets ?? ''}
- **tabs.overview.whatYouDo**: ${OVERVIEW_BULLETS_MIN}-${OVERVIEW_BULLETS_MAX} bullets. Each bullet: a short bold action label (e.g. "Present", "Facilitate", "Highlight") + 1-2 sentences. ${ws.overviewBullets ?? ''}
- **tabs.overview.importance**: Why this specific activity addresses this specific misconception
- **tabs.activitySteps**: setup (${SETUP_STEPS_MIN}-${SETUP_STEPS_MAX} steps), concrete math problem, ${ACTIVITY_STEPS_MIN}-${ACTIVITY_STEPS_MAX} core activity steps, ${DISCUSSION_Q_MIN}-${DISCUSSION_Q_MAX} discussion questions that surface and resolve the error
- **tabs.activitySteps.incorrectWorkedExample1**, **incorrectWorkedExample2**, **incorrectWorkedExample3**: Three separate required fields, one incorrect worked example each. Every field must be populated. Each must:
  - Show a complete problem and the full incorrect student work step-by-step (not just the wrong answer)
  - Reflect the specific misconception error pattern (not a random mistake)
  - Use grade-appropriate language for middle school
  - Be self-contained — immediately usable on a board or slide with no additional prep

**Critical rules for incorrect worked examples** (these are the most common failure mode):
${INCORRECT_EXAMPLE_RULES.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}
${INCORRECT_EXAMPLE_FEW_SHOT.length ? `
**Few-shot examples** — study the difference between CORRECT and INCORRECT example design:
${INCORRECT_EXAMPLE_FEW_SHOT.map(ex => `
Misconception: ${ex.misconception}
✓ ${ex.good.label}
  Problem: ${ex.good.problem}
  Incorrect work: ${ex.good.incorrectWork}
✗ ${ex.bad.label}
  Problem: ${ex.bad.problem}
  Incorrect work: ${ex.bad.incorrectWork}
`).join('\n')}` : ''}
- **tabs.materials**: what must be prepared or printed
- **tabs.studentGroupings**: ${GROUPS_MIN}-${GROUPS_MAX} groups differentiated by misconception severity + grouping strategy guidance

Return JSON matching the schema.
`.trim();

  const validateWorkedExamples = async (examples, misconceptionTitle, ccssStandard) => {
    if (!examples?.length) return examples;
    const prompt = `You are a K-12 math accuracy reviewer checking incorrect worked examples for a ${ccssStandard} intervention on "${misconceptionTitle}".

Each example is INTENTIONALLY wrong at exactly one step — the misconception step. Your job is to fix any UNINTENTIONAL arithmetic errors in the surrounding steps while preserving the intentional misconception error.

Rules:
- Do NOT fix or remove the misconception error (the one step that shows the wrong conceptual move)
- DO fix any arithmetic slippage in other steps (wrong multiplication, wrong simplification, wrong sign, wrong intermediate result)
- If an example is already correct (one error only, no arithmetic slippage), return it unchanged
- CRITICAL: For each example, solve the problem correctly to find the true correct answer. Then trace the incorrect path shown in incorrectWork to find the STATED answer (the value the student writes as their solution — not their final conclusion about whether it is right or wrong). If the stated answer matches the correct solution, the example fails — the misconception error is inconsequential. Replace the ENTIRE example (both "problem" and "incorrectWork") with a new problem of the same misconception type where the misconception error causes the student to state a clearly wrong final answer. Note: an error that only appears in a checking/verification step but not in the solve step also fails this test, because the student's stated solution is still correct.
- Return a JSON array with the same length as the input, each item: { "problem": "...", "incorrectWork": "..." }

Examples to review:
${JSON.stringify(examples, null, 2)}`;

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
      if (!Array.isArray(parsed) || parsed.length !== examples.length) return examples;
      return parsed.map((v, i) => ({
        problem:       (typeof v?.problem      === 'string' && v.problem.trim())      ? v.problem      : examples[i].problem,
        incorrectWork: (typeof v?.incorrectWork === 'string' && v.incorrectWork.trim()) ? v.incorrectWork : examples[i].incorrectWork,
      }));
    } catch (err) {
      console.warn('[microcoachNextStepOption] validateWorkedExamples failed:', err?.message);
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
            content: `Review this math problem for a ${ccssStandard} (${misconceptionTitle}) intervention activity.\nProblem: "${problem}"\n${VALIDATOR_PROBLEM_INSTRUCTIONS}`,
          },
        ],
      });
      const raw = completion.choices[0]?.message?.content ?? '{}';
      const result = JSON.parse(raw).problem;
      if (typeof result === 'string' && result.trim()) return result;
      return problem;
    } catch (err) {
      console.warn('[microcoachNextStepOption] validateActivityProblem failed:', err?.message);
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
      response_format: zodResponseFormat(NextStepActivity, 'nextStepActivity'),
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty completion content');

    const structured = NextStepActivity.parse(JSON.parse(raw));

    // Merge named example properties into the array the frontend expects
    const rawSteps = structured.tabs.activitySteps;
    rawSteps.incorrectWorkedExamples = [
      rawSteps.incorrectWorkedExample1,
      rawSteps.incorrectWorkedExample2,
      rawSteps.incorrectWorkedExample3,
    ].filter(Boolean);

    // Validate the central student-facing math problem
    structured.tabs.activitySteps.problem = await validateActivityProblem(
      structured.tabs.activitySteps.problem,
      misconception.title,
      misconception.ccssStandard
    );

    // Validate incorrect worked examples — fix unintentional arithmetic errors
    // while preserving the intentional misconception error in each example
    structured.tabs.activitySteps.incorrectWorkedExamples = await validateWorkedExamples(
      structured.tabs.activitySteps.incorrectWorkedExamples,
      misconception.title,
      misconception.ccssStandard
    );

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
