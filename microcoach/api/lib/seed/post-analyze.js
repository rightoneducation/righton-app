"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const XLSX = __importStar(require("xlsx"));
const appsync_config_1 = require("./appsync-config");
const seedData_1 = require("./seedData");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// ── Excel parser (copied from upload.ts to keep this self-contained) ────────
function parseConfidenceLetter(raw) {
    const val = raw.trim().toUpperCase();
    if (!val)
        return undefined;
    const map = { A: 5, B: 4, C: 3, D: 1 };
    if (val.length === 1)
        return map[val];
    if (val.length === 2) {
        const s1 = map[val[0]], s2 = map[val[1]];
        if (s1 == null || s2 == null)
            return undefined;
        const order = 'ABCD';
        if (order.indexOf(val[1]) === order.indexOf(val[0]) + 1)
            return (s1 + s2) / 2;
        return undefined;
    }
    return undefined;
}
function parseExcelFile(filePath) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (rows.length < 8) {
        throw new Error(`Excel file ${filePath} has fewer than 8 rows — unexpected format`);
    }
    const isAssessmentMatrix = String((_b = (_a = rows[1]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : '').includes('Assessment Matrix');
    let assessmentCode;
    if (isAssessmentMatrix) {
        const title = String((_c = rows[1][0]) !== null && _c !== void 0 ? _c : '');
        const colonIdx = title.indexOf(':');
        assessmentCode = (colonIdx >= 0 ? title.slice(colonIdx + 1) : title).trim();
    }
    else {
        assessmentCode = String((_d = rows[0].find((v) => v !== '' && v !== null && v !== undefined)) !== null && _d !== void 0 ? _d : 'UNKNOWN').trim();
    }
    const ccssRow = (_e = rows[1]) !== null && _e !== void 0 ? _e : [];
    const ccssStandards = isAssessmentMatrix
        ? []
        : ccssRow.slice(1).map((v) => String(v !== null && v !== void 0 ? v : '').trim()).filter((v) => v.length > 0 && /\d/.test(v));
    const headerRow = (_f = rows[2]) !== null && _f !== void 0 ? _f : [];
    const allNumericCols = [];
    for (let col = 1; col < headerRow.length; col++) {
        const cell = String((_g = headerRow[col]) !== null && _g !== void 0 ? _g : '').trim();
        if (cell.match(/^q?(\d+)$/i))
            allNumericCols.push(col);
    }
    const confColByQNumber = {};
    for (let col = 1; col < headerRow.length; col++) {
        const cell = String((_h = headerRow[col]) !== null && _h !== void 0 ? _h : '').trim();
        const cMatch = cell.match(/^Q?(\d+)_Conf$/i);
        if (cMatch)
            confColByQNumber[parseInt(cMatch[1], 10)] = col;
    }
    const answerKeyRowIdx = isAssessmentMatrix ? 6 : 7;
    const keyRow = (_j = rows[answerKeyRowIdx]) !== null && _j !== void 0 ? _j : [];
    let isInterleaved = false;
    let questionColumns = [...allNumericCols];
    let questionNumbers = allNumericCols.map((col) => {
        var _a;
        const cell = String((_a = headerRow[col]) !== null && _a !== void 0 ? _a : '').trim();
        return parseInt(cell.replace(/^q/i, ''), 10);
    });
    if (isAssessmentMatrix && Object.keys(confColByQNumber).length === 0) {
        const quizCols = [];
        const quizNums = [];
        const newConfColByQNumber = {};
        let quizSeq = 0;
        for (const col of allNumericCols) {
            const keyVal = String((_k = keyRow[col]) !== null && _k !== void 0 ? _k : '').trim().toUpperCase();
            if (keyVal.length === 1 && 'ABCDE'.includes(keyVal)) {
                quizSeq++;
                quizCols.push(col);
                quizNums.push(quizSeq);
            }
            else if (keyVal === '' && quizSeq > 0 && newConfColByQNumber[quizSeq] == null) {
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
    const classRow = (_l = rows[3]) !== null && _l !== void 0 ? _l : [];
    const classPercentByCol = {};
    for (const col of questionColumns) {
        const val = classRow[col];
        if (val !== '' && val != null) {
            const pct = parseFloat(String(val));
            classPercentByCol[col] = isNaN(pct) ? 0 : pct > 1 ? pct / 100 : pct;
        }
    }
    const pctValues = Object.values(classPercentByCol);
    const classPercentCorrect = pctValues.length > 0 ? pctValues.reduce((a, b) => a + b, 0) / pctValues.length : 0;
    const answerKeyByCol = {};
    for (const col of questionColumns) {
        const val = String((_m = keyRow[col]) !== null && _m !== void 0 ? _m : '').trim().toUpperCase();
        if (val.length === 1 && 'ABCDE'.includes(val))
            answerKeyByCol[col] = val;
    }
    const questionMeta = questionColumns.map((col, i) => {
        var _a, _b, _c, _d;
        return ({
            questionNumber: questionNumbers[i],
            correctAnswer: (_a = answerKeyByCol[col]) !== null && _a !== void 0 ? _a : '',
            classPercentCorrect: (_b = classPercentByCol[col]) !== null && _b !== void 0 ? _b : 0,
            ccssStandard: (_d = (_c = ccssStandards[i]) !== null && _c !== void 0 ? _c : ccssStandards[0]) !== null && _d !== void 0 ? _d : '',
        });
    });
    const studentStartRow = isAssessmentMatrix ? 7 : 8;
    const nameCol = isAssessmentMatrix ? 1 : 0;
    const externalIdCol = isAssessmentMatrix ? 2 : 1;
    const scoreCol = isAssessmentMatrix ? 5 : 2;
    const studentRows = [];
    for (let r = studentStartRow; r < rows.length; r++) {
        const row = rows[r];
        const name = String((_o = row[nameCol]) !== null && _o !== void 0 ? _o : '').trim();
        if (!name)
            continue;
        if (name.toLowerCase().includes('total') || name.toLowerCase().includes('average'))
            continue;
        const externalId = String((_p = row[externalIdCol]) !== null && _p !== void 0 ? _p : '').trim();
        const rawScore = parseFloat(String((_q = row[scoreCol]) !== null && _q !== void 0 ? _q : '0'));
        let totalScore = isNaN(rawScore) ? 0 : rawScore;
        if (isAssessmentMatrix) {
            totalScore = totalScore / 100;
        }
        else if (totalScore > 1) {
            totalScore = totalScore / 100;
        }
        const questionResponses = questionColumns.map((col, i) => {
            var _a, _b, _c;
            const rawResponse = String((_a = row[col]) !== null && _a !== void 0 ? _a : '').trim().toUpperCase();
            const correctAnswer = (_b = answerKeyByCol[col]) !== null && _b !== void 0 ? _b : '';
            const qNum = questionNumbers[i];
            const confCol = confColByQNumber[qNum];
            let confidence;
            if (confCol != null) {
                const rawConf = String((_c = row[confCol]) !== null && _c !== void 0 ? _c : '').trim();
                if (isInterleaved) {
                    confidence = parseConfidenceLetter(rawConf);
                }
                else {
                    const n = parseFloat(rawConf);
                    confidence = !isNaN(n) && n >= 1 && n <= 5 ? n : undefined;
                }
            }
            if (isAssessmentMatrix) {
                if (rawResponse === '')
                    return null;
                const isCorrect = correctAnswer !== '' && rawResponse === correctAnswer;
                return { questionNumber: qNum, response: rawResponse, isCorrect, pointsEarned: isCorrect ? 1 : 0, confidence };
            }
            const isCorrect = rawResponse !== '' && rawResponse === correctAnswer;
            return { questionNumber: qNum, response: rawResponse, isCorrect, pointsEarned: isCorrect ? 1 : 0, confidence };
        }).filter((r) => r !== null);
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
function parseQuestionNumbers(source) {
    const matches = (source !== null && source !== void 0 ? source : '').matchAll(/Q(\d+)/gi);
    const nums = new Set();
    for (const m of matches)
        nums.add(parseInt(m[1], 10));
    return [...nums].sort((a, b) => a - b);
}
// ── Main pipeline ───────────────────────────────────────────────────────────
async function main() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    console.log('=== Post-PPQ Analysis Pipeline ===\n');
    const gql = await (0, appsync_config_1.createGqlClient)();
    // Find classrooms that have a postPpqFile configured
    const classroomConfigs = seedData_1.CLASSROOMS.filter((c) => c.sessions.some((s) => s.postPpqFile != null));
    if (!classroomConfigs.length) {
        console.log('No classrooms with postPpqFile configured. Nothing to do.');
        return;
    }
    // Fetch all classrooms from DB
    const classroomsData = await gql(LIST_CLASSROOMS);
    const dbClassrooms = (_b = (_a = classroomsData.listClassrooms) === null || _a === void 0 ? void 0 : _a.items) !== null && _b !== void 0 ? _b : [];
    for (const config of classroomConfigs) {
        console.log(`── ${config.key} ──`);
        const dbClassroom = dbClassrooms.find((c) => c.classroomName === config.name);
        if (!dbClassroom) {
            console.log(`  ✗ Classroom "${config.name}" not found in DB — skipping`);
            continue;
        }
        // Build student maps
        const students = (_d = (_c = dbClassroom.students) === null || _c === void 0 ? void 0 : _c.items) !== null && _d !== void 0 ? _d : [];
        const studentNameToId = new Map();
        const studentIdToName = new Map();
        const studentExternalIdToId = new Map();
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
        const dbSessions = (_f = (_e = sessionsData.sessionsByClassroomId) === null || _e === void 0 ? void 0 : _e.items) !== null && _f !== void 0 ? _f : [];
        for (const sessionConfig of config.sessions) {
            if (!sessionConfig.postPpqFile)
                continue;
            console.log(`\n  Session: ${sessionConfig.label}`);
            const dbSession = dbSessions.find((s) => s.weekNumber === sessionConfig.weekNumber);
            if (!dbSession) {
                console.log(`  ✗ Session weekNumber=${sessionConfig.weekNumber} not found — skipping`);
                continue;
            }
            // ── Step 1: Upload POST_PPQ data (idempotent) ──────────────────────
            let postPpqAssessmentId = dbSession.postPpqAssessmentId;
            if (postPpqAssessmentId) {
                console.log(`  POST_PPQ already uploaded (${postPpqAssessmentId}) — skipping upload`);
            }
            else {
                const postPpqPath = path.join(seedData_1.DATA_ROOT, sessionConfig.postPpqFile);
                process.stdout.write(`  Parsing PostPPQ Excel...`);
                const postPpqData = parseExcelFile(postPpqPath);
                console.log(` ✓  ${postPpqData.students.length} students, ${postPpqData.questionMeta.length} questions`);
                const assessmentInput = {
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
                    if (!studentId)
                        studentId = studentNameToId.get(student.name);
                    if (!studentId)
                        continue;
                    await gql(CREATE_STUDENT_RESPONSE, {
                        input: {
                            assessmentId: postPpqAssessmentId,
                            assessmentStudentResponsesId: postPpqAssessmentId,
                            studentId,
                            totalScore: student.totalScore,
                            questionResponses: student.questionResponses.map((qr) => {
                                var _a;
                                return ({
                                    questionNumber: qr.questionNumber,
                                    response: qr.response,
                                    isCorrect: qr.isCorrect,
                                    pointsEarned: qr.pointsEarned,
                                    confidence: (_a = qr.confidence) !== null && _a !== void 0 ? _a : null,
                                });
                            }),
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
            const ppqResponses = (_h = (_g = ppqData.studentResponsesByAssessmentId) === null || _g === void 0 ? void 0 : _g.items) !== null && _h !== void 0 ? _h : [];
            console.log(` ✓  ${ppqResponses.length} responses`);
            process.stdout.write(`  Fetching POST_PPQ responses...`);
            const postData = await gql(STUDENT_RESPONSES_BY_ASSESSMENT, {
                assessmentId: postPpqAssessmentId,
            });
            const postResponses = (_k = (_j = postData.studentResponsesByAssessmentId) === null || _j === void 0 ? void 0 : _j.items) !== null && _k !== void 0 ? _k : [];
            console.log(` ✓  ${postResponses.length} responses`);
            // ── Step 3: Compute per-misconception improvement ─────────────────
            const misconceptions = (_m = (_l = dbSession.misconceptions) === null || _l === void 0 ? void 0 : _l.items) !== null && _m !== void 0 ? _m : [];
            const totalStudents = students.length || 1;
            console.log(`\n  Analyzing ${misconceptions.length} misconceptions against ${totalStudents} students...`);
            // Build lookup: studentId → PPQ score on specific questions
            const ppqByStudent = new Map();
            for (const sr of ppqResponses) {
                ppqByStudent.set(sr.studentId, (_o = sr.questionResponses) !== null && _o !== void 0 ? _o : []);
            }
            // Build lookup: studentId → POST_PPQ score (all questions)
            const postByStudent = new Map();
            for (const sr of postResponses) {
                postByStudent.set(sr.studentId, (_p = sr.questionResponses) !== null && _p !== void 0 ? _p : []);
            }
            // Parse existing pregeneratedNextSteps
            let gapGroups = [];
            try {
                const raw = dbSession.pregeneratedNextSteps;
                gapGroups = typeof raw === 'string' ? JSON.parse(raw) : (raw !== null && raw !== void 0 ? raw : []);
            }
            catch {
                console.log(`  ⚠ Could not parse pregeneratedNextSteps — starting fresh`);
            }
            const misconceptionResults = [];
            // Build gap group lookup by title for evidence.source Q-numbers
            const gapGroupByTitle = new Map();
            for (const g of gapGroups) {
                if (g.title)
                    gapGroupByTitle.set(g.title, g);
            }
            for (const misconception of misconceptions) {
                // Evidence with Q-numbers lives on the gap group, not the Misconception DB record
                const matchingGapGroup = gapGroupByTitle.get(misconception.title);
                const evidenceSource = (_t = (_r = (_q = matchingGapGroup === null || matchingGapGroup === void 0 ? void 0 : matchingGapGroup.evidence) === null || _q === void 0 ? void 0 : _q.source) !== null && _r !== void 0 ? _r : (_s = misconception.evidence) === null || _s === void 0 ? void 0 : _s.source) !== null && _t !== void 0 ? _t : '';
                const sourceQNums = parseQuestionNumbers(evidenceSource);
                const threshold = 0.6;
                if (!sourceQNums.length) {
                    console.log(`    ⚠ ${misconception.title}: no source Q-numbers found (evidence.source: "${evidenceSource}") — skipping`);
                    continue;
                }
                // PPQ: flagged if score < threshold on source questions
                const ppqFlagged = new Set();
                for (const [studentId, qrs] of ppqByStudent) {
                    if (sourceQNums.length === 0)
                        continue;
                    const qSet = new Set(sourceQNums);
                    const relevant = qrs.filter((qr) => qSet.has(qr.questionNumber));
                    if (!relevant.length)
                        continue;
                    const score = relevant.filter((qr) => qr.isCorrect).length / relevant.length;
                    if (score < threshold)
                        ppqFlagged.add(studentId);
                }
                // POST_PPQ: flagged if score < threshold across ALL post questions
                const postFlagged = new Set();
                for (const [studentId, qrs] of postByStudent) {
                    if (!qrs.length)
                        continue;
                    const score = qrs.filter((qr) => qr.isCorrect).length / qrs.length;
                    if (score < threshold)
                        postFlagged.add(studentId);
                }
                // Classify students — only those who took BOTH assessments
                const studentsImproved = [];
                const studentsStillNeedHelp = [];
                const studentsNewlySurfaced = [];
                const tookBoth = new Set([...ppqByStudent.keys()].filter((id) => postByStudent.has(id)));
                for (const studentId of tookBoth) {
                    const name = studentIdToName.get(studentId);
                    if (!name)
                        continue;
                    const wasFlagged = ppqFlagged.has(studentId);
                    const isFlagged = postFlagged.has(studentId);
                    if (wasFlagged && !isFlagged) {
                        studentsImproved.push(name);
                    }
                    else if (wasFlagged && isFlagged) {
                        studentsStillNeedHelp.push(name);
                    }
                    else if (!wasFlagged && isFlagged) {
                        studentsNewlySurfaced.push(name);
                    }
                }
                const sortByName = (a, b) => a.localeCompare(b);
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
                let gapGroup = gapGroups.find((g) => g.title === result.title);
                if (!gapGroup) {
                    const misconception = misconceptions.find((m) => m.id === result.misconceptionId);
                    if (misconception === null || misconception === void 0 ? void 0 : misconception.ccssStandard) {
                        gapGroup = gapGroups.find((g) => { var _a, _b; return ((_b = (_a = g.ccssStandards) === null || _a === void 0 ? void 0 : _a.targetObjective) === null || _b === void 0 ? void 0 : _b.standard) === misconception.ccssStandard; });
                    }
                }
                if (gapGroup) {
                    gapGroup.postPpqResults = result.postPpqResults;
                    matched++;
                    console.log(`    ✓ Matched: ${result.title}`);
                }
                else {
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
