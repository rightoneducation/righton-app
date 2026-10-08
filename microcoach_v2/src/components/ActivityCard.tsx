import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { IMicroCoachActivity } from '../api/Models/IMicroCoachActivity';
import MathTypography from './MathTypography';
import { activityTemplateCopy } from '../lib/activityTemplates';
import { GroupingSequenceChips } from './GroupingChips';
import {
  ActivityCardSurface,
  CardAction,
  CardActionRow,
  CardHeader,
  CardSection,
  DurationChip,
  NameRow,
  RunStep,
  RunSteps,
  StepBadge,
  ScreenSizeProps,
} from '../lib/styledcomponents/ChooseActivityStyledComponents';

interface ActivityCardProps extends ScreenSizeProps {
  activity: IMicroCoachActivity;
  onViewDetails: (activityId: string) => void;
  onSelect: (activity: IMicroCoachActivity) => void;
}

/**
 * One next-step activity (Figma: SelectActivity): the template's name and
 * instructional move, the grouping sequence, why MicroCoach chose it, and the
 * run-of-show. An activity without Wave 2 content shows only the template's
 * own copy.
 */
export default function ActivityCard({
  activity,
  screenSize,
  onViewDetails,
  onSelect,
}: ActivityCardProps) {
  const { t } = useTranslation();
  const template = activityTemplateCopy(activity.activityType, t);
  const { content } = activity;

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
          {template.subtitle}
        </Typography>
        {content && <GroupingSequenceChips steps={content.howToRun} />}
      </CardHeader>

      <CardSection>
        <Typography variant="headingSm" component="h3">
          {t('chooseActivity.whyTitle')}
        </Typography>
        <MathTypography
          variant="smallBodyText"
          text={content?.whyThisActivity ?? template.description}
        />
      </CardSection>

      {content && (
        <CardSection>
          <Typography variant="headingSm" component="h3">
            {t('chooseActivity.howToRunTitle')}
          </Typography>
          <RunSteps screenSize={screenSize}>
            {content.howToRun.map((step, index) => (
              <RunStep key={step.title}>
                <StepBadge aria-hidden>{index + 1}</StepBadge>
                <MathTypography variant="microLabel" component="span" text={step.title} />
              </RunStep>
            ))}
          </RunSteps>
        </CardSection>
      )}

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
