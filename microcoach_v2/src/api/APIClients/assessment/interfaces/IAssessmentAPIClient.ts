import {
  CreateMicroCoachAssessmentInput,
  UpdateMicroCoachAssessmentInput,
} from "../../../../AWSAPI";
import { IMicroCoachAssessment } from "../../../Models/IMicroCoachAssessment";

export interface IAssessmentAPIClient {
  getAssessment(id: string): Promise<IMicroCoachAssessment | null>;
  getAssessmentsByClassId(classId: string): Promise<IMicroCoachAssessment[]>;
  getAssessmentsBySessionId(sessionId: string): Promise<IMicroCoachAssessment[]>;
  createAssessment(
    input: CreateMicroCoachAssessmentInput,
  ): Promise<IMicroCoachAssessment | null>;
  updateAssessment(
    input: UpdateMicroCoachAssessmentInput,
  ): Promise<IMicroCoachAssessment | null>;
  deleteAssessment(id: string): Promise<IMicroCoachAssessment | null>;
}
