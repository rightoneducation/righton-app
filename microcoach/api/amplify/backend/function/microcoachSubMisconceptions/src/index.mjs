import { loadSecret } from './util/loadsecrets.mjs';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import config from './util/config.json' assert { type: 'json' };

const smc = config?.subMisconceptions ?? {};
const MODEL       = smc.model ?? 'gpt-4o-mini';
const COUNT_MIN   = smc.countPerMisconception?.min ?? 2;
const COUNT_MAX   = smc.countPerMisconception?.max ?? 4;
const MANY_PCT    = smc.frequencyThresholds?.manyPercent ?? 60;
const SOME_PCT    = smc.frequencyThresholds?.somePercent ?? 30;

// ── Schema ────────────────────────────────────────────────────────────────────

const SubMisconception = z.object({
  name: z.string().describe('Short, specific label for the exact error variant'),
  frequency: z.enum(['many', 'some', 'few']).describe(`"many" >${MANY_PCT}%, "some" ${SOME_PCT}-${MANY_PCT}%, "few" <${SOME_PCT}% of students showing this misconception`),
  isCore: z.boolean().describe('true for the single most fundamental/most common pattern — exactly one per misconception must be true'),
  description: z.string().describe('One sentence describing the cognitive error'),
  example: z.object({
    incorrect: z.string().describe('Example of incorrect student work'),
    correct: z.string().describe('The correct answer or approach'),
  }),
});

const SubMisconceptionsResponse = z.object({
  subMisconceptions: z.array(SubMisconception).describe(`${COUNT_MIN}-${COUNT_MAX} specific error variants students exhibit within this misconception`),
});

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const rawMisconception = event?.arguments?.input?.misconception ?? event?.input?.misconception;
  if (rawMisconception == null) throw new Error('misconception is required');

  const misconception = typeof rawMisconception === 'string' ? JSON.parse(rawMisconception) : rawMisconception;

  const apiSecret = await loadSecret(apiSecretName);
  const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
  const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
  if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');

  const openai = new OpenAI({ apiKey });

  const userContent = `
You are an expert K-12 math instructional coach analyzing student error patterns.

## Misconception
${JSON.stringify(misconception, null, 2)}

## Your Task

Identify ${COUNT_MIN}-${COUNT_MAX} specific error variants or sub-patterns that students exhibit within this misconception.

For each sub-misconception:
- **name**: Short, specific label for the exact error (e.g. "Forgetting to invert at all", "Inverting both fractions")
- **frequency**: How common among students showing this misconception — "many" (>${MANY_PCT}%), "some" (${SOME_PCT}-${MANY_PCT}%), "few" (<${SOME_PCT}%)
- **isCore**: true for the single most fundamental/most common pattern — exactly ONE must be true
- **description**: One sentence describing the cognitive error students are making
- **example**: A concrete math example with the incorrect student work and the correct answer

Return JSON matching the schema.
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are an expert K-12 math instructional coach. Output exclusively valid JSON.' },
        { role: 'user', content: userContent },
      ],
      response_format: zodResponseFormat(SubMisconceptionsResponse, 'subMisconceptionsResponse'),
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty completion content');

    const structured = SubMisconceptionsResponse.parse(JSON.parse(raw));
    return JSON.stringify(structured.subMisconceptions);
  } catch (error) {
    console.error('[microcoachSubMisconceptions] Error', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
