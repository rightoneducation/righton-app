import { loadSecret } from './util/loadsecrets.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from './util/config.json' assert { type: 'json' };

/**
 * microcoachv2LLMGenInstrNeed — the Wave 2 intermediate step between diagnosis and
 * activity generation.
 *
 *   misconception + student evidence → INSTRUCTIONAL NEED → template → activity
 *
 * For each prioritized misconception it states what students most need to
 * understand, examine, or do next mathematically — the thinking they need to
 * develop, revise, test, or make visible — not the activity they should complete.
 * The need is an internal reasoning step that will drive template selection; it is
 * not a teacher-facing output. Today it is attached to the pipeline output only so
 * it can be observed in /preview.
 *
 * Input (`event.arguments.input` from AppSync, or `event.input` from a direct
 * invoke), all JSON strings:
 *   misconceptions       the microcoachv2LLMAnalysis `misconceptions[]` — title,
 *                        description, aiReasoning, evidence, example, wrongAnswers
 *                        (with the per-option distractor `text`), studentCount/Percent
 *   context              { subject?, cohortSize?, ccssStandards? }
 *   learningScienceData  { standards: [{ code, description }] } — optional
 *   trace                boolean — echo `_trace` (resolved prompt, model, usage)
 *
 * Output: { ok: true, needs: [{ sourceMisconceptionId, title, instructionalNeed,
 * needKind, evidenceUsed, teacherRole }], rejected }. A need that cannot be matched
 * back to an input misconception (by id, then exact title) is dropped and counted,
 * never guessed at. On failure: { ok: false, error: { message } }.
 */

const nc = config?.genInstrNeed ?? {};
const ws = config?.writingStyle ?? {};
const MODEL         = nc.model ?? 'gpt-5-mini';
const MAX_SENTENCES = nc.maxSentences ?? 3;
const NEED_KINDS    = nc.needKinds ?? [];
const WORKED        = nc.worked ?? null;

// ── Schema ────────────────────────────────────────────────────────────────────

const Need = z.object({
  sourceMisconceptionId: z.string().nullable().describe(
    'Copied exactly from the misconception\'s `sourceMisconceptionId`; null only when the input had none',
  ),
  title: z.string().describe('The misconception title, copied exactly — the fallback join key'),
  instructionalNeed: z.string().describe(
    `At most ${MAX_SENTENCES} sentences. What students most need to understand, examine, or do next mathematically to make progress on this misconception. Describe the thinking to be developed, revised, tested, or made visible — never an activity, format, or template.`,
  ),
  needKind: z.string().describe(
    'Which of the listed kinds of instructional need this most resembles, quoted from the list — or "other" with a short label if none fits',
  ),
  evidenceUsed: z.array(z.string()).describe(
    '1-3 specific facts from the student evidence (a wrong answer and what it captures, a count, an error pattern) that this need is anchored in',
  ),
  teacherRole: z.string().describe(
    'One clause naming the facilitation this need implies — questioning, comparison, discussion, pressing for justification — without naming an activity or template',
  ),
});

const NeedResponse = z.object({
  needs: z.array(Need),
});

// ── Prompt ────────────────────────────────────────────────────────────────────

const parseJson = (raw) => (typeof raw === 'string' ? JSON.parse(raw) : raw);

function formatMisconception(m, i, standardDesc) {
  const lines = [`### Misconception ${i + 1}: ${m.title}`];
  lines.push(`- id: ${m.sourceMisconceptionId ?? '(none — genuinely new)'}`);
  lines.push(`- standard: ${m.ccssStandard ?? 'unknown'}${standardDesc ? ` — ${standardDesc}` : ''}`);
  if (m.description) lines.push(`- description: ${m.description}`);
  if (m.aiReasoning) lines.push(`- reasoning from the data: ${m.aiReasoning}`);
  const reach = m.studentCount != null
    ? `${m.studentCount} students${m.studentPercent != null ? ` (${Math.round(m.studentPercent * 100)}%)` : ''}`
    : (m.frequency ?? 'unknown');
  lines.push(`- reach: ${reach}`);
  if (m.example?.incorrect || m.example?.correct) {
    lines.push(`- representative error: ${m.example.incorrect ?? '?'}   →  correct: ${m.example.correct ?? '?'}`);
  }
  const ev = m.evidence ?? {};
  if (ev.source) lines.push(`- surfaced on: ${ev.source}`);
  if (ev.mostCommonError) lines.push(`- most common error: ${ev.mostCommonError}`);
  if (ev.aiThinkingPattern) lines.push(`- thinking pattern: ${ev.aiThinkingPattern}`);
  if (Array.isArray(ev.sampleStudentWork) && ev.sampleStudentWork.length) {
    lines.push(`- sample student work: ${ev.sampleStudentWork.join(' | ')}`);
  }
  const wrong = (m.wrongAnswers ?? []).filter((w) => w && (w.questionNumber != null || w.letter));
  if (wrong.length) {
    lines.push('- wrong answers attributed to this misconception:');
    for (const w of wrong) {
      lines.push(`    Q${w.questionNumber} ${String(w.letter ?? '').toUpperCase()}${w.text ? ` — ${w.text}` : ''}`);
    }
  }
  return lines.join('\n');
}

