import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const LegendContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: `${theme.sizing.smallPadding}px`,
}));

const LabelStyled = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.primary.playerFeedbackLabelColor}`,
  fontSize: `${theme.typography.caption.fontSize}`,
  paddingLeft: `${theme.sizing.extraSmallPadding}px`,
}));

const KeyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginRight: `${theme.sizing.extraSmallPadding}px`,
  alignItems: 'center',
}));

export default function Legend() {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  /**
   * To avoid repetitive code for rendering both legend keys
   * @param name  must be either 'correct' or 'incorrect'
   * @returns legend key component for input key name
   */
  function legendKey(name: string): React.ReactNode {
    return (
      <svg width={40} height={15}>
        <rect
          width={40}
          height={15}
          style={{
            fill: name === 'correct' ? `${theme.palette.primary.main}` : 'transparent',
            stroke: `${theme.palette.primary.main}`,
            strokeWidth: `${theme.sizing.barStrokeWidth}`,
          }}
        />
      </svg>
    )
  }

  return (
    <LegendContainer>
      <KeyContainer>
        {legendKey('correct')}
        <LabelStyled>{t('gamesession.confidenceCard.graph.legend.correct')}</LabelStyled>
      </KeyContainer>
      <KeyContainer>
        {legendKey('incorrect')}
        <LabelStyled>{t('gamesession.confidenceCard.graph.legend.incorrect')}</LabelStyled>
      </KeyContainer>
    </LegendContainer>
  );
}

