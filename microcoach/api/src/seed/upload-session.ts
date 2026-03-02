/**
 * upload-session.ts — add a single session to an existing classroom
 *
 * Usage:
 *   cd api && npx ts-node src/seed/upload-session.ts --classroomId <id> --classroom Classroom1 --session Session2
 *
 * This script does NOT create a new Classroom record — it attaches the session
 * (+ students, assessments, student responses, misconceptions, activities) to an
 * existing classroom identified by --classroomId.
 */

import * as path from 'path';
import * as XLSX from 'xlsx';
import {
  ParsedAssessmentData,
  ParsedQuestionMeta,
  ParsedStudentRow,
  ParsedQuestionResponse,
  CreatedSession,
  CreatedAssessment,
  CreatedStudent,
  CreatedMisconception,
} from './types';
import { CLASSROOMS, DATA_ROOT } from './seedData';

// ── CLI args ─────────────────────────────────────────────────────────────────

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

const classroomId    = getArg('--classroomId');
const classroomKey   = getArg('--classroom');
const sessionLabel   = getArg('--session');

if (!classroomId || !classroomKey || !sessionLabel) {
  console.error(
    'Usage: npx ts-node src/seed/upload-session.ts --classroomId <id> --classroom <key> --session <label>\n' +
    'Example: npx ts-node src/seed/upload-session.ts --classroomId abc-123 --classroom Classroom1 --session Session2'
  );
  process.exit(1);
}

const classroomConfig = CLASSROOMS.find((c) => c.key === classroomKey);
if (!classroomConfig) {
  console.error(`No classroom config found for key "${classroomKey}". Check seedData.ts.`);
  process.exit(1);
}

const sessionConfig = classroomConfig.sessions.find((s) => s.label === sessionLabel);
if (!sessionConfig) {
  console.error(`No session config found for label "${sessionLabel}" in ${classroomKey}. Check seedData.ts.`);
  process.exit(1);
}

import { createGqlClient, GqlFn } from './appsync-config';

