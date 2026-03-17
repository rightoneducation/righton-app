/**
 * post-analyze.ts — ingest post-PPQ data and compute improvement metrics
 *
 * Run from the api/ directory:
 *   APPSYNC_SECRET_NAME=microcoach npx ts-node src/seed/post-analyze.ts
 *
 * This script:
 *   1. Uploads POST_PPQ Assessment + StudentResponse records (idempotent)
 *   2. Compares pre/post performance per misconception
 *   3. Attaches postPpqResults to each gap group in pregeneratedNextSteps
 *   4. Updates Misconception.postPpqImprovement
 *
 * It does NOT run cleanup, upload, or generate — existing data is preserved.
 */

import * as path from 'path';
import * as XLSX from 'xlsx';
import { createGqlClient, GqlFn } from './appsync-config';
import { CLASSROOMS, DATA_ROOT } from './seedData';
import {
  ParsedAssessmentData,
  ParsedQuestionMeta,
  ParsedStudentRow,
  ParsedQuestionResponse,
} from './types';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Excel parser (copied from upload.ts to keep this self-contained) ────────

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
    return undefined;
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
  const allNumericCols: number[] = [];
  for (let col = 1; col < headerRow.length; col++) {
    const cell = String(headerRow[col] ?? '').trim();
    if (cell.match(/^q?(\d+)$/i)) allNumericCols.push(col);
  }

  const confColByQNumber: Record<number, number> = {};
  for (let col = 1; col < headerRow.length; col++) {
    const cell = String(headerRow[col] ?? '').trim();
    const cMatch = cell.match(/^Q?(\d+)_Conf$/i);
    if (cMatch) confColByQNumber[parseInt(cMatch[1], 10)] = col;
  }

  const answerKeyRowIdx = isAssessmentMatrix ? 6 : 7;
  const keyRow = rows[answerKeyRowIdx] ?? [];

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
  const nameCol = isAssessmentMatrix ? 1 : 0;
  const externalIdCol = isAssessmentMatrix ? 2 : 1;
  const scoreCol = isAssessmentMatrix ? 5 : 2;

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

    const questionResponses: ParsedQuestionResponse[] = questionColumns.map((col, i): ParsedQuestionResponse | null => {
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
        if (rawResponse === '') return null;
        const isCorrect = correctAnswer !== '' && rawResponse === correctAnswer;
        return { questionNumber: qNum, response: rawResponse, isCorrect, pointsEarned: isCorrect ? 1 : 0, confidence };
      }

      const isCorrect = rawResponse !== '' && rawResponse === correctAnswer;
      return { questionNumber: qNum, response: rawResponse, isCorrect, pointsEarned: isCorrect ? 1 : 0, confidence };
    }).filter((r): r is ParsedQuestionResponse => r !== null);

    studentRows.push({ name, externalId, totalScore, questionResponses });
  }

  const weekMatch = assessmentCode.match(/W(\d+)/i);
  const weekNumber = weekMatch ? parseInt(weekMatch[1], 10) : 0;

  return {
    assessmentCode,
    ccssStandards,
    weekNumber,
    topic: '',
    classPercentCorrect,
    questionMeta,
    students: studentRows,
  };
}

// ── GraphQL queries & mutations ─────────────────────────────────────────────

const LIST_CLASSROOMS = /* GraphQL */ `
  query ListClassrooms {
    listClassrooms {
      items {
        id
        classroomName
        grade
        students {
          items {
            id
            name
            externalId
          }
        }
      }
    }
  }
`;

const SESSIONS_BY_CLASSROOM = /* GraphQL */ `
  query SessionsByClassroomId($classroomId: ID!) {
    sessionsByClassroomId(classroomId: $classroomId) {
      items {
        id
        classroomId
        sessionLabel
        weekNumber
        ppqAssessmentId
        postPpqAssessmentId
        pregeneratedNextSteps
        misconceptions {
          items {
            id
            title
            ccssStandard
            evidence {
              source
            }
          }
        }
      }
    }
  }
`;

