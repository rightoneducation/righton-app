/**
 * Turns the pipeline's output into MicroCoachMisconception and MicroCoachActivity
 * rows, in the shape seed/cli/publish-run-v2.ts writes and the app reads. Pure.
 */

import { randomUUID } from 'node:crypto';
import { ccssDomainName } from './ccssDomains.mjs';

// From LLMSelectTemplate's activityLibrary.json, matching the app's template copy.
const ROUTINES = {
  'spot-the-slip': {
    name: 'Spot the Slip',
    subtitle: 'Locate the breakdown',
    description:
      'Students examine a worked solution, identify the first step where the reasoning goes off track, explain why the step is invalid, and work together to correct the error.',
  },
  'my-favorite-no': {
    name: 'My Favorite No',
    subtitle: 'Preserve and build on productive thinking',
    description:
      'Students analyze a meaningful incorrect answer that reveals a mathematical idea worth preserving or building on. They discuss why the response might seem reasonable, identify what the reasoning gets right, and revise it while keeping what is mathematically useful.',
  },
  'compare-the-thinking': {
    name: 'Compare the Thinking',
    subtitle: 'Examine meaningful contrasts',
    description:
      'Students compare two meaningfully different solution strategies or representations and examine the reasoning, strengths, limitations, and important mathematical differences between them.',
  },
  'math-detective': {
    name: 'Math Detective',
    subtitle: 'Investigate underlying issues',
    description:
      'Students become “math detectives” by investigating an incorrect solution, identifying the underlying mathematical issue, revising the reasoning, and checking whether the revision works.',
  },
  'make-your-case': {
    name: 'Make Your Case',
    subtitle: 'Articulate and justify claims',
    description:
      'Students make or evaluate a mathematical claim, articulate their thinking, build a case for it using evidence and reasoning, and consider whether the evidence and reasoning support the claim.',
  },
  righton: {
    name: 'RightOn!',
    subtitle: 'Surface thinking through interaction',
    description:
      'Students interact with a targeted mathematical task designed with plausible distractors, reveal their thinking through their responses, confidence and hints, and discuss popular incorrect answers.',
  },
};

const TITLE_CASE_STOPWORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'nor', 'of',
  'on', 'or', 'the', 'to', 'up', 'via', 'with',
]);

