/**
 * microcoachv2LLMGenInstrNeed — the instructional need for each misconception.
 *
 * Misconceptions arrive from microcoachv2LLMGenMisconception, already scored and
 * ranked by microcoachv2ScoresCalc on the Wave 2 Misconception Rubric; this Lambda
 * does not identify, reword or rank them. For each one it states the INSTRUCTIONAL
 * NEED — what students most need to understand, examine, or do next mathematically:
 * the thinking they need to develop, revise, test, or make visible, not the activity
 * they should complete — and the RATIONALE for that need, built from the classroom
 * evidence. The need is an internal reasoning step that drives template selection;
 * it is not teacher-facing. (Wave 2 doc §3b "Identify the Instructional Need" —
 * canonical text in microcoachv2ScoresCalc/src/activityRubric.json.)
 *
 * Prevalence, confidence, rank and Conceptual Depth are givens from the caller and
 * the rubric stage; the model is told not to estimate or re-derive them.
 *
 * Input (`event.arguments.input` from AppSync, or `event.input` from a direct
 * invoke), all JSON strings:
 *   misconceptions       [{ title, description, learningScienceConnection,
 *                           wrongAnswers: [{ questionNumber, letter }],
 *                           ccssStandard?, studentCount?, studentPercent?, meanConfidence?,
 *                           priorityRank?, isRecommendedFocus?, rubric? }]
 *   classroomData        { classroom, currentSession, sessionHistory, ppq, wrongAnswerDist }
 *   learningScienceData  { standards: KgQueryType[] } — masked/deduped by the caller
 *   trace                boolean — echo `_trace` (resolved prompt, model, usage)
 *
 * Output: { ok: true, needs: [{ title, wrongAnswers, instructionalNeed: { text,
 * teacherRole, evidenceUsed }, rationale: { priorityRank, prevalence,
 * confidenceSignal, prerequisiteGaps, forwardImpact, recurrence, whyThisNeed } }],
 * rejected, missing } — one per input misconception, matched by position then exact
 * title; an unmatched need is dropped and counted. `priorityRank` is echoed from the
 * input, never produced here. On failure: { ok: false, error: { message } }.
 */

import { loadSecret } from './util/loadsecrets.mjs';
import { formatLearningScience } from './util/formatLearningScience.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from './util/config.json' assert { type: 'json' };

const nc = config?.genInstrNeed ?? {};
const ws = config?.writingStyle ?? {};

const MODEL              = nc.model ?? 'gpt-5-mini';
const NEED_MAX_SENTENCES = nc.maxSentences ?? 3;
const NEED_WORKED        = nc.worked ?? null;

// ── Schema ────────────────────────────────────────────────────────────────────

const Rationale = z.object({
  prevalence: z.string().describe(
    'The given studentCount/studentPercent restated, plus what the linked questions\' correct rates add. Do NOT estimate prevalence — it is given.',
  ),
  confidenceSignal: z.string().describe(
    'What the given mean confidence of affected students and the per-question confidenceStats say about whether students hold a wrong model confidently or know they are unsure. "No confidence data" when neither is present.',
  ),
  prerequisiteGaps: z.array(z.string()).describe(
    'CCSS codes from the standard\'s prerequisiteStandards list whose absence would DIRECTLY cause this error. Empty if none apply.',
  ),
  forwardImpact: z.array(z.string()).describe(
    'CCSS codes from the standard\'s futureDependentStandards list this error would DIRECTLY threaten. Empty if none apply.',
  ),
  recurrence: z.enum(['first', 'recurring']).describe(
    '"recurring" only if the same error pattern appears in a prior session\'s data; otherwise "first".',
  ),
  whyThisNeed: z.string().describe(
    '2–3 sentences tying the evidence above to the need stated: why THIS thinking is what students must do next, rather than another response to the same misconception.',
  ),
});

