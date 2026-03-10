/**
 * upload.ts — seed the Microcoach database from the Data/ folder
 *
 * Run AFTER `amplify push` has provisioned the new schema tables:
 *   cd api && npx ts-node src/seed/upload.ts
 *
 * Upload order (respects FK dependencies):
 *   1. Classrooms
 *   2. Students (classroomStudentsId)
 *   3. Sessions (classroomSessionsId)
 *   4. Assessments/PPQ (classroomAssessmentsId, sessionAssessmentsId)
 *   5. StudentResponses/PPQ (assessmentStudentResponsesId)
 *   6. Assessments/PostPPQ (sourceAssessmentId → PPQ id)
 *   7. StudentResponses/PostPPQ
 *   8. Misconceptions (classroomMisconceptionsId, sessionMisconceptionsId)
 *   9. Activities (misconceptionActivitiesId)
 *  10. ContextData (isReference: false for classroom next steps, true for References/)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import {
  ParsedAssessmentData,
  ParsedQuestionMeta,
  ParsedStudentRow,
  ParsedQuestionResponse,
  CreatedClassroom,
  CreatedSession,
  CreatedAssessment,
  CreatedStudent,
  CreatedMisconception,
} from './types';
import { CLASSROOMS, DATA_ROOT, REFERENCE_NEXT_STEPS } from './seedData';
import { createGqlClient, GqlFn } from './appsync-config';

let gql: GqlFn;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Status utilities ─────────────────────────────────────────────────────────

function elapsed(startMs: number): string {
  const ms = Date.now() - startMs;
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

// Overwrite the current terminal line. Pass done=true to commit with a newline.
function progress(msg: string, done = false) {
  const padded = msg.padEnd(72);
  if (done) {
    process.stdout.write(`\r${padded}\n`);
  } else {
    process.stdout.write(`\r${padded}`);
  }
}

// ── Excel parser ─────────────────────────────────────────────────────────────
/**
 * Parse a PPQ or PostPPQ Excel file.
 *
 * Supports two layouts detected automatically:
 *
 * GENERATED (synthetic):
 *   Row 0: assessmentCode at col 0
 *   Row 1: CCSS standards at question columns
 *   Row 2: "Name", "Student ID", "Score", "Q1", "Q2", ...
 *   Row 3: "Class %", class-pct per question column
 *   Row 7: "Answer Key", correct answers per question column
 *   Row 8+: name(col0), externalId(col1), score 0–1(col2), responses per question column
 *
 * ASSESSMENT MATRIX (real district data — two sub-variants):
 *   Row 0: empty
 *   Row 1: "Assessment Matrix Report: {code}" at col 0
 *   Row 2: "Question" at col 0, question numbers at sparse columns
 *   Row 3: "Class Percent Correct" at col 0, per-Q decimals at question columns
 *   Row 6: "Points Possible/Correct Answer", answer key (A–E) at question columns
 *   Row 7+: rowNum(col0), name(col1), externalId(col2), score 0–100(col5), responses per Q col
 *
 *   Legacy sub-variant: appended Q1_Conf columns carry numeric (1–5) confidence.
 *   Interleaved sub-variant (pilot): confidence values are in alternating columns
 *     immediately after each quiz column; encoded as letters A–D (or doubles AB/BC/CD).
 *     Detected when no Q_Conf headers exist and the answer key row has alternating
 *     letter / blank pattern among numeric-header columns.
 */

/**
 * Convert a confidence letter (A–D, or adjacent pair AB/BC/CD) to a numeric value.
 * Non-contiguous pairs (AC, AD, BD, etc.) return undefined.
 * Empty string returns undefined.
 */
