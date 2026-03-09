import { loadSecret } from './util/loadsecrets.mjs';
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
});

const IngestPPQResponse = z.object({
  topic: z.string().describe('The mathematical topic covered by this PPQ (e.g. "Dividing Fractions")'),
  ccssStandards: z.array(z.string()).describe('All CCSS standards addressed by this PPQ'),
  misconceptions: z.array(Misconception).describe(
    `Identified misconceptions ordered by priority (1 = highest). Max ${MAX_MISCONCEPTIONS}. ` +
    'Each must be grounded in a specific distractor pattern from the PPQ questions.'
  ),
});

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const input = event?.arguments?.input ?? event?.input ?? event;

  const ppqText      = input?.ppqText;
  const classroomKey = input?.classroomKey;
  const grade        = input?.grade;
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

  const userContent = `
You are an expert K-12 math instructional coach analyzing a Pre-Post Quiz (PPQ) to identify the misconceptions that students are most likely to hold based on the distractor answer choices.

## Writing Style Requirements
Apply these rules to every string you generate:
- **Titles**: ${ws.titles ?? 'Short noun phrase. No parentheticals.'}
- **Descriptions**: ${ws.descriptions ?? 'Short sentences. Plain language. No run-ons.'}
- **Success indicators**: ${ws.successIndicators ?? 'Start with action verb. Observable behavior only.'}

## Classroom Context
- Classroom: ${classroomKey}
- Grade: ${grade}
- Subject: ${subject}
- State: ${state}
- School Year: ${schoolYear}
- Cohort Size: ${cohortSize}
- Session: ${sessionLabel} (Week ${weekNumber})
- Occurrence context: "${occurrence}" — use this to set the occurrence field on each misconception

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

**For each misconception:**
- title: A short, descriptive name (e.g. "Inverting the Wrong Fraction", "Sign Errors in Distribution")
- description: Explain the specific cognitive error — what wrong mental model does the student have, and why do they make this mistake?
- ccssStandard: The specific CCSS standard this misconception violates
- severity: "high" for conceptual misunderstandings (wrong mental model); "medium" for mixed conceptual/procedural; "low" for procedural slips
- priority: "1" for the most common/impactful error pattern across the quiz; "2", "3", "4" for subsequent
- occurrence: Set to "${occurrence}" for all misconceptions unless clearly this is a recurring pattern (use the occurrence context above)
- successIndicators: ${SUCCESS_IND_MIN}-${SUCCESS_IND_MAX} specific, observable behaviors a student would demonstrate when they have overcome this misconception
${ACCURACY_INSTRUCTIONS.length ? `\n**Before finalizing each description:**\n${ACCURACY_INSTRUCTIONS.map((i) => `- ${i}`).join('\n')}\n` : ''}
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
