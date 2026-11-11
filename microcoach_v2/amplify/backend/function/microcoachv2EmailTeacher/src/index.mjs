/**
 * publishSession(sessionId) — the reviewer's Publish on /prepublishreview.
 *
 * Moves a session's held results from DRAFT to PUBLISHED (the teacher's Home
 * then moves on: Understand after MIU 1, Reflect after MIU 2), and emails the
 * teacher who uploaded that their results are ready.
 *
 * AppSync calls this through the schema's `publishSession` mutation
 * (@function), which already limits it to the Admins group; the check here is
 * a second line. Publishing is the job: a failed email is logged and reported
 * to the dev address, never thrown — the teacher can still see their results.
 */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { buildResultsEmail } from './util/emailTemplate.mjs';

const { env } = process;
const REGION = env.REGION || 'us-east-1';
// Table names come from the function's API access (amplify update function).
const TABLES = {
  session: env.API_MICROCOACHV2_MICROCOACHSESSIONTABLE_NAME,
  upload: env.API_MICROCOACHV2_MICROCOACHUPLOADTABLE_NAME,
  user: env.API_MICROCOACHV2_MICROCOACHUSERTABLE_NAME,
  classroom: env.API_MICROCOACHV2_MICROCOACHCLASSROOMTABLE_NAME,
};
// Same sender and dev inbox as the upload lambdas (their NOTIFY_* env vars).
const FROM_EMAIL = env.NOTIFY_FROM_EMAIL || 'noreply@rightoneducation.com';
const DEV_EMAILS = (env.NOTIFY_TO_EMAILS || 'drewjhart@gmail.com')
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean);
// Where "Log in to MicroCoach" points: the hosted prototype (as the review
// links in UploadGenerate and UploadIngest). Use http://localhost:3000 to test
// against a local app.
const APP_BASE_URL = 'https://prototype.rightoneducation.com';

const REVIEWER_GROUP = 'Admins';
// The upload status that means its results exist: MIU 1 ends GENERATED
// (UploadGenerate), MIU 2 ends INGESTED (UploadIngest does its comparison).
const DONE_STATUS = { PPQ: 'GENERATED', POST_PPQ: 'INGESTED' };

const db = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));
const ses = new SESClient({ region: REGION });

const getRow = async (table, id) =>
  id ? (await db.send(new GetCommand({ TableName: table, Key: { id } }))).Item ?? null : null;

// "…/miu-uploads/<class>/1794373174639-MIUClean.docx" → "MIUClean.docx"
const fileName = (key) => String(key ?? '').split('/').pop().replace(/^\d+-/, '');

async function sendEmail(to, { subject, html, text }) {
  await ses.send(new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: { ToAddresses: to },
    Message: {
      Subject: { Data: subject },
      Body: {
        ...(html ? { Html: { Data: html } } : {}),
        Text: { Data: text },
      },
    },
  }));
}

// Tell the dev inbox; a failure here is only logged.
const alertDev = (subject, lines) =>
  sendEmail(DEV_EMAILS, { subject: `${subject} (${env.ENV})`, text: lines.join('\n') })
    .catch((e) => console.error('Could not send the dev alert:', e));

/** The upload whose results are being published: the latest finished one of its kind. */
async function uploadFor(sessionId, kind) {
  const { Items = [] } = await db.send(new QueryCommand({
    TableName: TABLES.upload,
    IndexName: 'bySession',
    KeyConditionExpression: 'sessionId = :s',
    ExpressionAttributeValues: { ':s': sessionId },
  }));
  return Items
    .filter((u) => u.assessmentType === kind && u.status === DONE_STATUS[kind])
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] ?? null;
}

async function emailTeacher(session, kind) {
  const upload = await uploadFor(session.id, kind);
  if (!upload) throw new Error(`No finished ${kind} upload for session ${session.id}`);
  const [teacher, classroom] = await Promise.all([
    getRow(TABLES.user, upload.userId),
    getRow(TABLES.classroom, session.classId),
  ]);
  if (!teacher?.email) throw new Error(`Uploader ${upload.userId} has no email on file`);

  const email = buildResultsEmail({
    kind,
    teacherName: [teacher.firstName, teacher.lastName].filter(Boolean).join(' ') || teacher.email,
    teacherEmail: teacher.email,
    className: classroom?.name ?? 'your class',
    weekLabel: upload.weekLabel ?? null,
    docxName: fileName(upload.docxKey),
    xlsxName: fileName(upload.xlsxKey),
    loginUrl: `${APP_BASE_URL}/login`,
  });
  await sendEmail([teacher.email], email);
  console.log(`Emailed ${teacher.email}: ${kind} results for session ${session.id}`);
}

export const handler = async (event) => {
  const sessionId = event?.arguments?.sessionId;
  const groups = event?.identity?.claims?.['cognito:groups'] ?? [];
  if (!Array.isArray(groups) || !groups.includes(REVIEWER_GROUP)) {
    throw new Error('Only reviewers can publish results');
  }
  if (!sessionId) throw new Error('publishSession needs a sessionId');

  const session = await getRow(TABLES.session, sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);
  // Already published (or from before the review step): nothing to do, and no
  // second email.
  if (session.publishStatus !== 'DRAFT') return session;

  const { Attributes: published } = await db.send(new UpdateCommand({
    TableName: TABLES.session,
    Key: { id: sessionId },
    UpdateExpression: 'SET publishStatus = :published, updatedAt = :now',
    // Two reviewers clicking at once: only the first publishes and emails.
    ConditionExpression: 'publishStatus = :draft',
    ExpressionAttributeValues: {
      ':published': 'PUBLISHED',
      ':draft': 'DRAFT',
      ':now': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  }));

  // MIU 2 results carry the MIU 2 assessment; MIU 1's don't.
  const kind = published.postPpqAssessmentId ? 'POST_PPQ' : 'PPQ';
  try {
    await emailTeacher(published, kind);
  } catch (err) {
    console.error(`Published session ${sessionId}, but could not email the teacher:`, err);
    await alertDev('MicroCoach publish: teacher email not sent', [
      `Session: ${sessionId}`,
      `Kind: ${kind}`,
      `Error: ${String(err?.message ?? err)}`,
      '',
      'The results are published and visible to the teacher; only the email failed.',
    ]);
  }
  return published;
};