function parseConfidenceLetter(raw: string): number | undefined {
  const val = raw.trim().toUpperCase();
  if (!val) return undefined;
  const map: Record<string, number> = { A: 5, B: 4, C: 3, D: 1 };
  if (val.length === 1) return map[val];
  if (val.length === 2) {
    const s1 = map[val[0]], s2 = map[val[1]];
    if (s1 == null || s2 == null) return undefined;
    const order = 'ABCD';
    if (order.indexOf(val[1]) === order.indexOf(val[0]) + 1) return (s1 + s2) / 2;
    return undefined; // non-contiguous
  }
  return undefined;
}

function parseExcelFile(filePath: string): ParsedAssessmentData {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (rows.length < 8) {
    throw new Error(`Excel file ${filePath} has fewer than 8 rows — unexpected format`);
  }

  // Detect layout by checking whether row 1 col 0 contains "Assessment Matrix"
  const isAssessmentMatrix = String(rows[1]?.[0] ?? '').includes('Assessment Matrix');

  // ── Assessment code ────────────────────────────────────────────────────────
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

  // ── CCSS standards (generated format only; Assessment Matrix has none in file) ─
  const ccssRow = rows[1] ?? [];
  const ccssStandards: string[] = isAssessmentMatrix
    ? []
    : ccssRow
        .slice(1)
        .map((v: any) => String(v ?? '').trim())
        .filter((v: string) => v.length > 0 && /\d/.test(v));

  // ── All numeric-header columns from row 2 ───────────────────────────────────
  const headerRow = rows[2] ?? [];
  const allNumericCols: number[] = [];
  for (let col = 1; col < headerRow.length; col++) {
    const cell = String(headerRow[col] ?? '').trim();
    if (cell.match(/^q?(\d+)$/i)) allNumericCols.push(col);
  }

  // ── Legacy confidence columns (Q1_Conf style) ──────────────────────────────
  const confColByQNumber: Record<number, number> = {};
  for (let col = 1; col < headerRow.length; col++) {
    const cell = String(headerRow[col] ?? '').trim();
    const cMatch = cell.match(/^Q?(\d+)_Conf$/i);
    if (cMatch) confColByQNumber[parseInt(cMatch[1], 10)] = col;
  }

  // ── Answer key (needed early for interleaved detection) ─────────────────────
  // Generated: row 7 (index 7).  Assessment Matrix: row 6 (index 6).
  const answerKeyRowIdx = isAssessmentMatrix ? 6 : 7;
  const keyRow = rows[answerKeyRowIdx] ?? [];

  // ── Interleaved confidence detection ────────────────────────────────────────
  // Triggered when: Assessment Matrix AND no legacy Q_Conf headers exist.
  // Quiz columns have a letter A–E in the key row; confidence columns have blank.
  let isInterleaved = false;
  let questionColumns = [...allNumericCols];
  let questionNumbers = allNumericCols.map((col) => {
    const cell = String(headerRow[col] ?? '').trim();
    return parseInt(cell.replace(/^q/i, ''), 10);
  });

  if (isAssessmentMatrix && Object.keys(confColByQNumber).length === 0) {
    const quizCols: number[] = [];
    const quizNums: number[] = [];
    const newConfColByQNumber: Record<number, number> = {};
    let quizSeq = 0;

    for (const col of allNumericCols) {
      const keyVal = String(keyRow[col] ?? '').trim().toUpperCase();
      if (keyVal.length === 1 && 'ABCDE'.includes(keyVal)) {
        quizSeq++;
        quizCols.push(col);
        quizNums.push(quizSeq);
      } else if (keyVal === '' && quizSeq > 0 && newConfColByQNumber[quizSeq] == null) {
        newConfColByQNumber[quizSeq] = col;
      }
    }

    if (quizCols.length > 0 && Object.keys(newConfColByQNumber).length > 0) {
      isInterleaved = true;
      questionColumns = quizCols;
      questionNumbers = quizNums;
      Object.assign(confColByQNumber, newConfColByQNumber);
    }
  }

  // ── Class % correct per question (row 3) — quiz columns only ────────────────
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
  const classPercentCorrect =
    pctValues.length > 0 ? pctValues.reduce((a, b) => a + b, 0) / pctValues.length : 0;

  // ── Answer key by column (quiz columns only) ─────────────────────────────────
  const answerKeyByCol: Record<number, string> = {};
  for (const col of questionColumns) {
    const val = String(keyRow[col] ?? '').trim().toUpperCase();
    if (val.length === 1 && 'ABCDE'.includes(val)) {
      answerKeyByCol[col] = val;
    }
  }

  const questionMeta: ParsedQuestionMeta[] = questionColumns.map((col, i) => ({
    questionNumber: questionNumbers[i],
    correctAnswer: answerKeyByCol[col] ?? '',
    classPercentCorrect: classPercentByCol[col] ?? 0,
    ccssStandard: ccssStandards[i] ?? ccssStandards[0] ?? '',
  }));

  // ── Student rows ─────────────────────────────────────────────────────────────
  // Generated: row 8+, name=col0, externalId=col1, score=col2 (0–1 decimal).
  // Assessment Matrix: row 7+, name=col1, externalId=col2, score=col5 (0–100 percent).
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
    if (isAssessmentMatrix) {
      totalScore = totalScore / 100;
    } else if (totalScore > 1) {
      totalScore = totalScore / 100;
    }

    const questionResponses: ParsedQuestionResponse[] = questionColumns.map((col, i) => {
      const rawResponse = String(row[col] ?? '').trim().toUpperCase();
      const correctAnswer = answerKeyByCol[col] ?? '';
      const qNum = questionNumbers[i];
      const confCol = confColByQNumber[qNum];

      let confidence: number | undefined;
      if (confCol != null) {
        const rawConf = String(row[confCol] ?? '').trim();
        if (isInterleaved) {
          confidence = parseConfidenceLetter(rawConf);
        } else {
          const n = parseFloat(rawConf);
          confidence = !isNaN(n) && n >= 1 && n <= 5 ? n : undefined;
        }
      }

      if (isAssessmentMatrix) {
        if (rawResponse === '') {
          return { questionNumber: qNum, response: correctAnswer, isCorrect: true, pointsEarned: 1, confidence };
        }
        return { questionNumber: qNum, response: rawResponse, isCorrect: false, pointsEarned: 0, confidence };
      }

      const isCorrect = rawResponse !== '' && rawResponse === correctAnswer;
      return { questionNumber: qNum, response: rawResponse, isCorrect, pointsEarned: isCorrect ? 1 : 0, confidence };
    });

    studentRows.push({ name, externalId, totalScore, questionResponses });
  }

  const weekMatch = assessmentCode.match(/W(\d+)/i);
  const weekNumber = weekMatch ? parseInt(weekMatch[1], 10) : 0;
  const topic = deriveTopic(ccssStandards[0] ?? '');

  return {
    assessmentCode,
    ccssStandards,
    weekNumber,
    topic,
    classPercentCorrect,
    questionMeta,
    students: studentRows,
  };
}

