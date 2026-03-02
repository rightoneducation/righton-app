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

import { createGqlClient, GqlFn } from './appsync-config';

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

function priorityLabel(p: string): string {
  return ({ '1': 'Critical', '2': 'High', '3': 'Medium', '4': 'Low' } as Record<string, string>)[p] ?? 'Medium';
}

function occurrenceLabel(o: string): string {
  return o === 'recurring' ? 'Recurring' : '1st occurrence';
}

function formatLabel(f: string): string {
  return (
    ({ small_group: 'Small groups', whole_class: 'Whole class', individual: 'Individual' } as Record<string, string>)[f] ?? f
  );
}

function buildGapGroups(
  misconceptions: any[],
  activities: any[],
  ppqQuestions: any[],
  learningScienceData: any
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
    const activity = activities[i];
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
      id: `gapgroup-ai-${i + 1}`,
      title: m.title,
      priority: priorityLabel(m.priority),
      studentCount: m.studentCount ?? 0,
      studentPercent: Math.round((m.studentPercent ?? 0) * 100),
      occurrence: occurrenceLabel(m.occurrence),
      misconceptionSummary: m.description,
      successIndicators: m.successIndicators ?? [],
      ccssStandards: {
        targetObjective: { standard: m.ccssStandard, description: m.description },
        impactedObjectives,
        prerequisiteGaps,
      },
      evidence: m.evidence ?? null,
      questionErrorRates,
      move: activity
        ? {
            id: `move-ai-${i + 1}`,
            title: activity.title,
            time: `${activity.durationMinutes} min`,
            format: formatLabel(activity.format),
            summary: activity.summary,
            aiReasoning: activity.aiReasoning,
            tabs: activity.tabs ?? null,
          }
        : null,
    };
  });
}

function parseJson(raw: any): any {
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Microcoach Gap Group Generator ===\n');

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
  console.log(` ✓  ${sessionStubs.length} sessions, current: ${currentStub.sessionLabel}`);

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
  const misconceptions: any[] = analysis?.misconceptions ?? [];
  console.log(` ✓  ${misconceptions.length} misconceptions identified`);

  // 6. RTD examples
  process.stdout.write('Fetching RTD examples...');
  const rtdData = await gql(LIST_CONTEXT_DATA, {
    filter: { type: { eq: 'RTD_LESSON' } },
    limit: 20,
  });
  const rtdExamples: any[] = rtdData.listContextData?.items ?? [];
  console.log(` ✓  ${rtdExamples.length} examples`);

  // 7. Generate RTDs (LLM, one per misconception)
  const classroomContext = { grade: gr6.grade, subject: gr6.subject, cohortSize: gr6.cohortSize };
  const activities: any[] = await Promise.all(
    misconceptions.map(async (m: any, i: number) => {
      process.stdout.write(`Generating RTD [${i + 1}/${misconceptions.length}]: ${m.title}...`);
      const relevant = rtdExamples.filter(
        (ex: any) =>
          !ex.ccssStandards?.length ||
          ex.ccssStandards.some(
            (s: string) => s === m.ccssStandard || s.startsWith(m.ccssStandard?.split('.')[0])
          )
      );
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
      } catch (err) {
        console.log(` ✗ (${err})`);
        return null;
      }
    })
  );

  // 8. Build gap groups
  const gapGroups = buildGapGroups(misconceptions, activities, ppq?.questions, learningScienceData);
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
