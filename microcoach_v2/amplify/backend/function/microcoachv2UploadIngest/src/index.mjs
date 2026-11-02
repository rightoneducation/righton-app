/* Amplify Params - DO NOT EDIT
	API_MICROCOACHV2_GRAPHQLAPIIDOUTPUT
	API_MICROCOACHV2_MICROCOACHUPLOADTABLE_ARN
	API_MICROCOACHV2_MICROCOACHUPLOADTABLE_NAME
	ENV
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
 * Piece 1 (current): read both files from S3, parse them, log what came out.
 * Writing students, the assessment and responses, and starting generation,
 * come later.
 *
 * Failures end as FAILED with the error on the row, plus an email. The handler
 * never rethrows: a retry would only stop at the claim.
 */

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient, ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import mammoth from 'mammoth';
import { parseExcelBuffer } from './util/parse-excel.mjs';
import { parsePpqTable } from './util/parsePpqTable.mjs';
import { sendEmail } from './util/send-email.mjs';

const REGION = process.env.REGION;
const UPLOAD_TABLE = process.env.API_MICROCOACHV2_MICROCOACHUPLOADTABLE_NAME;
const BUCKET = process.env.STORAGE_MICROCOACHUPLOADS_BUCKETNAME;

const s3 = new S3Client({ region: REGION });
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

async function ingest(upload) {
  const [docxBuffer, xlsxBuffer] = await Promise.all([
    fetchObject(upload.docxKey),
    fetchObject(upload.xlsxKey),
  ]);
  console.log(`Fetched ${docxBuffer.length} + ${xlsxBuffer.length} bytes`);

  const { value } = await mammoth.extractRawText({ buffer: docxBuffer });
  const docText = value.trim();
  if (!docText) throw new Error('No text could be extracted from the exemplar (.docx)');

  const parsed = parseExcelBuffer(xlsxBuffer);
  console.log(
    'Responses parsed:',
    JSON.stringify({
      assessmentCode: parsed.assessmentCode,
      weekNumber: parsed.weekNumber,
      students: parsed.students.length,
      questions: parsed.questionMeta.length,
    }),
  );

  const answerKey = parsePpqTable(docText);
  console.log('Answer key parsed:', JSON.stringify(answerKey));
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
