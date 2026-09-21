/**
 * The scoring engine for misconceptionRubric.json. Pure: no AWS, no model, no
 * imports. Every number it produces comes from a band, transform or level in the
 * rubric it is handed — nothing is hard-coded here, so a threshold change is a
 * JSON edit.
 *
 * `raw` is one misconception's measured inputs keyed by each metric's `input`
 * name (studentPercent, downstreamCount, meanConfidence, lcScore,
 * conceptualDepth). A `null` input means "could not be measured" and is treated
 * as missing, not as zero.
 */

/**
 * Bands are listed high→low; the first whose floor the value clears wins. A band
 * with no `min` is the catch-all. `exclusive` makes the floor strict, which is
 * how ">10%" and "≥ 2.0" both round-trip from the doc exactly.
 */
export function band(value, bands) {
  for (const b of bands) {
    if (b.min === undefined) return b.score;
    if (b.exclusive ? value > b.min : value >= b.min) return b.score;
  }
  return null;
}

const enabled = (rubric) => rubric.metrics.filter((m) => m.enabled !== false);

/** One misconception → { scores, total, maxPossible, normalized, missing }. */
export function scoreOne(raw, rubric) {
  const scores = {};
  const missing = [];
  let total = 0;
  let scoredCount = 0;

  for (const metric of enabled(rubric)) {
    const value = raw?.[metric.input];
    if (value == null) {
      scores[metric.id] = null;
      missing.push(metric.id);
      continue;
    }
    let score;
    if (metric.bands) {
      score = band(value, metric.bands);
    } else if (metric.transform) {
      score = (value * metric.transform.multiply) / metric.transform.divide;
    } else {
      // A model-judged metric arrives already on the 0–3 scale.
      score = value;
    }
    scores[metric.id] = score;
    total += score;
    scoredCount += 1;
  }

  const maxPossible = 3 * scoredCount;
  return {
    scores,
    total,
    maxPossible,
    normalized: scoredCount ? total / maxPossible : null,
    missing,
  };
}

// Descending, nulls last.
const cmpDesc = (a, b) => {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return b - a;
};

/**
 * Order scored misconceptions and stamp priorityRank / isRecommendedFocus /
 * retained. Each item is `{ ...scoreOne(), raw, inputOrder }`. Ranking uses
 * `selection.rankOn` (normalized or total), then walks `selection.tiebreak`,
 * where a key is looked up on the raw inputs first and the metric scores second,
 * and `inputOrder` is ascending so the result is deterministic.
 */
export function rank(items, selection) {
  const rankKey = selection.rankOn === 'total' ? 'total' : 'normalized';
  const tiebreak = selection.tiebreak ?? ['inputOrder'];
  const cap = selection.cap ?? Infinity;

  const cmp = (a, b) => {
    const primary = cmpDesc(a[rankKey], b[rankKey]);
    if (primary !== 0) return primary;
    for (const key of tiebreak) {
      if (key === 'inputOrder') {
        if (a.inputOrder !== b.inputOrder) return a.inputOrder - b.inputOrder;
        continue;
      }
      const av = a.raw?.[key] ?? a.scores?.[key] ?? null;
      const bv = b.raw?.[key] ?? b.scores?.[key] ?? null;
      const d = cmpDesc(av, bv);
      if (d !== 0) return d;
    }
    return 0;
  };

  return [...items].sort(cmp).map((item, i) => ({
    ...item,
    priorityRank: i + 1,
    isRecommendedFocus: i === 0,
    retained: i < cap,
  }));
}
