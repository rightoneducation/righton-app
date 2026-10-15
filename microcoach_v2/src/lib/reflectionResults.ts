import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { IImplementedActivity, IReflect } from './PipelineModels';

export type ReflectionTrend = 'improved' | 'declined' | 'unchanged';

export function getReflectionTrend(change: number): ReflectionTrend {
  if (change > 0) return 'improved';
  if (change < 0) return 'declined';
  return 'unchanged';
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
      };
    },
  );

  return { implementedActivities };
}
