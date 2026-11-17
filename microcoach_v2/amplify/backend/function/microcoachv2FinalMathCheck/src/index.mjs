/* Amplify Params - DO NOT EDIT
	API_MICROCOACHV2_GRAPHQLAPIIDOUTPUT
	API_MICROCOACHV2_MICROCOACHASSESSMENTTABLE_ARN
	API_MICROCOACHV2_MICROCOACHASSESSMENTTABLE_NAME
	API_MICROCOACHV2_MICROCOACHSESSIONTABLE_ARN
	API_MICROCOACHV2_MICROCOACHSESSIONTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * microcoachv2FinalMathCheck — the reviewer's Check math on /prepublishreview.
 *
 * An independent review of the math and mathematical thinking in everything
 * generated for a session, as stored in session.pipelineOutput (what the
 * reviewer reads): each misconception's analysis and each of its activities.
 * Every value is checked — text, numbers and labels. It shares no code or
 * prompt with the generation pipeline, and it only reports: it never changes
 * what was generated.
 *
 * Two ways in:
 *   - AppSync, `checkSessionMath(sessionId)` (@function, Admins only): marks the
 *     session's mathCheck RUNNING, starts the microcoachv2MathCheck state
 *     machine and returns at once. The page polls the session.
 *   - The state machine, one step per invocation ({ sessionId, runId, step }):
 *       prepare   the items to check: each misconception, then its activities
 *       item      one item ({ kind, i, j }), in one model call: an expert
 *                 review that reports only the errors it finds. A
 *                 misconception is read with the assessment questions it was
 *                 drawn from.
 *       finalize  mathCheck = DONE, with the issues
 *       fail      mathCheck = FAILED
 *     An item whose check throws is recorded as unchecked by the state machine
 *     and the run goes on; it is never reported as clean.
 *
 * session.mathCheck (AWSJSON, stored as a string):
 *   { status: RUNNING | DONE | FAILED, executionName, startedAt, finishedAt, model,
 *     itemsChecked, itemsUnchecked, rowsChecked, unchecked, summary, error?,
 *     issues: [{ kind: 'misconception' | 'activity', misconceptionIndex, activityIndex,
 *                misconceptionTitle, templateId, rowId, rowLabel, text, why }] }
 *   activityIndex is null on a misconception's own issues; rowId is the value's
 *   path within that misconception or activity.
 */
import { readFileSync } from 'node:fs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { loadSecret } from './util/loadsecrets.mjs';
import { rowsOf, misconceptionProblems } from './util/rows.mjs';
import { reviewPromptFor } from './util/prompt.mjs';
import { guideFor } from './util/templateGuide.mjs';
import { summarize, describeError, parseOutput, checkItems } from './util/results.mjs';

const config = JSON.parse(readFileSync(new URL('./util/config.json', import.meta.url), 'utf8'));
const fmc = config.finalMathCheck ?? {};
const MODEL = fmc.model ?? 'gpt-5-mini';
// Without this the model answers with no reasoning at all (0 reasoning tokens on the 2026-11-16 run).
const REASONING_EFFORT = fmc.reasoningEffort ?? 'medium';
const SYSTEM_PROMPT = fmc.systemPrompt ?? 'You are a K-12 math accuracy reviewer. Output only valid JSON.';

const { env } = process;
const REGION = env.REGION || 'us-east-1';
const SESSION_TABLE = env.API_MICROCOACHV2_MICROCOACHSESSIONTABLE_NAME;
const ASSESSMENT_TABLE = env.API_MICROCOACHV2_MICROCOACHASSESSMENTTABLE_NAME;
const REVIEWER_GROUP = 'Admins';
// A RUNNING check older than this is taken to have died (the state machine
// itself stops at 30 minutes), so a new one may start.
const STALE_AFTER_MS = 35 * 60 * 1000;

const db = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});
const sfn = new SFNClient({ region: REGION });

// ── Session ──────────────────────────────────────────────────────────────────

async function getSession(sessionId) {
  const { Item } = await db.send(new GetCommand({ TableName: SESSION_TABLE, Key: { id: sessionId } }));
  if (!Item) throw new Error(`Session ${sessionId} not found`);
  return Item;
}

const readCheck = (session) => parseOutput(session?.mathCheck);

async function writeCheck(sessionId, check) {
  const { Attributes } = await db.send(new UpdateCommand({
    TableName: SESSION_TABLE,
    Key: { id: sessionId },
    UpdateExpression: 'SET mathCheck = :check, updatedAt = :now',
    ConditionExpression: 'attribute_exists(id)',
    ExpressionAttributeValues: { ':check': JSON.stringify(check), ':now': new Date().toISOString() },
    ReturnValues: 'ALL_NEW',
  }));
  return Attributes;
}

