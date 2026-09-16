import { AWSSavedPlan } from "../Models/AWS/AWSSavedPlan";
import { IMicroCoachSavedPlan } from "../Models/IMicroCoachSavedPlan";
import { isNullOrUndefined } from "../util/util";
import {
  CreateMicroCoachSavedPlanInput,
  PlanStatus,
  UpdateMicroCoachSavedPlanInput,
} from "../../AWSAPI";

type MicroCoachSavedPlanMutationInput = CreateMicroCoachSavedPlanInput &
  UpdateMicroCoachSavedPlanInput;

export class SavedPlanParser {
  static parseIMicroCoachSavedPlanfromAWSSavedPlan(
    savedPlan: AWSSavedPlan,
  ): IMicroCoachSavedPlan {
    if (
      isNullOrUndefined(savedPlan.id) ||
      isNullOrUndefined(savedPlan.classId) ||
      isNullOrUndefined(savedPlan.createdAt) ||
      isNullOrUndefined(savedPlan.updatedAt)
    ) {
      throw new Error(
        "Saved plan has null field for the attributes that are not nullable",
      );
    }

    const parsedSavedPlan: IMicroCoachSavedPlan = {
      id: savedPlan.id,
      classId: savedPlan.classId,
      sessionId: savedPlan.sessionId ?? null,
      items: (savedPlan.items ?? [])
        .filter((item): item is NonNullable<typeof item> => item != null)
        .map((item) => ({
          id: item.id,
          status: item.status,
        })),
      createdAt: savedPlan.createdAt,
      updatedAt: savedPlan.updatedAt,
    }

    return parsedSavedPlan
  }

  static parseAWSSavedPlanInputfromIMicroCoachSavedPlan(
    savedPlan: IMicroCoachSavedPlan,
  ): MicroCoachSavedPlanMutationInput {
    return {
      id: savedPlan.id,
      classId: savedPlan.classId,
      sessionId: savedPlan.sessionId,
      items: savedPlan.items.map((item) => ({
        id: item.id,
        status: PlanStatus[item.status],
      })),
    };
  }
}
