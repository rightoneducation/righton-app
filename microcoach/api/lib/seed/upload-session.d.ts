/**
 * upload-session.ts — add a single session to an existing classroom
 *
 * Usage:
 *   cd api && npx ts-node src/seed/upload-session.ts --classroomId <id> --classroom Classroom1 --session Session2
 *
 * This script does NOT create a new Classroom record — it attaches the session
 * (+ students, assessments, student responses, misconceptions, activities) to an
 * existing classroom identified by --classroomId.
 */
export {};
