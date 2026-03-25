/**
 * microcoachTeacherUploadGen Lambda
 *
 * Runs the generate pipeline for a single classroom/session.
 * Identical logic to generate-next-steps.ts processClassroom.
 *
 * Input: { classroomId, sessionId }
 * Invoked asynchronously by microcoachTeacherUpload after upload completes.
 */

import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { createGqlClient } from './util/appsync-client.mjs';
import { sendEmail } from './util/send-email.mjs';
import {
  GET_CLASSROOM,
  SESSIONS_BY_CLASSROOM,
  GET_SESSION,
  LIST_CONTEXT_DATA,
  STUDENT_RESPONSES_BY_ASSESSMENT,
  UPDATE_SESSION,
  UPDATE_CLASSROOM_WEEK,
} from './util/graphql.mjs';

const AMPLIFY_ENV = process.env.ENV || 'dev';

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

function parseJson(raw) {
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

// ── Confidence stats aggregator (from generate-next-steps.ts:193-229) ───────

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

// ── PPQ enrichment helpers (from generate-next-steps.ts:234-327) ────────────

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

// ── Next step builder (from generate-next-steps.ts:330-419) ─────────────────

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

// ── Generate pipeline (from generate-next-steps.ts processClassroom) ────────

async function runGeneratePipeline(gql, classroom, sessionId) {
  console.log(`=== Generate pipeline: ${classroom.classroomName} ===`);

  // List sessions
  console.log('  Sessions...');
  const sessionsData = await gql(SESSIONS_BY_CLASSROOM, { classroomId: classroom.id });
  const sessionStubs = sessionsData.sessionsByClassroomId?.items ?? [];
  if (!sessionStubs.length) {
    console.log(' — no sessions, skipping');
    return { misconceptionCount: 0, nextStepCount: 0 };
  }
  const sorted = [...sessionStubs].sort((a, b) => (a.weekNumber ?? 0) - (b.weekNumber ?? 0));
  // Use the sessionId passed from the upload Lambda if available, otherwise fall back to highest weekNumber
  const currentStub = (sessionId && sorted.find((s) => s.id === sessionId)) || sorted[sorted.length - 1];
  const historyStubs = sorted.filter((s) => s.id !== currentStub.id);
  console.log(`  ✓ current: ${currentStub.sessionLabel} (${currentStub.id})${historyStubs.length ? `, ${historyStubs.length} historical` : ''}`);

  // Fetch full session details
  console.log('  Session details...');
  const [currentSession, ...historySessions] = await Promise.all(
    [currentStub, ...historyStubs].map((s) =>
      gql(GET_SESSION, { id: s.id }).then((d) => d.getSession)
    )
  );
  console.log('  ✓');

  // ── CCSS extraction (mirrors generate-next-steps.ts:493-499) ────────────────
  // Primary: session.ccssStandards + PPQ assessment.ccssStandards
  // Fallback 1: individual question ccssStandard on the PPQ
  // Fallback 2: misconception ccssStandard values
  const ppq = currentSession?.assessments?.items?.find((a) => a.type === 'PPQ');

  const questionCcss = (ppq?.questions ?? [])
    .map((q) => q.ccssStandard)
    .filter(Boolean);

  const misconceptionCcss = (currentSession?.misconceptions?.items ?? [])
    .map((m) => m.ccssStandard)
    .filter(Boolean);

  const allCcss = [
    ...new Set([
      ...(ppq?.ccssStandards ?? []),
      ...(currentSession?.ccssStandards ?? []),
      ...questionCcss,
      ...misconceptionCcss,
    ]),
  ].filter(Boolean);

  console.log(`  CCSS sources — session: ${JSON.stringify(currentSession?.ccssStandards)}, ppq: ${JSON.stringify(ppq?.ccssStandards)}, questions: ${JSON.stringify(questionCcss)}, misconceptions: ${JSON.stringify(misconceptionCcss)}`);
  console.log(`  allCcss: ${JSON.stringify(allCcss)}`);

  if (!allCcss.length) {
    console.log('  ✗ No CCSS standards found — skipping');
    return { misconceptionCount: 0, nextStepCount: 0 };
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
  console.log('  Fetching next step examples...');
  const nextStepData = await gql(LIST_CONTEXT_DATA, {
    filter: { type: { eq: 'NEXT_STEP_LESSON' } },
    limit: 20,
  });
  const nextStepExamples = nextStepData.listContextData?.items ?? [];
  console.log(`  ✓ ${nextStepExamples.length} examples`);

  // Generate next step activities
  const classroomContext = { grade: classroom.grade, subject: classroom.subject, cohortSize: classroom.cohortSize };
  const NEXT_STEP_FORMATS = ['whole_class', 'split_class'];

  // Planning call — one cheap LLM call assigns diverse structures across all
  // misconceptions before parallel generation begins.
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
    misconceptions.map(async (m, i) => {
      console.log(`  Next steps [${i + 1}/${misconceptions.length}]: ${m.title}...`);
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
  const nextSteps = buildNextSteps(misconceptions, activitiesPerGroup, ppq?.questions, learningScienceData, misconceptionExtras);
  console.log(`  Saving ${nextSteps.length} next steps to session ${currentStub.id}...`);
  await gql(UPDATE_SESSION, {
    input: {
      id: currentStub.id,
      pregeneratedNextSteps: JSON.stringify(nextSteps),
      status: 'generated',
      publishStatus: 'DRAFT',
    },
  });
  console.log('  ✓ Session updated');

  console.log(`  Setting currentWeek to ${currentStub.weekNumber}...`);
  await gql(UPDATE_CLASSROOM_WEEK, { input: { id: classroom.id, currentWeek: currentStub.weekNumber } });
  console.log('  ✓');

  // ── Evaluate generated content for grade level appropriateness ──────────────
  let evalResults = null;
  // Concatenate all generated content into a single text block for one evaluation call
  const allParts = [];
  for (const ns of nextSteps) {
    for (const move of ns.moveOptions ?? []) {
      const steps = move.tabs?.activitySteps;
      if (steps?.incorrectWorkedExamples) {
        for (const ex of steps.incorrectWorkedExamples) {
          allParts.push(typeof ex === 'string' ? ex : `Problem: ${ex.problem}\nIncorrect Work: ${ex.incorrectWork}`);
        }
      }
      if (steps?.discussionQuestions) {
        for (const q of steps.discussionQuestions) {
          allParts.push(q);
        }
      }
    }
  }
  const evalTexts = allParts.length > 0
    ? [{ id: 'all', label: 'All Generated Content', type: 'combined', text: allParts.join('\n\n---\n\n') }]
    : [];

  if (evalTexts.length > 0) {
    console.log(`  Evaluating ${evalTexts.length} texts for grade level appropriateness...`);
    try {
      evalResults = await invokeLambda(`microcoachInitialEvaluator-${AMPLIFY_ENV}`, {
        grade: classroom.grade,
        texts: evalTexts,
      });
      console.log(`  ✓ Evaluation: ${JSON.stringify(evalResults.summary)}`);
      // Save evaluation results to session
      await gql(UPDATE_SESSION, {
        input: {
          id: currentStub.id,
          evaluationResults: JSON.stringify(evalResults),
        },
      });
      console.log('  ✓ Evaluation results saved to session');
    } catch (err) {
      console.error('  ✗ Evaluator failed (non-fatal):', err.message);
    }
  }

  return { misconceptionCount: misconceptions.length, nextStepCount: nextSteps.length, evalResults };
}

// ── Handler ──────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  console.log('Event received:', JSON.stringify(event));

  const { classroomId, sessionId, classroomName, studentCount, misconceptionCount } = event;
  if (!classroomId) {
    throw new Error('Missing required field: classroomId');
  }

  const gql = await createGqlClient();

  // Fetch classroom with students
  console.log('Fetching classroom...');
  const classroomData = await gql(GET_CLASSROOM, { id: classroomId });
  const classroom = classroomData.getClassroom;
  if (!classroom) throw new Error(`Classroom ${classroomId} not found`);
  console.log(`  ✓ ${classroom.classroomName} (grade ${classroom.grade})`);

  try {
    const result = await runGeneratePipeline(gql, classroom, sessionId);
    console.log('Generate pipeline complete:', JSON.stringify(result));

    const displayName = classroomName || classroom.classroomName;
    const frontendUrl = process.env.FRONTEND_URL || 'https://microcoach.rightoneducation.com';
    const reviewUrl = `${frontendUrl}/review/${classroomId}`;
    const subject = `RightOn Education: MicroCoach Upload Complete - ${displayName}`;
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
        <tr><td>Classroom</td><td>${displayName}</td></tr>
        <tr><td>Students</td><td>${studentCount ?? '—'}</td></tr>
        <tr><td>Misconceptions Identified</td><td>${misconceptionCount ?? result.misconceptionCount}</td></tr>
        <tr><td>Next Steps Generated</td><td>${result.nextStepCount}</td></tr>
      </table>
      ${result.evalResults?.evaluations?.[0] ? (() => {
        const e = result.evalResults.evaluations[0];
        const s = result.evalResults.summary;
        const isAtGrade = e.classification === 'atGrade';
        const statusColor = isAtGrade ? '#059669' : '#CC5500';
        const statusText = isAtGrade ? '✓ At Grade Level' : e.classification === 'aboveGrade' ? '⚠ Above Grade Level' : e.classification === 'belowGrade' ? '⚠ Below Grade Level' : '— Unknown';
        return `
      <table class="summary-table">
        <tr><td>Grade Level Check</td><td style="color:${statusColor};font-weight:600;">${statusText}</td></tr>
        <tr><td>Expected</td><td>${s.expectedBand}</td></tr>
        <tr><td>Scored</td><td>${e.score}</td></tr>
      </table>`;
      })() : ''}
      <a href="${reviewUrl}" class="status" style="display:block;text-decoration:none;color:#059669;">Ready for Review &rarr;</a>
    </div>
    <div class="footer">RightOn Education &mdash; MicroCoach</div>
  </div>
</body>
</html>`.trim();
    const evalTextLines = result.evalResults?.evaluations?.[0] ? (() => {
      const e = result.evalResults.evaluations[0];
      const s = result.evalResults.summary;
      const status = e.classification === 'atGrade' ? 'At Grade Level' : e.classification === 'aboveGrade' ? 'Above Grade Level' : e.classification === 'belowGrade' ? 'Below Grade Level' : 'Unknown';
      return ['', `Grade Level Check: ${status} (expected ${s.expectedBand}, scored ${e.score})`];
    })() : [];
    const bodyText = [
      `RightOn Education: MicroCoach Upload Complete - ${displayName}`,
      '',
      'A user has uploaded data to MicroCoach and it has been parsed and analyzed. Here is a summary:',
      '',
      `Classroom: ${displayName}`,
      `Students: ${studentCount ?? '—'}`,
      `Misconceptions Identified: ${misconceptionCount ?? result.misconceptionCount}`,
      `Next Steps Generated: ${result.nextStepCount}`,
      ...evalTextLines,
      '',
      `Ready for Review: ${reviewUrl}`,
    ].join('\n');
    await sendEmail(subject, bodyHtml, bodyText);

    return result;
  } catch (err) {
    console.error('Generate pipeline failed:', err);

    const displayName = classroomName || classroom.classroomName;
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
      <h1>MicroCoach Generation Failed</h1>
    </div>
    <div class="body">
      <p class="intro">The generation pipeline for ${displayName} encountered an error and could not complete.</p>
      <div class="error-box">${err.message}</div>
      <p class="note">Check CloudWatch logs for full details.</p>
    </div>
    <div class="footer">RightOn Education &mdash; MicroCoach</div>
  </div>
</body>
</html>`.trim();
    const failText = [
      `RightOn Education: MicroCoach Generation Failed - ${displayName}`,
      '',
      'The generation pipeline encountered an error and could not complete.',
      '',
      `Error: ${err.message}`,
      '',
      'Check CloudWatch logs for full details.',
    ].join('\n');
    await sendEmail(
      `RightOn Education: MicroCoach Generation Failed - ${displayName}`,
      failHtml,
      failText
    ).catch((emailErr) => console.error('Failed to send error email:', emailErr));

    throw err;
  }
};
