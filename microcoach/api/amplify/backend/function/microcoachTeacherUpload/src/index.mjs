/**
 * microcoachTeacherUpload Lambda
 *
 * Consolidates the ingest → upload → generate pipeline into a single Lambda.
 * Uses self-invoke async pattern to work around AppSync's 30s resolver timeout.
 *
 * Flow mirrors the CLI scripts exactly:
 *   1. Ingest (yarn ingest): docx → LLM → misconceptions
 *   2. Upload (yarn upload): xlsx + misconceptions → DB
 *      a. Parse xlsx
 *      b. Upload students
 *      c. Create session
 *      d. Create PPQ assessment + student responses
 *      e. Link assessment to session
 *      f. Upload misconceptions + stub activities
 *      g. Create ContextData
 *   3. Invoke microcoachTeacherUploadGen Lambda (async) for generation
 *   4. Gen Lambda sends completion email when done
 */

import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import mammoth from 'mammoth';
import { createGqlClient } from './util/appsync-client.mjs';
import { parseExcelBuffer, deriveTopic } from './util/parse-excel.mjs';
import { sendEmail } from './util/send-email.mjs';
import {
  GET_CLASSROOM,
  CREATE_STUDENT,
  CREATE_SESSION,
  UPDATE_SESSION,
  CREATE_ASSESSMENT,
  CREATE_STUDENT_RESPONSE,
  CREATE_MISCONCEPTION,
  CREATE_ACTIVITY,
  CREATE_CONTEXT_DATA,
  SESSIONS_BY_CLASSROOM,
  INGEST_PPQ,
} from './util/graphql.mjs';

const AMPLIFY_ENV = process.env.ENV || 'dev';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Lambda invocation helper (from generate-next-steps.ts:20-33) ────────────

async function invokeLambda(functionName, payload) {
  const client = new LambdaClient({ region: process.env.REGION || 'us-east-1' });
  const cmd = new InvokeCommand({
    FunctionName: functionName,
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(JSON.stringify(payload)),
  });
  const resp = await client.send(cmd);
  if (resp.FunctionError) {
    const errBody = Buffer.from(resp.Payload).toString('utf8');
    throw new Error(`Lambda ${functionName} error: ${errBody}`);
  }
  return JSON.parse(Buffer.from(resp.Payload).toString('utf8'));
}

// ── Upload helpers (from upload.ts — identical logic) ───────────────────────

async function uploadStudents(gql, classroomId, students) {
  const created = [];
  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    const studentName = s.name || `Student ${i + 1}`;
    const externalId = s.externalId || `S${String(i + 1).padStart(3, '0')}`;
    console.log(`    Creating students [${i + 1}/${students.length}]  ${studentName}`);
    const confValues = s.questionResponses
      .map((qr) => qr.confidence)
      .filter((c) => c != null && c >= 1 && c <= 5);
    const avgConfidence =
      confValues.length > 0
        ? parseFloat((confValues.reduce((sum, c) => sum + c, 0) / confValues.length).toFixed(1))
        : 0;

    const data = await gql(CREATE_STUDENT, {
      input: {
        classroomId,
        classroomStudentsId: classroomId,
        name: studentName,
        externalId,
        confidenceLevel: avgConfidence || 0,
        status: 'active',
      },
    });
    created.push({ id: data.createStudent.id, name: studentName, externalId, classroomId });
    await sleep(50);
  }
  console.log(`  ✓ ${created.length} students created`);
  return created;
}

async function uploadSession(gql, classroomId, sessionLabel, weekNumber, topic, ccssStandards) {
  console.log(`    Creating session: ${sessionLabel}...`);
  const data = await gql(CREATE_SESSION, {
    input: {
      classroomId,
      classroomSessionsId: classroomId,
      sessionLabel,
      weekNumber,
      topic,
      ccssStandards,
      status: 'completed',
    },
  });
  const session = data.createSession;
  console.log(`  ✓ Session created: ${session.id}`);
  return session;
}

async function uploadAssessment(gql, classroomId, sessionId, parsed, type, sourceAssessmentId) {
  console.log(`    Creating ${type} assessment (${parsed.questionMeta.length} questions)...`);
  const input = {
    classroomId,
    sessionId,
    sessionAssessmentsId: sessionId,
    assessmentCode: parsed.assessmentCode || `${type}_UNKNOWN`,
    type,
    weekNumber: parsed.weekNumber || 0,
    topic: parsed.topic,
    ccssStandards: parsed.ccssStandards,
    classPercentCorrect: parsed.classPercentCorrect,
    questions: parsed.questionMeta.map((q) => ({
      questionNumber: q.questionNumber,
      questionType: 'MC',
      correctAnswer: q.correctAnswer,
      pointValue: 1,
      ccssStandard: q.ccssStandard,
      classPercentCorrect: q.classPercentCorrect,
    })),
  };
  if (sourceAssessmentId) input.sourceAssessmentId = sourceAssessmentId;

  const data = await gql(CREATE_ASSESSMENT, { input });
  const assessment = data.createAssessment;
  console.log(`  ✓ ${type} assessment created: ${assessment.id}`);
  return assessment;
}

