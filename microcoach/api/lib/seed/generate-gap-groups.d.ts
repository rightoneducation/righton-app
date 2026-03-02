/**
 * generate-gap-groups.ts — run the LLM pipeline offline and save pregenerated data
 *
 * Run from the api/ directory:
 *   npx ts-node src/seed/generate-gap-groups.ts
 *
 * Output: saves pregeneratedGapGroups to the Session record and sets currentWeek on Classroom
 *
 * This script replicates the data-fetch + LLM pipeline that previously ran on
 * every page load in App.js. Run it each week after ingesting new PPQ data;
 * the frontend reads currentWeek from Classroom, finds the matching Session,
 * and renders its pregeneratedGapGroups — no LLM calls at page-load time.
 */
export {};
