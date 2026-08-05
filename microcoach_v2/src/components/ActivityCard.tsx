import React from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IActivity } from '../lib/PipelineModels';
import {
  ActivityCard as CardSurface,
  DurationChip,
  GroupingChip,
  MetaSeparator,
  CardAction,
  CardActionRow,
  ScreenSizeProps,
} from '../lib/styledcomponents/ChooseActivityStyledComponents';

interface ActivityCardProps extends ScreenSizeProps {
  activity: IActivity;
  /** Owned by the page, not read off the activity — selection is page state. */
  isSelected: boolean;
  onSelect: (activityId: string) => void;
  onHowToRun: (activityId: string) => void;
}

export default function ActivityCard({
  activity,
  isSelected,
  screenSize,
  onSelect,
  onHowToRun,
}: ActivityCardProps) {
  const { t } = useTranslation();
  const { routine } = activity;

  return (
    <CardSurface elevation={4} screenSize={screenSize} isSelected={isSelected}>
      <Typography
        variant="headingMd"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
      >
        {routine.name}
      </Typography>

      {(activity.durationLabel || activity.grouping) && (
        <Stack direction="row" alignItems="center" spacing={1}>
          {activity.durationLabel && (
            <DurationChip>{activity.durationLabel}</DurationChip>
          )}
          {activity.durationLabel && activity.grouping && (
            <MetaSeparator aria-hidden>|</MetaSeparator>
          )}
          {activity.grouping && (
            <GroupingChip>{activity.grouping.label}</GroupingChip>
          )}
        </Stack>
      )}

      <Typography
        variant="headingSm"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
      >
        {t('chooseActivity.subtitleLabel')}
      </Typography>
      <Typography
        variant="rubikBody"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
      >
        {routine.subtitle}
      </Typography>

      <Typography
        variant="headingSm"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
      >
        {t('chooseActivity.descriptionLabel')}
      </Typography>
      <Typography
        variant="rubikBody"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
      >
        {routine.description}
      </Typography>

      <CardActionRow>
        <CardAction
          tone={isSelected ? 'disabled' : 'secondary'}
          disableElevation
          disabled={isSelected}
          onClick={() => onSelect(activity.id)}
        >
          {isSelected
            ? t('chooseActivity.selectedActivity')
            : t('chooseActivity.selectActivity')}
        </CardAction>
        <CardAction
          tone="primary"
          disableElevation
          onClick={() => onHowToRun(activity.id)}
        >
          {t('chooseActivity.howToRun')}
        </CardAction>
      </CardActionRow>
    </CardSurface>
  );
}