let gql: GqlFn;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function elapsed(startMs: number): string {
  const ms = Date.now() - startMs;
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

function progress(msg: string, done = false) {
  const padded = msg.padEnd(72);
  if (done) process.stdout.write(`\r${padded}\n`);
  else process.stdout.write(`\r${padded}`);
}

// ── Excel parser (copied from upload.ts) ─────────────────────────────────────

function parseExcelFile(filePath: string): ParsedAssessmentData {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (rows.length < 8) throw new Error(`Excel file ${filePath} has fewer than 8 rows`);

  const isAssessmentMatrix = String(rows[1]?.[0] ?? '').includes('Assessment Matrix');

  let assessmentCode: string;
  if (isAssessmentMatrix) {
    const title = String(rows[1][0] ?? '');
    const colonIdx = title.indexOf(':');
    assessmentCode = (colonIdx >= 0 ? title.slice(colonIdx + 1) : title).trim();
  } else {
    assessmentCode = String(
      rows[0].find((v: any) => v !== '' && v !== null && v !== undefined) ?? 'UNKNOWN'
    ).trim();
  }

  const ccssRow = rows[1] ?? [];
  const ccssStandards: string[] = isAssessmentMatrix
    ? []
    : ccssRow.slice(1).map((v: any) => String(v ?? '').trim()).filter((v: string) => v.length > 0 && /\d/.test(v));

  const headerRow = rows[2] ?? [];
  const questionColumns: number[] = [];
  const questionNumbers: number[] = [];
  for (let col = 1; col < headerRow.length; col++) {
    const cell = String(headerRow[col] ?? '').trim();
    if (cell === '') continue;
    const qMatch = cell.match(/^q?(\d+)$/i);
    if (qMatch) { questionColumns.push(col); questionNumbers.push(parseInt(qMatch[1], 10)); }
  }

  const classRow = rows[3] ?? [];
  const classPercentByCol: Record<number, number> = {};
  for (const col of questionColumns) {
    const val = classRow[col];
    if (val !== '' && val != null) {
      const pct = parseFloat(String(val));
      classPercentByCol[col] = isNaN(pct) ? 0 : pct > 1 ? pct / 100 : pct;
    }
  }
  const pctValues = Object.values(classPercentByCol);
  const classPercentCorrect = pctValues.length > 0 ? pctValues.reduce((a, b) => a + b, 0) / pctValues.length : 0;

  const answerKeyRowIdx = isAssessmentMatrix ? 6 : 7;
  const keyRow = rows[answerKeyRowIdx] ?? [];
  const answerKeyByCol: Record<number, string> = {};
  for (const col of questionColumns) {
    const val = String(keyRow[col] ?? '').trim().toUpperCase();
    if (val.length === 1 && 'ABCDE'.includes(val)) answerKeyByCol[col] = val;
  }

  const questionMeta: ParsedQuestionMeta[] = questionColumns.map((col, i) => ({
    questionNumber: questionNumbers[i],
    correctAnswer: answerKeyByCol[col] ?? '',
    classPercentCorrect: classPercentByCol[col] ?? 0,
    ccssStandard: ccssStandards[i] ?? ccssStandards[0] ?? '',
  }));

  const studentStartRow = isAssessmentMatrix ? 7 : 8;
  const nameCol       = isAssessmentMatrix ? 1 : 0;
  const externalIdCol = isAssessmentMatrix ? 2 : 1;
  const scoreCol      = isAssessmentMatrix ? 5 : 2;

  const studentRows: ParsedStudentRow[] = [];
  for (let r = studentStartRow; r < rows.length; r++) {
    const row = rows[r];
    const name = String(row[nameCol] ?? '').trim();
    if (!name) continue;
    if (name.toLowerCase().includes('total') || name.toLowerCase().includes('average')) continue;

    const externalId = String(row[externalIdCol] ?? '').trim();
    const rawScore = parseFloat(String(row[scoreCol] ?? '0'));
    let totalScore = isNaN(rawScore) ? 0 : rawScore;
    if (isAssessmentMatrix) totalScore = totalScore / 100;
    else if (totalScore > 1) totalScore = totalScore / 100;

    const questionResponses: ParsedQuestionResponse[] = questionColumns.map((col, i) => {
      const rawResponse = String(row[col] ?? '').trim().toUpperCase();
      const correctAnswer = answerKeyByCol[col] ?? '';
      if (isAssessmentMatrix) {
        if (rawResponse === '') return { questionNumber: questionNumbers[i], response: correctAnswer, isCorrect: true, pointsEarned: 1 };
        return { questionNumber: questionNumbers[i], response: rawResponse, isCorrect: false, pointsEarned: 0 };
      }
      const isCorrect = rawResponse !== '' && rawResponse === correctAnswer;
      return { questionNumber: questionNumbers[i], response: rawResponse, isCorrect, pointsEarned: isCorrect ? 1 : 0 };
    });

    studentRows.push({ name, externalId, totalScore, questionResponses });
  }

  const weekMatch = assessmentCode.match(/W(\d+)/i);
  const weekNumber = weekMatch ? parseInt(weekMatch[1], 10) : 0;
  return { assessmentCode, ccssStandards, weekNumber, topic: '', classPercentCorrect, questionMeta, students: studentRows };
}

// ── GraphQL mutations ─────────────────────────────────────────────────────────

const CREATE_STUDENT = /* GraphQL */`
  mutation CreateStudent($input: CreateStudentInput!) {
    createStudent(input: $input) { id name externalId classroomId }
  }
`;
const CREATE_SESSION = /* GraphQL */`
  mutation CreateSession($input: CreateSessionInput!) {
    createSession(input: $input) { id classroomId sessionLabel weekNumber topic ccssStandards status }
  }
`;
const UPDATE_SESSION = /* GraphQL */`
  mutation UpdateSession($input: UpdateSessionInput!) {
    updateSession(input: $input) { id ppqAssessmentId postPpqAssessmentId }
  }
`;
const CREATE_ASSESSMENT = /* GraphQL */`
  mutation CreateAssessment($input: CreateAssessmentInput!) {
    createAssessment(input: $input) { id classroomId sessionId assessmentCode type weekNumber }
  }
`;
const CREATE_STUDENT_RESPONSE = /* GraphQL */`
  mutation CreateStudentResponse($input: CreateStudentResponseInput!) {
    createStudentResponse(input: $input) { id assessmentId studentId totalScore }
  }
`;
const CREATE_MISCONCEPTION = /* GraphQL */`
  mutation CreateMisconception($input: CreateMisconceptionInput!) {
    createMisconception(input: $input) { id classroomId sessionId ccssStandard title }
  }
`;
const CREATE_ACTIVITY = /* GraphQL */`
  mutation CreateActivity($input: CreateActivityInput!) {
    createActivity(input: $input) { id misconceptionId classroomId sessionId type status title }
  }
`;

// ── Upload helpers ────────────────────────────────────────────────────────────

async function uploadStudents(students: ParsedStudentRow[]): Promise<CreatedStudent[]> {
  const start = Date.now();
  const created: CreatedStudent[] = [];
  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    const anonName = `Student ${i + 1}`;
    const externalId = s.externalId || `S${String(i + 1).padStart(3, '0')}`;
    progress(`  Creating students [${i + 1}/${students.length}]  ${anonName}`);
    const data = await gql(CREATE_STUDENT, {
      input: { classroomId, classroomStudentsId: classroomId, name: anonName, externalId, confidenceLevel: 0, status: 'active' },
    });
    created.push({ id: data.createStudent.id, name: anonName, externalId, classroomId: classroomId! });
    await sleep(50);
  }
  progress(`  ✓ ${created.length} students created  (${elapsed(start)})`, true);
  return created;
}

