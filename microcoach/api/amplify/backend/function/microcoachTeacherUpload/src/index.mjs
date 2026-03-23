/**
 * microcoachTeacherUpload Lambda
 *
 * Consolidates the ingest → upload → generate pipeline into a single Lambda.
 * Uses self-invoke async pattern to work around AppSync's 30s resolver timeout.
 *
 * Flow mirrors the CLI scripts exactly:
 *   1. Ingest (yarn ingest): docx → LLM → misconceptions
 *   2. Upload (yarn upload): xlsx + misconceptions → DB
 *      a. Parse xlsx
 *      b. Upload students
 *      c. Create session
 *      d. Create PPQ assessment + student responses
 *      e. Link assessment to session
 *      f. Upload misconceptions + stub activities
 *      g. Create ContextData
 *   3. Generate (yarn generate): DB → pregeneratedNextSteps (short-circuited for now)
 *   4. Send completion email
 */

import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import mammoth from 'mammoth';
import { createGqlClient } from './util/appsync-client.mjs';
import { parseExcelBuffer, deriveTopic } from './util/parse-excel.mjs';
import { sendEmail } from './util/send-email.mjs';
import {
  GET_CLASSROOM,
  CREATE_STUDENT,
  CREATE_SESSION,
  UPDATE_SESSION,
  CREATE_ASSESSMENT,
  CREATE_STUDENT_RESPONSE,
  CREATE_MISCONCEPTION,
  CREATE_ACTIVITY,
  CREATE_CONTEXT_DATA,
  SESSIONS_BY_CLASSROOM,
  GET_SESSION,
  LIST_CONTEXT_DATA,
  STUDENT_RESPONSES_BY_ASSESSMENT,
  UPDATE_CLASSROOM_WEEK,
  INGEST_PPQ,
} from './util/graphql.mjs';

const AMPLIFY_ENV = process.env.ENV || 'dev';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Lambda invocation helper (from generate-next-steps.ts:20-33) ────────────

async function invokeLambda(functionName, payload) {
  const client = new LambdaClient({ region: process.env.REGION || 'us-east-1' });
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
  return JSON.parse(Buffer.from(resp.Payload).toString('utf8'));
}

// ── Upload helpers (from upload.ts — identical logic) ───────────────────────

async function uploadStudents(gql, classroomId, students) {
  const created = [];
  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    const studentName = s.name || `Student ${i + 1}`;
    const externalId = s.externalId || `S${String(i + 1).padStart(3, '0')}`;
    console.log(`    Creating students [${i + 1}/${students.length}]  ${studentName}`);
    const confValues = s.questionResponses
      .map((qr) => qr.confidence)
      .filter((c) => c != null && c >= 1 && c <= 5);
    const avgConfidence =
      confValues.length > 0
        ? parseFloat((confValues.reduce((sum, c) => sum + c, 0) / confValues.length).toFixed(1))
        : 0;

    const data = await gql(CREATE_STUDENT, {
      input: {
        classroomId,
        classroomStudentsId: classroomId,
        name: studentName,
        externalId,
        confidenceLevel: avgConfidence || 0,
        status: 'active',
      },
    });
    created.push({ id: data.createStudent.id, name: studentName, externalId, classroomId });
    await sleep(50);
  }
  console.log(`  ✓ ${created.length} students created`);
  return created;
}

async function uploadSession(gql, classroomId, sessionLabel, weekNumber, topic, ccssStandards) {
  console.log(`    Creating session: ${sessionLabel}...`);
  const data = await gql(CREATE_SESSION, {
    input: {
      classroomId,
      classroomSessionsId: classroomId,
      sessionLabel,
      weekNumber,
      topic,
      ccssStandards,
      status: 'completed',
    },
  });
  const session = data.createSession;
  console.log(`  ✓ Session created: ${session.id}`);
  return session;
}

