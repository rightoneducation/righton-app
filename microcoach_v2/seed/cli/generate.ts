/**
 * generate-next-steps.ts — run the LLM pipeline offline and save pregenerated data
 *
 * Run from the api/ directory:
 *   npx ts-node src/cli/generate.ts
 *
 * Output: saves pregeneratedNextSteps to the Session record and sets currentWeek on Classroom
 *
 * This script replicates the data-fetch + LLM pipeline that previously ran on
 * every page load in App.js. Run it each week after ingesting new PPQ data;
 * the frontend reads currentWeek from Classroom, finds the matching Session,
 * and renders its pregeneratedNextSteps — no LLM calls at page-load time.
 */

import { createGqlClient, GqlFn } from './util/appsync-config';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { RunCapture, NoopCapture, Capture } from '../eval/scripts/util/exportEvalOutputs';
import { loadFixture, normalizeRawGraphItems, Fixture } from '../eval/scripts/util/importEvalFixtures';
import { maskQuery } from '../eval/scripts/util/maskQuery';
import { MaskOptionEnum, KgQueryType } from '../eval/types';
import { computeMisconceptionReach } from '../eval/scripts/util/computeReach';

const AMPLIFY_ENV = process.env.AMPLIFY_ENV ?? 'dev';

// `--fixture <id>` is the single switch between the two modes this script runs in:
//
//   EVAL MODE  (--fixture present)  read a frozen session from disk, write the run
//                                   directory under eval/runs/, never touch the DB
//   CLI MODE   (no --fixture)       read from DynamoDB, write results back to it,
//                                   and produce no eval artifacts at all
//
// Keeping these on one flag means a CLI run cannot leave run directories behind that
// look like eval output, and an eval run cannot write to the database.
const FIXTURE_ARG = (() => {
  const i = process.argv.indexOf('--fixture');
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : null;
})();
const EVAL_MODE = FIXTURE_ARG !== null;

// A run that keeps no record of its own prompts cannot be compared against another
// one, so capture is not optional in eval mode — and is never on outside it.
const CAPTURE_ENABLED = EVAL_MODE;

const CONDITION: MaskOptionEnum = (() => {
  const i = process.argv.indexOf('--condition');
  const raw = i > -1 && process.argv[i + 1] ? process.argv[i + 1] : 'NONE';
  const key = raw.toUpperCase() as keyof typeof MaskOptionEnum;
  // An unrecognised name must not fall through to BASELINE — the run would be
  // recorded in the manifest under a condition it never actually applied.
  if (!(key in MaskOptionEnum)) {
    const valid = Object.keys(MaskOptionEnum).filter((k) => isNaN(Number(k)));
    throw new Error(`Unknown --condition "${raw}". Valid: ${valid.join(', ')}`);
  }
  return MaskOptionEnum[key];
})();
// Ask the Lambdas to echo `_trace` (resolved prompt, model, token usage, sub-calls).
// Additive and inert when false, so CLI runs are unaffected.
const WANT_TRACE = EVAL_MODE;

// `--graph live` re-queries Learning Commons instead of replaying the archived
// response. Eval mode only; a CLI run always queries live.
const GRAPH_SOURCE: 'fixture' | 'live' = (() => {
  const i = process.argv.indexOf('--graph');
  const v = i > -1 && process.argv[i + 1] ? process.argv[i + 1] : null;
  return v === 'live' ? 'live' : 'fixture';
})();

