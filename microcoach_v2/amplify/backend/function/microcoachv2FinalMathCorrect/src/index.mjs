/* Amplify Params - DO NOT EDIT
	API_MICROCOACHV2_GRAPHQLAPIIDOUTPUT
	API_MICROCOACHV2_MICROCOACHACTIVITYTABLE_ARN
	API_MICROCOACHV2_MICROCOACHACTIVITYTABLE_NAME
	API_MICROCOACHV2_MICROCOACHASSESSMENTTABLE_ARN
	API_MICROCOACHV2_MICROCOACHASSESSMENTTABLE_NAME
	API_MICROCOACHV2_MICROCOACHMISCONCEPTIONTABLE_ARN
	API_MICROCOACHV2_MICROCOACHMISCONCEPTIONTABLE_NAME
	API_MICROCOACHV2_MICROCOACHSESSIONTABLE_ARN
	API_MICROCOACHV2_MICROCOACHSESSIONTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * microcoachv2FinalMathCorrect — the reviewer's Correct and hand edits on
 * /prepublishreview, after Check math (microcoachv2FinalMathCheck).
 *
 * Three ways in:
 *   - AppSync `correctSessionMath(sessionId, issues)` (Admins): marks the
 *     session's mathCorrect RUNNING, invokes itself asynchronously with
 *     { run: 'correct' } and returns at once. The page polls the session.
 *   - { run: 'correct' } (itself): per item with chosen issues, in parallel, one
 *     model call returns a replacement for each flagged value and nothing else.
 *     The replacements are written into session.pipelineOutput and the
 *     teacher's rows in one pass, each changed item is re-checked through the
 *     check lambda's own `item` step, and session.mathCheck's issues for those
 *     items are swapped for the fresh ones.
 *   - AppSync `applySessionEdits(sessionId, edits)` (Admins): the reviewer's
 *     hand edits, written when they click Publish. No model, so it returns
 *     within AppSync's limit. Only text values can be hand-edited; anything
 *     wrong with an edit fails the whole call and nothing is written.
 *
 * An item is a misconception (kind 'misconception', activityIndex null) or one
 * of its activities, addressed as in the check: pipelineOutput.misconceptions[i]
 * and its .activities[j]. A rowId is a value's path inside that item.
 *
 * session.mathCorrect (AWSJSON, stored as a string):
 *   { status: RUNNING | DONE | FAILED, runId, startedAt, finishedAt, requested,
 *     fixed: [issue + { before, after }], stillFlagged: [same], notFixed: [issue + { reason }], error? }
 */
import { readFileSync } from 'node:fs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { loadSecret } from './util/loadsecrets.mjs';
import { getAt, setAt, coerceLike } from './util/paths.mjs';
import { correctPromptFor } from './util/prompt.mjs';
import {
  findMisconceptionRow, findActivityRow, applyToMisconceptionRow, applyToActivityRow,
} from './util/teacherRows.mjs';

const config = JSON.parse(readFileSync(new URL('./util/config.json', import.meta.url), 'utf8'));
const fmc = config.finalMathCorrect ?? {};
const MODEL = fmc.model ?? 'gpt-5-mini';
const SYSTEM_PROMPT = fmc.systemPrompt ?? 'You are a K-12 mathematics editor. Output only valid JSON.';

const { env } = process;
const REGION = env.REGION || 'us-east-1';
const TABLES = {
  session: env.API_MICROCOACHV2_MICROCOACHSESSIONTABLE_NAME,
  assessment: env.API_MICROCOACHV2_MICROCOACHASSESSMENTTABLE_NAME,
  misconception: env.API_MICROCOACHV2_MICROCOACHMISCONCEPTIONTABLE_NAME,
  activity: env.API_MICROCOACHV2_MICROCOACHACTIVITYTABLE_NAME,
};
const CHECK_FUNCTION = `microcoachv2FinalMathCheck-${env.ENV}`;
const REVIEWER_GROUP = 'Admins';
// A RUNNING correction older than this is taken to have died (the Lambda
// itself stops at 15 minutes), so a new one may start.
const STALE_AFTER_MS = 16 * 60 * 1000;
// The knowledge graph's strategies: reference data nobody is shown, left out
// of what the model reads, as the check does.
const NOT_SHOWN = new Set(['lvnFactors']);

