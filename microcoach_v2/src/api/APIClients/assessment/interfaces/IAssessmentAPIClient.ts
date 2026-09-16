import { IMicroCoachAssessment } from "../../../Models/IMicroCoachAssessment";

export interface IAssessmentAPIClient {
  getAssessment(id: string): Promise<IMicroCoachAssessment | null>;
  getAssessmentsByClassId(classId: string): Promise<IMicroCoachAssessment[]>;
  getAssessmentsBySessionId(sessionId: string): Promise<IMicroCoachAssessment[]>;
  createAssessment(
    assessment: IMicroCoachAssessment,
  ): Promise<IMicroCoachAssessment | null>;
  updateAssessment(
    assessment: IMicroCoachAssessment,
  ): Promise<IMicroCoachAssessment | null>;
  deleteAssessment(id: string): Promise<IMicroCoachAssessment | null>;
}