function deriveTopic(ccss: string): string {
  if (ccss.includes('6.NS')) return 'Dividing Fractions';
  if (ccss.includes('8.EE')) return 'Linear Equations and Systems';
  if (ccss.includes('8.F')) return 'Functions and Rate of Change';
  if (ccss.includes('6.EE')) return 'Expressions and Equations';
  if (ccss.includes('7.RP')) return 'Ratios and Proportional Relationships';
  return 'Math';
}

// ── GraphQL mutations ────────────────────────────────────────────────────────

const CREATE_CLASSROOM = /* GraphQL */ `
  mutation CreateClassroom($input: CreateClassroomInput!) {
    createClassroom(input: $input) { id classroomName grade subject state schoolYear cohortSize }
  }
`;
const CREATE_STUDENT = /* GraphQL */ `
  mutation CreateStudent($input: CreateStudentInput!) {
    createStudent(input: $input) { id name externalId classroomId }
  }
`;
const CREATE_SESSION = /* GraphQL */ `
  mutation CreateSession($input: CreateSessionInput!) {
    createSession(input: $input) { id classroomId sessionLabel weekNumber topic ccssStandards status }
  }
`;
const UPDATE_SESSION = /* GraphQL */ `
  mutation UpdateSession($input: UpdateSessionInput!) {
    updateSession(input: $input) { id ppqAssessmentId postPpqAssessmentId }
  }
`;
const CREATE_ASSESSMENT = /* GraphQL */ `
  mutation CreateAssessment($input: CreateAssessmentInput!) {
    createAssessment(input: $input) { id classroomId sessionId assessmentCode type weekNumber }
  }
`;
const CREATE_STUDENT_RESPONSE = /* GraphQL */ `
  mutation CreateStudentResponse($input: CreateStudentResponseInput!) {
    createStudentResponse(input: $input) { id assessmentId studentId totalScore }
  }
`;
const CREATE_MISCONCEPTION = /* GraphQL */ `
  mutation CreateMisconception($input: CreateMisconceptionInput!) {
    createMisconception(input: $input) { id classroomId sessionId ccssStandard title }
  }
`;
const CREATE_ACTIVITY = /* GraphQL */ `
  mutation CreateActivity($input: CreateActivityInput!) {
    createActivity(input: $input) { id misconceptionId classroomId sessionId type status title }
  }
`;
const CREATE_CONTEXT_DATA = /* GraphQL */ `
  mutation CreateContextData($input: CreateContextDataInput!) {
    createContextData(input: $input) { id type title gradeLevel ccssStandards isReference }
  }
`;

