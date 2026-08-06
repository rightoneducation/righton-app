import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { IMisconception } from '../lib/PipelineModels';
import {
  MisconceptionCard as CardSurface,
  BadgeSlot,
  FocusBadge,
  PrevalenceChip,
  CardCta,
  ScreenSizeProps,
} from '../lib/styledcomponents/ReviewStyledComponents';

interface MisconceptionCardProps extends ScreenSizeProps {
  misconception: IMisconception;
  onViewDetails: (misconceptionId: string) => void;
}

export default function MisconceptionCard({
  misconception,
  screenSize,
  onViewDetails,
}: MisconceptionCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <CardSurface
      elevation={4}
      screenSize={screenSize}
      isFocus={misconception.isRecommendedFocus}
      sx={{ gap: `${theme.sizing.space3}px` }}
    >
      <BadgeSlot>
        {misconception.badge && (
          <FocusBadge>{misconception.badge.replace(/_/g, ' ')}</FocusBadge>
        )}
      </BadgeSlot>

      <Typography
        variant="headingMd"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
      >
        {misconception.title}
      </Typography>

      <PrevalenceChip>{misconception.prevalence.label}</PrevalenceChip>

      <Typography
        variant="rubikBody"
        sx={{
          color: 'designSystem.surface.atlanticNavy',
          pb: `${theme.sizing.space3}px`,
        }}
      >
        {`${misconception.description} ${misconception.consequence}`}
      </Typography>

      <CardCta
        isFocus={misconception.isRecommendedFocus}
        disableElevation
        onClick={() => onViewDetails(misconception.id)}
      >
        {t('review.viewDetails')}
      </CardCta>
    </CardSurface>
  );
}