async function uploadAssessment(gql, classroomId, sessionId, parsed, type, sourceAssessmentId) {
  console.log(`    Creating ${type} assessment (${parsed.questionMeta.length} questions)...`);
  const input = {
    classroomId,
    sessionId,
    sessionAssessmentsId: sessionId,
    assessmentCode: parsed.assessmentCode || `${type}_UNKNOWN`,
    type,
    weekNumber: parsed.weekNumber || 0,
    topic: parsed.topic,
    ccssStandards: parsed.ccssStandards,
    classPercentCorrect: parsed.classPercentCorrect,
    questions: parsed.questionMeta.map((q) => ({
      questionNumber: q.questionNumber,
      questionType: 'MC',
      correctAnswer: q.correctAnswer,
      pointValue: 1,
      ccssStandard: q.ccssStandard,
      classPercentCorrect: q.classPercentCorrect,
    })),
  };
  if (sourceAssessmentId) input.sourceAssessmentId = sourceAssessmentId;

  const data = await gql(CREATE_ASSESSMENT, { input });
  const assessment = data.createAssessment;
  console.log(`  ✓ ${type} assessment created: ${assessment.id}`);
  return assessment;
}

async function uploadStudentResponses(gql, label, assessmentId, students, studentMap) {
  let count = 0;
  let skipped = 0;

  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    console.log(`    Uploading ${label} responses [${i + 1}/${students.length}]`);

    const studentId = studentMap.get(s.externalId);
    if (!studentId) {
      skipped++;
      await sleep(10);
      continue;
    }

    await gql(CREATE_STUDENT_RESPONSE, {
      input: {
        assessmentId,
        assessmentStudentResponsesId: assessmentId,
        studentId,
        totalScore: s.totalScore,
        questionResponses: s.questionResponses.map((qr) => ({
          questionNumber: qr.questionNumber,
          response: qr.response,
          isCorrect: qr.isCorrect,
          pointsEarned: qr.pointsEarned,
          confidence: qr.confidence ?? null,
        })),
      },
    });
    count++;
    await sleep(50);
  }

  const skipNote = skipped > 0 ? `  (${skipped} skipped — not in PPQ roster)` : '';
  console.log(`  ✓ ${count} ${label} responses uploaded${skipNote}`);
  return count;
}

async function uploadMisconceptions(gql, classroomId, sessionId, misconceptions) {
  const created = [];

  for (let i = 0; i < misconceptions.length; i++) {
    const m = misconceptions[i];
    console.log(`    Creating misconception [${i + 1}/${misconceptions.length}]  ${m.title}`);

    const data = await gql(CREATE_MISCONCEPTION, {
      input: {
        classroomId,
        sessionId,
        sessionMisconceptionsId: sessionId,
        ccssStandard: m.ccssStandard,
        title: m.title,
        description: m.description,
        severity: m.severity,
        priority: m.priority,
        occurrence: m.occurrence,
        successIndicators: m.successIndicators,
      },
    });
    const misconception = data.createMisconception;
    created.push({ id: misconception.id, sessionId, classroomId });

    // Stub Activity for each Misconception
    await gql(CREATE_ACTIVITY, {
      input: {
        misconceptionId: misconception.id,
        misconceptionActivitiesId: misconception.id,
        classroomId,
        sessionId,
        type: 'NEXT_STEP',
        status: 'GENERATED',
        title: `Next Step: ${m.title}`,
        summary: `AI-generated next step activity targeting the misconception: ${m.title}`,
        aiGenerated: true,
        format: 'small_group',
      },
    });
    await sleep(100);
  }

  console.log(`  ✓ ${created.length} misconceptions + ${created.length} activities created`);
  return created;
}

async function uploadContextData(gql, title, gradeLevel, ccssStandards, weekNumber, isReference, assessmentCode) {
  const tag = isReference ? '[REF]' : '[CLS]';
  console.log(`    Creating ContextData ${tag} "${title}"...`);

  await gql(CREATE_CONTEXT_DATA, {
    input: {
      type: 'NEXT_STEP_LESSON',
      title,
      gradeLevel,
      weekNumber,
      ccssStandards,
      assessmentCode,
      isReference,
      nextStepLesson: {
        targetAssessmentCode: assessmentCode ?? 'REFERENCE',
        topic: deriveTopic(ccssStandards[0] ?? ''),
        targetProblem: 'See source document',
      },
    },
  });
  console.log(`  ✓ ContextData created`);
  await sleep(100);
}

// ── Generate pipeline helpers (from generate-next-steps.ts — identical logic) ─

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
    avgConfidence: s.countConf > 0 ? parseFloat((s.totalConf / s.countConf).toFixed(2)) : null,
    avgConfidenceCorrect: s.countConfCorrect > 0 ? parseFloat((s.totalConfCorrect / s.countConfCorrect).toFixed(2)) : null,
    avgConfidenceIncorrect: s.countConfIncorrect > 0 ? parseFloat((s.totalConfIncorrect / s.countConfIncorrect).toFixed(2)) : null,
    highConfWrongPct: s.totalHighConf > 0 ? parseFloat((s.highConfWrong / s.totalHighConf).toFixed(3)) : null,
  }));
}

