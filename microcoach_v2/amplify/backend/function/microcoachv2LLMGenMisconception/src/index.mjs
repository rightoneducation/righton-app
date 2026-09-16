import { loadSecret } from './util/loadsecrets.mjs';
// Copy of microcoachv2LLMGenInstrNeed/src/util/formatLearningScience.mjs — each Lambda
// bundles its own src, so shared util is duplicated the same way loadsecrets.mjs is.
import { formatLearningScience } from './util/formatLearningScience.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from './util/config.json' assert { type: 'json' };

/**
 * microcoachv2LLMGenMisconception — extracts the misconceptions behind a PPQ's wrong
 * answer options from the questions themselves.
 *
 * The pilot documents carried a teacher-authored Distractors column naming the error
 * behind each wrong option; new documents do not, so the mapping between wrong
 * answers and misconceptions has to be generated here. The only inputs are the
 * question stem and option content where the document provides them, plus how many
 * students chose each option.
 *
 * Input (`event.arguments.input` from AppSync, or `event.input` from a direct
 * invoke), all JSON strings:
 *   questions  [{ questionNumber, ccssStandard, correctAnswer, classPercentCorrect,
 *                 questionText?, answerChoices: [{ letter, isCorrect, content?,
 *                 studentCount? }] }]
 *   context              { subject?, ccssStandards? }
 *   learningScienceData  { standards: KgQueryType[] } — the knowledge-graph payload
 *                        for the session's standards, masked by the eval condition
 *   trace                boolean — echo `_trace` (resolved prompt, model, usage)
 *
 * Output: { ok: true, misconceptions: [{ description, title,
 * learningScienceConnection, wrongAnswers: [{ questionNumber, letter }] }], questions: [{ questionNumber, options: [{ letter,
 * text, confidence }] }], rejected } — wrong options only. A model reference that does
 * not match an input option is dropped rather than repaired. The misconception list
 * is also written to the log as one readable block. On failure: { ok: false,
 * error: { message } }.
 */

const gc = config?.genMisconception ?? {};
const ws = config?.writingStyle ?? {};
const MODEL          = gc.model ?? 'gpt-5-mini';
const MAX_WORDS      = gc.maxWordsPerText ?? 25;
const STYLE_EXAMPLES = gc.styleExamples ?? [];

// ── Schema ────────────────────────────────────────────────────────────────────

// Step 1 of the task: the misconception list, each mapped to the wrong options it
// produces. Declared before `questions` so the model commits to the list before
// writing the per-option text derived from it.
const WrongAnswerRef = z.object({
  questionNumber: z.number().describe('The question number exactly as given'),
  letter: z.string().describe('The option letter exactly as given — wrong options only'),
});

// Key order mirrors parts (a)–(d) of the prompt's output instructions.
const MisconceptionOut = z.object({
  description: z.string().describe('(a) The specific conceptual error, tailored to the actual steps required to arrive at it'),
  title: z.string().describe('(b) A precise title focused on the conceptual error itself'),
  learningScienceConnection: z.string().describe('(c) How the error relates to the relevant learning science data'),
  wrongAnswers: z.array(WrongAnswerRef).describe(
    'Every wrong option, across all questions, that a student holding this misconception would choose. An option may appear under more than one misconception.',
  ),
});

const OptionText = z.object({
  letter: z.string().describe('The option letter, exactly as given'),
  text: z.string().describe(
    `One sentence, at most ${MAX_WORDS} words, naming the specific procedural or conceptual error a student who chose this option most likely made`,
  ),
  confidence: z.enum(['grounded', 'inferred']).describe(
    '"grounded" when the option content or question text supports the error named; "inferred" when it was derived only from the standard or the response counts',
  ),
});

const QuestionOut = z.object({
  questionNumber: z.number(),
  options: z.array(OptionText).describe('WRONG options only — never the correct answer'),
});

const GenResponse = z.object({
  misconceptions: z.array(MisconceptionOut).describe('Step 1 — the set of misconceptions surfaced by this quiz'),
  questions: z.array(QuestionOut).describe('Step 2 — the per-option error text, derived from the misconceptions above'),
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
    else if (o.studentCount != null) parts.push(`— ${o.studentCount} student${o.studentCount === 1 ? '' : 's'} chose this`);
    return `  ${parts.join(' ')}`;
  });
  return `${header}\n${stem}\n${rows.join('\n')}`;
}

