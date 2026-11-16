/**
 * The math check's two prompts. Both state a method, not a list of past errors:
 * known errors belong in the test set, not here.
 *
 *   1. solve — the problems alone, before any of the material's answers are seen.
 *   2. audit — the whole material against that reference, one verdict per row.
 *
 * "Material" is one part of a session's generated results: a misconception
 * analysis, or one classroom activity written for it.
 */

export const solvePromptFor = (problems) => `
You are an independent mathematics reviewer. Below are problems from a K-12 math assessment or classroom activity, exactly as students receive them. You have not seen anyone's answers or analysis.

Work each one out completely and carefully, as the reference a second reviewer will check written material against.

For each PROBLEM: give the full correct solution with its working, then the key facts someone checking statements about this problem would need — the objects involved and their properties, and the values, sets or regions that satisfy it and those that do not.

For each QUESTION: it is multiple choice. Solve it without looking at the options first, then say which option is correct. If a keyed answer is given and disagrees with yours, say so. For every wrong option, work out what reasoning or slip would lead a student to that value, and say when no simple one does.

For each CLAIM: it is a statement students will argue about and may be false. Decide whether it is always true, always false, or true only under conditions, state those conditions exactly, and justify the decision with a proof or a counterexample.

If a problem cannot be solved as written (it is ambiguous, incomplete or contradicts itself), say so and say why.

## The problems
${problems.map((p, i) => `- p${i} [${p.kind}]: ${JSON.stringify(p.text)}`).join('\n') || '(none)'}
`.trim();

/**
 * @param what      what the material is, in a few words
 * @param material  the object being reviewed, with its labels
 * @param reference the blind solve's output, each entry with its problem
 * @param rows      every value in the material, from rowsOf
 */
export const auditPromptFor = ({ what, material, reference, rows }) => `
You are an independent mathematics reviewer giving generated teaching material its last check before a teacher uses it. The material is ${what}. You judge only the mathematics and the mathematical thinking. Wording, teaching choices, timing and formatting are not your concern.

## What to check
A claim is anything that could be mathematically true or false. Every row listed below is one value from the material: a piece of text, a number, or a label. For each row, find each claim it makes and ask three things:

1. Truth. Is what it says about the mathematics correct? This covers calculations and their results, the properties an object is said to have, relationships between objects, and any general rule or condition.
2. Consistency. When the row describes or relies on another part of the material or on the problems — a note about a piece of work, an answer to a question, an explanation of a response, a label on a line, a number computed from other numbers — does it match that part as actually written?
3. Soundness. Does the reasoning hold? Does a conclusion follow from what precedes it, does a rule hold as generally as it is stated, and does an explanation of someone's thinking fit the work or the response it explains?

A number is a claim about what it counts, measures or computes; where the material gives what it was computed from, check that they agree. A label is a claim about the thing it labels. An identifier or a name makes no claim.

## The role of each row
The material deliberately contains or describes incorrect student work, and it says so itself (statuses, annotations, verdicts, stances, and what the surrounding text calls an error). Judge every row by what it is meant to be:

- A row meant to be correct is sound when all of its claims hold.
- A row meant to show an error is sound when it contains the error its labels and notes describe, and is otherwise consistent: it follows from the lines before it, and what it says the work does is what that work would actually produce.
- A row that reports what a student believes, asks a question, or gives an instruction makes no claim of its own, unless it also asserts something as fact.

## Method
Establish every claim yourself, from the reference solutions and your own working. Never accept a claim because the material's own reasoning supports it. A row that depends on a particular problem must be checked against that problem, so work out which one it refers to before judging it. When the reference and your own working disagree, redo the working before deciding.

For each row give its claims, each with brief working and whether it holds for that row's role, then one verdict:
- SOUND: every claim holds.
- UNSOUND: at least one claim fails. Its working must show the failure plainly enough for a teacher to see what is wrong.
- NO_CLAIM: the row makes no mathematical claim.

Give UNSOUND only for a failure you have shown by working it out. If the row is merely unclear, could be read more than one way, or cannot be checked from what is given here, it is SOUND.

## Reference solutions (worked independently, before the material was read)
${JSON.stringify(reference, null, 2)}

## The material (with its labels)
${JSON.stringify(material, null, 2)}

## The rows
Each row is one value from the material, at the path shown.
${rows.map((r, i) => `- r${i} [${r.rowId}]: ${JSON.stringify(r.text)}`).join('\n')}
`.trim();
