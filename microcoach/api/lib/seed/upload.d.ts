/**
 * upload.ts — seed the Microcoach database from the Data/ folder
 *
 * Run AFTER `amplify push` has provisioned the new schema tables:
 *   cd api && npx ts-node src/seed/upload.ts
 *
 * Upload order (respects FK dependencies):
 *   1. Classrooms
 *   2. Students (classroomStudentsId)
 *   3. Sessions (classroomSessionsId)
 *   4. Assessments/PPQ (classroomAssessmentsId, sessionAssessmentsId)
 *   5. StudentResponses/PPQ (assessmentStudentResponsesId)
 *   6. Assessments/PostPPQ (sourceAssessmentId → PPQ id)
 *   7. StudentResponses/PostPPQ
 *   8. Misconceptions (classroomMisconceptionsId, sessionMisconceptionsId)
 *   9. Activities (misconceptionActivitiesId)
 *  10. ContextData (isReference: false for classroom RTDs, true for References/)
 */
export {};
