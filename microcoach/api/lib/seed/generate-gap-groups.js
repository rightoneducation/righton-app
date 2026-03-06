"use strict";
/**
 * generate-gap-groups.ts — run the LLM pipeline offline and save pregenerated data
 *
 * Run from the api/ directory:
 *   npx ts-node src/seed/generate-gap-groups.ts
 *
 * Output: saves pregeneratedGapGroups to the Session record and sets currentWeek on Classroom
 *
 * This script replicates the data-fetch + LLM pipeline that previously ran on
 * every page load in App.js. Run it each week after ingesting new PPQ data;
 * the frontend reads currentWeek from Classroom, finds the matching Session,
 * and renders its pregeneratedGapGroups — no LLM calls at page-load time.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const appsync_config_1 = require("./appsync-config");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

// Invoke a Lambda directly (bypasses AppSync's 30-second resolver timeout).
// functionName: full Lambda name, e.g. "microcoachLLMAnalysis-dev"
// payload: object to pass as the event body
async function invokeLambda(functionName, payload) {
    const client = new LambdaClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
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
    const raw = Buffer.from(resp.Payload).toString('utf8');
    return JSON.parse(raw);
}

// Env suffix for Lambda names (e.g. "dev"). Override with AMPLIFY_ENV env var.
const AMPLIFY_ENV = process.env.AMPLIFY_ENV ?? 'dev';
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
const STUDENT_RESPONSES_BY_ASSESSMENT = /* GraphQL */ `
  query StudentResponsesByAssessmentId($assessmentId: ID!) {
    studentResponsesByAssessmentId(assessmentId: $assessmentId, limit: 1000) {
      items {
        questionResponses {
          questionNumber
          isCorrect
          confidence
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
        for (const qr of (sr.questionResponses ?? [])) {
            const s = qStats[qr.questionNumber];
            if (!s || qr.confidence == null) continue;
            const conf = qr.confidence;
            s.totalConf += conf;
            s.countConf++;
            if (qr.isCorrect) {
                s.totalConfCorrect += conf;
                s.countConfCorrect++;
            } else {
                s.totalConfIncorrect += conf;
                s.countConfIncorrect++;
                if (conf >= 4) s.highConfWrong++;
            }
            if (conf >= 4) s.totalHighConf++;
        }
    }
    return Object.values(qStats).map((s) => ({
        questionNumber: s.questionNumber,
        avgConfidence:         s.countConf > 0         ? parseFloat((s.totalConf / s.countConf).toFixed(2))                 : null,
        avgConfidenceCorrect:  s.countConfCorrect > 0  ? parseFloat((s.totalConfCorrect / s.countConfCorrect).toFixed(2))   : null,
        avgConfidenceIncorrect:s.countConfIncorrect > 0? parseFloat((s.totalConfIncorrect / s.countConfIncorrect).toFixed(2)): null,
        highConfWrongPct:      s.totalHighConf > 0     ? parseFloat((s.highConfWrong / s.totalHighConf).toFixed(3))         : null,
    }));
}

// ── Gap group builder (mirrors App.js buildGapGroups) ────────────────────────
function priorityLabel(p) {
    var _a;
    return (_a = { '1': 'Critical', '2': 'High', '3': 'Medium', '4': 'Low' }[p]) !== null && _a !== void 0 ? _a : 'Medium';
}
function occurrenceLabel(o) {
    return o === 'recurring' ? 'Recurring' : '1st occurrence';
}
function formatLabel(f) {
    var _a;
    return ((_a = { small_group: 'Small groups', whole_class: 'Whole class', individual: 'Individual' }[f]) !== null && _a !== void 0 ? _a : f);
}
// activitiesPerMisconception: array of arrays — activitiesPerMisconception[i] is the list of
// generated activity options for misconceptions[i] (one per format).
function sanitizeDescription(text) {
    if (!text) return text;
    return text
        // \frac{a}{b} → a/b
        .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
        // \sqrt{x} → √x
        .replace(/\\sqrt\{([^}]*)\}/g, '√$1')
        // common symbols
        .replace(/\\times/g, '×')
        .replace(/\\div/g, '÷')
        .replace(/\\pm/g, '±')
        .replace(/\\leq/g, '≤')
        .replace(/\\geq/g, '≥')
        .replace(/\\neq/g, '≠')
        .replace(/\\cdot/g, '·')
        .replace(/\\Box/g, '□')
        // strip $ math delimiters
        .replace(/\$/g, '')
        // strip *italic* markdown asterisks
        .replace(/\*([^*]*)\*/g, '$1')
        // clean up any remaining lone backslash commands
        .replace(/\\[a-zA-Z]+/g, '')
        .trim();
}

function buildGapGroups(misconceptions, activitiesPerMisconception, ppqQuestions, learningScienceData) {
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
            standardsDescMap.set(item.code, sanitizeDescription(item.description));
        for (const rel of [...((_b = item.prerequisiteStandards) !== null && _b !== void 0 ? _b : []), ...((_c = item.futureDependentStandards) !== null && _c !== void 0 ? _c : [])]) {
            if (rel.code && !standardsDescMap.has(rel.code))
                standardsDescMap.set(rel.code, sanitizeDescription(rel.description));
        }
    }
    return misconceptions.map((m, i) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const activityList = activitiesPerMisconception[i] ?? [];
        const frameworkItem = frameworkItems.find((item) => normalize(item.code) === normalize(m.ccssStandard));
        const prerequisiteGaps = ((_a = m.prerequisiteGapCodes) === null || _a === void 0 ? void 0 : _a.length)
            ? m.prerequisiteGapCodes.map((code) => { var _a; return ({ standard: code, description: (_a = standardsDescMap.get(code)) !== null && _a !== void 0 ? _a : '' }); })
            : ((_b = frameworkItem === null || frameworkItem === void 0 ? void 0 : frameworkItem.prerequisiteStandards) !== null && _b !== void 0 ? _b : []).map((r) => ({ standard: r.code, description: r.description }));
        const impactedObjectives = ((_c = m.impactedObjectiveCodes) === null || _c === void 0 ? void 0 : _c.length)
            ? m.impactedObjectiveCodes.map((code) => { var _a; return ({ standard: code, description: (_a = standardsDescMap.get(code)) !== null && _a !== void 0 ? _a : '' }); })
            : ((_d = frameworkItem === null || frameworkItem === void 0 ? void 0 : frameworkItem.futureDependentStandards) !== null && _d !== void 0 ? _d : []).map((r) => ({ standard: r.code, description: r.description }));
        const moveOptions = activityList.map((activity, ai) => {
            var _a;
            return ({
                id: `move-ai-${i + 1}-${ai + 1}`,
                title: activity.title,
                time: `${activity.durationMinutes} min`,
                format: formatLabel(activity.format),
                summary: activity.summary,
                targets: activity.targets ?? null,
                instructionalMove: activity.instructionalMove ?? null,
                strategyTag: activity.strategyTag ?? null,
                aiReasoning: activity.aiReasoning,
                tabs: (_a = activity.tabs) !== null && _a !== void 0 ? _a : null,
            });
        });
        return {
            id: `gapgroup-ai-${i + 1}`,
            title: m.title,
            isCore: m.isCore ?? false,
            frequency: m.frequency ?? null,
            example: m.example ?? null,
            priority: priorityLabel(m.priority),
            studentCount: (_e = m.studentCount) !== null && _e !== void 0 ? _e : 0,
            studentPercent: Math.round(((_f = m.studentPercent) !== null && _f !== void 0 ? _f : 0) * 100),
            occurrence: occurrenceLabel(m.occurrence),
            misconceptionSummary: m.description,
            successIndicators: (_g = m.successIndicators) !== null && _g !== void 0 ? _g : [],
            ccssStandards: {
                targetObjective: { standard: m.ccssStandard, description: standardsDescMap.get(m.ccssStandard) ?? frameworkItem?.description ?? '' },
                impactedObjectives,
                prerequisiteGaps,
            },
            evidence: (_h = m.evidence) !== null && _h !== void 0 ? _h : null,
            subMisconceptions: activityList[0]?.subMisconceptions ?? [],
            questionErrorRates,
            moveOptions,
        };
    });
}
function parseJson(raw) {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
}
// Formats to generate per misconception (from prompt-config.json nextStepOption.formatsToGenerate)
const FORMATS_TO_GENERATE = ['small_group', 'whole_class'];

// ── Per-classroom pipeline ────────────────────────────────────────────────────
async function processClassroom(gql, classroom) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    console.log(`\n── ${classroom.classroomName} (grade ${classroom.grade}) ──`);
    // 1. List sessions
    process.stdout.write('  Fetching sessions...');
    const sessionsData = await gql(SESSIONS_BY_CLASSROOM, { classroomId: classroom.id });
    const sessionStubs = (_b = (_a = sessionsData.sessionsByClassroomId) === null || _a === void 0 ? void 0 : _a.items) !== null && _b !== void 0 ? _b : [];
    if (!sessionStubs.length) {
        console.log(' ✗ (no sessions)');
        return;
    }
    const sorted = [...sessionStubs].sort((a, b) => { var _a, _b; return ((_a = a.weekNumber) !== null && _a !== void 0 ? _a : 0) - ((_b = b.weekNumber) !== null && _b !== void 0 ? _b : 0); });
    const currentStub = sorted[sorted.length - 1];
    const historyStubs = sorted.slice(0, sorted.length - 1);
    console.log(` ✓  ${sessionStubs.length} sessions, current: ${currentStub.sessionLabel}`);
    // 2. Fetch full session details
    process.stdout.write('  Fetching session details...');
    const [currentSession, ...historySessions] = await Promise.all([currentStub, ...historyStubs].map((s) => gql(GET_SESSION, { id: s.id }).then((d) => d.getSession)));
    console.log(' ✓');
    const ppq = (_d = (_c = currentSession === null || currentSession === void 0 ? void 0 : currentSession.assessments) === null || _c === void 0 ? void 0 : _c.items) === null || _d === void 0 ? void 0 : _d.find((a) => a.type === 'PPQ');
    const ccss = (_f = (_e = ppq === null || ppq === void 0 ? void 0 : ppq.ccssStandards) === null || _e === void 0 ? void 0 : _e[0]) !== null && _f !== void 0 ? _f : (_g = currentSession === null || currentSession === void 0 ? void 0 : currentSession.ccssStandards) === null || _g === void 0 ? void 0 : _g[0];
    if (!ccss) {
        console.log('  ✗ No CCSS standard found — skipping');
        return;
    }
    // 3. Learning science data
    process.stdout.write(`  Fetching learning science data for ${ccss}...`);
    const lsResult = await invokeLambda(`microcoachGetLearningScience-${AMPLIFY_ENV}`, { input: { ccss } });
    const learningScienceData = parseJson(lsResult);
    console.log(' ✓');
    // 3b. Confidence stats — fetch student responses for PPQ and compute per-question aggregates
    let augmentedPpq = ppq;
    if (ppq?.id) {
        process.stdout.write('  Computing confidence stats...');
        try {
            const srData = await gql(STUDENT_RESPONSES_BY_ASSESSMENT, { assessmentId: ppq.id });
            const studentResponses = srData?.studentResponsesByAssessmentId?.items ?? [];
            const hasConfidence = studentResponses.some((sr) =>
                (sr.questionResponses ?? []).some((qr) => qr.confidence != null));
            if (hasConfidence) {
                const confidenceStats = computeConfidenceStats(studentResponses, ppq.questions ?? []);
                augmentedPpq = { ...ppq, confidenceStats };
                console.log(` ✓  (${studentResponses.length} responses)`);
            } else {
                console.log(' (no confidence data — skipping)');
            }
        } catch (err) {
            console.log(` ✗ (${err}) — continuing without confidence stats`);
        }
    }
    // 4. Analysis
    process.stdout.write('  Running misconception analysis...');
    const analysisResult = await invokeLambda(`microcoachLLMAnalysis-${AMPLIFY_ENV}`, {
        input: {
            classroomData: JSON.stringify({ classroom, currentSession, sessionHistory: historySessions, ppq: augmentedPpq }),
            learningScienceData: JSON.stringify(learningScienceData),
        },
    });
    const analysis = parseJson(analysisResult);
    const misconceptions = (_h = analysis === null || analysis === void 0 ? void 0 : analysis.misconceptions) !== null && _h !== void 0 ? _h : [];
    console.log(` ✓  ${misconceptions.length} misconceptions identified`);
    // 5. RTD examples (fetched once, shared across all misconceptions)
    process.stdout.write('  Fetching next step examples...');
    const rtdData = await gql(LIST_CONTEXT_DATA, {
        filter: { type: { eq: 'NEXT_STEP_LESSON' } },
        limit: 20,
    });
    const rtdExamples = rtdData.listContextData?.items ?? [];
    console.log(` ✓  ${rtdExamples.length} examples`);
    // 6. Generate one activity per format per misconception
    const classroomContext = { grade: classroom.grade, subject: classroom.subject, cohortSize: classroom.cohortSize };
    const activitiesPerMisconception = await Promise.all(misconceptions.map(async (m, i) => {
        const relevant = rtdExamples.filter((ex) => {
            var _a;
            return !((_a = ex.ccssStandards) === null || _a === void 0 ? void 0 : _a.length) ||
                ex.ccssStandards.some((s) => { var _a; return s === m.ccssStandard || s.startsWith((_a = m.ccssStandard) === null || _a === void 0 ? void 0 : _a.split('.')[0]); });
        });
        const formatResults = await Promise.all(FORMATS_TO_GENERATE.map(async (fmt) => {
            process.stdout.write(`  Generating [${i + 1}/${misconceptions.length}] ${fmt}: ${m.title}...`);
            try {
                const raw = await invokeLambda(`microcoachNextStepOption-${AMPLIFY_ENV}`, {
                    input: {
                        misconception: JSON.stringify(m),
                        learningScienceData: JSON.stringify(learningScienceData),
                        classroomContext: JSON.stringify(classroomContext),
                        preferredFormat: fmt,
                        ...(relevant.length > 0 && { contextData: JSON.stringify(relevant) }),
                    },
                });
                const result = parseJson(raw);
                console.log(' ✓');
                return result;
            }
            catch (err) {
                console.log(` ✗ (${err})`);
                return null;
            }
        }));
        return formatResults.filter(Boolean);
    }));
    // 7. Build gap groups
    const gapGroups = buildGapGroups(misconceptions, activitiesPerMisconception, ppq === null || ppq === void 0 ? void 0 : ppq.questions, learningScienceData);
    console.log(`\n  Built ${gapGroups.length} gap groups`);
    gapGroups.forEach((g, i) => {
        console.log(`    [${i + 1}] ${g.title}: moveOptions=${g.moveOptions.length}`);
    });
    // 8. Persist
    process.stdout.write(`  Saving to session ${currentStub.id} (week ${currentStub.weekNumber})...`);
    await gql(UPDATE_SESSION, {
        input: {
            id: currentStub.id,
            pregeneratedNextSteps: JSON.stringify(gapGroups),
            status: 'generated',
        },
    });
    console.log(' ✓');
    process.stdout.write(`  Setting currentWeek to ${currentStub.weekNumber}...`);
    await gql(UPDATE_CLASSROOM_WEEK, {
        input: {
            id: classroom.id,
            currentWeek: currentStub.weekNumber,
        },
    });
    console.log(' ✓');
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    var _a, _b;
    console.log('=== Microcoach Gap Group Generator ===\n');
    const gql = await (0, appsync_config_1.createGqlClient)();
    process.stdout.write('Fetching classrooms...');
    const classroomsData = await gql(LIST_CLASSROOMS);
    const classrooms = (_b = (_a = classroomsData.listClassrooms) === null || _a === void 0 ? void 0 : _a.items) !== null && _b !== void 0 ? _b : [];
    if (!classrooms.length)
        throw new Error('No classrooms found');
    console.log(` ✓  ${classrooms.length} classrooms`);
    // Process each classroom sequentially to avoid overwhelming the LLM APIs
    for (const classroom of classrooms) {
        await processClassroom(gql, classroom);
    }
    console.log('\n=== Done ===');
}
main().catch((err) => {
    console.error('\nFailed:', err);
    process.exit(1);
});
