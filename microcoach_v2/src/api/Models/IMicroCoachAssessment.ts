import { AssessmentType } from "../../AWSAPI";

export interface IMicroCoachAssessment {
  id: string;
  classId: string;
  sessionId: string;
  assessmentCode: string;
  type: AssessmentType;
  weekNumber: number;
  createdAt: string;
  updatedAt: string;
}