function parseQuestionNumbers(source) {
  const matches = (source ?? '').matchAll(/Q(\d+)/gi);
  const nums = new Set();
  for (const m of matches) nums.add(parseInt(m[1], 10));
  return [...nums].sort((a, b) => a - b);
}

function computeWrongAnswerDist(studentResponses) {
  const dist = {};
  for (const sr of studentResponses) {
    for (const qr of (sr.questionResponses ?? [])) {
      if (qr.isCorrect || qr.response == null) continue;
      const qn = qr.questionNumber;
      if (!dist[qn]) dist[qn] = {};
      const ans = String(qr.response).trim();
      dist[qn][ans] = (dist[qn][ans] ?? 0) + 1;
    }
  }
  return dist;
}

function getStudentPerformanceData(studentResponses, questionNumbers, studentNameMap) {
  if (!questionNumbers.length) return [];
  const qSet = new Set(questionNumbers);
  const result = [];
  for (const sr of studentResponses) {
    const name = studentNameMap.get(sr.studentId);
    if (!name) continue;
    const relevant = (sr.questionResponses ?? []).filter((qr) => qSet.has(qr.questionNumber));
    if (!relevant.length) continue;
    const correct = relevant.filter((qr) => qr.isCorrect).length;
    result.push({
      name,
      score: Math.round((correct / relevant.length) * 100) / 100,
      answers: relevant.map((qr) => ({ q: qr.questionNumber, response: qr.response, correct: qr.isCorrect })),
    });
  }
  return result.sort((a, b) => a.name.localeCompare(b.name));
}

function getStudentGroups(studentResponses, questionNumbers, studentNameMap, threshold = 0.6) {
  const buildingUnderstanding = [];
  const understoodConcept = [];
  for (const sr of studentResponses) {
    const name = studentNameMap.get(sr.studentId);
    if (!name) continue;
    const all = (sr.questionResponses ?? []);
    if (!all.length) continue;
    const score = all.filter((qr) => qr.isCorrect).length / all.length;
    if (score >= threshold) {
      understoodConcept.push(name);
    } else {
      buildingUnderstanding.push(name);
    }
  }
  const sortByName = (a, b) => {
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

function formatLabel(f) {
  return ({ whole_class: 'Whole class', split_class: 'Split class' })[f] ?? f;
}

function injectStudentsIntoGroups(activity, studentData) {
  const groups = activity?.tabs?.studentGroupings?.groups;
  if (!groups?.length || !studentData.length) return activity;
  const sorted = [...studentData].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));
  const n = groups.length;
  const base = Math.floor(sorted.length / n);
  const remainder = sorted.length % n;
  let offset = 0;
  const assigned = groups.map((_, i) => {
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
        groups: groups.map((g, i) => ({ ...g, students: assigned[i] ?? [] })),
      },
    },
  };
}

