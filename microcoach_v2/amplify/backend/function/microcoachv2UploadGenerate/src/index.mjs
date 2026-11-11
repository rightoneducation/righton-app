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
	API_MICROCOACHV2_MICROCOACHSTUDENTRESPONSETABLE_ARN
	API_MICROCOACHV2_MICROCOACHSTUDENTRESPONSETABLE_NAME
	API_MICROCOACHV2_MICROCOACHUPLOADTABLE_ARN
	API_MICROCOACHV2_MICROCOACHUPLOADTABLE_NAME
	ENV
	FUNCTION_MICROCOACHV2GETLEARNINGSCIENCE_NAME
	FUNCTION_MICROCOACHV2LLMGENINSTRNEED_NAME
	FUNCTION_MICROCOACHV2LLMGENMISCONCEPTION_NAME
	FUNCTION_MICROCOACHV2LLMSELECTTEMPLATE_NAME
	FUNCTION_MICROCOACHV2NEXTSTEPOPTION_NAME
	FUNCTION_MICROCOACHV2SCORESCALC_NAME
	REGION
Amplify Params - DO NOT EDIT */

/**
 * microcoachv2UploadGenerate: generates an ingested MIU 1 upload's misconceptions
 * and activities, and moves its session to GENERATED.
 *
 * Invoked with { uploadId } by microcoachv2UploadIngest, or by hand to rerun one (set
 * the row back to INGESTED first). The same claim as ingest, INGESTED -> GENERATING,
 * means a duplicate or retried invocation stops there. A run killed by the timeout
 * therefore stays visibly at GENERATING.
 *
 * Writes DynamoDB directly, in the shape the app reads through AppSync. The session's
 * old rows are replaced only after the whole pipeline has succeeded, and the session
 * moves on last, so the app never sees a half-written result. Failures end as FAILED
 * with an email; the session stays waiting.
 */

import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { DynamoDBClient, ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { runPipeline } from './util/pipeline.mjs';
import { buildRows } from './util/buildRows.mjs';
import { sendEmail } from './util/send-email.mjs';

const { env } = process;
const REGION = env.REGION;
// Where the "generation finished" email's review link points. Local for now:
// switch to https://prototype.microcoach.com before building to the prototype.
const REVIEW_BASE_URL = 'http://localhost:3000';
const TABLES = {
  upload: env.API_MICROCOACHV2_MICROCOACHUPLOADTABLE_NAME,
  assessment: env.API_MICROCOACHV2_MICROCOACHASSESSMENTTABLE_NAME,
  response: env.API_MICROCOACHV2_MICROCOACHSTUDENTRESPONSETABLE_NAME,
  session: env.API_MICROCOACHV2_MICROCOACHSESSIONTABLE_NAME,
  misconception: env.API_MICROCOACHV2_MICROCOACHMISCONCEPTIONTABLE_NAME,
  activity: env.API_MICROCOACHV2_MICROCOACHACTIVITYTABLE_NAME,
};
const STAGES = {
  learningScience: env.FUNCTION_MICROCOACHV2GETLEARNINGSCIENCE_NAME,
  genMisconception: env.FUNCTION_MICROCOACHV2LLMGENMISCONCEPTION_NAME,
  scoresCalc: env.FUNCTION_MICROCOACHV2SCORESCALC_NAME,
  genInstrNeed: env.FUNCTION_MICROCOACHV2LLMGENINSTRNEED_NAME,
  selectTemplate: env.FUNCTION_MICROCOACHV2LLMSELECTTEMPLATE_NAME,
  nextStepOption: env.FUNCTION_MICROCOACHV2NEXTSTEPOPTION_NAME,
};
const BATCH_SIZE = 25; // DynamoDB's limit per BatchWrite
const BATCH_RETRIES = 5;

const lambda = new LambdaClient({ region: REGION });
const db = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});

async function invokeStage(stage, payload) {
  const resp = await lambda.send(new InvokeCommand({
    FunctionName: STAGES[stage],
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(JSON.stringify(payload)),
  }));
  const body = Buffer.from(resp.Payload).toString('utf8');
  if (resp.FunctionError) throw new Error(`${stage} error: ${body}`);
  return JSON.parse(body);
}

async function claim(uploadId) {
  try {
    const { Attributes } = await db.send(new UpdateCommand({
      TableName: TABLES.upload,
      Key: { id: uploadId },
      UpdateExpression: 'SET #status = :to, updatedAt = :now REMOVE #error',
      ConditionExpression: 'attribute_exists(id) AND #status = :from',
      ExpressionAttributeNames: { '#status': 'status', '#error': 'error' },
      ExpressionAttributeValues: { ':from': 'INGESTED', ':to': 'GENERATING', ':now': new Date().toISOString() },
      ReturnValues: 'ALL_NEW',
    }));
    return Attributes;
  } catch (err) {
    if (err instanceof ConditionalCheckFailedException) return null;
    throw err;
  }
}

async function finish(uploadId, status, error) {
  const names = { '#status': 'status', ...(error ? { '#error': 'error' } : {}) };
  await db.send(new UpdateCommand({
    TableName: TABLES.upload,
    Key: { id: uploadId },
    UpdateExpression: `SET #status = :status, updatedAt = :now${error ? ', #error = :error' : ''}`,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: {
      ':status': status,
      ':now': new Date().toISOString(),
      ...(error ? { ':error': error } : {}),
    },
  }));
}

