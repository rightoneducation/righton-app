import { loadSecret } from './util/loadsecrets.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from './util/config.json' assert { type: 'json' };

/**
 * microcoachv2LLMGenMisconception — writes the "mistake this option captures" text
 * for each wrong answer option of a PPQ.
 *
 * The pilot documents carried this as a teacher-authored Distractors column, which
 * parsePpqTable read into `answerChoices[].text` and microcoachv2LLMAnalysis renders
 * next to each option. When a source document has no such column this Lambda fills
 * the same field, so Analysis sees identical input either way.
 *
 * Input (`event.arguments.input` from AppSync, or `event.input` from a direct
 * invoke), all JSON strings:
 *   questions  [{ questionNumber, ccssStandard, correctAnswer, classPercentCorrect,
 *                 questionText?, answerChoices: [{ letter, isCorrect, content?,
 *                 studentCount?, attributedTo?: { title, description } }] }]
 *   context    { subject?, ccssStandards? }
 *   trace      boolean — echo `_trace` (resolved prompt, model, usage)
 *
 * Output: { ok: true, questions: [{ questionNumber, options: [{ letter, text,
 * confidence }] }], rejected } — wrong options only. A model reference that does not
 * match an input option is dropped rather than repaired, same posture as IngestPPQ's
 * validateRefs. On failure: { ok: false, error: { message } } so the caller can
 * carry on with bare letters, which Analysis already tolerates.
 */

const gc = config?.genMisconception ?? {};
const ws = config?.writingStyle ?? {};
const MODEL          = gc.model ?? 'gpt-5-mini';
const MAX_WORDS      = gc.maxWordsPerText ?? 25;
const STYLE_EXAMPLES = gc.styleExamples ?? [];

// ── Schema ────────────────────────────────────────────────────────────────────

const OptionText = z.object({
  letter: z.string().describe('The option letter, exactly as given'),
  text: z.string().describe(
    `One sentence, at most ${MAX_WORDS} words, naming the specific procedural or conceptual error a student who chose this option most likely made`,
  ),
  confidence: z.enum(['grounded', 'inferred']).describe(
    '"grounded" when the option content or question text supports the error named; "inferred" when it was derived only from the attributed misconception, the standard, or the response counts',
  ),
});

const QuestionOut = z.object({
  questionNumber: z.number(),
  options: z.array(OptionText).describe('WRONG options only — never the correct answer'),
});

const GenResponse = z.object({
  questions: z.array(QuestionOut),
});

// ── Prompt ────────────────────────────────────────────────────────────────────

const parseJson = (raw) => (typeof raw === 'string' ? JSON.parse(raw) : raw);

function formatQuestion(q) {
  const pct = q.classPercentCorrect != null
    ? `${Math.round(q.classPercentCorrect * 100)}% correct`
    : 'percent correct unknown';
  const header = `### Q${q.questionNumber}  (standard: ${q.ccssStandard || 'unknown'}, correct: ${q.correctAnswer ?? '?'}, ${pct})`;
  const stem = q.questionText ? `Question: ${q.questionText}` : 'Question: (stem not provided)';
  const rows = (q.answerChoices ?? []).map((o) => {
    const letter = String(o.letter ?? '').toUpperCase();
    const parts = [`${letter}.`];
    parts.push(o.content ? o.content : '(option content not provided)');
    if (o.isCorrect) parts.push('[CORRECT ANSWER — do not describe]');
    else {
      if (o.studentCount != null) parts.push(`— ${o.studentCount} student${o.studentCount === 1 ? '' : 's'} chose this`);
      if (o.attributedTo?.title) {
        parts.push(`— attributed at ingest to "${o.attributedTo.title}"${o.attributedTo.description ? `: ${o.attributedTo.description}` : ''}`);
      }
    }
    return `  ${parts.join(' ')}`;
  });
  return `${header}\n${stem}\n${rows.join('\n')}`;
}

