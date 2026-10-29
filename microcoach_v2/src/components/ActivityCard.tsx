import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { IMicroCoachActivity } from '../api/Models/IMicroCoachActivity';
import { ScreenSize } from '../lib/MicroCoachModels';
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

// An empty row keeps a missing section's place, so the rows below line up.
function RowPlaceholder() {
  return <span aria-hidden />;
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
  // Side by side at LARGE: the card shares its rows with its neighbours.
  const isAligned = screenSize === ScreenSize.LARGE;

  return (
    <ActivityCardSurface isAligned={isAligned}>
      <CardHeader isAligned={isAligned}>
        <NameRow>
          <Typography
            variant="headingLg"
            component="h2"
            // Its box as tall as its font size (24, not 36), as on the flow cards.
            sx={{ color: 'designSystem.surface.atlanticNavy', lineHeight: 1 }}
          >
            {template.name}
          </Typography>
          {activity.durationLabel && <DurationChip>{activity.durationLabel}</DurationChip>}
        </NameRow>
        <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
          {template.subtitle}
        </Typography>
        {content ? (
          <GroupingSequenceChips steps={content.howToRun} />
        ) : (
          isAligned && <RowPlaceholder />
        )}
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

      {!content && isAligned && <RowPlaceholder />}
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
