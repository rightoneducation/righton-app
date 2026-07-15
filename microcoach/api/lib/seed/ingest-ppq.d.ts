/**
 * ingest-ppq.ts — extract misconceptions from PPQ.docx files via LLM
 *
 * For each classroom/session that has a PPQ.docx, extracts the raw text with
 * mammoth, sends it to the microcoachIngestPPQ Lambda via AppSync, and writes
 * the result to Data/{ClassroomN}/{SessionN}/misconceptions.json.
 *
 * upload.ts reads those JSON files automatically — no manual copy-paste needed.
 *
 * Run from the api/ directory:
 *   APPSYNC_SECRET_NAME=microcoach npx ts-node src/seed/ingest-ppq.ts
 */
export {};
