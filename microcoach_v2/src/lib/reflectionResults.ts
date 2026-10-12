/**
 * Parses a session's AWSJSON next-step results and builds the data displayed
 * by Reflect. This stays outside the page because it also validates the raw
 * JSON and joins each result with its backend misconception and activity.
 */
import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { IImplementedActivity, IReflect } from './PipelineModels';

export type ReflectionTrend = 'improved' | 'declined' | 'unchanged';

export function getReflectionTrend(change: number): ReflectionTrend {
  if (change > 0) return 'improved';
  if (change < 0) return 'declined';
  return 'unchanged';
}

interface PostPpqResults {
  hasResults?: boolean;
  questionCount?: number;
  classMasteryBefore?: number;
  classMasteryAfter?: number;
  improvedCount?: number;
}

interface GeneratedMove {
  id?: string;
  title?: string;
  summary?: string;
  instructionalMove?: string;
}

interface GeneratedNextStep {
  id?: string;
  sourceMisconceptionId?: string | null;
  title?: string;
  ccssStandards?: {
    targetObjective?: { standard?: string };
  };
  moveOptions?: GeneratedMove[];
  questionErrorRates?: unknown[];
  postPpqResults?: PostPpqResults;
}

function parseNextSteps(value: unknown): GeneratedNextStep[] {
  if (!value) return [];

  try {
    const parsed: unknown = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? (parsed as GeneratedNextStep[]) : [];
  } catch {
    return [];
  }
}

export default function buildReflectionResults(
  session: IMicroCoachSession | null,
  misconceptions: IMicroCoachMisconception[],
): IReflect {
  const implementedActivities = parseNextSteps(
    session?.pregeneratedNextSteps ?? null,
  )
    .map((nextStep) => {
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

      return {
        id:
          activity?.id ??
          generatedMove?.id ??
          nextStep.id ??
          nextStep.sourceMisconceptionId ??
          nextStep.title ??
          'reflection-result',
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
        questionCount:
          results.questionCount ?? nextStep.questionErrorRates?.length ?? 0,
        masteryBefore: results.classMasteryBefore,
        masteryAfter: results.classMasteryAfter,
        studentsImproved: results.improvedCount,
      };
    })
    .filter(
      (activity): activity is IImplementedActivity => activity !== null,
    );

  return { implementedActivities };
}