// ── Upload helpers ───────────────────────────────────────────────────────────

async function uploadClassroom(config: (typeof CLASSROOMS)[0]): Promise<CreatedClassroom> {
  process.stdout.write(`  Creating classroom: ${config.name}...`);
  const start = Date.now();
  const data = await gql(CREATE_CLASSROOM, {
    input: {
      classroomName: config.name,
      grade: config.grade,
      subject: config.subject,
      state: config.state,
      schoolYear: config.schoolYear,
      cohortSize: config.cohortSize,
    },
  });
  const classroom = data.createClassroom;
  process.stdout.write(`  ✓  id: ${classroom.id}  (${elapsed(start)})\n`);
  return { id: classroom.id, key: config.key };
}

async function uploadStudents(
  classroomId: string,
  students: ParsedStudentRow[]
): Promise<CreatedStudent[]> {
  const start = Date.now();
  const created: CreatedStudent[] = [];
  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    const studentName = s.name || `Student ${i + 1}`;
    const externalId = s.externalId || `S${String(i + 1).padStart(3, '0')}`;
    progress(`  Creating students [${i + 1}/${students.length}]  ${studentName}`);
    const confValues = s.questionResponses
      .map((qr) => qr.confidence)
      .filter((c): c is number => c != null && c >= 1 && c <= 5);
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
  progress(`  ✓ ${created.length} students created  (${elapsed(start)})`, true);
  return created;
}

async function uploadSession(
  classroomId: string,
  sessionConfig: (typeof CLASSROOMS)[0]['sessions'][0]
): Promise<CreatedSession> {
  process.stdout.write(`  Creating session: ${sessionConfig.label}...`);
  const start = Date.now();
  const data = await gql(CREATE_SESSION, {
    input: {
      classroomId,
      classroomSessionsId: classroomId,
      sessionLabel: sessionConfig.label,
      weekNumber: sessionConfig.weekNumber,
      topic: sessionConfig.topic,
      ccssStandards: sessionConfig.ccssStandards,
      status: 'completed',
    },
  });
  const session = data.createSession;
  process.stdout.write(`  ✓  id: ${session.id}  (${elapsed(start)})\n`);
  return { id: session.id, classroomId };
}

