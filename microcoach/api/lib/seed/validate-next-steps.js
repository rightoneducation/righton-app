"use strict";
/**
 * validate-next-steps.ts — content quality test suite for pregeneratedNextSteps
 *
 * Run from the api/ directory:
 *   APPSYNC_SECRET_NAME=microcoach yarn ts-node src/seed/validate-next-steps.ts [--week-min 15] [--week-max 20]
 *
 * Checks each stored activity against:
 *   1. Structural rules (deterministic)
 *   2. Student sorting accuracy (deterministic, requires DB)
 *   3. Design principle compliance (LLM-as-judge via microcoachLLMVerify Lambda)
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
Object.defineProperty(exports, "__esModule", { value: true });
const appsync_config_1 = require("./appsync-config");
const client_lambda_1 = require("@aws-sdk/client-lambda");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const AMPLIFY_ENV = (_a = process.env.AMPLIFY_ENV) !== null && _a !== void 0 ? _a : 'dev';
async function invokeLLMVerify(misconception, activity) {
    var _a;
    const client = new client_lambda_1.LambdaClient({ region: (_a = process.env.AWS_REGION) !== null && _a !== void 0 ? _a : 'us-east-1' });
    const cmd = new client_lambda_1.InvokeCommand({
        FunctionName: `microcoachLLMVerify-${AMPLIFY_ENV}`,
        InvocationType: 'RequestResponse',
        Payload: Buffer.from(JSON.stringify({
            input: {
                misconception: JSON.stringify(misconception),
                activity: JSON.stringify(activity),
            },
        })),
    });
    const resp = await client.send(cmd);
    if (resp.FunctionError) {
        const errBody = Buffer.from(resp.Payload).toString('utf8');
        throw new Error(`microcoachLLMVerify error: ${errBody}`);
    }
    return JSON.parse(Buffer.from(resp.Payload).toString('utf8'));
}
// ── Config ────────────────────────────────────────────────────────────────────
const configPath = path.resolve(__dirname, '../../amplify/backend/function/microcoachNextStepOption/src/util/config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const nso = (_b = config === null || config === void 0 ? void 0 : config.nextStepOption) !== null && _b !== void 0 ? _b : {};
const OVERVIEW_BULLETS_MIN = (_d = (_c = nso.overviewBullets) === null || _c === void 0 ? void 0 : _c.min) !== null && _d !== void 0 ? _d : 2;
const OVERVIEW_BULLETS_MAX = (_f = (_e = nso.overviewBullets) === null || _e === void 0 ? void 0 : _e.max) !== null && _f !== void 0 ? _f : 4;
const INCORRECT_EXAMPLES_COUNT = (_g = nso.incorrectWorkedExamplesCount) !== null && _g !== void 0 ? _g : 3;
const ACTIVITY_STEPS_MIN = (_j = (_h = nso.activitySteps) === null || _h === void 0 ? void 0 : _h.min) !== null && _j !== void 0 ? _j : 4;
const ACTIVITY_STEPS_MAX = (_l = (_k = nso.activitySteps) === null || _k === void 0 ? void 0 : _k.max) !== null && _l !== void 0 ? _l : 6;
const SETUP_STEPS_MIN = (_o = (_m = nso.setupSteps) === null || _m === void 0 ? void 0 : _m.min) !== null && _o !== void 0 ? _o : 2;
const SETUP_STEPS_MAX = (_q = (_p = nso.setupSteps) === null || _p === void 0 ? void 0 : _p.max) !== null && _q !== void 0 ? _q : 3;
const DISCUSSION_Q_MIN = (_s = (_r = nso.discussionQuestions) === null || _r === void 0 ? void 0 : _r.min) !== null && _s !== void 0 ? _s : 2;
const DISCUSSION_Q_MAX = (_u = (_t = nso.discussionQuestions) === null || _t === void 0 ? void 0 : _t.max) !== null && _u !== void 0 ? _u : 3;
const GROUPS_MIN = (_w = (_v = nso.studentGroups) === null || _v === void 0 ? void 0 : _v.min) !== null && _w !== void 0 ? _w : 2;
const GROUPS_MAX = (_y = (_x = nso.studentGroups) === null || _x === void 0 ? void 0 : _x.max) !== null && _y !== void 0 ? _y : 3;
const ALLOWED_DURATION_BUCKETS = (_z = nso.allowedDurationBuckets) !== null && _z !== void 0 ? _z : [];
const DESIGN_PRINCIPLES = (_0 = nso.designPrinciples) !== null && _0 !== void 0 ? _0 : [];
const VALID_FORMATS = ['Small groups', 'Whole class', 'Individual'];
// ── CLI args ──────────────────────────────────────────────────────────────────
function parseArgs() {
    const argv = process.argv.slice(2);
    let weekMin;
    let weekMax;
    let verbose = false;
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === '--week-min' && argv[i + 1])
            weekMin = parseInt(argv[++i], 10);
        if (argv[i] === '--week-max' && argv[i + 1])
            weekMax = parseInt(argv[++i], 10);
        if (argv[i] === '--verbose' || argv[i] === '-v')
            verbose = true;
    }
    return { weekMin, weekMax, verbose };
}
// ── GraphQL queries ───────────────────────────────────────────────────────────
const LIST_CLASSROOMS = /* GraphQL */ `
  query ListClassrooms {
    listClassrooms {
      items {
        id
        classroomName
        grade
        currentWeek
        students {
          items {
            id
            name
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
        status
        pregeneratedNextSteps
        assessments {
          items {
            id
            type
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
        }
      }
    }
  }
`;
// ── Helpers (replicated from generate-next-steps.ts) ─────────────────────────
function parseQuestionNumbers(source) {
    const matches = (source !== null && source !== void 0 ? source : '').matchAll(/Q(\d+)/gi);
    const nums = new Set();
    for (const m of matches)
        nums.add(parseInt(m[1], 10));
    return [...nums].sort((a, b) => a - b);
}
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
        result.push({ name, score: Math.round((correct / relevant.length) * 100) / 100 });
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
}
/** Replicate the sort+split logic from injectStudentsIntoGroups — returns expected group assignments */
function computeExpectedGroups(numGroups, studentData) {
    const sorted = [...studentData].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));
    const base = Math.floor(sorted.length / numGroups);
    const remainder = sorted.length % numGroups;
    let offset = 0;
    return Array.from({ length: numGroups }, (_, i) => {
        const size = base + (i < remainder ? 1 : 0);
        const slice = sorted.slice(offset, offset + size).map(s => s.name);
        offset += size;
        return slice;
    });
}
function parseDurationMinutes(time) {
    const m = (time !== null && time !== void 0 ? time : '').match(/(\d+)/);
    return m ? parseInt(m[1], 10) : null;
}
function isInDurationBucket(minutes) {
    return ALLOWED_DURATION_BUCKETS.some(b => minutes >= b.min && minutes <= b.max);
}
// ── Misconception-level structural checks ─────────────────────────────────────
const HEDGING_WORDS = ['often', 'typically', 'usually', 'tend to'];
function runMisconceptionStructuralChecks(misconception, sessionLabel) {
    var _a, _b, _c, _d;
    const results = [];
    const base = { classroom: sessionLabel, misconception: '', activity: '' };
    function check(checkName, pass, detail) {
        results.push({ ...base, check: checkName, pass, detail });
    }
    // misconceptionSummary non-empty
    const summary = misconception.misconceptionSummary;
    check('misconceptionSummary non-empty', typeof summary === 'string' && summary.trim().length > 0);
    // successIndicators present (≥1 item, each non-empty string)
    const si = (_a = misconception.successIndicators) !== null && _a !== void 0 ? _a : [];
    const siOk = Array.isArray(si) && si.length >= 1 && si.every((x) => typeof x === 'string' && x.trim().length > 0);
    check('successIndicators present (≥1 item)', siOk, !Array.isArray(si) ? 'not an array' : si.length === 0 ? 'empty array' : 'item(s) not non-empty strings');
    // wrongAnswerExplanations present (≥1 item, each {answer, explanation} non-empty)
    const wae = (_b = misconception.wrongAnswerExplanations) !== null && _b !== void 0 ? _b : [];
    const waeBad = !Array.isArray(wae) || wae.length === 0 || wae.some((x) => !(x === null || x === void 0 ? void 0 : x.answer) || !(x === null || x === void 0 ? void 0 : x.explanation));
    check('wrongAnswerExplanations present (≥1 item)', !waeBad, !Array.isArray(wae) ? 'not an array' : wae.length === 0 ? 'empty array' : 'item(s) missing answer or explanation');
    // correctAnswerSolution present (≥1 item, each non-empty string)
    const cas = (_c = misconception.correctAnswerSolution) !== null && _c !== void 0 ? _c : [];
    const casOk = Array.isArray(cas) && cas.length >= 1 && cas.every((x) => typeof x === 'string' && x.trim().length > 0);
    check('correctAnswerSolution present (≥1 item)', casOk, !Array.isArray(cas) ? 'not an array' : cas.length === 0 ? 'empty array' : 'item(s) not non-empty strings');
    // evidence.mostCommonError non-empty
    const mce = (_d = misconception.evidence) === null || _d === void 0 ? void 0 : _d.mostCommonError;
    check('evidence.mostCommonError non-empty', typeof mce === 'string' && mce.trim().length > 0);
    // No hedging words in misconceptionSummary
    if (typeof summary === 'string') {
        const lc = summary.toLowerCase();
        const found = HEDGING_WORDS.find(w => lc.includes(w));
        check('no hedging words in misconceptionSummary', !found, found ? `found hedging: "${found}" in misconceptionSummary` : undefined);
    }
    else {
        check('no hedging words in misconceptionSummary', true);
    }
    return results;
}
// ── Structural checks ─────────────────────────────────────────────────────────
function runStructuralChecks(activity, allGroupStudents, // students from studentData (expected assignees)
label) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const results = [];
    const base = { classroom: label, misconception: '', activity: (_a = activity.title) !== null && _a !== void 0 ? _a : '(untitled)' };
    function check(checkName, pass, detail) {
        results.push({ ...base, check: checkName, pass, detail });
    }
    const tabs = (_b = activity.tabs) !== null && _b !== void 0 ? _b : {};
    const overview = (_c = tabs.overview) !== null && _c !== void 0 ? _c : {};
    const actSteps = (_d = tabs.activitySteps) !== null && _d !== void 0 ? _d : {};
    const groupings = (_e = tabs.studentGroupings) !== null && _e !== void 0 ? _e : {};
    const groups = (_f = groupings.groups) !== null && _f !== void 0 ? _f : [];
    // Overview: whatStudentsDo
    const wsd = (_g = overview.whatStudentsDo) !== null && _g !== void 0 ? _g : [];
    const wsdIsArray = Array.isArray(wsd);
    const wsdLen = wsdIsArray ? wsd.length : 0;
    check('overview.whatStudentsDo is a bullet array (2-4 items)', wsdIsArray && wsdLen >= OVERVIEW_BULLETS_MIN && wsdLen <= OVERVIEW_BULLETS_MAX, !wsdIsArray ? 'not an array' : `got ${wsdLen} item(s)`);
    if (wsdIsArray) {
        const badLabels = wsd.filter((b) => !(b === null || b === void 0 ? void 0 : b.label) || !(b === null || b === void 0 ? void 0 : b.detail));
        check('overview.whatStudentsDo bullets have {label, detail}', badLabels.length === 0, badLabels.length ? `${badLabels.length} bullet(s) missing label or detail` : undefined);
        const longLabels = wsd.filter((b) => (b === null || b === void 0 ? void 0 : b.label) && b.label.trim().split(/\s+/).length > 5);
        check('overview.whatStudentsDo label ≤ 5 words', longLabels.length === 0, longLabels.length ? `"${longLabels[0].label}" is too long` : undefined);
    }
    // Overview: whatYouDo
    const wyd = (_h = overview.whatYouDo) !== null && _h !== void 0 ? _h : [];
    const wydIsArray = Array.isArray(wyd);
    const wydLen = wydIsArray ? wyd.length : 0;
    check('overview.whatYouDo is a bullet array (2-4 items)', wydIsArray && wydLen >= OVERVIEW_BULLETS_MIN && wydLen <= OVERVIEW_BULLETS_MAX, !wydIsArray ? 'not an array' : `got ${wydLen} item(s)`);
    if (wydIsArray) {
        const badLabels = wyd.filter((b) => !(b === null || b === void 0 ? void 0 : b.label) || !(b === null || b === void 0 ? void 0 : b.detail));
        check('overview.whatYouDo bullets have {label, detail}', badLabels.length === 0, badLabels.length ? `${badLabels.length} bullet(s) missing label or detail` : undefined);
        const longLabels = wyd.filter((b) => (b === null || b === void 0 ? void 0 : b.label) && b.label.trim().split(/\s+/).length > 5);
        check('overview.whatYouDo label ≤ 5 words', longLabels.length === 0, longLabels.length ? `"${longLabels[0].label}" is too long` : undefined);
    }
    // Incorrect worked examples
    const iwe = (_j = actSteps.incorrectWorkedExamples) !== null && _j !== void 0 ? _j : [];
    check(`${INCORRECT_EXAMPLES_COUNT} incorrect worked examples present`, iwe.length === INCORRECT_EXAMPLES_COUNT, `got ${iwe.length}`);
    const badIwe = iwe.filter((e) => !(e === null || e === void 0 ? void 0 : e.problem) || !(e === null || e === void 0 ? void 0 : e.incorrectWork));
    check('incorrect worked examples have {problem, incorrectWork}', badIwe.length === 0, badIwe.length ? `${badIwe.length} example(s) missing fields` : undefined);
    // Core activity steps
    const core = (_k = actSteps.coreActivity) !== null && _k !== void 0 ? _k : [];
    check(`core activity steps (${ACTIVITY_STEPS_MIN}-${ACTIVITY_STEPS_MAX})`, core.length >= ACTIVITY_STEPS_MIN && core.length <= ACTIVITY_STEPS_MAX, `got ${core.length}`);
    // Setup steps
    const setup = (_l = actSteps.setup) !== null && _l !== void 0 ? _l : [];
    check(`setup steps (${SETUP_STEPS_MIN}-${SETUP_STEPS_MAX})`, setup.length >= SETUP_STEPS_MIN && setup.length <= SETUP_STEPS_MAX, `got ${setup.length}`);
    // Discussion questions
    const dq = (_m = actSteps.discussionQuestions) !== null && _m !== void 0 ? _m : [];
    check(`discussion questions (${DISCUSSION_Q_MIN}-${DISCUSSION_Q_MAX})`, dq.length >= DISCUSSION_Q_MIN && dq.length <= DISCUSSION_Q_MAX, `got ${dq.length}`);
    // Student groups count
    check(`student groups count (${GROUPS_MIN}-${GROUPS_MAX})`, groups.length >= GROUPS_MIN && groups.length <= GROUPS_MAX, `got ${groups.length}`);
    // All students assigned (exactly once)
    if (allGroupStudents.size > 0) {
        const assignedStudents = groups.flatMap((g) => { var _a; return (_a = g.students) !== null && _a !== void 0 ? _a : []; });
        const assignedSet = new Set(assignedStudents);
        const missing = [...allGroupStudents].filter(s => !assignedSet.has(s));
        const extras = assignedStudents.filter(s => !allGroupStudents.has(s));
        check('all students assigned', missing.length === 0 && extras.length === 0, missing.length ? `missing: ${missing.join(', ')}` : extras.length ? `unexpected: ${extras.join(', ')}` : undefined);
        const seen = new Set();
        const dupes = [];
        for (const s of assignedStudents) {
            if (seen.has(s))
                dupes.push(s);
            seen.add(s);
        }
        check('no duplicate students across groups', dupes.length === 0, dupes.length ? `duplicates: ${dupes.join(', ')}` : undefined);
    }
    // Duration in allowed bucket
    const durationMinutes = parseDurationMinutes((_o = activity.time) !== null && _o !== void 0 ? _o : '');
    if (durationMinutes !== null) {
        check('duration in allowed bucket', isInDurationBucket(durationMinutes), `${durationMinutes} min not in any bucket`);
    }
    else {
        check('duration parseable', false, `could not parse time: "${activity.time}"`);
    }
    // Format valid
    check('format is valid', VALID_FORMATS.includes(activity.format), `got "${activity.format}"`);
    return results;
}
// ── Student sorting check ─────────────────────────────────────────────────────
function runStudentSortingCheck(activity, studentData, label) {
    var _a, _b, _c, _d, _e;
    const base = { classroom: label, misconception: '', activity: (_a = activity.title) !== null && _a !== void 0 ? _a : '(untitled)' };
    const groups = (_d = (_c = (_b = activity === null || activity === void 0 ? void 0 : activity.tabs) === null || _b === void 0 ? void 0 : _b.studentGroupings) === null || _c === void 0 ? void 0 : _c.groups) !== null && _d !== void 0 ? _d : [];
    if (!studentData.length) {
        return { ...base, check: 'student sorting', pass: true, detail: 'no student data — skipped' };
    }
    if (!groups.length) {
        return { ...base, check: 'student sorting', pass: false, detail: 'no groups found in activity' };
    }
    const expected = computeExpectedGroups(groups.length, studentData);
    const actual = groups.map((g) => { var _a; return ((_a = g.students) !== null && _a !== void 0 ? _a : []); });
    const diffs = [];
    for (let i = 0; i < expected.length; i++) {
        const exp = [...expected[i]].sort();
        const act = [...((_e = actual[i]) !== null && _e !== void 0 ? _e : [])].sort();
        if (JSON.stringify(exp) !== JSON.stringify(act)) {
            diffs.push(`Group ${String.fromCharCode(65 + i)}: expected [${exp.join(', ')}] got [${act.join(', ')}]`);
        }
    }
    return {
        ...base,
        check: 'student sorting',
        pass: diffs.length === 0,
        detail: diffs.length ? diffs.join(' | ') : undefined,
    };
}
function llmResultsToTestResults(llmResult, base) {
    const checks = [
        ['misconception_driven', 'design: misconception-driven'],
        ['error_first', 'design: error-first instruction'],
        ['class_data_connection', 'design: connection to class data'],
        ['problem_math_correct', 'math: central problem is correct'],
        ['worked_examples_show_misconception', 'math: incorrect worked examples show target misconception error'],
        ['worked_examples_math_valid', 'math: worked examples are mathematically valid'],
        ['worked_examples_not_accidentally_correct', 'math: incorrect worked examples are not accidentally correct'],
    ];
    return checks.map(([key, checkName]) => {
        const raw = llmResult[`${key}_details`];
        const detail = typeof raw === 'string' ? raw || undefined : raw ? JSON.stringify(raw) : undefined;
        return { ...base, check: checkName, pass: llmResult[key], detail };
    });
}
// ── Report printer ────────────────────────────────────────────────────────────
function printReport(allResults, verbose) {
    // Group by classroom → misconception → activity
    const byClassroom = new Map();
    for (const r of allResults) {
        if (!byClassroom.has(r.classroom))
            byClassroom.set(r.classroom, new Map());
        const byMisco = byClassroom.get(r.classroom);
        if (!byMisco.has(r.misconception))
            byMisco.set(r.misconception, new Map());
        const byActivity = byMisco.get(r.misconception);
        if (!byActivity.has(r.activity))
            byActivity.set(r.activity, []);
        byActivity.get(r.activity).push(r);
    }
    let totalChecks = 0;
    let totalPassed = 0;
    let classroomsChecked = 0;
    let activitiesChecked = 0;
    for (const [classroom, miscoMap] of byClassroom) {
        classroomsChecked++;
        const classroomResults = [...miscoMap.values()].flatMap(m => [...m.values()].flat());
        const classroomFails = classroomResults.filter(r => !r.pass);
        if (verbose) {
            console.log(`\n── ${classroom} ──`);
        }
        else {
            const checksInClass = classroomResults.length;
            const passedInClass = classroomResults.filter(r => r.pass).length;
            const failCount = checksInClass - passedInClass;
            const status = failCount === 0 ? '✓' : `✗ ${failCount} fail(s)`;
            console.log(`\n── ${classroom} — ${passedInClass}/${checksInClass} checks ${status}`);
        }
        for (const [misco, actMap] of miscoMap) {
            const miscoResults = [...actMap.values()].flat();
            const miscoFails = miscoResults.filter(r => !r.pass);
            if (verbose) {
                console.log(`  Misconception: ${misco}`);
            }
            else if (miscoFails.length > 0) {
                console.log(`  [${misco}]`);
            }
            for (const [activity, results] of actMap) {
                activitiesChecked++;
                const actFails = results.filter(r => !r.pass);
                if (verbose) {
                    console.log(`    Activity: ${activity}`);
                    for (const r of results) {
                        const tag = r.pass ? '[PASS]' : '[FAIL]';
                        const detail = !r.pass && r.detail ? ` — ${r.detail}` : '';
                        console.log(`      ${tag} ${r.check}${detail}`);
                    }
                }
                else if (actFails.length > 0) {
                    const actLabel = activity || '(misconception-level)';
                    console.log(`    ${actLabel} — ${results.filter(r => r.pass).length}/${results.length} passed`);
                    for (const r of actFails) {
                        const detail = r.detail ? ` — ${r.detail}` : '';
                        console.log(`      [FAIL] ${r.check}${detail}`);
                    }
                }
                totalChecks += results.length;
                totalPassed += results.filter(r => r.pass).length;
            }
        }
    }
    const failed = totalChecks - totalPassed;
    console.log('\n=== Summary ===');
    console.log(`Classrooms: ${classroomsChecked} | Activities: ${activitiesChecked} | Checks: ${totalPassed}/${totalChecks} passed | Failed: ${failed}`);
    if (!verbose && failed > 0)
        console.log('Run with --verbose to see all checks');
}
// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    console.log('=== Microcoach Content Validator ===');
    const args = parseArgs();
    const { verbose } = args;
    const gql = await (0, appsync_config_1.createGqlClient)();
    console.log(`✓  LLM checks via microcoachLLMVerify-${AMPLIFY_ENV}\n`);
    // Fetch classrooms
    const classroomsData = await gql(LIST_CLASSROOMS);
    const classrooms = (_b = (_a = classroomsData.listClassrooms) === null || _a === void 0 ? void 0 : _a.items) !== null && _b !== void 0 ? _b : [];
    if (!classrooms.length)
        throw new Error('No classrooms found');
    console.log(`Found ${classrooms.length} classroom(s)\n`);
    const allResults = [];
    for (const classroom of classrooms) {
        const classroomLabel = `${classroom.classroomName} (grade ${classroom.grade})`;
        process.stdout.write(`Checking ${classroomLabel}...`);
        // Fetch sessions
        const sessionsData = await gql(SESSIONS_BY_CLASSROOM, { classroomId: classroom.id });
        const sessions = (_d = (_c = sessionsData.sessionsByClassroomId) === null || _c === void 0 ? void 0 : _c.items) !== null && _d !== void 0 ? _d : [];
        if (!sessions.length) {
            console.log(' no sessions found — skipping');
            continue;
        }
        const weeks = sessions.map((s) => s.weekNumber).filter(Boolean);
        const withData = sessions.filter((s) => !!s.pregeneratedNextSteps);
        // Filter to sessions with pregenerated data and within week range
        const targets = sessions.filter((s) => {
            var _a;
            if (!s.pregeneratedNextSteps)
                return false;
            const week = (_a = s.weekNumber) !== null && _a !== void 0 ? _a : 0;
            if (args.weekMin !== undefined && week < args.weekMin)
                return false;
            if (args.weekMax !== undefined && week > args.weekMax)
                return false;
            return true;
        });
        if (!targets.length) {
            console.log(` ${sessions.length} session(s) (weeks ${weeks.join(', ')}),` +
                ` ${withData.length} with pregeneratedNextSteps` +
                (withData.length > 0 ? ` (weeks ${withData.map((s) => s.weekNumber).join(', ')}) — outside week range` : '') +
                ' — skipping');
            continue;
        }
        console.log(` ${targets.length} session(s) to validate (week(s) ${targets.map((s) => s.weekNumber).join(', ')})`);
        // Build student name map
        const studentNameMap = new Map();
        for (const s of ((_f = (_e = classroom.students) === null || _e === void 0 ? void 0 : _e.items) !== null && _f !== void 0 ? _f : [])) {
            if (s.id && s.name)
                studentNameMap.set(s.id, s.name);
        }
        for (const session of targets) {
            const sessionLabel = `${classroomLabel}, week ${session.weekNumber}`;
            // Parse stored next steps
            let nextSteps;
            try {
                nextSteps = JSON.parse(session.pregeneratedNextSteps);
            }
            catch {
                console.error(`  ✗ Could not parse pregeneratedNextSteps for session ${session.id}`);
                continue;
            }
            // Fetch student responses for the PPQ assessment
            const ppqAssessment = ((_h = (_g = session.assessments) === null || _g === void 0 ? void 0 : _g.items) !== null && _h !== void 0 ? _h : []).find((a) => a.type === 'PPQ');
            let studentResponses = [];
            if (ppqAssessment === null || ppqAssessment === void 0 ? void 0 : ppqAssessment.id) {
                try {
                    const srData = await gql(STUDENT_RESPONSES_BY_ASSESSMENT, { assessmentId: ppqAssessment.id });
                    studentResponses = (_k = (_j = srData === null || srData === void 0 ? void 0 : srData.studentResponsesByAssessmentId) === null || _j === void 0 ? void 0 : _j.items) !== null && _k !== void 0 ? _k : [];
                }
                catch (err) {
                    console.warn(`  ⚠  Could not fetch student responses for session ${session.id}: ${err}`);
                }
            }
            // Queue LLM check tasks for this session (run in parallel per activity)
            const llmTasks = [];
            for (const misconception of nextSteps) {
                const miscoTitle = (_l = misconception.title) !== null && _l !== void 0 ? _l : '(unknown)';
                const qNums = parseQuestionNumbers((_o = (_m = misconception.evidence) === null || _m === void 0 ? void 0 : _m.source) !== null && _o !== void 0 ? _o : '');
                const studentData = getStudentPerformanceData(studentResponses, qNums, studentNameMap);
                const allGroupStudents = new Set(studentData.map(s => s.name));
                // Misconception-level structural checks
                const miscoChecks = runMisconceptionStructuralChecks(misconception, sessionLabel);
                for (const r of miscoChecks) {
                    r.misconception = misconception.isCore ? `${miscoTitle} [CORE]` : miscoTitle;
                }
                allResults.push(...miscoChecks);
                for (const activity of ((_p = misconception.moveOptions) !== null && _p !== void 0 ? _p : [])) {
                    const resultBase = {
                        classroom: sessionLabel,
                        misconception: misconception.isCore ? `${miscoTitle} [CORE]` : miscoTitle,
                        activity: (_q = activity.title) !== null && _q !== void 0 ? _q : '(untitled)',
                    };
                    // Structural checks
                    const structural = runStructuralChecks(activity, allGroupStudents, sessionLabel);
                    for (const r of structural) {
                        r.classroom = sessionLabel;
                        r.misconception = resultBase.misconception;
                    }
                    allResults.push(...structural);
                    // Student sorting check
                    if (studentData.length > 0) {
                        const sortResult = runStudentSortingCheck(activity, studentData, sessionLabel);
                        sortResult.misconception = resultBase.misconception;
                        allResults.push(sortResult);
                    }
                    // Queue LLM check
                    const promise = invokeLLMVerify(misconception, activity)
                        .then(llmResult => llmResultsToTestResults(llmResult, resultBase))
                        .catch(err => [{
                            ...resultBase,
                            check: 'llm check',
                            pass: false,
                            detail: `LLM check failed: ${err}`,
                        }]);
                    llmTasks.push({ misconceptionTitle: miscoTitle, activityTitle: activity.title, promise });
                }
            }
            // Run all LLM checks for this session in parallel, with live progress
            if (llmTasks.length > 0) {
                let completed = 0;
                const total = llmTasks.length;
                const tick = (title) => {
                    completed++;
                    process.stdout.write(`\r  LLM ${completed}/${total}: ${title.slice(0, 40).padEnd(40)}`);
                };
                process.stdout.write(`  LLM 0/${total}...`);
                const llmResultGroups = await Promise.all(llmTasks.map(t => t.promise.then(result => { var _a; tick((_a = t.activityTitle) !== null && _a !== void 0 ? _a : ''); return result; })));
                process.stdout.write(`\r  LLM ${total}/${total} done${' '.repeat(50)}\n`);
                for (const group of llmResultGroups) {
                    allResults.push(...group);
                }
            }
        }
    }
    printReport(allResults, verbose);
}
main().catch((err) => {
    console.error('\nFailed:', err);
    process.exit(1);
});