const Need = z.object({
  title: z.string().describe('The misconception title, copied exactly — the join key'),
  instructionalNeed: z.object({
    text: z.string().describe(
      `At most ${NEED_MAX_SENTENCES} sentences. The mathematical understanding or connection students must build to make progress on this misconception. State what they need to understand — never what anyone does to get there: no teacher moves, no student tasks, no grouping, no solution strategies, no activity formats.`,
    ),
    teacherRole: z.string().describe(
      'One clause naming the facilitation this need implies — questioning, comparison, discussion, pressing for justification — without naming an activity or template',
    ),
    evidenceUsed: z.array(z.string()).describe(
      '1-3 specific facts from the student evidence (a wrong answer and what it captures, a count, an error pattern) that this need is anchored in',
    ),
  }),
  rationale: Rationale,
});

const NeedResponse = z.object({
  needs: z.array(Need).describe('One per misconception given, in the same order'),
});

// ── Prompt ────────────────────────────────────────────────────────────────────

const parseJson = (raw) => (typeof raw === 'string' ? JSON.parse(raw) : raw);
const normalizeCode = (c) => String(c ?? '').replace(/\s/g, '').toLowerCase();

// Strip individual student responses — the model works from aggregated question
// stats (classPercentCorrect per question + answer key + confidenceStats).
const trimAssessment = (a) => a ? ({
  assessmentCode: a.assessmentCode,
  type: a.type,
  ccssStandards: a.ccssStandards,
  classPercentCorrect: a.classPercentCorrect,
  questions: a.questions,
  ...(a.confidenceStats != null && { confidenceStats: a.confidenceStats }),
}) : null;

// Session-level facts only. The session's own misconception rows are deliberately
// not projected: the misconceptions this call reasons about arrive as input.
const trimSession = (s) => s ? ({
  sessionLabel: s.sessionLabel,
  weekNumber: s.weekNumber,
  topic: s.topic,
  ccssStandards: s.ccssStandards,
  assessments: s.assessments?.items?.map(trimAssessment),
}) : null;

/**
 * Every option on every question, how many students chose it, and — from the input
 * list — which misconception it is linked to. `dist` is
 * `{ [questionNumber]: { [answer]: studentCount } }`.
 */
function formatAnswerOptions(questions, dist, misconceptions) {
  if (!Array.isArray(questions) || !questions.length) {
    return 'No question data available for this assessment.';
  }
  const linked = new Map();
  for (const m of misconceptions) {
    for (const w of m.wrongAnswers ?? []) {
      const key = `${w.questionNumber}:${String(w.letter).toUpperCase()}`;
      linked.set(key, [...(linked.get(key) ?? []), m.title]);
    }
  }
  const countFor = (qNum, letter) => {
    const answers = dist?.[qNum] ?? {};
    // A double-marked response like "BC" counts toward both letters.
    return Object.entries(answers)
      .filter(([ans]) => String(ans).toUpperCase().includes(letter))
      .reduce((n, [, c]) => n + c, 0);
  };
  return [...questions]
    .sort((a, b) => (a.questionNumber ?? 0) - (b.questionNumber ?? 0))
    .map((q) => {
      const pct = q.classPercentCorrect != null
        ? `${Math.round(q.classPercentCorrect * 100)}% correct`
        : 'percent correct unknown';
      const header = `Q${q.questionNumber} (correct: ${q.correctAnswer || '?'}, ${pct})`;
      if (!Array.isArray(q.answerChoices) || !q.answerChoices.length) {
        const answers = dist?.[q.questionNumber] ?? {};
        const chosen = Object.entries(answers)
          .sort((a, b) => b[1] - a[1])
          .map(([ans, n]) => `${ans} — ${n} student${n === 1 ? '' : 's'}`)
          .join('; ');
        return `${header}\n  wrong answers chosen: ${chosen || 'none recorded'}`;
      }
      const rows = q.answerChoices.map((opt) => {
        const letter = String(opt.letter).toUpperCase();
        if (opt.isCorrect) return `  ${letter}.  [correct answer]`;
        const n = countFor(q.questionNumber, letter);
        const who = linked.get(`${q.questionNumber}:${letter}`);
        return `  ${letter}.  — ${n} student${n === 1 ? '' : 's'}${who ? `  → ${who.map((t) => `"${t}"`).join(', ')}` : ''}`;
      });
      return `${header}\n${rows.join('\n')}`;
    })
    .join('\n\n');
}

