import {
  CreateMicroCoachClassroomInput,
  UpdateMicroCoachClassroomInput,
} from "../../../../AWSAPI";
import { IMicroCoachClassroom } from "../../../Models/IMicroCoachClassroom";

export interface IClassroomAPIClient {
  getClassroom(id: string): Promise<IMicroCoachClassroom | null>;
  getClassroomsByUserId(userId: string): Promise<IMicroCoachClassroom[]>;
  createClassroom(
    input: CreateMicroCoachClassroomInput,
  ): Promise<IMicroCoachClassroom | null>;
  updateClassroom(
    input: UpdateMicroCoachClassroomInput,
  ): Promise<IMicroCoachClassroom | null>;
  deleteClassroom(id: string): Promise<IMicroCoachClassroom | null>;
}
