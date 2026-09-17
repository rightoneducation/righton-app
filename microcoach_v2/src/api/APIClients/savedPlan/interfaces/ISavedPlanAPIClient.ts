import { IMicroCoachSavedPlan } from "../../../Models/IMicroCoachSavedPlan";

export interface ISavedPlanAPIClient {
  getSavedPlan(id: string): Promise<IMicroCoachSavedPlan | null>;
  getSavedPlansByClassId(classId: string): Promise<IMicroCoachSavedPlan[]>;
  getSavedPlansBySessionId(sessionId: string): Promise<IMicroCoachSavedPlan[]>;
  createSavedPlan(
    savedPlan: IMicroCoachSavedPlan,
  ): Promise<IMicroCoachSavedPlan | null>;
  updateSavedPlan(
    savedPlan: IMicroCoachSavedPlan,
  ): Promise<IMicroCoachSavedPlan | null>;
  deleteSavedPlan(id: string): Promise<IMicroCoachSavedPlan | null>;
}