function buildPrompt(misconceptions, context, standardsByCode) {
  const kinds = NEED_KINDS.map((k) => `- ${k}`).join('\n');
  const worked = WORKED
    ? `\n## Worked example\nMisconception: ${WORKED.misconception}\nInstructional need: ${WORKED.instructionalNeed}\n`
    : '';
  return `
You are an expert K-12 math instructional coach. For each prioritized misconception below, identify the INSTRUCTIONAL NEED: what students most need to understand, examine, or do next mathematically to make progress.

A misconception does not, by itself, determine the instructional response. The same misconception can call for different next steps depending on what the student evidence reveals about their reasoning, what understanding is missing or unstable, and what would most effectively move them. The misconception names the learning opportunity; the instructional need names the desired next step in student thinking. Do NOT jump to an activity — the need is what an activity will later be chosen to serve.

## Context
- Subject: ${context?.subject ?? 'Math'}
- Class size: ${context?.cohortSize ?? 'unknown'}
- Standards assessed: ${(context?.ccssStandards ?? []).join(', ') || 'unknown'}

## Kinds of instructional need (choose the closest for needKind)
${kinds}
${worked}
## Rules
- State the need as the mathematical thinking students must develop, revise, test, or make visible. Never as a format, routine, template, or lesson structure.
- Anchor it in the specific wrong reasoning the evidence shows — the attributed wrong answers and what they capture, the most common error, the representative example. Name that reasoning; do not restate the misconception title.
- Name the teacher's role in one clause (questioning, comparison, discussion, pressing for justification) without reducing the need to a teacher move.
- ${ws.descriptions ?? 'Concrete and specific. No hedging.'}
- Return one need per misconception, copying \`sourceMisconceptionId\` and \`title\` exactly.

## Misconceptions
${misconceptions.map((m, i) => formatMisconception(m, i, standardsByCode.get(normalizeCode(m.ccssStandard)))).join('\n\n')}

Return JSON only.
`.trim();
}

const normalizeCode = (c) => String(c ?? '').replace(/\s/g, '').toLowerCase();

// ── Validate ──────────────────────────────────────────────────────────────────

// Match each need back to an input misconception — by id first, then exact title.
// A need that matches nothing is dropped and counted; a misconception that gets two
// needs keeps the first.
function validateOutput(structured, misconceptions) {
  const byId = new Map();
  const byTitle = new Map();
  misconceptions.forEach((m) => {
    if (m.sourceMisconceptionId) byId.set(m.sourceMisconceptionId, m);
    byTitle.set(String(m.title ?? '').trim(), m);
  });
  const seen = new Set();
  const rejected = [];
  const needs = [];
  for (const n of structured.needs ?? []) {
    const match = (n.sourceMisconceptionId && byId.get(n.sourceMisconceptionId))
      || byTitle.get(String(n.title ?? '').trim());
    if (!match) { rejected.push({ title: n.title, sourceMisconceptionId: n.sourceMisconceptionId, reason: 'unmatched' }); continue; }
    const key = match.sourceMisconceptionId ?? match.title;
    if (seen.has(key)) { rejected.push({ title: n.title, reason: 'duplicate' }); continue; }
    if (!n.instructionalNeed?.trim()) { rejected.push({ title: n.title, reason: 'emptyNeed' }); continue; }
    seen.add(key);
    needs.push({
      sourceMisconceptionId: match.sourceMisconceptionId ?? null,
      title: match.title,
      instructionalNeed: n.instructionalNeed.trim(),
      needKind: n.needKind,
      evidenceUsed: n.evidenceUsed ?? [],
      teacherRole: n.teacherRole,
    });
  }
  return { needs, rejected };
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
    const context = parseJson(input.context ?? '{}') ?? {};
    const learningScience = parseJson(input.learningScienceData ?? null);
    const standardsByCode = new Map(
      (learningScience?.standards ?? [])
        .filter((s) => s?.code)
        .map((s) => [normalizeCode(s.code), s.description ?? '']),
    );

    const apiSecret = await loadSecret(apiSecretName);
    const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
    const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
    if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');
    const openai = new OpenAI({ apiKey });

    const userContent = buildPrompt(misconceptions, context, standardsByCode);

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
    const { needs, rejected } = validateOutput(structured, misconceptions);

    console.log(`[microcoachv2LLMGenInstrNeed] ${needs.length}/${misconceptions.length} needs, ${rejected.length} rejected`);

    return JSON.stringify({
      ok: true,
      needs,
      rejected,
      ...(wantTrace && {
        _trace: {
          resolvedPrompt: userContent,
          model: MODEL,
          usage: completion.usage ?? null,
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
