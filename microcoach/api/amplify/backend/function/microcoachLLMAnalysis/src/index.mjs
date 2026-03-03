import { loadSecret } from './util/loadsecrets.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

// ── Schema ────────────────────────────────────────────────────────────────────
// Returns identified misconceptions (with evidence + metadata) but NO activities.
// Activities are generated separately by microcoachLLMGeneration, one per misconception.

const MisconceptionEvidence = z.object({
  source: z.string().optional().describe('Which questions surface this — e.g. "PPQ Q3, Q5"'),
  mostCommonError: z.string().optional().describe('The most frequent wrong answer or error pattern'),
  sampleStudentWork: z.array(z.string()).optional().describe('1-3 brief descriptions of example student errors'),
  aiThinkingPattern: z.string().optional().describe('The underlying cognitive pattern driving the error'),
});

const Misconception = z.object({
  ccssStandard: z.string().describe('The CCSS standard this misconception falls under'),
  title: z.string().describe('Short name for the misconception'),
  description: z.string().describe('Full explanation of the misconception and why students hold it'),
  aiReasoning: z.string().optional().describe('How the assessment data supports identifying this misconception'),
  studentCount: z.number().int().optional().describe('Estimated number of students affected'),
  studentPercent: z.number().optional().describe('Estimated proportion of students affected (0–1)'),
  severity: z.enum(['high', 'medium', 'low']).describe('high if >40% affected, medium 20–40%, low <20%'),
  priority: z.enum(['1', '2', '3', '4']).describe('"1" = most urgent to address'),
  occurrence: z.enum(['first', 'recurring']).describe('"recurring" only if this pattern appeared in session history'),
  successIndicators: z.array(z.string()).optional().describe('Observable behaviors showing the student has overcome this misconception'),
  evidence: MisconceptionEvidence.optional(),
  prerequisiteGapCodes: z.array(z.string()).optional().describe("CCSS codes selected from the standard's `prerequisiteStandards` list (earlier-grade topics students must know first). Must be lower grade level than ccssStandard. Only include codes where a gap in that earlier skill would specifically cause this misconception."),
  impactedObjectiveCodes: z.array(z.string()).optional().describe("CCSS codes selected from the standard's `futureDependentStandards` list (later-grade topics that build on this standard). Must be higher grade level than ccssStandard. Only include codes that this specific misconception would specifically threaten."),
  subMisconceptions: z.array(z.object({
    name: z.string(),
    frequency: z.enum(['many', 'some', 'medium', 'few']),
    isCore: z.boolean().optional(),
    description: z.string(),
  })).optional(),
});

