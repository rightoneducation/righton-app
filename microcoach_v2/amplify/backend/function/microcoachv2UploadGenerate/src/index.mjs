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
 * Runs one step per invocation, driven by the microcoachv2Generate state machine,
 * which ingest starts with { uploadId }. To rerun one by hand, set the row back to
 * INGESTED and start an execution. The same claim as ingest, INGESTED -> GENERATING,
 * means a duplicate run stops at the first step. A step that fails or times out is
 * caught by the state machine, which runs the fail step: FAILED plus an email.
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
import {
  buildContext,
  stepMisconceptions,
  stepScore,
  stepNeeds,
  stepTemplates,
  stepActivity,
  assembleOutput
} from './util/pipeline.mjs';
import { makeStore } from './util/store.mjs';
import { buildRows } from './util/buildRows.mjs';
import { sendEmail } from './util/send-email.mjs';

const { env } = process;
const REGION = env.REGION;
const BUCKET = env.STORAGE_MICROCOACHUPLOADS_BUCKETNAME;
// Where the review link points: the hosted prototype. Use
// http://localhost:3000 to review against a local app.
const REVIEW_BASE_URL = 'https://prototype.rightoneducation.com';
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
// Publishes and emails the teacher (the reviewer's Publish). From the function's
// resource access (amplify update function); the fallback is its usual name.
const EMAIL_TEACHER = env.FUNCTION_MICROCOACHV2EMAILTEACHER_NAME || `microcoachv2EmailTeacher-${env.ENV}`;
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

/**
 * QA: asks EmailTeacher to publish straight to the teacher (its
 * AUTO_PUBLISH_FOR_QA flag decides). True only when it did; any failure leaves
 * the results as DRAFT for review.
 */
async function autoPublish(sessionId) {
  try {
    const resp = await lambda.send(new InvokeCommand({
      FunctionName: EMAIL_TEACHER,
      InvocationType: 'RequestResponse',
      Payload: Buffer.from(JSON.stringify({ action: 'autoPublish', sessionId })),
    }));
    const body = Buffer.from(resp.Payload).toString('utf8');
    if (resp.FunctionError) throw new Error(body);
    return JSON.parse(body)?.published === true;
  } catch (e) {
    console.error(`Could not auto-publish session ${sessionId}; it stays DRAFT:`, e);
    return false;
  }
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

// pull data from DynamoDB session, assessment and response and assemble in ctx object
async function loadContext(upload) {
  const [session, assessment, responses] = await Promise.all([
    getRow(TABLES.session, upload.sessionId, 'Session'),
    getRow(TABLES.assessment, upload.id, 'Assessment'),
    queryAll(TABLES.response, 'byAssessment', 'assessmentId', upload.id),
  ]);
  if(!responses.length) {
    throw new Error(`Assessment ${upload.id} has no student responses`);
  }

  const studentResponses = responses
    .sort((a,b) => a.studentRef - b.studentRef)
    .map((r) => ({
      studentId: `Student ${r.studentRef}`,
      questionResponses: r.questionResponses
    }));

  return buildContext({session, assessment, studentResponses});
}

const uploadDetails = (upload) => [
  `Upload: ${upload.id}`,
  `Session: ${upload.sessionId}`,
  `Class: ${upload.classId}`
]

async function finalize(upload, ctx, store){
  const { session, studentResponses } = ctx;
  const output = await assembleOutput({store});

  const now = new Date().toISOString();
  const rows = buildRows(session, output, studentResponses, now);
  await replaceRows(session.id, rows);
  await db.send(new UpdateCommand({
    TableName: TABLES.session,
    Key: { id: session.id},
    // DRAFT holds back content for review prior to publishing back to teacher
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
  }))
  await finish(upload.id, 'GENERATED');

  const misconceptions = rows.misconceptions.length;
  const activities = rows.activities.length;
  const counts = `${misconceptions} misconceptions, ${activities} activities`;
  console.log(`Upload ${upload.id} GENERATED: ${counts}`);
  // QA: published straight to the teacher, who EmailTeacher has emailed; no review email.
  if (await autoPublish(upload.sessionId)) {
    console.log(`Session ${upload.sessionId} auto-published (QA)`);
    return { misconceptions, activities };
  }
  await sendEmail(
    `MicroCoach generation finished (${env.ENV})`,
    null,
    [
      ...uploadDetails(upload),
      '',
      `${counts}.`,
      '',
      // held as DRAFT
      `Review and publish: ${REVIEW_BASE_URL}/prepublishreview/${upload.sessionId}`,
    ].join('\n'),
  ).catch((e) => console.error('Could not send the email:', e));

  return { misconceptions, activities };
}

// returns single line from error object
function describeError(error) {
  if (!error) return 'Unknown error';
  if (error.Error === 'States.Timeout'){
    return 'A step ran past its time limit';
  }
  try {
    // A Lambda error arrives as JSON text in Cause.
    const cause = JSON.parse(error.Cause);
    return String(cause.errorMessage ?? error.Cause);
  } catch {
    return String(error.Cause || error.Error || 'Unknown error');
  }
}

// throws failure on failed step and sends email
async function fail(uploadId, error){
  const message = describeError(error).slice(0,1000);
  console.error(`Upload ${uploadId} FAILED:`, JSON.stringify(error));

  const { Item: upload } = await db.send(new GetCommand({
    TableName: TABLES.upload,
    Key: {id: uploadId },
  }));
  if (upload?.status !== 'GENERATING'){
    const status = upload?.status ?? 'missing';
    console.log(`Upload ${uploadId} is ${status}, not GENERATING`);
    return { marked: false};
  }

  await finish(uploadId, 'FAILED', message);
  await sendEmail(
    `MicroCoach generation failed (${env.ENV})`,
    null,
    [
      ...uploadDetails(upload),
      '',
      `Error: ${message}`,
      '',
      'The ingested data is intact. To rerun: set the row back to INGESTED',
      `and start an execution of microcoachv2Generate-${env.ENV}`,
      'with { "uploadId": "..." }.',
    ].join('\n'),
  ).catch((e) => console.error('Could not send the failure email:', e));

  return {marked: true};
}

export const handler = async (event) => {
  const {uploadId, runId, step, index, pick, error} = event ?? {};
  if (!uploadId || !runId || !step){
    throw new Error(`Needs uploadId, runId and step: ${JSON.stringify(event)}`);
  }
  console.log(`Step ${step}, upload ${uploadId}, run ${runId}`);

  if (step === 'fail') return fail(uploadId, error);

  let upload;
  if (step === 'misconceptions') {
    upload = await claim(uploadId);
    if (!upload){
      console.log(`Upload ${uploadId} is not INGESTED`);
      return { claimed: false};
    }
  } else {
    upload = await getRow(TABLES.upload, uploadId, 'Upload');
  }

  const ctx = await loadContext(upload);
  const store = makeStore({bucket: BUCKET, uploadId, runId});
  const args = { ctx, store, invoke: invokeStage};

  switch (step) {
    case 'misconceptions':
      return {claimed: true, ...(await stepMisconceptions(args))};
    case 'scores':
      return stepScore(args);
    case 'needs':
      return stepNeeds(args);
    case 'templates':
      return stepTemplates(args);
    case 'activity':
      return stepActivity({...args, index, pick});
    case 'finalize':
      return finalize(upload, ctx, store);
    default:
      throw new Error(`Unknown step: ${step}`);
  }
}
