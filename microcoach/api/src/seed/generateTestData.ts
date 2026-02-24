/**
 * generateTestData.ts — create synthetic PPQ and PostPPQ Excel files for Classroom1
 *
 * Generates realistic Grade 6 / 6.NS.A.1 (Dividing Fractions) test data
 * in the exact format expected by the upload.ts parser.
 *
 * Output:
 *   Data/Classroom1/Session1/PPQ-StudentData.xlsx      — 60 students, 6 questions
 *   Data/Classroom1/Session1/PostPPQ-StudentData.xlsx  — 59 students, 1 question
 *
 * Usage:
 *   cd api && npx ts-node src/seed/generateTestData.ts
 */

import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import { DATA_ROOT } from './seedData';

// ── Seeded PRNG — reproducible results on every run ──────────────────────────
let _seed = 20250224;
function rand(): number {
  _seed = (_seed * 1664525 + 1013904223) & 0x7fffffff;
  return _seed / 0x7fffffff;
}
function randBool(p: number): boolean {
  return rand() < p;
}
function weightedPick<T>(choices: Array<{ value: T; weight: number }>): T {
  const total = choices.reduce((s, c) => s + c.weight, 0);
  let r = rand() * total;
  for (const c of choices) {
    r -= c.weight;
    if (r <= 0) return c.value;
  }
  return choices[choices.length - 1].value;
}

// ── Student names ─────────────────────────────────────────────────────────────
const FIRST = [
  'Alice','Brandon','Chloe','David','Emma','Fiona','George','Hannah',
  'Isaac','Julia','Kevin','Laura','Marcus','Nina','Oliver','Priya',
  'Quinn','Rachel','Samuel','Tara','Uma','Victor','Wendy','Xavier',
  'Yasmine','Zach','Amber','Brian','Carmen','Derek','Elena','Felix',
  'Grace','Henry','Iris','Jason','Kira','Liam','Mia','Nathan',
  'Olivia','Peter','Quincy','Rosa','Steve','Tina','Ursula','Vincent',
  'Willa','Xander','Yara','Zoe','Adrian','Bella','Caleb','Diana',
  'Ethan','Faith','Gavin','Harper',
];
const LAST = [
  'Adams','Baker','Chen','Davis','Evans','Foster','Garcia','Harris',
  'Ivanov','Johnson','Kim','Lewis','Martinez','Nelson','Okafor','Patel',
  'Quinn','Rivera','Smith','Taylor','Upton','Vasquez','Wang','Xavier',
  'Young','Zhang','Anderson','Brown','Clark','Diaz','Edwards','Flores',
  'Green','Hill','Jackson','King','Lee','Moore','Nguyen','Ortiz',
  'Perez','Roberts','Sanchez','Thomas','Turner','Walker','White','Wilson',
  'Wood','Wright','Allen','Bailey','Bell','Brooks','Campbell','Carter',
  'Collins','Cook','Cooper','Cox',
];

function makeStudentRoster(count: number): Array<{ name: string; externalId: string }> {
  return Array.from({ length: count }, (_, i) => ({
    name: `${FIRST[i % FIRST.length]} ${LAST[Math.floor(i / FIRST.length) % LAST.length] ?? LAST[i % LAST.length]}`,
    externalId: `S${String(i + 1).padStart(3, '0')}`,
  }));
}

// ── Question definitions — 6.NS.A.1 (Dividing Fractions) ────────────────────
//
// Each question has:
//   correctAnswer : 'A'|'B'|'C'|'D'
//   targetClassPct: expected class-wide correct rate (baked into generated data)
//   distractors   : wrong choices with relative frequency weights
//                   (weights represent how tempting each wrong answer is)

interface QuestionDef {
  number: number;
  label: string;           // human-readable label for terminal output
  ccss: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  targetClassPct: number;
  distractors: Array<{ choice: 'A' | 'B' | 'C' | 'D'; label: string; weight: number }>;
}