const AnalysisResponse = z.object({
  synthesis: z.string().describe('Overall interpretation of the current session connected to learning science'),
  keyFindings: z.array(z.string()).optional().describe('3-5 bullet-point findings from the current session'),
  trends: z.array(z.string()).optional().describe('Longitudinal observations vs. session history — recurring, improving, or newly emerging patterns'),
  misconceptions: z.array(Misconception).describe('Identified misconceptions ordered by priority, grounded in the assessment data'),
});

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const rawClassroomData      = event?.arguments?.input?.classroomData      ?? event?.input?.classroomData;
  const rawLearningScienceData = event?.arguments?.input?.learningScienceData ?? event?.input?.learningScienceData;

  if (rawClassroomData == null)       throw new Error('classroomData is required');
  if (rawLearningScienceData == null) throw new Error('learningScienceData is required');

  const { classroom, currentSession, sessionHistory, ppq } =
    typeof rawClassroomData === 'string' ? JSON.parse(rawClassroomData) : rawClassroomData;

  // ── Trim payload ─────────────────────────────────────────────────────────
  // Strip individual student responses — the LLM works from aggregated
  // question stats (classPercentCorrect per question + answer key).
  // Wrong-answer distributions will be added at upload time in a future pass.
  const trimAssessment = (a) => a ? ({
    assessmentCode: a.assessmentCode,
    type: a.type,
    ccssStandards: a.ccssStandards,
    classPercentCorrect: a.classPercentCorrect,
    questions: a.questions,
  }) : null;

  const trimSession = (s) => s ? ({
    sessionLabel: s.sessionLabel,
    weekNumber: s.weekNumber,
    topic: s.topic,
    ccssStandards: s.ccssStandards,
    assessments: s.assessments?.items?.map(trimAssessment),
    misconceptions: s.misconceptions?.items?.map((m) => ({
      title: m.title,
      ccssStandard: m.ccssStandard,
      severity: m.severity,
      occurrence: m.occurrence,
      studentCount: m.studentCount,
      studentPercent: m.studentPercent,
    })),
  }) : null;

  const payload = {
    classroom: {
      classroomName: classroom?.classroomName,
      grade: classroom?.grade,
      subject: classroom?.subject,
      cohortSize: classroom?.cohortSize,
    },
    currentSession: trimSession(currentSession),
    sessionHistory: Array.isArray(sessionHistory) ? sessionHistory.map(trimSession) : [],
    ppq: trimAssessment(ppq),
  };

  const apiSecret = await loadSecret(apiSecretName);
  const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
  const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
  if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');

  const openai = new OpenAI({ apiKey });

  const userContent = `
You are an expert K-12 math instructional coach analyzing classroom assessment data.

## Learning Science Data
${typeof rawLearningScienceData === 'string' ? rawLearningScienceData : JSON.stringify(rawLearningScienceData, null, 2)}

## Classroom
${JSON.stringify(payload.classroom, null, 2)}

## Current Session (primary focus)
${JSON.stringify(payload.currentSession, null, 2)}

## Current PPQ Assessment
${JSON.stringify(payload.ppq, null, 2)}

## Session History (prior sessions, oldest first)
${payload.sessionHistory.length ? JSON.stringify(payload.sessionHistory, null, 2) : 'No prior sessions.'}

---

## Tasks

**1. Synthesize** — Write a concise analysis of the current session connected to the learning science \
progressions and components above.

**2. Key Findings** — List 3-5 bullet points about what the current session data reveals (lowest-scoring \
questions, patterns in errors, notable student performance).

**3. Trends** — If session history exists, compare to prior sessions: which misconceptions are recurring, \
which have improved, which are newly emerging.

**4. Misconceptions** — Identify ALL significant misconceptions evidenced by the assessment data:
- Ground each misconception in specific question numbers and performance rates
- severity: high if >40% students missed that question pattern, medium 20–40%, low <20%
- occurrence: "recurring" ONLY if the same pattern appears in session history misconceptions; otherwise "first"
- Estimate studentCount and studentPercent from classPercentCorrect values and cohortSize
- evidence.source: cite specific question numbers (e.g. "PPQ Q3, Q5")
- successIndicators: 2-4 specific, observable student behaviors that demonstrate mastery
- Order by priority ("1" = most critical)
- prerequisiteGapCodes: Look at the standard's 'prerequisiteStandards' list in the learning science data — these are EARLIER-GRADE topics (lower grade level than ccssStandard). Select ONLY codes where a gap in that earlier skill would DIRECTLY cause this specific error pattern. Ask yourself: "Would a student who hasn't mastered this prerequisite make exactly this mistake?" Only include codes that clearly pass this test.
- impactedObjectiveCodes: Look at the standard's 'futureDependentStandards' list in the learning science data — these are LATER-GRADE topics (higher grade level than ccssStandard). Select ONLY codes that this specific misconception would DIRECTLY threaten. Ask yourself: "Would a student carrying this misunderstanding specifically struggle with this future topic?" Only include codes that clearly pass this test.

Return JSON matching the schema.
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert K-12 math instructional coach. Output exclusively valid JSON.' },
        { role: 'user', content: userContent },
      ],
      response_format: zodResponseFormat(AnalysisResponse, 'analysisResponse'),
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty completion content');

    const structured = AnalysisResponse.parse(JSON.parse(raw));
    return JSON.stringify(structured);
  } catch (error) {
    console.error('[microcoachLLMAnalysis] Error', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
