import { AWSContextData } from "../Models/AWS/AWSContextData";
import { IMicroCoachContextData } from "../Models/IMicroCoachContextData";

export class ContextDataParser {
  static parseIMicroCoachContextDatafromAWSContextData(
    contextData: AWSContextData,
  ): IMicroCoachContextData {
    const parsedContextData: IMicroCoachContextData = {
      id: contextData.id,
      type: contextData.type,
      title: contextData.title,
      gradeLevel: contextData.gradeLevel ?? null,
      weekNumber: contextData.weekNumber ?? null,
      ccssStandards: (contextData.ccssStandards ?? []).filter(
        (standard): standard is string => standard != null,
      ),
      assessmentCode: contextData.assessmentCode ?? null,
      isReference: contextData.isReference ?? false,
      nextStepLesson: contextData.nextStepLesson ?? null,
      exemplarQuestions: (contextData.exemplarQuestions ?? []).filter(
        (question): question is NonNullable<typeof question> =>
          question != null,
      ),
      strategy: contextData.strategy ?? null,
      walkthroughData: contextData.walkthroughData ?? null,
      createdAt: contextData.createdAt,
      updatedAt: contextData.updatedAt,
    }

    return parsedContextData
  }
}
