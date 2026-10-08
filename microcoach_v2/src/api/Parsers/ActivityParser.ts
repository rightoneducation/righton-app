import { AWSActivity } from "../Models/AWS/AWSActivity";
import { IRoutine } from "../../lib/PipelineModels";
import { toActivityContent } from "../../lib/ActivityContentModels";
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
      // Rows in the older pipeline shape parse to null rather than to a
      // content object the pages would misread.
      content: activity.phases
        ? toActivityContent(JSON.parse(activity.phases))
        : null,
    }

    return parsedActivity
  }
}