/** False when a newer check has replaced this run, so this one must not write. */
async function isCurrentRun(sessionId, runId) {
  const check = readCheck(await getSession(sessionId));
  return check?.executionName === runId;
}

function loadOutput(session) {
  const output = parseOutput(session.pipelineOutput);
  if (!output) throw new Error(`Session ${session.id} has no stored pipeline output to check`);
  return output;
}

// ── Model ────────────────────────────────────────────────────────────────────

let openaiClient;
async function openai() {
  if (openaiClient) return openaiClient;
  const secretName = env.API_SECRET_NAME;
  if (!secretName) throw new Error('API_SECRET_NAME environment variable is required');
  const { openai_api, OPENAI_API_KEY, API } = JSON.parse(await loadSecret(secretName));
  const apiKey = openai_api ?? OPENAI_API_KEY ?? API;
  if (!apiKey) throw new Error('Secret must contain openai_api, OPENAI_API_KEY, or API');
  openaiClient = new OpenAI({ apiKey });
  return openaiClient;
}

/** One structured completion, parsed against `schema`. Throws on anything short of that. */
async function structuredCall(label, prompt, schema, name) {
  const client = await openai();
  const completion = await client.chat.completions.create({
    model: MODEL,
    store: false,
    reasoning_effort: REASONING_EFFORT,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    response_format: zodResponseFormat(schema, name),
  });
  console.log(`${label}: usage ${JSON.stringify(completion.usage)}`);
  const choice = completion.choices[0];
  if (choice?.finish_reason === 'length') throw new Error(`${label}: the response was cut off`);
  if (choice?.message?.refusal) throw new Error(`${label}: the model declined: ${choice.message.refusal}`);
  const raw = choice?.message?.content;
  if (!raw) throw new Error(`${label}: empty completion content`);
  return schema.parse(JSON.parse(raw));
}

const Review = z.object({
  issues: z.array(z.object({
    row: z.string().describe('The id of the row that needs fixing, as listed, e.g. r12'),
    why: z.string().describe('What is wrong and what is right, in one or two sentences a teacher can act on'),
  })).describe('The errors found; empty when there are none'),
});

// ── Steps ────────────────────────────────────────────────────────────────────

/** AppSync: start a check, unless one is already running. */
async function start(event, context) {
  const { sessionId } = event.arguments;
  const groups = event.identity?.claims?.['cognito:groups'] ?? [];
  if (!Array.isArray(groups) || !groups.includes(REVIEWER_GROUP)) {
    throw new Error('Only reviewers can check math');
  }
  const session = await getSession(sessionId);
  loadOutput(session);

  const current = readCheck(session);
  const startedMs = Date.parse(current?.startedAt ?? '');
  if (current?.status === 'RUNNING' && Date.now() - startedMs < STALE_AFTER_MS) return session;

  // The name is fixed in the custom resource template (as microcoachv2Generate).
  const accountId = context.invokedFunctionArn.split(':')[4];
  const stateMachineArn = `arn:aws:states:${REGION}:${accountId}:stateMachine:microcoachv2MathCheck-${env.ENV}`;
  const executionName = `${sessionId}-${Date.now()}`;
  const running = {
    status: 'RUNNING', executionName, startedAt: new Date().toISOString(), model: MODEL,
  };
  const updated = await writeCheck(sessionId, running);
  try {
    await sfn.send(new StartExecutionCommand({
      stateMachineArn,
      name: executionName,
      input: JSON.stringify({ sessionId }),
    }));
  } catch (err) {
    // Nothing is running, so don't leave the session saying something is.
    await writeCheck(sessionId, {
      ...running, status: 'FAILED', finishedAt: new Date().toISOString(),
      error: `Could not start the check: ${err?.message ?? err}`,
    });
    throw err;
  }
  console.log(`Started math check ${executionName}`);
  return updated;
}

async function prepare({ sessionId }) {
  const items = checkItems(loadOutput(await getSession(sessionId)));
  console.log(`Session ${sessionId}: ${items.length} items to check`);
  return { items };
}

