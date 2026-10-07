import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { IMicroCoachActivity } from '../api/Models/IMicroCoachActivity';
import {
  GroupingKind,
  groupingSequence,
  mockActivityTemplate,
} from '../lib/mocks/mockActivityTemplates';
import {
  ActivityCardSurface,
  CardAction,
  CardActionRow,
  CardHeader,
  CardSection,
  DurationChip,
  GroupingChip,
  GroupingSequence,
  NameRow,
  RunStep,
  RunSteps,
  SequenceArrow,
  StepBadge,
  ScreenSizeProps,
} from '../lib/styledcomponents/ChooseActivityStyledComponents';
import groupingIndividual from '../images/groupingIndividual.png';
import groupingPairs from '../images/groupingPairs.png';
import groupingWholeClass from '../images/groupingWholeClass.png';

const GROUPING_ICONS: Record<GroupingKind, string> = {
  INDIVIDUAL: groupingIndividual,
  PAIRS: groupingPairs,
  WHOLE_CLASS: groupingWholeClass,
};

interface ActivityCardProps extends ScreenSizeProps {
  activity: IMicroCoachActivity;
  misconceptionTitle: string;
  onViewDetails: (activityId: string) => void;
  onSelect: (activity: IMicroCoachActivity) => void;
}

/**
 * One next-step activity (Figma: SelectActivity). The template name, "why"
 * lead-in, run-of-show and the grouping sequence derived from it come from
 * a mock until the real per-template content lands; the routine name and
 * duration are the activity's own.
 */
export default function ActivityCard({
  activity,
  misconceptionTitle,
  screenSize,
  onViewDetails,
  onSelect,
}: ActivityCardProps) {
  const { t } = useTranslation();
  const template = mockActivityTemplate(activity.activityType);
  const sequence = groupingSequence(template.steps);

  return (
    <ActivityCardSurface>
      <CardHeader>
        <NameRow>
          <Typography
            variant="headingLg"
            component="h2"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {template.name}
          </Typography>
          {activity.durationLabel && <DurationChip>{activity.durationLabel}</DurationChip>}
        </NameRow>
        <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
          {activity.routine.name}
        </Typography>
        {sequence.length > 0 && (
          <GroupingSequence role="group" aria-label={t('chooseActivity.groupingSequence')}>
            {sequence.map(({ kind, fromStep }, index) => (
              <React.Fragment key={fromStep}>
                {index > 0 && <SequenceArrow aria-hidden>›</SequenceArrow>}
                <GroupingChip>
                  <img src={GROUPING_ICONS[kind]} alt="" />
                  {t(`chooseActivity.grouping.${kind}`)}
                </GroupingChip>
              </React.Fragment>
            ))}
          </GroupingSequence>
        )}
      </CardHeader>

      <CardSection>
        <Typography variant="headingSm" component="h3">
          {t('chooseActivity.whyTitle')}
        </Typography>
        <Typography variant="smallBodyText">
          {`${template.whyLeadIn} `}
          <strong>{misconceptionTitle}</strong>.
        </Typography>
      </CardSection>

      <CardSection>
        <Typography variant="headingSm" component="h3">
          {t('chooseActivity.howToRunTitle')}
        </Typography>
        <RunSteps screenSize={screenSize}>
          {template.steps.map((step, index) => (
            <RunStep key={step.text}>
              <StepBadge aria-hidden>{index + 1}</StepBadge>
              {step.text}
            </RunStep>
          ))}
        </RunSteps>
      </CardSection>

      <CardActionRow>
        <CardAction disableElevation onClick={() => onViewDetails(activity.id)}>
          {t('chooseActivity.viewDetails')}
        </CardAction>
        <CardAction isPrimary disableElevation onClick={() => onSelect(activity)}>
          {t('chooseActivity.selectActivity')}
        </CardAction>
      </CardActionRow>
    </ActivityCardSurface>
  );
}
