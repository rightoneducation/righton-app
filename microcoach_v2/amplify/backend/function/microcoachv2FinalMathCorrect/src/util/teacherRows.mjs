/**
 * Carries a corrected value from session.pipelineOutput into the rows the
 * teacher reads (MicroCoachMisconception, MicroCoachActivity). Those rows were
 * built from the output once, at the end of generation, by
 * microcoachv2UploadGenerate/src/util/buildRows.mjs — the mapping here follows
 * that file and must change with it.
 *
 * A value with no teacher-facing copy (rubric scores, the instructional need,
 * template picks…) only changes pipelineOutput, and these return no change.
 */
import { setAt } from './paths.mjs';

// Copied from buildRows.mjs: the title-cased title and the three-word label.
const TITLE_CASE_STOPWORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'nor', 'of',
  'on', 'or', 'the', 'to', 'up', 'via', 'with',
]);

export function titleCase(value) {
  return String(value).split(/(\s+)/).map((word, i) => {
    if (/^\s+$/.test(word)) return word;
    const lower = word.toLowerCase();
    if (i > 0 && TITLE_CASE_STOPWORDS.has(lower)) return lower;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
}

/** The misconception row for output misconception `m`: by rank, then by title. */
export function findMisconceptionRow(rows, m) {
  return rows.find((r) => m.priorityRank != null && r.rank === m.priorityRank)
    ?? rows.find((r) => r.title === m.title)
    ?? null;
}

/** The activity row for output activity `a` under misconception row `mRow`. */
export function findActivityRow(rows, mRow, a) {
  const mine = rows.filter((r) => r.misconceptionId === mRow?.id);
  return mine.find((r) => a.templateId && r.routine?.id === `routine-${a.templateId}`)
    ?? mine.find((r) => a.activityType && r.activityType === a.activityType)
    ?? null;
}

/**
 * Applies one corrected misconception value to its row. `m` is the output
 * misconception (for what a wrong answer refers to). Returns the top-level
 * fields of the row it changed; empty when the value has no teacher copy.
 */
export function applyToMisconceptionRow(row, m, rowId, value) {
  if (rowId === 'title') {
    const cased = titleCase(value);
    row.title = value;
    row.titleCased = cased;
    row.shortLabel = cased.split(/\s+/).slice(0, 3).join(' ');
    return ['title', 'titleCased', 'shortLabel'];
  }
  if (rowId === 'description') {
    row.description = value;
    return ['description'];
  }
  const explanation = rowId.match(/^wrongAnswers\[(\d+)\]\.explanation$/);
  if (explanation) {
    const w = m.wrongAnswers?.[Number(explanation[1])];
    const tag = w ? `Q${w.questionNumber}, Answer ${w.letter}` : null;
    const bucket = row.studentWork?.errorsByFrequency?.find((b) => b.errorTag === tag);
    if (!bucket) return [];
    bucket.interpretation = value;
    return ['studentWork'];
  }
  return [];
}

/** Applies one corrected activity value to its row. Returns the fields it changed. */
export function applyToActivityRow(row, rowId, value) {
  if (rowId.startsWith('content.')) {
    // The row stores the activity's content as `phases`, unchanged.
    if (!row.phases || typeof row.phases !== 'object') return [];
    setAt(row.phases, rowId.slice('content.'.length), value);
    return ['phases'];
  }
  if (['targets', 'instructionalMove', 'strategyTag'].includes(rowId)) {
    row[rowId] = value;
    return [rowId];
  }
  if (rowId === 'durationMinutes') {
    row.durationMinutes = value;
    row.durationLabel = `${value} min`;
    return ['durationMinutes', 'durationLabel'];
  }
  return [];
}
