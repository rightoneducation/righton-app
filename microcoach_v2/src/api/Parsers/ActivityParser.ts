import { AWSActivity } from "../Models/AWS/AWSActivity";
import { IActivityPhases, IRoutine } from "../../lib/PipelineModels";
import { IMicroCoachActivity } from "../Models/IMicroCoachActivity";
import { isNullOrUndefined } from "../util/util";

export class ActivityParser {
  static parseIMicroCoachActivityfromAWSActivity(
    activity: AWSActivity,
  ): IMicroCoachActivity {
    if (
      isNullOrUndefined(activity.id) ||
      isNullOrUndefined(activity.misconceptionId) ||
      isNullOrUndefined(activity.sessionId) ||
      isNullOrUndefined(activity.classId) ||
      isNullOrUndefined(activity.activityType) ||
      isNullOrUndefined(activity.detailStatus) ||
      isNullOrUndefined(activity.createdAt) ||
      isNullOrUndefined(activity.updatedAt)
    ) {
      throw new Error(
        "Activity has null field for the attributes that are not nullable",
      );
    }

    const parsedActivity: IMicroCoachActivity = {
      activityType: activity.activityType,
      id: activity.id,
      misconceptionId: activity.misconceptionId,
      title: activity.title ?? null,
      isSelected: activity.isSelected ?? false,
      selectLabel: activity.selectLabel ?? "",
      detailStatus: activity.detailStatus,
      routine: activity.routine
        ? JSON.parse(activity.routine) as IRoutine
        : {
            id: activity.id,
            name: activity.title ?? "",
            subtitle: "",
            description: "",
          },
      durationLabel: activity.durationLabel ?? null,
      grouping: activity.grouping
        ? {
            level: activity.grouping.level,
            label: activity.grouping.label,
          }
        : null,
      targets: activity.targets ?? null,
      instructionalMove: activity.instructionalMove ?? null,
      strategyTag: activity.strategyTag ?? null,
      phases: activity.phases
        ? JSON.parse(activity.phases) as IActivityPhases
        : null,
    }

    return parsedActivity
  }
}
