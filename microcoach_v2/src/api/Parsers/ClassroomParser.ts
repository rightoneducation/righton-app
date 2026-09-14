import { AWSClassroom } from "../Models/AWS/AWSClassroom";
import { IMicroCoachClassroom } from "../Models/IMicroCoachClassroom";

export class ClassroomParser {
  static parseIMicroCoachClassroomfromAWSClassroom(
    classroom: AWSClassroom,
  ): IMicroCoachClassroom {
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
}