async function uploadStudentResponses(gql, label, assessmentId, students, studentMap) {
  let count = 0;
  let skipped = 0;

  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    console.log(`    Uploading ${label} responses [${i + 1}/${students.length}]`);

    const studentId = studentMap.get(s.externalId);
    if (!studentId) {
      skipped++;
      await sleep(10);
      continue;
    }

    await gql(CREATE_STUDENT_RESPONSE, {
      input: {
        assessmentId,
        assessmentStudentResponsesId: assessmentId,
        studentId,
        totalScore: s.totalScore,
        questionResponses: s.questionResponses.map((qr) => ({
          questionNumber: qr.questionNumber,
          response: qr.response,
          isCorrect: qr.isCorrect,
          pointsEarned: qr.pointsEarned,
          confidence: qr.confidence ?? null,
        })),
      },
    });
    count++;
    await sleep(50);
  }

  const skipNote = skipped > 0 ? `  (${skipped} skipped — not in PPQ roster)` : '';
  console.log(`  ✓ ${count} ${label} responses uploaded${skipNote}`);
  return count;
}

async function uploadMisconceptions(gql, classroomId, sessionId, misconceptions) {
  const created = [];

  for (let i = 0; i < misconceptions.length; i++) {
    const m = misconceptions[i];
    console.log(`    Creating misconception [${i + 1}/${misconceptions.length}]  ${m.title}`);

    const data = await gql(CREATE_MISCONCEPTION, {
      input: {
        classroomId,
        sessionId,
        sessionMisconceptionsId: sessionId,
        ccssStandard: m.ccssStandard,
        title: m.title,
        description: m.description,
        severity: m.severity,
        priority: m.priority,
        occurrence: m.occurrence,
        successIndicators: m.successIndicators,
      },
    });
    const misconception = data.createMisconception;
    created.push({ id: misconception.id, sessionId, classroomId });

    // Stub Activity for each Misconception
    await gql(CREATE_ACTIVITY, {
      input: {
        misconceptionId: misconception.id,
        misconceptionActivitiesId: misconception.id,
        classroomId,
        sessionId,
        type: 'NEXT_STEP',
        status: 'GENERATED',
        title: `Next Step: ${m.title}`,
        summary: `AI-generated next step activity targeting the misconception: ${m.title}`,
        aiGenerated: true,
        format: 'small_group',
      },
    });
    await sleep(100);
  }

  console.log(`  ✓ ${created.length} misconceptions + ${created.length} activities created`);
  return created;
}

async function uploadContextData(gql, title, gradeLevel, ccssStandards, weekNumber, isReference, assessmentCode) {
  const tag = isReference ? '[REF]' : '[CLS]';
  console.log(`    Creating ContextData ${tag} "${title}"...`);

  await gql(CREATE_CONTEXT_DATA, {
    input: {
      type: 'NEXT_STEP_LESSON',
      title,
      gradeLevel,
      weekNumber,
      ccssStandards,
      assessmentCode,
      isReference,
      nextStepLesson: {
        targetAssessmentCode: assessmentCode ?? 'REFERENCE',
        topic: deriveTopic(ccssStandards[0] ?? ''),
        targetProblem: 'See source document',
      },
    },
  });
  console.log(`  ✓ ContextData created`);
  await sleep(100);
}

// ── Main async pipeline ─────────────────────────────────────────────────────
// Mirrors CLI order: yarn ingest → yarn upload (generation runs in separate Lambda)

