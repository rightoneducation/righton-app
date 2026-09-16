import { AWSAssessment } from "../Models/AWS/AWSAssessment";
import { IMicroCoachAssessment } from "../Models/IMicroCoachAssessment";
import { isNullOrUndefined } from "../util/util";
import {
  CreateMicroCoachAssessmentInput,
  UpdateMicroCoachAssessmentInput,
} from "../../AWSAPI";

type MicroCoachAssessmentMutationInput = CreateMicroCoachAssessmentInput &
  UpdateMicroCoachAssessmentInput;

export class AssessmentParser {
  static parseIMicroCoachAssessmentfromAWSAssessment(
    assessment: AWSAssessment,
  ): IMicroCoachAssessment {
    if (
      isNullOrUndefined(assessment.id) ||
      isNullOrUndefined(assessment.classId) ||
      isNullOrUndefined(assessment.sessionId) ||
      isNullOrUndefined(assessment.assessmentCode) ||
      isNullOrUndefined(assessment.type) ||
      isNullOrUndefined(assessment.weekNumber) ||
      isNullOrUndefined(assessment.createdAt) ||
      isNullOrUndefined(assessment.updatedAt)
    ) {
      throw new Error(
        "Assessment has null field for the attributes that are not nullable",
      );
    }

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

  static parseAWSAssessmentInputfromIMicroCoachAssessment(
    assessment: IMicroCoachAssessment,
  ): MicroCoachAssessmentMutationInput {
    return {
      id: assessment.id,
      classId: assessment.classId,
      sessionId: assessment.sessionId,
      assessmentCode: assessment.assessmentCode,
      type: assessment.type,
      weekNumber: assessment.weekNumber,
    };
  }
}
