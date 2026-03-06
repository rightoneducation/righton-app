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

import { createGqlClient, GqlFn } from './appsync-config';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const AMPLIFY_ENV = process.env.AMPLIFY_ENV ?? 'dev';

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
 * Split students into two groups for a given set of question numbers:
 *   buildingUnderstanding — got at least one question wrong (sorted by wrong count desc, then alpha)
 *   understoodConcept     — got all relevant questions correct (sorted alphabetically)
 * Students with no responses for these questions are excluded.
 */
function getStudentGroups(
  studentResponses: any[],
  questionNumbers: number[],
  studentNameMap: Map<string, string>,
): { buildingUnderstanding: string[]; understoodConcept: string[] } {
  if (!questionNumbers.length) return { buildingUnderstanding: [], understoodConcept: [] };
  const qSet = new Set(questionNumbers);
  const wrongCount = new Map<string, number>();
  const correctOnly = new Set<string>();

  for (const sr of studentResponses) {
    const name = studentNameMap.get(sr.studentId);
    if (!name) continue;
    const relevant = (sr.questionResponses ?? []).filter((qr: any) => qSet.has(qr.questionNumber));
    if (!relevant.length) continue;
    const wrongs = relevant.filter((qr: any) => !qr.isCorrect).length;
    if (wrongs > 0) {
      wrongCount.set(name, (wrongCount.get(name) ?? 0) + wrongs);
    } else {
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

function formatLabel(f: string): string {
  return (
    ({ small_group: 'Small groups', whole_class: 'Whole class', individual: 'Individual' } as Record<string, string>)[f] ?? f
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

    return {
      id: `nextstep-ai-${i + 1}`,
      title: m.title,
      frequency: m.frequency,
      isCore: m.isCore ?? false,
      occurrence: m.occurrence,
      example: m.example ?? null,
      misconceptionSummary: m.description,
      aiReasoning: m.aiReasoning ?? null,
      successIndicators: m.successIndicators ?? [],
      ccssStandards: {
        targetObjective: { standard: m.ccssStandard, description: m.description },
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

function parseJson(raw: any): any {
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Microcoach Next Step Generator ===\n');

  const gql: GqlFn = await createGqlClient();

  // 1. Find grade 6 classroom
  process.stdout.write('Fetching classrooms...');
  const classroomsData = await gql(LIST_CLASSROOMS);
  const classrooms: any[] = classroomsData.listClassrooms?.items ?? [];
  const gr6 = classrooms.find((c: any) => c.grade === 6);
  if (!gr6) throw new Error('No grade 6 classroom found');
  console.log(` ✓  ${gr6.classroomName} (id: ${gr6.id})`);

  // 2. List sessions
  process.stdout.write('Fetching sessions...');
  const sessionsData = await gql(SESSIONS_BY_CLASSROOM, { classroomId: gr6.id });
  const sessionStubs: any[] = sessionsData.sessionsByClassroomId?.items ?? [];
  if (!sessionStubs.length) throw new Error('No sessions found for this classroom');
  const sorted = [...sessionStubs].sort((a: any, b: any) => (a.weekNumber ?? 0) - (b.weekNumber ?? 0));
  const currentStub = sorted[sorted.length - 1];
  const historyStubs = sorted.slice(0, sorted.length - 1);
  const historyNote = historyStubs.length ? `, ${historyStubs.length} historical` : ', no historical data (week 1)';
  console.log(` ✓  ${sessionStubs.length} session(s), current: ${currentStub.sessionLabel}${historyNote}`);

  // 3. Fetch full session details
  process.stdout.write('Fetching session details...');
  const [currentSession, ...historySessions] = await Promise.all(
    [currentStub, ...historyStubs].map((s: any) =>
      gql(GET_SESSION, { id: s.id }).then((d: any) => d.getSession)
    )
  );
  console.log(' ✓');

  const ppq = currentSession?.assessments?.items?.find((a: any) => a.type === 'PPQ');
  const ccss = ppq?.ccssStandards?.[0] ?? currentSession?.ccssStandards?.[0];
  if (!ccss) throw new Error('No CCSS standard found in current session');

  // 4. Learning science data (direct Lambda — bypasses AppSync 30s timeout)
  process.stdout.write(`Fetching learning science data for ${ccss}...`);
  const lsResult = await invokeLambda(`microcoachGetLearningScience-${AMPLIFY_ENV}`, { input: { ccss } });
  const learningScienceData = parseJson(lsResult);
  console.log(' ✓');

  // 4b. Fetch student responses — used for confidence stats and PPQ enrichment
  let augmentedPpq = ppq;
  let studentResponses: any[] = [];
  if (ppq?.id) {
    process.stdout.write('Fetching student responses...');
    try {
      const srData = await gql(STUDENT_RESPONSES_BY_ASSESSMENT, { assessmentId: ppq.id });
      studentResponses = srData?.studentResponsesByAssessmentId?.items ?? [];
      const hasConfidence = studentResponses.some((sr: any) =>
        (sr.questionResponses ?? []).some((qr: any) => qr.confidence != null));
      if (hasConfidence) {
        const confidenceStats = computeConfidenceStats(studentResponses, ppq.questions ?? []);
        augmentedPpq = { ...ppq, confidenceStats };
        console.log(` ✓  (${studentResponses.length} responses, with confidence data)`);
      } else {
        console.log(` ✓  (${studentResponses.length} responses, no confidence data)`);
      }
    } catch (err) {
      console.log(` ✗ (${err}) — continuing without student responses`);
    }
  }

  // Build student name map from classroom students (fetched in step 1)
  const studentNameMap = new Map<string, string>();
  for (const s of (gr6.students?.items ?? [])) {
    if (s.id && s.name) studentNameMap.set(s.id, s.name);
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
  const misconceptions: any[] = analysis?.misconceptions ?? [];
  console.log(` ✓  ${misconceptions.length} misconceptions identified`);

  // 5b. Build per-misconception extras: ppqQuestions and affectedStudents computed locally;
  //     wrongAnswerExplanations come back from the analysis Lambda (no direct OpenAI calls here).
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
      wrongAnswerExplanations: m.wrongAnswerExplanations ?? [],
      correctAnswerSolution: m.correctAnswerSolution ?? [],
    };
  });
  console.log(`Enriched ${misconceptionExtras.length} misconceptions with PPQ data`);

  // 6. Next step examples
  process.stdout.write('Fetching next step examples...');
  const nextStepData = await gql(LIST_CONTEXT_DATA, {
    filter: { type: { eq: 'NEXT_STEP_LESSON' } },
    limit: 20,
  });
  const nextStepExamples: any[] = nextStepData.listContextData?.items ?? [];
  console.log(` ✓  ${nextStepExamples.length} examples`);

  // 7. Generate next step options — one dedicated Lambda call per format per misconception.
  //    Each call generates ONE activity grounded in the knowledge graph and misconception data.
  //    Calls per misconception run in parallel; all misconceptions run in parallel.
  const classroomContext = { grade: gr6.grade, subject: gr6.subject, cohortSize: gr6.cohortSize };
  const NEXT_STEP_FORMATS = ['small_group', 'whole_class'];

  const activitiesPerGroup: any[][] = await Promise.all(
    misconceptions.map(async (m: any, i: number) => {
      process.stdout.write(`Generating next steps [${i + 1}/${misconceptions.length}]: ${m.title}...`);
      const relevant = nextStepExamples.filter(
        (ex: any) =>
          !ex.ccssStandards?.length ||
          ex.ccssStandards.some(
            (s: string) => s === m.ccssStandard || s.startsWith(m.ccssStandard?.split('.')[0])
          )
      );
      const baseInput = {
        misconception: JSON.stringify(m),
        learningScienceData: JSON.stringify(learningScienceData),
        classroomContext: JSON.stringify(classroomContext),
        ...(relevant.length > 0 && { contextData: JSON.stringify(relevant) }),
      };
      const results = await Promise.all(
        NEXT_STEP_FORMATS.map(async (fmt) => {
          try {
            const raw = await invokeLambda(`microcoachNextStepOption-${AMPLIFY_ENV}`, {
              input: { ...baseInput, preferredFormat: fmt },
            });
            return parseJson(raw);
          } catch (err) {
            console.error(`\n  ✗ format=${fmt} for ${m.title}: ${err}`);
            return null;
          }
        })
      );
      const resultList = results.filter(Boolean);
      console.log(` ✓  ${resultList.length} activities`);
      return resultList;
    })
  );

  // 8. Build next steps
  const nextSteps = buildNextSteps(misconceptions, activitiesPerGroup, ppq?.questions, learningScienceData, misconceptionExtras);
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
