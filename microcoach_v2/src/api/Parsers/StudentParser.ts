import { AWSStudent } from "../Models/AWS/AWSStudent";
import { IMicroCoachStudent } from "../Models/IMicroCoachStudent";
import { isNullOrUndefined } from "../util/util";
import {
  CreateMicroCoachStudentInput,
  UpdateMicroCoachStudentInput,
} from "../../AWSAPI";

type MicroCoachStudentMutationInput = CreateMicroCoachStudentInput &
  UpdateMicroCoachStudentInput;

export class StudentParser {
  static parseIMicroCoachStudentfromAWSStudent(
    student: AWSStudent,
  ): IMicroCoachStudent {
    if (
      isNullOrUndefined(student.id) ||
      isNullOrUndefined(student.classId) ||
      isNullOrUndefined(student.name) ||
      isNullOrUndefined(student.createdAt) ||
      isNullOrUndefined(student.updatedAt)
    ) {
      throw new Error(
        "Student has null field for the attributes that are not nullable",
      );
    }

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

  static parseAWSStudentInputfromIMicroCoachStudent(
    student: IMicroCoachStudent,
  ): MicroCoachStudentMutationInput {
    return {
      id: student.id,
      classId: student.classId,
      name: student.name,
      externalId: student.externalId,
    };
  }
}
