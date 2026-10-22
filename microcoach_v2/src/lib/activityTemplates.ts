import { ActivityType } from './PipelineModels';
import { Translate } from './activityMarks';

/**
 * What is fixed per activity template (Wave 2 Activity Library): the
 * classroom-facing name, the primary instructional move shown under it, the
 * description of what students do, and the heading over the Facilitate
 * artifact. Catalogue copy rather than row data, so it translates and can't
 * drift between activities of the same template.
 */
export interface IActivityTemplateCopy {
  name: string;
  subtitle: string;
  description: string;
  artifactTitle: string;
}

export const ACTIVITY_TYPES: ActivityType[] = [
  'INCORRECT_WORKED_EXAMPLES',
  'FAVORITE_NO',
  'MATH_DETECTIVE',
  'COMPARE_THE_THINKING',
  'MAKE_YOUR_CASE',
];

export function activityTemplateCopy(
  type: ActivityType,
  t: Translate,
): IActivityTemplateCopy {
  const key = `activityTemplates.${type}`;
  return {
    name: t(`${key}.name`),
    subtitle: t(`${key}.subtitle`),
    description: t(`${key}.description`),
    artifactTitle: t(`${key}.artifactTitle`),
  };
}
