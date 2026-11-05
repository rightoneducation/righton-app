/**
 * Reads one assessment out of the client's Mix It Up document.
 *
 * The document holds a week's assessments together (Monday MIU 1, Thursday MIU 2),
 * each under its assessment code, with answer keys listed once near the top:
 *
 *   Monday Answer Key:             <- letters only, Word numbers them 1, 3, 5...
 *   Thursday Answer Key:           <- typed as "1. A"
 *   MAT.07.MIXU.W11-MON.26-27...   <- code, then a table of questions
 *
 * It reads word/document.xml rather than using mammoth, which silently drops every
 * equation: the math in stems and options is Word equations (OMML), and an option
 * can be nothing but an equation. Those become LaTeX in $...$, the form the pipeline
 * already writes and the app already renders. Option letters are Word auto-numbering
 * and appear nowhere in the text, so they come from position in the list.
 *
 * Anything unexpected throws: a wrong parse would produce confident misconceptions
 * about the wrong question.
 */

import JSZip from 'jszip';
import { DOMParser } from '@xmldom/xmldom';

const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const M = 'http://schemas.openxmlformats.org/officeDocument/2006/math';

const DAY_NAMES = { MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday' };
const OPTION_COUNT = 4;

const LATEX_SYMBOLS = {
  '÷': '\\div ',
  '×': '\\times ',
  '·': '\\cdot ',
  '−': '-',
  '≤': '\\le ',
  '≥': '\\ge ',
  '≠': '\\ne ',
  '°': '^{\\circ}',
};

const elements = (node) => {
  const out = [];
  for (let c = node?.firstChild; c; c = c.nextSibling) {
    if (c.nodeType === 1) out.push(c);
  }
  return out;
};
const isEl = (el, ns, name) => el.namespaceURI === ns && el.localName === name;
const child = (el, ns, name) => elements(el).find((c) => isEl(c, ns, name)) ?? null;
const children = (el, ns, name) => elements(el).filter((c) => isEl(c, ns, name));

// ── Equations ────────────────────────────────────────────────────────────────

const latexText = (text) => [...text].map((ch) => LATEX_SYMBOLS[ch] ?? ch).join('');
const inner = (el) => (el ? elements(el).map(ommlToLatex).join('') : '');

function ommlToLatex(el) {
  if (el.namespaceURI !== M) return '';
  switch (el.localName) {
    case 't':
      return latexText(el.textContent ?? '');
    case 'f':
      return `\\frac{${inner(child(el, M, 'num'))}}{${inner(child(el, M, 'den'))}}`;
    case 'd': {
      const pr = child(el, M, 'dPr');
      const attr = (name) => {
        const node = pr && child(pr, M, name);
        return node ? node.getAttributeNS(M, 'val') : null;
      };
      const open = attr('begChr') ?? '(';
      const close = attr('endChr') ?? ')';
      const body = children(el, M, 'e').map(inner).join(attr('sepChr') ?? ',');
      return `${open}${body}${close}`;
    }
    case 'sSup':
      return `{${inner(child(el, M, 'e'))}}^{${inner(child(el, M, 'sup'))}}`;
    case 'sSub':
      return `{${inner(child(el, M, 'e'))}}_{${inner(child(el, M, 'sub'))}}`;
    case 'rad': {
      const degree = inner(child(el, M, 'deg'));
      return `\\sqrt${degree ? `[${degree}]` : ''}{${inner(child(el, M, 'e'))}}`;
    }
    default:
      // Property elements carry no content; every other wrapper (r, e, oMathPara...)
      // is just its children.
      return el.localName.endsWith('Pr') ? '' : inner(el);
  }
}

// ── Paragraphs ───────────────────────────────────────────────────────────────

/** A paragraph's text, with equations as $...$ and tracked deletions left out. */
function paragraphText(p) {
  let out = '';
  const walk = (el) => {
    if (isEl(el, M, 'oMath')) {
      out += `$${ommlToLatex(el)}$`;
      return;
    }
    if (el.namespaceURI === W) {
      if (el.localName === 't') { out += el.textContent ?? ''; return; }
      if (el.localName === 'tab' || el.localName === 'br') { out += ' '; return; }
      if (el.localName === 'del' || el.localName === 'pPr' || el.localName === 'drawing') return;
    }
    elements(el).forEach(walk);
  };
  walk(p);
  return out.replace(/\s+/g, ' ').trim();
}

const isListItem = (p) => {
  const numId = child(child(p, W, 'pPr') ?? p, W, 'numPr');
  const id = numId && child(numId, W, 'numId')?.getAttributeNS(W, 'val');
  return Boolean(id) && id !== '0';
};

/** The body's paragraphs and tables in document order, unwrapping content controls. */
function blocks(parent) {
  return elements(parent).flatMap((el) => {
    if (isEl(el, W, 'p') || isEl(el, W, 'tbl')) return [el];
    if (isEl(el, W, 'sdt')) return blocks(child(el, W, 'sdtContent'));
    return [];
  });
}

// ── The document ─────────────────────────────────────────────────────────────

/**
 * The letters listed under "<Day> Answer Key:". Monday's are bare letters (Word
 * supplies the numbers); Thursday's are typed "1. A", so a number is optional.
 */
function readAnswerKey(allBlocks, dayName) {
  const heading = allBlocks.findIndex(
    (b) => isEl(b, W, 'p') && new RegExp(`^${dayName} Answer Key:?$`, 'i').test(paragraphText(b)),
  );
  if (heading === -1) throw new Error(`parseMiuDoc: no "${dayName} Answer Key" in the document`);

  const key = [];
  for (let i = heading + 1; i < allBlocks.length && isEl(allBlocks[i], W, 'p'); i += 1) {
    const text = paragraphText(allBlocks[i]);
    if (text) {
      const match = text.match(/^(?:(\d+)\s*\.\s*)?([A-E])$/);
      if (!match) break;
      key.push({ number: match[1] ? parseInt(match[1], 10) : null, letter: match[2] });
    }
  }
  if (!key.length) throw new Error(`parseMiuDoc: "${dayName} Answer Key" lists no answers`);
  return key;
}

/** One table row as a question, or null for a confidence row (it has no standard). */
function readQuestionRow(row, warnings) {
  const cells = children(row, W, 'tc');
  if (cells.length < 3) return null;
  const firstText = (cell) => blocks(cell).map((b) => (isEl(b, W, 'p') ? paragraphText(b) : '')).join(' ').trim();

  const docxQuestion = parseInt(firstText(cells[0]), 10);
  const standard = firstText(cells[1]);
  if (!Number.isInteger(docxQuestion) || !standard) return null;

  const stem = [];
  const options = [];
  blocks(cells[2]).filter((b) => isEl(b, W, 'p')).forEach((p) => {
    const text = paragraphText(p);
    if (!text) return;
    if (isListItem(p)) options.push(text);
    else if (/^How confident/i.test(text)) {
      // Week 11 Monday Q9 carries a stray confidence line above its stem.
      warnings.push(`Q${docxQuestion}: ignored stray line in the stem: "${text}"`);
    } else stem.push(text);
  });
  if (!stem.length) throw new Error(`parseMiuDoc: Q${docxQuestion} has no question text`);
  if (options.length !== OPTION_COUNT) {
    throw new Error(`parseMiuDoc: Q${docxQuestion} has ${options.length} answer options, expected ${OPTION_COUNT}`);
  }
  return { docxQuestion, standard, questionText: stem.join(' '), options };
}

/**
 * @param {Buffer} buffer the .docx file
 * @param {string} token  the assessment within it, e.g. "W11-MON" (see parseResults)
 * @param {string} [keyToken] take the answer key from this assessment instead
 * @returns {Promise<{ questions: Array<{ docxQuestion: number, standard: string,
 *   questionText: string, correctAnswer: string,
 *   answerChoices: Array<{ letter: string, content: string, isCorrect: boolean }> }>,
 *   warnings: string[] }>}
 */
export async function parseMiuDoc(buffer, token, keyToken = token) {
  const zip = await JSZip.loadAsync(buffer);
  const file = zip.file('word/document.xml');
  if (!file) throw new Error('parseMiuDoc: not a Word document (no word/document.xml)');
  const xml = new DOMParser().parseFromString(await file.async('string'), 'text/xml');
  const allBlocks = blocks(child(xml.documentElement, W, 'body'));

  const dayName = DAY_NAMES[keyToken.split('-')[1]];
  if (!dayName) throw new Error(`parseMiuDoc: unknown day in assessment "${keyToken}"`);

  // The code line, then the first table after it. The separator is matched loosely:
  // the same code has been written USI.COACH and USI_COACH across the client's files.
  const codePattern = new RegExp(`\\.${token}\\.`, 'i');
  const codeAt = allBlocks.findIndex((b) => isEl(b, W, 'p') && codePattern.test(paragraphText(b)));
  if (codeAt === -1) throw new Error(`parseMiuDoc: the document has no assessment ${token}`);
  const table = allBlocks.slice(codeAt + 1).find((b) => isEl(b, W, 'tbl'));
  if (!table) throw new Error(`parseMiuDoc: no question table after assessment ${token}`);

  const warnings = [];
  const rows = children(table, W, 'tr')
    .map((row) => readQuestionRow(row, warnings))
    .filter(Boolean);
  if (!rows.length) throw new Error(`parseMiuDoc: assessment ${token} has no questions`);

  const key = readAnswerKey(allBlocks, dayName);
  if (key.length !== rows.length) {
    throw new Error(`parseMiuDoc: ${dayName} key lists ${key.length} answers for ${rows.length} questions`);
  }

  const questions = rows.map((row, i) => {
    const { number, letter } = key[i];
    if (number != null && number !== row.docxQuestion) {
      throw new Error(`parseMiuDoc: ${dayName} key line ${i + 1} is Q${number}, expected Q${row.docxQuestion}`);
    }
    const answerChoices = row.options.map((content, o) => {
      const optionLetter = String.fromCharCode(65 + o);
      return { letter: optionLetter, content, isCorrect: optionLetter === letter };
    });
    if (!answerChoices.some((choice) => choice.isCorrect)) {
      throw new Error(`parseMiuDoc: Q${row.docxQuestion}'s key letter ${letter} is not one of its options`);
    }
    return {
      docxQuestion: row.docxQuestion,
      standard: row.standard,
      questionText: row.questionText,
      correctAnswer: letter,
      answerChoices,
    };
  });

  return { questions, warnings };
}
