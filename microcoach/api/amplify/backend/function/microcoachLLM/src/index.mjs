import { loadSecret } from './util/loadsecrets.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

// ── Schema ────────────────────────────────────────────────────────────────────

const MisconceptionEvidence = z.object({
  source: z.string().optional().describe('Which questions surface this — e.g. "PPQ Q3, Q5"'),
  mostCommonError: z.string().optional().describe('The most frequent wrong answer or error pattern'),
  sampleStudentWork: z.array(z.string()).optional().describe('1-3 brief descriptions of example student errors'),
  aiThinkingPattern: z.string().optional().describe('The underlying cognitive pattern driving the error'),
});

const Overview = z.object({
  whatStudentsDo: z.string().optional().describe('What the student does during this activity'),
  whatYouDo: z.string().optional().describe('What the teacher does / facilitates'),
  importance: z.string().optional().describe('Why this activity addresses the misconception'),
});

const ActivitySteps = z.object({
  setup: z.array(z.string()).optional().describe('Preparation steps before the activity begins'),
  problem: z.string().optional().describe('The central problem or prompt students work on'),
  coreActivity: z.array(z.string()).optional().describe('Step-by-step activity instructions'),
  discussionQuestions: z.array(z.string()).optional().describe('Questions for debrief / whole-class discussion'),
});

const Materials = z.object({
  required: z.array(z.string()).optional().describe('Materials that must be available'),
  optional: z.array(z.string()).optional().describe('Nice-to-have materials'),
});

const StudentGroup = z.object({
  name: z.string().describe('Group label — e.g. "Group A: Needs Support"'),
  description: z.string().describe('Who is in this group and what they work on'),
});

const StudentGroupings = z.object({
  groups: z.array(StudentGroup).optional().describe('Differentiated grouping recommendations'),
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
  summary: z.string().optional().describe('1-2 sentence description of the activity'),
  durationMinutes: z.number().int().optional().describe('Estimated time in minutes'),
  format: z.enum(['small_group', 'whole_class', 'individual']).optional(),
  aiReasoning: z.string().optional().describe('Why this specific activity was chosen for this misconception'),
  aiGenerated: z.literal(true),
  tabs: Tabs.optional().describe('Full structured activity content'),
});

const Misconception = z.object({
  ccssStandard: z.string().describe('The CCSS standard this misconception falls under'),
  title: z.string().describe('Short name for the misconception'),
  description: z.string().describe('Full explanation of the misconception and why students hold it'),
  aiReasoning: z.string().optional().describe('How the data supports identifying this misconception'),
  studentCount: z.number().int().optional().describe('Estimated number of students affected'),
  studentPercent: z.number().optional().describe('Estimated percentage of students affected (0–1)'),
  severity: z.enum(['high', 'medium', 'low']),
  priority: z.enum(['1', '2', '3', '4']).describe('Rank order — "1" is highest priority to address'),
  occurrence: z.enum(['first', 'recurring']).describe('"recurring" if this misconception appeared in prior sessions'),
  successIndicators: z.array(z.string()).optional().describe('Observable behaviors that show the student has overcome this misconception'),
  evidence: MisconceptionEvidence.optional(),
  activity: RTDActivity.describe('The RTD intervention activity generated for this misconception'),
});

