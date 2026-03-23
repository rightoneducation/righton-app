/**
 * microcoachTeacherUpload Lambda
 *
 * Consolidates the ingest → upload → generate pipeline into a single Lambda.
 * Uses self-invoke async pattern to work around AppSync's 30s resolver timeout.
 *
 * Flow:
 *   1. AppSync calls handler → validates input → self-invokes async → returns immediately
 *   2. Async invocation runs full pipeline:
 *      a. Parse xlsx (student data)
 *      b. Upload students, session, assessment, responses
 *      c. Ingest docx (extract misconceptions via IngestPPQ Lambda)
 *      d. Upload misconceptions + stub activities
 *      e. Run generate pipeline (learning science → analysis → next steps)
 *      f. Send completion email
 */

import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import mammoth from 'mammoth';
import { createGqlClient } from './util/appsync-client.mjs';
import { parseExcelBuffer } from './util/parse-excel.mjs';
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
  SESSIONS_BY_CLASSROOM,
  GET_SESSION,
  LIST_CONTEXT_DATA,
  STUDENT_RESPONSES_BY_ASSESSMENT,
  UPDATE_CLASSROOM_WEEK,
  INGEST_PPQ,
} from './util/graphql.mjs';

const AMPLIFY_ENV = process.env.ENV || 'dev';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Lambda invocation helper ──────────────────────────────────────────────────

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

// ── Upload helpers (ported from upload.ts) ────────────────────────────────────