async function runPipeline(input) {
  const { classroomId, activityFileBase64, studentDataFileBase64 } = input;

  const gql = await createGqlClient();

  // ── Step 1: Fetch classroom ─────────────────────────────────────────────────
  console.log('Step 1: Fetching classroom...');
  const classroomData = await gql(GET_CLASSROOM, { id: classroomId });
  const classroom = classroomData.getClassroom;
  if (!classroom) throw new Error(`Classroom ${classroomId} not found`);
  console.log(`  ✓ ${classroom.classroomName} (grade ${classroom.grade}, ${classroom.state})`);

  // ── Step 2: Ingest docx — extract misconceptions (yarn ingest) ──────────────
  console.log('Step 2: Ingesting activity docx...');
  const docxBuffer = Buffer.from(activityFileBase64, 'base64');
  const docxResult = await mammoth.extractRawText({ buffer: docxBuffer });
  const ppqText = docxResult.value.trim();
  if (!ppqText) {
    throw new Error('Empty text extracted from docx — cannot ingest');
  }
  console.log(`  ✓ Extracted ${ppqText.length} chars from docx`);

  // Determine occurrence (first if no prior sessions, recurring otherwise)
  const existingSessions = await gql(SESSIONS_BY_CLASSROOM, { classroomId });
  const sessionCount = (existingSessions.sessionsByClassroomId?.items ?? []).length;
  const occurrence = sessionCount === 0 ? 'first' : 'recurring';

  // Parse xlsx early to get weekNumber for ingest call
  console.log('  Parsing student data xlsx...');
  const xlsxBuffer = Buffer.from(studentDataFileBase64, 'base64');
  const parsed = parseExcelBuffer(xlsxBuffer);
  console.log(`  ✓ ${parsed.students.length} students, ${parsed.questionMeta.length} questions, week ${parsed.weekNumber}`);

  console.log(`  Calling ingestPPQ (occurrence: ${occurrence})...`);
  const ingestResult = await gql(INGEST_PPQ, {
    input: {
      ppqText,
      classroomKey: classroom.classroomName,
      grade: classroom.grade,
      subject: classroom.subject,
      state: classroom.state,
      schoolYear: classroom.schoolYear,
      cohortSize: classroom.cohortSize ?? parsed.students.length,
      sessionLabel: `W${parsed.weekNumber}`,
      weekNumber: parsed.weekNumber,
      occurrence,
    },
  });
  const ingestData = JSON.parse(ingestResult.ingestPPQ);
  const misconceptions = ingestData.misconceptions ?? [];
  console.log(`  ✓ ${misconceptions.length} misconceptions extracted`);

  // ── Step 3: Upload (yarn upload) ────────────────────────────────────────────
  // Derive CCSS: use xlsx if available, fall back to misconception ccssStandards
  // (mirrors CLI using sessionConfig.ccssStandards as fallback)
  const ccssFromMisconceptions = [...new Set(misconceptions.map((m) => m.ccssStandard).filter(Boolean))];
  console.log(`  CCSS from xlsx: ${JSON.stringify(parsed.ccssStandards)}`);
  console.log(`  CCSS from misconceptions: ${JSON.stringify(ccssFromMisconceptions)}`);
  const ccssStandards =
    parsed.ccssStandards.filter((s) => /\d/.test(s)).length > 0
      ? parsed.ccssStandards
      : ccssFromMisconceptions;
  console.log(`  CCSS resolved: ${JSON.stringify(ccssStandards)}`);

  // Merge CCSS into parsed data for assessment creation (mirrors upload.ts:642-650)
  const ppqData = {
    ...parsed,
    ccssStandards,
    topic: parsed.topic || deriveTopic(ccssStandards[0] ?? ''),
  };

  // 3a. Upload students
  console.log('Step 3a: Uploading students...');
  const createdStudents = await uploadStudents(gql, classroomId, ppqData.students);
  const studentMap = new Map();
  for (const s of createdStudents) {
    studentMap.set(s.externalId, s.id);
  }

  // 3b. Create session
  console.log('Step 3b: Creating session...');
  const sessionLabel = `W${ppqData.weekNumber}`;
  const session = await uploadSession(gql, classroomId, sessionLabel, ppqData.weekNumber, ppqData.topic, ccssStandards);
  const sessionId = session.id;

  // 3c. Create PPQ assessment
  console.log('Step 3c: Creating PPQ assessment...');
  const ppqAssessment = await uploadAssessment(gql, classroomId, sessionId, ppqData, 'PPQ');

  // 3d. Upload PPQ student responses
  console.log('Step 3d: Uploading PPQ student responses...');
  await uploadStudentResponses(gql, 'PPQ', ppqAssessment.id, ppqData.students, studentMap);

  // 3e. Link assessment to session (mirrors upload.ts:690-698)
  console.log('Step 3e: Linking assessment to session...');
  await gql(UPDATE_SESSION, {
    input: {
      id: sessionId,
      ppqAssessmentId: ppqAssessment.id,
    },
  });
  console.log('  ✓');

  // 3f. Upload misconceptions + stub activities (mirrors upload.ts:701-718)
  console.log('Step 3f: Uploading misconceptions...');
  await uploadMisconceptions(gql, classroomId, sessionId, misconceptions);

  // 3g. Create ContextData (mirrors upload.ts:721-729)
  console.log('Step 3g: Creating ContextData...');
  const nextStepTitle = `${classroom.classroomName} ${sessionLabel} Next Step - ${ppqData.topic}`;
  await uploadContextData(gql, nextStepTitle, classroom.grade, ccssStandards, ppqData.weekNumber, false, ppqData.assessmentCode);

  // ── Step 4: Invoke microcoachTeacherUploadGen Lambda (async) ─────────────────
  console.log('Step 4: Invoking microcoachTeacherUploadGen for generation pipeline...');
  const genFunctionName = `microcoachTeacherUploadGen-${AMPLIFY_ENV}`;
  const genPayload = {
    classroomId,
    sessionId,
    classroomName: classroom.classroomName,
    studentCount: ppqData.students.length,
    misconceptionCount: misconceptions.length,
  };
  const lambdaClient = new LambdaClient({ region: process.env.REGION || 'us-east-1' });
  await lambdaClient.send(new InvokeCommand({
    FunctionName: genFunctionName,
    InvocationType: 'Event',
    Payload: Buffer.from(JSON.stringify(genPayload)),
  }));
  console.log(`Generation Lambda invoked asynchronously: ${genFunctionName}`);

  return {
    classroomName: classroom.classroomName,
    studentCount: ppqData.students.length,
    misconceptionCount: misconceptions.length,
  };
}

