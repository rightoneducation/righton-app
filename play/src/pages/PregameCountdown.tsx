import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BackgroundContainerStyled from '../lib/styledcomponents/layout/BackgroundContainerStyled';
import RadialTimer from '../components/RadialTimer';

const StackContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  maxWidth: theme.breakpoints.values.xs,
}));

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textAlign: `center`,
  paddingLeft: `${theme.sizing.mediumPadding}px`,
  paddingRight: `${theme.sizing.mediumPadding}px`,
  whiteSpace: 'pre-wrap',
}));

interface StartPhase2Props {
  handlePregameTimerFinished: () => void;
}

export default function StartPhase2({
  handlePregameTimerFinished,
}: StartPhase2Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <BackgroundContainerStyled>
      <StackContainer spacing={5}>
        <RadialTimer
          inputColors={[
            `${theme.palette.primary.countdownColor}, 0.3)`,
            `${theme.palette.primary.countdownColor}, 0.4)`,
            `${theme.palette.primary.countdownColor}, 0.5)`,
            `${theme.palette.primary.countdownColor}, 0.6)`,
            `${theme.palette.primary.countdownColor}, 0.7)`,
            `${theme.palette.primary.countdownColor}, 0.8)`,
            `${theme.palette.primary.countdownColor}, 0.9)`,
            `${theme.palette.primary.countdownColor}, 1)`,
          ]}
          radius={110}
          timerStartInSeconds={3}
          handlePregameTimerFinished={handlePregameTimerFinished}
        />
        <TypographyStyled variant="h2">{t('pregamecountdown.subtitle1')}</TypographyStyled>
        <TypographyStyled variant="h2">{t('pregamecountdown.subtitle2')}</TypographyStyled>
      </StackContainer>
    </BackgroundContainerStyled>
  );
}
