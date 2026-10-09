import { loadSecret } from './util/loadsecrets.mjs';
import { OpenAI } from 'openai';
import config from './util/config.json' assert { type: 'json' };

const lvo = config?.llmVerify ?? {};
const nso = config?.nextStepOption ?? {};
const DESIGN_PRINCIPLES = nso.designPrinciples ?? [];
const DESIGN_MODEL = lvo.designModel ?? 'gpt-4o-mini';
const MATH_MODEL   = lvo.mathModel   ?? 'o3-mini';

// ── Activity shape ────────────────────────────────────────────────────────────

/*
 * Activities carry the Wave 2 content (src/lib/ActivityContentModels.ts,
 * schemaVersion 2) in `activity.content`; the template's artifact is
 * `content.facilitate`. Mirrors activityProblems() in microcoachv2NextStepOption/
 * src/util/activityContent.mjs — each Lambda bundles its own src. Change together.
 */

/**
 * The problem statements students are put in front of, outside Spot the Slip
 * (whose problems are checked alongside their worked steps). Make Your Case is
 * absent on purpose: its claim is meant to be false or conditional.
 */
function activityProblems(facilitate) {
  switch (facilitate?.type) {
    case 'FAVORITE_NO':
    case 'MATH_DETECTIVE':
      return (facilitate.examples ?? []).map((ex) => ex.prompt).filter(Boolean);
    case 'COMPARE_THE_THINKING':
      return facilitate.problem ? [facilitate.problem] : [];
    default:
      return [];
  }
}

const bulletList = (rows) => (rows ?? []).map((row) => `  - ${row}`).join('\n');

// ── Prompt builders ───────────────────────────────────────────────────────────

