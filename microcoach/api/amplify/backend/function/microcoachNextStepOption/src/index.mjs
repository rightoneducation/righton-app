import { loadSecret } from './util/loadsecrets.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from './util/config.json' assert { type: 'json' };

const nso = config?.nextStepOption ?? {};
const ws  = config?.writingStyle ?? {};
const MODEL                  = nso.model ?? 'gpt-4o';
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

// ── Schema ────────────────────────────────────────────────────────────────────
// Generates ONE next step activity option for a single misconception + format.
// Called once per format per misconception in parallel by the seed script.

// Build enum dynamically from config; fall back to string if list is empty
const strategyTagSchema = STRATEGY_TAGS.length >= 2
  ? z.enum(STRATEGY_TAGS.map(t => t.name))
  : z.string();

const Overview = z.object({
  whatStudentsDo: z.string().describe('What the student does during this activity'),
  whatYouDo: z.string().describe('What the teacher does / facilitates'),
  importance: z.string().describe('Why this activity directly addresses this misconception'),
});

const ActivitySteps = z.object({
  setup: z.array(z.string()).describe('Teacher preparation steps before the activity begins'),
  problem: z.string().describe('The central problem or prompt students work on'),
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
  title: z.string().describe('Short, action-oriented activity title'),
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
  format: z.enum(['small_group', 'whole_class', 'individual']),
  aiReasoning: z.string().describe('Why this specific activity design targets this specific misconception'),
  aiGenerated: z.literal(true),
  tabs: Tabs.describe('Full structured activity content'),
});

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const rawMisconception       = event?.arguments?.input?.misconception       ?? event?.input?.misconception;
  const rawLearningScienceData = event?.arguments?.input?.learningScienceData ?? event?.input?.learningScienceData;
  const rawClassroomContext    = event?.arguments?.input?.classroomContext    ?? event?.input?.classroomContext;
  const rawContextData         = event?.arguments?.input?.contextData         ?? event?.input?.contextData;
  const preferredFormat        = event?.arguments?.input?.preferredFormat     ?? event?.input?.preferredFormat ?? 'small_group';

  if (rawMisconception == null)       throw new Error('misconception is required');
  if (rawLearningScienceData == null) throw new Error('learningScienceData is required');

  const misconception       = typeof rawMisconception       === 'string' ? JSON.parse(rawMisconception)       : rawMisconception;
  const learningScienceData = typeof rawLearningScienceData === 'string' ? JSON.parse(rawLearningScienceData) : rawLearningScienceData;
  const classroomContext    = typeof rawClassroomContext    === 'string' ? JSON.parse(rawClassroomContext)    : (rawClassroomContext ?? {});
  const contextDataItems    = rawContextData ? (typeof rawContextData === 'string' ? JSON.parse(rawContextData) : rawContextData) : [];

  const apiSecret = await loadSecret(apiSecretName);
  const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
  const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
  if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');

  const openai = new OpenAI({ apiKey });

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

  const userContent = `
You are an expert K-12 math instructional coach designing a targeted intervention activity.

## Writing Style Requirements
Apply these rules to every string you generate:
- **Instructional moves and steps**: ${ws.instructionalMoves ?? 'Short sentences. One action per sentence. Plain conversational language. Active voice.'}
- **Descriptions**: ${ws.descriptions ?? 'Short sentences. Plain language. No run-ons.'}

## Math Formatting Requirements
Always use Unicode. Never use LaTeX or caret/underscore ASCII notation. Specific rules:
- Exponents: x² x³ 10⁴ (never x^2 or x^3)
- Subscripts: x₁ x₂ xₙ (never x_1 or x_n)
- Fractions: use / inline (e.g. 1/2, 3/4) or a÷b form — never \frac
- Multiplication: × (never \times or *)
- Division: ÷ (never \div)
- Square root: √x (never \sqrt or sqrt())
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

The activity MUST:
- Target the **specific** cognitive error pattern identified in the misconception
- Connect to the prerequisite knowledge gaps and downstream standards from the knowledge graph
- Use format: **"${preferredFormat}"** — do not use any other format
- Be completable in <= ${MAX_DURATION} minutes (target: ${DEFAULT_DURATION} minutes)
${DISALLOWED_METHODS.length ? `- NOT use these teaching methods: ${DISALLOWED_METHODS.join(', ')}` : ''}

Requirements for each field:
- **title**: Short, action-oriented (e.g. "Keep-Change-Flip Error Analysis")
- **summary**: 1-2 sentences; what the activity is and why it targets this error
- **targets**: The specific skill this activity builds, in plain skill language (not ontology IDs)
- **instructionalMove**: What the teacher concretely does to address the misconception — begin with a verb, 2–4 sentences, must reference the error pattern
- **strategyTag**: Must be exactly one of: ${STRATEGY_TAGS.map(t => `"${t.name}"`).join(', ')}${lvnFactors.length ? '. Use the LVN factors above to select the best fit.' : ''}
- **durationMinutes**: Choose a value within one of these buckets: ${ALLOWED_DURATION_BUCKETS.map(b => b.label).join(', ')}
- **aiReasoning**: Explain specifically WHY the activity mechanics address this cognitive error
- **tabs.overview**: what students do, what the teacher facilitates, why it matters for THIS misconception
- **tabs.activitySteps**: setup (${SETUP_STEPS_MIN}-${SETUP_STEPS_MAX} steps), concrete math problem, ${ACTIVITY_STEPS_MIN}-${ACTIVITY_STEPS_MAX} core activity steps, ${DISCUSSION_Q_MIN}-${DISCUSSION_Q_MAX} discussion questions that surface and resolve the error
- **tabs.materials**: what must be prepared or printed
- **tabs.studentGroupings**: ${GROUPS_MIN}-${GROUPS_MAX} groups differentiated by misconception severity + grouping strategy guidance

Return JSON matching the schema.
`.trim();

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