async function uploadSession(): Promise<CreatedSession> {
  process.stdout.write(`  Creating session: ${sessionConfig!.label}...`);
  const start = Date.now();
  const data = await gql(CREATE_SESSION, {
    input: {
      classroomId,
      classroomSessionsId: classroomId,
      sessionLabel: sessionConfig!.label,
      weekNumber: sessionConfig!.weekNumber,
      topic: sessionConfig!.topic,
      ccssStandards: sessionConfig!.ccssStandards,
      status: 'completed',
    },
  });
  const session = data.createSession;
  process.stdout.write(`  ✓  id: ${session.id}  (${elapsed(start)})\n`);
  return { id: session.id, classroomId: classroomId! };
}

async function uploadAssessment(
  sessionId: string,
  parsed: ParsedAssessmentData,
  type: 'PPQ' | 'POST_PPQ',
  sourceAssessmentId?: string
): Promise<CreatedAssessment> {
  process.stdout.write(`  Creating ${type} assessment (${parsed.questionMeta.length} questions)...`);
  const start = Date.now();
  const input: Record<string, any> = {
    classroomId,
    sessionId,
    sessionAssessmentsId: sessionId,
    assessmentCode: parsed.assessmentCode || `${type}_UNKNOWN`,
    type,
    weekNumber: parsed.weekNumber || sessionConfig!.weekNumber,
    topic: sessionConfig!.topic,
    ccssStandards: parsed.ccssStandards.filter((s) => /\d/.test(s)).length > 0
      ? parsed.ccssStandards
      : sessionConfig!.ccssStandards,
    classPercentCorrect: parsed.classPercentCorrect,
    questions: parsed.questionMeta.map((q) => ({
      questionNumber: q.questionNumber,
      questionType: 'MC',
      correctAnswer: q.correctAnswer,
      pointValue: 1,
      ccssStandard: q.ccssStandard || sessionConfig!.ccssStandards[0],
      classPercentCorrect: q.classPercentCorrect,
    })),
  };
  if (sourceAssessmentId) input.sourceAssessmentId = sourceAssessmentId;
  const data = await gql(CREATE_ASSESSMENT, { input });
  const assessment = data.createAssessment;
  process.stdout.write(`  ✓  id: ${assessment.id}  (${elapsed(start)})\n`);
  return { id: assessment.id, type, classroomId: classroomId!, sessionId };
}

