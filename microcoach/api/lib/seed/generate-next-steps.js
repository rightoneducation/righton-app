"use strict";
/**
 * generate-next-steps.ts — run the LLM pipeline offline and save pregenerated data
 *
 * Run from the api/ directory:
 *   npx ts-node src/seed/generate-next-steps.ts
 *
 * Output: saves pregeneratedNextSteps to the Session record and sets currentWeek on Classroom
 *
 * This script replicates the data-fetch + LLM pipeline that previously ran on
 * every page load in App.js. Run it each week after ingesting new PPQ data;
 * the frontend reads currentWeek from Classroom, finds the matching Session,
 * and renders its pregeneratedNextSteps — no LLM calls at page-load time.
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const appsync_config_1 = require("./appsync-config");
const client_lambda_1 = require("@aws-sdk/client-lambda");
const AMPLIFY_ENV = (_a = process.env.AMPLIFY_ENV) !== null && _a !== void 0 ? _a : 'dev';
async function invokeLambda(functionName, payload) {
    var _a;
    const client = new client_lambda_1.LambdaClient({ region: (_a = process.env.AWS_REGION) !== null && _a !== void 0 ? _a : 'us-east-1' });
    const cmd = new client_lambda_1.InvokeCommand({
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
// ── GraphQL queries & mutations ───────────────────────────────────────────────
const LIST_CLASSROOMS = /* GraphQL */ `
  query ListClassrooms {
    listClassrooms {
      items {
        id
        classroomName
        grade
        subject
        state
        cohortSize
        students {
          items {
            id
            classroomId
            name
            externalId
            performanceX
            performanceY
            confidenceLevel
            status
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
        topic
        ccssStandards
        status
        ppqAssessmentId
        postPpqAssessmentId
      }
    }
  }
`;
const GET_SESSION = /* GraphQL */ `
  query GetSession($id: ID!) {
    getSession(id: $id) {
      id
      classroomId
      sessionLabel
      weekNumber
      topic
      ccssStandards
      status
      assessments {
        items {
          id
          classroomId
          sessionId
          assessmentCode
          type
          weekNumber
          topic
          ccssStandards
          classPercentCorrect
          questions {
            questionNumber
            questionType
            correctAnswer
            pointValue
            ccssStandard
            classPercentCorrect
          }
        }
      }
      misconceptions {
        items {
          id
          classroomId
          sessionId
          ccssStandard
          title
          description
          aiReasoning
          studentCount
          studentPercent
          severity
          priority
          occurrence
          successIndicators
          evidence {
            source
            mostCommonError
            sampleStudentWork
            aiThinkingPattern
          }
        }
      }
    }
  }
`;
const LIST_CONTEXT_DATA = /* GraphQL */ `
  query ListContextData($filter: ModelContextDataFilterInput, $limit: Int) {
    listContextData(filter: $filter, limit: $limit) {
      items {
        id
        type
        title
        gradeLevel
        ccssStandards
        isReference
        weekNumber
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
const UPDATE_SESSION = /* GraphQL */ `
  mutation UpdateSession($input: UpdateSessionInput!) {
    updateSession(input: $input) {
      id
      status
      pregeneratedNextSteps
    }
  }
`;
const UPDATE_CLASSROOM_WEEK = /* GraphQL */ `
  mutation UpdateClassroom($input: UpdateClassroomInput!) {
    updateClassroom(input: $input) {
      id
      currentWeek
    }
  }
