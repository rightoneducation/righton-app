import { useCallback, useEffect, useMemo } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachSavedPlan } from '../api/Models/IMicroCoachSavedPlan';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { IPlanItem } from '../lib/PipelineModels';
import mockPipelineOutput from '../lib/mocks/mockPipelineOutput.json';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from './context/useMicroCoachDataContext';

// Seeded from the mock until the plan is persisted server-side. The COMPLETED
// entry references a misconception outside this week's three, so it can only
// come from seed data rather than from a selection.
const seededPlanItems = (
  mockPipelineOutput as unknown as {
    savedPlan: { items: IPlanItem[] };
  }
).savedPlan.items;

export type PlanItemsStatus = MicroCoachDataStatus;

export type PlanItemsScope =
  | { type: 'class'; classId: string }
  | { type: 'session'; sessionId: string }
  | null;

// The app's one piece of genuinely shared state: ChooseActivity writes a plan
// item and MyPlan reads it, and those are independent destinations rather than
// steps in a flow, so there is no component to colocate them under. Owned by
// RootLayout and passed down. This is the piece that becomes server-backed.
export interface IPlanItemsState {
  planItems: IPlanItem[];
  status: PlanItemsStatus;
  error: Error | null;
  saveActivity: (item: IPlanItem) => void;
  markPlanItemDone: (id: string) => void;
  removePlanItem: (id: string) => void;
}

function combineSavedPlanItemsWithMockData(
  savedPlans: IMicroCoachSavedPlan[],
): IPlanItem[] {
  return savedPlans
    .flatMap((savedPlan) => savedPlan.items)
    .map((savedPlanItem) => {
      const seededPlanItem = seededPlanItems.find(
        (planItem) => planItem.id === savedPlanItem.id,
      );

      return seededPlanItem
        ? { ...seededPlanItem, status: savedPlanItem.status }
        : null;
    })
    .filter((planItem): planItem is IPlanItem => planItem !== null);
}

export function usePlanItems(
  apiClients: IAPIClients,
  scope: PlanItemsScope,
): IPlanItemsState {
  const { planItems, planItemsStatus, planItemsError } =
    useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();

  const scopeType = scope?.type ?? null;
  let scopeId: string | null = null;
  if (scope?.type === 'class') scopeId = scope.classId;
  if (scope?.type === 'session') scopeId = scope.sessionId;

  useEffect(() => {
    let cancelled = false;

    if (!scopeType || !scopeId) {
      dispatch({ type: 'SET_PLAN_ITEMS', payload: [] });
      dispatch({ type: 'SET_PLAN_ITEMS_STATUS', payload: 'idle' });
      dispatch({ type: 'SET_PLAN_ITEMS_ERROR', payload: null });
      return undefined;
    }

    const activeScopeType = scopeType;
    const activeScopeId = scopeId;
    dispatch({ type: 'SET_PLAN_ITEMS', payload: [] });
    dispatch({ type: 'SET_PLAN_ITEMS_STATUS', payload: 'loading' });
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

        dispatch({
          type: 'SET_PLAN_ITEMS',
          payload: combineSavedPlanItemsWithMockData(fetchedSavedPlans),
        });
        dispatch({ type: 'SET_PLAN_ITEMS_STATUS', payload: 'ready' });
      } catch (error) {
        if (cancelled) return;

        dispatch({
          type: 'SET_PLAN_ITEMS_ERROR',
          payload:
            error instanceof Error
              ? error
              : new Error('Failed to load saved plans'),
        });
        dispatch({ type: 'SET_PLAN_ITEMS_STATUS', payload: 'error' });
      }
    }

    loadPlanItems();

    return () => {
      cancelled = true;
    };
  }, [apiClients, dispatch, scopeId, scopeType]);

  // One saved activity per misconception — selecting a different one replaces
  // the previous entry rather than stacking up.
  const saveActivity = useCallback(
    (item: IPlanItem) => {
      dispatch({ type: 'SAVE_PLAN_ITEM', payload: item });
    },
    [dispatch],
  );

  const markPlanItemDone = useCallback(
    (id: string) => {
      dispatch({ type: 'MARK_PLAN_ITEM_DONE', payload: id });
    },
    [dispatch],
  );

  const removePlanItem = useCallback(
    (id: string) => {
      dispatch({ type: 'REMOVE_PLAN_ITEM', payload: id });
    },
    [dispatch],
  );

  return useMemo(
    () => ({
      planItems,
      status: planItemsStatus,
      error: planItemsError,
      saveActivity,
      markPlanItemDone,
      removePlanItem,
    }),
    [
      markPlanItemDone,
      planItems,
      planItemsError,
      planItemsStatus,
      removePlanItem,
      saveActivity,
    ],
  );
}

export default usePlanItems;
