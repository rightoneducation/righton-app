/**
 * Turns the state machine's per-item results into what is stored on the
 * session and shown on /prepublishreview.
 *
 * An item is one misconception's analysis (kind 'misconception', j null) or one
 * of its activities (kind 'activity'). A result is either a checked item
 *   { kind, i, j, templateId, misconceptionTitle, rowsChecked, issues: [{ rowId, rowLabel, text, why }] }
 * or one whose check failed (the Map's catch)
 *   { kind, i, j, unchecked: true, error }
 * An unchecked item is never counted as clean.
 */

const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** "3 misconceptions and 6 activities" */
function describe(items) {
  const misconceptions = items.filter((r) => r.kind === 'misconception').length;
  const activities = items.filter((r) => r.kind === 'activity').length;
  return [
    misconceptions ? count(misconceptions, 'misconception', 'misconceptions') : null,
    activities ? count(activities, 'activity', 'activities') : null,
  ].filter(Boolean).join(' and ');
}

export function summarize(results = []) {
  const checked = results.filter((r) => r && !r.unchecked);
  const unchecked = results.filter((r) => r?.unchecked);
  const issues = checked.flatMap((r) => (r.issues ?? []).map((issue) => ({
    kind: r.kind,
    misconceptionIndex: r.i,
    activityIndex: r.j ?? null,
    misconceptionTitle: r.misconceptionTitle ?? '',
    templateId: r.templateId ?? '',
    ...issue,
  })));

  let summary;
  if (results.length === 0) summary = 'There was nothing to check';
  else if (checked.length === 0) summary = 'Nothing could be checked';
  else if (issues.length === 0) summary = `No math issues in ${describe(checked)}`;
  else summary = `${count(issues.length, 'math issue', 'math issues')} across ${describe(checked)}`;
  if (unchecked.length > 0 && checked.length > 0) summary += `; ${describe(unchecked)} not checked`;

  return {
    itemsChecked: checked.length,
    itemsUnchecked: unchecked.length,
    rowsChecked: checked.reduce((n, r) => n + (r.rowsChecked ?? 0), 0),
    unchecked: unchecked.map((r) => ({ kind: r.kind, misconceptionIndex: r.i, activityIndex: r.j ?? null })),
    issues,
    summary,
  };
}

/** A state machine error ({ Error, Cause }) as one line. */
export function describeError(error) {
  if (!error) return 'Unknown error';
  if (error.Error === 'States.Timeout') return 'A step ran past its time limit';
  try {
    // A Lambda error arrives as JSON text in Cause.
    const cause = JSON.parse(error.Cause);
    return String(cause.errorMessage ?? error.Cause);
  } catch {
    return String(error.Cause || error.Error || 'Unknown error');
  }
}

/** session.pipelineOutput → its object. AWSJSON can arrive double-encoded. */
export function parseOutput(raw) {
  let parsed = raw;
  for (let pass = 0; pass < 2 && typeof parsed === 'string'; pass += 1) {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return null;
    }
  }
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
}

/** Every misconception, then each of its activities: { kind, i, j }. */
export function checkItems(output) {
  return (output?.misconceptions ?? []).flatMap((m, i) => [
    { kind: 'misconception', i, j: null },
    ...(m?.activities ?? []).map((a, j) => (a ? { kind: 'activity', i, j } : null)).filter(Boolean),
  ]);
}
