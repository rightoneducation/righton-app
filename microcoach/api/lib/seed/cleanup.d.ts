/**
 * cleanup.ts — delete all records from all Microcoach tables
 *
 * Run AFTER `amplify push` and BEFORE `upload.ts` if tables have stale data:
 *   cd api && npx ts-node src/seed/cleanup.ts
 *
 * Deletion order (child records first to avoid orphans):
 *   1. StudentResponse
 *   2. Activity
 *   3. Misconception
 *   4. Assessment
 *   5. Session
 *   6. Student
 *   7. SavedNextStep
 *   8. Classroom
 *   9. ContextData
 */
export {};