function formatMisconception(m, i, standardsByCode) {
  const lines = [`### Misconception ${i + 1}: ${m.title}`];
  const std = m.ccssStandard ? standardsByCode.get(normalizeCode(m.ccssStandard)) : null;
  lines.push(`- standard: ${m.ccssStandard ?? 'unknown'}${std ? ` — ${std}` : ''}`);
  if (m.description) lines.push(`- error: ${m.description}`);
  if (m.learningScienceConnection) lines.push(`- learning science connection: ${m.learningScienceConnection}`);
  const reach = m.studentCount != null
    ? `${m.studentCount} students${m.studentPercent != null ? ` (${Math.round(m.studentPercent * 100)}%)` : ''} — counted from the response rows`
    : 'not counted';
  lines.push(`- prevalence (given): ${reach}`);
  if (m.meanConfidence != null) lines.push(`- mean confidence of affected students (given): ${m.meanConfidence} of 5`);
  if (m.priorityRank != null) {
    const depth = m.rubric?.scores?.conceptualDepth;
    lines.push(`- priority (given): #${m.priorityRank}${m.isRecommendedFocus ? ' — Recommended Focus' : ''}${depth != null ? ` · conceptual depth ${depth} of 3` : ''}${m.rubric?.conceptualDepthWhy ? ` (${m.rubric.conceptualDepthWhy})` : ''}`);
  }
  const refs = (m.wrongAnswers ?? []).map((w) => `Q${w.questionNumber}${String(w.letter ?? '').toUpperCase()}`);
  if (refs.length) lines.push(`- linked wrong answers: ${refs.join(', ')}`);
  return lines.join('\n');
}

function buildPrompt(payload, misconceptions, learningScienceSection, standardsByCode) {
  const worked = NEED_WORKED
    ? `\nWorked example:\nMisconception: ${NEED_WORKED.misconception}\nInstructional need: ${NEED_WORKED.instructionalNeed}\n`
    : '';
  return `
You are an expert K-12 math instructional coach. For each misconception below — already identified from the assessment's answer choices, and already scored and ranked — determine the INSTRUCTIONAL NEED and the RATIONALE for it, from the classroom evidence.

A misconception does not, by itself, determine the instructional response. The same misconception can call for different next steps depending on what the student evidence reveals about their reasoning — where it breaks down, why the wrong answer looked reasonable, whether they can test or defend a claim. Do not re-identify, rename, merge or re-rank the misconceptions; reason about the ones given, in the order given.

## Writing Style Requirements
- **Descriptions**: ${ws.descriptions ?? 'Short sentences. Plain language. No run-ons.'}

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
${learningScienceSection}

## Classroom
${JSON.stringify(payload.classroom, null, 2)}

## Current Session
${JSON.stringify(payload.currentSession, null, 2)}

## Current PPQ Assessment
${JSON.stringify(payload.ppq, null, 2)}

## Answer Options and What Students Chose
Every option on every question, how many students chose it, and which misconception it is linked to. Ground the rationale in this table and the PPQ question data above rather than inventing plausible-looking values.

${formatAnswerOptions(payload.ppq?.questions, payload.wrongAnswerDist, misconceptions)}

## Session History (prior sessions, oldest first)
${payload.sessionHistory.length ? JSON.stringify(payload.sessionHistory, null, 2) : 'No prior sessions.'}

## Misconceptions
${misconceptions.map((m, i) => formatMisconception(m, i, standardsByCode)).join('\n\n')}

---

## Your Task

For EACH misconception above, in the same order, produce one entry with:

**1. Instructional need** — what students most need to understand, examine, or do next mathematically to make progress on this misconception.

${worked}
Not the need: "Have students explain why a boundary point is included, then test a convenient point to check the shading."
The need: "Students need to connect the inequality symbol to whether points on the boundary satisfy the inequality."

Rules for the need:
- State it as the mathematical understanding or connection students must build. Never state what anyone DOES to get there — no teacher moves ("have students explain"), no student tasks, no grouping, no solution strategies ("test a convenient point"), no activity formats, routines or templates. Those are decided downstream.
- Phrase it as "Students need to understand / connect / distinguish ...", never "Students should do ..." or "Have students ...".
- Anchor it in the specific wrong reasoning the evidence shows — the linked wrong answers, the error described, the confidence pattern. Name that reasoning; do not restate the misconception title.
- Name the teacher's role in one clause (questioning, comparison, discussion, pressing for justification) without reducing the need to a teacher move.
- evidenceUsed: 1-3 specific facts from the data above that the need rests on.

**2. Rationale** — the analysis that justifies this need. Every field is required.

- prevalence: restate the GIVEN studentCount/studentPercent and what the linked questions' correct rates add. Never estimate prevalence; it was counted from the response rows.
- confidenceSignal: read the given mean confidence of affected students and \`confidenceStats\` for the linked questions when present, and say whether students hold the wrong model confidently or know they are unsure. Say "No confidence data" if neither is present.
- prerequisiteGaps: from the standard's \`prerequisiteStandards\` in the learning science data (EARLIER-grade topics), ONLY the codes where a gap in that skill would DIRECTLY cause this error. Empty if none.
- forwardImpact: from the standard's \`futureDependentStandards\` (LATER-grade topics), ONLY the codes this error would DIRECTLY threaten. Empty if none.
- recurrence: "recurring" only if the same error pattern appears in session history; otherwise "first".
- whyThisNeed: 2–3 sentences tying the evidence to the need — why THIS thinking is what students must do next, rather than another response to the same misconception.

Return JSON matching the schema.
`.trim();
}

