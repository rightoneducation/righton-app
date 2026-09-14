import {
  CreateMicroCoachStudentInput,
  UpdateMicroCoachStudentInput,
} from "../../../../AWSAPI";
import { IMicroCoachStudent } from "../../../Models/IMicroCoachStudent";

export interface IStudentAPIClient {
  getStudent(id: string): Promise<IMicroCoachStudent | null>;
  getStudentsByClassId(classId: string): Promise<IMicroCoachStudent[]>;
  createStudent(
    input: CreateMicroCoachStudentInput,
  ): Promise<IMicroCoachStudent | null>;
  updateStudent(
    input: UpdateMicroCoachStudentInput,
  ): Promise<IMicroCoachStudent | null>;
  deleteStudent(id: string): Promise<IMicroCoachStudent | null>;
}