async function invokeLambda(functionName: string, payload: unknown): Promise<any> {
  const client = new LambdaClient({ region: process.env.AWS_REGION ?? 'us-east-1' });
  const cmd = new InvokeCommand({
    FunctionName: functionName,
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(JSON.stringify(payload)),
  });
  const resp = await client.send(cmd);
  if (resp.FunctionError) {
    const errBody = Buffer.from(resp.Payload as Uint8Array).toString('utf8');
    throw new Error(`Lambda ${functionName} error: ${errBody}`);
  }
  return JSON.parse(Buffer.from(resp.Payload as Uint8Array).toString('utf8'));
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

const UPDATE_MISCONCEPTION = /* GraphQL */ `
  mutation UpdateMisconception($input: UpdateMisconceptionInput!) {
    updateMisconception(input: $input) {
      id
      studentCount
      studentPercent
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

function computeConfidenceStats(studentResponses: any[], questions: any[]): any[] {
  const qStats: Record<number, any> = {};
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
  return Object.values(qStats).map((s: any) => ({
    questionNumber: s.questionNumber,
    avgConfidence:          s.countConf > 0          ? parseFloat((s.totalConf / s.countConf).toFixed(2))                  : null,
    avgConfidenceCorrect:   s.countConfCorrect > 0   ? parseFloat((s.totalConfCorrect / s.countConfCorrect).toFixed(2))    : null,
    avgConfidenceIncorrect: s.countConfIncorrect > 0 ? parseFloat((s.totalConfIncorrect / s.countConfIncorrect).toFixed(2)) : null,
    highConfWrongPct:       s.totalHighConf > 0      ? parseFloat((s.highConfWrong / s.totalHighConf).toFixed(3))          : null,
  }));
}

// ── PPQ enrichment helpers ────────────────────────────────────────────────────

/** Extract question numbers from a string like "PPQ Q3, Q5" or "Q1 and Q4" → [1, 3, 4, 5] */
function parseQuestionNumbers(source: string): number[] {
  const matches = (source ?? '').matchAll(/Q(\d+)/gi);
  const nums = new Set<number>();
  for (const m of matches) nums.add(parseInt(m[1], 10));
  return [...nums].sort((a, b) => a - b);
}

/** Per question, count occurrences of each wrong response string. */
function computeWrongAnswerDist(studentResponses: any[]): Record<number, Record<string, number>> {
  const dist: Record<number, Record<string, number>> = {};
  for (const sr of studentResponses) {
    for (const qr of (sr.questionResponses ?? [])) {
      if (qr.isCorrect || qr.response == null) continue;
      const qn: number = qr.questionNumber;
      if (!dist[qn]) dist[qn] = {};
      const ans = String(qr.response).trim();
      dist[qn][ans] = (dist[qn][ans] ?? 0) + 1;
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
function getStudentPerformanceData(
  studentResponses: any[],
  questionNumbers: number[],
  studentNameMap: Map<string, string>,
): Array<{ name: string; score: number; answers: Array<{ q: number; response: string; correct: boolean }> }> {
  if (!questionNumbers.length) return [];
  const qSet = new Set(questionNumbers);
  const result: Array<{ name: string; score: number; answers: Array<{ q: number; response: string; correct: boolean }> }> = [];

  for (const sr of studentResponses) {
    const name = studentNameMap.get(sr.studentId);
    if (!name) continue;
    const relevant = (sr.questionResponses ?? []).filter((qr: any) => qSet.has(qr.questionNumber));
    if (!relevant.length) continue;
    const correct = relevant.filter((qr: any) => qr.isCorrect).length;
    result.push({
      name,
      score: Math.round((correct / relevant.length) * 100) / 100,
      answers: relevant.map((qr: any) => ({ q: qr.questionNumber, response: qr.response, correct: qr.isCorrect })),
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
function getStudentGroups(
  studentResponses: any[],
  questionNumbers: number[],   // retained for API compat, no longer used for split
  studentNameMap: Map<string, string>,
  threshold = 0.6,
): { buildingUnderstanding: string[]; understoodConcept: string[] } {
  const buildingUnderstanding: string[] = [];
  const understoodConcept: string[] = [];

  for (const sr of studentResponses) {
    const name = studentNameMap.get(sr.studentId);
    if (!name) continue;
    const all = (sr.questionResponses ?? []) as any[];
    if (!all.length) continue;
    // Score = fraction of answered questions that are correct
    const score = all.filter((qr: any) => qr.isCorrect).length / all.length;
    if (score >= threshold) {
      understoodConcept.push(name);
    } else {
      buildingUnderstanding.push(name);
    }
  }

  const sortByName = (a: string, b: string) => {
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

function formatLabel(f: string): string {
  return (
    ({ whole_class: 'Whole class', split_class: 'Split class' } as Record<string, string>)[f] ?? f
  );
}

function buildNextSteps(
  misconceptions: any[],
  activitiesPerGroup: any[][],
  ppqQuestions: any[],
  learningScienceData: any,
  misconceptionExtras: Array<{
    ppqQuestions: any[];
    studentGroups: { buildingUnderstanding: string[]; understoodConcept: string[] };
    wrongAnswerExplanations: Array<{ answer: string; explanation: string }>;
    correctAnswerSolution: string[];
  }> = [],
  studentResponses: any[] = [],
): any[] {
  const questionErrorRates = (ppqQuestions ?? [])
    .filter((q: any) => q.questionNumber != null && q.classPercentCorrect != null)
    .sort((a: any, b: any) => a.questionNumber - b.questionNumber)
    .map((q: any) => ({
      label: `Q${q.questionNumber}`,
      errorRate: Math.round((1 - q.classPercentCorrect) * 100),
    }));

  const frameworkItems: any[] = learningScienceData?.standards ?? [];
  const normalize = (s: string) => s?.replace(/\s/g, '').toLowerCase() ?? '';

  const standardsDescMap = new Map<string, string>();
  for (const item of frameworkItems) {
    if (item.code) standardsDescMap.set(item.code, item.description);
    for (const rel of [...(item.prerequisiteStandards ?? []), ...(item.futureDependentStandards ?? [])]) {
      if (rel.code && !standardsDescMap.has(rel.code)) standardsDescMap.set(rel.code, rel.description);
    }
  }

  return misconceptions.map((m: any, i: number) => {
    const extras = misconceptionExtras[i] ?? {};
    const activityList: any[] = (activitiesPerGroup[i] ?? []).filter(Boolean);
    const frameworkItem = frameworkItems.find(
      (item: any) => normalize(item.code) === normalize(m.ccssStandard)
    );

    const prerequisiteGaps = m.prerequisiteGapCodes?.length
      ? m.prerequisiteGapCodes.map((code: string) => ({ standard: code, description: standardsDescMap.get(code) ?? '' }))
      : (frameworkItem?.prerequisiteStandards ?? []).map((r: any) => ({ standard: r.code, description: r.description }));

    const impactedObjectives = m.impactedObjectiveCodes?.length
      ? m.impactedObjectiveCodes.map((code: string) => ({ standard: code, description: standardsDescMap.get(code) ?? '' }))
      : (frameworkItem?.futureDependentStandards ?? []).map((r: any) => ({ standard: r.code, description: r.description }));

    const reach = computeMisconceptionReach(m.wrongAnswers, studentResponses);

    return {
      id: `nextstep-ai-${i + 1}`,
      // Positional `id` stays for UI compatibility; `sourceMisconceptionId` is the
      // stable join key back to the ingested misconception, so output can be paired
      // across runs whose titles the model reworded.
      sourceMisconceptionId: m.sourceMisconceptionId ?? null,
      title: m.title,
      // The model's own estimate. Deliberately kept alongside the computed count
      // rather than overwritten by it — the gap between the two is a calibration
      // signal worth scoring.
      frequency: m.frequency,
      // Counted from the response rows via the ingest-time option attribution.
      // null (not 0) when there was no attribution to count from.
      studentCount: reach.studentCount,
      studentPercent: reach.studentPercent,
      wrongAnswers: m.wrongAnswers ?? [],
      linkStatus: reach.linkStatus,
      isCore: m.isCore ?? false,
      occurrence: m.occurrence,
      example: m.example ?? null,
      misconceptionSummary: m.description,
      aiReasoning: m.aiReasoning ?? null,
      successIndicators: m.successIndicators ?? [],
      ccssStandards: {
        targetObjective: { standard: m.ccssStandard, description: standardsDescMap.get(m.ccssStandard) ?? frameworkItem?.description ?? '', learningComponents: (frameworkItem?.learningComponents ?? []).map((c: any) => c.description).filter(Boolean) },
        impactedObjectives,
        prerequisiteGaps,
      },
      evidence: m.evidence ?? null,
      questionErrorRates,
      ppqQuestions: extras.ppqQuestions ?? [],
      studentGroups: extras.studentGroups ?? { buildingUnderstanding: [], understoodConcept: [] },
      wrongAnswerExplanations: extras.wrongAnswerExplanations ?? [],
      correctAnswerSolution: extras.correctAnswerSolution ?? [],
      moveOptions: activityList.map((activity, j) => ({
        id: `nextstep-move-ai-${i + 1}-${j + 1}`,
        title: activity.title,
        time: `${activity.durationMinutes} min`,
        format: formatLabel(activity.format),
        activityStructure: activity.activityStructure ?? null,
        summary: activity.summary,
        targets: activity.targets ?? null,
        instructionalMove: activity.instructionalMove ?? null,
        strategyTag: activity.strategyTag ?? null,
        aiReasoning: activity.aiReasoning,
        tabs: activity.tabs ?? null,
      })),
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
function injectStudentsIntoGroups(
  activity: any,
  studentData: Array<{ name: string; score: number }>,
): any {
  const groups: any[] = activity?.tabs?.studentGroupings?.groups;
  if (!groups?.length || !studentData.length) return activity;

  // Sort students lowest score → highest score
  const sorted = [...studentData].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));

  // Divide students as evenly as possible across groups (lowest scores → first group)
  const n = groups.length;
  const base = Math.floor(sorted.length / n);
  const remainder = sorted.length % n;
  let offset = 0;
  const assigned = groups.map((_: any, i: number) => {
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
        groups: groups.map((g: any, i: number) => ({ ...g, students: assigned[i] ?? [] })),
      },
    },
  };
}

function parseJson(raw: any): any {
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

// ── Per-classroom pipeline ────────────────────────────────────────────────────

async function processClassroom(
  gql: GqlFn,
  classroom: any,
  nextStepExamples: any[],
  fixture?: Fixture,
): Promise<void> {
  const label = `${classroom.classroomName}`;

  let currentStub: any;
  let historyStubs: any[];
  let currentSession: any;
  let historySessions: any[];

  if (fixture) {
    // Fixture mode: the pilot session is read from disk instead of DynamoDB. The
    // rest of this function is unchanged, so the pipeline exercised here is the
    // same one that runs against the database.
    currentSession = fixture.currentSession;
    historySessions = fixture.historySessions;
    currentStub = currentSession;
    historyStubs = [];
    console.log(`  Fixture ${fixture.id} — ${currentSession.sessionLabel} (w${currentSession.weekNumber}), no database reads`);
  } else {
    // 2. List sessions
    process.stdout.write(`  Sessions...`);
    const sessionsData = await gql(SESSIONS_BY_CLASSROOM, { classroomId: classroom.id });
    const sessionStubs: any[] = sessionsData.sessionsByClassroomId?.items ?? [];
    if (!sessionStubs.length) {
      console.log(' — no sessions, skipping');
      return;
    }
    const sorted = [...sessionStubs].sort((a: any, b: any) => (a.weekNumber ?? 0) - (b.weekNumber ?? 0));
    currentStub = sorted[sorted.length - 1];
    historyStubs = sorted.slice(0, sorted.length - 1);
    console.log(` ✓  current: ${currentStub.sessionLabel}${historyStubs.length ? `, ${historyStubs.length} historical` : ''}`);

    // 3. Fetch full session details
    process.stdout.write(`  Session details...`);
    [currentSession, ...historySessions] = await Promise.all(
      [currentStub, ...historyStubs].map((s: any) =>
        gql(GET_SESSION, { id: s.id }).then((d: any) => d.getSession)
      )
    );
    console.log(' ✓');
  }

  const ppq = currentSession?.assessments?.items?.find((a: any) => a.type === 'PPQ');
  const allCcss: string[] = [
    ...new Set([
      ...(ppq?.ccssStandards ?? []),
      ...(currentSession?.ccssStandards ?? []),
    ])
  ].filter(Boolean);

  if (!allCcss.length) {
    console.log(`  ✗ No CCSS standards found — skipping`);
    return;
  }

  // 4. Learning science data
  //
  // This previously swallowed every failure with `.catch(() => ({ standards: [] }))`,
  // which is how a 404, three unresolved endpoint secrets and two 403s in May 2026
  // were recorded downstream as sessions that merely "had no learning science
  // context". A failed call and an empty result are different things and must stay
  // distinguishable.
  const capture: Capture = CAPTURE_ENABLED
    ? new RunCapture({
        classroomId: classroom.id,
        classroomName: classroom.classroomName ?? classroom.name ?? classroom.id,
        sessionId: currentStub.id,
        sessionLabel: currentStub.sessionLabel ?? `W${currentStub.weekNumber}`,
        amplifyEnv: AMPLIFY_ENV,
        condition: CONDITION,
      })
    : new NoopCapture();

  // Graph replay: the fixture stores the RAW Learning Commons response, so it can be
  // re-normalized with the current normalizer and yields the full modern field set.
  // Replaying removes the live API as a source of run-to-run variance, which matters
  // when the effect being measured is smaller than the noise floor.
  let learningScienceData: { standards: any[] };
  let unmatched: string[] = [];

  if (fixture && GRAPH_SOURCE === 'fixture') {
    const standards = await normalizeRawGraphItems(fixture.rawGraphItems);
    learningScienceData = { standards };
    console.log(`  Learning science (replayed from fixture) ✓  (${standards.length} standards)`);
    capture.recordCall(
      'graph-replay',
      { source: 'fixture', fixtureId: fixture.id, ccss: allCcss },
      { ok: true, matched: standards.length > 0, standards },
    );
  } else {
    process.stdout.write(`  Learning science (${allCcss.join(', ')})...`);
    const lsResults = await Promise.all(
      allCcss.map(async (ccss: string) => {
        const input = { ccss, sessionId: currentStub.id, trace: WANT_TRACE };
        const raw = await invokeLambda(`microcoachv2GetLearningScience-${AMPLIFY_ENV}`, { input });
        const parsed = parseJson(raw);
        capture.recordCall(`graph-${ccss.replace(/[^A-Za-z0-9.]/g, '')}`, input, parsed);
        if (parsed?.ok === false) {
          throw new Error(
            `Knowledge graph call failed for ${ccss}: ${parsed?.error?.message ?? 'unknown error'}`
          );
        }
        return { ccss, parsed };
      })
    );

    unmatched = lsResults.filter((r) => !(r.parsed?.standards?.length > 0)).map((r) => r.ccss);
    learningScienceData = {
      standards: lsResults.flatMap((r: any) => r.parsed?.standards ?? []),
    };
    console.log(` ✓  (${learningScienceData.standards.length} standards)`);
  }

  if (unmatched.length) {
    // Not fatal — the graph genuinely has no entry for some codes — but it must be
    // visible, because it silently changes what every downstream prompt receives.
    console.warn(`  ⚠ [LS] no graph match for: ${unmatched.join(', ')}`);
  }
  console.log(`  [LS] standards returned: ${learningScienceData.standards.length}`);
  for (const s of learningScienceData.standards) {
    console.log(`  [LS]   ${s.code}: ${s.prerequisiteStandards?.length ?? 0} prereqs, ${s.futureDependentStandards?.length ?? 0} future`);
    if (s.prerequisiteStandards?.length) console.log(`  [LS]     prereqs:`, s.prerequisiteStandards.map((r: any) => r.code));
    if (s.futureDependentStandards?.length) console.log(`  [LS]     future:`, s.futureDependentStandards.map((r: any) => r.code));
  }

  // 4b. Student responses — confidence stats + PPQ enrichment
  let augmentedPpq = ppq;
  let studentResponses: any[] = [];
  if (ppq?.id) {
    process.stdout.write(`  Student responses...`);
    try {
      const srData = fixture
        ? { studentResponsesByAssessmentId: { items: fixture.studentResponses } }
        : await gql(STUDENT_RESPONSES_BY_ASSESSMENT, { assessmentId: ppq.id });
      studentResponses = srData?.studentResponsesByAssessmentId?.items ?? [];
      const hasConfidence = studentResponses.some((sr: any) =>
        (sr.questionResponses ?? []).some((qr: any) => qr.confidence != null));
      if (hasConfidence) {
        const confidenceStats = computeConfidenceStats(studentResponses, ppq.questions ?? []);
        augmentedPpq = { ...ppq, confidenceStats };
        console.log(` ✓  (${studentResponses.length}, with confidence)`);
      } else {
        console.log(` ✓  (${studentResponses.length}, no confidence)`);
      }
    } catch (err) {
      console.log(` ✗ ${err} — continuing`);
    }
  }

  const studentNameMap = new Map<string, string>();
  for (const s of (classroom.students?.items ?? [])) {
    if (s.id && s.name) studentNameMap.set(s.id, s.name);
  }
  const wrongAnswerDist = computeWrongAnswerDist(studentResponses);

  // 5. Misconception analysis
  //
  // The snapshot is the unmasked payload and stays that way — graph-derived rubric
  // rows score against it, so masking it here would make a withheld condition score
  // zero by construction. `injected` is what the prompts actually receive.
  capture.writeSnapshot(learningScienceData);
  const injected = {
    standards: learningScienceData.standards.map((s: KgQueryType) => maskQuery(s, CONDITION)),
  };
  capture.writeInjected(injected);

  process.stdout.write(`  Misconception analysis...`);
  const analysisInput = {
    classroomData: JSON.stringify({
      classroom,
      currentSession,
      sessionHistory: historySessions,
      ppq: augmentedPpq,
      wrongAnswerDist,
    }),
    learningScienceData: JSON.stringify(injected),
    trace: WANT_TRACE,
  };
  const analysisResult = await invokeLambda(`microcoachv2LLMAnalysis-${AMPLIFY_ENV}`, {
    input: analysisInput,
  });
  const analysis = parseJson(analysisResult);
  capture.recordCall('llm-analysis', analysisInput, analysis);
  const misconceptions: any[] = analysis?.misconceptions ?? [];
  console.log(` ✓  ${misconceptions.length} misconceptions`);

  // 5c. Per-misconception extras
  const ppqQs = (ppq?.questions ?? []).map((q: any) => ({
    questionNumber: q.questionNumber,
    correctAnswer: q.correctAnswer ?? null,
    classPercentCorrect: q.classPercentCorrect ?? null,
  }));
  const misconceptionExtras = misconceptions.map((m: any) => {
    const qNums = parseQuestionNumbers(m.evidence?.source ?? '');
    return {
      ppqQuestions: ppqQs,
      studentGroups: getStudentGroups(studentResponses, qNums, studentNameMap),
      studentData: getStudentPerformanceData(studentResponses, qNums, studentNameMap),
      wrongAnswerExplanations: m.wrongAnswerExplanations ?? [],
      correctAnswerSolution: m.correctAnswerSolution ?? [],
    };
  });

  // 6. Generate next step activities
  // `grade` is deliberately excluded — see microcoachLLMAnalysis. The CCSS codes
  // carry grade already, and the classroom field was unvalidated free text.
  const classroomContext = { subject: classroom.subject, cohortSize: classroom.cohortSize };
  const NEXT_STEP_FORMATS = ['whole_class', 'split_class'];

  // 6a. Planning call — one cheap LLM call assigns diverse structures across all
  //     misconceptions before parallel generation begins.
  type StructurePlan = { misconceptionTitle: string; whole_class: string; split_class: string };
  let structurePlan: StructurePlan[] = [];
  process.stdout.write(`  Planning activity structures for ${misconceptions.length} misconceptions...`);
  try {
    const plannerInput = {
      planStructures: true,
      misconceptions: JSON.stringify(misconceptions.map((m: any) => ({ title: m.title, description: m.description, ccssStandard: m.ccssStandard }))),
      classroomContext: JSON.stringify(classroomContext),
      trace: WANT_TRACE,
    };
    const raw = await invokeLambda(`microcoachv2NextStepOption-${AMPLIFY_ENV}`, { input: plannerInput });
    // The planner used to return a bare array; it now returns an envelope carrying
    // `_trace` so its tokens land in the manifest. Accept both, because the deployed
    // Lambda may still be on the old contract.
    const parsed = parseJson(raw);
    const plannerResult = Array.isArray(parsed) ? { ok: true, assignments: parsed } : (parsed ?? { ok: false, assignments: [] });
    structurePlan = plannerResult.assignments ?? [];
    // Record the envelope, not the array — capture reads `_trace` off the output.
    capture.recordCall('planner', plannerInput, plannerResult);
    if (plannerResult.ok === false) {
      console.log(` ✗ planner failed (${plannerResult.error ?? 'unknown'}) — activities will generate without suggested structures`);
    }
    console.log(` ✓  ${structurePlan.length} assignments`);
  } catch (err) {
    console.warn(`\n  ⚠ Structure planning failed, generating without suggestions: ${err}`);
  }

  // Helper to look up a misconception's suggested structure for a given format
  const getSuggestedStructure = (title: string, fmt: string): string | null => {
    const plan = structurePlan.find(p => p.misconceptionTitle === title);
    return plan ? (plan as any)[fmt] ?? null : null;
  };

  // 6b. Generate activities — misconceptions in parallel, formats sequential within each
  const activitiesPerGroup: any[][] = await Promise.all(
    misconceptions.map(async (m: any, i: number) => {
      process.stdout.write(`  Next steps [${i + 1}/${misconceptions.length}]: ${m.title}...`);
      const relevant = nextStepExamples.filter(
        (ex: any) =>
          !ex.ccssStandards?.length ||
          ex.ccssStandards.some(
            (s: string) => s === m.ccssStandard || s.startsWith(m.ccssStandard?.split('.')[0])
          )
      );
      const baseInput = {
        misconception: JSON.stringify(m),
        learningScienceData: JSON.stringify(injected),
        classroomContext: JSON.stringify(classroomContext),
        ...(relevant.length > 0 && { contextData: JSON.stringify(relevant) }),
      };
      const sd = misconceptionExtras[i]?.studentData ?? [];
      const resultList: any[] = [];

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
          const activityInput = {
            ...baseInput,
            preferredFormat: fmt,
            trace: WANT_TRACE,
            ...(suggestedStructure && { suggestedStructure }),
            ...(existingActivities.length > 0 && { existingActivities: JSON.stringify(existingActivities) }),
          };
          const raw = await invokeLambda(`microcoachv2NextStepOption-${AMPLIFY_ENV}`, { input: activityInput });
          const parsed = parseJson(raw);
          capture.recordCall(`activity-${i + 1}-${fmt}`, activityInput, parsed);
          resultList.push(injectStudentsIntoGroups(parsed, sd));
        } catch (err) {
          console.error(`\n    ✗ format=${fmt}: ${err}`);
        }
      }

      console.log(` ✓  ${resultList.length} activities`);
      return resultList;
    })
  );

  // 7. Build + save
  // `injected`, not the snapshot: output.json is the artifact under test and must
  // reflect what the pipeline actually had. Scoring reads ground truth from
  // kg-snapshot.json separately.
  const nextSteps = buildNextSteps(misconceptions, activitiesPerGroup, ppq?.questions, injected, misconceptionExtras, studentResponses);
  if (fixture) {
    // Fixture runs never write. The pilot sessions are a measurement substrate, and
    // writing generated output back would overwrite the very records the fixture was
    // extracted from. Everything lands in the run directory instead.
    console.log(`  Fixture run — no database writes (output captured to disk)`);
  } else {
    process.stdout.write(`  Saving ${nextSteps.length} next steps to session ${currentStub.id}...`);
    await gql(UPDATE_SESSION, {
      input: {
        id: currentStub.id,
        pregeneratedNextSteps: JSON.stringify(nextSteps),
        status: 'generated',
      },
    });
    console.log(' ✓');

    // Write the computed counts back onto the Misconception rows. These columns have
    // existed since the model was defined and were never populated, which is why the
    // UI's intervention cards have always read zero. `sourceMisconceptionId` is the
    // join key; a next step the model reported as genuinely new has none and is
    // skipped rather than guessed at.
    const withCounts = nextSteps.filter(
      (n: any) => n.sourceMisconceptionId && n.studentCount != null,
    );
    if (withCounts.length) {
      process.stdout.write(`  Updating student counts on ${withCounts.length} misconception(s)...`);
      for (const n of withCounts) {
        await gql(UPDATE_MISCONCEPTION, {
          input: {
            id: n.sourceMisconceptionId,
            studentCount: n.studentCount,
            studentPercent: n.studentPercent,
          },
        });
      }
      console.log(' ✓');
    }

    process.stdout.write(`  Setting currentWeek to ${currentStub.weekNumber}...`);
    await gql(UPDATE_CLASSROOM_WEEK, { input: { id: classroom.id, currentWeek: currentStub.weekNumber } });
    console.log(' ✓');
  }

  // 8. Capture — disk only, never AppSync.
  capture.writeOutput(nextSteps);
  const manifest = capture.finish({
    ccssRequested: allCcss,
    ccssUnmatched: unmatched,
    graphStandardsReturned: learningScienceData.standards.length,
    misconceptionCount: misconceptions.length,
    activityCount: activitiesPerGroup.reduce((n: number, g: any[]) => n + g.length, 0),
    // Diagnostic, not a correction: when the analysis stage emits a code the graph
    // does not carry, the generation stage silently loses all graph context.
    targetStandardMatched: misconceptions.filter((m: any) =>
      learningScienceData.standards.some(
        (s: any) => (s.code ?? '').replace(/\s/g, '').toLowerCase()
                 === (m.ccssStandard ?? '').replace(/\s/g, '').toLowerCase()
      )
    ).length,
    // A run where the model failed to link its output back to the ingested
    // misconceptions is not comparable to one where the link held, so the count
    // has to be visible in the manifest rather than inferred later from output.json.
    sourceMisconceptionMatched: (() => {
      const sourceIds = new Set(
        (currentSession?.misconceptions?.items ?? []).map((m: any) => m.id)
      );
      return misconceptions.filter((m: any) => sourceIds.has(m.sourceMisconceptionId)).length;
    })(),
    sourceMisconceptionAvailable: (currentSession?.misconceptions?.items ?? []).length,
    // A run where the option attribution never arrived is not comparable to one
    // where it did, so the counting chain's health goes in the manifest rather than
    // being inferred from output.json later.
    wrongAnswerLinked: nextSteps.filter((n: any) => n.linkStatus === 'linked').length,
    wrongAnswerRefs: nextSteps.reduce((n: number, s: any) => n + (s.wrongAnswers?.length ?? 0), 0),
    studentCountTotals: nextSteps.map((n: any) => ({
      id: n.id, title: n.title, studentCount: n.studentCount, studentPercent: n.studentPercent,
      frequency: n.frequency,
    })),
  });
  if (manifest) {
    const t = manifest.tokens;
    console.log(`  Captured → eval/runs/${manifest.runId}`);
    console.log(`    ${manifest.modelCalls} calls · ${t.total.toLocaleString()} tokens · models: ${manifest.models.join(', ')}`);
    console.log(`    targetStandard matched on ${manifest.targetStandardMatched}/${manifest.misconceptionCount} misconceptions`);
    console.log(`    sourceMisconceptionId linked on ${manifest.sourceMisconceptionMatched}/${manifest.misconceptionCount} (${manifest.sourceMisconceptionAvailable} ingested)`);
    console.log(`    wrong-answer attribution on ${manifest.wrongAnswerLinked}/${manifest.misconceptionCount} (${manifest.wrongAnswerRefs} option refs)`);
    for (const s of manifest.studentCountTotals) {
      const n = s.studentCount == null ? 'not linked' : `${s.studentCount} students (${Math.round((s.studentPercent ?? 0) * 100)}%)`;
      console.log(`      ${s.title}: ${n} · model said "${s.frequency}"`);
    }
    if (manifest.silentFallbacks.length) {
      console.log(`    ⚠ ${manifest.silentFallbacks.length} silent validator fallback(s) — see manifest.json`);
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Microcoach Next Step Generator ===\n');

  const gql: GqlFn = await createGqlClient();

  // ── Fixture mode ──────────────────────────────────────────────────────────
  // Runs against the four March 2026 pilot sessions held in eval/fixtures. Reads
  // nothing from and writes nothing to DynamoDB; the only remote calls are to the
  // LLM Lambdas (and the graph Lambda when --graph live is set).
  if (FIXTURE_ARG) {
    // Exactly one session per invocation. `yarn eval` decides which sessions run and
    // spawns one process each, so session selection lives there rather than in two
    // places that could disagree.
    const ids = [FIXTURE_ARG];
    console.log(`Fixture: ${FIXTURE_ARG}, graph=${GRAPH_SOURCE}, condition=${CONDITION}`);
    console.log('No database reads or writes will occur.\n');

    // Reference examples still come from the DB — they are shared library content,
    // not session data, and the pilot ran with whatever was there.
    process.stdout.write('Fetching next step examples...');
    const nextStepData = await gql(LIST_CONTEXT_DATA, {
      filter: { type: { eq: 'NEXT_STEP_LESSON' } },
      limit: 20,
    });
    const nextStepExamples: any[] = nextStepData.listContextData?.items ?? [];
    console.log(` ✓  ${nextStepExamples.length} examples\n`);

    for (const id of ids) {
      const fixture = loadFixture(id);
      console.log(`── ${fixture.classroom.classroomName} · fixture ${fixture.id} ──`);
      try {
        await processClassroom(gql, fixture.classroom, nextStepExamples, fixture);
      } catch (err) {
        console.error(`  ✗ Failed: ${err}`);
      }
      console.log();
    }
    console.log('=== Done ===');
    return;
  }

  // 1. Fetch all classrooms
  process.stdout.write('Fetching classrooms...');
  const classroomsData = await gql(LIST_CLASSROOMS);
  let classrooms: any[] = classroomsData.listClassrooms?.items ?? [];
  if (!classrooms.length) throw new Error('No classrooms found');
  console.log(` ✓  ${classrooms.length} classroom(s)`);

  // `--classroom <name-or-id>` runs one classroom instead of all of them. A full
  // sweep is ~50 model calls per classroom, so this keeps iteration cheap.
  const ci = process.argv.indexOf('--classroom');
  if (ci > -1 && process.argv[ci + 1]) {
    const want = process.argv[ci + 1].toLowerCase();
    const before = classrooms.length;
    classrooms = classrooms.filter(
      (c) => c.id === process.argv[ci + 1] || (c.classroomName ?? '').toLowerCase().includes(want)
    );
    if (!classrooms.length) {
      throw new Error(
        `No classroom matched "${process.argv[ci + 1]}". Available: ` +
          (classroomsData.listClassrooms?.items ?? []).map((c: any) => c.classroomName).join(', ')
      );
    }
    console.log(`  ↳ filtered to ${classrooms.length} of ${before}: ${classrooms.map((c: any) => c.classroomName).join(', ')}`);
  }

  // 2. Fetch shared next step examples once (used by all classrooms)
  process.stdout.write('Fetching next step examples...');
  const nextStepData = await gql(LIST_CONTEXT_DATA, {
    filter: { type: { eq: 'NEXT_STEP_LESSON' } },
    limit: 20,
  });
  const nextStepExamples: any[] = nextStepData.listContextData?.items ?? [];
  console.log(` ✓  ${nextStepExamples.length} examples\n`);

  // 3. Process each classroom sequentially
  for (const classroom of classrooms) {
    console.log(`── ${classroom.classroomName} ──`);
    try {
      await processClassroom(gql, classroom, nextStepExamples);
    } catch (err) {
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