const db = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});
const lambda = new LambdaClient({ region: REGION });

// ── Shared ───────────────────────────────────────────────────────────────────

/** AWSJSON (possibly double-encoded) → its object; null when it won't parse. */
function parseJson(raw) {
  let parsed = raw;
  for (let pass = 0; pass < 2 && typeof parsed === 'string'; pass += 1) {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return null;
    }
  }
  return parsed ?? null;
}

const issueKey = (x) => `${x.kind}|${x.misconceptionIndex}|${x.activityIndex ?? ''}|${x.rowId}`;
const itemKey = (x) => `${x.kind}|${x.misconceptionIndex}|${x.activityIndex ?? ''}`;

function requireReviewer(event) {
  const groups = event.identity?.claims?.['cognito:groups'] ?? [];
  if (!Array.isArray(groups) || !groups.includes(REVIEWER_GROUP)) {
    throw new Error('Only reviewers can change generated results');
  }
}

async function getSession(sessionId) {
  const { Item } = await db.send(new GetCommand({ TableName: TABLES.session, Key: { id: sessionId } }));
  if (!Item) throw new Error(`Session ${sessionId} not found`);
  return Item;
}

function loadOutput(session) {
  const output = parseJson(session.pipelineOutput);
  if (!output || !Array.isArray(output.misconceptions)) {
    throw new Error(`Session ${session.id} has no stored pipeline output`);
  }
  return output;
}

/** The misconception or activity an issue or edit points at. */
function itemOf(output, x) {
  const m = output.misconceptions[x.misconceptionIndex];
  if (!m) throw new Error(`No misconception at ${x.misconceptionIndex}`);
  if (x.kind === 'misconception') return m;
  if (x.kind === 'activity') {
    const a = m.activities?.[x.activityIndex];
    if (!a) throw new Error(`No activity at ${x.misconceptionIndex}-${x.activityIndex}`);
    return a;
  }
  throw new Error(`Unknown kind: ${x.kind}`);
}

async function setSessionFields(sessionId, fields) {
  const names = {};
  const values = { ':now': new Date().toISOString() };
  const sets = ['updatedAt = :now'];
  Object.entries(fields).forEach(([key, value], n) => {
    names[`#f${n}`] = key;
    values[`:v${n}`] = value;
    sets.push(`#f${n} = :v${n}`);
  });
  const { Attributes } = await db.send(new UpdateCommand({
    TableName: TABLES.session,
    Key: { id: sessionId },
    UpdateExpression: `SET ${sets.join(', ')}`,
    ConditionExpression: 'attribute_exists(id)',
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    ReturnValues: 'ALL_NEW',
  }));
  return Attributes;
}