function buildPrompt(questions, context, learningScienceData) {
  const examples = STYLE_EXAMPLES.map((e) => `- ${e}`).join('\n');
  const learningScienceSection = formatLearningScience(learningScienceData);
  return `
    You are an expert K-12 math instructional coach. You have received a set of multiple choice questions, containing both a correct answer and three wrong answers. The task
    is to analyze these multiple choice questions and identify the set of misconceptions that have been used to arrive at the wrong answers. It is important to note that all questions
    included in this are part of a single quiz activity, so the error that produces the wrong answer will probably be shared across multiple questions. Similarly, it is also important
    to note that some answer may have multiple misconceptions that could produce that wrong answer.

    As such, the first step in the task is to analyze the set of questions and extract all possible misconceptions, mapped to the affected wrong answers. 
    This set of questions is grouped per CCSS. Please integrate the Learning Science data into your analysis when generating the misconceptions. There should be
    some tangible connection to the missteps contained in the wrong answers, and what the CCSS is targeting.

    A misconception is a reasoning pattern, not an answer option.
    - Merge: when two wrong options — on the same question or different questions — are produced by the same reasoning, they are ONE misconception. List both under its wrongAnswers. Do not create a separate misconception for each option.
    - Keep separate: options that share a topic but come from different reasoning. "Forgot to find y" and "substituted into the wrong equation" are two misconceptions even though both are wrong answers to the same problem.
    - Do not merge across questions just because the questions share a standard or a skill. Merge across questions only when the same error would produce the wrong option on each.
    - One option may sit under two misconceptions only when its value is genuinely consistent with two different errors; say which reasoning each is.
    - The misconception's description must name the reasoning in a way that explains every option listed under it. If it cannot, split.

    The final output will be the set of misconceptions that are being surfaced in the classroom. Export only JSON.

    ## Context
    - Subject: ${context?.subject ?? 'Math'}
    - Standards assessed: ${(context?.ccssStandards ?? []).join(', ') || 'unknown'}

    ## Learning Science Data
    ${learningScienceSection}

    ## Style
    - One sentence, at most ${MAX_WORDS} words. Name the error directly; no preamble like "The student...".
    - ${ws.titles ?? 'Plain language. No hedging.'}
    - Match the register of these real examples:
    ${examples}

    ## Grounding rules
    - If the option content or question text is provided, derive the error from it and mark confidence "grounded".
    - If neither is provided, still write the most plausible error for a wrong answer on this standard and mark "inferred".
    - Never describe the correct answer. Never invent numbers that do not appear in the question or option content.

    ## Questions
    ${questions.map(formatQuestion).join('\n\n')}

    ## Output
    Two parts, in this order:
    1. \`misconceptions\` - every misconception surfaced by this quiz
      a. a description of the error, tailored around the actual conceptual steps required to arrive at it. DO NOT fall back on generic errors or arbitrary process issues. 
      b. a precise title focused around the conceptual error itself. Do not provide generalities or arbitrary process issues.
      c. a description of how the error relates to the relevant learning science data. Simply provide the mapped connection you should already have made to generate the misconception. Do not propose a remedy or solution.
      d. \`wrongAnswers\`: the (questionNumber, letter) pairs it produces. Group across questions; an option may sit under more than one misconception.
    2. \`questions\` — for each question, one \`text\` line per WRONG option naming the error a student who chose it most likely made, derived from the misconceptions above.

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

  // Step 1 — misconception refs. Same posture as the per-option check below.
  const misconceptions = [];
  for (const m of structured.misconceptions ?? []) {
    const kept = [];
    for (const w of m.wrongAnswers ?? []) {
      const letter = String(w.letter ?? '').trim().toUpperCase();
      const option = valid.get(w.questionNumber)?.get(letter);
      if (!option) { rejected.push({ misconception: m.title, questionNumber: w.questionNumber, letter, reason: 'unknownRef' }); continue; }
      if (option.isCorrect) { rejected.push({ misconception: m.title, questionNumber: w.questionNumber, letter, reason: 'markedCorrect' }); continue; }
      kept.push({ questionNumber: w.questionNumber, letter });
    }
    if (!kept.length) { rejected.push({ misconception: m.title, reason: 'noValidRefs' }); continue; }
    misconceptions.push({
      description: m.description,
      title: m.title,
      learningScienceConnection: m.learningScienceConnection,
      wrongAnswers: kept,
    });
  }

  // Step 2 — per-option text.
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
  return { misconceptions, questions: out, rejected };
}

// One log event, readable as a block in CloudWatch: every misconception with the
// options it is connected to, before the per-option breakdown.
function formatMisconceptionLog(misconceptions) {
  const lines = [`[microcoachv2LLMGenMisconception] ${misconceptions.length} misconception(s) extracted:`];
  misconceptions.forEach((m, i) => {
    const refs = m.wrongAnswers.map((w) => `Q${w.questionNumber}${w.letter}`).join(', ');
    lines.push(`${i + 1}. ${m.title}`);
    lines.push(`   a. Error: ${m.description}`);
    lines.push(`   b. Title: ${m.title}`);
    lines.push(`   c. Learning science: ${m.learningScienceConnection}`);
    lines.push(`   d. Wrong answers: ${refs}`);
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
    const questions = parseJson(input.questions);
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('questions is required and must be a non-empty array');
    }
    const context = parseJson(input.context ?? '{}') ?? {};
    const learningScienceData = parseJson(input.learningScienceData ?? '{"standards":[]}') ?? { standards: [] };

    const apiSecret = await loadSecret(apiSecretName);
    const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
    const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
    if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');
    const openai = new OpenAI({ apiKey });

    const learningScienceSection = formatLearningScience(learningScienceData);
    const userContent = buildPrompt(questions, context, learningScienceData);

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
    const { misconceptions, questions: validated, rejected } = validateOutput(structured, questions);

    console.log(formatMisconceptionLog(misconceptions));
    const generated = validated.reduce((n, q) => n + q.options.length, 0);
    console.log(`[microcoachv2LLMGenMisconception] ${generated} option texts for ${validated.length} question(s), ${rejected.length} rejected`);
    if (rejected.length) console.warn('[microcoachv2LLMGenMisconception] rejected:', JSON.stringify(rejected));

    return JSON.stringify({
      ok: true,
      misconceptions,
      questions: validated,
      rejected,
      ...(wantTrace && {
        _trace: {
          resolvedPrompt: userContent,
          model: MODEL,
          usage: completion.usage ?? null,
          graphStandardCodes: (learningScienceData?.standards ?? []).map((s) => s.code),
          learningScienceSectionChars: learningScienceSection.length,
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
