// Fallback map for abbreviated HS codes → full KG-compatible codes
const HS_CODE_MAP = {
  'A.REI.3':  'HSA-REI.B.3',
  'A.REI.6':  'HSA-REI.C.6',
  'A.REI.12': 'HSA-REI.D.12',
  'A.CED.1':  'HSA-CED.A.1',
  'A.CED.2':  'HSA-CED.A.2',
  'A.CED.3':  'HSA-CED.A.3',
  'F.IF.7':   'HSF-IF.C.7',
};

// Normalize CCSS code to match database format
export function normalizeCCSSCode(ccss) {
  // Remove any "CCSS.Math.Content." prefix if present
  let code = ccss.replace(/^CCSS\.Math\.Content\./, '');

  // Check if it's a high school code (starts with letter like A-REI, F-IF, etc.)
  const hsPattern = /^([A-Z]+)[.\-](.+)$/;
  const hsMatch = code.match(hsPattern);
  
  if (hsMatch) {
    // High school: format is domain-cluster.standard (e.g., A-REI.1)
    // Replace only the FIRST dot with hyphen, keep remaining dots
    const firstDotIndex = code.indexOf('.');
    if (firstDotIndex > 0) {
      const normalized = code.substring(0, firstDotIndex) + '-' + code.substring(firstDotIndex + 1);
      const candidates = [
        normalized,
        `CCSS.Math.Content.HS${normalized}`  // Also try full format
      ];
      // If we have a known full KG code for this abbreviated form, prepend it
      if (HS_CODE_MAP[code]) {
        return [HS_CODE_MAP[code], ...candidates];
      }
      return candidates;
    }
  }
  // Fallback: return the code as-is (e.g. 8.EE.C.7) so the query has at least one option
  return [code];
}