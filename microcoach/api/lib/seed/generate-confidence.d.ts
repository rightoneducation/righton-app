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
export {};
