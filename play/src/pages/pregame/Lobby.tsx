import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import { LobbyMode, TimerMode } from '../../lib/PlayModels';
import RadialTimer from '../../components/RadialTimer';
import HowToPlay from './HowToPlay';

interface LobbyProps {
  mode: LobbyMode;
}

export default function Lobby({ mode }: LobbyProps) {
  const theme = useTheme();
  return (
    <BackgroundContainerStyled>
      {mode === LobbyMode.REJOIN ? (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <RadialTimer
            mode={TimerMode.JOIN}
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
            timerStartInSeconds={1}
          />
        </Box>
      ) : (
        <HowToPlay mode={mode} />
      )}
    </BackgroundContainerStyled>
  );
}
