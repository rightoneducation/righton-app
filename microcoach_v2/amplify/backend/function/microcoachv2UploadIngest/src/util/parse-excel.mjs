/**
 * Reads a Renaissance "Assessment Matrix" export: one row per student, one column
 * per question, with each answer column followed by its confidence column.
 *
 * The client de-identifies the export before upload, so a student is only a row
 * number. It is used within this file and not linked to any other upload.
 *
 * Column positions differ between exports (Week 10's answers start in D, Week 11's
 * in H), so everything is found from the labels in column A and the question header.
 *
 * Fill colour is what says whether an answer is correct. The report hides the letter
 * on a correct answer, so an empty cell means correct when green and skipped when
 * red. A fill that is neither throws: the export has changed, and guessing would
 * score students wrongly.
 *
 * A question's number is the one printed on the sheet (1, 3, 5...; the even numbers
 * are its confidence items), so what teachers read matches the paper in their hands.
 */

import * as XLSX from 'xlsx';

const GREEN = '9EE07D';
const RED = 'FF746B';

// A to D as they have always scored, so rubric confidence doesn't shift. E ("I have
// never seen this before") sits with D at the bottom of the scale.
const CONFIDENCE = { A: 5, B: 4, C: 3, D: 1, E: 1 };
const CONFIDENCE_ORDER = 'ABCDE';

/** A confidence letter, or an adjacent pair averaged. Anything else is unscored. */
function parseConfidence(raw) {
  const val = String(raw ?? '').trim().toUpperCase();
  if (val.length === 1) return CONFIDENCE[val] ?? null;
  if (val.length === 2 && CONFIDENCE[val[0]] != null && CONFIDENCE[val[1]] != null
    && CONFIDENCE_ORDER.indexOf(val[1]) === CONFIDENCE_ORDER.indexOf(val[0]) + 1) {
    return (CONFIDENCE[val[0]] + CONFIDENCE[val[1]]) / 2;
  }
  return null;
}

const fillOf = (cell) => String(cell?.s?.fgColor?.rgb ?? '').toUpperCase().slice(-6);

/**
 * @param {Buffer} buffer the .xlsx file
 * @returns {{ assessmentCode: string, assessmentToken: string, weekNumber: number,
 *   day: string, section: string | null, classPercentCorrect: number,
 *   questions: Array<{ questionNumber: number, docxQuestion: number, correctAnswer: string,
 *     classPercentCorrect: number }>,
 *   students: Array<{ studentRef: number, totalScore: number,
 *     questionResponses: Array<{ questionNumber: number, response: string | null,
 *       isCorrect: boolean, pointsEarned: number, confidence: number | null }> }> }}
 */
export function parseResults(buffer) {
  const workbook = XLSX.read(buffer, { cellStyles: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', blankrows: true, raw: true });

  const label = (row) => String(row?.[0] ?? '').trim();
  const rowLabelled = (pattern, name) => {
    const index = rows.findIndex((row) => pattern.test(label(row)));
    if (index === -1) throw new Error(`parseResults: no "${name}" row; this is not an Assessment Matrix export`);
    return index;
  };

  const titleRow = rows[rowLabelled(/^Assessment Matrix Report/i, 'Assessment Matrix Report')];
  const assessmentCode = label(titleRow).replace(/^[^:]*:\s*/, '').trim();
  const token = assessmentCode.match(/\.(W(\d+)-([A-Z]{3}))\./i);
  if (!token) throw new Error(`parseResults: no week and day in assessment code "${assessmentCode}"`);

  const header = rows[rowLabelled(/^Question$/i, 'Question')];
  const percents = rows[rowLabelled(/^Class Percent Correct/i, 'Class Percent Correct')];
  const keyRow = rows[rowLabelled(/^Points Possible/i, 'Points Possible/Correct Answer')];

  // A column with a key letter is a question; the keyless column after it is its
  // confidence question.
  const numbered = header.flatMap((cell, col) => (/^\d+$/.test(String(cell).trim()) ? [col] : []));
  const columns = [];
  numbered.forEach((col, i) => {
    const key = String(keyRow[col] ?? '').trim().toUpperCase();
    if (!/^[A-E]$/.test(key)) return;
    const next = numbered[i + 1];
    const hasConfidence = next != null && String(keyRow[next] ?? '').trim() === '';
    columns.push({ col, confidenceCol: hasConfidence ? next : null, key });
  });
  if (!columns.length) throw new Error('parseResults: no question has an answer key');

  const printedNumber = (col) => parseInt(String(header[col]).trim(), 10);
  const questions = columns.map(({ col, key }) => {
    const pct = parseFloat(String(percents[col] ?? ''));
    return {
      questionNumber: printedNumber(col),
      docxQuestion: printedNumber(col),
      correctAnswer: key,
      classPercentCorrect: Number.isNaN(pct) ? 0 : pct,
    };
  });

  const students = [];
  rows.forEach((row, r) => {
    const ref = label(row).match(/^(\d+)\.$/);
    if (!ref) return;
    const studentRef = parseInt(ref[1], 10);

    const questionResponses = columns.map(({ col, confidenceCol, key }) => {
      const cell = sheet[XLSX.utils.encode_cell({ r, c: col })];
      const letter = String(cell?.v ?? '').trim().toUpperCase();
      const fill = fillOf(cell);
      if (fill !== GREEN && fill !== RED) {
        throw new Error(`parseResults: student ${studentRef} Q${header[col]} has unexpected fill "${fill}"`);
      }
      const isCorrect = fill === GREEN;
      return {
        questionNumber: printedNumber(col),
        // A correct answer's letter is hidden; a red empty cell is a skipped question.
        response: isCorrect ? key : letter || null,
        isCorrect,
        pointsEarned: isCorrect ? 1 : 0,
        confidence: confidenceCol == null ? null : parseConfidence(row[confidenceCol]),
      };
    });

    // Worked out here: the report's own score divides by the confidence columns too.
    const correct = questionResponses.filter((q) => q.isCorrect).length;
    students.push({ studentRef, totalScore: correct / columns.length, questionResponses });
  });
  if (!students.length) throw new Error('parseResults: no student rows');

  // The footer records the report's filters. Cells keep their line breaks.
  const footer = rows.flat().map(String).find((cell) => /Section\(s\):/.test(cell));
  const section = footer?.match(/Section\(s\):\s*([^\r\n]*)/)?.[1].trim() ?? null;

  const classPercentCorrect = questions.reduce((sum, q) => sum + q.classPercentCorrect, 0) / questions.length;

  return {
    assessmentCode,
    assessmentToken: token[1].toUpperCase(),
    weekNumber: parseInt(token[2], 10),
    day: token[3].toUpperCase(),
    section,
    classPercentCorrect,
    questions,
    students,
  };
}
