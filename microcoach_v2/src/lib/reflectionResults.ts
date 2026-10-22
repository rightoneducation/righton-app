import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { IImplementedActivity, IReflect } from './PipelineModels';

export type ReflectionTrend = 'improved' | 'declined' | 'unchanged';
export type ReflectionDetailSort = 'highestScoring' | 'mostImproved';

export function getReflectionTrend(change: number): ReflectionTrend {
  if (change > 0) return 'improved';
  if (change < 0) return 'declined';
  return 'unchanged';
}

interface LegacyPostPpqResults {
  hasResults?: boolean;
  questionCount?: number;
  classMasteryBefore?: number;
  classMasteryAfter?: number;
  improvedCount?: number;
}

interface LegacyGeneratedMove {
  id?: string;
  title?: string;
  summary?: string;
  instructionalMove?: string;
}

interface LegacyNextStep {
  id?: string;
  sourceMisconceptionId?: string | null;
  title?: string;
  ccssStandards?: {
    targetObjective?: { standard?: string };
  };
  moveOptions?: LegacyGeneratedMove[];
  questionErrorRates?: unknown[];
  ppqQuestions?: unknown[];
  postPpqResults?: LegacyPostPpqResults;
}

function parseLegacyNextSteps(value: unknown): LegacyNextStep[] {
  if (!value) return [];

  try {
    const parsed: unknown = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? (parsed as LegacyNextStep[]) : [];
  } catch {
    return [];
  }
}

function toOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function buildLegacyReflectionResults(
  session: IMicroCoachSession,
  misconceptions: IMicroCoachMisconception[],
): IImplementedActivity[] {
  return parseLegacyNextSteps(session.pregeneratedNextSteps)
    .map((nextStep): IImplementedActivity | null => {
      const results = nextStep.postPpqResults;
      if (
        results?.hasResults === false ||
        typeof results?.classMasteryBefore !== 'number' ||
        typeof results.classMasteryAfter !== 'number' ||
        typeof results.improvedCount !== 'number'
      ) {
        return null;
      }

      const normalizedTitle = nextStep.title?.trim().toLowerCase();
      const misconception =
        misconceptions.find(
          (item) => item.id === nextStep.sourceMisconceptionId,
        ) ??
        misconceptions.find(
          (item) => item.title.trim().toLowerCase() === normalizedTitle,
        ) ??
        null;
      const activity =
        misconception?.nextStepActivities.find((item) => item.isSelected) ??
        misconception?.nextStepActivities[0] ??
        null;
      const generatedMove = nextStep.moveOptions?.[0];
      const questionCount =
        results.questionCount ??
        nextStep.questionErrorRates?.length ??
        nextStep.ppqQuestions?.length ??
        0;

      return {
        id:
          activity?.id ??
          generatedMove?.id ??
          nextStep.id ??
          nextStep.sourceMisconceptionId ??
          nextStep.title ??
          'legacy-reflection-result',
        title:
          activity?.title ??
          activity?.routine.name ??
          generatedMove?.title ??
          nextStep.title ??
          '',
        subtitle:
          activity?.routine.subtitle.trim() ||
          generatedMove?.instructionalMove?.trim() ||
          '',
        description:
          activity?.routine.description.trim() ||
          generatedMove?.summary?.trim() ||
          '',
        skillCode:
          misconception?.skillContext?.focusSkill.code ??
          nextStep.ccssStandards?.targetObjective?.standard ??
          '',
        misconceptionTitle: misconception?.titleCased ?? nextStep.title ?? '',
        questionCount,
        averagePercentCorrectBefore: results.classMasteryBefore,
        averagePercentCorrectAfter: results.classMasteryAfter,
        averageQuestionsCorrectBefore: toOneDecimal(
          (results.classMasteryBefore / 100) * questionCount,
        ),
        averageQuestionsCorrectAfter: toOneDecimal(
          (results.classMasteryAfter / 100) * questionCount,
        ),
        improvedStudentCount: results.improvedCount,
        studentResults: [],
        questionResults: [],
      };
    })
    .filter(
      (activity): activity is IImplementedActivity => activity !== null,
    );
}

export default function buildReflectionResults(
  session: IMicroCoachSession | null,
  misconceptions: IMicroCoachMisconception[],
): IReflect {
  const implementedActivities = (session?.reflectionResults ?? []).map(
    (result, index): IImplementedActivity => {
      const misconception =
        misconceptions.find((item) => item.id === result.misconceptionId) ??
        null;
      const activity =
        misconception?.nextStepActivities.find(
          (item) => item.id === result.activityId,
        ) ??
        misconception?.nextStepActivities.find((item) => item.isSelected) ??
        misconception?.nextStepActivities[0] ??
        null;

      return {
        id:
          result.activityId ??
          `${result.misconceptionId}-reflection-result-${index}`,
        title: activity?.title ?? activity?.routine.name ?? '',
        subtitle: activity?.routine.subtitle.trim() ?? '',
        description: activity?.routine.description.trim() ?? '',
        skillCode: misconception?.skillContext?.focusSkill.code ?? '',
        misconceptionTitle: misconception?.titleCased ?? '',
        questionCount: result.questionCount,
        averagePercentCorrectBefore: result.averagePercentCorrectBefore,
        averagePercentCorrectAfter: result.averagePercentCorrectAfter,
        averageQuestionsCorrectBefore: result.averageQuestionsCorrectBefore,
        averageQuestionsCorrectAfter: result.averageQuestionsCorrectAfter,
        improvedStudentCount: result.improvedStudentCount,
        studentResults: result.studentResults,
        questionResults: result.questionResults,
      };
    },
  );

  if (implementedActivities.length > 0 || !session) {
    return { implementedActivities };
  }

  return {
    implementedActivities: buildLegacyReflectionResults(
      session,
      misconceptions,
    ),
  };
}
