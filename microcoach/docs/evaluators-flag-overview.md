# Evaluators Flag Overview

The grade-level evaluator pipeline (initial evaluation during upload, admin-email summary, Review-page bell UI, and regenerate flow) is gated behind a pair of `EVALUATORS_ENABLED` constants so it can be turned off temporarily without deleting any code.

## Where the flag lives

Two constants, both `false` when disabled. They must stay in sync.

| Location | File | Purpose |
| --- | --- | --- |
| Backend | `api/amplify/backend/function/microcoachTeacherUploadGen/src/index.mjs` | Gates the `microcoachInitialEvaluator` invocation in the upload pipeline. When `false`, no evaluation runs, nothing is written to `Session.evaluationResults`, and the admin email's grade-level section is skipped (the email template already conditions on a truthy result). |
| Frontend | `prototype/src/components/ReviewPage.js` | Passed to `ReviewHeader` as `evaluatorEnabled`, which hides the header bell UI (preview + "Regenerate Content"). Also short-circuits `handleRegenerate` so the `regenerateContent` mutation is not called. |

## To disable

1. In `api/amplify/backend/function/microcoachTeacherUploadGen/src/index.mjs`, set `EVALUATORS_ENABLED = false`.
2. In `prototype/src/components/ReviewPage.js`, set `EVALUATORS_ENABLED = false`.
3. Deploy the backend Lambda (`amplify push`) and the frontend build.

## To re-enable

1. In `api/amplify/backend/function/microcoachTeacherUploadGen/src/index.mjs`, set `EVALUATORS_ENABLED = true`.
2. In `prototype/src/components/ReviewPage.js`, set `EVALUATORS_ENABLED = true`.
3. Deploy the backend Lambda (`amplify push`) and the frontend build.
4. Confirm on a fresh upload that `Session.evaluationResults` is populated and the admin email contains the grade-level section.
5. Confirm on `/review/:classroomId` that the header bell renders and "Regenerate Content" triggers a re-evaluation.