// ── Validate ──────────────────────────────────────────────────────────────────

// One need per input misconception, matched by position when the title agrees,
// else by exact title. A need matching nothing is dropped and counted; a
// misconception that gets two keeps the first. `priorityRank` is copied from the
// input misconception — it was set by the rubric stage, not the model.
function validateOutput(structured, misconceptions) {
  const byTitle = new Map(misconceptions.map((m, i) => [String(m.title ?? '').trim(), i]));
  const seen = new Set();
  const rejected = [];
  const matched = [];
  (structured.needs ?? []).forEach((n, pos) => {
    const t = String(n.title ?? '').trim();
    let idx = misconceptions[pos] && String(misconceptions[pos].title ?? '').trim() === t ? pos : byTitle.get(t);
    if (idx == null) { rejected.push({ title: n.title, reason: 'unmatched' }); return; }
    if (seen.has(idx)) { rejected.push({ title: n.title, reason: 'duplicate' }); return; }
    if (!n.instructionalNeed?.text?.trim()) { rejected.push({ title: n.title, reason: 'emptyNeed' }); return; }
    seen.add(idx);
    matched.push({ idx, n });
  });

  const needs = matched.map(({ idx, n }) => {
    const m = misconceptions[idx];
    return {
      title: m.title,
      wrongAnswers: m.wrongAnswers ?? [],
      instructionalNeed: {
        text: n.instructionalNeed.text.trim(),
        teacherRole: n.instructionalNeed.teacherRole,
        evidenceUsed: n.instructionalNeed.evidenceUsed ?? [],
      },
      rationale: {
        ...n.rationale,
        priorityRank: m.priorityRank ?? null,
      },
    };
  });
  // Input misconceptions the model returned nothing for. Distinct from `rejected`
  // (things it returned that could not be used): an omission is silent otherwise.
  const missing = misconceptions
    .map((m, i) => ({ title: m.title, position: i + 1 }))
    .filter((_, i) => !seen.has(i));
  return { needs, rejected, missing };
}