const QUESTIONS: QuestionDef[] = [
  {
    number: 1,
    label: '3/4 ÷ 1/2',
    ccss: '6.NS.A.1',
    correctAnswer: 'A',      // 3/2 = 1½
    targetClassPct: 0.67,
    distractors: [
      { choice: 'B', label: '3/8  (multiplied straight across)',  weight: 3 },
      { choice: 'C', label: '1/2  (kept divisor, dropped dividend)', weight: 1 },
      { choice: 'D', label: '2/3  (inverted dividend instead)', weight: 2 },
    ],
  },
  {
    number: 2,
    label: '2/3 ÷ 4/5',
    ccss: '6.NS.A.1',
    correctAnswer: 'B',      // 5/6
    targetClassPct: 0.52,
    distractors: [
      { choice: 'A', label: '8/15 (multiplied straight across)',  weight: 3 },
      { choice: 'C', label: '10/12 (multiplied, did not simplify)', weight: 2 },
      { choice: 'D', label: '1/2  (guessed)',                     weight: 1 },
    ],
  },
  {
    number: 3,
    label: '1½ ÷ 3/4',
    ccss: '6.NS.A.1',
    correctAnswer: 'B',      // 2 (convert mixed number first: 3/2 ÷ 3/4 = 3/2 × 4/3 = 2)
    targetClassPct: 0.43,
    distractors: [
      { choice: 'A', label: '9/8  (did not convert 1½ to improper)', weight: 3 },
      { choice: 'C', label: '1/2  (inverted dividend)',              weight: 2 },
      { choice: 'D', label: '3/8  (multiplied straight across)',     weight: 1 },
    ],
  },
  {
    number: 4,
    label: '5/6 ÷ 5/3',
    ccss: '6.NS.A.1',
    correctAnswer: 'A',      // 1/2
    targetClassPct: 0.38,
    distractors: [
      { choice: 'B', label: '25/18 (multiplied straight across)',   weight: 3 },
      { choice: 'C', label: '5/18  (wrong cancellation)',           weight: 2 },
      { choice: 'D', label: '5/2   (inverted dividend)',            weight: 1 },
    ],
  },
  {
    number: 5,
    label: '4 ÷ 2/3',
    ccss: '6.NS.A.1',
    correctAnswer: 'B',      // 6 (4 × 3/2 = 6)
    targetClassPct: 0.55,
    distractors: [
      { choice: 'A', label: '8/3  (4 × 2/3 instead of ÷)',         weight: 2 },
      { choice: 'C', label: '8/12 (multiplied by 2/3)',             weight: 3 },
      { choice: 'D', label: '4/3  (partial operation)',             weight: 1 },
    ],
  },
  {
    number: 6,
    label: 'Word problem: 3 cups ÷ 3/4 cup per batch',
    ccss: '6.NS.A.1',
    correctAnswer: 'C',      // 4 batches
    targetClassPct: 0.33,
    distractors: [
      { choice: 'A', label: '2¼  (multiplied instead of divided)', weight: 2 },
      { choice: 'B', label: '2   (subtracted 3/4 twice)',          weight: 3 },
      { choice: 'D', label: '3½  (guessed)',                       weight: 1 },
    ],
  },
];

// PostPPQ targets Q4 (was 38% → improves to 71% after RTD)
const POST_PPQ_QUESTION: QuestionDef = {
  ...QUESTIONS[3], // Q4: 5/6 ÷ 5/3 = 1/2
  targetClassPct: 0.712,
};

// ── Response generation ───────────────────────────────────────────────────────
//
// Students are divided into three tiers. For each question, a student's
// probability of answering correctly is: clamp(tierBase + deviation, 0.05, 0.95)
// where deviation = (q.targetClassPct - 0.48) × 0.6
//
// Tiers:   high  (12 students, 20%) — base 0.82
//          mid   (30 students, 50%) — base 0.48 (tracks class average)
//          low   (18 students, 30%) — base 0.18

type Tier = 'high' | 'mid' | 'low';
const TIER_BASE: Record<Tier, number> = { high: 0.82, mid: 0.48, low: 0.18 };
const AVG_DIFFICULTY = QUESTIONS.reduce((s, q) => s + q.targetClassPct, 0) / QUESTIONS.length; // ≈0.48

function pCorrect(tier: Tier, q: QuestionDef): number {
  const deviation = (q.targetClassPct - AVG_DIFFICULTY) * 0.6;
  return Math.min(Math.max(TIER_BASE[tier] + deviation, 0.05), 0.95);
}

