import { useCallback, useEffect, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IAPIClients } from '../api';
import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { IMicroCoachSavedPlan } from '../api/Models/IMicroCoachSavedPlan';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { IPlanItem } from '../lib/PipelineModels';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from './context/useMicroCoachDataContext';

export type PlanItemsScope =
  | { type: 'class'; classId: string }
  | { type: 'session'; sessionId: string }
  | null;

export interface IPlanItemsState {
  planItems: IPlanItem[];
  status: MicroCoachDataStatus;
  error: Error | null;
  saveActivity: (item: IPlanItem) => void;
  markPlanItemDone: (id: string) => void;
  removePlanItem: (id: string) => void;
}

function combineSavedPlanItemsWithBackendData(
  savedPlans: IMicroCoachSavedPlan[],
  misconceptions: IMicroCoachMisconception[],
): IPlanItem[] {
  return savedPlans
    .flatMap((savedPlan) => savedPlan.items)
    .flatMap((savedPlanItem): IPlanItem[] => {
      const misconception = misconceptions.find((item) =>
        item.nextStepActivities.some(
          (activity) => activity.id === savedPlanItem.id,
        ),
      );
      const activity = misconception?.nextStepActivities.find(
        (item) => item.id === savedPlanItem.id,
      );

      if (!misconception || !activity) return [];

      return [
        {
          id: activity.id,
          status: savedPlanItem.status,
          activityId: activity.id,
          activityTitle: activity.routine.name,
          skillCode: misconception.skillContext?.focusSkill.code ?? '',
          misconceptionId: misconception.id,
          misconceptionTitle: misconception.titleCased,
          prevalence: misconception.prevalence,
          grouping: activity.grouping ?? { level: 'WHOLE_CLASS', label: '' },
        },
      ];
    });
}

function toSavedPlanItems(planItems: IPlanItem[]) {
  return planItems.flatMap((item) => {
    const activityId = item.activityId ?? item.id;
    return activityId ? [{ id: activityId, status: item.status }] : [];
  });
}

