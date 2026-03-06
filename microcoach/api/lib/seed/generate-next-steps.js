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
 * Split students into two groups for a given set of question numbers:
 *   buildingUnderstanding — got at least one question wrong (sorted by wrong count desc, then alpha)
 *   understoodConcept     — got all relevant questions correct (sorted alphabetically)
 * Students with no responses for these questions are excluded.
 */
function getStudentGroups(studentResponses, questionNumbers, studentNameMap) {
    var _a, _b;
    if (!questionNumbers.length)
        return { buildingUnderstanding: [], understoodConcept: [] };
    const qSet = new Set(questionNumbers);
    const wrongCount = new Map();
    const correctOnly = new Set();
    for (const sr of studentResponses) {
        const name = studentNameMap.get(sr.studentId);
        if (!name)
            continue;
        const relevant = ((_a = sr.questionResponses) !== null && _a !== void 0 ? _a : []).filter((qr) => qSet.has(qr.questionNumber));
        if (!relevant.length)
            continue;
        const wrongs = relevant.filter((qr) => !qr.isCorrect).length;
        if (wrongs > 0) {
            wrongCount.set(name, ((_b = wrongCount.get(name)) !== null && _b !== void 0 ? _b : 0) + wrongs);
        }
        else {
            correctOnly.add(name);
        }
    }
    const buildingUnderstanding = [...wrongCount.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([name]) => name);
    const understoodConcept = [...correctOnly].sort((a, b) => a.localeCompare(b));
    return { buildingUnderstanding, understoodConcept };
}
// ── Next step builder ─────────────────────────────────────────────────────────
function formatLabel(f) {
    var _a;
    return ((_a = { small_group: 'Small groups', whole_class: 'Whole class', individual: 'Individual' }[f]) !== null && _a !== void 0 ? _a : f);
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
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
                targetObjective: { standard: m.ccssStandard, description: m.description },
                impactedObjectives,
                prerequisiteGaps,
            },
            evidence: (_l = m.evidence) !== null && _l !== void 0 ? _l : null,
            questionErrorRates,
            ppqQuestions: (_m = extras.ppqQuestions) !== null && _m !== void 0 ? _m : [],
            studentGroups: (_o = extras.studentGroups) !== null && _o !== void 0 ? _o : { buildingUnderstanding: [], understoodConcept: [] },
            wrongAnswerExplanations: (_p = extras.wrongAnswerExplanations) !== null && _p !== void 0 ? _p : [],
            correctAnswerSolution: (_q = extras.correctAnswerSolution) !== null && _q !== void 0 ? _q : [],
            moveOptions: activityList.map((activity, j) => {
                var _a, _b, _c, _d;
                return ({
                    id: `nextstep-move-ai-${i + 1}-${j + 1}`,
                    title: activity.title,
                    time: `${activity.durationMinutes} min`,
                    format: formatLabel(activity.format),
                    summary: activity.summary,
                    targets: (_a = activity.targets) !== null && _a !== void 0 ? _a : null,
                    instructionalMove: (_b = activity.instructionalMove) !== null && _b !== void 0 ? _b : null,
                    strategyTag: (_c = activity.strategyTag) !== null && _c !== void 0 ? _c : null,
                    aiReasoning: activity.aiReasoning,
                    tabs: (_d = activity.tabs) !== null && _d !== void 0 ? _d : null,
                });
            }),
        };
    });
}
function parseJson(raw) {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
}
// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    console.log('=== Microcoach Next Step Generator ===\n');
    const gql = await (0, appsync_config_1.createGqlClient)();
    // 1. Find grade 6 classroom
    process.stdout.write('Fetching classrooms...');
    const classroomsData = await gql(LIST_CLASSROOMS);
    const classrooms = (_b = (_a = classroomsData.listClassrooms) === null || _a === void 0 ? void 0 : _a.items) !== null && _b !== void 0 ? _b : [];
    const gr6 = classrooms.find((c) => c.grade === 6);
    if (!gr6)
        throw new Error('No grade 6 classroom found');
    console.log(` ✓  ${gr6.classroomName} (id: ${gr6.id})`);
    // 2. List sessions
    process.stdout.write('Fetching sessions...');
    const sessionsData = await gql(SESSIONS_BY_CLASSROOM, { classroomId: gr6.id });
    const sessionStubs = (_d = (_c = sessionsData.sessionsByClassroomId) === null || _c === void 0 ? void 0 : _c.items) !== null && _d !== void 0 ? _d : [];
    if (!sessionStubs.length)
        throw new Error('No sessions found for this classroom');
    const sorted = [...sessionStubs].sort((a, b) => { var _a, _b; return ((_a = a.weekNumber) !== null && _a !== void 0 ? _a : 0) - ((_b = b.weekNumber) !== null && _b !== void 0 ? _b : 0); });
    const currentStub = sorted[sorted.length - 1];
    const historyStubs = sorted.slice(0, sorted.length - 1);
    const historyNote = historyStubs.length ? `, ${historyStubs.length} historical` : ', no historical data (week 1)';
    console.log(` ✓  ${sessionStubs.length} session(s), current: ${currentStub.sessionLabel}${historyNote}`);
    // 3. Fetch full session details
    process.stdout.write('Fetching session details...');
    const [currentSession, ...historySessions] = await Promise.all([currentStub, ...historyStubs].map((s) => gql(GET_SESSION, { id: s.id }).then((d) => d.getSession)));
    console.log(' ✓');
    const ppq = (_f = (_e = currentSession === null || currentSession === void 0 ? void 0 : currentSession.assessments) === null || _e === void 0 ? void 0 : _e.items) === null || _f === void 0 ? void 0 : _f.find((a) => a.type === 'PPQ');
    const ccss = (_h = (_g = ppq === null || ppq === void 0 ? void 0 : ppq.ccssStandards) === null || _g === void 0 ? void 0 : _g[0]) !== null && _h !== void 0 ? _h : (_j = currentSession === null || currentSession === void 0 ? void 0 : currentSession.ccssStandards) === null || _j === void 0 ? void 0 : _j[0];
    if (!ccss)
        throw new Error('No CCSS standard found in current session');
    // 4. Learning science data (direct Lambda — bypasses AppSync 30s timeout)
    process.stdout.write(`Fetching learning science data for ${ccss}...`);
    const lsResult = await invokeLambda(`microcoachGetLearningScience-${AMPLIFY_ENV}`, { input: { ccss } });
    const learningScienceData = parseJson(lsResult);
    console.log(' ✓');
    // 4b. Fetch student responses — used for confidence stats and PPQ enrichment
    let augmentedPpq = ppq;
    let studentResponses = [];
    if (ppq === null || ppq === void 0 ? void 0 : ppq.id) {
        process.stdout.write('Fetching student responses...');
        try {
            const srData = await gql(STUDENT_RESPONSES_BY_ASSESSMENT, { assessmentId: ppq.id });
            studentResponses = (_l = (_k = srData === null || srData === void 0 ? void 0 : srData.studentResponsesByAssessmentId) === null || _k === void 0 ? void 0 : _k.items) !== null && _l !== void 0 ? _l : [];
            const hasConfidence = studentResponses.some((sr) => { var _a; return ((_a = sr.questionResponses) !== null && _a !== void 0 ? _a : []).some((qr) => qr.confidence != null); });
            if (hasConfidence) {
                const confidenceStats = computeConfidenceStats(studentResponses, (_m = ppq.questions) !== null && _m !== void 0 ? _m : []);
                augmentedPpq = { ...ppq, confidenceStats };
                console.log(` ✓  (${studentResponses.length} responses, with confidence data)`);
            }
            else {
                console.log(` ✓  (${studentResponses.length} responses, no confidence data)`);
            }
        }
        catch (err) {
            console.log(` ✗ (${err}) — continuing without student responses`);
        }
    }
    // Build student name map from classroom students (fetched in step 1)
    const studentNameMap = new Map();
    for (const s of ((_p = (_o = gr6.students) === null || _o === void 0 ? void 0 : _o.items) !== null && _p !== void 0 ? _p : [])) {
        if (s.id && s.name)
            studentNameMap.set(s.id, s.name);
    }
    const wrongAnswerDist = computeWrongAnswerDist(studentResponses);
    // 5. Analysis (direct Lambda — bypasses AppSync 30s timeout)
    //    wrongAnswerDist is forwarded so the Lambda can expand distractor explanations internally.
    process.stdout.write('Running misconception analysis...');
    const analysisResult = await invokeLambda(`microcoachLLMAnalysis-${AMPLIFY_ENV}`, {
        input: {
            classroomData: JSON.stringify({
                classroom: gr6,
                currentSession,
                sessionHistory: historySessions,
                ppq: augmentedPpq,
                wrongAnswerDist,
            }),
            learningScienceData: JSON.stringify(learningScienceData),
        },
    });
    const analysis = parseJson(analysisResult);
    const misconceptions = (_q = analysis === null || analysis === void 0 ? void 0 : analysis.misconceptions) !== null && _q !== void 0 ? _q : [];
    console.log(` ✓  ${misconceptions.length} misconceptions identified`);
    // 5b. Build per-misconception extras: ppqQuestions and affectedStudents computed locally;
    //     wrongAnswerExplanations come back from the analysis Lambda (no direct OpenAI calls here).
    const ppqQs = ((_r = ppq === null || ppq === void 0 ? void 0 : ppq.questions) !== null && _r !== void 0 ? _r : []).map((q) => {
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
            wrongAnswerExplanations: (_c = m.wrongAnswerExplanations) !== null && _c !== void 0 ? _c : [],
            correctAnswerSolution: (_d = m.correctAnswerSolution) !== null && _d !== void 0 ? _d : [],
        };
    });
    console.log(`Enriched ${misconceptionExtras.length} misconceptions with PPQ data`);
    // 6. Next step examples
    process.stdout.write('Fetching next step examples...');
    const nextStepData = await gql(LIST_CONTEXT_DATA, {
        filter: { type: { eq: 'NEXT_STEP_LESSON' } },
        limit: 20,
    });
    const nextStepExamples = (_t = (_s = nextStepData.listContextData) === null || _s === void 0 ? void 0 : _s.items) !== null && _t !== void 0 ? _t : [];
    console.log(` ✓  ${nextStepExamples.length} examples`);
    // 7. Generate next step options — one dedicated Lambda call per format per misconception.
    //    Each call generates ONE activity grounded in the knowledge graph and misconception data.
    //    Calls per misconception run in parallel; all misconceptions run in parallel.
    const classroomContext = { grade: gr6.grade, subject: gr6.subject, cohortSize: gr6.cohortSize };
    const NEXT_STEP_FORMATS = ['small_group', 'whole_class'];
    const activitiesPerGroup = await Promise.all(misconceptions.map(async (m, i) => {
        process.stdout.write(`Generating next steps [${i + 1}/${misconceptions.length}]: ${m.title}...`);
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
        const results = await Promise.all(NEXT_STEP_FORMATS.map(async (fmt) => {
            try {
                const raw = await invokeLambda(`microcoachNextStepOption-${AMPLIFY_ENV}`, {
                    input: { ...baseInput, preferredFormat: fmt },
                });
                return parseJson(raw);
            }
            catch (err) {
                console.error(`\n  ✗ format=${fmt} for ${m.title}: ${err}`);
                return null;
            }
        }));
        const resultList = results.filter(Boolean);
        console.log(` ✓  ${resultList.length} activities`);
        return resultList;
    }));
    // 8. Build next steps
    const nextSteps = buildNextSteps(misconceptions, activitiesPerGroup, ppq === null || ppq === void 0 ? void 0 : ppq.questions, learningScienceData, misconceptionExtras);
    console.log(`\nBuilt ${nextSteps.length} next steps`);
    // 9. Persist next steps to the session and mark the classroom's active week
    process.stdout.write(`Saving next steps to session ${currentStub.id} (week ${currentStub.weekNumber})...`);
    await gql(UPDATE_SESSION, {
        input: {
            id: currentStub.id,
            pregeneratedNextSteps: JSON.stringify(nextSteps),
            status: 'generated',
        },
    });
    console.log(' ✓');
    process.stdout.write(`Setting classroom currentWeek to ${currentStub.weekNumber}...`);
    await gql(UPDATE_CLASSROOM_WEEK, {
        input: {
            id: gr6.id,
            currentWeek: currentStub.weekNumber,
        },
    });
    console.log(' ✓');
}
main().catch((err) => {
    console.error('\nFailed:', err);
    process.exit(1);
});
