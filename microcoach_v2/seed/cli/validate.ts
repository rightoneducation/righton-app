/**
 * validate-next-steps.ts — content quality test suite for pregeneratedNextSteps
 *
 * Run from the api/ directory:
 *   APPSYNC_SECRET_NAME=microcoach yarn ts-node src/cli/validate.ts [--week-min 15] [--week-max 20]
 *
 * Checks each stored activity against:
 *   1. Structural rules (deterministic)
 *   2. Student sorting accuracy (deterministic, requires DB)
 *   3. Design principle compliance (LLM-as-judge via microcoachLLMVerify Lambda)
 */

import { createGqlClient, GqlFn } from './util/appsync-config';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import * as path from 'path';
import * as fs from 'fs';

const AMPLIFY_ENV = process.env.AMPLIFY_ENV ?? 'dev';

async function invokeLLMVerify(misconception: any, activity: any): Promise<LlmCheckResult> {
  const client = new LambdaClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
  const cmd = new InvokeCommand({
    FunctionName: `microcoachv2LLMVerify-${AMPLIFY_ENV}`,
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
  '../../amplify/backend/function/microcoachv2NextStepOption/src/util/config.json'
);
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const nso = config?.nextStepOption ?? {};

const cdo = nso.closingDiscussion ?? {};
const QUESTION_COUNT          = cdo.questionCount ?? 3;
const WATCH_FOR_MIN           = cdo.watchFors?.min ?? 1;
const WATCH_FOR_MAX           = cdo.watchFors?.max ?? 3;
const EXAMPLES_MIN            = nso.examples?.min ?? 1;
const EXAMPLES_MAX            = nso.examples?.max ?? 3;
const ALLOWED_DURATION_BUCKETS: Array<{ label: string; min: number; max: number }> =
  nso.allowedDurationBuckets ?? [];
const DESIGN_PRINCIPLES: string[] = nso.designPrinciples ?? [];

// source: amplify/backend/function/microcoachv2NextStepOption/src/util/activityContent.mjs
// (CONTENT_TYPES). seed/ cannot import from amplify/, so this is hand-copied —
// same duplication as TEMPLATE_CONTENT_TYPE in Preview.tsx.
const KNOWN_CONTENT_TYPES = [
  'INCORRECT_WORKED_EXAMPLES',
  'FAVORITE_NO',
  'COMPARE_THE_THINKING',
  'MATH_DETECTIVE',
  'MAKE_YOUR_CASE',
];
// The templates whose artifact is a set of up to three examples.
const EXAMPLE_TYPES = ['INCORRECT_WORKED_EXAMPLES', 'FAVORITE_NO', 'MATH_DETECTIVE'];

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


// ── Helpers ───────────────────────────────────────────────────────────────────

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
  label: string,
): TestResult[] {
  const results: TestResult[] = [];
  const base = { classroom: label, misconception: '', activity: activity.title ?? '(untitled)' };

  function check(checkName: string, pass: boolean, detail?: string): void {
    results.push({ ...base, check: checkName, pass, detail });
  }

  // The Wave 2 content the app renders (src/lib/ActivityContentModels.ts). The
  // full shape is pinned by the Lambda's zod schema; these are the rules a
  // reviewer most wants to see pass or fail by name.
  const content = activity.content ?? null;
  check('content present', content != null, content ? undefined : 'no Wave 2 content');
  if (content) {
    check('content.schemaVersion is 2', content.schemaVersion === 2, `got ${content.schemaVersion}`);
    const facilitate = content.facilitate ?? {};
    check('facilitate.type is a known content type', KNOWN_CONTENT_TYPES.includes(facilitate.type), `got "${facilitate.type}"`);
    check(
      "facilitate.type matches the activity's activityType",
      facilitate.type === activity.activityType,
      `content "${facilitate.type}" vs activityType "${activity.activityType}"`,
    );
    check('whyThisActivity present', Boolean(content.whyThisActivity?.trim()));
    check('beforeClass.steps non-empty', (content.beforeClass?.steps ?? []).length > 0);
    check('howToRun non-empty', (content.howToRun ?? []).length > 0);

    if (EXAMPLE_TYPES.includes(facilitate.type)) {
      const examples: any[] = facilitate.examples ?? [];
      check(`examples (${EXAMPLES_MIN}-${EXAMPLES_MAX})`, examples.length >= EXAMPLES_MIN && examples.length <= EXAMPLES_MAX, `got ${examples.length}`);
      const problems = examples.map((e: any) => String(e?.problem ?? '').replace(/\s|\$/g, ''));
      check('examples use different problems', new Set(problems).size === problems.length, `problems: ${problems.join(' | ')}`);
    }
    // Exactly one ERROR step per worked example: the marker the UI keys the error
    // row off, and what the accuracy reviewer must preserve.
    if (facilitate.type === 'INCORRECT_WORKED_EXAMPLES') {
      const badErrorCount = (facilitate.examples ?? []).filter(
        (e: any) => (e?.steps ?? []).filter((st: any) => st?.annotation?.kind === 'ERROR').length !== 1,
      );
      check('each worked example has exactly one ERROR step', badErrorCount.length === 0, badErrorCount.length ? `${badErrorCount.length} example(s) with 0 or >1 ERROR steps` : undefined);
    }

    const discussion = content.discussion ?? {};
    check(`discussion questions (${QUESTION_COUNT})`, (discussion.questions ?? []).length === QUESTION_COUNT, `got ${(discussion.questions ?? []).length}`);
    const watchFors: any[] = discussion.watchFors ?? [];
    check(`watch for sets (${WATCH_FOR_MIN}-${WATCH_FOR_MAX})`, watchFors.length >= WATCH_FOR_MIN && watchFors.length <= WATCH_FOR_MAX, `got ${watchFors.length}`);
    check('mathematical takeaway present', Boolean(discussion.takeaway?.trim()));
  }

  // The IMicroCoachActivity fields the UI reads around the content.
  check('routine present', activity.routine?.name != null, activity.routine ? undefined : 'no routine — unknown templateId?');
  check('durationMinutes present', Number.isInteger(activity.durationMinutes), `got ${activity.durationMinutes}`);
  check(
    'detailStatus matches content presence',
    activity.detailStatus === (content ? 'COMPLETE' : 'PARTIAL'),
    `got "${activity.detailStatus}"`,
  );

  const durationMinutes = parseDurationMinutes(activity.time ?? '');
  if (durationMinutes !== null) {
    check('duration in allowed bucket', isInDurationBucket(durationMinutes), `${durationMinutes} min not in any bucket`);
  } else {
    check('duration parseable', false, `could not parse time: "${activity.time}"`);
  }

  return results;
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
  // Checks the Lambda did not ask about, because the activity has nothing to ask
  // about — the worked-example checks only apply to INCORRECT_WORKED_EXAMPLES. Their
  // keys are absent from the response, so they must be omitted rather than read as
  // false. Older responses have no such field; `?? []` keeps them working.
  skippedChecks?: string[];
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

  const skipped = new Set(llmResult.skippedChecks ?? []);

  return checks
    .filter(([key]) => !skipped.has(key as string))
    .map(([key, checkName]) => {
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
  console.log(`✓  LLM checks via microcoachv2LLMVerify-${AMPLIFY_ENV}\n`);

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

      // Queue LLM check tasks for this session (run in parallel per activity)
      const llmTasks: Array<{
        misconceptionTitle: string;
        activityTitle: string;
        promise: Promise<TestResult[]>;
      }> = [];

      for (const misconception of nextSteps) {
        const miscoTitle = misconception.title ?? '(unknown)';

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
          const structural = runStructuralChecks(activity, sessionLabel);
          for (const r of structural) {
            r.classroom = sessionLabel;
            r.misconception = resultBase.misconception;
          }
          allResults.push(...structural);

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
