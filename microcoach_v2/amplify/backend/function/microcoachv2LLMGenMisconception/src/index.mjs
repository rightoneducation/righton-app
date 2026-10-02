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
export const MODEL   = gc.model ?? 'gpt-5-mini';
const MAX_WORDS      = gc.maxWordsPerText ?? 25;
const STYLE_EXAMPLES = gc.styleExamples ?? [];

// ── Schema ────────────────────────────────────────────────────────────────────

// Step 1 of the task: the misconception list, each mapped to the wrong options it
// produces. Declared before `questions` so the model commits to the list before
// writing the per-option text derived from it.
/**
 * A linked wrong option, with what that option's own value shows.
 *
 * `explanation` exists to make an existing rule checkable. The prompt's merge/split
 * block already ends "The misconception's description must name the reasoning in a
 * way that explains every option listed under it. If it cannot, split." — but with a
 * bare (questionNumber, letter) pair there was nothing to check it against, and the
 * failure it was written to prevent kept happening at the cluster level: a
 * misconception claiming Q3A (0,-5) and Q3C (0,5) as "set one variable to zero"
 * accounts for neither y value, since the system's own answer (5,0) has y = 0.
 *
 * Asked per option, that claim has to be written out twice and stops being available.
 * It stays prose about reasoning rather than a transformation label, because a closed
 * set of transformations ("swapped", "sign flip") would just be procedural
 * descriptions — more of what this is meant to remove.
 */
const WrongAnswerRef = z.object({
  questionNumber: z.number().describe('The question number exactly as given'),
  letter: z.string().describe('The option letter exactly as given — wrong options only'),
  explanation: z.string().describe(
    'What THIS option\'s own value shows about the reasoning. Account for the actual value, not just the letter: name the numbers or features that distinguish it from the correct answer and from the other options. If the misconception does not determine this option\'s value, it is not the explanation for it — leave the option out.',
  ),
});

