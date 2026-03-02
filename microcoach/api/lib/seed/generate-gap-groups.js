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
const GET_LEARNING_SCIENCE = /* GraphQL */ `
  mutation GetLearningScience($input: GetLearningScienceInput!) {
    getLearningScience(input: $input)
  }
`;
const GET_ANALYSIS = /* GraphQL */ `
  mutation GetAnalysis($input: GetAnalysisInput!) {
    getAnalysis(input: $input)
  }
`;
const GENERATE_RTD = /* GraphQL */ `
  mutation GenerateRTD($input: GenerateRTDInput!) {
    generateRTD(input: $input)
  }
`;
const UPDATE_SESSION = /* GraphQL */ `
  mutation UpdateSession($input: UpdateSessionInput!) {
    updateSession(input: $input) {
      id
      status
      pregeneratedGapGroups
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
function buildGapGroups(misconceptions, activities, ppqQuestions, learningScienceData) {
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const activity = activities[i];
        const frameworkItem = frameworkItems.find((item) => normalize(item.code) === normalize(m.ccssStandard));
        const prerequisiteGaps = ((_a = m.prerequisiteGapCodes) === null || _a === void 0 ? void 0 : _a.length)
            ? m.prerequisiteGapCodes.map((code) => { var _a; return ({ standard: code, description: (_a = standardsDescMap.get(code)) !== null && _a !== void 0 ? _a : '' }); })
            : ((_b = frameworkItem === null || frameworkItem === void 0 ? void 0 : frameworkItem.prerequisiteStandards) !== null && _b !== void 0 ? _b : []).map((r) => ({ standard: r.code, description: r.description }));
        const impactedObjectives = ((_c = m.impactedObjectiveCodes) === null || _c === void 0 ? void 0 : _c.length)
            ? m.impactedObjectiveCodes.map((code) => { var _a; return ({ standard: code, description: (_a = standardsDescMap.get(code)) !== null && _a !== void 0 ? _a : '' }); })
            : ((_d = frameworkItem === null || frameworkItem === void 0 ? void 0 : frameworkItem.futureDependentStandards) !== null && _d !== void 0 ? _d : []).map((r) => ({ standard: r.code, description: r.description }));
        return {
            id: `gapgroup-ai-${i + 1}`,
            title: m.title,
            priority: priorityLabel(m.priority),
            studentCount: (_e = m.studentCount) !== null && _e !== void 0 ? _e : 0,
            studentPercent: Math.round(((_f = m.studentPercent) !== null && _f !== void 0 ? _f : 0) * 100),
            occurrence: occurrenceLabel(m.occurrence),
            misconceptionSummary: m.description,
            successIndicators: (_g = m.successIndicators) !== null && _g !== void 0 ? _g : [],
            ccssStandards: {
                targetObjective: { standard: m.ccssStandard, description: m.description },
                impactedObjectives,
                prerequisiteGaps,
            },
            evidence: (_h = m.evidence) !== null && _h !== void 0 ? _h : null,
            questionErrorRates,
            move: activity
                ? {
                    id: `move-ai-${i + 1}`,
                    title: activity.title,
                    time: `${activity.durationMinutes} min`,
                    format: formatLabel(activity.format),
                    summary: activity.summary,
                    aiReasoning: activity.aiReasoning,
                    tabs: (_j = activity.tabs) !== null && _j !== void 0 ? _j : null,
                }
                : null,
        };
    });
}
function parseJson(raw) {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
}
// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    console.log('=== Microcoach Gap Group Generator ===\n');
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
    console.log(` ✓  ${sessionStubs.length} sessions, current: ${currentStub.sessionLabel}`);
    // 3. Fetch full session details
    process.stdout.write('Fetching session details...');
    const [currentSession, ...historySessions] = await Promise.all([currentStub, ...historyStubs].map((s) => gql(GET_SESSION, { id: s.id }).then((d) => d.getSession)));
    console.log(' ✓');
    const ppq = (_f = (_e = currentSession === null || currentSession === void 0 ? void 0 : currentSession.assessments) === null || _e === void 0 ? void 0 : _e.items) === null || _f === void 0 ? void 0 : _f.find((a) => a.type === 'PPQ');
    const ccss = (_h = (_g = ppq === null || ppq === void 0 ? void 0 : ppq.ccssStandards) === null || _g === void 0 ? void 0 : _g[0]) !== null && _h !== void 0 ? _h : (_j = currentSession === null || currentSession === void 0 ? void 0 : currentSession.ccssStandards) === null || _j === void 0 ? void 0 : _j[0];
    if (!ccss)
        throw new Error('No CCSS standard found in current session');
    // 4. Learning science data (LLM)
    process.stdout.write(`Fetching learning science data for ${ccss}...`);
    const lsRaw = await gql(GET_LEARNING_SCIENCE, { input: { ccss } });
    const learningScienceData = parseJson(lsRaw.getLearningScience);
    console.log(' ✓');
    // 5. Analysis (LLM)
    process.stdout.write('Running misconception analysis...');
    const analysisRaw = await gql(GET_ANALYSIS, {
        input: {
            classroomData: JSON.stringify({ classroom: gr6, currentSession, sessionHistory: historySessions, ppq }),
            learningScienceData: JSON.stringify(learningScienceData),
        },
    });
    const analysis = parseJson(analysisRaw.getAnalysis);
    const misconceptions = (_k = analysis === null || analysis === void 0 ? void 0 : analysis.misconceptions) !== null && _k !== void 0 ? _k : [];
    console.log(` ✓  ${misconceptions.length} misconceptions identified`);
    // 6. RTD examples
    process.stdout.write('Fetching RTD examples...');
    const rtdData = await gql(LIST_CONTEXT_DATA, {
        filter: { type: { eq: 'RTD_LESSON' } },
        limit: 20,
    });
    const rtdExamples = (_m = (_l = rtdData.listContextData) === null || _l === void 0 ? void 0 : _l.items) !== null && _m !== void 0 ? _m : [];
    console.log(` ✓  ${rtdExamples.length} examples`);
    // 7. Generate RTDs (LLM, one per misconception)
    const classroomContext = { grade: gr6.grade, subject: gr6.subject, cohortSize: gr6.cohortSize };
    const activities = await Promise.all(misconceptions.map(async (m, i) => {
        process.stdout.write(`Generating RTD [${i + 1}/${misconceptions.length}]: ${m.title}...`);
        const relevant = rtdExamples.filter((ex) => {
            var _a;
            return !((_a = ex.ccssStandards) === null || _a === void 0 ? void 0 : _a.length) ||
                ex.ccssStandards.some((s) => { var _a; return s === m.ccssStandard || s.startsWith((_a = m.ccssStandard) === null || _a === void 0 ? void 0 : _a.split('.')[0]); });
        });
        try {
            const raw = await gql(GENERATE_RTD, {
                input: {
                    misconception: JSON.stringify(m),
                    learningScienceData: JSON.stringify(learningScienceData),
                    classroomContext: JSON.stringify(classroomContext),
                    ...(relevant.length > 0 && { contextData: JSON.stringify(relevant) }),
                },
            });
            const result = parseJson(raw.generateRTD);
            console.log(' ✓');
            return result;
        }
        catch (err) {
            console.log(` ✗ (${err})`);
            return null;
        }
    }));
    // 8. Build gap groups
    const gapGroups = buildGapGroups(misconceptions, activities, ppq === null || ppq === void 0 ? void 0 : ppq.questions, learningScienceData);
    console.log(`\nBuilt ${gapGroups.length} gap groups`);
    // 9. Persist gap groups to the session and mark the classroom's active week
    process.stdout.write(`Saving gap groups to session ${currentStub.id} (week ${currentStub.weekNumber})...`);
    await gql(UPDATE_SESSION, {
        input: {
            id: currentStub.id,
            pregeneratedGapGroups: JSON.stringify(gapGroups),
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