export function usePlanItems(
  apiClients: IAPIClients,
  scope: PlanItemsScope,
): IPlanItemsState {
  const {
    misconceptions,
    misconceptionsStatus,
    planItems,
    planItemsStatus,
    planItemsError,
    sessions,
  } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const savedPlanRef = useRef<IMicroCoachSavedPlan | null>(null);
  // The scope the stored status describes. The store is shared, so for the
  // render after the scope changes (before the effect below marks it LOADING)
  // it still holds the previous scope's READY; this reports LOADING instead.
  const answeredScopeRef = useRef<string | null>(null);
  // The current scope's load, and the last save. A save waits for both, so it
  // sees the saved plan (if any) and updates it rather than creating a second
  // one when Select is clicked before the load answers, or twice quickly.
  const loadRef = useRef<Promise<void>>(Promise.resolve());
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  const scopeType = scope?.type ?? null;
  let scopeId: string | null = null;
  if (scope?.type === 'class') scopeId = scope.classId;
  if (scope?.type === 'session') scopeId = scope.sessionId;
  const classId =
    scope?.type === 'class'
      ? scope.classId
      : (sessions.find((session) => session.id === scopeId)?.classId ?? null);

  useEffect(() => {
    let cancelled = false;

    if (!scopeType || !scopeId) {
      savedPlanRef.current = null;
      dispatch({ type: 'SET_PLAN_ITEMS', payload: [] });
      dispatch({
        type: 'SET_PLAN_ITEMS_STATUS',
        payload: MicroCoachDataStatus.IDLE,
      });
      dispatch({ type: 'SET_PLAN_ITEMS_ERROR', payload: null });
      return undefined;
    }

    if (
      scopeType === 'session' &&
      misconceptionsStatus !== MicroCoachDataStatus.READY
    ) {
      savedPlanRef.current = null;
      dispatch({ type: 'SET_PLAN_ITEMS', payload: [] });
      dispatch({
        type: 'SET_PLAN_ITEMS_STATUS',
        payload: MicroCoachDataStatus.LOADING,
      });
      dispatch({ type: 'SET_PLAN_ITEMS_ERROR', payload: null });
      return undefined;
    }

    const activeScopeType = scopeType;
    const activeScopeId = scopeId;
    dispatch({ type: 'SET_PLAN_ITEMS', payload: [] });
    dispatch({
      type: 'SET_PLAN_ITEMS_STATUS',
      payload: MicroCoachDataStatus.LOADING,
    });
    dispatch({ type: 'SET_PLAN_ITEMS_ERROR', payload: null });

    async function loadPlanItems() {
      try {
        const fetchedSavedPlans =
          activeScopeType === 'class'
            ? await apiClients.savedPlan.getSavedPlansByClassId(activeScopeId)
            : await apiClients.savedPlan.getSavedPlansBySessionId(
                activeScopeId,
              );
        if (cancelled) return;

        answeredScopeRef.current = activeScopeId;
        const savedPlan = [...fetchedSavedPlans].sort(
          (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
        )[0];
        savedPlanRef.current = savedPlan ?? null;
        dispatch({
          type: 'SET_PLAN_ITEMS',
          payload: combineSavedPlanItemsWithBackendData(
            savedPlan ? [savedPlan] : [],
            misconceptions,
          ),
        });
        dispatch({
          type: 'SET_PLAN_ITEMS_STATUS',
          payload: MicroCoachDataStatus.READY,
        });
      } catch (error) {
        if (cancelled) return;

        answeredScopeRef.current = activeScopeId;
        dispatch({
          type: 'SET_PLAN_ITEMS_ERROR',
          payload:
            error instanceof Error
              ? error
              : new Error('Failed to load saved plans'),
        });
        dispatch({
          type: 'SET_PLAN_ITEMS_STATUS',
          payload: MicroCoachDataStatus.ERROR,
        });
      }
    }

    // loadPlanItems reports its own failure, so this never rejects.
    loadRef.current = loadPlanItems();

    return () => {
      cancelled = true;
    };
  }, [
    apiClients,
    dispatch,
    misconceptions,
    misconceptionsStatus,
    scopeId,
    scopeType,
  ]);

  const persistPlanItems = useCallback(
    (previousItems: IPlanItem[], nextItems: IPlanItem[]) => {
      const save = async () => {
        if (!scopeType || !scopeId || !classId) {
          throw new Error('Cannot save a plan without a class and plan scope');
        }
        await loadRef.current;

        const now = new Date().toISOString();
        const currentPlan = savedPlanRef.current;
        // Saved items this client could not resolve (an activity it has not
        // loaded) never reach planItems, so nextItems cannot carry them. Keep
        // them as they were rather than dropping them from the plan.
        const unresolvedItems = (currentPlan?.items ?? []).filter(
          (savedItem) =>
            !previousItems.some(
              (item) => (item.activityId ?? item.id) === savedItem.id,
            ),
        );
        const items = [...unresolvedItems, ...toSavedPlanItems(nextItems)];
        const plan: IMicroCoachSavedPlan = currentPlan
          ? { ...currentPlan, items, updatedAt: now }
          : {
              id: uuidv4(),
              classId,
              sessionId: scopeType === 'session' ? scopeId : null,
              items,
              createdAt: now,
              updatedAt: now,
            };

        const savedPlan = currentPlan
          ? await apiClients.savedPlan.updateSavedPlan(plan)
          : await apiClients.savedPlan.createSavedPlan(plan);

        if (!savedPlan) throw new Error('The saved plan request returned no data');
        savedPlanRef.current = savedPlan;
      };

      // One save at a time, in click order; a failed save doesn't block the next.
      const run = saveQueueRef.current.then(save);
      saveQueueRef.current = run.catch(() => undefined);
      return run;
    },
    [apiClients, classId, scopeId, scopeType],
  );

  const persistUpdate = useCallback(
    async (previousItems: IPlanItem[], nextItems: IPlanItem[]) => {
      dispatch({ type: 'SET_PLAN_ITEMS_ERROR', payload: null });

      try {
        await persistPlanItems(previousItems, nextItems);
      } catch (error) {
        dispatch({ type: 'SET_PLAN_ITEMS', payload: previousItems });
        dispatch({
          type: 'SET_PLAN_ITEMS_ERROR',
          payload:
            error instanceof Error
              ? error
              : new Error('Failed to update saved plan'),
        });
        // eslint-disable-next-line no-console
        console.error('[usePlanItems] Failed to update saved plan', error);
      }
    },
    [dispatch, persistPlanItems],
  );

  // One saved activity per misconception — selecting a different one replaces
  // the previous entry rather than stacking up.
  const saveActivity = useCallback(
    (item: IPlanItem) => {
      const normalizedItem = {
        ...item,
        id: item.activityId ?? item.id,
      };
      const nextItems = [
        ...planItems.filter(
          (planItem) =>
            planItem.status !== 'SAVED' ||
            planItem.misconceptionId !== item.misconceptionId,
        ),
        normalizedItem,
      ];
      dispatch({ type: 'SAVE_PLAN_ITEM', payload: normalizedItem });
      persistUpdate(planItems, nextItems);
    },
    [dispatch, persistUpdate, planItems],
  );

  const markPlanItemDone = useCallback(
    (id: string) => {
      const nextItems = planItems.map((item) =>
        item.id === id ? { ...item, status: 'COMPLETED' as const } : item,
      );
      dispatch({ type: 'MARK_PLAN_ITEM_DONE', payload: id });
      persistUpdate(planItems, nextItems);
    },
    [dispatch, persistUpdate, planItems],
  );

  const removePlanItem = useCallback(
    (id: string) => {
      const nextItems = planItems.filter((item) => item.id !== id);
      dispatch({ type: 'REMOVE_PLAN_ITEM', payload: id });
      persistUpdate(planItems, nextItems);
    },
    [dispatch, persistUpdate, planItems],
  );

  const isAnswerForScope =
    planItemsStatus !== MicroCoachDataStatus.READY &&
    planItemsStatus !== MicroCoachDataStatus.ERROR
      ? true
      : answeredScopeRef.current === scopeId;
  const status = isAnswerForScope ? planItemsStatus : MicroCoachDataStatus.LOADING;

  return useMemo(
    () => ({
      planItems,
      status,
      error: planItemsError,
      saveActivity,
      markPlanItemDone,
      removePlanItem,
    }),
    [
      markPlanItemDone,
      planItems,
      planItemsError,
      status,
      removePlanItem,
      saveActivity,
    ],
  );
}

export default usePlanItems;
