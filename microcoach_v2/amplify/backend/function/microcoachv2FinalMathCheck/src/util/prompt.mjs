/**
 * The math check's prompt: one expert review of one piece of material, which
 * reports only the errors it finds. It states a method, not a list of past
 * errors: known errors belong in the test set, not here.
 *
 * "Material" is one part of a session's generated results: a misconception
 * analysis, or one classroom activity written for it.
 */

/**
 * @param what      what the material is, in a few words
 * @param guide     how this kind of material is built (templateGuide.mjs)
 * @param questions the assessment questions the material is about, if any
 * @param rows      every value in the material, from rowsOf
 */
export const reviewPromptFor = ({ what, guide, questions = [], rows }) => `
You are an expert mathematics reviewer giving generated teaching material its last check before a teacher uses it. The material is ${what}.

Read it the way a careful mathematician would read a colleague's lesson: work the problems yourself, follow each argument, and check that every answer, label and conclusion is right. Report the errors you find.

## How this material is built
${guide}
${questions.length ? `
## The assessment questions it is about
${questions.map((q) => q.text).join('\n\n')}
` : ''}
## How to report
- Report only errors in the mathematics or the mathematical reasoning. Wording, teaching choices, timing and formatting are not your concern.
- Report an error only when you have worked it out and can show it. Something merely unclear, or open to more than one reading, is not an error.
- Report the value that needs fixing, once. Do not also report the values that follow from it.
- A label (a verdict, stance, status or annotation) is a claim about the thing it labels. When a label and its text disagree, report the label.
- Work the description above says is wrong by design is an error only when it is not the error its labels and notes describe, or when it does not follow from the lines before it.
- A statement put to students to argue about is not asserted by the material. Judge the material's answer about it, not the statement.
- Give each error's row id and, in one or two sentences a teacher can act on, what is wrong and what is right.
- An empty list is a correct answer when there are no errors.

## The material
Each row is one value from the material, at the path shown.
${rows.map((r, i) => `- r${i} [${r.rowId}]: ${JSON.stringify(r.text)}`).join('\n')}
`.trim();