function generateResponse(tier: Tier, q: QuestionDef): string {
  if (randBool(pCorrect(tier, q))) return q.correctAnswer;
  return weightedPick(q.distractors.map((d) => ({ value: d.choice, weight: d.weight })));
}

function assignTiers(count: number): Tier[] {
  const highCount = Math.round(count * 0.20);
  const lowCount  = Math.round(count * 0.30);
  const midCount  = count - highCount - lowCount;
  const tiers: Tier[] = [
    ...Array(highCount).fill('high' as Tier),
    ...Array(midCount).fill('mid' as Tier),
    ...Array(lowCount).fill('low' as Tier),
  ];
  // Shuffle using seeded PRNG so tier assignment isn't alphabetical
  for (let i = tiers.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [tiers[i], tiers[j]] = [tiers[j], tiers[i]];
  }
  return tiers;
}

// ── Excel builder ─────────────────────────────────────────────────────────────
//
// Column layout (matches upload.ts parser expectations):
//   col 0 : Name / row labels
//   col 1 : Student ID / empty
//   col 2 : Score / empty
//   col 3+: Q1, Q2, Q3, ... (question data columns)
//
// Row layout (0-indexed):
//   0: assessment code
//   1: CCSS standards (one per question column)
//   2: question headers ("Q1", "Q2", ...)
//   3: class % correct per question
//   4-6: blank metadata rows
//   7: answer key
//   8+: student rows

