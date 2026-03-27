import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { createGqlClient } from './util/appsync-client.mjs';
import { loadSecret } from './util/loadsecrets.mjs';
import { GET_SESSION, UPDATE_SESSION } from './util/graphql.mjs';

const AMPLIFY_ENV = process.env.ENV || 'dev';
const MODEL = 'gpt-4o';

// ── Exact rubric used by GradeLevelAppropriatenessEvaluator (extracted from @learning-commons/evaluators) ──
const EVALUATOR_RUBRIC = `
The evaluator scores text using these four steps:

1. Quantitative: word count and Flesch-Kincaid Grade Level
   Word count bands: 2-3: 200-800w, 4-5: 200-800w, 6-8: 400-1000w, 9-10: 500-1500w, 11-12: 1501+w
   FK formula: 0.39*(words/sentences) + 11.8*(syllables/words) - 15.59

2. Qualitative complexity rubric:

TEXT STRUCTURE
Exceedingly Complex: Deep, intricate, ambiguous connections; discipline-specific organization; graphics essential
Very Complex: Expanded ideas with implicit/subtle connections; multiple organizational pathways; graphics integral
Moderately Complex: Some implicit/subtle connections; evident sequential organization; graphics supplementary
Slightly Complex: Explicit clear connections; chronological/sequential/predictable; simple graphics

LANGUAGE FEATURES
Exceedingly Complex: Dense, abstract, ironic/figurative language; complex/unfamiliar/archaic/subject-specific vocabulary; mainly complex sentences with multiple subordinate clauses
Very Complex: Fairly complex; some abstract/ironic/figurative; some unfamiliar/archaic/academic vocabulary; many complex sentences with subordinate phrases/clauses
Moderately Complex: Mostly explicit language; mostly familiar/conversational vocabulary; primarily simple and compound sentences with some complex ones
Slightly Complex: Explicit, literal, straightforward; contemporary/familiar/conversational vocabulary; mainly simple sentences

PURPOSE
Exceedingly Complex: Subtle, intricate, difficult to determine; many theoretical/abstract elements
Very Complex: Implicit or subtle, fairly easy to infer; more theoretical than concrete
Moderately Complex: Implied but easy to identify from context
Slightly Complex: Explicitly stated, clear, concrete, narrowly focused

KNOWLEDGE DEMANDS
Exceedingly Complex: Extensive discipline-specific or theoretical knowledge; many references/allusions
Very Complex: Moderate discipline-specific knowledge; some references/allusions
Moderately Complex: Common knowledge + some discipline-specific; few references/allusions
Slightly Complex: Everyday, practical knowledge; no references/allusions

3. Background knowledge: at which grade level would students have enough background knowledge to understand the text?

4. Synthesis: quantitative signal → qualitative refinement → background knowledge → final grade band
`;

// ── Structured output schema — discussion questions only ──
const RewriteResultSchema = z.object({
  discussionQuestions: z.array(z.string())
    .describe('Rewritten discussion questions'),
});

async function loadOpenAIClient() {
  const secretName = process.env.API_SECRET_NAME || 'openai-api';
  const raw = await loadSecret(secretName);
  const { openai_api, OPENAI_API_KEY, API } = JSON.parse(raw);
  const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
  if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');
  return new OpenAI({ apiKey });
}

async function invokeLambda(functionName, payload) {
  const client = new LambdaClient({ region: process.env.REGION || 'us-east-1' });
  const result = await client.send(new InvokeCommand({
    FunctionName: functionName,
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(JSON.stringify(payload)),
  }));
  const responseStr = Buffer.from(result.Payload).toString();
  return JSON.parse(responseStr);
}

function expectedBand(grade) {
  if (grade <= 1) return 'K-1';
  if (grade <= 3) return '2-3';
  if (grade <= 5) return '4-5';
  if (grade <= 8) return '6-8';
  if (grade <= 10) return '9-10';
  return '11-CCR';
}

// ── Handler: sync validates → async self-invoke ──
export const handler = async (event) => {
  if (event._async) {
    return runRegenPipeline(event);
  }

  console.log('Regen event (sync):', JSON.stringify(event));
  const { sessionId, grade } = event.arguments?.input ?? event;
  if (!sessionId || !grade) throw new Error('sessionId and grade are required');

  const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME;
  const lambdaClient = new LambdaClient({ region: process.env.REGION || 'us-east-1' });
  await lambdaClient.send(new InvokeCommand({
    FunctionName: functionName,
    InvocationType: 'Event',
    Payload: Buffer.from(JSON.stringify({ _async: true, sessionId, grade })),
  }));

  console.log('Async regen invoked');
  return JSON.stringify({ status: 'regenerating' });
};

