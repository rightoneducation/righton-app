import { AWSMisconception } from "../Models/AWS/AWSMisconception";
import {
  IMisconception,
  IPrevalence,
  ISkillContext,
  IStudentWork,
} from "../../lib/PipelineModels";
import { Badge, PrevalenceLevel } from "../../AWSAPI";
import { isNullOrUndefined } from "../util/util";

export class MisconceptionParser {
  static parseIMisconceptionfromAWSMisconception(misconception: AWSMisconception): IMisconception {
    if (
      isNullOrUndefined(misconception.id) ||
      isNullOrUndefined(misconception.sessionId) ||
      isNullOrUndefined(misconception.classId) ||
      isNullOrUndefined(misconception.rank) ||
      isNullOrUndefined(misconception.title) ||
      isNullOrUndefined(misconception.description) ||
      isNullOrUndefined(misconception.detailStatus) ||
      isNullOrUndefined(misconception.createdAt) ||
      isNullOrUndefined(misconception.updatedAt)
    ) {
      throw new Error(
        "Misconception has null field for the attributes that are not nullable",
      );
    }

    const parsedMisconception: IMisconception = {
      id: misconception.id,
      rank: misconception.rank,
      badge: misconception.badge ?? null,
      isRecommendedFocus: misconception.badge === Badge.RECOMMENDED_FOCUS,
      title: misconception.title,
      titleCased: misconception.titleCased ?? misconception.title,
      shortLabel: misconception.shortLabel ?? misconception.title,
      description: misconception.description,
      consequence: misconception.consequence ?? "",

      prevalence: {
        level: misconception.prevalence?.level ?? PrevalenceLevel.FEW,
        label: misconception.prevalence?.label ?? "",
        studentsNeedingSupport: misconception.prevalence?.studentsNeedingSupport ?? null,
        studentsUnderstood: misconception.prevalence?.studentsUnderstood ?? null,
        studentsNoResponse: misconception.prevalence?.studentsNoResponse ?? null,
        totalAnalyzed: misconception.prevalence?.totalAnalyzed ?? 0,
        supportSummaryLabel: misconception.prevalence?.supportSummaryLabel ?? null,
        understoodSummaryLabel: misconception.prevalence?.understoodSummaryLabel ?? null,
        shortCountLabel: misconception.prevalence?.shortCountLabel ?? null,
      } as IPrevalence,

      detailStatus: misconception.detailStatus,
      nextStepActivities: [],
      studentWork: misconception.studentWork ? JSON.parse(misconception.studentWork) as IStudentWork: null,
      skillContext: misconception.skillContext ? JSON.parse(misconception.skillContext) as ISkillContext:  null,
    }

    return parsedMisconception
  }
}
