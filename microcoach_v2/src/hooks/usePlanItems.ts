import { useCallback, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IAPIClients } from '../api';
import {
  IMicroCoachSavedPlan,
  IMicroCoachSavedPlanItem,
} from '../api/Models/IMicroCoachSavedPlan';
import { loadKeys, MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { IPlanItem } from '../lib/PipelineModels';
import {
  combinedLoad,
  hasSavedPlan,
  planItemsFor,
  savedPlanFor,
  selectedClassId,
  selectedSession,
  sessionMisconceptions,
} from '../lib/selectors';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from './context/useMicroCoachDataContext';

export interface IPlanItemsState {
  planItems: IPlanItem[];
  // Whether the selected session has a saved activity (moves it to REASSESS).
  // Known from the class's rows alone, before its misconceptions load.
  hasSavedPlan: boolean;
  status: MicroCoachDataStatus;
  error: Error | null;
  saveActivity: (item: IPlanItem) => void;
  markPlanItemDone: (id: string) => void;
  removePlanItem: (id: string) => void;
}

type ItemsChange = (items: IMicroCoachSavedPlanItem[]) => IMicroCoachSavedPlanItem[];

/**
 * The selected session's saved plan (the class's own before its first
 * upload), joined to its activities. Reads the store only: the plan rows come
 * with the class (useClassChildrenLoader) and the activities with the session
 * (useSessionChildrenLoader, on the pages that show them).
 *
 * Changes are optimistic on the SavedPlan row and saved in order. A failed
 * save puts back the last row the server confirmed.
 */
export function usePlanItems(apiClients: IAPIClients): IPlanItemsState {
  const state = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const { classrooms, sessions, savedPlans, misconceptions, activities, selection, loads } =
    state;
  const classId = selectedClassId({ classrooms, selection });
  const session = selectedSession({ classrooms, sessions, selection });
  const sessionId = session?.id ?? null;

  const plan = useMemo(
    () => (classId ? savedPlanFor({ savedPlans }, classId, sessionId) : null),
    [classId, savedPlans, sessionId],
  );
  const planItems = useMemo(
    () =>
      planItemsFor(plan, sessionMisconceptions({ misconceptions, activities }, sessionId)),
    [activities, misconceptions, plan, sessionId],
  );

  const [saveError, setSaveError] = useState<Error | null>(null);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const pendingRef = useRef(0);
  // Numbers each change, so only the latest one's answer is shown.
  const changeSeqRef = useRef(0);
  // The row on screen, and the last one the server confirmed. Between saves
  // they are the same.
  const planRef = useRef(plan);
  const confirmedRef = useRef(plan);
  planRef.current = plan;
  if (pendingRef.current === 0) confirmedRef.current = plan;

  const changeItems = useCallback(
    (change: ItemsChange) => {
      if (!classId) return;
      const previous = planRef.current;
      const now = new Date().toISOString();
      const next: IMicroCoachSavedPlan = previous
        ? { ...previous, items: change(previous.items), updatedAt: now }
        : {
            id: uuidv4(),
            classId,
            sessionId,
            items: change([]),
            createdAt: now,
            updatedAt: now,
          };
      planRef.current = next;
      pendingRef.current += 1;
      changeSeqRef.current += 1;
      const seq = changeSeqRef.current;
      setSaveError(null);
      dispatch({ type: 'UPSERT_ROWS', table: 'savedPlans', rows: [next] });

      const save = async () => {
        const exists = confirmedRef.current?.id === next.id;
        const saved = exists
          ? await apiClients.savedPlan.updateSavedPlan(next)
          : await apiClients.savedPlan.createSavedPlan(next);
        if (!saved) throw new Error('The saved plan request returned no data');
        confirmedRef.current = saved;
        // A later change already replaced this one on screen; its own save answers.
        if (changeSeqRef.current === seq) {
          planRef.current = saved;
          dispatch({ type: 'UPSERT_ROWS', table: 'savedPlans', rows: [saved] });
        }
      };
      const run = saveQueueRef.current
        .then(save)
        .catch((error) => {
          if (changeSeqRef.current === seq) {
            const confirmed = confirmedRef.current;
            planRef.current = confirmed;
            dispatch(
              confirmed
                ? { type: 'UPSERT_ROWS', table: 'savedPlans', rows: [confirmed] }
                : { type: 'REMOVE_ROWS', table: 'savedPlans', ids: [next.id] },
            );
          }
          setSaveError(
            error instanceof Error ? error : new Error('Failed to update saved plan'),
          );
          console.error('[usePlanItems] Failed to update saved plan', error);
        })
        .finally(() => {
          pendingRef.current -= 1;
        });
      saveQueueRef.current = run;
    },
    [apiClients, classId, dispatch, sessionId],
  );

  // One activity is saved at a time; completed ones stay on the plan.
  const saveActivity = useCallback(
    (item: IPlanItem) => {
      const activityId = item.activityId ?? item.id;
      changeItems((items) => [
        ...items.filter((saved) => saved.status !== 'SAVED' && saved.id !== activityId),
        { id: activityId, status: 'SAVED' },
      ]);
    },
    [changeItems],
  );

  const markPlanItemDone = useCallback(
    (id: string) => {
      changeItems((items) =>
        items.map((saved) =>
          saved.id === id ? { ...saved, status: 'COMPLETED' as const } : saved,
        ),
      );
    },
    [changeItems],
  );

  const removePlanItem = useCallback(
    (id: string) => {
      changeItems((items) => items.filter((saved) => saved.id !== id));
    },
    [changeItems],
  );

  // The items need the class's plan rows and, with a session, its activities.
  let load: { status: MicroCoachDataStatus; error: Error | null } = {
    status: MicroCoachDataStatus.IDLE,
    error: null,
  };
  if (classId) {
    load = combinedLoad(loads, [
      loadKeys.classChildren(classId),
      ...(session ? [loadKeys.sessionChildren(session.id, session.status)] : []),
    ]);
  }
  const isPlanSaved = hasSavedPlan(plan);

  return useMemo(
    () => ({
      planItems,
      hasSavedPlan: isPlanSaved,
      status: load.status,
      error: saveError ?? load.error,
      saveActivity,
      markPlanItemDone,
      removePlanItem,
    }),
    [
      isPlanSaved,
      load.error,
      load.status,
      markPlanItemDone,
      planItems,
      removePlanItem,
      saveActivity,
      saveError,
    ],
  );
}

export default usePlanItems;
