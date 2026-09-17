import { IMicroCoachSession } from "../Models/IMicroCoachSession";
import { AWSSession } from "../Models/AWS/AWSSession";
import { isNullOrUndefined } from "../util/util";
import {
  CreateMicroCoachSessionInput,
  UpdateMicroCoachSessionInput,
} from "../../AWSAPI";

type MicroCoachSessionMutationInput = CreateMicroCoachSessionInput &
  UpdateMicroCoachSessionInput;

export class SessionParser {
  static parseIMicroCoachSessionfromAWSSession(session: AWSSession): IMicroCoachSession {
    if (
      isNullOrUndefined(session.id) ||
      isNullOrUndefined(session.classId) ||
      isNullOrUndefined(session.createdAt) ||
      isNullOrUndefined(session.updatedAt)
    ) {
      throw new Error(
        "Session has null field for the attributes that are not nullable",
      );
    }

    const parsedSession: IMicroCoachSession = {
      id: session.id,
      classId: session.classId,
      sessionLabel: session.sessionLabel ?? null,
      weekLabel: session.weekLabel ?? null,
      weekNumber: session.weekNumber ?? null,
      topic: session.topic ?? null,
      ccssStandards: (session.ccssStandards ?? []).filter(
        (standard): standard is string => standard != null,
      ),
      status: session.status ?? null,
      publishStatus: session.publishStatus ?? null,
      studentWorksAnalyzed: session.studentWorksAnalyzed ?? null,
      studentsWithStrongUnderstanding:
        session.studentsWithStrongUnderstanding ?? null,
      studentsWithStrongUnderstandingIds: (
        session.studentsWithStrongUnderstandingIds ?? []
      ).filter((studentId): studentId is string => studentId != null),
      studentIdsNeedingSupport: (session.studentIdsNeedingSupport ?? []).filter(
        (studentId): studentId is string => studentId != null,
      ),
      ppqAssessmentId: session.ppqAssessmentId ?? null,
      postPpqAssessmentId: session.postPpqAssessmentId ?? null,
      pregeneratedNextSteps: session.pregeneratedNextSteps ?? null,
      evaluationResults: session.evaluationResults ?? null,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }

    return parsedSession
  }

  static parseAWSSessionInputfromIMicroCoachSession(
    session: IMicroCoachSession,
  ): MicroCoachSessionMutationInput {
    return {
      id: session.id,
      classId: session.classId,
      sessionLabel: session.sessionLabel,
      weekLabel: session.weekLabel,
      weekNumber: session.weekNumber,
      topic: session.topic,
      ccssStandards: session.ccssStandards,
      status: session.status,
      publishStatus: session.publishStatus,
      studentWorksAnalyzed: session.studentWorksAnalyzed,
      studentsWithStrongUnderstanding: session.studentsWithStrongUnderstanding,
      studentsWithStrongUnderstandingIds:
        session.studentsWithStrongUnderstandingIds,
      studentIdsNeedingSupport: session.studentIdsNeedingSupport,
      ppqAssessmentId: session.ppqAssessmentId,
      postPpqAssessmentId: session.postPpqAssessmentId,
      pregeneratedNextSteps: session.pregeneratedNextSteps,
      evaluationResults: session.evaluationResults,
    };
  }
}
