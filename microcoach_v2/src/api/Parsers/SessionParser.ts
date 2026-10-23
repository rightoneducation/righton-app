import { IMicroCoachSession } from '../Models/IMicroCoachSession';
import { AWSSession } from '../Models/AWS/AWSSession';
import { isNullOrUndefined } from '../util/util';
import {
  CreateMicroCoachSessionInput,
  UpdateMicroCoachSessionInput,
} from '../../AWSAPI';

type MicroCoachSessionMutationInput = CreateMicroCoachSessionInput &
  UpdateMicroCoachSessionInput;

export class SessionParser {
  static parseIMicroCoachSessionfromAWSSession(
    session: AWSSession,
  ): IMicroCoachSession {
    if (
      isNullOrUndefined(session.id) ||
      isNullOrUndefined(session.classId) ||
      isNullOrUndefined(session.createdAt) ||
      isNullOrUndefined(session.updatedAt)
    ) {
      throw new Error(
        'Session has null field for the attributes that are not nullable',
      );
    }

    const parsedSession: IMicroCoachSession = {
      id: session.id,
      classId: session.classId,
      sessionLabel: session.sessionLabel ?? null,
      weekLabel: session.weekLabel ?? null,
      weekNumber: session.weekNumber ?? null,
      topic: session.topic ?? null,
      ccssStandards: (session.ccssStandards ?? []).filter(
        (standard): standard is string => standard != null,
      ),
      status: session.status ?? null,
      publishStatus: session.publishStatus ?? null,
      studentWorksAnalyzed: session.studentWorksAnalyzed ?? null,
      studentsWithStrongUnderstanding:
        session.studentsWithStrongUnderstanding ?? null,
      studentsWithStrongUnderstandingIds: (
        session.studentsWithStrongUnderstandingIds ?? []
      ).filter((studentId): studentId is string => studentId != null),
      studentIdsNeedingSupport: (session.studentIdsNeedingSupport ?? []).filter(
        (studentId): studentId is string => studentId != null,
      ),
      ppqAssessmentId: session.ppqAssessmentId ?? null,
      postPpqAssessmentId: session.postPpqAssessmentId ?? null,
      pregeneratedNextSteps: session.pregeneratedNextSteps ?? null,
      evaluationResults: session.evaluationResults ?? null,
      questionStats: (session.questionStats ?? [])
        .filter((stat): stat is NonNullable<typeof stat> => stat != null)
        .map((stat) => ({
          questionNumber: stat.questionNumber,
          percentCorrect: stat.percentCorrect,
          questionText: stat.questionText ?? null,
          options: (stat.options ?? [])
            .filter((option): option is NonNullable<typeof option> => option != null)
            .map((option) => ({
              letter: option.letter,
              text: option.text ?? null,
              percentChosen: option.percentChosen ?? null,
              isCorrect: option.isCorrect ?? false,
              studentNames: (option.studentNames ?? []).filter(
                (name): name is string => name != null,
              ),
            })),
        }))
        .sort((a, b) => a.questionNumber - b.questionNumber),
      reflectionResults: (session.reflectionResults ?? [])
        .filter(
          (result): result is NonNullable<typeof result> => result != null,
        )
        .map((result) => ({
          activityId: result.activityId ?? null,
          misconceptionId: result.misconceptionId,
          questionCount: result.questionCount,
          averagePercentCorrectBefore: result.averagePercentCorrectBefore,
          averagePercentCorrectAfter: result.averagePercentCorrectAfter,
          averageQuestionsCorrectBefore: result.averageQuestionsCorrectBefore,
          averageQuestionsCorrectAfter: result.averageQuestionsCorrectAfter,
          improvedStudentCount: result.improvedStudentCount,
          studentResults: (result.studentResults ?? [])
            .filter(
              (student): student is NonNullable<typeof student> =>
                student != null,
            )
            .map((student) => ({
              studentId: student.studentId,
              studentName: student.studentName ?? null,
              questionsCorrectBefore: student.questionsCorrectBefore ?? null,
              questionsCorrectAfter: student.questionsCorrectAfter ?? null,
            })),
          questionResults: (result.questionResults ?? [])
            .filter(
              (question): question is NonNullable<typeof question> =>
                question != null,
            )
            .map((question) => ({
              questionNumber: question.questionNumber,
              questionText: question.questionText,
              beforeQuestionText: question.beforeQuestionText ?? null,
              afterQuestionText: question.afterQuestionText ?? null,
              beforeStandard: question.beforeStandard ?? null,
              afterStandard: question.afterStandard ?? null,
              percentCorrectBefore: question.percentCorrectBefore,
              percentCorrectAfter: question.percentCorrectAfter,
              beforeAnswers: (question.beforeAnswers ?? [])
                .filter(
                  (answer): answer is NonNullable<typeof answer> =>
                    answer != null,
                )
                .map((answer) => ({
                  letter: answer.letter,
                  text: answer.text,
                  percentChosen: answer.percentChosen,
                  isCorrect: answer.isCorrect,
                })),
              afterAnswers: (question.afterAnswers ?? [])
                .filter(
                  (answer): answer is NonNullable<typeof answer> =>
                    answer != null,
                )
                .map((answer) => ({
                  letter: answer.letter,
                  text: answer.text,
                  percentChosen: answer.percentChosen,
                  isCorrect: answer.isCorrect,
                })),
            })),
        })),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };

    return parsedSession;
  }

  static parseAWSSessionInputfromIMicroCoachSession(
    session: IMicroCoachSession,
  ): MicroCoachSessionMutationInput {
    return {
      id: session.id,
      classId: session.classId,
      sessionLabel: session.sessionLabel,
      weekLabel: session.weekLabel,
      weekNumber: session.weekNumber,
      topic: session.topic,
      ccssStandards: session.ccssStandards,
      status: session.status,
      publishStatus: session.publishStatus,
      studentWorksAnalyzed: session.studentWorksAnalyzed,
      studentsWithStrongUnderstanding: session.studentsWithStrongUnderstanding,
      studentsWithStrongUnderstandingIds:
        session.studentsWithStrongUnderstandingIds,
      studentIdsNeedingSupport: session.studentIdsNeedingSupport,
      ppqAssessmentId: session.ppqAssessmentId,
      postPpqAssessmentId: session.postPpqAssessmentId,
      pregeneratedNextSteps: session.pregeneratedNextSteps,
      evaluationResults: session.evaluationResults,
    };
  }
}
