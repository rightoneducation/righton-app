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
      const result = [
        normalized,
        `CCSS.Math.Content.HS${normalized}`  // Also try full format
      ];
      return result;
    }
  }
}