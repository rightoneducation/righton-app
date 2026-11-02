/**
 * Deterministic parser for the answer-key table at the top of a PPQ.docx.
 *
 * The table gives, per question, the number as printed in the document, the correct
 * option letter and the standard assessed. Upload uses it to reconcile the
 * document's question numbering to the assessment's; ingest shows it to the model
 * alongside the document body.
 *
 * Expected shape of the mammoth raw text (header cells one per line, YOY empty so it
 * collapses out of the body):
 *
 *   Algebra I: Power Practice Quiz, Week 27 COACH
 *   Q | Correct Answer | Standard | YOY            <- header cells, one per line
 *   1
 *   A
 *   A.REI.12
 *   3
 *   B
 *   A.REI.3
 *   ...
 *   *Exemplar on the next page.                    <- table ends here
 *
 * ASSUMPTION (2026-09-15): this layout is inferred from the pilot documents minus
 * their Distractors column; no new-format document has been parsed yet. Verify
 * against a real one and adjust the header / block rules if the export differs.
 *
 * The pilot documents carried a teacher-authored Distractors column — four extra
 * lines per question describing each option. New documents do not, and the
 * pipeline no longer reads it. Any lines between a question's standard and the next
 * question number are skipped, so an old-format document still parses; its
 * distractor text is simply ignored.
 */

const LETTER = /^[A-E]$/;

/**
 * @param {string} ppqText  mammoth `extractRawText` output
 * @returns {{docxQuestion: number, correctAnswer: string, standard: string}[]}
 * @throws if the table is absent or a question block is malformed
 */
export function parsePpqTable(ppqText) {
  const lines = String(ppqText ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const headerIdx = lines.findIndex((l) => /^correct answer$/i.test(l));
  if (headerIdx === -1) {
    throw new Error('parsePpqTable: no "Correct Answer" header cell — this is not a PPQ answer key');
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

    if (!LETTER.test(correctAnswer)) {
      throw new Error(
        `parsePpqTable: Q${docxQuestion} correct answer "${correctAnswer}" is not an option letter. ` +
        `Column layout may have changed.`
      );
    }
    if (!standard || isQuestionNumber(standard)) {
      throw new Error(
        `parsePpqTable: Q${docxQuestion} has no standard cell. Column layout may have changed.`
      );
    }

    questions.push({ docxQuestion, correctAnswer, standard });

    // Skip to the next question number. Anything in between (the old Distractors
    // column, stray cells) is not read.
    i += 3;
    while (i < body.length && !isQuestionNumber(body[i])) i += 1;
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

/** Renders the answer key for a prompt: one line per question. */
export function formatAnswerKey(parsedTable) {
  return parsedTable
    .map((q) => `Q${q.docxQuestion}: correct ${q.correctAnswer} · ${q.standard}`)
    .join('\n');
}