const STUDENT_RESPONSES_BY_ASSESSMENT = /* GraphQL */ `
  query StudentResponsesByAssessmentId($assessmentId: ID!) {
    studentResponsesByAssessmentId(assessmentId: $assessmentId, limit: 1000) {
      items {
        studentId
        questionResponses {
          questionNumber
          response
          isCorrect
          confidence
        }
      }
    }
  }
`;

const CREATE_ASSESSMENT = /* GraphQL */ `
  mutation CreateAssessment($input: CreateAssessmentInput!) {
    createAssessment(input: $input) { id }
  }
`;

const CREATE_STUDENT_RESPONSE = /* GraphQL */ `
  mutation CreateStudentResponse($input: CreateStudentResponseInput!) {
    createStudentResponse(input: $input) { id }
  }
`;

const UPDATE_SESSION = /* GraphQL */ `
  mutation UpdateSession($input: UpdateSessionInput!) {
    updateSession(input: $input) {
      id
      postPpqAssessmentId
      pregeneratedNextSteps
    }
  }
`;

const UPDATE_MISCONCEPTION = /* GraphQL */ `
  mutation UpdateMisconception($input: UpdateMisconceptionInput!) {
    updateMisconception(input: $input) { id postPpqImprovement }
  }
`;

// ── Helpers ─────────────────────────────────────────────────────────────────

function parseQuestionNumbers(source: string): number[] {
  const matches = (source ?? '').matchAll(/Q(\d+)/gi);
  const nums = new Set<number>();
  for (const m of matches) nums.add(parseInt(m[1], 10));
  return [...nums].sort((a, b) => a - b);
}

// ── Main pipeline ───────────────────────────────────────────────────────────

