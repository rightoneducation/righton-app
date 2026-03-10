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

import { createGqlClient, GqlFn } from './appsync-config';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import * as path from 'path';
import * as fs from 'fs';

const AMPLIFY_ENV = process.env.AMPLIFY_ENV ?? 'dev';

async function invokeLLMVerify(misconception: any, activity: any): Promise<LlmCheckResult> {
  const client = new LambdaClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
  const cmd = new InvokeCommand({
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
    const errBody = Buffer.from(resp.Payload as Uint8Array).toString('utf8');
    throw new Error(`microcoachLLMVerify error: ${errBody}`);
  }
  return JSON.parse(Buffer.from(resp.Payload as Uint8Array).toString('utf8')) as LlmCheckResult;
}

// ── Config ────────────────────────────────────────────────────────────────────

const configPath = path.resolve(
  __dirname,
  '../../amplify/backend/function/microcoachNextStepOption/src/util/config.json'
);
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const nso = config?.nextStepOption ?? {};

const OVERVIEW_BULLETS_MIN    = nso.overviewBullets?.min ?? 2;
const OVERVIEW_BULLETS_MAX    = nso.overviewBullets?.max ?? 4;
const INCORRECT_EXAMPLES_COUNT = nso.incorrectWorkedExamplesCount ?? 3;
const ACTIVITY_STEPS_MIN      = nso.activitySteps?.min ?? 4;
const ACTIVITY_STEPS_MAX      = nso.activitySteps?.max ?? 6;
const SETUP_STEPS_MIN         = nso.setupSteps?.min ?? 2;
const SETUP_STEPS_MAX         = nso.setupSteps?.max ?? 3;
const DISCUSSION_Q_MIN        = nso.discussionQuestions?.min ?? 2;
const DISCUSSION_Q_MAX        = nso.discussionQuestions?.max ?? 3;
const GROUPS_MIN              = nso.studentGroups?.min ?? 2;
const GROUPS_MAX              = nso.studentGroups?.max ?? 3;
const ALLOWED_DURATION_BUCKETS: Array<{ label: string; min: number; max: number }> =
  nso.allowedDurationBuckets ?? [];
const DESIGN_PRINCIPLES: string[] = nso.designPrinciples ?? [];
const VALID_FORMATS = ['Small groups', 'Whole class', 'Individual'];

// ── CLI args ──────────────────────────────────────────────────────────────────

function parseArgs(): { weekMin?: number; weekMax?: number; verbose: boolean } {
  const argv = process.argv.slice(2);
  let weekMin: number | undefined;
  let weekMax: number | undefined;
  let verbose = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--week-min' && argv[i + 1]) weekMin = parseInt(argv[++i], 10);
    if (argv[i] === '--week-max' && argv[i + 1]) weekMax = parseInt(argv[++i], 10);
    if (argv[i] === '--verbose' || argv[i] === '-v') verbose = true;
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

function parseQuestionNumbers(source: string): number[] {
  const matches = (source ?? '').matchAll(/Q(\d+)/gi);
  const nums = new Set<number>();
  for (const m of matches) nums.add(parseInt(m[1], 10));
  return [...nums].sort((a, b) => a - b);
}

function getStudentPerformanceData(
  studentResponses: any[],
  questionNumbers: number[],
  studentNameMap: Map<string, string>,
): Array<{ name: string; score: number }> {
  if (!questionNumbers.length) return [];
  const qSet = new Set(questionNumbers);
  const result: Array<{ name: string; score: number }> = [];
  for (const sr of studentResponses) {
    const name = studentNameMap.get(sr.studentId);
    if (!name) continue;
    const relevant = (sr.questionResponses ?? []).filter((qr: any) => qSet.has(qr.questionNumber));
    if (!relevant.length) continue;
    const correct = relevant.filter((qr: any) => qr.isCorrect).length;
    result.push({ name, score: Math.round((correct / relevant.length) * 100) / 100 });
  }
  return result.sort((a, b) => a.name.localeCompare(b.name));
}

/** Replicate the sort+split logic from injectStudentsIntoGroups — returns expected group assignments */
function computeExpectedGroups(
  numGroups: number,
  studentData: Array<{ name: string; score: number }>,
): string[][] {
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

function parseDurationMinutes(time: string): number | null {
  const m = (time ?? '').match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function isInDurationBucket(minutes: number): boolean {
  return ALLOWED_DURATION_BUCKETS.some(b => minutes >= b.min && minutes <= b.max);
}

// ── Test result types ─────────────────────────────────────────────────────────

interface TestResult {
  classroom: string;
  misconception: string;
  activity: string;
  check: string;
  pass: boolean;
  detail?: string;
}

// ── Misconception-level structural checks ─────────────────────────────────────

const HEDGING_WORDS = ['often', 'typically', 'usually', 'tend to'];

function runMisconceptionStructuralChecks(misconception: any, sessionLabel: string): TestResult[] {
  const results: TestResult[] = [];
  const base = { classroom: sessionLabel, misconception: '', activity: '' };

  function check(checkName: string, pass: boolean, detail?: string): void {
    results.push({ ...base, check: checkName, pass, detail });
  }

  // misconceptionSummary non-empty
  const summary = misconception.misconceptionSummary;
  check('misconceptionSummary non-empty', typeof summary === 'string' && summary.trim().length > 0);

  // successIndicators present (≥1 item, each non-empty string)
  const si: any[] = misconception.successIndicators ?? [];
  const siOk = Array.isArray(si) && si.length >= 1 && si.every((x: any) => typeof x === 'string' && x.trim().length > 0);
  check('successIndicators present (≥1 item)', siOk, !Array.isArray(si) ? 'not an array' : si.length === 0 ? 'empty array' : 'item(s) not non-empty strings');

  // wrongAnswerExplanations present (≥1 item, each {answer, explanation} non-empty)
  const wae: any[] = misconception.wrongAnswerExplanations ?? [];
  const waeBad = !Array.isArray(wae) || wae.length === 0 || wae.some((x: any) => !x?.answer || !x?.explanation);
  check(
    'wrongAnswerExplanations present (≥1 item)',
    !waeBad,
    !Array.isArray(wae) ? 'not an array' : wae.length === 0 ? 'empty array' : 'item(s) missing answer or explanation',
  );

  // correctAnswerSolution present (≥1 item, each non-empty string)
  const cas: any[] = misconception.correctAnswerSolution ?? [];
  const casOk = Array.isArray(cas) && cas.length >= 1 && cas.every((x: any) => typeof x === 'string' && x.trim().length > 0);
  check('correctAnswerSolution present (≥1 item)', casOk, !Array.isArray(cas) ? 'not an array' : cas.length === 0 ? 'empty array' : 'item(s) not non-empty strings');

  // evidence.mostCommonError non-empty
  const mce = misconception.evidence?.mostCommonError;
  check('evidence.mostCommonError non-empty', typeof mce === 'string' && mce.trim().length > 0);

  // No hedging words in misconceptionSummary
  if (typeof summary === 'string') {
    const lc = summary.toLowerCase();
    const found = HEDGING_WORDS.find(w => lc.includes(w));
    check('no hedging words in misconceptionSummary', !found, found ? `found hedging: "${found}" in misconceptionSummary` : undefined);
  } else {
    check('no hedging words in misconceptionSummary', true);
  }

  return results;
}

// ── Structural checks ─────────────────────────────────────────────────────────

function runStructuralChecks(
  activity: any,
  allGroupStudents: Set<string>,  // students from studentData (expected assignees)
  label: string,
): TestResult[] {
  const results: TestResult[] = [];
  const base = { classroom: label, misconception: '', activity: activity.title ?? '(untitled)' };

  function check(checkName: string, pass: boolean, detail?: string): void {
    results.push({ ...base, check: checkName, pass, detail });
  }

  const tabs = activity.tabs ?? {};
  const overview = tabs.overview ?? {};
  const actSteps = tabs.activitySteps ?? {};
  const groupings = tabs.studentGroupings ?? {};
  const groups: any[] = groupings.groups ?? [];

  // Overview: whatStudentsDo
  const wsd: any[] = overview.whatStudentsDo ?? [];
  const wsdIsArray = Array.isArray(wsd);
  const wsdLen = wsdIsArray ? wsd.length : 0;
  check(
    'overview.whatStudentsDo is a bullet array (2-4 items)',
    wsdIsArray && wsdLen >= OVERVIEW_BULLETS_MIN && wsdLen <= OVERVIEW_BULLETS_MAX,
    !wsdIsArray ? 'not an array' : `got ${wsdLen} item(s)`,
  );
  if (wsdIsArray) {
    const badLabels = wsd.filter((b: any) => !b?.label || !b?.detail);
    check('overview.whatStudentsDo bullets have {label, detail}', badLabels.length === 0, badLabels.length ? `${badLabels.length} bullet(s) missing label or detail` : undefined);
    const longLabels = wsd.filter((b: any) => b?.label && b.label.trim().split(/\s+/).length > 5);
    check('overview.whatStudentsDo label ≤ 5 words', longLabels.length === 0, longLabels.length ? `"${longLabels[0].label}" is too long` : undefined);
  }

  // Overview: whatYouDo
  const wyd: any[] = overview.whatYouDo ?? [];
  const wydIsArray = Array.isArray(wyd);
  const wydLen = wydIsArray ? wyd.length : 0;
  check(
    'overview.whatYouDo is a bullet array (2-4 items)',
    wydIsArray && wydLen >= OVERVIEW_BULLETS_MIN && wydLen <= OVERVIEW_BULLETS_MAX,
    !wydIsArray ? 'not an array' : `got ${wydLen} item(s)`,
  );
  if (wydIsArray) {
    const badLabels = wyd.filter((b: any) => !b?.label || !b?.detail);
    check('overview.whatYouDo bullets have {label, detail}', badLabels.length === 0, badLabels.length ? `${badLabels.length} bullet(s) missing label or detail` : undefined);
    const longLabels = wyd.filter((b: any) => b?.label && b.label.trim().split(/\s+/).length > 5);
    check('overview.whatYouDo label ≤ 5 words', longLabels.length === 0, longLabels.length ? `"${longLabels[0].label}" is too long` : undefined);
  }

  // Incorrect worked examples
  const iwe: any[] = actSteps.incorrectWorkedExamples ?? [];
  check(
    `${INCORRECT_EXAMPLES_COUNT} incorrect worked examples present`,
    iwe.length === INCORRECT_EXAMPLES_COUNT,
    `got ${iwe.length}`,
  );
  const badIwe = iwe.filter((e: any) => !e?.problem || !e?.incorrectWork);
  check('incorrect worked examples have {problem, incorrectWork}', badIwe.length === 0, badIwe.length ? `${badIwe.length} example(s) missing fields` : undefined);

  // Core activity steps
  const core: string[] = actSteps.coreActivity ?? [];
  check(
    `core activity steps (${ACTIVITY_STEPS_MIN}-${ACTIVITY_STEPS_MAX})`,
    core.length >= ACTIVITY_STEPS_MIN && core.length <= ACTIVITY_STEPS_MAX,
    `got ${core.length}`,
  );

  // Setup steps
  const setup: string[] = actSteps.setup ?? [];
  check(
    `setup steps (${SETUP_STEPS_MIN}-${SETUP_STEPS_MAX})`,
    setup.length >= SETUP_STEPS_MIN && setup.length <= SETUP_STEPS_MAX,
    `got ${setup.length}`,
  );

  // Discussion questions
  const dq: string[] = actSteps.discussionQuestions ?? [];
  check(
    `discussion questions (${DISCUSSION_Q_MIN}-${DISCUSSION_Q_MAX})`,
    dq.length >= DISCUSSION_Q_MIN && dq.length <= DISCUSSION_Q_MAX,
    `got ${dq.length}`,
  );

  // Student groups count
  check(
    `student groups count (${GROUPS_MIN}-${GROUPS_MAX})`,
    groups.length >= GROUPS_MIN && groups.length <= GROUPS_MAX,
    `got ${groups.length}`,
  );

  // All students assigned (exactly once)
  if (allGroupStudents.size > 0) {
    const assignedStudents: string[] = groups.flatMap((g: any) => g.students ?? []);
    const assignedSet = new Set(assignedStudents);
    const missing = [...allGroupStudents].filter(s => !assignedSet.has(s));
    const extras = assignedStudents.filter(s => !allGroupStudents.has(s));
    check(
      'all students assigned',
      missing.length === 0 && extras.length === 0,
      missing.length ? `missing: ${missing.join(', ')}` : extras.length ? `unexpected: ${extras.join(', ')}` : undefined,
    );

    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const s of assignedStudents) {
      if (seen.has(s)) dupes.push(s);
      seen.add(s);
    }
    check('no duplicate students across groups', dupes.length === 0, dupes.length ? `duplicates: ${dupes.join(', ')}` : undefined);
  }

  // Duration in allowed bucket
  const durationMinutes = parseDurationMinutes(activity.time ?? '');
  if (durationMinutes !== null) {
    check(
      'duration in allowed bucket',
      isInDurationBucket(durationMinutes),
      `${durationMinutes} min not in any bucket`,
    );
  } else {
    check('duration parseable', false, `could not parse time: "${activity.time}"`);
  }

  // Format valid
  check(
    'format is valid',
    VALID_FORMATS.includes(activity.format),
    `got "${activity.format}"`,
  );

  return results;
}

// ── Student sorting check ─────────────────────────────────────────────────────

function runStudentSortingCheck(
  activity: any,
  studentData: Array<{ name: string; score: number }>,
  label: string,
): TestResult {
  const base = { classroom: label, misconception: '', activity: activity.title ?? '(untitled)' };
  const groups: any[] = activity?.tabs?.studentGroupings?.groups ?? [];

  if (!studentData.length) {
    return { ...base, check: 'student sorting', pass: true, detail: 'no student data — skipped' };
  }
  if (!groups.length) {
    return { ...base, check: 'student sorting', pass: false, detail: 'no groups found in activity' };
  }

  const expected = computeExpectedGroups(groups.length, studentData);
  const actual = groups.map((g: any) => (g.students ?? []) as string[]);

  const diffs: string[] = [];
  for (let i = 0; i < expected.length; i++) {
    const exp = [...expected[i]].sort();
    const act = [...(actual[i] ?? [])].sort();
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

// ── LLM checks ────────────────────────────────────────────────────────────────

interface LlmCheckResult {
  misconception_driven: boolean;
  misconception_driven_details: string;
  error_first: boolean;
  error_first_details: string;
  class_data_connection: boolean;
  class_data_connection_details: string;
  problem_math_correct: boolean;
  problem_math_correct_details: string;
  worked_examples_show_misconception: boolean;
  worked_examples_show_misconception_details: string;
  worked_examples_math_valid: boolean;
  worked_examples_math_valid_details: string;
  worked_examples_not_accidentally_correct: boolean;
  worked_examples_not_accidentally_correct_details: string;
}

function llmResultsToTestResults(
  llmResult: LlmCheckResult,
  base: { classroom: string; misconception: string; activity: string },
): TestResult[] {
  const checks: Array<[keyof LlmCheckResult, string]> = [
    ['misconception_driven', 'design: misconception-driven'],
    ['error_first', 'design: error-first instruction'],
    ['class_data_connection', 'design: connection to class data'],
    ['problem_math_correct', 'math: central problem is correct'],
    ['worked_examples_show_misconception', 'math: incorrect worked examples show target misconception error'],
    ['worked_examples_math_valid', 'math: worked examples are mathematically valid'],
    ['worked_examples_not_accidentally_correct', 'math: incorrect worked examples are not accidentally correct'],
  ];

  return checks.map(([key, checkName]) => {
    const raw = llmResult[`${key}_details` as keyof LlmCheckResult];
    const detail = typeof raw === 'string' ? raw || undefined : raw ? JSON.stringify(raw) : undefined;
    return { ...base, check: checkName, pass: llmResult[key] as boolean, detail };
  });
}

// ── Report printer ────────────────────────────────────────────────────────────

function printReport(allResults: TestResult[], verbose: boolean): void {
  // Group by classroom → misconception → activity
  const byClassroom = new Map<string, Map<string, Map<string, TestResult[]>>>();
  for (const r of allResults) {
    if (!byClassroom.has(r.classroom)) byClassroom.set(r.classroom, new Map());
    const byMisco = byClassroom.get(r.classroom)!;
    if (!byMisco.has(r.misconception)) byMisco.set(r.misconception, new Map());
    const byActivity = byMisco.get(r.misconception)!;
    if (!byActivity.has(r.activity)) byActivity.set(r.activity, []);
    byActivity.get(r.activity)!.push(r);
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
    } else {
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
      } else if (miscoFails.length > 0) {
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
        } else if (actFails.length > 0) {
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
  if (!verbose && failed > 0) console.log('Run with --verbose to see all checks');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('=== Microcoach Content Validator ===');

  const args = parseArgs();
  const { verbose } = args;
  const gql: GqlFn = await createGqlClient();
  console.log(`✓  LLM checks via microcoachLLMVerify-${AMPLIFY_ENV}\n`);

  // Fetch classrooms
  const classroomsData = await gql(LIST_CLASSROOMS);
  const classrooms: any[] = classroomsData.listClassrooms?.items ?? [];
  if (!classrooms.length) throw new Error('No classrooms found');
  console.log(`Found ${classrooms.length} classroom(s)\n`);

  const allResults: TestResult[] = [];

  for (const classroom of classrooms) {
    const classroomLabel = `${classroom.classroomName} (grade ${classroom.grade})`;
    process.stdout.write(`Checking ${classroomLabel}...`);

    // Fetch sessions
    const sessionsData = await gql(SESSIONS_BY_CLASSROOM, { classroomId: classroom.id });
    const sessions: any[] = sessionsData.sessionsByClassroomId?.items ?? [];

    if (!sessions.length) {
      console.log(' no sessions found — skipping');
      continue;
    }

    const weeks = sessions.map((s: any) => s.weekNumber).filter(Boolean);
    const withData = sessions.filter((s: any) => !!s.pregeneratedNextSteps);

    // Filter to sessions with pregenerated data and within week range
    const targets = sessions.filter((s: any) => {
      if (!s.pregeneratedNextSteps) return false;
      const week = s.weekNumber ?? 0;
      if (args.weekMin !== undefined && week < args.weekMin) return false;
      if (args.weekMax !== undefined && week > args.weekMax) return false;
      return true;
    });

    if (!targets.length) {
      console.log(
        ` ${sessions.length} session(s) (weeks ${weeks.join(', ')}),` +
        ` ${withData.length} with pregeneratedNextSteps` +
        (withData.length > 0 ? ` (weeks ${withData.map((s: any) => s.weekNumber).join(', ')}) — outside week range` : '') +
        ' — skipping'
      );
      continue;
    }

    console.log(` ${targets.length} session(s) to validate (week(s) ${targets.map((s: any) => s.weekNumber).join(', ')})`);

    // Build student name map
    const studentNameMap = new Map<string, string>();
    for (const s of (classroom.students?.items ?? [])) {
      if (s.id && s.name) studentNameMap.set(s.id, s.name);
    }

    for (const session of targets) {
      const sessionLabel = `${classroomLabel}, week ${session.weekNumber}`;

      // Parse stored next steps
      let nextSteps: any[];
      try {
        nextSteps = JSON.parse(session.pregeneratedNextSteps);
      } catch {
        console.error(`  ✗ Could not parse pregeneratedNextSteps for session ${session.id}`);
        continue;
      }

      // Fetch student responses for the PPQ assessment
      const ppqAssessment = (session.assessments?.items ?? []).find((a: any) => a.type === 'PPQ');
      let studentResponses: any[] = [];
      if (ppqAssessment?.id) {
        try {
          const srData = await gql(STUDENT_RESPONSES_BY_ASSESSMENT, { assessmentId: ppqAssessment.id });
          studentResponses = srData?.studentResponsesByAssessmentId?.items ?? [];
        } catch (err) {
          console.warn(`  ⚠  Could not fetch student responses for session ${session.id}: ${err}`);
        }
      }

      // Queue LLM check tasks for this session (run in parallel per activity)
      const llmTasks: Array<{
        misconceptionTitle: string;
        activityTitle: string;
        promise: Promise<TestResult[]>;
      }> = [];

      for (const misconception of nextSteps) {
        const miscoTitle = misconception.title ?? '(unknown)';
        const qNums = parseQuestionNumbers(misconception.evidence?.source ?? '');
        const studentData = getStudentPerformanceData(studentResponses, qNums, studentNameMap);
        const allGroupStudents = new Set(studentData.map(s => s.name));

        // Misconception-level structural checks
        const miscoChecks = runMisconceptionStructuralChecks(misconception, sessionLabel);
        for (const r of miscoChecks) { r.misconception = misconception.isCore ? `${miscoTitle} [CORE]` : miscoTitle; }
        allResults.push(...miscoChecks);

        for (const activity of (misconception.moveOptions ?? [])) {
          const resultBase = {
            classroom: sessionLabel,
            misconception: misconception.isCore ? `${miscoTitle} [CORE]` : miscoTitle,
            activity: activity.title ?? '(untitled)',
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
        const tick = (title: string) => {
          completed++;
          process.stdout.write(`\r  LLM ${completed}/${total}: ${title.slice(0, 40).padEnd(40)}`);
        };
        process.stdout.write(`  LLM 0/${total}...`);
        const llmResultGroups = await Promise.all(
          llmTasks.map(t => t.promise.then(result => { tick(t.activityTitle ?? ''); return result; }))
        );
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
