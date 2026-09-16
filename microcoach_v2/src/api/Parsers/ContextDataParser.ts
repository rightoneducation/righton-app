import { AWSContextData } from "../Models/AWS/AWSContextData";
import { IMicroCoachContextData } from "../Models/IMicroCoachContextData";
import { isNullOrUndefined } from "../util/util";
import {
  CreateContextDataInput,
  ExemplarQuestionInput,
  InstructionalStrategyInput,
  NextStepLessonInput,
  UpdateContextDataInput,
  WalkthroughDataInput,
} from "../../AWSAPI";

type ContextDataMutationInput = CreateContextDataInput & UpdateContextDataInput;

function parseNextStepLessonInput(
  lesson: NonNullable<IMicroCoachContextData["nextStepLesson"]>,
): NextStepLessonInput {
  return {
    targetAssessmentCode: lesson.targetAssessmentCode,
    targetQuestionNumbers: lesson.targetQuestionNumbers,
    topic: lesson.topic,
    targetProblem: lesson.targetProblem,
    errorScenarios: lesson.errorScenarios?.map((scenario) =>
      scenario
        ? {
            studentLabel: scenario.studentLabel,
            isCorrect: scenario.isCorrect,
            approach: scenario.approach,
            reasoning: scenario.reasoning,
          }
        : null,
    ),
    phases: lesson.phases?.map((phase) =>
      phase
        ? {
            phaseName: phase.phaseName,
            durationMinutes: phase.durationMinutes,
            steps: phase.steps,
            teacherPrompts: phase.teacherPrompts,
          }
        : null,
    ),
    keyTakeaways: lesson.keyTakeaways,
    independentProblems: lesson.independentProblems,
    exitTicket: lesson.exitTicket,
  };
}

function parseExemplarQuestionInput(
  question: IMicroCoachContextData["exemplarQuestions"][number],
): ExemplarQuestionInput {
  return {
    questionNumber: question.questionNumber,
    questionText: question.questionText,
    ccssStandard: question.ccssStandard,
    correctAnswer: question.correctAnswer,
    pointValue: question.pointValue,
    answerChoices: question.answerChoices?.map((choice) =>
      choice
        ? {
            label: choice.label,
            text: choice.text,
          }
        : null,
    ),
    misconceptions: question.misconceptions?.map((misconception) =>
      misconception
        ? {
            description: misconception.description,
            targetAnswer: misconception.targetAnswer,
          }
        : null,
    ),
    sourceNote: question.sourceNote,
  };
}

function parseInstructionalStrategyInput(
  strategy: NonNullable<IMicroCoachContextData["strategy"]>,
): InstructionalStrategyInput {
  return {
    name: strategy.name,
    description: strategy.description,
    steps: strategy.steps,
    applicableGrades: strategy.applicableGrades,
    applicableStandards: strategy.applicableStandards,
    examples: strategy.examples,
  };
}

function parseWalkthroughDataInput(
  walkthroughData: NonNullable<IMicroCoachContextData["walkthroughData"]>,
): WalkthroughDataInput {
  return {
    quarter: walkthroughData.quarter,
    schools: walkthroughData.schools?.map((school) =>
      school
        ? {
            schoolCode: school.schoolCode,
            rubricScores: school.rubricScores,
            notes: school.notes,
          }
        : null,
    ),
  };
}

export class ContextDataParser {
  static parseIMicroCoachContextDatafromAWSContextData(
    contextData: AWSContextData,
  ): IMicroCoachContextData {
    if (
      isNullOrUndefined(contextData.id) ||
      isNullOrUndefined(contextData.type) ||
      isNullOrUndefined(contextData.title) ||
      isNullOrUndefined(contextData.createdAt) ||
      isNullOrUndefined(contextData.updatedAt)
    ) {
      throw new Error(
        "Context data has null field for the attributes that are not nullable",
      );
    }

    const parsedContextData: IMicroCoachContextData = {
      id: contextData.id,
      type: contextData.type,
      title: contextData.title,
      gradeLevel: contextData.gradeLevel ?? null,
      weekNumber: contextData.weekNumber ?? null,
      ccssStandards: (contextData.ccssStandards ?? []).filter(
        (standard): standard is string => standard != null,
      ),
      assessmentCode: contextData.assessmentCode ?? null,
      isReference: contextData.isReference ?? false,
      nextStepLesson: contextData.nextStepLesson ?? null,
      exemplarQuestions: (contextData.exemplarQuestions ?? []).filter(
        (question): question is NonNullable<typeof question> =>
          question != null,
      ),
      strategy: contextData.strategy ?? null,
      walkthroughData: contextData.walkthroughData ?? null,
      createdAt: contextData.createdAt,
      updatedAt: contextData.updatedAt,
    }

    return parsedContextData
  }

  static parseAWSContextDataInputfromIMicroCoachContextData(
    contextData: IMicroCoachContextData,
  ): ContextDataMutationInput {
    return {
      id: contextData.id,
      type: contextData.type,
      title: contextData.title,
      gradeLevel: contextData.gradeLevel,
      weekNumber: contextData.weekNumber,
      ccssStandards: contextData.ccssStandards,
      assessmentCode: contextData.assessmentCode,
      isReference: contextData.isReference,
      nextStepLesson: contextData.nextStepLesson
        ? parseNextStepLessonInput(contextData.nextStepLesson)
        : null,
      exemplarQuestions: contextData.exemplarQuestions.map(
        parseExemplarQuestionInput,
      ),
      strategy: contextData.strategy
        ? parseInstructionalStrategyInput(contextData.strategy)
        : null,
      walkthroughData: contextData.walkthroughData
        ? parseWalkthroughDataInput(contextData.walkthroughData)
        : null,
    };
  }
}
