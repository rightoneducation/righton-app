import { IMicroCoachActivity } from '../api/Models/IMicroCoachActivity';
import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { IPlanItem } from './PipelineModels';

/**
 * The plan entry for choosing `activity` to address `misconception`. Select
 * Activity and the last phase of the activity flow both save through this,
 * so the two can't write different entries for the same choice.
 */
export default function planItemFor(
  misconception: IMicroCoachMisconception,
  activity: IMicroCoachActivity,
): IPlanItem {
  return {
    id: activity.id,
    status: 'SAVED',
    activityId: activity.id,
    activityTitle: activity.routine.name,
    skillCode: misconception.skillContext?.focusSkill.code ?? '',
    misconceptionId: misconception.id,
    misconceptionTitle: misconception.titleCased,
    prevalence: {
      level: misconception.prevalence.level,
      label: misconception.prevalence.label,
    },
    grouping: activity.grouping ?? { level: 'WHOLE_CLASS', label: '' },
  };
}
