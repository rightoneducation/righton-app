import type { TDraftQuestionsList } from '../../CreateGameModels';

/**
 * Fills newly created question template ids back into the draft questions list,
 * preserving the order the user arranged them in.
 *
 * New questions are seeded with an empty id and only receive a real one once
 * createQuestionTemplate resolves. If that id is never written back, the game's
 * questionTemplatesOrder is persisted with empty ids and question order falls
 * back to arbitrary DynamoDB ordering on read.
 *
 * `newQuestionTemplateIds` must be the ids of the newly created question
 * templates, in the same order as
 * `draftQuestionsList.filter((dq) => !dq.questionTemplate.id)`.
 *
 * Originally fixed in 35f262d14 (2026-01-30). Dropped by the dev/main reconcile
 * merge e711a1642 (2026-07-09), which took main's copy of CreateGame.tsx
 * wholesale. Covered by questionOrder.test.ts so it is not lost again.
 */
// eslint-disable-next-line import/prefer-default-export
export const resolveDraftQuestionsList = (
  draftQuestionsList: TDraftQuestionsList[],
  newQuestionTemplateIds: string[],
): TDraftQuestionsList[] => {
  let newIdIndex = 0;
  return draftQuestionsList.map((dq) => {
    if (dq.questionTemplate.id) {
      return dq;
    }
    const resolvedId = newQuestionTemplateIds[newIdIndex];
    newIdIndex += 1;
    return {
      ...dq,
      questionTemplate: {
        ...dq.questionTemplate,
        id: resolvedId,
      },
    };
  });
};
