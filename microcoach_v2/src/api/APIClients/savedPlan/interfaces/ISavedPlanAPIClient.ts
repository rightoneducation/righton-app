import {
  CreateMicroCoachSavedPlanInput,
  UpdateMicroCoachSavedPlanInput,
} from "../../../../AWSAPI";
import { IMicroCoachSavedPlan } from "../../../Models/IMicroCoachSavedPlan";

export interface ISavedPlanAPIClient {
  getSavedPlan(id: string): Promise<IMicroCoachSavedPlan | null>;
  getSavedPlansByClassId(classId: string): Promise<IMicroCoachSavedPlan[]>;
  getSavedPlansBySessionId(sessionId: string): Promise<IMicroCoachSavedPlan[]>;
  createSavedPlan(
    input: CreateMicroCoachSavedPlanInput,
  ): Promise<IMicroCoachSavedPlan | null>;
  updateSavedPlan(
    input: UpdateMicroCoachSavedPlanInput,
  ): Promise<IMicroCoachSavedPlan | null>;
  deleteSavedPlan(id: string): Promise<IMicroCoachSavedPlan | null>;
}
