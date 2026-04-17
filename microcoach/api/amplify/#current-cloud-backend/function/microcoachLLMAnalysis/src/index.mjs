import { loadSecret } from './util/loadsecrets.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from './util/config.json' assert { type: 'json' };

const ac = config?.analysis ?? {};
const vc = ac.validator ?? {};
const ws = config?.writingStyle ?? {};
const MODEL                  = ac.model ?? 'gpt-4o';
const VALIDATOR_MODEL        = vc.model ?? 'o3-mini';
const VALIDATOR_SYSTEM_PROMPT = vc.systemPrompt ?? 'You are a math accuracy reviewer. Output only valid JSON array.';
const VALIDATOR_FIELDS       = vc.fieldsToReview ?? [];
const VALIDATOR_RULES        = vc.rules ?? [];
const KEY_FINDINGS_MIN       = ac.keyFindingsCount?.min ?? 3;
const KEY_FINDINGS_MAX       = ac.keyFindingsCount?.max ?? 5;
const SUCCESS_IND_MIN        = ac.successIndicatorsPerMisconception?.min ?? 2;
const SUCCESS_IND_MAX        = ac.successIndicatorsPerMisconception?.max ?? 4;
const FREQUENCY_MANY_PCT     = ac.frequencyThresholds?.manyPercent ?? 60;
const FREQUENCY_SOME_PCT     = ac.frequencyThresholds?.somePercent ?? 20;
const PREVALENCE_WEIGHT      = ac.misconceptionScoring?.prevalenceWeight ?? 0.40;
const CONCEPTUAL_WEIGHT      = ac.misconceptionScoring?.conceptualSeverityWeight ?? 0.30;
const PREREQ_WEIGHT          = ac.misconceptionScoring?.prerequisiteLeverageWeight ?? 0.15;
const FORWARD_WEIGHT         = ac.misconceptionScoring?.forwardImpactWeight ?? 0.15;
const MIN_PREVALENCE         = ac.coreSelection?.minimumPrevalencePercent ?? 20;
const ALT_CONCEPTUAL         = ac.coreSelection?.alternativeQualifier?.minConceptualSeverity ?? 0.8;
const ALT_FORWARD            = ac.coreSelection?.alternativeQualifier?.minForwardImpact ?? 0.7;
const MAX_MISCONCEPTIONS     = ac.coreSelection?.maxMisconceptions ?? 4;

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
  frequency: z.enum(['many', 'some', 'few']).describe(`"many" if >${FREQUENCY_MANY_PCT}% of class affected, "some" if ${FREQUENCY_SOME_PCT}–${FREQUENCY_MANY_PCT}%, "few" if <${FREQUENCY_SOME_PCT}%`),
  isCore: z.boolean().describe('true for the single highest-priority misconception only; false for all others'),
  occurrence: z.enum(['first', 'recurring']).describe('"recurring" only if this pattern appeared in session history'),
  example: z.object({ incorrect: z.string(), correct: z.string() }).optional().describe('A representative student error: "incorrect" shows a typical wrong expression/answer, "correct" shows the right form. Use LaTeX for all math expressions (e.g. $\\frac{2}{3} \\div \\frac{3}{4}$, $-6x + 12$). Always wrap math in $...$ delimiters.'),
  successIndicators: z.array(z.string()).optional().describe('Observable behaviors showing the student has overcome this misconception'),
  evidence: MisconceptionEvidence.optional(),
  prerequisiteGapCodes: z.array(z.string()).optional().describe("CCSS codes selected from the standard's `prerequisiteStandards` list (earlier-grade topics students must know first). Must be lower grade level than ccssStandard. Only include codes where a gap in that earlier skill would specifically cause this misconception."),
  impactedObjectiveCodes: z.array(z.string()).optional().describe("CCSS codes selected from the standard's `futureDependentStandards` list (later-grade topics that build on this standard). Must be higher grade level than ccssStandard. Only include codes that this specific misconception would specifically threaten."),
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

  const { classroom, currentSession, sessionHistory, ppq, wrongAnswerDist } =
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
    ...(a.confidenceStats != null && { confidenceStats: a.confidenceStats }),
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

## Writing Style Requirements
Apply these rules to every string you generate:
- **Titles**: ${ws.titles ?? 'Short noun phrase. No parentheticals.'}
- **Descriptions**: ${ws.descriptions ?? 'Short sentences. Plain language. No run-ons.'}
- **Success indicators**: ${ws.successIndicators ?? 'Start with action verb. Observable behavior only.'}

