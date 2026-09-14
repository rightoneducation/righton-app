import { AWSActivity } from "../Models/AWS/AWSActivity";
import {
  IActivity,
  IActivityPhases,
  IRoutine,
} from "../../lib/PipelineModels";

export class ActivityParser {
  static parseIActivityfromAWSActivity(activity: AWSActivity): IActivity {
    const parsedActivity: IActivity = {
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
