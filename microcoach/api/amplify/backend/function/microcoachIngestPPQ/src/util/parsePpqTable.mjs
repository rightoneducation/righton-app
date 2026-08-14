/**
 * Deterministic parser for the answer-option table at the top of a PPQ.docx.
 *
 * This is the only place in the pipeline that ever sees answer-option text. The
 * ingest model is shown the table so it can attribute misconceptions to specific
 * options; every stage after this one has nothing but a correct-answer letter.
 *
 * Shape of the mammoth raw text (verified against all four pilot documents):
 *
 *   Algebra I: Power Practice Quiz, Week 27 COACH
 *   Q | Correct Answer | Standard | YOY | Distractors      <- header cells, one per line
 *   1
 *   A
 *   A.REI.12
 *   Correct
 *   Chose graph with slope of -6 (did not convert to slope-intercept)
 *   ...
 *   3
 *   ...
 *   *Exemplar on the next page.                            <- table ends here
 *
 * The YOY column is empty in every document, so it collapses out of the raw text
 * entirely and a question block reads [number, letter, standard, ...4 distractors].
 * If YOY is ever populated the slice shifts by one, which is why the option count
 * is asserted rather than assumed.
 */

const CORRECT_MARKER = /^correct\b/i;   // matches both "Correct" and "Correct Answer"
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E'];
const EXPECTED_OPTIONS = 4;

/**
 * @param {string} ppqText  mammoth `extractRawText` output
 * @returns {{docxQuestion: number, correctAnswer: string, standard: string,
 *            options: {letter: string, text: string, isCorrect: boolean}[]}[]}
 * @throws if the table is absent, malformed, or fails the correct-answer checksum
 */
export function parsePpqTable(ppqText) {
  const lines = String(ppqText ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const headerIdx = lines.findIndex((l) => l === 'Distractors');
  if (headerIdx === -1) {
    throw new Error('parsePpqTable: no "Distractors" header cell — this is not a PPQ table');
  }

  const endIdx = lines.findIndex((l, i) => i > headerIdx && /^\*?Exemplar/i.test(l));
  const body = lines.slice(headerIdx + 1, endIdx === -1 ? undefined : endIdx);

  const isQuestionNumber = (l) => /^\d+$/.test(l);
  const questions = [];

  let i = 0;
  while (i < body.length) {
    if (!isQuestionNumber(body[i])) { i += 1; continue; }

    const docxQuestion = parseInt(body[i], 10);
    const correctAnswer = (body[i + 1] ?? '').trim().toUpperCase();
    const standard = (body[i + 2] ?? '').trim();

    let j = i + 3;
    const distractors = [];
    while (j < body.length && !isQuestionNumber(body[j])) {
      distractors.push(body[j]);
      j += 1;
    }

    // Guards the YOY-collapse assumption above. A block that does not yield exactly
    // four options means the column layout changed, and every letter assignment
    // after this point would be silently wrong.
    if (distractors.length !== EXPECTED_OPTIONS) {
      throw new Error(
        `parsePpqTable: Q${docxQuestion} yielded ${distractors.length} options, expected ${EXPECTED_OPTIONS}. ` +
        `Column layout may have changed. Got: ${JSON.stringify(distractors)}`
      );
    }

    const options = distractors.map((text, idx) => ({
      letter: OPTION_LETTERS[idx],
      text,
      isCorrect: CORRECT_MARKER.test(text),
    }));

    // Checksum: the document states the correct answer twice — once as a letter in
    // the "Correct Answer" column, once as the position of the "Correct" entry in
    // the distractor list. They must agree, or the position→letter mapping that the
    // whole linkage depends on is not trustworthy for this question.
    const markerIdx = options.findIndex((o) => o.isCorrect);
    const expectedIdx = OPTION_LETTERS.indexOf(correctAnswer);
    if (markerIdx === -1) {
      throw new Error(`parsePpqTable: Q${docxQuestion} has no option marked "Correct"`);
    }
    if (markerIdx !== expectedIdx) {
      throw new Error(
        `parsePpqTable: Q${docxQuestion} checksum failed — "Correct" sits at position ${markerIdx} ` +
        `(${OPTION_LETTERS[markerIdx]}) but the answer key says ${correctAnswer}`
      );
    }

    questions.push({ docxQuestion, correctAnswer, standard, options });
    i = j;
  }

  if (questions.length === 0) {
    throw new Error('parsePpqTable: found the header but no question rows');
  }
  return questions;
}

/**
 * The document numbers questions 1,3,5,7,9,11 (matching the spreadsheet's
 * interleaved answer/confidence column headers). The Excel parser resequences to
 * 1..N. The mapping between them is ordinal position, and the correct-answer letter
 * sequence is the proof — so it is asserted rather than trusted.
 *
 * @param {{docxQuestion: number, correctAnswer: string}[]} parsedTable
 * @param {{questionNumber: number, correctAnswer: string}[]} storedQuestions
 * @returns {Map<number, number>} docxQuestion -> stored questionNumber
 */
export function reconcileQuestionNumbers(parsedTable, storedQuestions) {
  if (parsedTable.length !== storedQuestions.length) {
    throw new Error(
      `reconcileQuestionNumbers: document has ${parsedTable.length} questions but the ` +
      `assessment has ${storedQuestions.length} — cannot map positionally`
    );
  }

  const map = new Map();
  for (let k = 0; k < parsedTable.length; k += 1) {
    const fromDoc = (parsedTable[k].correctAnswer ?? '').trim().toUpperCase();
    const fromSheet = (storedQuestions[k].correctAnswer ?? '').trim().toUpperCase();
    if (fromDoc !== fromSheet) {
      throw new Error(
        `reconcileQuestionNumbers: position ${k} disagrees — document Q${parsedTable[k].docxQuestion} ` +
        `says ${fromDoc}, assessment Q${storedQuestions[k].questionNumber} says ${fromSheet}`
      );
    }
    map.set(parsedTable[k].docxQuestion, storedQuestions[k].questionNumber);
  }
  return map;
}

/** Renders the table for a prompt, so the model selects options instead of inventing them. */
export function formatOptionTable(parsedTable) {
  return parsedTable
    .map((q) => {
      const opts = q.options
        .map((o) => `  ${o.letter}. ${o.text}`)
        .join('\n');
      return `Q${q.docxQuestion}  (correct answer: ${q.correctAnswer}, standard: ${q.standard})\n${opts}`;
    })
    .join('\n\n');
}
