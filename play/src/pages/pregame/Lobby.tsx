import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import { LobbyMode, TimerMode } from '../../lib/PlayModels';
import RadialTimer from '../../components/RadialTimer';
import HowToPlay from './HowToPlay';

interface LobbyProps {
  mode: LobbyMode;
}

export default function Lobby({ mode }: LobbyProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <BackgroundContainerStyled>
      {mode === LobbyMode.REJOIN ? (
        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography
            variant="h1"
            sx={{ position: 'absolute', alignItems:'center', fontSize: '54px' }}
          >
            {t('lobby.title')}
          </Typography>
          <RadialTimer
            mode={TimerMode.JOIN}
            inputColors={theme.palette.primary.radialTimerArray}
            radius={110}
            timerStartInSeconds={1}
          />
        </Box>
      ) : (
        <HowToPlay mode={mode} />
      )}
    </BackgroundContainerStyled>
  );
}