// ── Async pipeline ──
async function runRegenPipeline({ sessionId, grade }) {
  const targetBand = expectedBand(grade);
  console.log(`[async] Session: ${sessionId}, Grade: ${grade}, Target band: ${targetBand}`);

  // 1. Fetch session
  const gql = await createGqlClient();
  const sessionData = await gql(GET_SESSION, { id: sessionId });
  const session = sessionData.getSession;
  if (!session) throw new Error(`Session ${sessionId} not found`);

  const nextSteps = JSON.parse(session.pregeneratedNextSteps);
  const prevEval = session.evaluationResults ? JSON.parse(session.evaluationResults) : null;
  const prevScore = prevEval?.evaluations?.[0]?.score ?? 'unknown';
  const prevReasoning = prevEval?.evaluations?.[0]?.reasoning ?? '';

  console.log(`Previous evaluation score: ${prevScore}, expected: ${targetBand}`);
  console.log(`=== EVALUATOR FEEDBACK ===\n${prevReasoning}\n=========================`);

  // 2. Collect move options to rewrite (one OpenAI call per move option)
  const moveJobs = [];
  for (let nsIdx = 0; nsIdx < nextSteps.length; nsIdx++) {
    const ns = nextSteps[nsIdx];
    for (let moveIdx = 0; moveIdx < (ns.moveOptions ?? []).length; moveIdx++) {
      const move = ns.moveOptions[moveIdx];
      const steps = move.tabs?.activitySteps;
      if (!steps) continue;

      const hasContent = steps.discussionQuestions?.length > 0;
      if (hasContent) {
        moveJobs.push({ nsIdx, moveIdx, misconception: ns.title, format: move.format, steps });
      }
    }
  }

  if (moveJobs.length === 0) {
    console.log('No discussion questions found to rewrite');
    return;
  }

  console.log(`Rewriting discussion questions across ${moveJobs.length} move options from ${prevScore} to ${targetBand}`);

  // 3. Rewrite each move option in parallel, guided by evaluator feedback
  const openai = await loadOpenAIClient();

  const rewritePromises = moveJobs.map(async (job) => {
    const { misconception, format, steps } = job;

    const existingQuestions = (steps.discussionQuestions ?? []).map((q, i) =>
      `[${i}] ${q}`
    ).join('\n\n');

    const numQuestions = steps.discussionQuestions.length;

    console.log(`\n--- [${misconception} — ${format}] SENDING ${numQuestions} questions to OpenAI ---`);
    console.log(existingQuestions);

    const userMessage = `An external evaluator scored math education discussion questions above the target grade level.

Your task is to rewrite the discussion questions so they score at the target grade band. The worked examples for this misconception are intentionally kept as-is — only rewrite the discussion questions.

[BEGIN EVALUATOR ANALYSIS]
Content was scored at grade band: ${prevScore}
Target grade band: ${targetBand} (grade ${grade})

Evaluator reasoning and feedback:
${prevReasoning}
[END EVALUATOR ANALYSIS]

[BEGIN EVALUATOR RUBRIC — this is the exact rubric the evaluator uses to score your output]
${EVALUATOR_RUBRIC}
[END EVALUATOR RUBRIC]

Misconception being addressed: "${misconception}"
Activity format: ${format}

Rules for discussion questions:
- Surface and resolve the specific misconception error pattern
- Use vocabulary and sentence structure appropriate for grade ${grade} — prefer everyday language over academic/subject-specific terms where possible
- Be open-ended enough to generate classroom discussion
- A student at grade ${grade} should be able to understand and engage with the question without scaffolding
- You MUST return exactly ${numQuestions} discussion questions

--- DISCUSSION QUESTIONS TO REWRITE (${numQuestions}) ---
${existingQuestions}`;

    const completion = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.7,
      response_format: zodResponseFormat(RewriteResultSchema, 'rewriteResult'),
      messages: [
        { role: 'system', content: `You are an expert K-12 math education content writer.` },
        { role: 'user', content: userMessage },
      ],
    });

    const parsed = JSON.parse(completion.choices[0].message.content);

    console.log(`\n--- [${misconception} — ${format}] RECEIVED from OpenAI ---`);
    console.log(JSON.stringify(parsed.discussionQuestions, null, 2));

    if (parsed.discussionQuestions?.length > 0) {
      steps.discussionQuestions = parsed.discussionQuestions;
    }

    console.log(`  ✓ ${misconception} — ${format}: ${numQuestions} questions rewritten`);
  });

  await Promise.all(rewritePromises);
  console.log('✓ All texts rewritten, re-evaluating...');

  // 4. Re-evaluate via microcoachInitialEvaluator
  const allParts = [];
  for (const ns of nextSteps) {
    for (const move of ns.moveOptions ?? []) {
      const steps = move.tabs?.activitySteps;
      if (steps?.incorrectWorkedExamples) {
        for (const ex of steps.incorrectWorkedExamples) {
          allParts.push(typeof ex === 'string' ? ex : `Problem: ${ex.problem}\nIncorrect Work: ${ex.incorrectWork}`);
        }
      }
      if (steps?.discussionQuestions) {
        for (const q of steps.discussionQuestions) {
          allParts.push(q);
        }
      }
    }
  }

  const evalTexts = [{ id: 'all', label: 'All Generated Content', type: 'combined', text: allParts.join('\n\n---\n\n') }];
  const evalResults = await invokeLambda(`microcoachInitialEvaluator-${AMPLIFY_ENV}`, {
    grade,
    texts: evalTexts,
  });

  console.log(`✓ Re-evaluation: ${JSON.stringify(evalResults.summary)}`);

  // 5. Save to DynamoDB
  await gql(UPDATE_SESSION, {
    input: {
      id: sessionId,
      pregeneratedNextSteps: JSON.stringify(nextSteps),
      evaluationResults: JSON.stringify(evalResults),
    },
  });

  console.log('✓ Session updated');
}
