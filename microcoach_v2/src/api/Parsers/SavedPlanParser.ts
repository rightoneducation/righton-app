import { AWSSavedPlan } from "../Models/AWS/AWSSavedPlan";
import { IMicroCoachSavedPlan } from "../Models/IMicroCoachSavedPlan";

export class SavedPlanParser {
  static parseIMicroCoachSavedPlanfromAWSSavedPlan(
    savedPlan: AWSSavedPlan,
  ): IMicroCoachSavedPlan {
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
}
