// Fallback map for abbreviated HS codes → full KG-compatible codes.
// The graph stores HS standards with a cluster letter (HSA-REI.B.3) that the
// abbreviated form (A.REI.3) does not carry, so it cannot be derived — only mapped.
const HS_CODE_MAP = {
  'A.REI.3':  'HSA-REI.B.3',
  'A.REI.6':  'HSA-REI.C.6',
  'A.REI.12': 'HSA-REI.D.12',
  'A.CED.1':  'HSA-CED.A.1',
  'A.CED.2':  'HSA-CED.A.2',
  'A.CED.3':  'HSA-CED.A.3',
  'F.IF.7':   'HSF-IF.C.7',
};

/**
 * Normalize a CCSS code into the list of candidate statementCodes to OR together
 * in the graph query. Returns most-likely-match first.
 *
 * Fixed 2026-08: the previous version emitted `CCSS.Math.Content.HS${normalized}`
 * unconditionally, producing doubled prefixes such as
 * `CCSS.Math.Content.HSHSA-APR-A.1` for codes that already began with HS.
 */
export function normalizeCCSSCode(ccss) {
  if (!ccss) return [];

  const code = String(ccss).trim().replace(/^CCSS\.Math\.Content\./, '');
  if (!code) return [];

  const candidates = [];

  // Known abbreviated HS form → exact graph code. Highest confidence, so first.
  if (HS_CODE_MAP[code]) candidates.push(HS_CODE_MAP[code]);

  candidates.push(code);

  // High school codes look like `A.REI.3` / `A-REI.B.3`: a letter-only domain,
  // then the rest. The graph hyphenates the domain separator.
  if (/^[A-Z]+[.-]/.test(code)) {
    const firstDot = code.indexOf('.');
    if (firstDot > 0) {
      const hyphenated = `${code.slice(0, firstDot)}-${code.slice(firstDot + 1)}`;
      candidates.push(hyphenated);

      // Only prepend HS when it is not already present — this was the doubling bug.
      const withHs = hyphenated.startsWith('HS') ? hyphenated : `HS${hyphenated}`;
      candidates.push(withHs);
      candidates.push(`CCSS.Math.Content.${withHs}`);
    }
  }

  // Deduplicate, preserving order.
  return [...new Set(candidates.filter(Boolean))];
}
