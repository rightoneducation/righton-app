import { useCallback, useMemo, useState } from 'react';
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

// The app's one piece of genuinely shared state: ChooseActivity writes a plan
// item and MyPlan reads it, and those are independent destinations rather than
// steps in a flow, so there is no component to colocate them under. Owned by
// RootLayout and passed down. This is the piece that becomes server-backed.
export interface IPlanItemsState {
  planItems: IPlanItem[];
  saveActivity: (item: IPlanItem) => void;
  markPlanItemDone: (id: string) => void;
  removePlanItem: (id: string) => void;
}

// Screens receive the plan handle as a prop, alongside their screenSize.
export interface PlanProps {
  plan: IPlanItemsState;
}

export function usePlanItems(): IPlanItemsState {
  const [planItems, setPlanItems] = useState<IPlanItem[]>(seededPlanItems);

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
    () => ({ planItems, saveActivity, markPlanItemDone, removePlanItem }),
    [planItems, saveActivity, markPlanItemDone, removePlanItem],
  );
}

export default usePlanItems;
