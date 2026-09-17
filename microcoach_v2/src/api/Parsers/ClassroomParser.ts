import { AWSClassroom } from "../Models/AWS/AWSClassroom";
import { IMicroCoachClassroom } from "../Models/IMicroCoachClassroom";
import { isNullOrUndefined } from "../util/util";
import {
  CreateMicroCoachClassroomInput,
  UpdateMicroCoachClassroomInput,
} from "../../AWSAPI";

type MicroCoachClassroomMutationInput = CreateMicroCoachClassroomInput &
  UpdateMicroCoachClassroomInput;

export class ClassroomParser {
  static parseIMicroCoachClassroomfromAWSClassroom(
    classroom: AWSClassroom,
  ): IMicroCoachClassroom {
    if (
      isNullOrUndefined(classroom.id) ||
      isNullOrUndefined(classroom.userId) ||
      isNullOrUndefined(classroom.name) ||
      isNullOrUndefined(classroom.createdAt) ||
      isNullOrUndefined(classroom.updatedAt)
    ) {
      throw new Error(
        "Classroom has null field for the attributes that are not nullable",
      );
    }

    const parsedClassroom: IMicroCoachClassroom = {
      id: classroom.id,
      userId: classroom.userId,
      name: classroom.name,
      grade: classroom.grade ?? null,
      state: classroom.state ?? null,
      schoolYear: classroom.schoolYear ?? null,
      createdAt: classroom.createdAt,
      updatedAt: classroom.updatedAt,
    }

    return parsedClassroom
  }

  static parseAWSClassroomInputfromIMicroCoachClassroom(
    classroom: IMicroCoachClassroom,
  ): MicroCoachClassroomMutationInput {
    return {
      id: classroom.id,
      userId: classroom.userId,
      name: classroom.name,
      grade: classroom.grade,
      state: classroom.state,
      schoolYear: classroom.schoolYear,
    };
  }
}