async function uploadStudents(gql, classroomId, students) {
  const created = [];
  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    const studentName = s.name || `Student ${i + 1}`;
    const externalId = s.externalId || `S${String(i + 1).padStart(3, '0')}`;
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

async function uploadSession(gql, classroomId, parsed) {
  const data = await gql(CREATE_SESSION, {
    input: {
      classroomId,
      classroomSessionsId: classroomId,
      sessionLabel: `W${parsed.weekNumber}`,
      weekNumber: parsed.weekNumber,
      topic: parsed.topic,
      ccssStandards: parsed.ccssStandards,
      status: 'data_ingested',
    },
  });
  const session = data.createSession;
  console.log(`  ✓ Session created: ${session.id}`);
  return session;
}

async function uploadAssessment(gql, classroomId, sessionId, parsed, type, sourceAssessmentId) {
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

async function uploadStudentResponses(gql, assessmentId, students, studentMap) {
  let count = 0;
  for (const s of students) {
    const studentId = studentMap.get(s.externalId);
    if (!studentId) continue;

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
  console.log(`  ✓ ${count} student responses uploaded`);
  return count;
}

async function uploadMisconceptions(gql, classroomId, sessionId, misconceptions) {
  const created = [];
  for (const m of misconceptions) {
    const data = await gql(CREATE_MISCONCEPTION, {
      input: {
        classroomId,
        sessionId,
        sessionMisconceptionsId: sessionId,
        classroomMisconceptionsId: classroomId,
        ccssStandard: m.ccssStandard,
        title: m.title,
        description: m.description,
        severity: m.severity,
        priority: m.priority,
        occurrence: m.occurrence,
        successIndicators: m.successIndicators,
        evidence: m.evidence,
        studentCount: m.studentCount,
        studentPercent: m.studentPercent,
        aiReasoning: m.aiReasoning,
        prerequisiteGapCodes: m.prerequisiteGapCodes,
        impactedObjectiveCodes: m.impactedObjectiveCodes,
      },
    });
    const misconception = data.createMisconception;
    created.push({ id: misconception.id, sessionId, classroomId });

    // Stub Activity
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
  console.log(`  ✓ ${created.length} misconceptions + activities created`);
  return created;
}

// ── Generate pipeline helpers (ported from generate-next-steps.ts) ───────────

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
  const sortByName = (a, b) => a.localeCompare(b);
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

// ── Generate pipeline (ported from generate-next-steps.ts processClassroom) ──

async function runGeneratePipeline(gql, classroom, sessionId) {
  console.log('=== Starting generate pipeline ===');

  // Fetch session details
  const sessionData = await gql(GET_SESSION, { id: sessionId });
  const currentSession = sessionData.getSession;

  // Fetch history sessions
  const sessionsData = await gql(SESSIONS_BY_CLASSROOM, { classroomId: classroom.id });
  const allSessions = sessionsData.sessionsByClassroomId?.items ?? [];
  const sorted = [...allSessions].sort((a, b) => (a.weekNumber ?? 0) - (b.weekNumber ?? 0));
  const historyStubs = sorted.filter((s) => s.id !== sessionId);

  const historySessions = await Promise.all(
    historyStubs.map((s) => gql(GET_SESSION, { id: s.id }).then((d) => d.getSession))
  );

  const ppq = currentSession?.assessments?.items?.find((a) => a.type === 'PPQ');
  const allCcss = [
    ...new Set([
      ...(ppq?.ccssStandards ?? []),
      ...(currentSession?.ccssStandards ?? []),
    ]),
  ].filter(Boolean);

  if (!allCcss.length) {
    console.log('No CCSS standards found — skipping generation');
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

  // Student responses — confidence stats
  let augmentedPpq = ppq;
  let studentResponses = [];
  if (ppq?.id) {
    console.log('  Fetching student responses...');
    try {
      const srData = await gql(STUDENT_RESPONSES_BY_ASSESSMENT, { assessmentId: ppq.id });
      studentResponses = srData?.studentResponsesByAssessmentId?.items ?? [];
      const hasConfidence = studentResponses.some((sr) =>
        (sr.questionResponses ?? []).some((qr) => qr.confidence != null));
      if (hasConfidence) {
        const confidenceStats = computeConfidenceStats(studentResponses, ppq.questions ?? []);
        augmentedPpq = { ...ppq, confidenceStats };
      }
      console.log(`  ✓ ${studentResponses.length} responses`);
    } catch (err) {
      console.log(`  ✗ Student responses error: ${err}`);
    }
  }

  const studentNameMap = new Map();
  for (const s of (classroom.students?.items ?? [])) {
    if (s.id && s.name) studentNameMap.set(s.id, s.name);
  }
  const wrongAnswerDist = computeWrongAnswerDist(studentResponses);

  // Misconception analysis
  console.log('  Running misconception analysis...');
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
  const misconceptions = analysis?.misconceptions ?? [];
  console.log(`  ✓ ${misconceptions.length} misconceptions`);

  // Per-misconception extras
  const ppqQs = (ppq?.questions ?? []).map((q) => ({
    questionNumber: q.questionNumber,
    correctAnswer: q.correctAnswer ?? null,
    classPercentCorrect: q.classPercentCorrect ?? null,
  }));
  const misconceptionExtras = misconceptions.map((m) => {
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

  // Generate next step activities
  const classroomContext = { grade: classroom.grade, subject: classroom.subject, cohortSize: classroom.cohortSize };
  const NEXT_STEP_FORMATS = ['whole_class', 'split_class'];

  // Planning call
  let structurePlan = [];
  console.log(`  Planning activity structures for ${misconceptions.length} misconceptions...`);
  try {
    const raw = await invokeLambda(`microcoachNextStepOption-${AMPLIFY_ENV}`, {
      input: {
        planStructures: true,
        misconceptions: JSON.stringify(misconceptions.map((m) => ({
          title: m.title, description: m.description, ccssStandard: m.ccssStandard,
        }))),
        classroomContext: JSON.stringify(classroomContext),
      },
    });
    structurePlan = parseJson(raw) ?? [];
    console.log(`  ✓ ${structurePlan.length} structure assignments`);
  } catch (err) {
    console.warn(`  ⚠ Structure planning failed: ${err}`);
  }

  const getSuggestedStructure = (title, fmt) => {
    const plan = structurePlan.find(p => p.misconceptionTitle === title);
    return plan ? plan[fmt] ?? null : null;
  };

  // Generate activities
  const activitiesPerGroup = await Promise.all(
    misconceptions.map(async (m, i) => {
      console.log(`  Next steps [${i + 1}/${misconceptions.length}]: ${m.title}`);
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

      console.log(`  ✓ ${resultList.length} activities for misconception ${i + 1}`);
      return resultList;
    })
  );

  // Build + save
  const nextSteps = buildNextSteps(misconceptions, activitiesPerGroup, ppq?.questions, learningScienceData, misconceptionExtras);
  console.log(`  Saving ${nextSteps.length} next steps to session ${sessionId}...`);
  await gql(UPDATE_SESSION, {
    input: {
      id: sessionId,
      pregeneratedNextSteps: JSON.stringify(nextSteps),
      status: 'generated',
    },
  });
  console.log('  ✓ Session updated');

  await gql(UPDATE_CLASSROOM_WEEK, {
    input: { id: classroom.id, currentWeek: currentSession.weekNumber },
  });
  console.log(`  ✓ Classroom currentWeek set to ${currentSession.weekNumber}`);

  return { misconceptionCount: misconceptions.length, nextStepCount: nextSteps.length };
}

// ── Main async pipeline ──────────────────────────────────────────────────────

async function runPipeline(input) {
  const { classroomId, activityFileBase64, studentDataFileBase64 } = input;

  const gql = await createGqlClient();

  // 1. Look up classroom
  console.log('Step 1: Fetching classroom...');
  const classroomData = await gql(GET_CLASSROOM, { id: classroomId });
  const classroom = classroomData.getClassroom;
  if (!classroom) throw new Error(`Classroom ${classroomId} not found`);
  console.log(`  ✓ ${classroom.classroomName} (grade ${classroom.grade})`);

  // 2. Parse xlsx
  console.log('Step 2: Parsing student data xlsx...');
  const xlsxBuffer = Buffer.from(studentDataFileBase64, 'base64');
  const parsed = parseExcelBuffer(xlsxBuffer);
  console.log(`  ✓ ${parsed.students.length} students, ${parsed.questionMeta.length} questions, week ${parsed.weekNumber}`);

  // 3. Upload students
  console.log('Step 3: Uploading students...');
  const createdStudents = await uploadStudents(gql, classroomId, parsed.students);
  const studentMap = new Map();
  for (const s of createdStudents) {
    studentMap.set(s.externalId, s.id);
  }

  // 4. Create session
  console.log('Step 4: Creating session...');
  const session = await uploadSession(gql, classroomId, parsed);
  const sessionId = session.id;

  // 5. Create PPQ assessment
  console.log('Step 5: Creating PPQ assessment...');
  const ppqAssessment = await uploadAssessment(gql, classroomId, sessionId, parsed, 'PPQ');

  // 6. Upload student responses
  console.log('Step 6: Uploading student responses...');
  await uploadStudentResponses(gql, ppqAssessment.id, parsed.students, studentMap);

  // 7. Link assessment to session
  console.log('Step 7: Linking assessment to session...');
  await gql(UPDATE_SESSION, {
    input: {
      id: sessionId,
      ppqAssessmentId: ppqAssessment.id,
    },
  });

  // 8. Ingest docx — extract misconceptions
  console.log('Step 8: Ingesting activity docx...');
  const docxBuffer = Buffer.from(activityFileBase64, 'base64');
  const docxResult = await mammoth.extractRawText({ buffer: docxBuffer });
  const ppqText = docxResult.value.trim();
  console.log(`  ✓ Extracted ${ppqText.length} chars from docx`);

  // Determine occurrence (first if no prior sessions, recurring otherwise)
  const existingSessions = await gql(SESSIONS_BY_CLASSROOM, { classroomId });
  const sessionCount = (existingSessions.sessionsByClassroomId?.items ?? []).length;
  const occurrence = sessionCount <= 1 ? 'first' : 'recurring';

  const ingestResult = await gql(INGEST_PPQ, {
    input: {
      ppqText,
      classroomKey: classroom.classroomName,
      grade: classroom.grade,
      subject: classroom.subject,
      state: classroom.state,
      schoolYear: classroom.schoolYear,
      cohortSize: classroom.cohortSize,
      sessionLabel: `W${parsed.weekNumber}`,
      weekNumber: parsed.weekNumber,
      occurrence,
    },
  });
  const ingestData = JSON.parse(ingestResult.ingestPPQ);
  const misconceptions = ingestData.misconceptions ?? [];
  console.log(`  ✓ ${misconceptions.length} misconceptions extracted`);

  // 9. Upload misconceptions + stub activities
  console.log('Step 9: Uploading misconceptions...');
  await uploadMisconceptions(gql, classroomId, sessionId, misconceptions);

  // 10. Run generate pipeline
  console.log('Step 10: Running generate pipeline...');
  // Refetch classroom to include the newly created students
  const freshClassroomData = await gql(GET_CLASSROOM, { id: classroomId });
  const freshClassroom = freshClassroomData.getClassroom;
  const generateResult = await runGeneratePipeline(gql, freshClassroom, sessionId);

  return {
    classroomName: classroom.classroomName,
    studentCount: parsed.students.length,
    misconceptionCount: misconceptions.length,
    nextStepCount: generateResult?.nextStepCount ?? 0,
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

      await sendEmail(
        `✓ Microcoach Upload Complete — ${result.classroomName}`,
        [
          `Upload and analysis complete for ${result.classroomName}.`,
          '',
          `Students: ${result.studentCount}`,
          `Misconceptions identified: ${result.misconceptionCount}`,
          `Next steps generated: ${result.nextStepCount}`,
          '',
          'The dashboard is ready for review.',
        ].join('\n')
      );
    } catch (err) {
      console.error('Pipeline failed:', err);

      await sendEmail(
        `✗ Microcoach Upload Failed`,
        [
          `Upload pipeline failed.`,
          '',
          `Error: ${err.message}`,
          '',
          `Check CloudWatch logs for details.`,
        ].join('\n')
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
