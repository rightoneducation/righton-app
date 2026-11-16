/**
 * What the math check reads from session.pipelineOutput.
 *
 * Deliberately generic: every value is a row — text, numbers and labels alike —
 * found by walking the object, so a new template or field is checked with no
 * change here. Nothing in this file knows which rows are "meant to be wrong":
 * the reviewer reads the material's own labels for that.
 */

// Left out of the check:
// - lvnFactors: the knowledge graph's learner-variability strategies, ~800
//   strings of reference data per standard that nobody is shown.
// - rubric: the ranking scorecard. Reviewer-only (the teacher never sees it),
//   and computed in code, not written by a model (Drew, 2026-11-16).
const NOT_SHOWN = new Set(['lvnFactors', 'rubric']);

/** Every value in `value`, with the path it sits at. */
export function rowsOf(value) {
  const rows = [];
  const walk = (node, path) => {
    if (typeof node === 'string') {
      if (node.trim()) rows.push({ rowId: path, rowLabel: rowLabel(path), text: node });
      return;
    }
    if (typeof node === 'number' || typeof node === 'boolean') {
      rows.push({ rowId: path, rowLabel: rowLabel(path), text: String(node) });
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, `${path}[${i}]`));
      return;
    }
    if (node && typeof node === 'object') {
      for (const [key, child] of Object.entries(node)) {
        if (!NOT_SHOWN.has(key)) walk(child, path ? `${path}.${key}` : key);
      }
    }
  };
  walk(value ?? {}, '');
  return rows;
}

/** `value` without the parts rowsOf leaves out, for showing the reviewer as context. */
export function shown(value) {
  if (Array.isArray(value)) return value.map(shown);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => !NOT_SHOWN.has(key))
      .map(([key, child]) => [key, shown(child)]));
  }
  return value;
}

const words = (name) => name.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
const singular = (name) => (/[^s]s$/.test(name) ? name.slice(0, -1) : name);
// Containers that say nothing about where a row is.
const DROPPED_PREFIX = new Set(['content', 'facilitate']);

/** "content.facilitate.examples[1].steps[2].text" → "Example 2 › Step 3" */
export function rowLabel(path) {
  const parts = [...path.matchAll(/([A-Za-z]+)(?:\[(\d+)\])?/g)].map(([, name, index]) => ({ name, index }));
  while (parts.length > 1 && parts[0].index == null && DROPPED_PREFIX.has(parts[0].name)) parts.shift();
  if (parts.length > 1 && parts[parts.length - 1].name === 'text') parts.pop();
  return parts
    .map(({ name, index }) => {
      const label = index == null ? words(name) : `${singular(words(name))} ${Number(index) + 1}`;
      return label.charAt(0).toUpperCase() + label.slice(1);
    })
    .join(' › ');
}

/**
 * An activity's problems, as students are given them. No longer used by the
 * check (the blind solve was removed 2026-11-16); kept because its tests remain.
 */
export function activityProblems(content) {
  const f = content?.facilitate ?? {};
  const problems = [];
  if (typeof f.problem === 'string' && f.problem.trim()) problems.push({ kind: 'PROBLEM', text: f.problem });
  if (typeof f.claim === 'string' && f.claim.trim()) problems.push({ kind: 'CLAIM', text: f.claim });
  (Array.isArray(f.examples) ? f.examples : []).forEach((example) => {
    const text = example?.prompt ?? example?.problem;
    if (typeof text === 'string' && text.trim()) problems.push({ kind: 'PROBLEM', text });
  });
  return problems;
}

/**
 * The assessment questions a misconception was drawn from, with their options,
 * shown to the reviewer alongside it. Those its wrong answers link to; every question when it
 * links to none, since its text still describes the assessment.
 */
export function misconceptionProblems(misconception, questions = []) {
  const linked = new Set((misconception?.wrongAnswers ?? []).map((w) => Number(w.questionNumber)));
  const chosen = questions.filter((q) => linked.has(Number(q.questionNumber)));
  return (chosen.length ? chosen : questions).map((q) => {
    const options = (q.answerChoices ?? [])
      .map((o) => `  ${o.letter}) ${o.content ?? ''}`)
      .join('\n');
    const keyed = q.correctAnswer ? `\nKeyed answer: ${q.correctAnswer}` : '';
    return {
      kind: 'QUESTION',
      text: `Question ${q.questionNumber}: ${q.questionText ?? '(no text)'}${options ? `\nOptions:\n${options}` : ''}${keyed}`,
    };
  });
}
