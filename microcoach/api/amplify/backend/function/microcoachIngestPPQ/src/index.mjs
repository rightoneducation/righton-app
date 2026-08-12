import { loadSecret } from './util/loadsecrets.mjs';
import { parsePpqTable, formatOptionTable } from './util/parsePpqTable.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from './util/config.json' assert { type: 'json' };

const ic = config?.ingestPPQ ?? {};
const ws = config?.writingStyle ?? {};
const MODEL                = ic.model ?? 'gpt-4o';
const MAX_MISCONCEPTIONS   = ic.maxMisconceptions ?? 4;
const SUCCESS_IND_MIN      = ic.successIndicatorsPerMisconception?.min ?? 2;
const SUCCESS_IND_MAX      = ic.successIndicatorsPerMisconception?.max ?? 4;
const ACCURACY_INSTRUCTIONS = ic.accuracyInstructions ?? [];

// ── Schema ────────────────────────────────────────────────────────────────────

// One wrong answer choice attributed to a misconception. `docxQuestion` is the
// question number as printed in the document (1,3,5,7,9,11 in the pilot files) —
// NOT the resequenced number the assessment stores. Upload reconciles the two.
const WrongAnswerRef = z.object({
  docxQuestion: z.number().describe('The Q number exactly as printed in the Answer Options table'),
  letter: z.string().describe('The option letter (A, B, C or D) from that question in the Answer Options table'),
});

const Misconception = z.object({
  title: z.string().describe('Short name for the misconception (e.g. "Inverting the Wrong Fraction")'),
  description: z.string().describe('Full explanation of the misconception and why students hold it'),
  ccssStandard: z.string().describe('The CCSS standard this misconception falls under (e.g. "6.NS.A.1")'),
  severity: z.enum(['high', 'medium', 'low']).describe(
    '"high" = structural conceptual misunderstanding; "medium" = mixed conceptual/procedural; "low" = procedural slip'
  ),
  priority: z.enum(['1', '2', '3', '4']).describe(
    '"1" = most common distractor pattern / highest impact; higher numbers = lower priority'
  ),
  occurrence: z.enum(['first', 'recurring']).describe(
    '"recurring" only if the occurrence param passed in is "recurring" and this pattern likely appeared before; otherwise "first"'
  ),
  successIndicators: z.array(z.string()).describe(
    `${SUCCESS_IND_MIN}-${SUCCESS_IND_MAX} specific, observable student behaviors that demonstrate mastery of this concept`
  ),
  wrongAnswers: z.array(WrongAnswerRef).describe(
    'Every wrong answer choice in the Answer Options table that reflects THIS misconception. ' +
    'These are used to count affected students directly from response data, so pick only options ' +
    'you are confident about — a wrong attribution produces a wrong student count.'
  ),
});

const IngestPPQResponse = z.object({
  topic: z.string().describe('The mathematical topic covered by this PPQ (e.g. "Dividing Fractions")'),
  ccssStandards: z.array(z.string()).describe('All CCSS standards addressed by this PPQ'),
  misconceptions: z.array(Misconception).describe(
    `Identified misconceptions ordered by priority (1 = highest). Max ${MAX_MISCONCEPTIONS}. ` +
    'Each must be grounded in a specific distractor pattern from the PPQ questions.'
  ),
});

// ── Link-only helpers ─────────────────────────────────────────────────────────

const MisconceptionLink = z.object({
  id: z.string().describe('The id of the misconception being linked, copied exactly from the list given'),
  wrongAnswers: z.array(WrongAnswerRef).describe(
    'Every wrong answer option in the Answer Options table that a student holding THIS misconception would choose'
  ),
});

const LinkResponse = z.object({
  links: z.array(MisconceptionLink),
});

/**
 * Validate model-supplied option references against the parsed table. Shared by both
 * modes, because a bad reference skews student counts identically either way.
 */
function validateRefs(refs, validOptions, label, rejected) {
  return (refs ?? []).filter((ref) => {
    const q = validOptions.get(ref.docxQuestion);
    const letter = String(ref.letter ?? '').trim().toUpperCase();
    if (!q) {
      rejected.push({ ...ref, reason: 'unknownQuestion', misconception: label });
      return false;
    }
    const option = q.options.find((o) => o.letter === letter);
    if (!option) {
      rejected.push({ ...ref, reason: 'unknownOption', misconception: label });
      return false;
    }
    if (option.isCorrect) {
      rejected.push({ ...ref, reason: 'markedCorrect', misconception: label });
      return false;
    }
    ref.letter = letter;
    return true;
  });
}