## Math Formatting Requirements
Always use LaTeX for mathematical expressions. Never use Unicode math symbols or caret/underscore ASCII notation outside of LaTeX delimiters. Wrap ALL math in LaTeX delimiters:
- Inline math: $...$ (e.g. $\frac{2}{3} \div \frac{3}{4}$, $-6x + 12$, $x^2$)
- Display/block math (standalone equations): $$...$$ on its own line
Specific rules:
- Exponents: $x^2$, $x^3$, $10^4$ (never x², x³ outside delimiters)
- Subscripts: $x_1$, $x_2$, $x_n$ (never x₁, x₂ outside delimiters)
- Fractions: $\frac{a}{b}$ (never a/b or a÷b for fractions)
- Multiplication: $a \times b$ (never × outside delimiters or *)
- Division: $a \div b$ (never ÷ outside delimiters)
- Square root: $\sqrt{x}$ (never √x outside delimiters)
- Inequalities: $\leq$, $\geq$, $\neq$ (never ≤ ≥ ≠ outside delimiters)
- Approximately equal: $\approx$ (never ≈ outside delimiters)
- Negative numbers: $-6$ (standard minus inside delimiters)
- Pi: $\pi$ (never π outside delimiters)
- Angle/theta: $\angle ABC$, $\theta$ (never ∠ABC, θ outside delimiters)
- Absolute value: $|x|$ (inside delimiters)
Plain prose text should remain as normal English — only wrap actual math expressions in delimiters. Example: "Students who multiply $\frac{2}{3}$ by the reciprocal will get $\frac{8}{9}$, but a common error is to get $\frac{4}{9}$."

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

**2. Key Findings** — List ${KEY_FINDINGS_MIN}-${KEY_FINDINGS_MAX} bullet points about what the current session data reveals (lowest-scoring \
questions, patterns in errors, notable student performance).

**3. Trends** — If session history exists, compare to prior sessions: which misconceptions are recurring, \
which have improved, which are newly emerging.

**4. Misconceptions** — Identify ALL significant misconceptions evidenced by the assessment data:
- Ground each misconception in specific question numbers and performance rates
- evidence.source: cite specific question numbers (e.g. "PPQ Q3, Q5")
- successIndicators: ${SUCCESS_IND_MIN}-${SUCCESS_IND_MAX} specific, observable student behaviors that demonstrate mastery

