import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { createGqlClient } from './util/appsync-client.mjs';
import { loadSecret } from './util/loadsecrets.mjs';
import { GET_SESSION, UPDATE_SESSION } from './util/graphql.mjs';

const AMPLIFY_ENV = process.env.ENV || 'dev';
const MODEL = 'gpt-4o';

// ── Structured output schema matching existing data structures ──
const RewriteResultSchema = z.object({
  incorrectWorkedExamples: z.array(z.object({
    problem: z.string().describe('The math problem statement'),
    incorrectWork: z.string().describe('The step-by-step incorrect student work showing the misconception'),
  })).describe('Rewritten incorrect worked examples'),
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
  console.log(`Evaluator feedback:\n${prevReasoning}`);

  // 2. Collect move options to rewrite (one OpenAI call per move option)
  const moveJobs = [];
  for (let nsIdx = 0; nsIdx < nextSteps.length; nsIdx++) {
    const ns = nextSteps[nsIdx];
    for (let moveIdx = 0; moveIdx < (ns.moveOptions ?? []).length; moveIdx++) {
      const move = ns.moveOptions[moveIdx];
      const steps = move.tabs?.activitySteps;
      if (!steps) continue;

      const hasContent = (steps.incorrectWorkedExamples?.length > 0) || (steps.discussionQuestions?.length > 0);
      if (hasContent) {
        moveJobs.push({ nsIdx, moveIdx, misconception: ns.title, format: move.format, steps });
      }
    }
  }

  if (moveJobs.length === 0) {
    console.log('No content to rewrite');
    return;
  }

  console.log(`Rewriting content across ${moveJobs.length} move options from ${prevScore} to ${targetBand}`);

  // 3. Rewrite each move option in parallel, guided by evaluator feedback
  const openai = await loadOpenAIClient();

  const rewritePromises = moveJobs.map(async (job) => {
    const { nsIdx, moveIdx, misconception, format, steps } = job;

    const existingExamples = (steps.incorrectWorkedExamples ?? []).map((ex, i) =>
      `[${i}] ${typeof ex === 'string' ? ex : `Problem: ${ex.problem}\nIncorrect Work: ${ex.incorrectWork}`}`
    ).join('\n\n');

    const existingQuestions = (steps.discussionQuestions ?? []).map((q, i) =>
      `[${i}] ${q}`
    ).join('\n\n');

    const numExamples = (steps.incorrectWorkedExamples ?? []).length;
    const numQuestions = (steps.discussionQuestions ?? []).length;

    const completion = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.7,
      response_format: zodResponseFormat(RewriteResultSchema, 'rewriteResult'),
      messages: [
        {
          role: 'system',
          content: `You are an expert K-12 math education content writer.`
        },
        {
          role: 'user',
          content: `An external evaluator has analyzed the grade-level appropriateness of the following math education content and determined that it does NOT match the target grade level.

Your task is to rewrite the content so that it matches the target grade band. Use the evaluator's analysis below as your primary guide — it tells you exactly what is wrong and what needs to change.

[BEGIN EVALUATOR ANALYSIS]
Content was scored at grade band: ${prevScore}
Target grade band: ${targetBand} (grade ${grade})

Evaluator reasoning and feedback:
${prevReasoning}
[END EVALUATOR ANALYSIS]

Misconception being addressed: "${misconception}"
Activity format: ${format}

Instructions:
- Maintain the original meaning and the specific misconception error pattern
- Target the evaluator's feedback as a means to ensure the rewritten text is at the target grade band "${targetBand}" (grade ${grade})
- Address every issue the evaluator identified — vocabulary complexity, sentence structure, knowledge demands, and any other factors mentioned
- Preserve the intentional misconception error while adjusting the language and mathematical complexity to grade ${grade}
- A primary goal is to achieve the target grade band in a single pass

Rules for incorrect worked examples (return as objects with "problem" and "incorrectWork" fields):
- Show a complete problem and the full incorrect student work step-by-step
- Reflect the specific misconception error pattern (not a random mistake)
- Be self-contained — immediately usable on a board or slide with no additional prep

Rules for discussion questions (return as plain strings):
- Surface and resolve the specific error pattern
- Be open-ended enough to generate classroom discussion

You MUST return exactly ${numExamples} incorrectWorkedExamples and exactly ${numQuestions} discussionQuestions.

--- INCORRECT WORKED EXAMPLES (${numExamples}) ---
${existingExamples || '(none)'}

--- DISCUSSION QUESTIONS (${numQuestions}) ---
${existingQuestions || '(none)'}`
        }
      ],
    });

    const parsed = JSON.parse(completion.choices[0].message.content);

    // Swap in rewritten content directly
    if (parsed.incorrectWorkedExamples?.length > 0) {
      steps.incorrectWorkedExamples = parsed.incorrectWorkedExamples;
    }
    if (parsed.discussionQuestions?.length > 0) {
      steps.discussionQuestions = parsed.discussionQuestions;
    }

    console.log(`  ✓ ${misconception} — ${format}: ${numExamples} examples + ${numQuestions} questions rewritten`);
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
