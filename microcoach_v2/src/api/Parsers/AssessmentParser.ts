import { AWSAssessment } from "../Models/AWS/AWSAssessment";
import { IMicroCoachAssessment } from "../Models/IMicroCoachAssessment";

export class AssessmentParser {
  static parseIMicroCoachAssessmentfromAWSAssessment(
    assessment: AWSAssessment,
  ): IMicroCoachAssessment {
    const parsedAssessment: IMicroCoachAssessment = {
      id: assessment.id,
      classId: assessment.classId,
      sessionId: assessment.sessionId,
      assessmentCode: assessment.assessmentCode,
      type: assessment.type,
      weekNumber: assessment.weekNumber,
      createdAt: assessment.createdAt,
      updatedAt: assessment.updatedAt,
    }

    return parsedAssessment
  }
}
