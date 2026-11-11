/**
 * The Wave 2 generation stages, in the order and with the inputs of
 * seed/cli/generate.ts, run from an ingested assessment rather than a fixture.
 *
 *   learning science -> misconceptions -> reach -> rubric -> instructional needs
 *   -> template selection -> activities
 *
 * Differences from the script:
 *   - A stage failure throws, except a single activity. The script logs and carries
 *     on, which suits a batch of eval runs, but a teacher would get empty results.
 *   - No names exist, so a student is a "Student N" label.
 *   - No classroom record: stages read only subject and class size, which come from
 *     the assessment code and the responses.
 *   - No contextData: pilot lesson titles, filtered by standard, so never sent here.
 *   - Output holds only what the rows need; eval-only fields are gone.
 */

import { matchStandard } from './ccssCode.mjs';
import { computeMisconceptionReach } from './computeReach.mjs';
import { dedupeGraph } from './dedupeGraph.mjs';
import { checkNeedSeparation } from './checkNeedSeparation.mjs';

const SUBJECTS = { MAT: 'Math', ALG: 'Math' };

const parseJson = (raw) => (typeof raw === 'string' ? JSON.parse(raw) : raw);

export function computeConfidenceStats(studentResponses, questions) {
  const stats = new Map(questions.map((q) => [q.questionNumber, {
    questionNumber: q.questionNumber,
    totalConf: 0, countConf: 0,
    totalConfCorrect: 0, countConfCorrect: 0,
    totalConfIncorrect: 0, countConfIncorrect: 0,
    highConfWrong: 0, totalHighConf: 0,
  }]));
  for (const sr of studentResponses) {
    for (const qr of sr.questionResponses ?? []) {
      const s = stats.get(qr.questionNumber);
      if (!s || qr.confidence == null) continue;
      s.totalConf += qr.confidence;
      s.countConf += 1;
      if (qr.isCorrect) {
        s.totalConfCorrect += qr.confidence;
        s.countConfCorrect += 1;
      } else {
        s.totalConfIncorrect += qr.confidence;
        s.countConfIncorrect += 1;
        if (qr.confidence >= 4) s.highConfWrong += 1;
      }
      if (qr.confidence >= 4) s.totalHighConf += 1;
    }
  }
  const avg = (total, count) => (count > 0 ? parseFloat((total / count).toFixed(2)) : null);
  return [...stats.values()].map((s) => ({
    questionNumber: s.questionNumber,
    avgConfidence: avg(s.totalConf, s.countConf),
    avgConfidenceCorrect: avg(s.totalConfCorrect, s.countConfCorrect),
    avgConfidenceIncorrect: avg(s.totalConfIncorrect, s.countConfIncorrect),
    highConfWrongPct: s.totalHighConf > 0 ? parseFloat((s.highConfWrong / s.totalHighConf).toFixed(3)) : null,
  }));
}

export function computeWrongAnswerDist(studentResponses) {
  const dist = {};
  for (const sr of studentResponses) {
    for (const qr of sr.questionResponses ?? []) {
      if (qr.isCorrect || qr.response == null) continue;
      const q = qr.questionNumber;
      if (!dist[q]) dist[q] = {};
      const answer = String(qr.response).trim();
      dist[q][answer] = (dist[q][answer] ?? 0) + 1;
    }
  }
  return dist;
}

/** The problems an activity works with, so the next one for the need can differ. */
function studentFacingProblems(content) {
  const f = content?.facilitate;
  if (!f) return [];
  const out = [];
  if (typeof f.claim === 'string') out.push(f.claim);
  if (typeof f.problem === 'string') out.push(f.problem);
  if (Array.isArray(f.examples)) {
    for (const e of f.examples) {
      const text = e?.prompt ?? e?.problem;
      if (typeof text === 'string' && text.trim()) out.push(text);
    }
  }
  return out;
}

/** Calls a stage and throws on a reported failure. `invoke` returns the Lambda's reply. */
async function callStage(invoke, stage, input) {
  const out = parseJson(await invoke(stage, { input }));
  if (out?.ok === false) throw new Error(`${stage} failed: ${out?.error?.message ?? 'unknown error'}`);
  return out;
}

async function fetchLearningScience(invoke, standards, sessionId) {
  const results = await Promise.all(standards.map(async (ccss) => ({
    ccss,
    parsed: await callStage(invoke, 'learningScience', { ccss, sessionId, trace: false }),
  })));
  const unmatched = results.filter((r) => !(r.parsed?.standards?.length > 0)).map((r) => r.ccss);
  if (unmatched.length) console.warn(`No graph match for: ${unmatched.join(', ')}`);
  return results.flatMap((r) => r.parsed?.standards ?? []);
}

