import { IMicroCoachStudent } from "../../../Models/IMicroCoachStudent";

export interface IStudentAPIClient {
  getStudent(id: string): Promise<IMicroCoachStudent | null>;
  getStudentsByClassId(classId: string): Promise<IMicroCoachStudent[]>;
  createStudent(
    student: IMicroCoachStudent,
  ): Promise<IMicroCoachStudent | null>;
  updateStudent(
    student: IMicroCoachStudent,
  ): Promise<IMicroCoachStudent | null>;
  deleteStudent(id: string): Promise<IMicroCoachStudent | null>;
}
