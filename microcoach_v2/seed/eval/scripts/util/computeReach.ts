export interface WrongAnswerRef {
  questionNumber: number;
  letter: string;
}

export interface MisconceptionReach {
  studentCount: number | null;
  studentPercent: number | null;
  linkStatus: 'linked' | 'unlinked';
}

/**
 * How many distinct students exhibited a misconception, counted from the response
 * rows rather than estimated by a model.
 *
 * `wrongAnswers` is the ingest-time attribution: the specific answer options the
 * source document's answer key ties to this misconception. A student is affected if
 * they chose any of them. Counting distinct students matters because someone wrong
 * on two linked questions is still one student.
 *
 * Returns nulls when there is no attribution to work from — a session that predates
 * enrichment, or a misconception the analysis model reported as genuinely new. That
 * is different from a count of zero, which means the attribution existed and no
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
    return { studentCount: null, studentPercent: null, linkStatus: 'unlinked' };
  }

  const targets = new Set(
    wrongAnswers.map((w) => `${w.questionNumber}:${String(w.letter).trim().toUpperCase()}`),
  );

  const affected = new Set<string>();
  const respondents = new Set<string>();

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
    linkStatus: 'linked',
  };
}