// Key order mirrors parts (a)–(d) of the prompt's output instructions.
const MisconceptionOut = z.object({
  description: z.string().describe('(a) The specific conceptual error, tailored to the actual steps required to arrive at it'),
  title: z.string().describe('(b) A precise title focused on the conceptual error itself'),
  learningScienceConnection: z.string().describe('(c) The mathematical relationship this error breaks — which idea from the standard, its learning components, or its prerequisites the student is not coordinating. A mathematical claim about this error, never a learning-science category.'),
  evidenceBasis: z.enum(['grounded', 'inferred']).describe(
    '(d) "grounded" when the option content or question text supports this misconception as the explanation for the linked wrong answers; "inferred" when it is the most plausible reading of the response pattern but other explanations fit the same data. Deliberately not called "confidence" — that word already names the students\' 1-5 self-rating and the per-option grounding label.',
  ),
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

/**
 * The response schema depends on the session: `ccssStandard` is an enum over the
 * standards this quiz assesses, so the model cannot answer with a code we did not
 * ask about. With fewer than two codes there is nothing to choose between, so the
 * field is omitted and the caller keeps its own fallback — `z.enum` also needs a
 * non-empty member list, which an empty `ccssStandards` would not give it.
 */
export function buildGenResponse(sessionCodes) {
  const codes = (sessionCodes ?? []).map((c) => String(c ?? '').trim()).filter(Boolean);
  const misconception = codes.length > 1
    ? MisconceptionOut.extend({
      ccssStandard: z.enum(codes).describe(
        '(e) Which of the standards listed under "Standards assessed" this misconception sits under — the standard the LINKED QUESTIONS assess, chosen from that list exactly. Never a code outside it.',
      ),
    })
    : MisconceptionOut;
  return z.object({
    misconceptions: z.array(misconception).describe('Step 1 — the set of misconceptions surfaced by this quiz'),
    questions: z.array(QuestionOut).describe('Step 2 — the per-option error text, derived from the misconceptions above'),
  });
}

// ── Prompt ────────────────────────────────────────────────────────────────────

export const parseJson = (raw) => (typeof raw === 'string' ? JSON.parse(raw) : raw);

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

export function buildPrompt(questions, context, learningScienceData) {
  const examples = STYLE_EXAMPLES.map((e) => `- ${e}`).join('\n');
  const learningScienceSection = formatLearningScience(learningScienceData);
  return `
    You are an expert K-12 math instructional coach. You have received a set of multiple choice questions, containing both a correct answer and three wrong answers. The task
    is to analyze these multiple choice questions and identify the set of misconceptions that have been used to arrive at the wrong answers. It is important to note that all questions
    included in this are part of a single quiz activity, so the error that produces the wrong answer will probably be shared across multiple questions. Similarly, it is also important
    to note that some answer may have multiple misconceptions that could produce that wrong answer.

    As such, the first step in the task is to analyze the set of questions and identify the misconceptions the wrong answers actually support, mapped to the affected wrong answers. Account for what students chose rather than cataloguing everything that could in principle go wrong on this standard. 
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
    - Titles: ${ws.titles ?? 'Plain language. No hedging.'}
    - Descriptions: ${ws.descriptions ?? 'Concrete and specific. No hedging words.'}
    - Match the register of these real examples:
    ${examples}

    ## Grounding rules
    - Infer the most plausible mathematical misconception supported by the response pattern and the question content. Do not assume an incorrect answer corresponds to a single known misconception: a distractor can be reached by more than one route, and the Wave 2 answer key says which option is correct without saying what any distractor represents.
    - When several readings fit the same option, pick the one its value actually supports and say what in the value supports it. If two readings genuinely fit, give two misconceptions — never one that hedges between them. A description offering alternatives ("sets a variable to zero, or another arbitrary value", "substitutes wrongly or omits y") is two misconceptions written as one.
    - Mark \`evidenceBasis\` "grounded" only when the option content or question text supports this misconception as the explanation for the linked wrong answers; "inferred" when it is the most plausible of several explanations that fit the same responses.
    - Account for every wrong option students chose in numbers. Leaving one unclaimed is allowed and is sometimes the only honest answer — it says the option's value is not produced by any misconception identifiable from this evidence — but it is an exception you make deliberately, not a default. Claiming an option on a reading that does not produce its value is worse than leaving it out; silently dropping an option many students chose is also a failure.
    - Never describe the correct answer, and never build a misconception out of a feature the correct answer also has. If the correct answer is (5,0), "set a variable to zero" describes the key, not an error.
    - Never invent numbers that do not appear in the question or option content.

    ## Questions
    ${questions.map(formatQuestion).join('\n\n')}

    ## Output
    Report the misconceptions this evidence supports — as many as it takes to account
    for the wrong options students chose, and no more. There is no target number.
    Do not pad the list with errors you cannot tie to a specific option, and do not
    trim it to the point where options students chose in numbers go unexplained.

    Two parts, in this order:
    1. \`misconceptions\` — the misconceptions this quiz's wrong answers support
      a. a description of the reasoning that produces the specific wrong values students chose. It must determine those values: if the reasoning you describe would not land a student on the options you list, it is not the misconception behind them.
         Good: "Writes the solution components in the wrong order, giving (0,5) where the system yields (5,0)."
         Not: "Sets one variable to zero instead of solving the system." — determines neither y = 5 nor y = -5, so it explains neither option.
      b. a precise title naming that reasoning. A plain noun phrase, no parentheticals, no "or".
         Good: "Swapped solution components"
         Not: "Wrong substitution or omitted y" — two misconceptions in one title.
      c. the mathematical relationship this error breaks: which specific idea from the standard, its learning components, or its prerequisites the student is not coordinating. Name the mathematics, not a learning-science category — never "working memory", "representational fluency", "strategy use", "cognitive load", or a named instructional strategy. Do not propose a remedy or solution.
         Good: "Treats the coefficients as graph features without coordinating them with the algebraic form the inequality must be rewritten into first."
         Not: "Reflects weak strategy use and incomplete conceptual understanding."
      d. \`evidenceBasis\`: "grounded" when the option content or question text supports this reading, "inferred" when it is the most plausible of several explanations that fit the same responses.
      e. \`ccssStandard\`: which of the standards under "Standards assessed" this misconception sits under. Choose the standard the linked questions assess — the mathematics the student was actually doing — not the standard a remediation would target. Use one of the listed codes exactly.
      f. \`wrongAnswers\`: the options it produces, each with its own \`explanation\` of what that option's value shows. Group across questions; an option may sit under more than one misconception only when its value is genuinely consistent with both. If you cannot write the explanation for an option, do not list it.
    2. \`questions\` — for each question, one \`text\` line per WRONG option naming the error a student who chose it most likely made, derived from the misconceptions above.

    Return JSON only.
`.trim();
}

// ── Validate ──────────────────────────────────────────────────────────────────

// Keep only (questionNumber, letter) pairs that exist in the input and are wrong
// options. A reference that does not match is dropped and counted, never guessed at.
// ── Admission checks ──────────────────────────────────────────────────────────

/**
 * Whether a misconception is well-formed enough to go in the list at all.
 *
 * Separate from the rubric on purpose. The rubric scores which misconception the
 * teacher should act on first; it does not ask whether the thing is a properly formed
 * misconception, and it cannot — `conceptualDepth` scored "Set variable to zero
 * unjustified" a 3 of 3 while the true reading of the same two options, the
 * coordinate swap, has never scored above 1. Depth and evidential support are
 * different axes and only one of them is measured.
 *
 * Detection is by surface pattern, so these flag rather than prove, the same posture
 * as seed/eval/scripts/util/checkNeedSeparation.ts. Patterns are grouped and labelled
 * so a false positive can be retired on its own. Off by default: set
 * `genMisconception.enforceAdmission` to true in config.json to drop rather than flag
 * — the channel has never fired in 16 recorded runs, so it earns a report-only pass
 * before it is allowed to remove anything.
 */
const ADMISSION_ENFORCED = gc.enforceAdmission === true;

// Only the title is checked for disjunction. `writingStyle.titles` already forbids
// parentheticals there, and a plain noun phrase naming one error has no reason to
// contain "or" — so false positives are unlikely. Descriptions are left alone except
// for the explicit "(or ...)" form: a description can legitimately join two nouns
// with "or" ("which half-plane satisfies the inequality or system" is output we want
// to keep), and telling that apart from two fused errors needs more than a regex.
// Case-sensitive on lowercase `or`. Upper-case OR is the logical operator and names
// the misconception rather than hedging between two of them — "Treated system as OR"
// and "Used OR instead of AND" are both real titles from past runs, and both are
// output we want. "Incorrect or missing substitution" is the shape being caught.
const DISJUNCTIVE = [
  { label: 'title "or"', field: 'title', re: /\bor\b/ },
  { label: 'title parenthetical', field: 'title', re: /\(/ },
  { label: 'description "(or ...)"', field: 'description', re: /\(\s*or\b/i },
];

// Longer option content is prose that describes the error itself — the graph questions
// render each option as a paragraph — so requiring the explanation to quote it would
// be meaningless. Short content is a bare value, and that is the case where an
// explanation has to name the value to be accounting for anything.
const BARE_VALUE_MAX_CHARS = 24;
const numbersIn = (s) => (String(s).match(/-?\d+(?:\.\d+)?/g) ?? []);
const squash = (s) => String(s).toLowerCase().replace(/\s+/g, '');

/**
 * Does this explanation account for the option's own value?
 *
 * Satisfied by quoting the value, or by naming every number in it. A misconception
 * whose explanation mentions none of the option's numbers is describing something
 * other than the option it claims.
 */
function accountsForValue(explanation, optionContent) {
  const content = String(optionContent ?? '').trim();
  if (!content || content.length > BARE_VALUE_MAX_CHARS) return true;
  const nums = numbersIn(content);
  if (nums.length === 0) return true;
  const exp = squash(explanation);
  if (exp.includes(squash(content))) return true;
  const expNums = new Set(numbersIn(explanation).map(String));
  // Compare on magnitude: an explanation may give a sign in words ("negative five").
  const want = new Set(nums.map((n) => String(Math.abs(Number(n)))));
  const have = new Set([...expNums].map((n) => String(Math.abs(Number(n)))));
  return [...want].every((n) => have.has(n));
}

/** Labelled reasons this misconception is not well formed. Empty means admissible. */
export function checkAdmission(m, optionFor) {
  const hits = [];
  for (const { label, field, re } of DISJUNCTIVE) {
    if (re.test(String(m[field] ?? ''))) hits.push(label);
  }
  for (const w of m.wrongAnswers ?? []) {
    const ref = `Q${w.questionNumber}${String(w.letter ?? '').trim().toUpperCase()}`;
    if (!String(w.explanation ?? '').trim()) { hits.push(`missingExplanation ${ref}`); continue; }
    const option = optionFor(w);
    if (!accountsForValue(w.explanation, option?.content)) hits.push(`unexplainedOption ${ref}`);
  }
  return hits;
}

export function validateOutput(structured, questions) {
  const valid = new Map(
    questions.map((q) => [q.questionNumber, new Map((q.answerChoices ?? []).map((o) => [String(o.letter).toUpperCase(), o]))]),
  );
  const rejected = [];
  // Well-formedness flags, kept separate from `rejected` so that array keeps meaning
  // "dropped". While ADMISSION_ENFORCED is false these are recorded and nothing else.
  const admissionFlags = [];
  const optionFor = (w) => valid.get(w.questionNumber)?.get(String(w.letter ?? '').trim().toUpperCase());

  // Step 1 — misconception refs. Same posture as the per-option check below.
  const misconceptions = [];
  for (const m of structured.misconceptions ?? []) {
    const kept = [];
    for (const w of m.wrongAnswers ?? []) {
      const letter = String(w.letter ?? '').trim().toUpperCase();
      const option = valid.get(w.questionNumber)?.get(letter);
      if (!option) { rejected.push({ misconception: m.title, questionNumber: w.questionNumber, letter, reason: 'unknownRef' }); continue; }
      if (option.isCorrect) { rejected.push({ misconception: m.title, questionNumber: w.questionNumber, letter, reason: 'markedCorrect' }); continue; }
      kept.push({ questionNumber: w.questionNumber, letter, explanation: String(w.explanation ?? '').trim() });
    }
    if (!kept.length) { rejected.push({ misconception: m.title, reason: 'noValidRefs' }); continue; }

    const hits = checkAdmission({ ...m, wrongAnswers: kept }, optionFor);
    if (hits.length) {
      admissionFlags.push({ misconception: m.title, hits });
      if (ADMISSION_ENFORCED) {
        rejected.push({ misconception: m.title, reason: 'notAdmissible', hits });
        continue;
      }
    }

    misconceptions.push({
      description: m.description,
      title: m.title,
      learningScienceConnection: m.learningScienceConnection,
      evidenceBasis: m.evidenceBasis ?? null,
      // Null when the session had fewer than two codes, so the field was not asked
      // for; the caller then keeps whatever it derived itself.
      ccssStandard: m.ccssStandard ?? null,
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
  return { misconceptions, questions: out, rejected, admissionFlags };
}

// One log event, readable as a block in CloudWatch: every misconception with the
// options it is connected to, before the per-option breakdown.
function formatMisconceptionLog(misconceptions) {
  const lines = [`[microcoachv2LLMGenMisconception] ${misconceptions.length} misconception(s) extracted:`];
  misconceptions.forEach((m, i) => {
    lines.push(`${i + 1}. ${m.title}`);
    lines.push(`   a. Error: ${m.description}`);
    lines.push(`   b. Title: ${m.title}`);
    lines.push(`   c. Mathematical connection: ${m.learningScienceConnection}`);
    lines.push(`   d. Evidence basis: ${m.evidenceBasis ?? 'not stated'}`);
    lines.push(`   e. Standard: ${m.ccssStandard ?? 'not stated'}`);
    // One line per option rather than a ref list: the per-option explanation is the
    // thing worth reading when a misconception looks wrong, so it belongs in the log.
    lines.push('   f. Wrong answers:');
    for (const w of m.wrongAnswers) {
      lines.push(`      Q${w.questionNumber}${w.letter}: ${w.explanation ?? '(no explanation)'}`);
    }
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
    const GenResponseForSession = buildGenResponse(context?.ccssStandards);
    const userContent = buildPrompt(questions, context, learningScienceData);

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are an expert K-12 math instructional coach. Output exclusively valid JSON.' },
        { role: 'user', content: userContent },
      ],
      response_format: zodResponseFormat(GenResponseForSession, 'genMisconception'),
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty completion content');
    const structured = GenResponseForSession.parse(JSON.parse(raw));
    const { misconceptions, questions: validated, rejected, admissionFlags } = validateOutput(structured, questions);

    console.log(formatMisconceptionLog(misconceptions));
    const generated = validated.reduce((n, q) => n + q.options.length, 0);
    console.log(`[microcoachv2LLMGenMisconception] ${generated} option texts for ${validated.length} question(s), ${rejected.length} rejected`);
    if (rejected.length) console.warn('[microcoachv2LLMGenMisconception] rejected:', JSON.stringify(rejected));
    // Report-only unless genMisconception.enforceAdmission is set; see ADMISSION_ENFORCED.
    if (admissionFlags.length) {
      console.warn(`[microcoachv2LLMGenMisconception] ${admissionFlags.length} misconception(s) flagged as not well formed`
        + `${ADMISSION_ENFORCED ? ' and dropped' : ' (report-only)'}:`, JSON.stringify(admissionFlags));
    }

    return JSON.stringify({
      ok: true,
      misconceptions,
      questions: validated,
      rejected,
      admissionFlags,
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
