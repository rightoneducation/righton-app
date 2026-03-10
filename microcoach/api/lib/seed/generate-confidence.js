"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const XLSX = __importStar(require("xlsx"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const DATA_ROOT = path.resolve(__dirname, '../../../Data');
const TARGETS = [
    { rel: 'Classroom1/Session1/PPQ-StudentData.xlsx', format: 'generated' },
    { rel: 'Classroom2/Session1/PPQ-StudentData.xlsx', format: 'matrix' },
    { rel: 'Classroom3/Session1/PPQ-StudentData.xlsx', format: 'matrix' },
];
// ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
function makePrng(seed) {
    let s = seed >>> 0;
    return function () {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
/** Pick a random value from the half-step scale (1, 1.5, 2, …, 5) within [lo, hi]. */
function randHalfStep(rng, lo, hi) {
    const steps = [];
    for (let v = lo; v <= hi + 0.001; v += 0.5) {
        steps.push(parseFloat(v.toFixed(1)));
    }
    return steps[Math.floor(rng() * steps.length)];
}
// ── Confidence generation ────────────────────────────────────────────────────
/**
 * Returns a confidence value on the half-step scale (1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)
 * for one student×question pair. 0 means not answered (handled upstream).
 *
 * First 5% of students (minimum 4) get deterministic profile assignments that
 * guarantee all four meaningful pattern combinations appear at class scale:
 *   Profile 0 & 2 → always high confidence (4–5)
 *   Profile 1 & 3 → always low confidence  (1–2)
 * Combined with their actual correct/wrong answers this yields HC+C, LC+C,
 * HC+W, and LC+W across the seeded population.
 *
 * Remaining students use probabilistic assignment:
 *   Correct:  60% HC(4–5), 15% LC(1–2), 25% MC(2.5–3.5)
 *   Wrong:    45% LC(1–2), 30% HC(4–5), 25% MC(2.5–3.5)
 */
function generateConfidence(rng, isCorrect, studentIdx, numStudents) {
    const seedCount = Math.max(4, Math.ceil(numStudents * 0.05));
    if (studentIdx < seedCount) {
        const profile = studentIdx % 4;
        return profile === 0 || profile === 2
            ? randHalfStep(rng, 4, 5) // HC profiles
            : randHalfStep(rng, 1, 2); // LC profiles
    }
    const r = rng();
    if (isCorrect) {
        if (r < 0.60)
            return randHalfStep(rng, 4, 5); // HC+C: 60%
        if (r < 0.75)
            return randHalfStep(rng, 1, 2); // LC+C: 15%
        return randHalfStep(rng, 2.5, 3.5); // MC+C: 25%
    }
    else {
        if (r < 0.45)
            return randHalfStep(rng, 1, 2); // LC+W: 45%
        if (r < 0.75)
            return randHalfStep(rng, 4, 5); // HC+W: 30%
        return randHalfStep(rng, 2.5, 3.5); // MC+W: 25%
    }
}
// ── Per-file processor ───────────────────────────────────────────────────────
function processFile(filePath, format) {
    var _a, _b, _c, _d, _e, _f;
    console.log(`\nProcessing: ${path.relative(DATA_ROOT, filePath)}`);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    const isMatrix = format === 'matrix';
    // ── Find question columns from header row (row index 2) ───────────────────
    const headerRow = (_a = rows[2]) !== null && _a !== void 0 ? _a : [];
    const questionColumns = [];
    const questionNumbers = [];
    for (let col = 0; col < headerRow.length; col++) {
        const cell = String((_b = headerRow[col]) !== null && _b !== void 0 ? _b : '').trim();
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
    if (headerRow.some((h) => String(h).includes('_Conf'))) {
        console.log('  Confidence columns already present — skipping');
        return;
    }
    // ── Answer key ────────────────────────────────────────────────────────────
    const answerKeyRowIdx = isMatrix ? 6 : 7;
    const keyRow = (_c = rows[answerKeyRowIdx]) !== null && _c !== void 0 ? _c : [];
    const answerKeyByCol = {};
    for (const col of questionColumns) {
        const val = String((_d = keyRow[col]) !== null && _d !== void 0 ? _d : '').trim().toUpperCase();
        if (val.length === 1 && 'ABCDE'.includes(val)) {
            answerKeyByCol[col] = val;
        }
    }
    // ── Collect student row indices ───────────────────────────────────────────
    const studentStartRow = isMatrix ? 7 : 8;
    const nameCol = isMatrix ? 1 : 0;
    const studentRowIndices = [];
    for (let r = studentStartRow; r < rows.length; r++) {
        const name = String((_e = rows[r][nameCol]) !== null && _e !== void 0 ? _e : '').trim();
        if (!name)
            continue;
        if (name.toLowerCase().includes('total') || name.toLowerCase().includes('average'))
            continue;
        studentRowIndices.push(r);
    }
    const numStudents = studentRowIndices.length;
    console.log(`  ${numStudents} students, ${questionColumns.length} questions`);
    // ── Append confidence headers after last question column ──────────────────
    const confColStart = Math.max(...questionColumns) + 1;
    for (let qi = 0; qi < questionNumbers.length; qi++) {
        const confCol = confColStart + qi;
        while (rows[2].length <= confCol)
            rows[2].push('');
        rows[2][confCol] = `Q${questionNumbers[qi]}_Conf`;
    }
    // ── Generate and write confidence values ──────────────────────────────────
    const rng = makePrng(0xdeadbeef);
    const confidencesByQuestion = questionColumns.map(() => []);
    studentRowIndices.forEach((rowIdx, studentIdx) => {
        var _a, _b;
        const row = rows[rowIdx];
        for (let qi = 0; qi < questionColumns.length; qi++) {
            const qCol = questionColumns[qi];
            const confCol = confColStart + qi;
            const rawResponse = String((_a = row[qCol]) !== null && _a !== void 0 ? _a : '').trim().toUpperCase();
            const correctAnswer = (_b = answerKeyByCol[qCol]) !== null && _b !== void 0 ? _b : '';
            const isCorrect = isMatrix
                ? rawResponse === ''
                : rawResponse !== '' && rawResponse === correctAnswer;
            const conf = generateConfidence(rng, isCorrect, studentIdx, numStudents);
            while (row.length <= confCol)
                row.push('');
            row[confCol] = conf;
            confidencesByQuestion[qi].push(conf);
        }
    });
    // ── For generated format, write avgConfidence to class % row (row 3) ──────
    if (!isMatrix) {
        const classRow = (_f = rows[3]) !== null && _f !== void 0 ? _f : [];
        rows[3] = classRow;
        for (let qi = 0; qi < questionNumbers.length; qi++) {
            const confCol = confColStart + qi;
            while (rows[3].length <= confCol)
                rows[3].push('');
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
function main() {
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
