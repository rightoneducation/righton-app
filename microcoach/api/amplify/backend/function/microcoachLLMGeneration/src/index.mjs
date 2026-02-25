import { loadSecret } from './util/loadsecrets.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

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
  durationMinutes: z.number().int().describe('Estimated time in minutes (typically 15-25 for small group RTD)'),
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

  if (rawMisconception == null)       throw new Error('misconception is required');
  if (rawLearningScienceData == null) throw new Error('learningScienceData is required');

  const misconception    = typeof rawMisconception    === 'string' ? JSON.parse(rawMisconception)    : rawMisconception;
  const classroomContext = typeof rawClassroomContext === 'string' ? JSON.parse(rawClassroomContext) : (rawClassroomContext ?? {});

  const apiSecret = await loadSecret(apiSecretName);
  const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
  const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
  if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');

  const openai = new OpenAI({ apiKey });

  const userContent = `
You are an expert K-12 math instructional coach generating a targeted RTD (Re-Teaching and \
Differentiation) intervention activity.

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

Requirements:
- **title**: Short, action-oriented (e.g. "Keep-Change-Flip Error Analysis")
- **summary**: 1-2 sentences describing the activity
- **durationMinutes**: 15-25 minutes for small group; up to 40 for whole class
- **format**: prefer "small_group" for targeted misconceptions unless the evidence shows it's class-wide (>60%)
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