const StructuredResponse = z.object({
  synthesis: z.string().describe('Overall analysis of the current session in light of learning science'),
  keyFindings: z.array(z.string()).optional().describe('Bullet-point findings from the current session'),
  trends: z.array(z.string()).optional().describe('Longitudinal observations vs. session history'),
  misconceptions: z.array(Misconception).describe('Identified misconceptions with generated RTD activities, ordered by priority'),
});

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const rawClassroomData   = event?.arguments?.input?.classroomData   ?? event?.input?.classroomData;
  const rawLearningScienceData = event?.arguments?.input?.learningScienceData ?? event?.input?.learningScienceData;

  if (rawClassroomData == null)      throw new Error('classroomData is required');
  if (rawLearningScienceData == null) throw new Error('learningScienceData is required');

  const parsedClassroomData = typeof rawClassroomData === 'string'
    ? JSON.parse(rawClassroomData)
    : rawClassroomData;

  const { classroom, currentSession, sessionHistory, ppq } = parsedClassroomData ?? {};

  // ── Aggregate student responses per question ──────────────────────────────
  // Rather than sending raw per-student rows (token-heavy) or stripping the
  // data entirely (loses nuance), we compute a wrong-answer distribution per
  // question. This tells the LLM exactly which misconceptions are affecting
  // the most students while keeping the payload small.
  //
  // Output shape per question:
  // {
  //   questionNumber, correctAnswer, classPercentCorrect,
  //   totalResponses, correctCount,
  //   wrongAnswerDistribution: [{ answer, count, percent }]  // sorted desc
  // }
  const aggregateResponses = (assessment) => {
    if (!assessment) return null;
    const questions = assessment.questions ?? [];
    const responses = assessment.studentResponses?.items ?? [];

    const questionStats = questions.map((q) => {
      const answerCounts = {};
      let total = 0;

      for (const sr of responses) {
        const qr = sr.questionResponses?.find?.((r) => r.questionNumber === q.questionNumber);
        if (!qr?.response) continue;
        answerCounts[qr.response] = (answerCounts[qr.response] ?? 0) + 1;
        total++;
      }

      const correctCount = answerCounts[q.correctAnswer] ?? 0;
      const wrongDist = Object.entries(answerCounts)
        .filter(([ans]) => ans !== q.correctAnswer)
        .map(([ans, count]) => ({
          answer: ans,
          count,
          percent: total > 0 ? Math.round((count / total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);

      return {
        questionNumber: q.questionNumber,
        correctAnswer: q.correctAnswer,
        ccssStandard: q.ccssStandard,
        classPercentCorrect: q.classPercentCorrect,
        totalResponses: total,
        correctCount,
        wrongAnswerDistribution: wrongDist,
      };
    });

    return {
      assessmentCode: assessment.assessmentCode,
      type: assessment.type,
      ccssStandards: assessment.ccssStandards,
      classPercentCorrect: assessment.classPercentCorrect,
      questionAnalysis: questionStats,
    };
  };

  const trimSession = (session) => {
    if (!session) return session;
    const assessmentItems = session.assessments?.items ?? [];
    return {
      sessionLabel: session.sessionLabel,
      weekNumber: session.weekNumber,
      topic: session.topic,
      ccssStandards: session.ccssStandards,
      status: session.status,
      assessments: assessmentItems.map(aggregateResponses),
      misconceptions: session.misconceptions?.items?.map((m) => ({
        title: m.title,
        ccssStandard: m.ccssStandard,
        severity: m.severity,
        occurrence: m.occurrence,
        studentCount: m.studentCount,
        studentPercent: m.studentPercent,
      })),
    };
  };

  const trimmedClassroom = {
    classroomName: classroom?.classroomName,
    grade: classroom?.grade,
    subject: classroom?.subject,
    state: classroom?.state,
    cohortSize: classroom?.cohortSize,
  };

  const trimmedCurrentSession = trimSession(currentSession);
  const trimmedHistory = Array.isArray(sessionHistory)
    ? sessionHistory.map(trimSession)
    : [];
  const trimmedPpq = ppq ? aggregateResponses(ppq) : null;

  const apiSecret = await loadSecret(apiSecretName);
  const secretPayload = JSON.parse(apiSecret);
  const apiKey = secretPayload.openai_api ?? secretPayload.OPENAI_API_KEY ?? secretPayload.API;
  if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');

  const openai = new OpenAI({ apiKey });

  const systemContent = `You are an expert K-12 math instructional coach and curriculum specialist. \
You analyze classroom assessment data to identify student misconceptions and generate targeted RTD \
(Re-Teaching and Differentiation) intervention activities. You output exclusively valid JSON.`;

  const userContent = `
## Learning Science Data
The following contains CCSS standards information, learning progressions, prerequisite skills, and \
research-backed learning components relevant to the standard being assessed:
${typeof rawLearningScienceData === 'string' ? rawLearningScienceData : JSON.stringify(rawLearningScienceData, null, 2)}

## Classroom
${JSON.stringify(trimmedClassroom, null, 2)}

## Current Session (most recent — primary focus)
${JSON.stringify(trimmedCurrentSession ?? {}, null, 2)}

## Current PPQ Assessment
${JSON.stringify(trimmedPpq ?? {}, null, 2)}

## Session History (prior sessions, oldest first)
${trimmedHistory.length ? JSON.stringify(trimmedHistory, null, 2) : 'No prior sessions.'}

---

## Your Tasks

### 1. Synthesize
Write a concise overall synthesis of what is happening in the classroom right now — connect student \
performance patterns to the standards progressions and learning science components above.

### 2. Key Findings
List 3-5 bullet-point findings from the current session (e.g. which questions had the lowest success \
rate, what patterns appear in wrong answer distributions).

### 3. Trends (if history is available)
Compare the current session to prior sessions. Note which misconceptions are recurring, which have \
improved, and which are newly emerging.

### 4. Misconceptions — identify ALL significant misconceptions from the data
For each misconception:
- Base it on concrete evidence from the PPQ question data (wrong answer distributions, classPercentCorrect per question)
- Assign severity (high if >40% students affected, medium 20-40%, low <20%)
- Assign occurrence: "recurring" ONLY if the same misconception title/pattern appears in sessionHistory; otherwise "first"
- Estimate studentCount and studentPercent from classPercentCorrect data
- Populate evidence.source with the specific question numbers (e.g. "PPQ Q3, Q5")
- List 2-4 successIndicators: specific, observable student behaviors that demonstrate mastery
- Order by priority ("1" = most urgent)

### 5. RTD Activity — generate one per misconception
Each activity must be fully populated with:
- A concrete, classroom-ready title and summary
- durationMinutes (typically 15-25 min for small group RTD)
- format: prefer "small_group" for targeted misconceptions
- tabs.overview: what students do, what the teacher does, why it matters
- tabs.activitySteps: setup steps, the central problem, 4-6 core activity steps, 2-3 discussion questions
- tabs.materials: what the teacher needs to prepare
- tabs.studentGroupings: recommended groupings based on performance data (reference student tiers if available), and a high-level grouping recommendation
- aiReasoning: why this specific activity design addresses this specific misconception

Return all of this as structured JSON matching the schema.
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: userContent },
      ],
      response_format: zodResponseFormat(StructuredResponse, 'structuredResponse'),
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty completion content');

    const parsed = JSON.parse(raw);
    const structured = StructuredResponse.parse(parsed);

    return JSON.stringify(structured);
  } catch (error) {
    console.error('[microcoachLLM] Error', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