function buildPrompt(questions, context) {
  const examples = STYLE_EXAMPLES.map((e) => `- ${e}`).join('\n');
  return `
You are an expert K-12 math instructional coach. For each WRONG answer option below, write the one-line note a teacher would put in a "Distractors" column: the specific mistake a student who chose that option most likely made.

## Context
- Subject: ${context?.subject ?? 'Math'}
- Standards assessed: ${(context?.ccssStandards ?? []).join(', ') || 'unknown'}

## Style
- One sentence, at most ${MAX_WORDS} words. Name the error directly; no preamble like "The student...".
- ${ws.titles ?? 'Plain language. No hedging.'}
- Match the register of these real examples:
${examples}

## Grounding rules
- If the option content or question text is provided, derive the error from it and mark confidence "grounded".
- If only an ingest attribution is provided, derive the error from that misconception's description and mark "inferred". Do NOT copy the misconception title — describe the concrete step that goes wrong on THIS question.
- If neither is provided, still write the most plausible error for a wrong answer on this standard and mark "inferred".
- Never describe the correct answer. Never invent numbers that do not appear in the question or option content.

## Questions
${questions.map(formatQuestion).join('\n\n')}

Return JSON only.
`.trim();
}

// ── Validate ──────────────────────────────────────────────────────────────────

// Keep only (questionNumber, letter) pairs that exist in the input and are wrong
// options. A reference that does not match is dropped and counted, never guessed at.
function validateOutput(structured, questions) {
  const valid = new Map(
    questions.map((q) => [q.questionNumber, new Map((q.answerChoices ?? []).map((o) => [String(o.letter).toUpperCase(), o]))]),
  );
  const rejected = [];
  const out = [];
  for (const q of structured.questions ?? []) {
    const options = valid.get(q.questionNumber);
    if (!options) {
      rejected.push({ questionNumber: q.questionNumber, reason: 'unknownQuestion' });
      continue;
    }
    const kept = [];
    for (const o of q.options ?? []) {
      const letter = String(o.letter ?? '').trim().toUpperCase();
      const option = options.get(letter);
      if (!option) { rejected.push({ questionNumber: q.questionNumber, letter, reason: 'unknownOption' }); continue; }
      if (option.isCorrect) { rejected.push({ questionNumber: q.questionNumber, letter, reason: 'markedCorrect' }); continue; }
      if (!o.text?.trim()) { rejected.push({ questionNumber: q.questionNumber, letter, reason: 'emptyText' }); continue; }
      kept.push({ letter, text: o.text.trim(), confidence: o.confidence });
    }
    out.push({ questionNumber: q.questionNumber, options: kept });
  }
  return { questions: out, rejected };
}

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const input = event?.arguments?.input ?? event?.input ?? {};
  const wantTrace = input.trace === true;

  try {
    const questions = parseJson(input.questions);
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('questions is required and must be a non-empty array');
    }
    const context = parseJson(input.context ?? '{}') ?? {};

    const apiSecret = await loadSecret(apiSecretName);
    const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
    const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
    if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');
    const openai = new OpenAI({ apiKey });

    const userContent = buildPrompt(questions, context);

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are an expert K-12 math instructional coach. Output exclusively valid JSON.' },
        { role: 'user', content: userContent },
      ],
      response_format: zodResponseFormat(GenResponse, 'genMisconception'),
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty completion content');
    const structured = GenResponse.parse(JSON.parse(raw));
    const { questions: validated, rejected } = validateOutput(structured, questions);

    const generated = validated.reduce((n, q) => n + q.options.length, 0);
    console.log(`[microcoachv2LLMGenMisconception] ${generated} option texts for ${validated.length} question(s), ${rejected.length} rejected`);

    return JSON.stringify({
      ok: true,
      questions: validated,
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
    console.error('[microcoachv2LLMGenMisconception] Error', {
      timestamp: new Date().toISOString(),
      message: error?.message,
      stack: error?.stack,
    });
    return JSON.stringify({ ok: false, error: { message: error?.message ?? String(error) } });
  }
};
