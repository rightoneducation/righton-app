import { loadSecret } from './util/loadsecrets.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from './util/config.json' assert { type: 'json' };

const rtdConfig = config?.rtd ?? {};
const RUNTIME_MAX_DURATION_MINUTES = rtdConfig.maxDurationMinutes ?? 30;
const RUNTIME_DEFAULT_DURATION_MINUTES = rtdConfig.defaultDurationMinutes ?? 30;
const RUNTIME_SUPPORTED_FORMATS = rtdConfig.supportedFormats ?? ['whole_class', 'small_group'];

// ── Schema ────────────────────────────────────────────────────────────────────
// Generates a single fully-populated RTD Activity for one misconception.
// Called once per misconception, in parallel, after microcoachLLMAnalysis.

const Overview = z.object({
  whatStudentsDo: z.string().optional().describe('What the student does during this activity'),
  whatYouDo: z.string().optional().describe('What the teacher does / facilitates'),
  importance: z.string().optional().describe('Why this activity directly addresses this misconception'),
});

const ActivitySteps = z.object({
  setup: z.array(z.string()).optional().describe('Teacher preparation steps before the activity begins'),
  problem: z.string().optional().describe('The central problem or prompt students work on'),
  coreActivity: z.array(z.string()).optional().describe('Step-by-step activity instructions (4-6 steps)'),
  discussionQuestions: z.array(z.string()).optional().describe('2-3 questions for debrief / whole-class discussion'),
});

const Materials = z.object({
  required: z.array(z.string()).optional().describe('Materials that must be available'),
  optional: z.array(z.string()).optional().describe('Nice-to-have materials'),
});

const StudentGroup = z.object({
  name: z.string().describe('Group label — e.g. "Group A: Needs Concrete Support"'),
  description: z.string().describe('Who belongs in this group and what they focus on'),
});

const StudentGroupings = z.object({
  groups: z.array(StudentGroup).optional().describe('2-3 differentiated groups based on performance'),
  aiRecommendation: z.string().optional().describe('High-level teacher guidance on grouping strategy'),
});

const Tabs = z.object({
  overview: Overview.optional(),
  activitySteps: ActivitySteps.optional(),
  materials: Materials.optional(),
  studentGroupings: StudentGroupings.optional(),
});

const RTDActivity = z.object({
  type: z.literal('RTD'),
  status: z.literal('GENERATED'),
  title: z.string().describe('Short, action-oriented activity title'),
  summary: z.string().describe('1-2 sentence description of the activity'),
  durationMinutes: z
    .number()
    .int()
    .max(RUNTIME_MAX_DURATION_MINUTES)
    .describe('Estimated time in minutes for this RTD activity; must not exceed the configured maximum.'),
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
  const rawClassroomContext    = event?.arguments?.input?.classroomContext     ?? event?.input?.classroomContext;
  const rawContextData         = event?.arguments?.input?.contextData         ?? event?.input?.contextData;

  if (rawMisconception == null)       throw new Error('misconception is required');
  if (rawLearningScienceData == null) throw new Error('learningScienceData is required');

  const misconception    = typeof rawMisconception    === 'string' ? JSON.parse(rawMisconception)    : rawMisconception;
  const classroomContext = typeof rawClassroomContext === 'string' ? JSON.parse(rawClassroomContext) : (rawClassroomContext ?? {});
  const contextDataItems = rawContextData ? (typeof rawContextData === 'string' ? JSON.parse(rawContextData) : rawContextData) : [];

  const apiSecret = await loadSecret(apiSecretName);
  const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
  const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
  if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');

  const openai = new OpenAI({ apiKey });

  // Format RTD_LESSON ContextData records as few-shot examples for the prompt
  const formatRTDExample = (item, index) => {
    const l = item.rtdLesson;
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
    if (l.exitTicket)    lines.push(`Exit Ticket: ${l.exitTicket}`);
    return lines.join('\n');
  };

  const rtdExamplesSection = (() => {
    const formatted = contextDataItems
      .filter((item) => item.type === 'RTD_LESSON' && item.rtdLesson)
      .map(formatRTDExample)
      .filter(Boolean);
    if (!formatted.length) return '';
    return `
## Reference RTD Examples
The following are real RTD lessons used in similar classrooms. Study their structure, \
depth, phase design, and problem choices — your output should match this level of quality and specificity.

${formatted.join('\n\n')}

---
`;
  })();

  const userContent = `
You are an expert K-12 math instructional coach generating a targeted RTD (Re-Teaching and \
Differentiation) intervention activity.
${rtdExamplesSection}
## Misconception to Address
${JSON.stringify(misconception, null, 2)}

## Learning Science Data
The following contains the relevant CCSS standard, learning progressions, prerequisite skills, \
and research-backed components:
${typeof rawLearningScienceData === 'string' ? rawLearningScienceData : JSON.stringify(rawLearningScienceData, null, 2)}

## Classroom Context
${JSON.stringify(classroomContext, null, 2)}

---

## Your Task

Generate ONE fully classroom-ready RTD activity that directly targets the misconception above.

Requirements (aligned to Uncommon RTD guidelines):
- **title**: Short, action-oriented (e.g. "Keep-Change-Flip Error Analysis")
- **summary**: 1-2 sentences describing the activity
- **disallowedTeachingMethods**: ${rtdConfig.disallowedTeachingMethods?.join(', ')} do not use these methods in the activity.
- **durationMinutes**: Must be <= ${RUNTIME_MAX_DURATION_MINUTES} minutes and designed to fit within a ${RUNTIME_DEFAULT_DURATION_MINUTES}-minute intervention block (shorter is fine; never longer).
- **format**: choose one of ${RUNTIME_SUPPORTED_FORMATS.map((f) => `"${f}"`).join(', ')}. Whole-class and small-group formats should be the primary options.
- **aiReasoning**: Explain specifically WHY this activity design addresses this particular misconception — \
  connect the activity mechanics to the cognitive error pattern
- **tabs.overview**: what students do, what the teacher facilitates, why it matters for THIS misconception
- **tabs.activitySteps**:
  - setup: 2-3 teacher prep steps
  - problem: the central math problem or prompt (make it concrete and grade-appropriate)
  - coreActivity: 4-6 sequential steps students follow
  - discussionQuestions: 2-3 questions that surface and resolve the misconception
- **tabs.materials**: what needs to be prepared or printed
- **tabs.studentGroupings**:
  - groups: 2-3 groups differentiated by level of misconception severity (e.g. "needs concrete models" / \
    "ready for abstract practice" / "extension")
  - aiRecommendation: overall grouping strategy guidance for the teacher

Return JSON matching the schema.
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert K-12 math instructional coach. Output exclusively valid JSON.' },
        { role: 'user', content: userContent },
      ],
      response_format: zodResponseFormat(RTDActivity, 'rtdActivity'),
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty completion content');

    const structured = RTDActivity.parse(JSON.parse(raw));
    return JSON.stringify(structured);
  } catch (error) {
    console.error('[microcoachLLMGeneration] Error', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