// One log event, readable as a block in CloudWatch.
function formatNeedLog(needs) {
  const lines = [`[microcoachv2LLMGenInstrNeed] ${needs.length} instructional need(s):`];
  [...needs].sort((a, b) => (a.rationale.priorityRank ?? Infinity) - (b.rationale.priorityRank ?? Infinity)).forEach((n) => {
    lines.push(`#${n.rationale.priorityRank ?? '?'} ${n.title}`);
    lines.push(`   need: ${n.instructionalNeed.text}`);
    lines.push(`   teacher: ${n.instructionalNeed.teacherRole}`);
    lines.push(`   prevalence: ${n.rationale.prevalence}`);
    lines.push(`   confidence: ${n.rationale.confidenceSignal}`);
    lines.push(`   prereq gaps: ${n.rationale.prerequisiteGaps.join(', ') || '—'} · forward: ${n.rationale.forwardImpact.join(', ') || '—'} · ${n.rationale.recurrence}`);
    lines.push(`   why: ${n.rationale.whyThisNeed}`);
    lines.push('');
  });
  return lines.join('\n');
}

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const input = event?.arguments?.input ?? event?.input ?? {};
  const wantTrace = input.trace === true;

  try {
    const misconceptions = parseJson(input.misconceptions);
    if (!Array.isArray(misconceptions) || misconceptions.length === 0) {
      throw new Error('misconceptions is required and must be a non-empty array');
    }
    if (input.classroomData == null)       throw new Error('classroomData is required');
    if (input.learningScienceData == null) throw new Error('learningScienceData is required');

    const learningScienceData = parseJson(input.learningScienceData) ?? { standards: [] };
    const learningScienceSection = formatLearningScience(learningScienceData);
    const standardsByCode = new Map(
      (learningScienceData?.standards ?? [])
        .filter((s) => s?.code)
        .map((s) => [normalizeCode(s.code), s.description ?? '']),
    );

    const { classroom, currentSession, sessionHistory, ppq, wrongAnswerDist } = parseJson(input.classroomData);
    const payload = {
      // `grade` is deliberately omitted — it was unvalidated free text that
      // contradicted the standards; the CCSS codes already encode it.
      classroom: {
        classroomName: classroom?.classroomName,
        subject: classroom?.subject,
        cohortSize: classroom?.cohortSize,
      },
      currentSession: trimSession(currentSession),
      sessionHistory: Array.isArray(sessionHistory) ? sessionHistory.map(trimSession) : [],
      ppq: trimAssessment(ppq),
      wrongAnswerDist: wrongAnswerDist ?? {},
    };

    const apiSecret = await loadSecret(apiSecretName);
    const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
    const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
    if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');
    const openai = new OpenAI({ apiKey });

    const userContent = buildPrompt(payload, misconceptions, learningScienceSection, standardsByCode);

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are an expert K-12 math instructional coach. Output exclusively valid JSON.' },
        { role: 'user', content: userContent },
      ],
      response_format: zodResponseFormat(NeedResponse, 'instructionalNeeds'),
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty completion content');
    const structured = NeedResponse.parse(JSON.parse(raw));
    const { needs, rejected, missing } = validateOutput(structured, misconceptions);

    console.log(formatNeedLog(needs));
    console.log(`[microcoachv2LLMGenInstrNeed] ${needs.length}/${misconceptions.length} needs, ${rejected.length} rejected, ${missing.length} missing`);
    if (rejected.length) console.warn('[microcoachv2LLMGenInstrNeed] rejected:', JSON.stringify(rejected));
    if (missing.length) console.warn('[microcoachv2LLMGenInstrNeed] no need returned for:', JSON.stringify(missing));

    return JSON.stringify({
      ok: true,
      needs,
      rejected,
      missing,
      ...(wantTrace && {
        _trace: {
          resolvedPrompt: userContent,
          model: MODEL,
          usage: completion.usage ?? null,
          graphStandardCodes: (learningScienceData?.standards ?? []).map((s) => s.code),
          learningScienceSectionChars: learningScienceSection.length,
          subCalls: [{ label: 'instructional-need', model: MODEL, usage: completion.usage ?? null, fellBack: false }],
        },
      }),
    });
  } catch (error) {
    console.error('[microcoachv2LLMGenInstrNeed] Error', {
      timestamp: new Date().toISOString(),
      message: error?.message,
      stack: error?.stack,
    });
    return JSON.stringify({ ok: false, error: { message: error?.message ?? String(error) } });
  }
};