function withReachAndStandard(generated, questions, studentResponses, standards) {
  const questionStandard = new Map(questions.map((q) => [q.questionNumber, q.ccssStandard || '']));
  return generated.map((m) => {
    const reach = computeMisconceptionReach(m.wrongAnswers, studentResponses);
    // The standard most of its linked questions carry decides the progression score.
    const votes = new Map();
    for (const w of m.wrongAnswers ?? []) {
      const code = questionStandard.get(w.questionNumber);
      if (code) votes.set(code, (votes.get(code) ?? 0) + 1);
    }
    const ranked = [...votes.entries()].sort((a, b) => b[1] - a[1]);
    let ccssStandard = standards[0] ?? null;
    let standardSource = 'fallback';
    if (ranked.length) {
      [[ccssStandard]] = ranked;
      standardSource = 'question';
    } else if (m.ccssStandard) {
      ccssStandard = m.ccssStandard;
      standardSource = 'model';
    }
    return {
      ...m,
      ccssStandard,
      standardSource,
      studentCount: reach.studentCount,
      studentPercent: reach.studentPercent,
      meanConfidence: reach.meanConfidence,
      linkedResponses: reach.linkedResponses,
    };
  });
}

/** Rubric scores onto each misconception; returns the carried-forward ones, ranked. */
function applyScores(misconceptions, scoreOut) {
  const byTitle = new Map((scoreOut?.scored ?? []).map((x) => [String(x.title ?? '').trim(), x]));
  return misconceptions
    .map((m) => {
      const sc = byTitle.get(String(m.title ?? '').trim());
      if (!sc) return { ...m, rubric: null, priorityRank: null, isRecommendedFocus: false, retained: false };
      return {
        ...m,
        rubric: {
          version: scoreOut?.rubricVersion ?? null,
          scores: sc.scores,
          total: sc.total,
          maxPossible: sc.maxPossible,
          normalized: sc.normalized,
          conceptualDepthWhy: sc.conceptualDepthWhy ?? null,
        },
        priorityRank: sc.priorityRank,
        isRecommendedFocus: sc.isRecommendedFocus === true,
        isHighestFrequency: sc.isHighestFrequency === true,
        retained: sc.retained === true,
      };
    })
    .filter((m) => m.retained)
    .sort((a, b) => (a.priorityRank ?? Infinity) - (b.priorityRank ?? Infinity));
}

async function generateActivities(invoke, m, shared) {
  const picks = m.selectedTemplates?.picks ?? [];
  if (!picks.length) {
    console.log(`No template cleared the fit threshold for "${m.title}"`);
    return [];
  }
  const linked = new Set((m.wrongAnswers ?? []).map((w) => Number(w.questionNumber)));
  const evidence = {
    questions: shared.questions
      .filter((q) => linked.has(Number(q.questionNumber)))
      .map((q) => ({
        questionNumber: q.questionNumber,
        questionText: q.questionText ?? null,
        correctAnswer: q.correctAnswer ?? null,
        answerChoices: (q.answerChoices ?? []).map((o) => ({
          letter: o.letter,
          content: o.content ?? null,
          isCorrect: o.isCorrect ?? false,
          studentCount: shared.wrongAnswerDist[q.questionNumber]?.[String(o.letter).toUpperCase()] ?? null,
        })),
      })),
  };

  // In sequence: the calls share a prompt prefix so the second can use the cache, and
  // the second is told which problems the first uses. One failed activity doesn't
  // stop the run.
  const activities = [];
  for (const pick of picks) {
    try {
      const sibling = picks.find((p) => p !== pick);
      const siblingProblems = activities.flatMap((a) => studentFacingProblems(a?.content));
      const parsed = await callStage(invoke, 'nextStepOption', {
        misconception: JSON.stringify(m),
        learningScienceData: shared.learningScienceData,
        classroomContext: shared.classroomContext,
        selectedTemplate: JSON.stringify(pick),
        ...(sibling && { siblingPick: JSON.stringify(sibling) }),
        ...(siblingProblems.length && { siblingProblems: JSON.stringify(siblingProblems) }),
        evidence: JSON.stringify(evidence),
        trace: false,
      });
      activities.push({ ...parsed, templateId: pick.templateId });
    } catch (err) {
      console.error(`Activity ${pick.templateId} for "${m.title}" failed:`, err);
    }
  }
  return activities;
}

/**
 * @param session    the MicroCoachSession row
 * @param assessment the MicroCoachAssessment row (with questions)
 * @param studentResponses each { studentId, questionResponses }
 * @param invoke     (stage, payload) => the stage Lambda's reply
 * @returns the carried-forward misconceptions, each with `activities`, and the
 *   graph standards they were judged against
 */