export function buildDesignPrompt(misconception, activity) {
  const content = activity.content ?? {};
  const facilitate = content.facilitate ?? {};
  const discussion = content.discussion ?? {};

  const principlesText = DESIGN_PRINCIPLES
    .map((p, i) => `${i + 1}. **${p.split(':')[0]}**: ${p.split(':').slice(1).join(':').trim()}`)
    .join('\n');

  // The per-option explanations replace the old `evidence.aiThinkingPattern`, which
  // was a Wave 1 field nothing ever filled. They are the actual student evidence:
  // one line per wrong option saying what that option's value shows.
  const evidenceText = (misconception.wrongAnswerExplanations ?? [])
    .map((w) => `  • ${w.answer}: ${w.explanation}`)
    .join('\n');

  return `
## Design Principles to Evaluate Against

${principlesText}

## Misconception

Title: ${misconception.title}
Description: ${misconception.misconceptionSummary ?? ''}
Most common error: ${misconception.evidence?.mostCommonError ?? '(none)'}
Per-option evidence from the class:
${evidenceText || '  (none)'}

## Activity

Title: ${activity.title}
Routine: ${activity.routine?.name ?? '(none)'} — ${activity.routine?.subtitle ?? ''}
Activity type: ${facilitate.type ?? '(none)'}
Why this activity: ${content.whyThisActivity ?? '(none)'}

Before class (teacher prep):
${bulletList(content.beforeClass?.steps) || '  (none)'}

How to run it:
${(content.howToRun ?? []).map((s, i) => `  ${i + 1}. ${s.title} — ${s.body}`).join('\n') || '  (none)'}

The artifact students analyze (teacher view):
${JSON.stringify(facilitate, null, 2)}

Closing discussion questions:
${bulletList((discussion.questions ?? []).map((q) => q.question)) || '  (none)'}
Mathematical takeaway: ${discussion.takeaway ?? '(none)'}

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

/**
 * The worked-example checks only mean something for INCORRECT_WORKED_EXAMPLES; the
 * other five layouts carry no worked examples at all. Asking about them anyway got a
 * `true` back for an empty list, which is a pass that was never tested — the same
 * failure mode as reading a field that no longer exists. These three checks are now
 * asked for only when there is something to ask about, and reported as skipped
 * otherwise.
 */
const WORKED_EXAMPLE_CHECKS = [
  'worked_examples_show_misconception',
  'worked_examples_math_valid',
  'worked_examples_not_accidentally_correct',
];

export function workedExamplesOf(activity) {
  const facilitate = activity.content?.facilitate;
  if (facilitate?.type !== 'INCORRECT_WORKED_EXAMPLES') return null;
  return Array.isArray(facilitate.examples) && facilitate.examples.length ? facilitate.examples : null;
}

export function buildMathPrompt(activity) {
  const facilitate = activity.content?.facilitate ?? {};
  const examples = workedExamplesOf(activity);

  // Wave 2 annotates the intentional error structurally, on the step that carries it,
  // instead of leaving the reviewer to infer which step was meant to be wrong.
  const iweText = (examples ?? []).map((e, i) => {
    const steps = (e.steps ?? [])
      .map((st, j) => {
        const mark = st?.annotation?.kind ? ` [${st.annotation.kind}${st.annotation.text ? `: ${st.annotation.text}` : ''}]` : '';
        return `      ${st?.step ?? j + 1}. ${st?.text ?? ''}${mark}`;
      })
      .join('\n');
    return `  Example ${i + 1}: ${e.prompt ?? ''}\n    Steps:\n${steps}\n    Arrives at: ${e.finalOutcome ?? ''}`;
  }).join('\n\n');

  const problems = activityProblems(facilitate);

  const workedExampleSection = examples
    ? `
Incorrect worked examples:
${iweText}
`
    : '';

  const workedExampleKeys = examples
    ? `,
  "worked_examples_show_misconception": true|false,
  "worked_examples_show_misconception_details": "explain only if false",
  "worked_examples_math_valid": true|false,
  "worked_examples_math_valid_details": "explain only if false, show each error",
  "worked_examples_not_accidentally_correct": true|false,
  "worked_examples_not_accidentally_correct_details": "for each failing example: state the problem, the correct final answer, and the incorrect path's final answer"`
    : '';

  const workedExampleRules = examples
    ? `
- worked_examples_show_misconception: Do the incorrect worked examples demonstrate the target misconception error?
- worked_examples_math_valid: Each incorrect worked example is DESIGNED to contain exactly one intentional error — the step annotated ERROR. That intentional error is expected and correct by design. Return true unless you find UNINTENTIONAL arithmetic mistakes in the OTHER steps (wrong multiplication, wrong simplification, wrong sign in a step that is not the annotated one). The presence of the intentional misconception error must NOT cause a false failure here.
- worked_examples_not_accidentally_correct: For each example, solve its prompt correctly to find the true final answer, then trace its steps to the stated outcome. Return false if ANY example's incorrect path arrives at the SAME final answer as the correct solution — that makes the error appear consequence-free and defeats the activity's purpose. Return true only when every example's path leads to a clearly wrong answer.`
    : '';

  return `
## Activity

Title: ${activity.title}
Activity type: ${facilitate.type ?? '(none)'}
Problems students work on:
${problems.length ? problems.map((p) => `  - ${p}`).join('\n') : '  (none outside the worked examples)'}
${workedExampleSection}
---

Return a JSON object with exactly these keys:
{
  "problem_math_correct": true|false,
  "problem_math_correct_details": "explain only if false, show the error"${workedExampleKeys}
}

Rules:
- problem_math_correct: Is every listed problem mathematically correct and well-posed? If none are listed, return true and say so in the details.${workedExampleRules}
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

    // Checks that were not asked about, so the caller can omit them instead of
    // reading a missing key as a failure.
    const skippedChecks = workedExamplesOf(activity) ? [] : WORKED_EXAMPLE_CHECKS;
    return { ...designResult, ...mathResult, skippedChecks };
  } catch (error) {
    console.error('[microcoachLLMVerify] Error', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