`;
// ── Confidence stats aggregator ───────────────────────────────────────────────
function computeConfidenceStats(studentResponses, questions) {
    var _a;
    const qStats = {};
    for (const q of questions) {
        qStats[q.questionNumber] = {
            questionNumber: q.questionNumber,
            totalConf: 0, countConf: 0,
            totalConfCorrect: 0, countConfCorrect: 0,
            totalConfIncorrect: 0, countConfIncorrect: 0,
            highConfWrong: 0, totalHighConf: 0,
        };
    }
    for (const sr of studentResponses) {
        for (const qr of ((_a = sr.questionResponses) !== null && _a !== void 0 ? _a : [])) {
            const s = qStats[qr.questionNumber];
            if (!s || qr.confidence == null)
                continue;
            const conf = qr.confidence;
            s.totalConf += conf;
            s.countConf++;
            if (qr.isCorrect) {
                s.totalConfCorrect += conf;
                s.countConfCorrect++;
            }
            else {
                s.totalConfIncorrect += conf;
                s.countConfIncorrect++;
                if (conf >= 4)
                    s.highConfWrong++;
            }
            if (conf >= 4)
                s.totalHighConf++;
        }
    }
    return Object.values(qStats).map((s) => ({
        questionNumber: s.questionNumber,
        avgConfidence: s.countConf > 0 ? parseFloat((s.totalConf / s.countConf).toFixed(2)) : null,
        avgConfidenceCorrect: s.countConfCorrect > 0 ? parseFloat((s.totalConfCorrect / s.countConfCorrect).toFixed(2)) : null,
        avgConfidenceIncorrect: s.countConfIncorrect > 0 ? parseFloat((s.totalConfIncorrect / s.countConfIncorrect).toFixed(2)) : null,
        highConfWrongPct: s.totalHighConf > 0 ? parseFloat((s.highConfWrong / s.totalHighConf).toFixed(3)) : null,
    }));
}
// ── PPQ enrichment helpers ────────────────────────────────────────────────────
/** Extract question numbers from a string like "PPQ Q3, Q5" or "Q1 and Q4" → [1, 3, 4, 5] */
function parseQuestionNumbers(source) {
    const matches = (source !== null && source !== void 0 ? source : '').matchAll(/Q(\d+)/gi);
    const nums = new Set();
    for (const m of matches)
        nums.add(parseInt(m[1], 10));
    return [...nums].sort((a, b) => a - b);
}
/** Per question, count occurrences of each wrong response string. */
function computeWrongAnswerDist(studentResponses) {
    var _a, _b;
    const dist = {};
    for (const sr of studentResponses) {
        for (const qr of ((_a = sr.questionResponses) !== null && _a !== void 0 ? _a : [])) {
            if (qr.isCorrect || qr.response == null)
                continue;
            const qn = qr.questionNumber;
            if (!dist[qn])
                dist[qn] = {};
            const ans = String(qr.response).trim();
            dist[qn][ans] = ((_b = dist[qn][ans]) !== null && _b !== void 0 ? _b : 0) + 1;
        }
    }
    return dist;
}
/**
 * Build a flat list of student performance records for the questions tied to a misconception.
 * Each entry has the student's name, their score on the relevant questions, and which specific
 * answers they gave (with correct/incorrect flag). Passed to the lambda so the AI can assign
 * students to its generated groups.
 */
function getStudentPerformanceData(studentResponses, questionNumbers, studentNameMap) {
    var _a;
    if (!questionNumbers.length)
        return [];
    const qSet = new Set(questionNumbers);
    const result = [];
    for (const sr of studentResponses) {
        const name = studentNameMap.get(sr.studentId);
        if (!name)
            continue;
        const relevant = ((_a = sr.questionResponses) !== null && _a !== void 0 ? _a : []).filter((qr) => qSet.has(qr.questionNumber));
        if (!relevant.length)
            continue;
        const correct = relevant.filter((qr) => qr.isCorrect).length;
        result.push({
            name,
            score: Math.round((correct / relevant.length) * 100) / 100,
            answers: relevant.map((qr) => ({ q: qr.questionNumber, response: qr.response, correct: qr.isCorrect })),
        });
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
}
/**
 * Split students into two groups based on overall quiz performance:
 *   buildingUnderstanding — scored below threshold across all answered questions
 *   understoodConcept     — scored at or above threshold across all answered questions
 * questionNumbers is retained for API compatibility but no longer used for the split.
 */
function getStudentGroups(studentResponses, questionNumbers, // retained for API compat, no longer used for split
studentNameMap, threshold = 0.6) {
    var _a;
    const buildingUnderstanding = [];
    const understoodConcept = [];
    for (const sr of studentResponses) {
        const name = studentNameMap.get(sr.studentId);
        if (!name)
            continue;
        const all = ((_a = sr.questionResponses) !== null && _a !== void 0 ? _a : []);
        if (!all.length)
            continue;
        // Score = fraction of answered questions that are correct
        const score = all.filter((qr) => qr.isCorrect).length / all.length;
        if (score >= threshold) {
            understoodConcept.push(name);
        }
        else {
            buildingUnderstanding.push(name);
        }
    }
    const sortByName = (a, b) => {
        const [aFirst = '', ...aRest] = a.split(' ');
        const [bFirst = '', ...bRest] = b.split(' ');
        const firstCmp = aFirst.localeCompare(bFirst);
        return firstCmp !== 0 ? firstCmp : aRest.join(' ').localeCompare(bRest.join(' '));
    };
    return {
        buildingUnderstanding: buildingUnderstanding.sort(sortByName),
        understoodConcept: understoodConcept.sort(sortByName),
    };
}
// ── Next step builder ─────────────────────────────────────────────────────────
function formatLabel(f) {
    var _a;
    return ((_a = { whole_class: 'Whole class', split_class: 'Split class' }[f]) !== null && _a !== void 0 ? _a : f);
}
function buildNextSteps(misconceptions, activitiesPerGroup, ppqQuestions, learningScienceData, misconceptionExtras = []) {
    var _a, _b, _c;
    const questionErrorRates = (ppqQuestions !== null && ppqQuestions !== void 0 ? ppqQuestions : [])
        .filter((q) => q.questionNumber != null && q.classPercentCorrect != null)
        .sort((a, b) => a.questionNumber - b.questionNumber)
        .map((q) => ({
        label: `Q${q.questionNumber}`,
        errorRate: Math.round((1 - q.classPercentCorrect) * 100),
    }));
    const frameworkItems = (_a = learningScienceData === null || learningScienceData === void 0 ? void 0 : learningScienceData.standards) !== null && _a !== void 0 ? _a : [];
    const normalize = (s) => { var _a; return (_a = s === null || s === void 0 ? void 0 : s.replace(/\s/g, '').toLowerCase()) !== null && _a !== void 0 ? _a : ''; };
    const standardsDescMap = new Map();
    for (const item of frameworkItems) {
        if (item.code)
            standardsDescMap.set(item.code, item.description);
        for (const rel of [...((_b = item.prerequisiteStandards) !== null && _b !== void 0 ? _b : []), ...((_c = item.futureDependentStandards) !== null && _c !== void 0 ? _c : [])]) {
            if (rel.code && !standardsDescMap.has(rel.code))
                standardsDescMap.set(rel.code, rel.description);
        }
    }
    return misconceptions.map((m, i) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        const extras = (_a = misconceptionExtras[i]) !== null && _a !== void 0 ? _a : {};
        const activityList = ((_b = activitiesPerGroup[i]) !== null && _b !== void 0 ? _b : []).filter(Boolean);
        const frameworkItem = frameworkItems.find((item) => normalize(item.code) === normalize(m.ccssStandard));
        const prerequisiteGaps = ((_c = m.prerequisiteGapCodes) === null || _c === void 0 ? void 0 : _c.length)
            ? m.prerequisiteGapCodes.map((code) => { var _a; return ({ standard: code, description: (_a = standardsDescMap.get(code)) !== null && _a !== void 0 ? _a : '' }); })
            : ((_d = frameworkItem === null || frameworkItem === void 0 ? void 0 : frameworkItem.prerequisiteStandards) !== null && _d !== void 0 ? _d : []).map((r) => ({ standard: r.code, description: r.description }));
        const impactedObjectives = ((_e = m.impactedObjectiveCodes) === null || _e === void 0 ? void 0 : _e.length)
            ? m.impactedObjectiveCodes.map((code) => { var _a; return ({ standard: code, description: (_a = standardsDescMap.get(code)) !== null && _a !== void 0 ? _a : '' }); })
            : ((_f = frameworkItem === null || frameworkItem === void 0 ? void 0 : frameworkItem.futureDependentStandards) !== null && _f !== void 0 ? _f : []).map((r) => ({ standard: r.code, description: r.description }));
        return {
            id: `nextstep-ai-${i + 1}`,
            title: m.title,
            frequency: m.frequency,
            isCore: (_g = m.isCore) !== null && _g !== void 0 ? _g : false,
            occurrence: m.occurrence,
            example: (_h = m.example) !== null && _h !== void 0 ? _h : null,
            misconceptionSummary: m.description,
            aiReasoning: (_j = m.aiReasoning) !== null && _j !== void 0 ? _j : null,
            successIndicators: (_k = m.successIndicators) !== null && _k !== void 0 ? _k : [],
            ccssStandards: {
                targetObjective: { standard: m.ccssStandard, description: (_m = (_l = standardsDescMap.get(m.ccssStandard)) !== null && _l !== void 0 ? _l : frameworkItem === null || frameworkItem === void 0 ? void 0 : frameworkItem.description) !== null && _m !== void 0 ? _m : '', learningComponents: ((_o = frameworkItem === null || frameworkItem === void 0 ? void 0 : frameworkItem.learningComponents) !== null && _o !== void 0 ? _o : []).map((c) => c.description).filter(Boolean) },
                impactedObjectives,
                prerequisiteGaps,
            },
            evidence: (_p = m.evidence) !== null && _p !== void 0 ? _p : null,
            questionErrorRates,
            ppqQuestions: (_q = extras.ppqQuestions) !== null && _q !== void 0 ? _q : [],
            studentGroups: (_r = extras.studentGroups) !== null && _r !== void 0 ? _r : { buildingUnderstanding: [], understoodConcept: [] },
            wrongAnswerExplanations: (_s = extras.wrongAnswerExplanations) !== null && _s !== void 0 ? _s : [],
            correctAnswerSolution: (_t = extras.correctAnswerSolution) !== null && _t !== void 0 ? _t : [],
            moveOptions: activityList.map((activity, j) => {
                var _a, _b, _c, _d, _e;
                return ({
                    id: `nextstep-move-ai-${i + 1}-${j + 1}`,
                    title: activity.title,
                    time: `${activity.durationMinutes} min`,
                    format: formatLabel(activity.format),
                    activityStructure: (_a = activity.activityStructure) !== null && _a !== void 0 ? _a : null,
                    summary: activity.summary,
                    targets: (_b = activity.targets) !== null && _b !== void 0 ? _b : null,
                    instructionalMove: (_c = activity.instructionalMove) !== null && _c !== void 0 ? _c : null,
                    strategyTag: (_d = activity.strategyTag) !== null && _d !== void 0 ? _d : null,
                    aiReasoning: activity.aiReasoning,
                    tabs: (_e = activity.tabs) !== null && _e !== void 0 ? _e : null,
                });
            }),
        };
    });
}
/**
 * Inject real student names into the AI-generated studentGroupings.
 * The AI generates group criteria (name + description); we assign students
 * deterministically by score rank so every student appears in exactly one group.
 * Groups are assumed to be ordered from lowest to highest performance
 * (Group A = weakest, last group = strongest).
 */
function injectStudentsIntoGroups(activity, studentData) {
    var _a, _b;
    const groups = (_b = (_a = activity === null || activity === void 0 ? void 0 : activity.tabs) === null || _a === void 0 ? void 0 : _a.studentGroupings) === null || _b === void 0 ? void 0 : _b.groups;
    if (!(groups === null || groups === void 0 ? void 0 : groups.length) || !studentData.length)
        return activity;
    // Sort students lowest score → highest score
    const sorted = [...studentData].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));
    // Divide students as evenly as possible across groups (lowest scores → first group)
    const n = groups.length;
    const base = Math.floor(sorted.length / n);
    const remainder = sorted.length % n;
    let offset = 0;
    const assigned = groups.map((_, i) => {
        const size = base + (i < remainder ? 1 : 0);
        const slice = sorted.slice(offset, offset + size).map(s => s.name);
        offset += size;
        return slice;
    });
    return {
        ...activity,
        tabs: {
            ...activity.tabs,
            studentGroupings: {
                ...activity.tabs.studentGroupings,
                groups: groups.map((g, i) => { var _a; return ({ ...g, students: (_a = assigned[i]) !== null && _a !== void 0 ? _a : [] }); }),
            },
        },
    };
}
function parseJson(raw) {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
}
// ── Per-classroom pipeline ────────────────────────────────────────────────────
async function processClassroom(gql, classroom, nextStepExamples) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    const label = `${classroom.classroomName} (grade ${classroom.grade})`;
    // 2. List sessions
    process.stdout.write(`  Sessions...`);
    const sessionsData = await gql(SESSIONS_BY_CLASSROOM, { classroomId: classroom.id });
    const sessionStubs = (_b = (_a = sessionsData.sessionsByClassroomId) === null || _a === void 0 ? void 0 : _a.items) !== null && _b !== void 0 ? _b : [];
    if (!sessionStubs.length) {
        console.log(' — no sessions, skipping');
        return;
    }
    const sorted = [...sessionStubs].sort((a, b) => { var _a, _b; return ((_a = a.weekNumber) !== null && _a !== void 0 ? _a : 0) - ((_b = b.weekNumber) !== null && _b !== void 0 ? _b : 0); });
    const currentStub = sorted[sorted.length - 1];
    const historyStubs = sorted.slice(0, sorted.length - 1);
    console.log(` ✓  current: ${currentStub.sessionLabel}${historyStubs.length ? `, ${historyStubs.length} historical` : ''}`);
    // 3. Fetch full session details
    process.stdout.write(`  Session details...`);
    const [currentSession, ...historySessions] = await Promise.all([currentStub, ...historyStubs].map((s) => gql(GET_SESSION, { id: s.id }).then((d) => d.getSession)));
    console.log(' ✓');
    const ppq = (_d = (_c = currentSession === null || currentSession === void 0 ? void 0 : currentSession.assessments) === null || _c === void 0 ? void 0 : _c.items) === null || _d === void 0 ? void 0 : _d.find((a) => a.type === 'PPQ');
    const allCcss = [
        ...new Set([
            ...((_e = ppq === null || ppq === void 0 ? void 0 : ppq.ccssStandards) !== null && _e !== void 0 ? _e : []),
            ...((_f = currentSession === null || currentSession === void 0 ? void 0 : currentSession.ccssStandards) !== null && _f !== void 0 ? _f : []),
        ])
    ].filter(Boolean);
    if (!allCcss.length) {
        console.log(`  ✗ No CCSS standards found — skipping`);
        return;
    }
    // 4. Learning science data
    process.stdout.write(`  Learning science (${allCcss.join(', ')})...`);
    const lsResults = await Promise.all(allCcss.map((ccss) => invokeLambda(`microcoachGetLearningScience-${AMPLIFY_ENV}`, { input: { ccss } })
        .then((r) => parseJson(r))
        .catch(() => ({ standards: [] }))));
    const learningScienceData = {
        standards: lsResults.flatMap((r) => { var _a; return (_a = r === null || r === void 0 ? void 0 : r.standards) !== null && _a !== void 0 ? _a : []; }),
    };
    console.log(` ✓  (${learningScienceData.standards.length} standards)`);
    console.log(`  [LS] standards returned: ${learningScienceData.standards.length}`);
    for (const s of learningScienceData.standards) {
        console.log(`  [LS]   ${s.code}: ${(_h = (_g = s.prerequisiteStandards) === null || _g === void 0 ? void 0 : _g.length) !== null && _h !== void 0 ? _h : 0} prereqs, ${(_k = (_j = s.futureDependentStandards) === null || _j === void 0 ? void 0 : _j.length) !== null && _k !== void 0 ? _k : 0} future`);
        if ((_l = s.prerequisiteStandards) === null || _l === void 0 ? void 0 : _l.length)
            console.log(`  [LS]     prereqs:`, s.prerequisiteStandards.map((r) => r.code));
        if ((_m = s.futureDependentStandards) === null || _m === void 0 ? void 0 : _m.length)
            console.log(`  [LS]     future:`, s.futureDependentStandards.map((r) => r.code));
    }
    // 4b. Student responses — confidence stats + PPQ enrichment
    let augmentedPpq = ppq;
    let studentResponses = [];
    if (ppq === null || ppq === void 0 ? void 0 : ppq.id) {
        process.stdout.write(`  Student responses...`);
        try {
            const srData = await gql(STUDENT_RESPONSES_BY_ASSESSMENT, { assessmentId: ppq.id });
            studentResponses = (_p = (_o = srData === null || srData === void 0 ? void 0 : srData.studentResponsesByAssessmentId) === null || _o === void 0 ? void 0 : _o.items) !== null && _p !== void 0 ? _p : [];
            const hasConfidence = studentResponses.some((sr) => { var _a; return ((_a = sr.questionResponses) !== null && _a !== void 0 ? _a : []).some((qr) => qr.confidence != null); });
            if (hasConfidence) {
                const confidenceStats = computeConfidenceStats(studentResponses, (_q = ppq.questions) !== null && _q !== void 0 ? _q : []);
                augmentedPpq = { ...ppq, confidenceStats };
                console.log(` ✓  (${studentResponses.length}, with confidence)`);
            }
            else {
                console.log(` ✓  (${studentResponses.length}, no confidence)`);
            }
        }
        catch (err) {
            console.log(` ✗ ${err} — continuing`);
        }
    }
    const studentNameMap = new Map();
    for (const s of ((_s = (_r = classroom.students) === null || _r === void 0 ? void 0 : _r.items) !== null && _s !== void 0 ? _s : [])) {
        if (s.id && s.name)
            studentNameMap.set(s.id, s.name);
    }
    const wrongAnswerDist = computeWrongAnswerDist(studentResponses);
    // 5. Misconception analysis
    process.stdout.write(`  Misconception analysis...`);
    const analysisResult = await invokeLambda(`microcoachLLMAnalysis-${AMPLIFY_ENV}`, {
        input: {
            classroomData: JSON.stringify({
                classroom,
                currentSession,
                sessionHistory: historySessions,
                ppq: augmentedPpq,
                wrongAnswerDist,
            }),
            learningScienceData: JSON.stringify(learningScienceData),
        },
    });
    const analysis = parseJson(analysisResult);
    const misconceptions = (_t = analysis === null || analysis === void 0 ? void 0 : analysis.misconceptions) !== null && _t !== void 0 ? _t : [];
    console.log(` ✓  ${misconceptions.length} misconceptions`);
    // 5c. Per-misconception extras
    const ppqQs = ((_u = ppq === null || ppq === void 0 ? void 0 : ppq.questions) !== null && _u !== void 0 ? _u : []).map((q) => {
        var _a, _b;
        return ({
            questionNumber: q.questionNumber,
            correctAnswer: (_a = q.correctAnswer) !== null && _a !== void 0 ? _a : null,
            classPercentCorrect: (_b = q.classPercentCorrect) !== null && _b !== void 0 ? _b : null,
        });
    });
    const misconceptionExtras = misconceptions.map((m) => {
        var _a, _b, _c, _d;
        const qNums = parseQuestionNumbers((_b = (_a = m.evidence) === null || _a === void 0 ? void 0 : _a.source) !== null && _b !== void 0 ? _b : '');
        return {
            ppqQuestions: ppqQs,
            studentGroups: getStudentGroups(studentResponses, qNums, studentNameMap),
            studentData: getStudentPerformanceData(studentResponses, qNums, studentNameMap),
            wrongAnswerExplanations: (_c = m.wrongAnswerExplanations) !== null && _c !== void 0 ? _c : [],
            correctAnswerSolution: (_d = m.correctAnswerSolution) !== null && _d !== void 0 ? _d : [],
        };
    });
    // 6. Generate next step activities
    const classroomContext = { grade: classroom.grade, subject: classroom.subject, cohortSize: classroom.cohortSize };
    const NEXT_STEP_FORMATS = ['whole_class', 'split_class'];
    let structurePlan = [];
    process.stdout.write(`  Planning activity structures for ${misconceptions.length} misconceptions...`);
    try {
        const raw = await invokeLambda(`microcoachNextStepOption-${AMPLIFY_ENV}`, {
            input: {
                planStructures: true,
                misconceptions: JSON.stringify(misconceptions.map((m) => ({ title: m.title, description: m.description, ccssStandard: m.ccssStandard }))),
                classroomContext: JSON.stringify(classroomContext),
            },
        });
        structurePlan = (_v = parseJson(raw)) !== null && _v !== void 0 ? _v : [];
        console.log(` ✓  ${structurePlan.length} assignments`);
    }
    catch (err) {
        console.warn(`\n  ⚠ Structure planning failed, generating without suggestions: ${err}`);
    }
    // Helper to look up a misconception's suggested structure for a given format
    const getSuggestedStructure = (title, fmt) => {
        var _a;
        const plan = structurePlan.find(p => p.misconceptionTitle === title);
        return plan ? (_a = plan[fmt]) !== null && _a !== void 0 ? _a : null : null;
    };
    // 6b. Generate activities — misconceptions in parallel, formats sequential within each
    const activitiesPerGroup = await Promise.all(misconceptions.map(async (m, i) => {
        var _a, _b;
        process.stdout.write(`  Next steps [${i + 1}/${misconceptions.length}]: ${m.title}...`);
        const relevant = nextStepExamples.filter((ex) => {
            var _a;
            return !((_a = ex.ccssStandards) === null || _a === void 0 ? void 0 : _a.length) ||
                ex.ccssStandards.some((s) => { var _a; return s === m.ccssStandard || s.startsWith((_a = m.ccssStandard) === null || _a === void 0 ? void 0 : _a.split('.')[0]); });
        });
        const baseInput = {
            misconception: JSON.stringify(m),
            learningScienceData: JSON.stringify(learningScienceData),
            classroomContext: JSON.stringify(classroomContext),
            ...(relevant.length > 0 && { contextData: JSON.stringify(relevant) }),
        };
        const sd = (_b = (_a = misconceptionExtras[i]) === null || _a === void 0 ? void 0 : _a.studentData) !== null && _b !== void 0 ? _b : [];
        const resultList = [];
        // Sequential within misconception so each format sees what was already generated
        for (const fmt of NEXT_STEP_FORMATS) {
            const existingActivities = resultList.map(a => ({
                title: a.title,
                format: a.format,
                activityStructure: a.activityStructure,
                strategyTag: a.strategyTag,
                summary: a.summary,
                instructionalMove: a.instructionalMove,
                targets: a.targets,
            }));
            const suggestedStructure = getSuggestedStructure(m.title, fmt);
            try {
                const raw = await invokeLambda(`microcoachNextStepOption-${AMPLIFY_ENV}`, {
                    input: {
                        ...baseInput,
                        preferredFormat: fmt,
                        ...(suggestedStructure && { suggestedStructure }),
                        ...(existingActivities.length > 0 && { existingActivities: JSON.stringify(existingActivities) }),
                    },
                });
                const parsed = parseJson(raw);
                resultList.push(injectStudentsIntoGroups(parsed, sd));
            }
            catch (err) {
                console.error(`\n    ✗ format=${fmt}: ${err}`);
            }
        }
        console.log(` ✓  ${resultList.length} activities`);
        return resultList;
    }));
    // 7. Build + save
    const nextSteps = buildNextSteps(misconceptions, activitiesPerGroup, ppq === null || ppq === void 0 ? void 0 : ppq.questions, learningScienceData, misconceptionExtras);
    process.stdout.write(`  Saving ${nextSteps.length} next steps to session ${currentStub.id}...`);
    await gql(UPDATE_SESSION, {
        input: {
            id: currentStub.id,
            pregeneratedNextSteps: JSON.stringify(nextSteps),
            status: 'generated',
        },
    });
    console.log(' ✓');
    process.stdout.write(`  Setting currentWeek to ${currentStub.weekNumber}...`);
    await gql(UPDATE_CLASSROOM_WEEK, { input: { id: classroom.id, currentWeek: currentStub.weekNumber } });
    console.log(' ✓');
}
// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    var _a, _b, _c, _d;
    console.log('=== Microcoach Next Step Generator ===\n');
    const gql = await (0, appsync_config_1.createGqlClient)();
    // 1. Fetch all classrooms
    process.stdout.write('Fetching classrooms...');
    const classroomsData = await gql(LIST_CLASSROOMS);
    const classrooms = (_b = (_a = classroomsData.listClassrooms) === null || _a === void 0 ? void 0 : _a.items) !== null && _b !== void 0 ? _b : [];
    if (!classrooms.length)
        throw new Error('No classrooms found');
    console.log(` ✓  ${classrooms.length} classroom(s)`);
    // 2. Fetch shared next step examples once (used by all classrooms)
    process.stdout.write('Fetching next step examples...');
    const nextStepData = await gql(LIST_CONTEXT_DATA, {
        filter: { type: { eq: 'NEXT_STEP_LESSON' } },
        limit: 20,
    });
    const nextStepExamples = (_d = (_c = nextStepData.listContextData) === null || _c === void 0 ? void 0 : _c.items) !== null && _d !== void 0 ? _d : [];
    console.log(` ✓  ${nextStepExamples.length} examples\n`);
    // 3. Process each classroom sequentially
    for (const classroom of classrooms) {
        console.log(`── ${classroom.classroomName} (grade ${classroom.grade}) ──`);
        try {
            await processClassroom(gql, classroom, nextStepExamples);
        }
        catch (err) {
            console.error(`  ✗ Failed: ${err}`);
        }
        console.log();
    }
    console.log('=== Done ===');
}
main().catch((err) => {
    console.error('\nFailed:', err);
    process.exit(1);
});
