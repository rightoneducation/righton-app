import { useCallback, useEffect, useMemo, useState } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachSavedPlan } from '../api/Models/IMicroCoachSavedPlan';
import { IPlanItem } from '../lib/PipelineModels';
import mockPipelineOutput from '../lib/mocks/mockPipelineOutput.json';

// Seeded from the mock until the plan is persisted server-side. The COMPLETED
// entry references a misconception outside this week's three, so it can only
// come from seed data rather than from a selection.
const seededPlanItems = (
  mockPipelineOutput as unknown as {
    savedPlan: { items: IPlanItem[] };
  }
).savedPlan.items;

export type PlanItemsStatus = 'idle' | 'loading' | 'ready' | 'error';

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

// Screens receive the plan handle as a prop, alongside their screenSize.
export interface PlanProps {
  plan: IPlanItemsState;
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
  const [planItems, setPlanItems] = useState<IPlanItem[]>([]);
  const [planItemsStatus, setPlanItemsStatus] =
    useState<PlanItemsStatus>('idle');
  const [planItemsError, setPlanItemsError] = useState<Error | null>(null);

  const scopeType = scope?.type ?? null;
  let scopeId: string | null = null;
  if (scope?.type === 'class') scopeId = scope.classId;
  if (scope?.type === 'session') scopeId = scope.sessionId;

  useEffect(() => {
    let cancelled = false;

    if (!scopeType || !scopeId) {
      setPlanItems([]);
      setPlanItemsStatus('idle');
      setPlanItemsError(null);
      return undefined;
    }

    const activeScopeType = scopeType;
    const activeScopeId = scopeId;
    setPlanItems([]);
    setPlanItemsStatus('loading');
    setPlanItemsError(null);

    async function loadPlanItems() {
      try {
        const fetchedSavedPlans =
          activeScopeType === 'class'
            ? await apiClients.savedPlan.getSavedPlansByClassId(activeScopeId)
            : await apiClients.savedPlan.getSavedPlansBySessionId(
                activeScopeId,
              );
        if (cancelled) return;

        setPlanItems(combineSavedPlanItemsWithMockData(fetchedSavedPlans));
        setPlanItemsStatus('ready');
      } catch (error) {
        if (cancelled) return;

        setPlanItemsError(
          error instanceof Error
            ? error
            : new Error('Failed to load saved plans'),
        );
        setPlanItemsStatus('error');
      }
    }

    loadPlanItems();

    return () => {
      cancelled = true;
    };
  }, [apiClients, scopeId, scopeType]);

  // One saved activity per misconception — selecting a different one replaces
  // the previous entry rather than stacking up.
  const saveActivity = useCallback((item: IPlanItem) => {
    setPlanItems((items) => [
      ...items.filter(
        (existing) =>
          existing.status !== 'SAVED' ||
          existing.misconceptionId !== item.misconceptionId,
      ),
      item,
    ]);
  }, []);

  const markPlanItemDone = useCallback((id: string) => {
    setPlanItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: 'COMPLETED' as const } : item,
      ),
    );
  }, []);

  const removePlanItem = useCallback((id: string) => {
    setPlanItems((items) => items.filter((item) => item.id !== id));
  }, []);

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