// ── Handler ──────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  console.log('Event received:', JSON.stringify({
    async: event.async,
    hasArguments: !!event.arguments,
    hasInput: !!event.arguments?.input,
  }));

  // Async invocation — run the full pipeline
  if (event.async === true) {
    const input = event.input;
    try {
      const result = await runPipeline(input);
      console.log('Pipeline complete — generation Lambda invoked:', JSON.stringify(result));
    } catch (err) {
      console.error('Pipeline failed:', err);

      const failHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Rubik:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1B376F; margin: 0; padding: 0; background-color: #FFFBF6; }
    .container { max-width: 600px; margin: 24px auto; background: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
    .header { background-color: #CC5500; padding: 24px 32px; }
    .header h1 { font-family: 'Poppins', sans-serif; color: #FFFBF6; margin: 0; font-size: 20px; font-weight: 700; }
    .body { padding: 32px; }
    .intro { font-size: 14px; line-height: 1.6; margin-bottom: 24px; color: #374151; }
    .error-box { background-color: rgba(204, 85, 0, 0.06); border-left: 4px solid #CC5500; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #CC5500; font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace; word-break: break-all; }
    .note { margin-top: 16px; font-size: 13px; color: #6B7280; }
    .footer { padding: 16px 32px; background-color: #FFFBF6; border-top: 1px solid #e5e5e5; font-size: 12px; color: #6B7280; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MicroCoach Upload Failed</h1>
    </div>
    <div class="body">
      <p class="intro">The upload pipeline encountered an error and could not complete.</p>
      <div class="error-box">${err.message}</div>
      <p class="note">Check CloudWatch logs for full details.</p>
    </div>
    <div class="footer">RightOn Education &mdash; MicroCoach</div>
  </div>
</body>
</html>`.trim();
      const failText = [
        'RightOn Education: MicroCoach Upload Failed',
        '',
        'The upload pipeline encountered an error and could not complete.',
        '',
        `Error: ${err.message}`,
        '',
        'Check CloudWatch logs for full details.',
      ].join('\n');
      await sendEmail(
        'RightOn Education: MicroCoach Upload Failed',
        failHtml,
        failText
      ).catch((emailErr) => console.error('Failed to send error email:', emailErr));

      throw err;
    }
    return;
  }

  // Sync invocation from AppSync — validate and self-invoke async
  const input = event.arguments?.input;
  if (!input) {
    return JSON.stringify({ error: 'Missing input' });
  }

  const { classroomId, activityFileBase64, studentDataFileBase64 } = input;
  if (!classroomId || !activityFileBase64 || !studentDataFileBase64) {
    return JSON.stringify({ error: 'Missing required fields: classroomId, activityFileBase64, studentDataFileBase64' });
  }

  // Self-invoke asynchronously
  const lambdaClient = new LambdaClient({ region: process.env.REGION || 'us-east-1' });
  await lambdaClient.send(new InvokeCommand({
    FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
    InvocationType: 'Event',
    Payload: Buffer.from(JSON.stringify({
      async: true,
      input,
    })),
  }));

  console.log('Async invocation triggered');
  return JSON.stringify('Upload processing started. You will receive an email when analysis is complete.');
};
