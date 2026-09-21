export interface WrongAnswerRef {
  questionNumber: number;
  letter: string;
}

export interface MisconceptionReach {
  studentCount: number | null;
  studentPercent: number | null;
  // Mean of the 1–5 confidence ratings on the linked wrong picks — the Student
  // Confidence input to the misconception rubric. null when no linked pick
  // carried a rating (a session without confidence data), distinct from 0.
  meanConfidence: number | null;
  linkStatus: 'linked' | 'unlinked';
}

/**
 * How many distinct students exhibited a misconception, counted from the response
 * rows rather than estimated by a model.
 *
 * `wrongAnswers` is the misconception's wrong-answer refs — the specific answer
 * options tied to it by whichever stage populated them. A student is affected if
 * they chose any of them. Counting distinct students matters because someone wrong
 * on two linked questions is still one student.
 *
 * Returns nulls when there are no refs to work from — a session without them, or a
 * misconception the analysis model reported as genuinely new. That is different
 * from a count of zero, which means refs existed and no
 * student chose any of those options. A misconception nobody exhibited is a real
 * result and must survive to scoring rather than being dropped.
 *
 * Lives in its own module so it can be imported and tested without executing the
 * orchestrator, which runs its pipeline on import.
 */
export function computeMisconceptionReach(
  wrongAnswers: WrongAnswerRef[] | undefined,
  studentResponses: any[],
): MisconceptionReach {
  if (!wrongAnswers?.length) {
    return { studentCount: null, studentPercent: null, meanConfidence: null, linkStatus: 'unlinked' };
  }

  const targets = new Set(
    wrongAnswers.map((w) => `${w.questionNumber}:${String(w.letter).trim().toUpperCase()}`),
  );

  const affected = new Set<string>();
  const respondents = new Set<string>();
  let confSum = 0;
  let confN = 0;

  for (const sr of studentResponses ?? []) {
    const sid = sr.studentId ?? sr.student;
    if (sid == null) continue;
    respondents.add(sid);
    for (const qr of (sr.questionResponses ?? [])) {
      if (qr.response == null) continue;
      // A double-marked response ("BC") counts as having chosen both options.
      const chosen = String(qr.response).trim().toUpperCase();
      for (const letter of chosen) {
        if (targets.has(`${qr.questionNumber}:${letter}`)) {
          affected.add(sid);
          // One rating per linked pick: a student wrong on two linked questions
          // contributes twice to the mean, once to the count.
          if (qr.confidence != null) { confSum += qr.confidence; confN += 1; }
          break;
        }
      }
    }
  }

  // Denominator is every student with a response row, matching the convention the
  // stored `classPercentCorrect` already uses — not per-question respondents.
  const total = respondents.size;
  return {
    studentCount: affected.size,
    studentPercent: total ? Math.round((affected.size / total) * 1000) / 1000 : null,
    meanConfidence: confN ? Math.round((confSum / confN) * 100) / 100 : null,
    linkStatus: 'linked',
  };
}
