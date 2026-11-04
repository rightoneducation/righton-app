/* Amplify Params - DO NOT EDIT
	API_MICROCOACHV2_GRAPHQLAPIIDOUTPUT
	API_MICROCOACHV2_MICROCOACHASSESSMENTTABLE_ARN
	API_MICROCOACHV2_MICROCOACHASSESSMENTTABLE_NAME
	API_MICROCOACHV2_MICROCOACHSESSIONTABLE_ARN
	API_MICROCOACHV2_MICROCOACHSESSIONTABLE_NAME
	API_MICROCOACHV2_MICROCOACHSTUDENTRESPONSETABLE_ARN
	API_MICROCOACHV2_MICROCOACHSTUDENTRESPONSETABLE_NAME
	API_MICROCOACHV2_MICROCOACHUPLOADTABLE_ARN
	API_MICROCOACHV2_MICROCOACHUPLOADTABLE_NAME
	ENV
	FUNCTION_MICROCOACHV2UPLOADGENERATE_NAME
	REGION
	STORAGE_MICROCOACHUPLOADS_BUCKETNAME
Amplify Params - DO NOT EDIT */

/**
 * microcoachv2UploadIngest: ingests one submitted MIU file pair.
 *
 * Invoked with { uploadId }: by microcoachv2UploadDispatch when the
 * MicroCoachUpload row is created, or by hand to rerun one (set the row back
 * to RECEIVED first). Every entry goes through the same claim, a conditional
 * RECEIVED -> INGESTING update, so an upload is never ingested twice: a
 * duplicate dispatch, Lambda's own async retries, or a rerun of a row that is
 * mid-flight all stop at the claim.
 *
 * Writes DynamoDB directly rather than through AppSync. The app still reads
 * through AppSync, so rows written here must keep the API's shape.
 *
 * Reads both files from S3, parses them, checks they belong together, then writes
 * the assessment, each student's responses and the session's fields, then starts
 * generation for an MIU 1 (microcoachv2UploadGenerate). Rows are written before the
 * session points at them, and their ids come from the upload, so a rerun after a
 * partial failure overwrites.
 *
 * Failures end as FAILED with the error on the row, plus an email. The handler
 * never rethrows: a retry would only stop at the claim.
 */

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { DynamoDBClient, ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { parseResults } from './util/parse-excel.mjs';
import { parseMiuDoc } from './util/parseMiuDoc.mjs';
import { checkAgreement, checkResults } from './util/checkUpload.mjs';
import { buildRows } from './util/buildRows.mjs';
import { sendEmail } from './util/send-email.mjs';

const REGION = process.env.REGION;
const UPLOAD_TABLE = process.env.API_MICROCOACHV2_MICROCOACHUPLOADTABLE_NAME;
const ASSESSMENT_TABLE = process.env.API_MICROCOACHV2_MICROCOACHASSESSMENTTABLE_NAME;
const RESPONSE_TABLE = process.env.API_MICROCOACHV2_MICROCOACHSTUDENTRESPONSETABLE_NAME;
const SESSION_TABLE = process.env.API_MICROCOACHV2_MICROCOACHSESSIONTABLE_NAME;
const BUCKET = process.env.STORAGE_MICROCOACHUPLOADS_BUCKETNAME;
const BATCH_SIZE = 25; // DynamoDB's limit per BatchWrite
const BATCH_RETRIES = 5;

const s3 = new S3Client({ region: REGION });
const lambda = new LambdaClient({ region: REGION });
const db = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));

const Status = {
  RECEIVED: 'RECEIVED',
  INGESTING: 'INGESTING',
  INGESTED: 'INGESTED',
  FAILED: 'FAILED',
};

// RECEIVED -> INGESTING, only if still RECEIVED. Resolves to the claimed row,
// or null when another run has it or it has already finished.
async function claim(uploadId) {
  try {
    const { Attributes } = await db.send(
      new UpdateCommand({
        TableName: UPLOAD_TABLE,
        Key: { id: uploadId },
        UpdateExpression: 'SET #status = :to, updatedAt = :now REMOVE #error',
        ConditionExpression: 'attribute_exists(id) AND #status = :from',
        ExpressionAttributeNames: { '#status': 'status', '#error': 'error' },
        ExpressionAttributeValues: {
          ':from': Status.RECEIVED,
          ':to': Status.INGESTING,
          ':now': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
      }),
    );
    return Attributes;
  } catch (err) {
    if (err instanceof ConditionalCheckFailedException) return null;
    throw err;
  }
}

async function finish(uploadId, status, error) {
  await db.send(
    new UpdateCommand({
      TableName: UPLOAD_TABLE,
      Key: { id: uploadId },
      UpdateExpression: error
        ? 'SET #status = :status, updatedAt = :now, #error = :error'
        : 'SET #status = :status, updatedAt = :now',
      ExpressionAttributeNames: error
        ? { '#status': 'status', '#error': 'error' }
        : { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': status,
        ':now': new Date().toISOString(),
        ...(error ? { ':error': error } : {}),
      },
    }),
  );
}

async function fetchObject(key) {
  const response = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const chunks = [];
  for await (const chunk of response.Body) chunks.push(chunk);
  return Buffer.concat(chunks);
}

// Writes every item, retrying whatever DynamoDB hands back as unprocessed.
async function batchPut(table, items) {
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    let pending = { [table]: items.slice(i, i + BATCH_SIZE).map((Item) => ({ PutRequest: { Item } })) };
    for (let attempt = 0; pending?.[table]?.length; attempt += 1) {
      if (attempt > BATCH_RETRIES) throw new Error(`Could not write all rows to ${table}`);
      if (attempt > 0) await new Promise((resolve) => { setTimeout(resolve, 200 * 2 ** attempt); });
      const { UnprocessedItems } = await db.send(new BatchWriteCommand({ RequestItems: pending }));
      pending = UnprocessedItems;
    }
  }
}