/** The MIU 1 assessment's questions: what a misconception's analysis is about. */
async function assessmentQuestions(session) {
  if (!session.ppqAssessmentId) throw new Error(`Session ${session.id} has no MIU 1 assessment`);
  const { Item } = await db.send(new GetCommand({
    TableName: ASSESSMENT_TABLE, Key: { id: session.ppqAssessmentId },
  }));
  if (!Item) throw new Error(`Assessment ${session.ppqAssessmentId} not found`);
  return Item.questions ?? [];
}

/** One expert review of `material`; `questions` are the assessment questions it is about. */
async function review(label, what, guide, material, questions = []) {
  const rows = rowsOf(material);
  if (rows.length === 0) return { rowsChecked: 0, issues: [] };

  const { issues: found } = await structuredCall(
    `review ${label}`, reviewPromptFor({ what, guide, questions, rows }), Review, 'review',
  );

  // One issue per row, and only for rows that exist: an id the reviewer made up is dropped.
  const whyByRow = new Map();
  for (const { row: id, why } of found) {
    const n = /^r(\d+)$/.exec(id.trim())?.[1];
    if (n == null || !rows[Number(n)]) {
      console.warn(`${label}: dropped an issue on unknown row ${JSON.stringify(id)}`);
      continue;
    }
    whyByRow.set(Number(n), whyByRow.has(Number(n)) ? `${whyByRow.get(Number(n))}\n${why}` : why);
  }
  const issues = [...whyByRow.entries()]
    .sort(([a], [b]) => a - b)
    .map(([n, why]) => ({ rowId: rows[n].rowId, rowLabel: rows[n].rowLabel, text: rows[n].text, why }));
  console.log(`${label}: ${rows.length} rows, ${issues.length} issues`);
  return { rowsChecked: rows.length, issues };
}

async function checkItem({ sessionId, kind, i, j }) {
  const session = await getSession(sessionId);
  const misconception = loadOutput(session).misconceptions?.[i];
  if (!misconception) throw new Error(`No misconception at ${i}`);
  const base = { kind, i, j: j ?? null, misconceptionTitle: misconception.title ?? '' };

  if (kind === 'misconception') {
    // Its activities are items of their own.
    const { activities, ...analysis } = misconception;
    const questions = misconceptionProblems(misconception, await assessmentQuestions(session));
    const result = await review(
      `misconception ${i}`,
      'the analysis of one misconception found in a class\'s answers to a multiple-choice assessment: what the misconception is, the wrong answers linked to it and why, how it was scored and ranked, the instructional need, and the activity templates chosen for it',
      guideFor('misconception'), analysis, questions,
    );
    return { ...base, templateId: '', ...result };
  }
  if (kind === 'activity') {
    const activity = misconception.activities?.[j];
    if (!activity) throw new Error(`No activity at ${i}-${j}`);
    const result = await review(
      `activity ${i}-${j}`,
      `a classroom activity written to address the misconception "${misconception.title ?? ''}"`,
      guideFor('activity', activity), activity,
    );
    return { ...base, templateId: activity.templateId ?? '', ...result };
  }
  throw new Error(`Unknown item kind: ${kind}`);
}

async function finalize({ sessionId, runId, results }) {
  if (!(await isCurrentRun(sessionId, runId))) {
    console.log(`Run ${runId} was replaced by a newer check; nothing written`);
    return { written: false };
  }
  const current = readCheck(await getSession(sessionId));
  const summary = summarize(results);
  await writeCheck(sessionId, {
    ...current, status: 'DONE', finishedAt: new Date().toISOString(), ...summary,
  });
  console.log(`Session ${sessionId} math check DONE: ${summary.summary}`);
  return { written: true, summary: summary.summary, issues: summary.issues.length };
}

async function fail({ sessionId, runId, error }) {
  console.error(`Math check ${runId} FAILED:`, JSON.stringify(error));
  if (!(await isCurrentRun(sessionId, runId))) return { written: false };
  const current = readCheck(await getSession(sessionId));
  await writeCheck(sessionId, {
    ...current, status: 'FAILED', finishedAt: new Date().toISOString(),
    error: describeError(error).slice(0, 1000),
  });
  return { written: true };
}

export const handler = async (event, context) => {
  if (event?.arguments?.sessionId) return start(event, context);

  const { sessionId, step } = event ?? {};
  if (!sessionId || !step) throw new Error(`Needs sessionId and step: ${JSON.stringify(event)}`);
  console.log(`Step ${step}, session ${sessionId}, run ${event.runId}`);
  switch (step) {
    case 'prepare': return prepare(event);
    case 'item': return checkItem(event);
    case 'finalize': return finalize(event);
    case 'fail': return fail(event);
    default: throw new Error(`Unknown step: ${step}`);
  }
};
