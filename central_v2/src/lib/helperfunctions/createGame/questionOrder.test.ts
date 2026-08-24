import type { TDraftQuestionsList } from '../../CreateGameModels';
import { resolveDraftQuestionsList } from './questionOrder';

/**
 * Regression tracker for the question-order bug.
 *
 * A game's questionTemplatesOrder is built from the ids on draftQuestionsList.
 * Questions authored inline start with an empty id, so if the ids returned by
 * createQuestionTemplate are not written back first, the order is persisted
 * with empty ids and question order becomes arbitrary on read.
 *
 * Fixed in 35f262d14, dropped by reconcile merge e711a1642, restored here.
 */

// only the questionTemplate.id is read, so keep the fixtures minimal
const draftQuestion = (id: string): TDraftQuestionsList =>
  ({ questionTemplate: { id } }) as unknown as TDraftQuestionsList;

const idsOf = (list: TDraftQuestionsList[]) =>
  list.map((dq) => dq.questionTemplate.id);

describe('resolveDraftQuestionsList', () => {
  it('fills new question ids from the created list', () => {
    const draftQuestionsList = [draftQuestion(''), draftQuestion('')];

    const resolved = resolveDraftQuestionsList(draftQuestionsList, [
      'new-1',
      'new-2',
    ]);

    expect(idsOf(resolved)).toEqual(['new-1', 'new-2']);
  });

  it('keeps draft order when bank and new questions are interleaved', () => {
    // bank questions already have ids, new ones do not
    const draftQuestionsList = [
      draftQuestion('bank-a'),
      draftQuestion(''),
      draftQuestion('bank-b'),
      draftQuestion(''),
    ];

    const resolved = resolveDraftQuestionsList(draftQuestionsList, [
      'new-1',
      'new-2',
    ]);

    expect(idsOf(resolved)).toEqual(['bank-a', 'new-1', 'bank-b', 'new-2']);
  });

  it('never leaves an empty id for the order map to key on', () => {
    const draftQuestionsList = [
      draftQuestion(''),
      draftQuestion('bank-a'),
      draftQuestion(''),
    ];

    const resolved = resolveDraftQuestionsList(draftQuestionsList, [
      'new-1',
      'new-2',
    ]);

    expect(idsOf(resolved)).not.toContain('');
  });
});
