import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Stack, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { isNullOrUndefined, GameSessionState } from '@righton/networking';
import AnswerSelector from './AnswerSelector';
import ButtonSubmitAnswer from './ButtonSubmitAnswer';
import { AnswerState } from '../lib/PlayModels';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';

interface ConfidenceMeterCardProps {
  isSelected: boolean;
}

export default function ConfidenceMeterCard({
  isSelected,
}: ConfidenceMeterCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const confidenceHeader = <Box display="inline" sx={{ textAlign: 'left', margin: `${theme.sizing.extraSmallPadding}px`, width: '100%' }}>
    <Typography variant='h4' sx={{ fontSize: `${theme.typography.h2.fontSize}px` }}>
      {t('gameinprogress.chooseanswer.confidenceheader')}
    </Typography>
  </Box>

  const chooseConfidenceText = <Box display="inline" sx={{ textAlign: 'center', marginY: `${theme.sizing.largePadding}px` }}>
    <Typography variant="body1">
      {t('gameinprogress.chooseanswer.answerthankyou1')}
    </Typography>
    <Typography variant="body1">
      {t('gameinprogress.chooseanswer.confidencetext')}
    </Typography >
  </Box >

  return (
    <BodyCardStyled elevation={10}>

      {confidenceHeader}
      {chooseConfidenceText}

    </BodyCardStyled>
  );
}