import { AWSMisconception } from "../Models/AWS/AWSMisconception";
import {
  IMisconception,
  IPrevalence,
  ISkillContext,
  IStudentWork,
} from "../../lib/PipelineModels";

export class MisconceptionParser {
  static parseIMisconceptionfromAWSMisconception(misconception: AWSMisconception): IMisconception {
    const parsedMisconception: IMisconception = {
      id: misconception.id,
      rank: misconception.rank,
      badge: misconception.badge ?? null,
      isRecommendedFocus: misconception.badge === "RECOMMENDED_FOCUS",
      title: misconception.title,
      titleCased: misconception.titleCased ?? misconception.title,
      shortLabel: misconception.shortLabel ?? misconception.title,
      description: misconception.description,
      consequence: misconception.consequence ?? "",

      prevalence: {
        level: misconception.prevalence?.level ?? "FEW", // would this be a good fallback ?
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
