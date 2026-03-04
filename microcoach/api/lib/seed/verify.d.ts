/**
 * verify.ts — validate that the seed upload completed correctly
 *
 * Run after `upload.ts`:
 *   cd api && npx ts-node src/seed/verify.ts
 *
 * Expected counts:
 *   Classrooms:       3
 *   Sessions:         3  (1 per classroom)
 *   Assessments:      6  (PPQ + POST_PPQ per session)
 *   Students:         617 (60 + 79 + 478)
 *   StudentResponses: ~823 (PPQ: 617; PostPPQ: ~206)
 *   Misconceptions:   9  (3 per session)
 *   Activities:       9  (1 per misconception)
 *   ContextData:      8  (3 classroom next steps + 5 reference next steps)
 */
export {};