async function rowsBySession(table, sessionId) {
  const items = [];
  let ExclusiveStartKey;
  do {
    const page = await db.send(new QueryCommand({
      TableName: table,
      IndexName: 'bySession',
      KeyConditionExpression: 'sessionId = :s',
      ExpressionAttributeValues: { ':s': sessionId },
      ExclusiveStartKey,
    }));
    items.push(...(page.Items ?? []));
    ExclusiveStartKey = page.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

// AWSJSON row fields can be stored as a map or as a string: edit either, and
// write each back the way it was found.
const JSON_FIELDS = new Set(['phases', 'studentWork', 'routine']);
function openRow(row) {
  const open = { ...row, _asString: new Set() };
  JSON_FIELDS.forEach((field) => {
    if (typeof row[field] === 'string') {
      open[field] = parseJson(row[field]);
      open._asString.add(field);
    }
  });
  return open;
}

async function writeRowFields(table, row, fields) {
  const unique = [...new Set(fields)];
  if (unique.length === 0) return;
  const names = {};
  const values = { ':now': new Date().toISOString() };
  const sets = ['updatedAt = :now'];
  unique.forEach((field, n) => {
    names[`#f${n}`] = field;
    values[`:v${n}`] = row._asString.has(field) ? JSON.stringify(row[field]) : row[field];
    sets.push(`#f${n} = :v${n}`);
  });
  await db.send(new UpdateCommand({
    TableName: table,
    Key: { id: row.id },
    UpdateExpression: `SET ${sets.join(', ')}`,
    ConditionExpression: 'attribute_exists(id)',
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
  }));
}

/**
 * Writes `changes` ([{ kind, misconceptionIndex, activityIndex, rowId, value }],
 * values already of the right type) into pipelineOutput and the teacher's rows.
 * Reads the session fresh, so it applies on top of whatever is there now.
 */
async function applyValues(sessionId, changes) {
  const session = await getSession(sessionId);
  const output = loadOutput(session);
  changes.forEach((c) => setAt(itemOf(output, c), c.rowId, c.value));

  const [mRows, aRows] = await Promise.all([
    rowsBySession(TABLES.misconception, sessionId),
    rowsBySession(TABLES.activity, sessionId),
  ]);
  const opened = new Map();
  const open = (row) => {
    if (!opened.has(row.id)) opened.set(row.id, { row: openRow(row), fields: [] });
    return opened.get(row.id);
  };
  const tableOf = new Map();
  for (const c of changes) {
    const m = output.misconceptions[c.misconceptionIndex];
    const mRow = findMisconceptionRow(mRows, m);
    if (!mRow) continue;
    if (c.kind === 'misconception') {
      const entry = open(mRow);
      entry.fields.push(...applyToMisconceptionRow(entry.row, m, c.rowId, c.value));
      tableOf.set(mRow.id, TABLES.misconception);
    } else {
      const aRow = findActivityRow(aRows, mRow, m.activities[c.activityIndex]);
      if (!aRow) continue;
      const entry = open(aRow);
      try {
        entry.fields.push(...applyToActivityRow(entry.row, c.rowId, c.value));
      } catch (err) {
        // The row's phases no longer match the stored output there: leave the
        // row as it is rather than fail the other writes.
        console.warn(`Activity row ${aRow.id}: ${err.message}`);
      }
      tableOf.set(aRow.id, TABLES.activity);
    }
  }

  await setSessionFields(sessionId, { pipelineOutput: JSON.stringify(output) });
  await Promise.all([...opened.entries()].map(([id, { row, fields }]) => writeRowFields(tableOf.get(id), row, fields)));
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

async function structuredCall(label, prompt, schema, name) {
  const client = await openai();
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    response_format: zodResponseFormat(schema, name),
  });
  const choice = completion.choices[0];
  if (choice?.finish_reason === 'length') throw new Error(`${label}: the response was cut off`);
  if (choice?.message?.refusal) throw new Error(`${label}: the model declined: ${choice.message.refusal}`);
  const raw = choice?.message?.content;
  if (!raw) throw new Error(`${label}: empty completion content`);
  return schema.parse(JSON.parse(raw));
}

const Replacement = z.object({
  fixed: z.boolean().describe('False when the value cannot be made correct on its own'),
  value: z.string().describe('The corrected value, or the original when fixed is false'),
  note: z.string().describe('What was changed and why, in one sentence'),
});

function shown(value) {
  if (Array.isArray(value)) return value.map(shown);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => !NOT_SHOWN.has(key))
      .map(([key, child]) => [key, shown(child)]));
  }
  return value;
}

/** The assessment questions a misconception links to, as text, for context. */
async function questionsFor(session, m) {
  if (!session.ppqAssessmentId) return '';
  const { Item } = await db.send(new GetCommand({ TableName: TABLES.assessment, Key: { id: session.ppqAssessmentId } }));
  const questions = Item?.questions ?? [];
  const linked = new Set((m.wrongAnswers ?? []).map((w) => Number(w.questionNumber)));
  const chosen = questions.filter((q) => linked.has(Number(q.questionNumber)));
  return (chosen.length ? chosen : questions).map((q) => {
    const options = (q.answerChoices ?? []).map((o) => `  ${o.letter}) ${o.content ?? ''}`).join('\n');
    return `Question ${q.questionNumber}: ${q.questionText ?? ''}${options ? `\n${options}` : ''}${q.correctAnswer ? `\nKeyed answer: ${q.correctAnswer}` : ''}`;
  }).join('\n\n');
}

// ── Correct ──────────────────────────────────────────────────────────────────

const argJson = (value) => (typeof value === 'string' ? parseJson(value) : value);

