import { IMicroCoachSession } from "../Models/IMicroCoachSession";
import { AWSSession } from "../Models/AWS/AWSSession";

export class SessionParser {
  static parseIMicroCoachSessionfromAWSSession(session: AWSSession): IMicroCoachSession {
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
}
