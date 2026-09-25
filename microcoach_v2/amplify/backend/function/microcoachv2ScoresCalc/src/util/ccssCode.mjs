/**
 * Match a CCSS code written one way against the same standard written another.
 *
 * Questions carry the short form the assessment author typed (`A.REI.3`); the
 * Learning Commons graph returns the canonical form (`HSA-REI.B.3`). They name the
 * same standard, so a lookup keyed on the literal string finds nothing — which is
 * how every misconception ended up with no progression score and no standard
 * description, while the graph query itself reported a clean match.
 *
 * `canonicalCcss` reduces both spellings to one key by dropping the parts that vary:
 * the `HS` prefix, the domain letter, and the cluster letter. What remains is the
 * domain abbreviation and the standard number.
 *
 *   HSA-REI.B.3  →  rei.3      A.REI.3  →  rei.3
 *   8.EE.C.8     →  8.ee.8     8.EE.8   →  8.ee.8
 *
 * This is lossy on purpose. It assumes standard numbers do not repeat within a
 * domain, which holds across CCSS math because numbering runs continuously through
 * a domain's clusters. Grade numbers survive — the filter drops single *letters*,
 * not single characters — so `7.EE.4` and `8.EE.4` stay distinct.
 *
 * Because it is lossy, callers should try an exact match first and fall back to this
 * only when that finds nothing (`matchStandard` does exactly that, and reports which
 * way it matched so a run can show when the fallback was needed).
 */

/** Whitespace-stripped, lowercased — the exact-match key used before this change. */
export const normalizeCode = (c) => String(c ?? '').replace(/\s/g, '').toLowerCase();

/** The spelling-independent key. See the traces above. */
export function canonicalCcss(code) {
  const s = normalizeCode(code).replace(/[-‐‑‒–—]/g, '.');
  if (!s) return '';
  const segs = s.split('.').filter(Boolean);
  // "hsa" → "a": the HS prefix rides on the domain letter rather than its own segment.
  if (segs.length && segs[0].startsWith('hs') && segs[0].length > 2) {
    segs[0] = segs[0].slice(2);
  }
  // Domain and cluster letters are the parts that differ between spellings.
  return segs.filter((seg) => !/^[a-z]$/.test(seg)).join('.');
}

/**
 * Find `code` among `standards` (anything with a `.code`). Exact first, canonical
 * second. Returns `{ standard, matchedBy }`, where `matchedBy` is 'exact',
 * 'canonical' or null — a caller that logs 'canonical' makes the spelling mismatch
 * visible instead of silently papering over it.
 */
export function matchStandard(code, standards) {
  const list = (standards ?? []).filter((s) => s?.code);
  if (!code) return { standard: null, matchedBy: null };

  const exact = normalizeCode(code);
  const hitExact = list.find((s) => normalizeCode(s.code) === exact);
  if (hitExact) return { standard: hitExact, matchedBy: 'exact' };

  const canon = canonicalCcss(code);
  if (!canon) return { standard: null, matchedBy: null };
  const hitCanon = list.find((s) => canonicalCcss(s.code) === canon);
  return hitCanon ? { standard: hitCanon, matchedBy: 'canonical' } : { standard: null, matchedBy: null };
}