async function uploadAssessment(
  classroomId: string,
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
  process.stdout.write(`  ✓  id: ${assessment.id}  (${elapsed(start)})\n`);
  return { id: assessment.id, type, classroomId, sessionId };
}

async function uploadStudentResponses(
  label: string,
  assessmentId: string,
  students: ParsedStudentRow[],
  studentMap: Map<string, string>  // keyed by externalId
): Promise<number> {
  const start = Date.now();
  let count = 0;
  let skipped = 0;

  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    progress(`  Uploading ${label} responses [${i + 1}/${students.length}]`);

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
  progress(`  ✓ ${count} ${label} responses uploaded  (${elapsed(start)})${skipNote}`, true);
  return count;
}

async function uploadMisconceptions(
  classroomId: string,
  sessionId: string,
  misconceptions: NonNullable<(typeof CLASSROOMS)[0]['sessions'][0]['misconceptions']>
): Promise<CreatedMisconception[]> {
  const created: CreatedMisconception[] = [];
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

  progress(
    `  ✓ ${created.length} misconceptions + ${created.length} activities created  (${elapsed(start)})`,
    true
  );
  return created;
}

async function uploadContextData(
  title: string,
  gradeLevel: number | undefined,
  ccssStandards: string[],
  weekNumber: number | undefined,
  isReference: boolean,
  assessmentCode?: string
): Promise<void> {
  const tag = isReference ? '[REF]' : '[CLS]';
  process.stdout.write(`  Creating ContextData ${tag} "${title}"...`);
  const start = Date.now();

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
  process.stdout.write(`  ✓  (${elapsed(start)})\n`);
  await sleep(100);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const totalStart = Date.now();
  console.log('=== Microcoach Seed Upload ===\n');
  gql = await createGqlClient();
  console.log(`DATA_ROOT: ${DATA_ROOT}\n`);

  for (const classroomConfig of CLASSROOMS) {
    const classroomStart = Date.now();
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`${classroomConfig.key}  (grade ${classroomConfig.grade}, ${classroomConfig.state})`);
    console.log('─'.repeat(60));

    const createdClassroom = await uploadClassroom(classroomConfig);
    const classroomId = createdClassroom.id;

    for (const sessionConfig of classroomConfig.sessions) {
      // Parse PPQ
      const ppqPath = path.join(DATA_ROOT, sessionConfig.ppqFile);
      process.stdout.write(`\n  Parsing PPQ Excel...`);
      let ppqData: ParsedAssessmentData;
      try {
        ppqData = parseExcelFile(ppqPath);
        process.stdout.write(
          `  ✓  ${ppqData.students.length} students, ${ppqData.questionMeta.length} questions\n`
        );
      } catch (err) {
        console.error(`\n  ERROR parsing PPQ: ${err}`);
        continue;
      }

      // Upload students (from PPQ roster); map keyed by externalId for PostPPQ matching
      const createdStudents = await uploadStudents(classroomId, ppqData.students);
      const studentMap = new Map<string, string>();
      for (const s of createdStudents) {
        studentMap.set(s.externalId, s.id);
      }

      // Create session
      const createdSession = await uploadSession(classroomId, sessionConfig);
      const sessionId = createdSession.id;

      // Create PPQ assessment
      const ppqAssessmentData: ParsedAssessmentData = {
        ...ppqData,
        weekNumber: ppqData.weekNumber || sessionConfig.weekNumber,
        topic: sessionConfig.topic,
        ccssStandards:
          ppqData.ccssStandards.filter((s) => /\d/.test(s)).length > 0
            ? ppqData.ccssStandards
            : sessionConfig.ccssStandards,
      };
      const ppqAssessment = await uploadAssessment(classroomId, sessionId, ppqAssessmentData, 'PPQ');

      // Upload PPQ responses
      await uploadStudentResponses('PPQ', ppqAssessment.id, ppqData.students, studentMap);

      // Parse & upload PostPPQ
      let postPpqAssessmentId: string | undefined;
      if (sessionConfig.postPpqFile == null) {
        console.log(`\n  PostPPQ: skipped (not yet available)`);
      } else {
        const postPpqPath = path.join(DATA_ROOT, sessionConfig.postPpqFile);
        process.stdout.write(`\n  Parsing PostPPQ Excel...`);
        try {
          const postPpqData = parseExcelFile(postPpqPath);
          process.stdout.write(
            `  ✓  ${postPpqData.students.length} students, ${postPpqData.questionMeta.length} questions\n`
          );

          const postPpqAssessmentData: ParsedAssessmentData = {
            ...postPpqData,
            weekNumber: postPpqData.weekNumber || sessionConfig.weekNumber,
            topic: sessionConfig.topic,
            ccssStandards:
              postPpqData.ccssStandards.filter((s) => /\d/.test(s)).length > 0
                ? postPpqData.ccssStandards
                : sessionConfig.ccssStandards,
          };

          const postPpqAssessment = await uploadAssessment(
            classroomId, sessionId, postPpqAssessmentData, 'POST_PPQ', ppqAssessment.id
          );
          postPpqAssessmentId = postPpqAssessment.id;

          await uploadStudentResponses('PostPPQ', postPpqAssessment.id, postPpqData.students, studentMap);
        } catch (err) {
          console.error(`\n  ERROR processing PostPPQ: ${err}`);
        }
      }

      // Link PPQ (always) and PostPPQ (if it exists) back onto the session
      process.stdout.write(`  Linking assessments to session...`);
      await gql(UPDATE_SESSION, {
        input: {
          id: sessionId,
          ppqAssessmentId: ppqAssessment.id,
          ...(postPpqAssessmentId && { postPpqAssessmentId }),
        },
      });
      process.stdout.write(`  ✓\n`);

      // Create misconceptions + stub activities
      // Primary source: Data/{classroom.key}/{session.label}/misconceptions.json (written by ingest-ppq.js)
      // Fallback: seedData misconceptions array
      console.log('');
      const jsonPath = path.join(DATA_ROOT, classroomConfig.key, sessionConfig.label, 'misconceptions.json');
      let misconceptions = sessionConfig.misconceptions ?? [];
      try {
        const raw = fs.readFileSync(jsonPath, 'utf8');
        misconceptions = JSON.parse(raw).misconceptions;
        console.log(`  Loading misconceptions from ${path.relative(process.cwd(), jsonPath)}`);
      } catch {
        if (misconceptions.length > 0) {
          console.log(`  No misconceptions.json found — using seedData fallback`);
        } else {
          console.log(`  No misconceptions.json found and no seedData fallback — skipping`);
        }
      }
      await uploadMisconceptions(classroomId, sessionId, misconceptions);
    }

    // Classroom next step ContextData
    const session = classroomConfig.sessions[0];
    if (session) {
      console.log('');
      const nextStepTitle = `${classroomConfig.key} Session1 Next Step - ${session.topic}`;
      await uploadContextData(
        nextStepTitle, classroomConfig.grade, session.ccssStandards, session.weekNumber, false
      );
    }

    console.log(`\n  ${classroomConfig.key} complete  (${elapsed(classroomStart)})`);
  }

  // Reference ContextData
  console.log(`\n${'─'.repeat(60)}`);
  console.log('Reference Next Step ContextData');
  console.log('─'.repeat(60));
  for (const ref of REFERENCE_NEXT_STEPS) {
    await uploadContextData(
      ref.title, ref.gradeLevel, ref.ccssStandards, ref.weekNumber, true
    );
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`Upload complete  (${elapsed(totalStart)} total)`);
  console.log(`Run \`npx ts-node src/seed/verify.ts\` to check record counts.`);
  console.log('═'.repeat(60));
}

main().catch((err) => {
  console.error('\nUpload failed:', err);
  process.exit(1);
});