function buildWorksheet(
  assessmentCode: string,
  questions: QuestionDef[],
  students: Array<{ name: string; externalId: string }>,
  tiers: Tier[],
  actualClassPcts: number[]    // filled in after generation
): XLSX.WorkSheet {
  const Q_START_COL = 3; // questions begin at column index 3
  const numCols = Q_START_COL + questions.length;

  // Generate student responses first so we can compute actual class %
  const studentResponses: string[][] = students.map((s, si) =>
    questions.map((q) => generateResponse(tiers[si], q))
  );

  // Compute actual per-question class %
  const computedClassPcts = questions.map((q, qi) => {
    const correct = studentResponses.filter((r) => r[qi] === q.correctAnswer).length;
    return correct / students.length;
  });
  actualClassPcts.push(...computedClassPcts);

  // Compute per-student total score
  const studentScores = studentResponses.map((resps, si) => {
    const correct = resps.filter((r, qi) => r === questions[qi].correctAnswer).length;
    return correct / questions.length;
  });

  // Build rows
  const rows: any[][] = [];

  // Row 0: assessment code
  rows.push([assessmentCode, ...Array(numCols - 1).fill('')]);

  // Row 1: CCSS standards in question columns, empty elsewhere
  const ccssRow = Array(numCols).fill('');
  questions.forEach((q, i) => { ccssRow[Q_START_COL + i] = q.ccss; });
  rows.push(ccssRow);

  // Row 2: question headers
  const headerRow = ['Name', 'Student ID', 'Score', ...questions.map((q) => `Q${q.number}`)];
  rows.push(headerRow);

  // Row 3: class % correct
  const pctRow = ['Class %', '', '', ...computedClassPcts.map((p) => Math.round(p * 1000) / 1000)];
  rows.push(pctRow);

  // Rows 4-6: blank
  rows.push(Array(numCols).fill(''));
  rows.push(Array(numCols).fill(''));
  rows.push(Array(numCols).fill(''));

  // Row 7: answer key
  const keyRow = ['Answer Key', '', '', ...questions.map((q) => q.correctAnswer)];
  rows.push(keyRow);

  // Rows 8+: student data
  students.forEach((s, si) => {
    rows.push([
      s.name,
      s.externalId,
      Math.round(studentScores[si] * 1000) / 1000,
      ...studentResponses[si],
    ]);
  });

  return XLSX.utils.aoa_to_sheet(rows);
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const outDir = path.join(DATA_ROOT, 'Classroom1', 'Session1');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('=== Microcoach Test Data Generator ===\n');
  console.log(`Output directory: ${outDir}\n`);

  // ── PPQ — 60 students, 6 questions ─────────────────────────────────────────
  console.log('Generating PPQ (60 students, 6 questions, 6.NS.A.1)...\n');

  const ppqStudents = makeStudentRoster(60);
  const ppqTiers    = assignTiers(60);
  const ppqClassPcts: number[] = [];

  const ppqSheet = buildWorksheet(
    'MAT.06.PPQZ.W19.25-26',
    QUESTIONS,
    ppqStudents,
    ppqTiers,
    ppqClassPcts
  );

  const ppqBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(ppqBook, ppqSheet, 'PPQ Data');

  const ppqPath = path.join(outDir, 'PPQ-StudentData.xlsx');
  XLSX.writeFile(ppqBook, ppqPath);

  // Print summary
  const avgPct = ppqClassPcts.reduce((a, b) => a + b, 0) / ppqClassPcts.length;
  console.log('  Questions (actual class % correct):');
  QUESTIONS.forEach((q, i) => {
    const actual = ppqClassPcts[i] ?? 0;
    const bar = '█'.repeat(Math.round(actual * 20)).padEnd(20, '░');
    console.log(
      `    Q${q.number}  ${bar}  ${Math.round(actual * 100)}%  target ${Math.round(q.targetClassPct * 100)}%  ${q.label}`
    );
  });
  console.log(`\n  Overall class avg: ${Math.round(avgPct * 100)}%  (target ~47%)`);
  console.log(`  ✓ Written: ${ppqPath}\n`);

  // ── PostPPQ — 59 students (drop last), 1 question ───────────────────────────
  console.log('Generating PostPPQ (59 students, 1 question — Q4 retested after RTD)...\n');

  // Same roster minus last student; same tier assignments for matching
  const postStudents = ppqStudents.slice(0, 59);
  const postTiers    = ppqTiers.slice(0, 59).map((t): Tier => {
    // Boost all tiers after intervention (RTD effect)
    if (t === 'low')  return randBool(0.35) ? 'mid' : 'low';
    if (t === 'mid')  return randBool(0.20) ? 'high' : 'mid';
    return 'high';
  });

  const postClassPcts: number[] = [];
  const postSheet = buildWorksheet(
    'MAT.06.POSTPPQ.W20.25-26',
    [POST_PPQ_QUESTION],
    postStudents,
    postTiers,
    postClassPcts
  );

  const postBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(postBook, postSheet, 'PostPPQ Data');

  const postPath = path.join(outDir, 'PostPPQ-StudentData.xlsx');
  XLSX.writeFile(postBook, postPath);

  const postPct = postClassPcts[0] ?? 0;
  const ppqQ4Pct = ppqClassPcts[3] ?? 0;
  const gain = postPct - ppqQ4Pct;
  console.log(`  Q4 retested (5/6 ÷ 5/3):`);
  console.log(`    PPQ score:    ${Math.round(ppqQ4Pct * 100)}%`);
  console.log(`    PostPPQ score: ${Math.round(postPct * 100)}%`);
  console.log(`    Gain:         +${Math.round(gain * 100)} pts  (target +~33 pts → 71%)`);
  console.log(`  ✓ Written: ${postPath}\n`);

  // ── Verification summary ───────────────────────────────────────────────────
  console.log('='.repeat(60));
  console.log('Summary:\n');
  console.log(`  PPQ     — ${ppqStudents.length} students, ${QUESTIONS.length} questions`);
  console.log(`            class avg ${Math.round(avgPct * 100)}%`);
  console.log(`  PostPPQ — ${postStudents.length} students, 1 question (Q4 retest)`);
  console.log(`            class avg ${Math.round(postPct * 100)}%  (was ${Math.round(ppqQ4Pct * 100)}%)`);
  console.log('\nStudent tier distribution (PPQ):');
  const tierCounts = { high: 0, mid: 0, low: 0 };
  ppqTiers.forEach((t) => tierCounts[t]++);
  console.log(`  High performers:  ${tierCounts.high} students`);
  console.log(`  Mid performers:   ${tierCounts.mid} students`);
  console.log(`  Low performers:   ${tierCounts.low} students`);
  console.log('\nReady to run: npx ts-node src/seed/upload.ts');
  console.log('='.repeat(60));
}

main();