function buildNextSteps(misconceptions, activitiesPerGroup, ppqQuestions, learningScienceData, misconceptionExtras = []) {
  const questionErrorRates = (ppqQuestions ?? [])
    .filter((q) => q.questionNumber != null && q.classPercentCorrect != null)
    .sort((a, b) => a.questionNumber - b.questionNumber)
    .map((q) => ({
      label: `Q${q.questionNumber}`,
      errorRate: Math.round((1 - q.classPercentCorrect) * 100),
    }));

  const frameworkItems = learningScienceData?.standards ?? [];
  const normalize = (s) => s?.replace(/\s/g, '').toLowerCase() ?? '';

  const standardsDescMap = new Map();
  for (const item of frameworkItems) {
    if (item.code) standardsDescMap.set(item.code, item.description);
    for (const rel of [...(item.prerequisiteStandards ?? []), ...(item.futureDependentStandards ?? [])]) {
      if (rel.code && !standardsDescMap.has(rel.code)) standardsDescMap.set(rel.code, rel.description);
    }
  }

  return misconceptions.map((m, i) => {
    const extras = misconceptionExtras[i] ?? {};
    const activityList = (activitiesPerGroup[i] ?? []).filter(Boolean);
    const frameworkItem = frameworkItems.find(
      (item) => normalize(item.code) === normalize(m.ccssStandard)
    );

    const prerequisiteGaps = m.prerequisiteGapCodes?.length
      ? m.prerequisiteGapCodes.map((code) => ({ standard: code, description: standardsDescMap.get(code) ?? '' }))
      : (frameworkItem?.prerequisiteStandards ?? []).map((r) => ({ standard: r.code, description: r.description }));

    const impactedObjectives = m.impactedObjectiveCodes?.length
      ? m.impactedObjectiveCodes.map((code) => ({ standard: code, description: standardsDescMap.get(code) ?? '' }))
      : (frameworkItem?.futureDependentStandards ?? []).map((r) => ({ standard: r.code, description: r.description }));

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
        targetObjective: {
          standard: m.ccssStandard,
          description: standardsDescMap.get(m.ccssStandard) ?? frameworkItem?.description ?? '',
          learningComponents: (frameworkItem?.learningComponents ?? []).map((c) => c.description).filter(Boolean),
        },
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

function parseJson(raw) {
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

// ── Generate pipeline (from generate-next-steps.ts processClassroom) ────────

async function runGeneratePipeline(gql, classroom, sessionId) {
  console.log('=== Starting generate pipeline ===');

  // List sessions
  console.log('  Sessions...');
  const sessionsData = await gql(SESSIONS_BY_CLASSROOM, { classroomId: classroom.id });
  const sessionStubs = sessionsData.sessionsByClassroomId?.items ?? [];
  if (!sessionStubs.length) {
    console.log(' — no sessions, skipping');
    return;
  }
  const sorted = [...sessionStubs].sort((a, b) => (a.weekNumber ?? 0) - (b.weekNumber ?? 0));
  const currentStub = sorted[sorted.length - 1];
  const historyStubs = sorted.slice(0, sorted.length - 1);
  console.log(`  ✓ current: ${currentStub.sessionLabel}${historyStubs.length ? `, ${historyStubs.length} historical` : ''}`);

  // Fetch full session details
  console.log('  Session details...');
  const [currentSession, ...historySessions] = await Promise.all(
    [currentStub, ...historyStubs].map((s) =>
      gql(GET_SESSION, { id: s.id }).then((d) => d.getSession)
    )
  );
  console.log('  ✓');

  const ppq = currentSession?.assessments?.items?.find((a) => a.type === 'PPQ');
  const allCcss = [
    ...new Set([
      ...(ppq?.ccssStandards ?? []),
      ...(currentSession?.ccssStandards ?? []),
    ]),
  ].filter(Boolean);

  if (!allCcss.length) {
    console.log('  ✗ No CCSS standards found — skipping');
    return;
  }

  // Learning science data
  console.log(`  Learning science (${allCcss.join(', ')})...`);
  const lsResults = await Promise.all(
    allCcss.map((ccss) =>
      invokeLambda(`microcoachGetLearningScience-${AMPLIFY_ENV}`, { input: { ccss } })
        .then((r) => parseJson(r))
        .catch(() => ({ standards: [] }))
    )
  );
  const learningScienceData = {
    standards: lsResults.flatMap((r) => r?.standards ?? []),
  };
  console.log(`  ✓ ${learningScienceData.standards.length} standards`);
  console.log(`  [LS] standards returned: ${learningScienceData.standards.length}`);
  for (const s of learningScienceData.standards) {
    console.log(`  [LS]   ${s.code}: ${s.prerequisiteStandards?.length ?? 0} prereqs, ${s.futureDependentStandards?.length ?? 0} future`);
    if (s.prerequisiteStandards?.length) console.log(`  [LS]     prereqs:`, s.prerequisiteStandards.map((r) => r.code));
    if (s.futureDependentStandards?.length) console.log(`  [LS]     future:`, s.futureDependentStandards.map((r) => r.code));
  }

  // Student responses — confidence stats + PPQ enrichment
  let augmentedPpq = ppq;
  let studentResponses = [];
  if (ppq?.id) {
    console.log('  Student responses...');
    try {
      const srData = await gql(STUDENT_RESPONSES_BY_ASSESSMENT, { assessmentId: ppq.id });
      studentResponses = srData?.studentResponsesByAssessmentId?.items ?? [];
      const hasConfidence = studentResponses.some((sr) =>
        (sr.questionResponses ?? []).some((qr) => qr.confidence != null));
      if (hasConfidence) {
        const confidenceStats = computeConfidenceStats(studentResponses, ppq.questions ?? []);
        augmentedPpq = { ...ppq, confidenceStats };
        console.log(`  ✓ ${studentResponses.length}, with confidence`);
      } else {
        console.log(`  ✓ ${studentResponses.length}, no confidence`);
      }
    } catch (err) {
      console.log(`  ✗ ${err} — continuing`);
    }
  }

  const studentNameMap = new Map();
  for (const s of (classroom.students?.items ?? [])) {
    if (s.id && s.name) studentNameMap.set(s.id, s.name);
  }
  const wrongAnswerDist = computeWrongAnswerDist(studentResponses);

  // Misconception analysis
  console.log('  Misconception analysis...');
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
  const genMisconceptions = analysis?.misconceptions ?? [];
  console.log(`  ✓ ${genMisconceptions.length} misconceptions`);

  // Per-misconception extras
  const ppqQs = (ppq?.questions ?? []).map((q) => ({
    questionNumber: q.questionNumber,
    correctAnswer: q.correctAnswer ?? null,
    classPercentCorrect: q.classPercentCorrect ?? null,
  }));
  const misconceptionExtras = genMisconceptions.map((m) => {
    const qNums = parseQuestionNumbers(m.evidence?.source ?? '');
    return {
      ppqQuestions: ppqQs,
      studentGroups: getStudentGroups(studentResponses, qNums, studentNameMap),
      studentData: getStudentPerformanceData(studentResponses, qNums, studentNameMap),
      wrongAnswerExplanations: m.wrongAnswerExplanations ?? [],
      correctAnswerSolution: m.correctAnswerSolution ?? [],
    };
  });

  // Fetch next step examples
  const nextStepData = await gql(LIST_CONTEXT_DATA, {
    filter: { type: { eq: 'NEXT_STEP_LESSON' } },
    limit: 20,
  });
  const nextStepExamples = nextStepData.listContextData?.items ?? [];
  console.log(`  ✓ ${nextStepExamples.length} next step examples`);

  // Generate next step activities
  const classroomContext = { grade: classroom.grade, subject: classroom.subject, cohortSize: classroom.cohortSize };
  const NEXT_STEP_FORMATS = ['whole_class', 'split_class'];

  // Planning call
  let structurePlan = [];
  console.log(`  Planning activity structures for ${genMisconceptions.length} misconceptions...`);
  try {
    const raw = await invokeLambda(`microcoachNextStepOption-${AMPLIFY_ENV}`, {
      input: {
        planStructures: true,
        misconceptions: JSON.stringify(genMisconceptions.map((m) => ({
          title: m.title, description: m.description, ccssStandard: m.ccssStandard,
        }))),
        classroomContext: JSON.stringify(classroomContext),
      },
    });
    structurePlan = parseJson(raw) ?? [];
    console.log(`  ✓ ${structurePlan.length} assignments`);
  } catch (err) {
    console.warn(`  ⚠ Structure planning failed, generating without suggestions: ${err}`);
  }

  const getSuggestedStructure = (title, fmt) => {
    const plan = structurePlan.find(p => p.misconceptionTitle === title);
    return plan ? plan[fmt] ?? null : null;
  };

  // Generate activities — misconceptions in parallel, formats sequential within each
  const activitiesPerGroup = await Promise.all(
    genMisconceptions.map(async (m, i) => {
      console.log(`  Next steps [${i + 1}/${genMisconceptions.length}]: ${m.title}...`);
      const relevant = nextStepExamples.filter(
        (ex) =>
          !ex.ccssStandards?.length ||
          ex.ccssStandards.some(
            (s) => s === m.ccssStandard || s.startsWith(m.ccssStandard?.split('.')[0])
          )
      );
      const baseInput = {
        misconception: JSON.stringify(m),
        learningScienceData: JSON.stringify(learningScienceData),
        classroomContext: JSON.stringify(classroomContext),
        ...(relevant.length > 0 && { contextData: JSON.stringify(relevant) }),
      };
      const sd = misconceptionExtras[i]?.studentData ?? [];
      const resultList = [];

      // Sequential within misconception so each format sees what was already generated
      for (const fmt of NEXT_STEP_FORMATS) {
        const existingActivities = resultList.map(a => ({
          title: a.title, format: a.format, activityStructure: a.activityStructure,
          strategyTag: a.strategyTag, summary: a.summary,
          instructionalMove: a.instructionalMove, targets: a.targets,
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
          console.error(`    ✗ format=${fmt}: ${err}`);
        }
      }

      console.log(`  ✓ ${resultList.length} activities`);
      return resultList;
    })
  );

  // Build + save
  const nextSteps = buildNextSteps(genMisconceptions, activitiesPerGroup, ppq?.questions, learningScienceData, misconceptionExtras);
  console.log(`  Saving ${nextSteps.length} next steps to session ${currentStub.id}...`);
  await gql(UPDATE_SESSION, {
    input: {
      id: currentStub.id,
      pregeneratedNextSteps: JSON.stringify(nextSteps),
      status: 'generated',
    },
  });
  console.log('  ✓ Session updated');

  console.log(`  Setting currentWeek to ${currentStub.weekNumber}...`);
  await gql(UPDATE_CLASSROOM_WEEK, { input: { id: classroom.id, currentWeek: currentStub.weekNumber } });
  console.log('  ✓');

  return { misconceptionCount: genMisconceptions.length, nextStepCount: nextSteps.length };
}

// ── Main async pipeline ─────────────────────────────────────────────────────
// Mirrors CLI order: yarn ingest → yarn upload → yarn generate

async function runPipeline(input) {
  const { classroomId, activityFileBase64, studentDataFileBase64 } = input;

  const gql = await createGqlClient();

  // ── Step 1: Fetch classroom ─────────────────────────────────────────────────
  console.log('Step 1: Fetching classroom...');
  const classroomData = await gql(GET_CLASSROOM, { id: classroomId });
  const classroom = classroomData.getClassroom;
  if (!classroom) throw new Error(`Classroom ${classroomId} not found`);
  console.log(`  ✓ ${classroom.classroomName} (grade ${classroom.grade}, ${classroom.state})`);

  // ── Step 2: Ingest docx — extract misconceptions (yarn ingest) ──────────────
  console.log('Step 2: Ingesting activity docx...');
  const docxBuffer = Buffer.from(activityFileBase64, 'base64');
  const docxResult = await mammoth.extractRawText({ buffer: docxBuffer });
  const ppqText = docxResult.value.trim();
  if (!ppqText) {
    throw new Error('Empty text extracted from docx — cannot ingest');
  }
  console.log(`  ✓ Extracted ${ppqText.length} chars from docx`);

  // Determine occurrence (first if no prior sessions, recurring otherwise)
  const existingSessions = await gql(SESSIONS_BY_CLASSROOM, { classroomId });
  const sessionCount = (existingSessions.sessionsByClassroomId?.items ?? []).length;
  const occurrence = sessionCount === 0 ? 'first' : 'recurring';

  // Parse xlsx early to get weekNumber for ingest call
  console.log('  Parsing student data xlsx...');
  const xlsxBuffer = Buffer.from(studentDataFileBase64, 'base64');
  const parsed = parseExcelBuffer(xlsxBuffer);
  console.log(`  ✓ ${parsed.students.length} students, ${parsed.questionMeta.length} questions, week ${parsed.weekNumber}`);

  console.log(`  Calling ingestPPQ (occurrence: ${occurrence})...`);
  const ingestResult = await gql(INGEST_PPQ, {
    input: {
      ppqText,
      classroomKey: classroom.classroomName,
      grade: classroom.grade,
      subject: classroom.subject,
      state: classroom.state,
      schoolYear: classroom.schoolYear,
      cohortSize: classroom.cohortSize ?? parsed.students.length,
      sessionLabel: `W${parsed.weekNumber}`,
      weekNumber: parsed.weekNumber,
      occurrence,
    },
  });
  const ingestData = JSON.parse(ingestResult.ingestPPQ);
  const misconceptions = ingestData.misconceptions ?? [];
  console.log(`  ✓ ${misconceptions.length} misconceptions extracted`);

  // ── Step 3: Upload (yarn upload) ────────────────────────────────────────────
  // Derive CCSS: use xlsx if available, fall back to misconception ccssStandards
  // (mirrors CLI using sessionConfig.ccssStandards as fallback)
  const ccssFromMisconceptions = [...new Set(misconceptions.map((m) => m.ccssStandard).filter(Boolean))];
  const ccssStandards =
    parsed.ccssStandards.filter((s) => /\d/.test(s)).length > 0
      ? parsed.ccssStandards
      : ccssFromMisconceptions;

  // Merge CCSS into parsed data for assessment creation (mirrors upload.ts:642-650)
  const ppqData = {
    ...parsed,
    ccssStandards,
    topic: parsed.topic || deriveTopic(ccssStandards[0] ?? ''),
  };

  // 3a. Upload students
  console.log('Step 3a: Uploading students...');
  const createdStudents = await uploadStudents(gql, classroomId, ppqData.students);
  const studentMap = new Map();
  for (const s of createdStudents) {
    studentMap.set(s.externalId, s.id);
  }

  // 3b. Create session
  console.log('Step 3b: Creating session...');
  const sessionLabel = `W${ppqData.weekNumber}`;
  const session = await uploadSession(gql, classroomId, sessionLabel, ppqData.weekNumber, ppqData.topic, ccssStandards);
  const sessionId = session.id;

  // 3c. Create PPQ assessment
  console.log('Step 3c: Creating PPQ assessment...');
  const ppqAssessment = await uploadAssessment(gql, classroomId, sessionId, ppqData, 'PPQ');

  // 3d. Upload PPQ student responses
  console.log('Step 3d: Uploading PPQ student responses...');
  await uploadStudentResponses(gql, 'PPQ', ppqAssessment.id, ppqData.students, studentMap);

  // 3e. Link assessment to session (mirrors upload.ts:690-698)
  console.log('Step 3e: Linking assessment to session...');
  await gql(UPDATE_SESSION, {
    input: {
      id: sessionId,
      ppqAssessmentId: ppqAssessment.id,
    },
  });
  console.log('  ✓');

  // 3f. Upload misconceptions + stub activities (mirrors upload.ts:701-718)
  console.log('Step 3f: Uploading misconceptions...');
  await uploadMisconceptions(gql, classroomId, sessionId, misconceptions);

  // 3g. Create ContextData (mirrors upload.ts:721-729)
  console.log('Step 3g: Creating ContextData...');
  const nextStepTitle = `${classroom.classroomName} ${sessionLabel} Next Step - ${ppqData.topic}`;
  await uploadContextData(gql, nextStepTitle, classroom.grade, ccssStandards, ppqData.weekNumber, false, ppqData.assessmentCode);

  // ── Step 4: Generate pipeline (yarn generate) — short-circuited for now ─────
  console.log('Step 4: Generate pipeline — skipped (short-circuited)');
  // TODO: re-enable when ready
  // const freshClassroomData = await gql(GET_CLASSROOM, { id: classroomId });
  // const freshClassroom = freshClassroomData.getClassroom;
  // const generateResult = await runGeneratePipeline(gql, freshClassroom, sessionId);

  return {
    classroomName: classroom.classroomName,
    studentCount: ppqData.students.length,
    misconceptionCount: misconceptions.length,
    nextStepCount: 0,
  };
}

// ── Handler ──────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  console.log('Event received:', JSON.stringify({
    async: event.async,
    hasArguments: !!event.arguments,
    hasInput: !!event.arguments?.input,
  }));

  // Async invocation — run the full pipeline
  if (event.async === true) {
    const input = event.input;
    try {
      const result = await runPipeline(input);
      console.log('Pipeline complete:', JSON.stringify(result));

      const subject = `RightOn Education: MicroCoach Upload Complete - ${result.classroomName}`;
      const bodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Rubik:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1B376F; margin: 0; padding: 0; background-color: #FFFBF6; }
    .container { max-width: 600px; margin: 24px auto; background: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
    .header { background-color: #1B376F; padding: 24px 32px; }
    .header h1 { font-family: 'Poppins', sans-serif; color: #FFFBF6; margin: 0; font-size: 20px; font-weight: 700; }
    .body { padding: 32px; }
    .intro { font-size: 14px; line-height: 1.6; margin-bottom: 24px; color: #374151; }
    .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .summary-table td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #e5e5e5; }
    .summary-table td:first-child { font-family: 'Poppins', sans-serif; font-weight: 600; color: #1B376F; width: 200px; font-size: 13px; letter-spacing: 0.3px; }
    .summary-table td:last-child { color: #374151; }
    .status { background-color: rgba(5, 150, 105, 0.08); padding: 12px 16px; border-radius: 8px; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; color: #059669; text-align: center; }
    .footer { padding: 16px 32px; background-color: #FFFBF6; border-top: 1px solid #e5e5e5; font-size: 12px; color: #6B7280; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MicroCoach Upload Complete</h1>
    </div>
    <div class="body">
      <p class="intro">A user has uploaded data to MicroCoach and it has been parsed and analyzed. Here is a summary:</p>
      <table class="summary-table">
        <tr><td>Classroom</td><td>${result.classroomName}</td></tr>
        <tr><td>Students</td><td>${result.studentCount}</td></tr>
        <tr><td>Misconceptions Identified</td><td>${result.misconceptionCount}</td></tr>
        <tr><td>Next Steps Generated</td><td>${result.nextStepCount}</td></tr>
      </table>
      <div class="status">Ready for Review</div>
    </div>
    <div class="footer">RightOn Education &mdash; MicroCoach</div>
  </div>
</body>
</html>`.trim();
      const bodyText = [
        `RightOn Education: MicroCoach Upload Complete - ${result.classroomName}`,
        '',
        'A user has uploaded data to MicroCoach and it has been parsed and analyzed. Here is a summary:',
        '',
        `Classroom: ${result.classroomName}`,
        `Students: ${result.studentCount}`,
        `Misconceptions Identified: ${result.misconceptionCount}`,
        `Next Steps Generated: ${result.nextStepCount}`,
        '',
        'Ready for Review.',
      ].join('\n');
      await sendEmail(subject, bodyHtml, bodyText);
    } catch (err) {
      console.error('Pipeline failed:', err);

      const failHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Rubik:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1B376F; margin: 0; padding: 0; background-color: #FFFBF6; }
    .container { max-width: 600px; margin: 24px auto; background: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
    .header { background-color: #CC5500; padding: 24px 32px; }
    .header h1 { font-family: 'Poppins', sans-serif; color: #FFFBF6; margin: 0; font-size: 20px; font-weight: 700; }
    .body { padding: 32px; }
    .intro { font-size: 14px; line-height: 1.6; margin-bottom: 24px; color: #374151; }
    .error-box { background-color: rgba(204, 85, 0, 0.06); border-left: 4px solid #CC5500; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #CC5500; font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace; word-break: break-all; }
    .note { margin-top: 16px; font-size: 13px; color: #6B7280; }
    .footer { padding: 16px 32px; background-color: #FFFBF6; border-top: 1px solid #e5e5e5; font-size: 12px; color: #6B7280; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MicroCoach Upload Failed</h1>
    </div>
    <div class="body">
      <p class="intro">The upload pipeline encountered an error and could not complete.</p>
      <div class="error-box">${err.message}</div>
      <p class="note">Check CloudWatch logs for full details.</p>
    </div>
    <div class="footer">RightOn Education &mdash; MicroCoach</div>
  </div>
</body>
</html>`.trim();
      const failText = [
        'RightOn Education: MicroCoach Upload Failed',
        '',
        'The upload pipeline encountered an error and could not complete.',
        '',
        `Error: ${err.message}`,
        '',
        'Check CloudWatch logs for full details.',
      ].join('\n');
      await sendEmail(
        'RightOn Education: MicroCoach Upload Failed',
        failHtml,
        failText
      ).catch((emailErr) => console.error('Failed to send error email:', emailErr));

      throw err;
    }
    return;
  }

  // Sync invocation from AppSync — validate and self-invoke async
  const input = event.arguments?.input;
  if (!input) {
    return JSON.stringify({ error: 'Missing input' });
  }

  const { classroomId, activityFileBase64, studentDataFileBase64 } = input;
  if (!classroomId || !activityFileBase64 || !studentDataFileBase64) {
    return JSON.stringify({ error: 'Missing required fields: classroomId, activityFileBase64, studentDataFileBase64' });
  }

  // Self-invoke asynchronously
  const lambdaClient = new LambdaClient({ region: process.env.REGION || 'us-east-1' });
  await lambdaClient.send(new InvokeCommand({
    FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
    InvocationType: 'Event',
    Payload: Buffer.from(JSON.stringify({
      async: true,
      input,
    })),
  }));

  console.log('Async invocation triggered');
  return JSON.stringify('Upload processing started. You will receive an email when analysis is complete.');
};
