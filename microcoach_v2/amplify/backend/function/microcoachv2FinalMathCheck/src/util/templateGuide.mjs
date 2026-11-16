/**
 * How each kind of material is built: what each part is, and where the
 * material itself records whether a part is meant to be right. The audit reads
 * the one for the item it checks, so a part that is wrong by design — a claim
 * students argue against, a student's slip — is judged as what it is.
 *
 * Structure only, never past errors. Condensed by hand from the field
 * descriptions the activities are generated against
 * (microcoachv2NextStepOption/src/util/activityContent.mjs, `.describe()` on
 * each field) and from how a misconception is built (microcoachv2LLMGenMisconception,
 * ScoresCalc, LLMGenInstrNeed, LLMSelectTemplate). This lambda can't import
 * them, so change this when they change.
 */

const ACTIVITY_COMMON = `
Every activity also has: whyThisActivity (why it suits the misconception), beforeClass (the teacher's preparation), howToRun (the steps the class goes through), and discussion — a takeaway, questions with teacher answers, and Watch for sets (watchFor: a move a student may make, often a mistaken one; tryAsking: a question to ask them; howToRespond: what the teacher does). The takeaway, every answer, and every howToRespond are meant to be correct. A watchFor describes student thinking and is right when it is a plausible reading of this activity; it is not asserting the mathematics it describes.`.trim();

export const GUIDE = {
  MISCONCEPTION: `
This is the analysis of one misconception, built from a class's answers to the assessment questions given.
- title and description name the misconception: the mistaken reasoning, which is wrong by design. They are right when they describe reasoning that really is mistaken and that the linked answers show.
- wrongAnswers link answer options to the misconception. Each explanation says what reasoning leads a student to that option; it is right when that reasoning does produce that option's value from the question.
- studentCount, studentPercent, linkedResponses and meanConfidence are counts and averages from the class's responses, which are not shown here; check only that they agree with one another.
- rubric scores the misconception for ranking: each score, its weighting and the total, and the reasons given for conceptual depth. Check the arithmetic between them and that the reasons are sound.
- instructionalNeed and rationale say what the teacher needs to address and why; selectedTemplates says which activities were chosen and why. They are right when what they say about the mathematics is right.`.trim(),

  INCORRECT_WORKED_EXAMPLES: `
This is a Spot the Slip activity: each example is a full worked solution to a problem that contains one deliberate slip.
- prompt and problem state the problem; they are meant to be correct and solvable.
- steps are the worked solution. A step annotated CORRECT is right. The step annotated ERROR is the slip, wrong by design, and its annotation text explains the slip and is meant to be correct. Steps after it (annotation NONE or null) follow from the slip: they are right when they correctly carry the wrong value forward.
- slip names the slip; finalOutcome is where the wrong reasoning arrives, which is wrong by design and right when it is what the steps really reach.
${ACTIVITY_COMMON}`.trim(),

  FAVORITE_NO: `
This is a My Favorite No activity: each example is one plausible incorrect student response worth learning from.
- prompt and problem state the problem; they are meant to be correct and solvable.
- work is the response line by line. A line with status CORRECT is right. A line with status INCORRECT is the student's error or follows from it, wrong by design. NEUTRAL lines make no judgement.
- notice items are teacher notes: PRESERVE says what the reasoning gets right, REVISE what needs to change. Both are meant to be correct about the work as written.
- sourceNote says the response is illustrative; it makes no mathematical claim.
${ACTIVITY_COMMON}`.trim(),

  MATH_DETECTIVE: `
This is a Math Detective activity: students investigate one student's flawed work.
- issue names the mathematical issue the examples share, without the fix; it is meant to be correct.
- prompt and problem state the problem; they are meant to be correct and solvable.
- workSummary is the student's work in brief. A line with status CORRECT is right; a line with status INCORRECT is the flaw or follows from it, wrong by design.
- evidenceNotes are teacher notes on what the work shows and why it fails; they are meant to be correct about the work as written.
- stages are INVESTIGATE, SOLVE and REVISE_AND_CHECK: ask is the question to students; answer is the teacher's answer, meant to be correct, including any worked check.
${ACTIVITY_COMMON}`.trim(),

  COMPARE_THE_THINKING: `
This is a Compare the Thinking activity: two approaches to one problem, side by side.
- problem states the problem; it is meant to be correct and solvable.
- Each strategy has a verdict: CORRECT and STRONGER approaches are right throughout; an INCORRECT approach is wrong by design. In an INCORRECT approach, the step highlighted ERROR is the first invalid move and the steps after it follow from it; steps before it are right. SUCCESS marks the step that makes a correct approach work.
- Each strategy's notes are teacher notes on what the approach reveals; they are meant to be correct about the approach as written, including when the approach is wrong.
${ACTIVITY_COMMON}`.trim(),

  MAKE_YOUR_CASE: `
This is a Make Your Case activity: students argue whether a claim is true.
- claim is the position students argue about. It may be true, false or true only under conditions — it is not asserted by the activity. It is right when it matches the activity's own resolution.
- resolution.verdict (TRUE, FALSE or CONDITIONAL) and resolution.why are the activity's answer about the claim; they are meant to be correct.
- studentSteps tell students what to do; they make no claim.
- examples are cases to bring in: prompt names the case; answer is the worked result and what it shows, meant to be correct.
- arguments are positions a student might take: a SUPPORT argument may be one the mathematics refutes, and is right when it is a plausible argument for the claim; a CHALLENGE argument is meant to be mathematically correct.
${ACTIVITY_COMMON}`.trim(),
};

/** The guide for a misconception, or for an activity by its content type. */
export function guideFor(kind, activity) {
  if (kind === 'misconception') return GUIDE.MISCONCEPTION;
  return GUIDE[activity?.content?.facilitate?.type] ?? ACTIVITY_COMMON;
}