// Sets only the given fields, on a session that must already exist.
async function updateSession(sessionId, fields, now) {
  const all = { ...fields, updatedAt: now };
  const keys = Object.keys(all);
  await db.send(
    new UpdateCommand({
      TableName: SESSION_TABLE,
      Key: { id: sessionId },
      UpdateExpression: `SET ${keys.map((k) => `#${k} = :${k}`).join(', ')}`,
      ConditionExpression: 'attribute_exists(id)',
      ExpressionAttributeNames: Object.fromEntries(keys.map((k) => [`#${k}`, k])),
      ExpressionAttributeValues: Object.fromEntries(keys.map((k) => [`:${k}`, all[k]])),
    }),
  );
}

async function ingest(upload) {
  const [docxBuffer, xlsxBuffer] = await Promise.all([
    fetchObject(upload.docxKey),
    fetchObject(upload.xlsxKey),
  ]);
  console.log(`Fetched ${docxBuffer.length} + ${xlsxBuffer.length} bytes`);

  const results = parseResults(xlsxBuffer);
  checkResults(results, upload.assessmentType);
  console.log(
    'Responses parsed:',
    JSON.stringify({
      assessmentCode: results.assessmentCode,
      weekNumber: results.weekNumber,
      section: results.section,
      students: results.students.length,
      questions: results.questions.length,
    }),
  );

  const doc = await parseMiuDoc(docxBuffer, results.assessmentToken);
  checkAgreement(results, doc);
  doc.warnings.forEach((warning) => console.warn(`Document: ${warning}`));
  console.log(
    'Document parsed:',
    JSON.stringify(
      doc.questions.map((q) => ({
        docxQuestion: q.docxQuestion,
        standard: q.standard,
        correctAnswer: q.correctAnswer,
        options: q.answerChoices.length,
      })),
    ),
  );

  const now = new Date().toISOString();
  const { assessment, responses, sessionFields } = buildRows(upload, results, doc, now);
  await db.send(new PutCommand({ TableName: ASSESSMENT_TABLE, Item: assessment }));
  await batchPut(RESPONSE_TABLE, responses);
  await updateSession(upload.sessionId, sessionFields, now);
  console.log(
    `Wrote assessment ${assessment.id}, ${responses.length} responses, session ${upload.sessionId}`,
  );
}

export const handler = async (event) => {
  const uploadId = event?.uploadId;
  if (!uploadId) {
    console.error('No uploadId in the event:', JSON.stringify(event));
    return;
  }

  const upload = await claim(uploadId);
  if (!upload) {
    console.log(`Upload ${uploadId} is not RECEIVED (taken, finished or missing); skipping`);
    return;
  }
  console.log(
    `Claimed upload ${uploadId}:`,
    JSON.stringify({
      sessionId: upload.sessionId,
      classId: upload.classId,
      assessmentType: upload.assessmentType,
    }),
  );

  try {
    await ingest(upload);
    await finish(uploadId, Status.INGESTED);
    console.log(`Upload ${uploadId} INGESTED`);
    // Inside the try: if generation can't be started, this ends as FAILED and emails,
    // rather than leaving the row looking fine with nothing running.
    if (upload.assessmentType === 'PPQ') {
      await lambda.send(
        new InvokeCommand({
          FunctionName: process.env.FUNCTION_MICROCOACHV2UPLOADGENERATE_NAME,
          InvocationType: 'Event',
          Payload: Buffer.from(JSON.stringify({ uploadId })),
        }),
      );
      console.log(`Started generation for upload ${uploadId}`);
    }
  } catch (err) {
    const message = String(err?.message ?? err).slice(0, 1000);
    console.error(`Upload ${uploadId} FAILED:`, err);
    await finish(uploadId, Status.FAILED, message).catch((e) =>
      console.error('Could not mark the upload FAILED:', e),
    );
    const lines = [
      `Upload: ${uploadId}`,
      `Session: ${upload.sessionId}`,
      `Class: ${upload.classId}`,
      `Type: ${upload.assessmentType}`,
      `Exemplar: ${upload.docxKey}`,
      `Responses: ${upload.xlsxKey}`,
      '',
      `Error: ${message}`,
      '',
      'The files are still in S3. To rerun: set the row back to RECEIVED and invoke this function with { "uploadId": "..." }.',
    ];
    await sendEmail(
      `MicroCoach ingest failed (${process.env.ENV})`,
      null,
      lines.join('\n'),
    ).catch((e) => console.error('Could not send the failure email:', e));
  }
};
