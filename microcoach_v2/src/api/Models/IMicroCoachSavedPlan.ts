import { PlanStatus } from "../../lib/PipelineModels";

export interface IMicroCoachSavedPlanItem {
  id: string;
  status: PlanStatus;
}

export interface IMicroCoachSavedPlan {
  id: string;
  classId: string;
  sessionId: string | null;
  items: IMicroCoachSavedPlanItem[];
  createdAt: string;
  updatedAt: string;
}
