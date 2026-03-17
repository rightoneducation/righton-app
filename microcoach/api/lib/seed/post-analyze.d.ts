/**
 * post-analyze.ts — ingest post-PPQ data and compute improvement metrics
 *
 * Run from the api/ directory:
 *   APPSYNC_SECRET_NAME=microcoach npx ts-node src/seed/post-analyze.ts
 *
 * This script:
 *   1. Uploads POST_PPQ Assessment + StudentResponse records (idempotent)
 *   2. Compares pre/post performance per misconception
 *   3. Attaches postPpqResults to each gap group in pregeneratedNextSteps
 *   4. Updates Misconception.postPpqImprovement
 *
 * It does NOT run cleanup, upload, or generate — existing data is preserved.
 */
export {};
