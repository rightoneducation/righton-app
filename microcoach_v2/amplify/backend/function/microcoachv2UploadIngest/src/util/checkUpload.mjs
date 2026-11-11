/**
 * Checks that stop an upload rather than let it produce results about the wrong
 * thing. Each throws with a message that lands on the upload row and in the email.
 */

// MIU 1 runs Monday; MIU 2 runs Thursday.
const DAY_FOR_TYPE = { PPQ: 'MON', POST_PPQ: 'THU' };

/** The spreadsheet belongs to this upload, and covers one section. */
export function checkResults(results, assessmentType) {
  const expected = DAY_FOR_TYPE[assessmentType];
  if (!expected) throw new Error(`Unknown assessment type "${assessmentType}"`);
  if (results.day !== expected) {
    throw new Error(
      `The ${assessmentType} upload needs the ${expected} results, but this spreadsheet is ${results.assessmentCode}`,
    );
  }
  // Without a section filter the numbers describe the grade, not this teacher's class.
  if (!results.section || /^all$/i.test(results.section)) {
    throw new Error(
      `The spreadsheet isn't filtered to one section (Section(s): ${results.section ?? 'not stated'})`,
    );
  }
}

/** The document and the spreadsheet describe the same questions. Keys: see rescore. */
export function checkAgreement(results, doc) {
  const docNumbers = doc.questions.map((q) => q.docxQuestion).join(',');
  const sheetNumbers = results.questions.map((q) => q.docxQuestion).join(',');
  if (docNumbers !== sheetNumbers) {
    throw new Error(`The document has questions ${docNumbers}, but the spreadsheet has ${sheetNumbers}`);
  }
}
