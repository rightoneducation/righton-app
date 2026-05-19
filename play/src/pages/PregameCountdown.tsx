import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BackgroundContainerStyled from '../lib/styledcomponents/layout/BackgroundContainerStyled';
import RadialTimer from '../components/RadialTimer';
import { TimerMode } from '../lib/PlayModels';

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
  setIsPregameCountdown: (isPregameCountdown: boolean) => void;
  currentTimer: number;
}

export default function StartPhase2({
  setIsPregameCountdown,
  currentTimer,
}: StartPhase2Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <BackgroundContainerStyled data-testid="pregame-countdown" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <StackContainer spacing={3}>
        <RadialTimer
          mode={TimerMode.COUNTDOWN}
          inputColors={theme.palette.primary.radialTimerArray}
          radius={110}
          timerStartInSeconds={3}
          setIsPregameCountdown={setIsPregameCountdown}
        />
        <TypographyStyled variant="textLabel" style={{fontFamily: 'poppins'}}>
          {t('pregamecountdown.subtitle1')}
        </TypographyStyled>
        <TypographyStyled variant="h4" style={{color: '#FFF'}}>
          {t('pregamecountdown.subtitle2')}
        </TypographyStyled>
      </StackContainer>
    </BackgroundContainerStyled>
  );
}
