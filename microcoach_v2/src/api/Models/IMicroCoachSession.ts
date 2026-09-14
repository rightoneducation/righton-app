import { PublishStatus, SessionStatus } from "../../AWSAPI";

export interface IMicroCoachSession {
  id: string;
  classId: string;
  sessionLabel: string | null;
  weekLabel: string | null;
  weekNumber: number | null;
  topic: string | null;
  ccssStandards: string[];
  status: SessionStatus | null;
  publishStatus: PublishStatus | null;
  studentWorksAnalyzed: number | null;
  studentsWithStrongUnderstanding: number | null;
  studentsWithStrongUnderstandingIds: string[];
  studentIdsNeedingSupport: string[];
  ppqAssessmentId: string | null;
  postPpqAssessmentId: string | null;
  pregeneratedNextSteps: string | null;
  evaluationResults: string | null;
  createdAt: string;
  updatedAt: string;
}
