/**
 * The correction prompt. Like the check's, it states a method and carries no
 * examples of past errors.
 */

/**
 * @param what      what the material is, in a few words
 * @param material  the misconception or activity, with its labels
 * @param questions the assessment questions it refers to, as text (may be empty)
 * @param values    [{ rowId, text, why }]: what to fix and why it is wrong
 */
export const correctPromptFor = ({ what, material, questions, values }) => `
You are correcting specific mathematical errors in generated K-12 teaching material before a teacher uses it. The material is ${what}. An independent reviewer checked it and found the values listed below unsound; its working is given with each.

## Rules
- Give a replacement for every listed value. Change nothing else: no other value in the material will be changed, so each replacement must agree with the rest of the material exactly as it is written.
- Fix only what the reviewer's working shows is wrong, and keep everything else in the value — its wording, its purpose and its length — as close to the original as the fix allows.
- Keep each value's role. The material deliberately contains or describes incorrect student work, and it says so itself (statuses, annotations, verdicts, stances). A value meant to show an error must still show that error, and be correct about everything else.
- Keep the same kind of value: text stays text in the same style, with math written in LaTeX between $...$ as the material does; a label stays one of the labels the material uses for it; a number stays a number.
- Work out the mathematics yourself before writing a replacement, and check that the replacement is correct.
- If a value cannot be made correct without changing other values, or the reviewer's working is itself wrong, set fixed to false, return the original value unchanged, and say why in note.

${questions ? `## The assessment questions this material is about\n${questions}\n` : ''}
## The material (with its labels)
${JSON.stringify(material, null, 2)}

## The values to correct
${values.map((v, n) => `- v${n} [${v.rowId}]: ${JSON.stringify(v.text)}\n  Reviewer's working: ${v.why}`).join('\n')}
`.trim();
