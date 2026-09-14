import { AWSStudent } from "../Models/AWS/AWSStudent";
import { IMicroCoachStudent } from "../Models/IMicroCoachStudent";

export class StudentParser {
  static parseIMicroCoachStudentfromAWSStudent(
    student: AWSStudent,
  ): IMicroCoachStudent {
    const parsedStudent: IMicroCoachStudent = {
      id: student.id,
      classId: student.classId,
      name: student.name,
      externalId: student.externalId ?? null,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    }

    return parsedStudent
  }
}