async function main() {
  console.log('=== Post-PPQ Analysis Pipeline ===\n');

  const gql: GqlFn = await createGqlClient();

  // Find classrooms that have a postPpqFile configured
  const classroomConfigs = CLASSROOMS.filter((c) =>
    c.sessions.some((s) => s.postPpqFile != null)
  );
  if (!classroomConfigs.length) {
    console.log('No classrooms with postPpqFile configured. Nothing to do.');
    return;
  }

  // Fetch all classrooms from DB
  const classroomsData = await gql(LIST_CLASSROOMS);
  const dbClassrooms: any[] = classroomsData.listClassrooms?.items ?? [];

  for (const config of classroomConfigs) {
    console.log(`── ${config.key} ──`);

    const dbClassroom = dbClassrooms.find((c: any) => c.classroomName === config.name);
    if (!dbClassroom) {
      console.log(`  ✗ Classroom "${config.name}" not found in DB — skipping`);
      continue;
    }

    // Build student maps
    const students: any[] = dbClassroom.students?.items ?? [];
    const studentNameToId = new Map<string, string>();
    const studentIdToName = new Map<string, string>();
    const studentExternalIdToId = new Map<string, string>();
    for (const s of students) {
      if (s.name && s.id) {
        studentNameToId.set(s.name, s.id);
        studentIdToName.set(s.id, s.name);
      }
      if (s.externalId && s.id) {
        studentExternalIdToId.set(s.externalId, s.id);
      }
    }

    // Fetch sessions
    const sessionsData = await gql(SESSIONS_BY_CLASSROOM, { classroomId: dbClassroom.id });
    const dbSessions: any[] = sessionsData.sessionsByClassroomId?.items ?? [];

    for (const sessionConfig of config.sessions) {
      if (!sessionConfig.postPpqFile) continue;

      console.log(`\n  Session: ${sessionConfig.label}`);

      const dbSession = dbSessions.find(
        (s: any) => s.weekNumber === sessionConfig.weekNumber
      );
      if (!dbSession) {
        console.log(`  ✗ Session weekNumber=${sessionConfig.weekNumber} not found — skipping`);
        continue;
      }

      // ── Step 1: Upload POST_PPQ data (idempotent) ──────────────────────

      let postPpqAssessmentId = dbSession.postPpqAssessmentId;

      if (postPpqAssessmentId) {
        console.log(`  POST_PPQ already uploaded (${postPpqAssessmentId}) — skipping upload`);
      } else {
        const postPpqPath = path.join(DATA_ROOT, sessionConfig.postPpqFile);
        process.stdout.write(`  Parsing PostPPQ Excel...`);
        const postPpqData = parseExcelFile(postPpqPath);
        console.log(` ✓  ${postPpqData.students.length} students, ${postPpqData.questionMeta.length} questions`);

        const assessmentInput: Record<string, any> = {
          classroomId: dbClassroom.id,
          sessionId: dbSession.id,
          sessionAssessmentsId: dbSession.id,
          assessmentCode: postPpqData.assessmentCode || 'POST_PPQ_UNKNOWN',
          type: 'POST_PPQ',
          weekNumber: postPpqData.weekNumber || sessionConfig.weekNumber,
          topic: sessionConfig.topic,
          ccssStandards: postPpqData.ccssStandards.length > 0 ? postPpqData.ccssStandards : sessionConfig.ccssStandards,
          classPercentCorrect: postPpqData.classPercentCorrect,
          questions: postPpqData.questionMeta.map((q) => ({
            questionNumber: q.questionNumber,
            questionType: 'MC',
            correctAnswer: q.correctAnswer,
            pointValue: 1,
            ccssStandard: q.ccssStandard,
            classPercentCorrect: q.classPercentCorrect,
          })),
        };
        if (dbSession.ppqAssessmentId) {
          assessmentInput.sourceAssessmentId = dbSession.ppqAssessmentId;
        }

        process.stdout.write(`  Creating POST_PPQ assessment...`);
        const assessmentResult = await gql(CREATE_ASSESSMENT, { input: assessmentInput });
        postPpqAssessmentId = assessmentResult.createAssessment.id;
        console.log(` ✓  id: ${postPpqAssessmentId}`);

        // Upload student responses
        let responseCount = 0;
        for (const student of postPpqData.students) {
          // Match by externalId first, then by name
          let studentId = studentExternalIdToId.get(student.externalId);
          if (!studentId) studentId = studentNameToId.get(student.name);
          if (!studentId) continue;

          await gql(CREATE_STUDENT_RESPONSE, {
            input: {
              assessmentId: postPpqAssessmentId,
              assessmentStudentResponsesId: postPpqAssessmentId,
              studentId,
              totalScore: student.totalScore,
              questionResponses: student.questionResponses.map((qr) => ({
                questionNumber: qr.questionNumber,
                response: qr.response,
                isCorrect: qr.isCorrect,
                pointsEarned: qr.pointsEarned,
                confidence: qr.confidence ?? null,
              })),
            },
          });
          responseCount++;
          await sleep(50);
        }
        console.log(`  ✓ ${responseCount} POST_PPQ student responses uploaded`);

        // Link assessment to session
        await gql(UPDATE_SESSION, {
          input: { id: dbSession.id, postPpqAssessmentId },
        });
        console.log(`  ✓ Session updated with postPpqAssessmentId`);
      }

      // ── Step 2: Fetch PPQ + POST_PPQ responses ────────────────────────

      if (!dbSession.ppqAssessmentId) {
        console.log(`  ✗ No PPQ assessment linked — cannot compute improvement`);
        continue;
      }

      process.stdout.write(`  Fetching PPQ responses...`);
      const ppqData = await gql(STUDENT_RESPONSES_BY_ASSESSMENT, {
        assessmentId: dbSession.ppqAssessmentId,
      });
      const ppqResponses: any[] = ppqData.studentResponsesByAssessmentId?.items ?? [];
      console.log(` ✓  ${ppqResponses.length} responses`);

      process.stdout.write(`  Fetching POST_PPQ responses...`);
      const postData = await gql(STUDENT_RESPONSES_BY_ASSESSMENT, {
        assessmentId: postPpqAssessmentId,
      });
      const postResponses: any[] = postData.studentResponsesByAssessmentId?.items ?? [];
      console.log(` ✓  ${postResponses.length} responses`);

      // ── Step 3: Compute per-misconception improvement ─────────────────

      const misconceptions: any[] = dbSession.misconceptions?.items ?? [];
      const totalStudents = students.length || 1;

      console.log(`\n  Analyzing ${misconceptions.length} misconceptions against ${totalStudents} students...`);

      // Build lookup: studentId → PPQ score on specific questions
      const ppqByStudent = new Map<string, any[]>();
      for (const sr of ppqResponses) {
        ppqByStudent.set(sr.studentId, sr.questionResponses ?? []);
      }

      // Build lookup: studentId → POST_PPQ score (all questions)
      const postByStudent = new Map<string, any[]>();
      for (const sr of postResponses) {
        postByStudent.set(sr.studentId, sr.questionResponses ?? []);
      }

      // Parse existing pregeneratedNextSteps
      let gapGroups: any[] = [];
      try {
        const raw = dbSession.pregeneratedNextSteps;
        gapGroups = typeof raw === 'string' ? JSON.parse(raw) : (raw ?? []);
      } catch {
        console.log(`  ⚠ Could not parse pregeneratedNextSteps — starting fresh`);
      }

      const misconceptionResults: Array<{
        misconceptionId: string;
        title: string;
        improvementPct: number;
        postPpqResults: any;
      }> = [];

      // Build gap group lookup by title for evidence.source Q-numbers
      const gapGroupByTitle = new Map<string, any>();
      for (const g of gapGroups) {
        if (g.title) gapGroupByTitle.set(g.title, g);
      }

      for (const misconception of misconceptions) {
        // Evidence with Q-numbers lives on the gap group, not the Misconception DB record
        const matchingGapGroup = gapGroupByTitle.get(misconception.title);
        const evidenceSource = matchingGapGroup?.evidence?.source ?? misconception.evidence?.source ?? '';
        const sourceQNums = parseQuestionNumbers(evidenceSource);
        const threshold = 0.6;

        if (!sourceQNums.length) {
          console.log(`    ⚠ ${misconception.title}: no source Q-numbers found (evidence.source: "${evidenceSource}") — skipping`);
          continue;
        }

        // PPQ: flagged if score < threshold on source questions
        const ppqFlagged = new Set<string>();
        for (const [studentId, qrs] of ppqByStudent) {
          if (sourceQNums.length === 0) continue;
          const qSet = new Set(sourceQNums);
          const relevant = qrs.filter((qr: any) => qSet.has(qr.questionNumber));
          if (!relevant.length) continue;
          const score = relevant.filter((qr: any) => qr.isCorrect).length / relevant.length;
          if (score < threshold) ppqFlagged.add(studentId);
        }

        // POST_PPQ: flagged if score < threshold across ALL post questions
        const postFlagged = new Set<string>();
        for (const [studentId, qrs] of postByStudent) {
          if (!qrs.length) continue;
          const score = qrs.filter((qr: any) => qr.isCorrect).length / qrs.length;
          if (score < threshold) postFlagged.add(studentId);
        }

        // Classify students — only those who took BOTH assessments
        const studentsImproved: string[] = [];
        const studentsStillNeedHelp: string[] = [];
        const studentsNewlySurfaced: string[] = [];

        const tookBoth = new Set(
          [...ppqByStudent.keys()].filter((id) => postByStudent.has(id))
        );
        for (const studentId of tookBoth) {
          const name = studentIdToName.get(studentId);
          if (!name) continue;

          const wasFlagged = ppqFlagged.has(studentId);
          const isFlagged = postFlagged.has(studentId);

          if (wasFlagged && !isFlagged) {
            studentsImproved.push(name);
          } else if (wasFlagged && isFlagged) {
            studentsStillNeedHelp.push(name);
          } else if (!wasFlagged && isFlagged) {
            studentsNewlySurfaced.push(name);
          }
        }

        const sortByName = (a: string, b: string) => a.localeCompare(b);
        studentsImproved.sort(sortByName);
        studentsStillNeedHelp.sort(sortByName);
        studentsNewlySurfaced.sort(sortByName);

        // Counts scoped to students who took both assessments
        const beforeCount = [...ppqFlagged].filter((id) => tookBoth.has(id)).length;
        const afterCount = [...postFlagged].filter((id) => tookBoth.has(id)).length;
        const comparableStudents = tookBoth.size || 1;
        const classMasteryBefore = Math.round(((comparableStudents - beforeCount) / comparableStudents) * 100);
        const classMasteryAfter = Math.round(((comparableStudents - afterCount) / comparableStudents) * 100);
        const improvementPoints = classMasteryAfter - classMasteryBefore;

        const postPpqResults = {
          hasResults: true,
          beforeCount,
          afterCount,
          improvedCount: studentsImproved.length,
          classMasteryBefore,
          classMasteryAfter,
          improvementPoints,
          studentsImproved,
          studentsStillNeedHelp,
          studentsNewlySurfaced,
        };

        misconceptionResults.push({
          misconceptionId: misconception.id,
          title: misconception.title,
          improvementPct: improvementPoints,
          postPpqResults,
        });

        console.log(`    ${misconception.title}:`);
        console.log(`      Before: ${beforeCount} flagged → After: ${afterCount} flagged`);
        console.log(`      Class mastery: ${classMasteryBefore}% → ${classMasteryAfter}% (+${improvementPoints}%)`);
        console.log(`      Improved: ${studentsImproved.length}, Still need help: ${studentsStillNeedHelp.length}, Newly surfaced: ${studentsNewlySurfaced.length}`);
      }

      // ── Step 4: Merge results into pregeneratedNextSteps ──────────────

      console.log(`\n  Merging results into pregeneratedNextSteps (${gapGroups.length} gap groups)...`);

      let matched = 0;
      for (const result of misconceptionResults) {
        // Match by title first, then by standard
        let gapGroup = gapGroups.find((g: any) => g.title === result.title);
        if (!gapGroup) {
          const misconception = misconceptions.find((m: any) => m.id === result.misconceptionId);
          if (misconception?.ccssStandard) {
            gapGroup = gapGroups.find(
              (g: any) => g.ccssStandards?.targetObjective?.standard === misconception.ccssStandard
            );
          }
        }
        if (gapGroup) {
          gapGroup.postPpqResults = result.postPpqResults;
          matched++;
          console.log(`    ✓ Matched: ${result.title}`);
        } else {
          console.log(`    ✗ No match for: ${result.title}`);
        }
      }

      // Save updated pregeneratedNextSteps
      process.stdout.write(`  Saving updated pregeneratedNextSteps...`);
      await gql(UPDATE_SESSION, {
        input: {
          id: dbSession.id,
          pregeneratedNextSteps: JSON.stringify(gapGroups),
        },
      });
      console.log(` ✓  (${matched}/${misconceptionResults.length} matched)`);

      // ── Step 5: Update Misconception.postPpqImprovement ───────────────

      for (const result of misconceptionResults) {
        await gql(UPDATE_MISCONCEPTION, {
          input: {
            id: result.misconceptionId,
            postPpqImprovement: result.improvementPct,
          },
        });
      }
      console.log(`  ✓ Updated postPpqImprovement on ${misconceptionResults.length} misconceptions`);
    }

    console.log();
  }

  console.log('=== Post-PPQ Analysis Complete ===');
}

main().catch((err) => {
  console.error('\nFailed:', err);
  process.exit(1);
});
