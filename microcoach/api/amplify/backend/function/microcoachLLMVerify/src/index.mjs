import { loadSecret } from './util/loadsecrets.mjs';
import { OpenAI } from 'openai';
import config from './util/config.json' assert { type: 'json' };

const lvo = config?.llmVerify ?? {};
const nso = config?.nextStepOption ?? {};
const DESIGN_PRINCIPLES = nso.designPrinciples ?? [];
const DESIGN_MODEL = lvo.designModel ?? 'gpt-4o-mini';
const MATH_MODEL   = lvo.mathModel   ?? 'o3-mini';

// ── Prompt builders ───────────────────────────────────────────────────────────

function buildDesignPrompt(misconception, activity) {
  const tabs = activity.tabs ?? {};
  const actSteps = tabs.activitySteps ?? {};

  const principlesText = DESIGN_PRINCIPLES
    .map((p, i) => `${i + 1}. **${p.split(':')[0]}**: ${p.split(':').slice(1).join(':').trim()}`)
    .join('\n');

  const stepsText = (actSteps.coreActivity ?? [])
    .map((s, i) => `  ${i + 1}. ${s}`)
    .join('\n');

  const overviewText = [
    'What students do:',
    ...(tabs.overview?.whatStudentsDo ?? []).map((b) => `  • ${b.label}: ${b.detail}`),
    'What teacher does:',
    ...(tabs.overview?.whatYouDo ?? []).map((b) => `  • ${b.label}: ${b.detail}`),
  ].join('\n');

  return `
## Design Principles to Evaluate Against

${principlesText}

## Misconception

Title: ${misconception.title}
Description: ${misconception.misconceptionSummary ?? ''}
Most common error: ${misconception.evidence?.mostCommonError ?? '(none)'}
Student thinking pattern: ${misconception.evidence?.aiThinkingPattern ?? '(none)'}

## Activity

Title: ${activity.title}

Core activity steps:
${stepsText}

Overview:
${overviewText}

---

Return a JSON object with exactly these keys:
{
  "misconception_driven": true|false,
  "misconception_driven_details": "explain only if false",
  "error_first": true|false,
  "error_first_details": "explain only if false",
  "class_data_connection": true|false,
  "class_data_connection_details": "explain only if false"
}

Rules:
- misconception_driven: Does the activity directly target the identified cognitive error (not generic practice)?
- error_first: Do students encounter and analyze incorrect reasoning BEFORE seeing the correct method?
- class_data_connection: Does the activity reference or build on the specific error patterns from the class data?
`.trim();
}

function buildMathPrompt(activity) {
  const tabs = activity.tabs ?? {};
  const actSteps = tabs.activitySteps ?? {};

  const iweText = (actSteps.incorrectWorkedExamples ?? [])
    .map((e, i) => `  Example ${i + 1}: ${e.problem}\n    Incorrect work: ${e.incorrectWork}`)
    .join('\n');

  return `
## Activity

Title: ${activity.title}
Central problem: ${actSteps.problem ?? ''}

Incorrect worked examples:
${iweText}

---

Return a JSON object with exactly these keys:
{
  "problem_math_correct": true|false,
  "problem_math_correct_details": "explain only if false, show the error",
  "worked_examples_show_misconception": true|false,
  "worked_examples_show_misconception_details": "explain only if false",
  "worked_examples_math_valid": true|false,
  "worked_examples_math_valid_details": "explain only if false, show each error",
  "worked_examples_not_accidentally_correct": true|false,
  "worked_examples_not_accidentally_correct_details": "for each failing example: state the problem, the correct final answer, and the incorrect path's final answer"
}

Rules:
- problem_math_correct: Is the central problem mathematically correct?
- worked_examples_show_misconception: Do the incorrect worked examples demonstrate the target misconception error?
- worked_examples_math_valid: Each incorrect worked example is DESIGNED to contain exactly one intentional error — the misconception step. That intentional error is expected and correct by design. Return true unless you find UNINTENTIONAL arithmetic mistakes in the surrounding steps (wrong multiplication, wrong simplification, wrong sign in a step that is not the misconception itself). The presence of intentional misconception errors must NOT cause a false failure here.
- worked_examples_not_accidentally_correct: For each incorrect worked example, solve the problem correctly to find the true final answer, then trace the incorrectWork path step-by-step to find its final answer. Return false if ANY example's incorrect path arrives at the SAME final answer as the correct solution — this makes the error appear consequence-free and defeats the activity's pedagogical purpose. Return true only when every example's incorrect path leads to a clearly wrong answer.
`.trim();
}

// ── Handler ───────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  const apiSecretName = process.env.API_SECRET_NAME;
  if (!apiSecretName) throw new Error('API_SECRET_NAME environment variable is required');

  const rawMisconception = event?.arguments?.input?.misconception ?? event?.input?.misconception;
  const rawActivity      = event?.arguments?.input?.activity      ?? event?.input?.activity;

  if (rawMisconception == null) throw new Error('misconception is required');
  if (rawActivity == null)      throw new Error('activity is required');

  const misconception = typeof rawMisconception === 'string' ? JSON.parse(rawMisconception) : rawMisconception;
  const activity      = typeof rawActivity      === 'string' ? JSON.parse(rawActivity)      : rawActivity;

  const apiSecret = await loadSecret(apiSecretName);
  const { openai_api, OPENAI_API_KEY, API } = JSON.parse(apiSecret);
  const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
  if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');

  const openai = new OpenAI({ apiKey });

  try {
    const [designResult, mathResult] = await Promise.all([
      openai.chat.completions.create({
        model: DESIGN_MODEL,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are a curriculum quality reviewer. Return only valid JSON.' },
          { role: 'user', content: buildDesignPrompt(misconception, activity) },
        ],
        temperature: 0,
      }).then(r => JSON.parse(r.choices[0].message.content)),

      openai.chat.completions.create({
        model: MATH_MODEL,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are a math accuracy reviewer. Return only valid JSON.' },
          { role: 'user', content: buildMathPrompt(activity) },
        ],
        // no temperature — o-series models don't support it
      }).then(r => JSON.parse(r.choices[0].message.content)),
    ]);

    return { ...designResult, ...mathResult };
  } catch (error) {
    console.error('[microcoachLLMVerify] Error', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
