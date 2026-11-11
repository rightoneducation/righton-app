// Copied from seed/eval/scripts/util/computeReach.ts: a Lambda can't import from seed/.
// How many distinct students exhibited a misconception, counted from the response
// rows. Nulls when there are no wrong-answer refs, which differs from a count of 0.
export function computeMisconceptionReach(wrongAnswers, studentResponses) {
  if (!wrongAnswers?.length) {
    return {
      studentCount: null, studentPercent: null, meanConfidence: null,
      linkedResponses: null, linkStatus: 'unlinked',
    };
  }

  const targets = new Set(
    wrongAnswers.map((w) => `${w.questionNumber}:${String(w.letter).trim().toUpperCase()}`),
  );

  const affected = new Set();
  const respondents = new Set();
  let confSum = 0;
  let confN = 0;
  let linkedResponses = 0;

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
          // Once per response, not per matching letter: see the break.
          linkedResponses += 1;
          // One rating per linked pick: a student wrong on two linked questions
          // contributes twice to the mean, once to the count.
          if (qr.confidence != null) { confSum += qr.confidence; confN += 1; }
          break;
        }
      }
    }
  }

  // Denominator is every student with a response row, as classPercentCorrect uses.
  const total = respondents.size;
  return {
    studentCount: affected.size,
    studentPercent: total ? Math.round((affected.size / total) * 1000) / 1000 : null,
    meanConfidence: confN ? Math.round((confSum / confN) * 100) / 100 : null,
    linkedResponses,
    linkStatus: 'linked',
  };
}