async function startCorrect(event, context) {
  requireReviewer(event);
  const { sessionId } = event.arguments;
  const requested = argJson(event.arguments.issues);
  if (!Array.isArray(requested) || requested.length === 0) throw new Error('No issues to correct');

  const session = await getSession(sessionId);
  loadOutput(session);
  const current = parseJson(session.mathCorrect);
  if (current?.status === 'RUNNING' && Date.now() - Date.parse(current.startedAt ?? '') < STALE_AFTER_MS) {
    return session;
  }
  // Each issue is taken from the stored check, so its text and working are the
  // check's own and not whatever the page sent.
  const stored = new Map((parseJson(session.mathCheck)?.issues ?? []).map((issue) => [issueKey(issue), issue]));
  const issues = requested.map((r) => stored.get(issueKey(r))).filter(Boolean);
  if (issues.length === 0) throw new Error('None of these issues are in the latest math check');

  const runId = `${Date.now()}`;
  const updated = await setSessionFields(sessionId, {
    mathCorrect: JSON.stringify({ status: 'RUNNING', runId, startedAt: new Date().toISOString(), requested: issues.length }),
  });
  await lambda.send(new InvokeCommand({
    FunctionName: context.functionName,
    InvocationType: 'Event',
    Payload: Buffer.from(JSON.stringify({ run: 'correct', sessionId, runId, issues })),
  }));
  console.log(`Started correction ${runId}: ${issues.length} issues`);
  return updated;
}

/** One item's replacements from the model: [{ issue, value, before, note }] and what it couldn't fix. */
async function correctItem(session, output, issues) {
  const first = issues[0];
  const item = itemOf(output, first);
  const m = output.misconceptions[first.misconceptionIndex];
  const isMisconception = first.kind === 'misconception';
  let material = item;
  if (isMisconception) {
    const { activities, ...analysis } = item;
    material = analysis;
  }
  const values = issues.map((issue) => ({ rowId: issue.rowId, text: String(getAt(item, issue.rowId) ?? issue.text), why: issue.why }));
  const label = `${first.kind} ${first.misconceptionIndex}-${first.activityIndex ?? ''}`;
  const schema = z.object(Object.fromEntries(values.map((_, n) => [`v${n}`, Replacement])));
  const answer = await structuredCall(label, correctPromptFor({
    what: isMisconception
      ? 'the analysis of one misconception found in a class\'s answers to a multiple-choice assessment'
      : `a classroom activity written to address the misconception "${m.title ?? ''}"`,
    material: shown(material),
    questions: isMisconception ? await questionsFor(session, m) : '',
    values,
  }), schema, 'corrections');

  const changes = [];
  const notFixed = [];
  issues.forEach((issue, n) => {
    const reply = answer[`v${n}`];
    const original = getAt(item, issue.rowId);
    if (original === undefined) {
      notFixed.push({ ...issue, reason: 'The value is no longer there' });
    } else if (!reply.fixed || reply.value === String(original)) {
      notFixed.push({ ...issue, reason: reply.note || 'The corrector left it unchanged' });
    } else {
      try {
        const value = coerceLike(original, reply.value, issue.rowId);
        changes.push({ ...issue, value, before: original, note: reply.note });
      } catch (err) {
        notFixed.push({ ...issue, reason: err.message });
      }
    }
  });
  return { changes, notFixed };
}

/** The check lambda's own `item` step, on an item that changed. */
async function recheck(sessionId, x) {
  const resp = await lambda.send(new InvokeCommand({
    FunctionName: CHECK_FUNCTION,
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(JSON.stringify({
      sessionId, step: 'item', runId: 'correct', kind: x.kind, i: x.misconceptionIndex, j: x.activityIndex ?? null,
    })),
  }));
  const body = Buffer.from(resp.Payload).toString('utf8');
  if (resp.FunctionError) throw new Error(`Re-check failed: ${body}`);
  return JSON.parse(body);
}

/** The check's summary line, rebuilt after some items' issues were replaced. */
function summaryAfter(check) {
  const n = check.issues.length;
  const unchecked = check.itemsUnchecked ?? 0;
  const base = n === 0 ? 'No math issues left after correction' : `${n} math issue${n === 1 ? '' : 's'} left after correction`;
  return unchecked > 0 ? `${base}; ${unchecked} not checked` : base;
}

