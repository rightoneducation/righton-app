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
// Each metric also carries a `weight`. The doc gives none, so equal weighting was
// the first reading — but progression influence is taken at the standard level in
// this pilot and only two of its four levels are reachable on the standards we
// fetch, which let a one-level difference there cancel a two-level difference in
// share of class. It is weighted 1 against 3 for the rest: it informs the ranking
// without deciding it.
export function band(value, bands) {
  for (const b of bands) {
    if (b.min === undefined) return b.score;
    if (b.exclusive ? value > b.min : value >= b.min) return b.score;
  }
  return null;
}

/**
 * A continuously scored metric: linear in its input, flat once the input reaches
 * `saturateAt`. Used where the doc's discrete bands were too coarse to separate
 * values that differ — share of class at 29%, 39% and 43% all scored 2, so the
 * ranking could not tell them apart. Saturating rather than scaling to 1.0 keeps
 * the realistic range spread across the whole scale, and matches the doc putting
 * its top band above 50% rather than at 100%.
 */
export function linearSaturating(value, scale) {
  const { saturateAt, maxScore } = scale;
  if (!saturateAt) return 0;
  return Math.min(maxScore, (value / saturateAt) * maxScore);
}

const enabled = (rubric) => rubric.metrics.filter((m) => m.enabled !== false);

// Reported scores are rounded; `total` and `normalized` are not. Rounding before
// summing would let two inputs that differ collapse back into a tie, which is the
// problem the continuous scale exists to avoid.
const round2 = (n) => Math.round(n * 100) / 100;

/**
 * One misconception → { scores, weighted, total, maxPossible, normalized, missing }.
 *
 * `scores` holds each metric on the doc's 0–3 scale, unweighted, because that is the
 * scale the rubric is written in and the one worth showing a reader. `total` is the
 * WEIGHTED sum and `maxPossible` the weighted maximum over the metrics that were
 * actually scored, so a missing metric shrinks the denominator by its own weight
 * rather than by an average.
 */
export function scoreOne(raw, rubric) {
  const scores = {};
  const weighted = {};
  const missing = [];
  let total = 0;
  let maxPossible = 0;

  for (const metric of enabled(rubric)) {
    const weight = metric.weight ?? 1;
    const value = raw?.[metric.input];
    if (value == null) {
      scores[metric.id] = null;
      weighted[metric.id] = null;
      missing.push(metric.id);
      continue;
    }
    let score;
    if (metric.scale) {
      score = linearSaturating(value, metric.scale);
    } else if (metric.bands) {
      score = band(value, metric.bands);
    } else if (metric.transform) {
      score = (value * metric.transform.multiply) / metric.transform.divide;
    } else {
      // A model-judged metric arrives already on the 0–3 scale.
      score = value;
    }
    scores[metric.id] = round2(score);
    weighted[metric.id] = round2(score * weight);
    total += score * weight;
    maxPossible += 3 * weight;
  }

  return {
    scores,
    weighted,
    total: round2(total),
    maxPossible,
    normalized: maxPossible ? total / maxPossible : null,
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