async function uploadStudentResponses(
  label: string,
  assessmentId: string,
  students: ParsedStudentRow[],
  studentMap: Map<string, string>
): Promise<void> {
  const start = Date.now();
  let count = 0, skipped = 0;
  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    progress(`  Uploading ${label} responses [${i + 1}/${students.length}]`);
    const studentId = studentMap.get(s.externalId);
    if (!studentId) { skipped++; await sleep(10); continue; }
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
        })),
      },
    });
    count++;
    await sleep(50);
  }
  const skipNote = skipped > 0 ? `  (${skipped} skipped)` : '';
  progress(`  ✓ ${count} ${label} responses uploaded  (${elapsed(start)})${skipNote}`, true);
}

async function uploadMisconceptions(sessionId: string): Promise<void> {
  const misconceptions = sessionConfig!.misconceptions;
  const start = Date.now();
  for (let i = 0; i < misconceptions.length; i++) {
    const m = misconceptions[i];
    progress(`  Creating misconception [${i + 1}/${misconceptions.length}]  ${m.title}`);
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
    await gql(CREATE_ACTIVITY, {
      input: {
        misconceptionId: misconception.id,
        misconceptionActivitiesId: misconception.id,
        classroomId,
        sessionId,
        type: 'RTD',
        status: 'GENERATED',
        title: `RTD: ${m.title}`,
        summary: `AI-generated RTD activity targeting the misconception: ${m.title}`,
        aiGenerated: true,
        format: 'small_group',
      },
    });
    await sleep(100);
  }
  progress(`  ✓ ${misconceptions.length} misconceptions + ${misconceptions.length} activities created  (${elapsed(start)})`, true);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const totalStart = Date.now();
  gql = await createGqlClient();
  console.log(`=== Upload Session: ${classroomKey} / ${sessionLabel} ===\n`);
  console.log(`  Classroom ID : ${classroomId}`);
  console.log(`  Session      : ${sessionLabel}`);
  console.log(`  PPQ file     : ${sessionConfig!.ppqFile}`);
  console.log(`  PostPPQ file : ${sessionConfig!.postPpqFile}\n`);

  // Parse PPQ
  const ppqPath = path.join(DATA_ROOT, sessionConfig!.ppqFile);
  process.stdout.write(`  Parsing PPQ Excel...`);
  let ppqData: ParsedAssessmentData;
  try {
    ppqData = parseExcelFile(ppqPath);
    process.stdout.write(`  ✓  ${ppqData.students.length} students, ${ppqData.questionMeta.length} questions\n`);
  } catch (err) {
    console.error(`\n  ERROR parsing PPQ: ${err}`);
    process.exit(1);
  }

  // Upload students
  const createdStudents = await uploadStudents(ppqData.students);
  const studentMap = new Map<string, string>();
  for (const s of createdStudents) studentMap.set(s.externalId, s.id);

  // Create session
  const createdSession = await uploadSession();
  const sessionId = createdSession.id;

  // Create PPQ assessment + responses
  const ppqAssessment = await uploadAssessment(sessionId, ppqData, 'PPQ');
  await uploadStudentResponses('PPQ', ppqAssessment.id, ppqData.students, studentMap);

  // Parse + upload PostPPQ
  const postPpqPath = path.join(DATA_ROOT, sessionConfig!.postPpqFile);
  process.stdout.write(`\n  Parsing PostPPQ Excel...`);
  try {
    const postPpqData = parseExcelFile(postPpqPath);
    process.stdout.write(`  ✓  ${postPpqData.students.length} students, ${postPpqData.questionMeta.length} questions\n`);
    const postPpqAssessment = await uploadAssessment(sessionId, postPpqData, 'POST_PPQ', ppqAssessment.id);
    await uploadStudentResponses('PostPPQ', postPpqAssessment.id, postPpqData.students, studentMap);

    process.stdout.write(`  Linking assessments to session...`);
    await gql(UPDATE_SESSION, {
      input: { id: sessionId, ppqAssessmentId: ppqAssessment.id, postPpqAssessmentId: postPpqAssessment.id },
    });
    process.stdout.write(`  ✓\n`);
  } catch (err) {
    console.error(`\n  ERROR processing PostPPQ: ${err}`);
  }

  // Misconceptions + activities
  console.log('');
  await uploadMisconceptions(sessionId);

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`Done  (${elapsed(totalStart)} total)`);
  console.log('═'.repeat(60));
}

main().catch((err) => { console.error('\nFailed:', err); process.exit(1); });