async function getRow(table, id, what) {
  const { Item } = await db.send(new GetCommand({ TableName: table, Key: { id } }));
  if (!Item) throw new Error(`${what} ${id} not found`);
  return Item;
}

async function queryAll(table, indexName, field, value, projection) {
  const items = [];
  let ExclusiveStartKey;
  do {
    const page = await db.send(new QueryCommand({
      TableName: table,
      IndexName: indexName,
      KeyConditionExpression: '#k = :v',
      ExpressionAttributeNames: { '#k': field },
      ExpressionAttributeValues: { ':v': value },
      ...(projection && { ProjectionExpression: projection }),
      ExclusiveStartKey,
    }));
    items.push(...(page.Items ?? []));
    ExclusiveStartKey = page.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

async function batchWrite(table, requests) {
  for (let i = 0; i < requests.length; i += BATCH_SIZE) {
    let pending = { [table]: requests.slice(i, i + BATCH_SIZE) };
    for (let attempt = 0; pending?.[table]?.length; attempt += 1) {
      if (attempt > BATCH_RETRIES) throw new Error(`Could not finish writing to ${table}`);
      if (attempt > 0) await new Promise((resolve) => { setTimeout(resolve, 200 * 2 ** attempt); });
      const { UnprocessedItems } = await db.send(new BatchWriteCommand({ RequestItems: pending }));
      pending = UnprocessedItems;
    }
  }
}

/** Swaps the session's misconceptions and activities for the new ones. */
async function replaceRows(sessionId, rows) {
  const deletes = async (table) => {
    const old = await queryAll(table, 'bySession', 'sessionId', sessionId, 'id');
    return old.map(({ id }) => ({ DeleteRequest: { Key: { id } } }));
  };
  const puts = (items) => items.map((Item) => ({ PutRequest: { Item } }));
  await batchWrite(TABLES.activity, await deletes(TABLES.activity));
  await batchWrite(TABLES.misconception, await deletes(TABLES.misconception));
  await batchWrite(TABLES.misconception, puts(rows.misconceptions));
  await batchWrite(TABLES.activity, puts(rows.activities));
}

async function generate(upload) {
  const [session, assessment, responses] = await Promise.all([
    getRow(TABLES.session, upload.sessionId, 'Session'),
    getRow(TABLES.assessment, upload.id, 'Assessment'),
    queryAll(TABLES.response, 'byAssessment', 'assessmentId', upload.id),
  ]);
  if (!responses.length) throw new Error(`Assessment ${upload.id} has no student responses`);

  // No names: within a run, a student is their spreadsheet row.
  const studentResponses = responses
    .sort((a, b) => a.studentRef - b.studentRef)
    .map((r) => ({ studentId: `Student ${r.studentRef}`, questionResponses: r.questionResponses }));

  const output = await runPipeline({ session, assessment, studentResponses, invoke: invokeStage });

  const now = new Date().toISOString();
  const rows = buildRows(session, output, studentResponses, now);
  await replaceRows(session.id, rows);
  await db.send(new UpdateCommand({
    TableName: TABLES.session,
    Key: { id: session.id },
    // A rerun's pick pointed at a row that no longer exists.
    // DRAFT holds the results back from the teacher until a reviewer publishes
    // them on /prepublishreview, which reads the raw output stored alongside
    // (the misconception/activity rows keep only what the teacher sees).
    UpdateExpression:
      'SET #status = :status, publishStatus = :draft, pipelineOutput = :output, updatedAt = :now REMOVE selectedMisconceptionId',
    ConditionExpression: 'attribute_exists(id)',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': 'GENERATED',
      ':draft': 'DRAFT',
      ':output': JSON.stringify(output),
      ':now': now,
    },
  }));
  return rows;
}

export const handler = async (event) => {
  const uploadId = event?.uploadId;
  if (!uploadId) {
    console.error('No uploadId in the event:', JSON.stringify(event));
    return;
  }

  const upload = await claim(uploadId);
  if (!upload) {
    console.log(`Upload ${uploadId} is not INGESTED (taken, finished or missing); skipping`);
    return;
  }
  const details = [
    `Upload: ${uploadId}`,
    `Session: ${upload.sessionId}`,
    `Class: ${upload.classId}`,
  ];
  const envName = env.ENV;

  try {
    const rows = await generate(upload);
    await finish(uploadId, 'GENERATED');
    console.log(`Upload ${uploadId} GENERATED: ${rows.misconceptions.length} misconceptions, ${rows.activities.length} activities`);
    await sendEmail(
      `MicroCoach generation finished (${envName})`,
      null,
      [
        ...details,
        '',
        `${rows.misconceptions.length} misconceptions, ${rows.activities.length} activities.`,
        '',
        // Held as DRAFT: the teacher sees nothing until this is published.
        `Review and publish: ${REVIEW_BASE_URL}/prepublishreview/${upload.sessionId}`,
      ].join('\n'),
    ).catch((e) => console.error('Could not send the email:', e));
  } catch (err) {
    const message = String(err?.message ?? err).slice(0, 1000);
    console.error(`Upload ${uploadId} FAILED:`, err);
    await finish(uploadId, 'FAILED', message).catch((e) => console.error('Could not mark the upload FAILED:', e));
    await sendEmail(
      `MicroCoach generation failed (${envName})`,
      null,
      [
        ...details,
        '',
        `Error: ${message}`,
        '',
        'The ingested data is intact. To rerun: set the row back to INGESTED and invoke this function with { "uploadId": "..." }.',
      ].join('\n'),
    ).catch((e) => console.error('Could not send the failure email:', e));
  }
};