**Core Selection** — Set \`isCore: true\` on the single highest-leverage misconception using this weighted model:

Composite Score = (Prevalence × ${PREVALENCE_WEIGHT}) + (Conceptual Severity × ${CONCEPTUAL_WEIGHT}) + (Prerequisite Leverage × ${PREREQ_WEIGHT}) + (Forward Impact × ${FORWARD_WEIGHT})

Scoring guidance for each dimension (normalize each to 0–1):
- **Prevalence** (${PREVALENCE_WEIGHT * 100}% weight): % of students affected. The most influential factor but not the only one.
- **Conceptual Severity** (${CONCEPTUAL_WEIGHT * 100}% weight): 1.0 = structural conceptual misunderstanding (student has the wrong mental model of the math); 0.6 = mixed conceptual and procedural; 0.3 = procedural slip or execution error only. Conceptual errors should outrank procedural ones even at slightly lower prevalence.
- **Prerequisite Leverage** (${PREREQ_WEIGHT * 100}% weight): Does this misconception reveal a missing foundational skill? Does fixing it unblock multiple downstream standards? Higher if yes.
- **Forward Impact** (${FORWARD_WEIGHT * 100}% weight): Will this error severely interfere with upcoming must-master content or cascade across the next 2–3 standards? Higher if yes.

**Core eligibility**: The top-ranked misconception must meet AT LEAST ONE of:
- Prevalence ≥ ${MIN_PREVALENCE}% of students
- OR: Conceptual Severity ≥ ${ALT_CONCEPTUAL} AND Forward Impact ≥ ${ALT_FORWARD}

**Tiebreakers**: Prefer conceptual over procedural errors; prefer broader downstream impact.

**Filter**: Exclude patterns affecting fewer than ${MIN_PREVALENCE}% of students UNLESS they meet the alternative qualifier above. Exclude patterns that are clearly one-time careless mistakes with no repeatable reasoning error.

## Confidence Signal Interpretation
PPQ confidence ratings (1–5 per student per question) are available when the PPQ assessment includes a \`confidenceStats\` array. Use them as modifiers to the existing scoring dimensions — not as a separate dimension.

Per-question confidence aggregates provided (when present):
- avgConfidenceCorrect: avg confidence of students who answered correctly
- avgConfidenceIncorrect: avg confidence of students who answered incorrectly
- highConfWrongPct: fraction of students with confidence ≥4 who answered wrong

How to apply them:

**Adjusting Conceptual Severity:**
- highConfWrongPct ≥ 0.25 on a question: students believe they understand but have the wrong mental model → strong structural misconception signal → raise conceptualSeverity toward 1.0
- highConfWrongPct < 0.10 with high error rate: students know they don't know → likely procedural/execution gap → conceptualSeverity stays lower (0.3–0.5)

**Adjusting effective Prevalence:**
- Low avgConfidenceCorrect (< 2.5) on a question: correct answers are likely guesses, not mastery. Discount that question's correct rate when estimating true prevalence of the gap.
- This means a 60% correct rate with avgConfidenceCorrect = 2.0 may represent a weaker foundation than a 50% correct rate with avgConfidenceCorrect = 4.2.

**Tiebreakers with confidence:**
When two misconceptions have similar composite scores, prefer the one with higher highConfWrongPct — it represents students who think they are right but aren't, making it both harder to self-correct and more instructionally urgent.

**Secondary misconceptions**: Must exceed the minimum threshold, must be meaningfully distinct from the core (not a minor variant of it), and must represent a separate reasoning error. Set \`isCore: false\` on all secondary misconceptions. Cap total at ${MAX_MISCONCEPTIONS} misconceptions.

- frequency: "many" if >${FREQUENCY_MANY_PCT}% of class affected, "some" if ${FREQUENCY_SOME_PCT}–${FREQUENCY_MANY_PCT}%, "few" if <${FREQUENCY_SOME_PCT}%
- example: provide a concrete, representative student error. "incorrect" is a typical wrong expression or answer students write; "correct" is the right form with minimal annotation (e.g. "−6x + 12" not a full solution). Apply the Math Formatting Requirements above.
- occurrence: "recurring" ONLY if the same pattern appears in session history misconceptions; otherwise "first"
- prerequisiteGapCodes: Look at the standard's 'prerequisiteStandards' list in the learning science data — these are EARLIER-GRADE topics (lower grade level than ccssStandard). Select ONLY codes where a gap in that earlier skill would DIRECTLY cause this specific error pattern. Ask yourself: "Would a student who hasn't mastered this prerequisite make exactly this mistake?" Only include codes that clearly pass this test.
- impactedObjectiveCodes: Look at the standard's 'futureDependentStandards' list in the learning science data — these are LATER-GRADE topics (higher grade level than ccssStandard). Select ONLY codes that this specific misconception would DIRECTLY threaten. Ask yourself: "Would a student carrying this misunderstanding specifically struggle with this future topic?" Only include codes that clearly pass this test.

Return JSON matching the schema.
`.trim();

  // ── Distractor expansion helpers ─────────────────────────────────────────
  const parseQuestionNumbers = (source = '') => {
    const nums = new Set();
    for (const m of source.matchAll(/Q(\d+)/gi)) nums.add(parseInt(m[1], 10));
    return [...nums].sort((a, b) => a - b);
  };

  const enrichMisconception = async (misconception, ppqQuestions = []) => {
    const qNums = parseQuestionNumbers(misconception.evidence?.source ?? '');
    const relevantQs = ppqQuestions.filter((q) => qNums.includes(q.questionNumber));
    const correctLines = relevantQs
      .map((q) => `Q${q.questionNumber}: correct answer = ${q.correctAnswer}`)
      .join('\n');

    // Collect top wrong answers if distribution data is available
    let topAnswers = [];
    if (wrongAnswerDist && qNums.length) {
      const combined = {};
      for (const qn of qNums) {
        for (const [ans, count] of Object.entries(wrongAnswerDist[qn] ?? {})) {
          combined[ans] = (combined[ans] ?? 0) + count;
        }
      }
      topAnswers = Object.entries(combined)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([ans]) => ans);
    }

    const wrongAnswerBlock = topAnswers.length
      ? `Students commonly gave these wrong answers: ${topAnswers.join(', ')}\n\nFor each wrong answer, provide a brief explanation of the likely thinking pattern or conceptual error. The "answer" field must be the actual mathematical value or expression the student wrote (e.g. "8/6", "−2", "multiplied instead of divided") — never a letter like "A" or "B". If the raw value is a letter, infer the likely mathematical expression from the misconception context and correct answer.`
      : `No wrong answer distribution is available. Omit the "wrongAnswerExplanations" array (return []).`;

    const prompt = `You are a math education expert analyzing a student misconception.

Misconception: "${misconception.title}"
${misconception.description ? `Description: ${misconception.description}\n` : ''}
CCSS Standard: ${misconception.ccssStandard ?? 'unknown'}
${correctLines ? `Relevant questions and correct answers:\n${correctLines}` : ''}

## Task 1 — Correct answer solution
Write a worked solution showing how to arrive at the correct answer for this type of problem. Use 2–4 concise steps. Each step should be a plain string. Use LaTeX for all math expressions ($...$ for inline). If multiple question numbers are relevant and they share the same solution path, write one unified solution.

## Task 2 — Wrong answer explanations
${wrongAnswerBlock}

Return a JSON object with exactly these keys:
{
  "correctAnswerSolution": ["step 1 text", "step 2 text", ...],
  "wrongAnswerExplanations": [{ "answer": "...", "explanation": "..." }, ...]
}`;

    try {
      const result = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 900,
        temperature: 0.3,
      });
      const content = result.choices[0]?.message?.content ?? '{}';
      const parsed = JSON.parse(content);
      return {
        wrongAnswerExplanations: Array.isArray(parsed.wrongAnswerExplanations) ? parsed.wrongAnswerExplanations : [],
        correctAnswerSolution: Array.isArray(parsed.correctAnswerSolution) ? parsed.correctAnswerSolution : [],
      };
    } catch (err) {
      console.warn('[microcoachLLMAnalysis] enrichMisconception failed:', err?.message);
      return { wrongAnswerExplanations: [], correctAnswerSolution: [] };
    }
  };

  const validateMathContent = async (misconceptions) => {
    const payload = misconceptions.map((m, i) => ({
      index: i,
      ccssStandard: m.ccssStandard,
      description: m.description,
      exampleIncorrect: m.example?.incorrect,
      exampleCorrect: m.example?.correct,
      mostCommonError: m.evidence?.mostCommonError,
      correctAnswerSolution: m.correctAnswerSolution,
      wrongAnswerExplanations: m.wrongAnswerExplanations,
    }));

    const fieldsBlock = VALIDATOR_FIELDS.length
      ? VALIDATOR_FIELDS.map((f, i) => `${i + 1}. ${f}`).join('\n')
      : '';
    const rulesBlock = VALIDATOR_RULES.length
      ? VALIDATOR_RULES.map((r) => `- ${r}`).join('\n')
      : '';

    const validatorPrompt = [
      'You are a K-12 math accuracy reviewer. You will receive a list of misconception descriptions',
      'and associated mathematical content. Your job is to identify and correct any mathematical errors.',
      '',
      ...(fieldsBlock ? ['For each item, review:', fieldsBlock, ''] : []),
      ...(rulesBlock ? ['Rules:', rulesBlock, ''] : []),
      'Use LaTeX for all mathematical expressions ($...$ for inline, $$...$$ for display). Never use Unicode math symbols or plain ASCII math notation.',
      '',
      'Input:',
      JSON.stringify(payload, null, 2),
    ].join('\n');

    try {
      const completion = await openai.chat.completions.create({
        model: VALIDATOR_MODEL,
        messages: [
          { role: 'system', content: VALIDATOR_SYSTEM_PROMPT },
          { role: 'user', content: validatorPrompt },
        ],
      });
      const raw = completion.choices[0]?.message?.content ?? '[]';
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error('Validator returned non-array');
      return parsed;
    } catch (err) {
      console.warn('[microcoachLLMAnalysis] validateMathContent failed:', err?.message);
      return [];
    }
  };

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are an expert K-12 math instructional coach. Output exclusively valid JSON.' },
        { role: 'user', content: userContent },
      ],
      response_format: zodResponseFormat(AnalysisResponse, 'analysisResponse'),
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty completion content');

    const structured = AnalysisResponse.parse(JSON.parse(raw));

    // Secondary pass: enrich each misconception with solution steps + distractor expansions
    const ppqQs = payload.ppq?.questions ?? [];
    const enrichments = await Promise.all(
      structured.misconceptions.map((m) => enrichMisconception(m, ppqQs))
    );
    structured.misconceptions = structured.misconceptions.map((m, i) => ({
      ...m,
      wrongAnswerExplanations: enrichments[i]?.wrongAnswerExplanations ?? [],
      correctAnswerSolution: enrichments[i]?.correctAnswerSolution ?? [],
    }));

    // Third pass: validate and correct math-critical fields
    const validatedItems = await validateMathContent(structured.misconceptions);
    let correctionCount = 0;
    structured.misconceptions = structured.misconceptions.map((m, i) => {
      const v = validatedItems[i];
      if (!v) return m;
      const corrected = {
        ...m,
        description: v.description ?? m.description,
        example: {
          incorrect: v.exampleIncorrect ?? m.example?.incorrect,
          correct: v.exampleCorrect ?? m.example?.correct,
        },
        evidence: {
          ...m.evidence,
          mostCommonError: v.mostCommonError ?? m.evidence?.mostCommonError,
        },
        correctAnswerSolution: v.correctAnswerSolution ?? m.correctAnswerSolution,
        wrongAnswerExplanations: v.wrongAnswerExplanations ?? m.wrongAnswerExplanations,
      };
      const changed =
        corrected.description !== m.description ||
        corrected.example?.incorrect !== m.example?.incorrect ||
        corrected.example?.correct !== m.example?.correct ||
        corrected.evidence?.mostCommonError !== m.evidence?.mostCommonError;
      if (changed) correctionCount++;
      return corrected;
    });
    if (correctionCount > 0) {
      console.log(`[microcoachLLMAnalysis] validator corrected ${correctionCount} misconception(s)`);
    }

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