async function runCorrect({ sessionId, runId, issues }) {
  const finish = async (fields) => {
    const current = parseJson((await getSession(sessionId)).mathCorrect);
    if (current?.runId !== runId) return; // a newer correction replaced this one
    await setSessionFields(sessionId, {
      mathCorrect: JSON.stringify({ ...current, ...fields, finishedAt: new Date().toISOString() }),
    });
  };
  try {
    const session = await getSession(sessionId);
    const output = loadOutput(session);
    const byItem = new Map();
    issues.forEach((issue) => byItem.set(itemKey(issue), [...(byItem.get(itemKey(issue)) ?? []), issue]));

    const results = await Promise.all([...byItem.values()].map((group) => correctItem(session, output, group)
      .catch((err) => ({ changes: [], notFixed: group.map((issue) => ({ ...issue, reason: err.message })) }))));
    const changes = results.flatMap((r) => r.changes);
    const notFixed = results.flatMap((r) => r.notFixed);
    if (changes.length > 0) await applyValues(sessionId, changes);
    console.log(`Correction ${runId}: ${changes.length} values changed, ${notFixed.length} not fixed`);

    // Re-check every item that changed, then put its fresh issues in place of its old ones.
    const changedItems = [...new Map(changes.map((c) => [itemKey(c), c])).values()];
    const rechecks = await Promise.all(changedItems.map((x) => recheck(sessionId, x)
      .then((result) => ({ x, result }))
      .catch((err) => ({ x, error: err.message }))));
    const check = parseJson((await getSession(sessionId)).mathCheck) ?? { issues: [] };
    const rechecked = new Set(rechecks.filter((r) => r.result).map((r) => itemKey(r.x)));
    const fresh = rechecks.filter((r) => r.result).flatMap(({ x, result }) => (result.issues ?? []).map((issue) => ({
      kind: x.kind,
      misconceptionIndex: x.misconceptionIndex,
      activityIndex: x.activityIndex ?? null,
      misconceptionTitle: result.misconceptionTitle ?? x.misconceptionTitle ?? '',
      templateId: result.templateId ?? x.templateId ?? '',
      ...issue,
    })));
    check.issues = [...check.issues.filter((issue) => !rechecked.has(itemKey(issue))), ...fresh];
    check.summary = summaryAfter(check);
    await setSessionFields(sessionId, { mathCheck: JSON.stringify(check) });

    const flaggedAgain = new Set(fresh.map(issueKey));
    const recheckFailed = new Set(rechecks.filter((r) => r.error).map((r) => itemKey(r.x)));
    const strip = ({ value, ...c }) => ({ ...c, before: String(c.before), after: String(value) });
    await finish({
      status: 'DONE',
      fixed: changes.filter((c) => !flaggedAgain.has(issueKey(c)) && !recheckFailed.has(itemKey(c))).map(strip),
      stillFlagged: changes.filter((c) => flaggedAgain.has(issueKey(c))).map(strip),
      notRechecked: changes.filter((c) => recheckFailed.has(itemKey(c))).map(strip),
      notFixed,
    });
  } catch (err) {
    console.error(`Correction ${runId} FAILED:`, err);
    await finish({ status: 'FAILED', error: String(err?.message ?? err).slice(0, 1000) });
  }
}

// ── Hand edits ───────────────────────────────────────────────────────────────

async function applyEdits(event) {
  requireReviewer(event);
  const { sessionId } = event.arguments;
  const edits = argJson(event.arguments.edits);
  if (!Array.isArray(edits) || edits.length === 0) throw new Error('No edits to apply');

  // Every edit is checked before anything is written: all or nothing.
  const output = loadOutput(await getSession(sessionId));
  const changes = edits.map((edit) => {
    const original = getAt(itemOf(output, edit), edit.rowId);
    if (typeof original !== 'string') throw new Error(`${edit.rowId} is not text, so it can't be edited by hand`);
    if (typeof edit.value !== 'string' || edit.value.trim() === '') throw new Error(`The edit to ${edit.rowId} is empty`);
    return { ...edit, value: edit.value };
  });
  await applyValues(sessionId, changes);
  console.log(`Session ${sessionId}: ${changes.length} hand edits written`);
  return getSession(sessionId);
}

export const handler = async (event, context) => {
  if (event?.run === 'correct') return runCorrect(event);
  const field = event?.fieldName ?? event?.info?.fieldName;
  if (field === 'correctSessionMath') return startCorrect(event, context);
  if (field === 'applySessionEdits') return applyEdits(event);
  throw new Error(`Unknown request: ${JSON.stringify({ field, run: event?.run })}`);
};
