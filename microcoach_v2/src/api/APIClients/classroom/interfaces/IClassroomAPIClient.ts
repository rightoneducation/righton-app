import { IMicroCoachClassroom } from "../../../Models/IMicroCoachClassroom";

export interface IClassroomAPIClient {
  getClassroom(id: string): Promise<IMicroCoachClassroom | null>;
  getClassroomsByUserId(userId: string): Promise<IMicroCoachClassroom[]>;
  createClassroom(
    classroom: IMicroCoachClassroom,
  ): Promise<IMicroCoachClassroom | null>;
  updateClassroom(
    classroom: IMicroCoachClassroom,
  ): Promise<IMicroCoachClassroom | null>;
  deleteClassroom(id: string): Promise<IMicroCoachClassroom | null>;
}
