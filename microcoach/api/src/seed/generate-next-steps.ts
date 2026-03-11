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

async function processClassroom(gql: GqlFn, classroom: any, nextStepExamples: any[]): Promise<void> {
  const label = `${classroom.classroomName} (grade ${classroom.grade})`;

  // 2. List sessions
  process.stdout.write(`  Sessions...`);
  const sessionsData = await gql(SESSIONS_BY_CLASSROOM, { classroomId: classroom.id });
  const sessionStubs: any[] = sessionsData.sessionsByClassroomId?.items ?? [];
  if (!sessionStubs.length) {
    console.log(' — no sessions, skipping');
    return;
  }
  const sorted = [...sessionStubs].sort((a: any, b: any) => (a.weekNumber ?? 0) - (b.weekNumber ?? 0));
  const currentStub = sorted[sorted.length - 1];
  const historyStubs = sorted.slice(0, sorted.length - 1);
  console.log(` ✓  current: ${currentStub.sessionLabel}${historyStubs.length ? `, ${historyStubs.length} historical` : ''}`);

  // 3. Fetch full session details
  process.stdout.write(`  Session details...`);
  const [currentSession, ...historySessions] = await Promise.all(
    [currentStub, ...historyStubs].map((s: any) =>
      gql(GET_SESSION, { id: s.id }).then((d: any) => d.getSession)
    )
  );
  console.log(' ✓');

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
  process.stdout.write(`  Learning science (${allCcss.join(', ')})...`);
  const lsResults = await Promise.all(
    allCcss.map((ccss: string) =>
      invokeLambda(`microcoachGetLearningScience-${AMPLIFY_ENV}`, { input: { ccss } })
        .then((r: any) => parseJson(r))
        .catch(() => ({ standards: [] }))
    )
  );
  const learningScienceData = {
    standards: lsResults.flatMap((r: any) => r?.standards ?? []),
  };
  console.log(` ✓  (${learningScienceData.standards.length} standards)`);
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
      const srData = await gql(STUDENT_RESPONSES_BY_ASSESSMENT, { assessmentId: ppq.id });
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
  const classroomContext = { grade: classroom.grade, subject: classroom.subject, cohortSize: classroom.cohortSize };
  const NEXT_STEP_FORMATS = ['whole_class', 'split_class'];

  // 6a. Planning call — one cheap LLM call assigns diverse structures across all
  //     misconceptions before parallel generation begins.
  type StructurePlan = { misconceptionTitle: string; whole_class: string; split_class: string };
  let structurePlan: StructurePlan[] = [];
  process.stdout.write(`  Planning activity structures for ${misconceptions.length} misconceptions...`);
  try {
    const raw = await invokeLambda(`microcoachNextStepOption-${AMPLIFY_ENV}`, {
      input: {
        planStructures: true,
        misconceptions: JSON.stringify(misconceptions.map((m: any) => ({ title: m.title, description: m.description, ccssStandard: m.ccssStandard }))),
        classroomContext: JSON.stringify(classroomContext),
      },
    });
    structurePlan = parseJson(raw) ?? [];
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
        learningScienceData: JSON.stringify(learningScienceData),
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
        } catch (err) {
          console.error(`\n    ✗ format=${fmt}: ${err}`);
        }
      }

      console.log(` ✓  ${resultList.length} activities`);
      return resultList;
    })
  );

  // 7. Build + save
  const nextSteps = buildNextSteps(misconceptions, activitiesPerGroup, ppq?.questions, learningScienceData, misconceptionExtras);
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
  console.log('=== Microcoach Next Step Generator ===\n');

  const gql: GqlFn = await createGqlClient();

  // 1. Fetch all classrooms
  process.stdout.write('Fetching classrooms...');
  const classroomsData = await gql(LIST_CLASSROOMS);
  const classrooms: any[] = classroomsData.listClassrooms?.items ?? [];
  if (!classrooms.length) throw new Error('No classrooms found');
  console.log(` ✓  ${classrooms.length} classroom(s)`);

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
    console.log(`── ${classroom.classroomName} (grade ${classroom.grade}) ──`);
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