export async function runPipeline({ session, assessment, studentResponses, invoke }) {
  const questions = assessment.questions ?? [];
  const standards = session.ccssStandards ?? [];
  if (!standards.length) throw new Error('The session has no CCSS standards');

  const graph = await fetchLearningScience(invoke, standards, session.id);
  const injected = { standards: dedupeGraph(graph) };
  const learningScienceData = JSON.stringify(injected);
  console.log(`Graph: ${graph.length} standards for ${standards.join(', ')}`);

  const wrongAnswerDist = computeWrongAnswerDist(studentResponses);
  const subject = SUBJECTS[String(assessment.assessmentCode).split('.')[0]] ?? 'Math';
  const classroom = { subject, cohortSize: studentResponses.length };
  const ppq = {
    ...assessment,
    ccssStandards: standards,
    confidenceStats: computeConfidenceStats(studentResponses, questions),
  };

  const generatedOut = await callStage(invoke, 'genMisconception', {
    questions: JSON.stringify(questions.map((q) => ({
      questionNumber: q.questionNumber,
      ccssStandard: q.ccssStandard || standards.join(', '),
      correctAnswer: q.correctAnswer ?? null,
      classPercentCorrect: q.classPercentCorrect ?? null,
      questionText: q.questionText ?? null,
      answerChoices: (q.answerChoices ?? []).map((o) => ({
        letter: o.letter,
        isCorrect: o.isCorrect ?? false,
        content: o.content ?? null,
        studentCount: wrongAnswerDist[q.questionNumber]?.[String(o.letter).toUpperCase()] ?? 0,
      })),
    }))),
    context: JSON.stringify({ subject, ccssStandards: standards }),
    learningScienceData,
    trace: false,
  });
  const generated = withReachAndStandard(generatedOut?.misconceptions ?? [], questions, studentResponses, standards);
  console.log(`Misconceptions: ${generated.length}`);
  // Nothing to carry forward is a real result: Review has a state for it.
  if (!generated.length) return { misconceptions: [], graph };

  const scoreOut = await callStage(invoke, 'scoresCalc', {
    misconceptions: JSON.stringify(generated.map((m) => ({
      title: m.title,
      description: m.description ?? null,
      learningScienceConnection: m.learningScienceConnection ?? null,
      ccssStandard: m.ccssStandard ?? null,
      studentPercent: m.studentPercent ?? null,
      meanConfidence: m.meanConfidence ?? null,
    }))),
    learningScienceData,
    trace: false,
  });
  const retained = applyScores(generated, scoreOut);
  console.log(`Retained ${retained.length}: ${retained.map((m) => `#${m.priorityRank} ${m.title} (${m.rubric?.total}/${m.rubric?.maxPossible})`).join('; ')}`);
  if (!retained.length) throw new Error('The rubric carried no misconception forward');

  const needOut = await callStage(invoke, 'genInstrNeed', {
    misconceptions: JSON.stringify(retained),
    classroomData: JSON.stringify({
      classroom,
      currentSession: {
        sessionLabel: session.sessionLabel,
        weekNumber: session.weekNumber,
        topic: session.topic ?? null,
        ccssStandards: standards,
        assessments: { items: [ppq] },
      },
      sessionHistory: [],
      ppq,
      wrongAnswerDist,
    }),
    learningScienceData,
    trace: false,
  });
  const needByTitle = new Map((needOut?.needs ?? []).map((n) => [String(n.title ?? '').trim(), n]));
  let misconceptions = retained.map((m, i) => {
    const n = needOut?.needs?.[i]?.title === m.title ? needOut.needs[i] : needByTitle.get(String(m.title ?? '').trim());
    return n ? { ...m, instructionalNeed: n.instructionalNeed, rationale: n.rationale, skillNames: n.skillNames ?? [] } : m;
  });
  if (needOut?.missing?.length) console.warn('No instructional need for:', JSON.stringify(needOut.missing));
  checkNeedSeparation(misconceptions).forEach((f) => {
    console.warn(`Need may prescribe an activity: "${f.title}" (${f.hits.join(', ')})`);
  });

  const withNeeds = misconceptions.filter((m) => m.instructionalNeed?.text?.trim());
  if (!withNeeds.length) throw new Error('No misconception got an instructional need');
  const selectOut = await callStage(invoke, 'selectTemplate', {
    needs: JSON.stringify(withNeeds),
    classroomData: JSON.stringify({ classroom, ppq, wrongAnswerDist }),
    assessmentType: 'multiple_choice',
    trace: false,
  });
  const selectionByTitle = new Map((selectOut?.selections ?? []).map((x) => [String(x.title ?? '').trim(), x]));
  misconceptions = misconceptions.map((m) => {
    const selection = selectionByTitle.get(String(m.title ?? '').trim());
    return selection ? { ...m, selectedTemplates: selection } : m;
  });

  const shared = {
    questions,
    wrongAnswerDist,
    learningScienceData,
    classroomContext: JSON.stringify({ subject, cohortSize: studentResponses.length }),
  };
  const activitiesPerNeed = await Promise.all(misconceptions.map((m) => generateActivities(invoke, m, shared)));
  const total = activitiesPerNeed.reduce((n, list) => n + list.filter((a) => a?.content).length, 0);
  console.log(`Activities with content: ${total}`);
  if (!total) throw new Error('No activity was generated');

  return {
    misconceptions: misconceptions.map((m, i) => ({
      ...m,
      activities: activitiesPerNeed[i],
      graphStandard: matchStandard(m.ccssStandard, injected.standards).standard,
    })),
    graph: injected.standards,
  };
}