function titleCase(value) {
  return value.split(/(\s+)/).map((word, i) => {
    if (/^\s+$/.test(word)) return word;
    const lower = word.toLowerCase();
    if (i > 0 && TITLE_CASE_STOPWORDS.has(lower)) return lower;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
}

const normalizeCode = (code) => String(code ?? '').replace(/\s/g, '').toLowerCase();

function prevalenceFor(needing, understood, noResponse, total) {
  const share = total ? needing / total : 0;
  let level = 'MOST';
  if (share < 1 / 3) level = 'FEW';
  else if (share < 2 / 3) level = 'SOME';
  const label = { FEW: 'Few students', SOME: 'Some students', MOST: 'Most students' }[level];
  return {
    level,
    label,
    studentsNeedingSupport: needing,
    studentsUnderstood: understood,
    studentsNoResponse: noResponse,
    totalAnalyzed: total,
    supportSummaryLabel: `${needing} of ${total} students need support`,
    understoodSummaryLabel: `${understood} students understood the concept`,
    shortCountLabel: `${needing} of ${total} students`,
  };
}

/** Descriptions of every standard the graph returned, and those it relates to. */
function standardDescriptions(graph) {
  const descriptions = new Map();
  for (const item of graph ?? []) {
    if (item.code) descriptions.set(item.code, item.description);
    for (const rel of [...(item.prerequisiteStandards ?? []), ...(item.futureDependentStandards ?? [])]) {
      if (rel.code && !descriptions.has(rel.code)) descriptions.set(rel.code, rel.description);
    }
  }
  return descriptions;
}

/** The need stage's chosen codes, or the graph's full list when it names none. */
function relatedStandards(codes, fallback, descriptions) {
  return codes?.length
    ? codes.map((code) => ({ code, description: descriptions.get(code) ?? '' }))
    : (fallback ?? []).map((r) => ({ code: r.code, description: r.description }));
}

function activityRow(move, ids, now) {
  const routine = ROUTINES[move.templateId];
  const durationLabel = move.durationMinutes ? `${move.durationMinutes} min` : undefined;
  return {
    __typename: 'MicroCoachActivity',
    id: randomUUID(),
    ...ids,
    activityType: move.activityType,
    title: routine?.name ?? null,
    isSelected: false,
    selectLabel: 'Selected activity',
    detailStatus: 'COMPLETE',
    routine: routine ? { id: `routine-${move.templateId}`, ...routine } : null,
    durationMinutes: move.durationMinutes ?? undefined,
    durationLabel,
    grouping: { level: 'WHOLE_CLASS', label: 'whole class' },
    targets: move.targets ?? undefined,
    instructionalMove: move.instructionalMove ?? undefined,
    strategyTag: move.strategyTag ?? undefined,
    // Stored as a map, as publish-run-v2.ts writes it; the app reads it either way.
    phases: move.content,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * @param session the MicroCoachSession row
 * @param output  runPipeline's result
 * @param studentResponses each { studentId, questionResponses }
 * @param now     ISO timestamp
 */
export function buildRows(session, output, studentResponses, now) {
  const descriptions = standardDescriptions(output.graph);
  const students = studentResponses.map((sr) => sr.studentId);
  const responseOf = (student, question) => studentResponses
    .find((sr) => sr.studentId === student)
    ?.questionResponses?.find((qr) => qr.questionNumber === question)?.response ?? null;
  // A double-marked "BC" counts as choosing both, as the reach count does.
  const chose = (question, letter) => students.filter(
    (student) => String(responseOf(student, question) ?? '').toUpperCase().includes(String(letter).toUpperCase()),
  );

  const misconceptions = [];
  const activities = [];
  output.misconceptions.forEach((n) => {
    const misconceptionId = randomUUID();
    const wrongAnswers = n.wrongAnswers ?? [];
    const linkedQs = [...new Set(wrongAnswers.map((w) => Number(w.questionNumber)))].sort((a, b) => a - b);

    const buckets = wrongAnswers.map((w) => {
      const who = chose(Number(w.questionNumber), w.letter);
      const ref = `Q${w.questionNumber}, Answer ${w.letter}`;
      return {
        optionLetter: w.letter,
        optionSummary: ref,
        errorTag: ref,
        interpretation: w.explanation ?? '',
        studentCount: who.length,
        students: who,
      };
    }).sort((a, b) => b.studentCount - a.studentCount);

    const needing = [...new Set(buckets.flatMap((b) => b.students))];
    const answeredLinked = students.filter((s) => linkedQs.some((q) => responseOf(s, q) != null));
    const understood = answeredLinked.filter((s) => !needing.includes(s));
    const noResponse = students.filter((s) => !answeredLinked.includes(s));

    const skillNames = new Map((n.skillNames ?? []).map((s) => [normalizeCode(s.code), s.name]));
    const skill = (code, description) => ({
      code,
      name: skillNames.get(normalizeCode(code)) ?? null,
      description: description ?? '',
      domainName: ccssDomainName(String(code ?? '')),
    });

    // The graph's spelling (7.NS.A.3): the need stage names skills by it.
    const graphItem = n.graphStandard;
    const targetCode = graphItem?.code ?? n.ccssStandard;
    const prerequisites = relatedStandards(n.rationale?.prerequisiteGaps, graphItem?.prerequisiteStandards, descriptions);
    const upcoming = relatedStandards(n.rationale?.forwardImpact, graphItem?.futureDependentStandards, descriptions);
    const titleCased = titleCase(n.title);

    misconceptions.push({
      __typename: 'MicroCoachMisconception',
      id: misconceptionId,
      sessionId: session.id,
      classId: session.classId,
      rank: n.priorityRank,
      badge: n.isRecommendedFocus ? 'RECOMMENDED_FOCUS' : 'CORE',
      title: n.title,
      titleCased,
      shortLabel: titleCased.split(/\s+/).slice(0, 3).join(' '),
      description: n.description ?? '',
      prevalence: prevalenceFor(needing.length, understood.length, noResponse.length, students.length),
      detailStatus: 'COMPLETE',
      studentWork: {
        tabLabel: 'Student work',
        sectionTitle: 'Errors in order of frequency',
        errorsByFrequency: buckets,
        understoodConcept: {
          sectionTitle: 'Understood Concept',
          subLabel: 'Correct answers',
          countChip: `${understood.length} students`,
          studentCount: understood.length,
          students: understood,
        },
        noResponse: { studentCount: noResponse.length, students: noResponse },
      },
      skillContext: {
        tabLabel: 'Skill context',
        sectionTitle: 'Examples of common errors',
        focusSkill: {
          ...skill(targetCode, descriptions.get(targetCode) ?? graphItem?.description),
          groupLabel: 'Focus Skill',
          learningComponents: (graphItem?.learningComponents ?? []).map((c) => c.description).filter(Boolean),
        },
        prerequisiteGaps: {
          groupLabel: 'Prerequisite Gaps',
          skills: prerequisites.map((s) => skill(s.code, s.description)),
        },
        upcomingSkills: {
          groupLabel: 'Upcoming Skills',
          skills: upcoming.map((s) => skill(s.code, s.description)),
        },
      },
      responseEvidence: linkedQs.map((q) => ({
        questionNumber: q,
        answers: wrongAnswers.filter((w) => Number(w.questionNumber) === q).map((w) => w.letter),
      })),
      createdAt: now,
      updatedAt: now,
    });

    (n.activities ?? [])
      .filter((move) => move?.content && move?.activityType)
      .forEach((move) => {
        activities.push(activityRow(move, { misconceptionId, sessionId: session.id, classId: session.classId }, now));
      });
  });

  return { misconceptions, activities };
}