async function linkExistingMisconceptions(openai, ppqText, existing) {
  const optionTable = parsePpqTable(ppqText);
  const validOptions = new Map(optionTable.map((q) => [q.docxQuestion, q]));

  const prompt = `You are an expert K-12 math instructional coach.

Below is the answer-option table from a Pre-Post Quiz, and a list of misconceptions that were previously identified from this same quiz.

Your only job is to attribute answer options to misconceptions. Do NOT rewrite, rename, merge or add misconceptions.

## Answer Options
${formatOptionTable(optionTable)}

## Misconceptions
${existing.map((m) => `- id: ${m.id}\n  title: ${m.title}\n  description: ${m.description ?? ''}`).join('\n')}

## Rules
- For each misconception, list every option a student holding it would choose
- Use the question numbers and option letters exactly as printed in the Answer Options table
- Never list the correct answer for a question
- Assign an option to at most one misconception; if two seem to fit, pick the better one
- Some questions repeat the same distractor text across two letters — list whichever genuinely apply
- Omit an option you are unsure of rather than guessing
- Return one entry per misconception, using the id exactly as given. A misconception with no matching option gets an empty list

Return JSON matching the schema.`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: 'You are an expert K-12 math instructional coach. Output exclusively valid JSON.' },
      { role: 'user', content: prompt },
    ],
    response_format: zodResponseFormat(LinkResponse, 'linkResponse'),
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error('Empty completion content');
  const parsed = LinkResponse.parse(JSON.parse(raw));

  const knownIds = new Set(existing.map((m) => m.id));
  const rejected = [];
  let claimed = 0;

  const links = parsed.links
    .filter((l) => {
      if (knownIds.has(l.id)) return true;
      rejected.push({ id: l.id, reason: 'unknownMisconceptionId' });
      return false;
    })
    .map((l) => {
      claimed += (l.wrongAnswers ?? []).length;
      return { id: l.id, wrongAnswers: validateRefs(l.wrongAnswers, validOptions, l.id, rejected) };
    });

  // Every misconception gets an entry, even an empty one. A misconception no option
  // maps to is a real result — it just contributes zero students downstream.
  const byId = new Map(links.map((l) => [l.id, l.wrongAnswers]));
  const complete = existing.map((m) => ({ id: m.id, wrongAnswers: byId.get(m.id) ?? [] }));

  const kept = complete.reduce((n, l) => n + l.wrongAnswers.length, 0);
  console.log(`[microcoachIngestPPQ] linkOnly: ${kept}/${claimed} references valid across ${existing.length} misconceptions`);
  if (rejected.length) console.warn('[microcoachIngestPPQ] rejected:', JSON.stringify(rejected));

  return { links: complete, optionTable, wrongAnswerLinkStats: { claimed, kept, rejected } };
}

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const input = event?.arguments?.input ?? event?.input ?? event;

  const ppqText      = input?.ppqText;
  const classroomKey = input?.classroomKey;
  // `grade` is intentionally not read. It was an unvalidated free-text UI field
  // that could contradict the standards in the document; the CCSS codes extracted
  // from the PPQ itself carry grade already.
  const subject      = input?.subject;
  const state        = input?.state;
  const schoolYear   = input?.schoolYear;
  const cohortSize   = input?.cohortSize;
  const sessionLabel = input?.sessionLabel;
  const weekNumber   = input?.weekNumber;
  const occurrence   = input?.occurrence ?? 'first';

  if (!ppqText)      throw new Error('ppqText is required');
  if (!classroomKey) throw new Error('classroomKey is required');

  const apiSecret = await loadSecret(apiSecretName);
  const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
  const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
  if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');

  const openai = new OpenAI({ apiKey });

  // ── Link-only mode ────────────────────────────────────────────────────────
  // Attributes answer options to misconceptions that ALREADY exist, without
  // re-extracting them. Used to backfill archived sessions: a full re-ingest would
  // mint new misconceptions with new ids and titles, discarding the very records
  // the archive was captured from.
  if (Array.isArray(input?.existingMisconceptions)) {
    return JSON.stringify(
      await linkExistingMisconceptions(openai, ppqText, input.existingMisconceptions)
    );
  }

  // Parse the answer-option table deterministically. A malformed table is fatal:
  // without it the model would be attributing misconceptions to options it cannot
  // see, which is exactly the guesswork this field exists to remove.
  const optionTable = parsePpqTable(ppqText);
  const optionTableBlock = formatOptionTable(optionTable);
  const validOptions = new Map(
    optionTable.map((q) => [q.docxQuestion, q])
  );
  console.log(
    `[microcoachIngestPPQ] parsed ${optionTable.length} questions: ` +
    optionTable.map((q) => `Q${q.docxQuestion}=${q.correctAnswer}`).join(' ')
  );

  const userContent = `
You are an expert K-12 math instructional coach analyzing a Pre-Post Quiz (PPQ) to identify the misconceptions that students are most likely to hold based on the distractor answer choices.

## Writing Style Requirements
Apply these rules to every string you generate:
- **Titles**: ${ws.titles ?? 'Short noun phrase. No parentheticals.'}
- **Descriptions**: ${ws.descriptions ?? 'Short sentences. Plain language. No run-ons.'}
- **Success indicators**: ${ws.successIndicators ?? 'Start with action verb. Observable behavior only.'}

## Classroom Context
- Classroom: ${classroomKey}
- Subject: ${subject}
- State: ${state}
- School Year: ${schoolYear}
- Cohort Size: ${cohortSize}
- Session: ${sessionLabel} (Week ${weekNumber})
- Occurrence context: "${occurrence}" — use this to set the occurrence field on each misconception

## Answer Options
This is the answer-option table from the document, parsed and labelled. Use these
exact question numbers and option letters when filling in \`wrongAnswers\`.

${optionTableBlock}

## PPQ Document
${ppqText}

---

## Your Task

Analyze the PPQ questions, their answer choices, and the correct answers to identify the **${MAX_MISCONCEPTIONS} most significant misconceptions** that students are likely to hold.

**How to identify misconceptions from distractors:**
- Each incorrect answer choice (distractor) is designed to catch a specific error pattern
- Map each distractor to the underlying cognitive mistake it represents
- Group related distractors across questions that share the same root misconception
- Rank misconceptions by how many questions/distractors share the same error pattern (priority "1" = most prevalent)

**Recording the linkage (\`wrongAnswers\`):**
- For each misconception, list every option in the Answer Options table that a student holding it would choose
- Use the question number and option letter exactly as they appear in that table — not the order they appear in the document body
- Never list the correct answer for a question
- An option may belong to only one misconception; if two seem to fit, pick the better one
- Some questions repeat the same distractor text across two letters. List whichever letters genuinely reflect the misconception; listing only one is fine
- It is better to omit an option you are unsure of than to guess

**For each misconception:**
- title: A short, descriptive name (e.g. "Inverting the Wrong Fraction", "Sign Errors in Distribution")
- description: Explain the specific cognitive error — what wrong mental model does the student have, and why do they make this mistake?
- ccssStandard: The specific CCSS standard this misconception violates (use full format — see CCSS Format below)
- severity: "high" for conceptual misunderstandings (wrong mental model); "medium" for mixed conceptual/procedural; "low" for procedural slips
- priority: "1" for the most common/impactful error pattern across the quiz; "2", "3", "4" for subsequent
- occurrence: Set to "${occurrence}" for all misconceptions unless clearly this is a recurring pattern (use the occurrence context above)
- successIndicators: ${SUCCESS_IND_MIN}-${SUCCESS_IND_MAX} specific, observable behaviors a student would demonstrate when they have overcome this misconception
${ACCURACY_INSTRUCTIONS.length ? `\n**Before finalizing each description:**\n${ACCURACY_INSTRUCTIONS.map((i) => `- ${i}`).join('\n')}\n` : ''}
## CCSS Format
CCSS standard codes must use the full format with cluster letter:
- K-8: grade.domain.cluster.standard (e.g. "8.EE.C.8", "7.EE.B.4", "6.NS.A.1")
- High school: HS prefix + domain-cluster.standard (e.g. "HSA-REI.B.3", "HSA-REI.D.12", "HSF-IF.C.7", "HSA-CED.A.1")
Do NOT use abbreviated forms like "A.REI.3" or "A.REI.12". Apply to both ccssStandard on each misconception and the top-level ccssStandards array.

Return JSON matching the schema.
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are an expert K-12 math instructional coach. Output exclusively valid JSON.' },
        { role: 'user', content: userContent },
      ],
      response_format: zodResponseFormat(IngestPPQResponse, 'ingestPPQResponse'),
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty completion content');

    const structured = IngestPPQResponse.parse(JSON.parse(raw));

    // Validate every wrong-answer reference against the parsed table. A reference
    // the table does not contain, or one naming the correct answer, would silently
    // skew the student counts computed downstream — so drop it and say so.
    const rejected = [];
    let claimed = 0;
    for (const m of structured.misconceptions) {
      claimed += (m.wrongAnswers ?? []).length;
      m.wrongAnswers = validateRefs(m.wrongAnswers, validOptions, m.title, rejected);
    }

    const kept = structured.misconceptions.reduce((n, m) => n + m.wrongAnswers.length, 0);
    console.log(`[microcoachIngestPPQ] wrongAnswers: ${kept}/${claimed} references valid`);
    if (rejected.length) {
      console.warn('[microcoachIngestPPQ] rejected references:', JSON.stringify(rejected));
    }

    // The option table travels with the response so upload can attach answer-choice
    // text to the assessment questions — nothing downstream can recover it otherwise.
    structured.optionTable = optionTable;
    structured.wrongAnswerLinkStats = { claimed, kept, rejected };

    return JSON.stringify(structured);
  } catch (error) {
    console.error('[microcoachIngestPPQ] Error', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
