/**
 * generate-confidence.ts
 *
 * Reads each PPQ-StudentData.xlsx, generates synthetic confidence values
 * (1–5) per student per question, and writes them back as Q1_Conf…Q6_Conf
 * columns appended after the last question column.
 *
 * Run from api/:
 *   npx ts-node src/seed/generate-confidence.ts
 *
 * Safe to re-run — skips files that already have _Conf columns.
 */

import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

const DATA_ROOT = path.resolve(__dirname, '../../../Data');

const TARGETS: Array<{ rel: string; format: 'generated' | 'matrix' }> = [
  { rel: 'Classroom1/Session1/PPQ-StudentData.xlsx',     format: 'generated' },
  { rel: 'Classroom2/Session1/PPQ-StudentData.xlsx',     format: 'matrix'    },
  { rel: 'Classroom3/Session1/PPQ-StudentData.xlsx',     format: 'matrix'    },
];

// ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
function makePrng(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randBetween(rng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

// ── Confidence generation ────────────────────────────────────────────────────
/**
 * Returns a confidence value (1–5) for one student×question pair.
 *
 * First 5% of students (minimum 4) get deterministic profile assignments that
 * guarantee all four meaningful pattern combinations appear at class scale:
 *   Profile 0 & 2 → always high confidence (4–5)
 *   Profile 1 & 3 → always low confidence  (1–2)
 * Combined with their actual correct/wrong answers this yields HC+C, LC+C,
 * HC+W, and LC+W across the seeded population.
 *
 * Remaining students use probabilistic assignment:
 *   Correct:  60% HC(4–5), 15% LC(1–2), 25% MC(3)
 *   Wrong:    45% LC(1–2), 30% HC(4–5), 25% MC(3)
 */
function generateConfidence(
  rng: () => number,
  isCorrect: boolean,
  studentIdx: number,
  numStudents: number
): number {
  const seedCount = Math.max(4, Math.ceil(numStudents * 0.05));

  if (studentIdx < seedCount) {
    const profile = studentIdx % 4;
    return profile === 0 || profile === 2
      ? randBetween(rng, 4, 5)   // HC profiles
      : randBetween(rng, 1, 2);  // LC profiles
  }

  const r = rng();
  if (isCorrect) {
    if (r < 0.60) return randBetween(rng, 4, 5);  // HC+C: 60%
    if (r < 0.75) return randBetween(rng, 1, 2);  // LC+C: 15%
    return 3;                                       // MC+C: 25%
  } else {
    if (r < 0.45) return randBetween(rng, 1, 2);  // LC+W: 45%
    if (r < 0.75) return randBetween(rng, 4, 5);  // HC+W: 30%
    return 3;                                       // MC+W: 25%
  }
}

// ── Per-file processor ───────────────────────────────────────────────────────
function processFile(filePath: string, format: 'generated' | 'matrix'): void {
  console.log(`\nProcessing: ${path.relative(DATA_ROOT, filePath)}`);

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  const isMatrix = format === 'matrix';

  // ── Find question columns from header row (row index 2) ───────────────────
  const headerRow: any[] = rows[2] ?? [];
  const questionColumns: number[] = [];
  const questionNumbers: number[] = [];
  for (let col = 0; col < headerRow.length; col++) {
    const cell = String(headerRow[col] ?? '').trim();
    const m = cell.match(/^q?(\d+)$/i);
    if (m) {
      questionColumns.push(col);
      questionNumbers.push(parseInt(m[1], 10));
    }
  }

  if (questionColumns.length === 0) {
    console.warn('  No question columns found — skipping');
    return;
  }

  // Skip if confidence columns already exist
  if (headerRow.some((h: any) => String(h).includes('_Conf'))) {
    console.log('  Confidence columns already present — skipping');
    return;
  }

  // ── Answer key ────────────────────────────────────────────────────────────
  const answerKeyRowIdx = isMatrix ? 6 : 7;
  const keyRow: any[] = rows[answerKeyRowIdx] ?? [];
  const answerKeyByCol: Record<number, string> = {};
  for (const col of questionColumns) {
    const val = String(keyRow[col] ?? '').trim().toUpperCase();
    if (val.length === 1 && 'ABCDE'.includes(val)) {
      answerKeyByCol[col] = val;
    }
  }

  // ── Collect student row indices ───────────────────────────────────────────
  const studentStartRow = isMatrix ? 7 : 8;
  const nameCol = isMatrix ? 1 : 0;
  const studentRowIndices: number[] = [];
  for (let r = studentStartRow; r < rows.length; r++) {
    const name = String(rows[r][nameCol] ?? '').trim();
    if (!name) continue;
    if (name.toLowerCase().includes('total') || name.toLowerCase().includes('average')) continue;
    studentRowIndices.push(r);
  }

  const numStudents = studentRowIndices.length;
  console.log(`  ${numStudents} students, ${questionColumns.length} questions`);

  // ── Append confidence headers after last question column ──────────────────
  const confColStart = Math.max(...questionColumns) + 1;
  for (let qi = 0; qi < questionNumbers.length; qi++) {
    const confCol = confColStart + qi;
    while (rows[2].length <= confCol) rows[2].push('');
    rows[2][confCol] = `Q${questionNumbers[qi]}_Conf`;
  }

  // ── Generate and write confidence values ──────────────────────────────────
  const rng = makePrng(0xdeadbeef);
  const confidencesByQuestion: number[][] = questionColumns.map(() => []);

  studentRowIndices.forEach((rowIdx, studentIdx) => {
    const row = rows[rowIdx];
    for (let qi = 0; qi < questionColumns.length; qi++) {
      const qCol = questionColumns[qi];
      const confCol = confColStart + qi;
      const rawResponse = String(row[qCol] ?? '').trim().toUpperCase();
      const correctAnswer = answerKeyByCol[qCol] ?? '';

      const isCorrect = isMatrix
        ? rawResponse === ''
        : rawResponse !== '' && rawResponse === correctAnswer;

      const conf = generateConfidence(rng, isCorrect, studentIdx, numStudents);
      while (row.length <= confCol) row.push('');
      row[confCol] = conf;
      confidencesByQuestion[qi].push(conf);
    }
  });

  // ── For generated format, write avgConfidence to class % row (row 3) ──────
  if (!isMatrix) {
    const classRow: any[] = rows[3] ?? [];
    rows[3] = classRow;
    for (let qi = 0; qi < questionNumbers.length; qi++) {
      const confCol = confColStart + qi;
      while (rows[3].length <= confCol) rows[3].push('');
      const vals = confidencesByQuestion[qi];
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      rows[3][confCol] = parseFloat(avg.toFixed(2));
    }
  }

  // ── Write back ────────────────────────────────────────────────────────────
  workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(rows);
  XLSX.writeFile(workbook, filePath);
  console.log('  ✓ Written');
}

// ── Main ─────────────────────────────────────────────────────────────────────
function main(): void {
  console.log('=== Generate Confidence Columns ===');
  for (const target of TARGETS) {
    const filePath = path.join(DATA_ROOT, target.rel);
    if (!fs.existsSync(filePath)) {
      console.warn(`\nFile not found: ${filePath}`);
      continue;
    }
    processFile(filePath, target.format);
  }
  console.log('\n=== Done ===');
}

main();
