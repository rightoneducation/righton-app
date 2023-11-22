import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ITeam, GameSessionState } from '@righton/networking';
import BackgroundContainerStyled from '../../lib/styledcomponents/layout/BackgroundContainerStyled';
import { LobbyMode, TimerMode } from '../../lib/PlayModels';
import RadialTimer from '../../components/RadialTimer';
import HowToPlay from './HowToPlay';
import Leaderboard from '../finalresults/Leaderboard';

interface LobbyProps {
  mode: LobbyMode;
  teams?: ITeam[];
  currentState?: GameSessionState;
  teamAvatar?: number;
  teamId?: string;
}

export default function Lobby({ mode, teams, currentState, teamAvatar, teamId }: LobbyProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  switch(mode){
  case(LobbyMode.REJOIN):
    return (
      <BackgroundContainerStyled>
         <Box
            data-testid="lobby-rejoin"
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                position: 'absolute',
                alignItems: 'center',
                fontSize: '54px',
                textAlign: 'center',
                lineHeight: `${theme.sizing.extraLargePadding}px`,
              }}
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
        </BackgroundContainerStyled>
    );
    case(LobbyMode.PREQUESTION):
      return (
        <Leaderboard teams={teams} currentState={currentState!} teamAvatar={teamAvatar!} teamId={teamId!}/>
      )
    default:
      return (
        <BackgroundContainerStyled>
          <HowToPlay mode={mode} />
        </BackgroundContainerStyled>
      );
  }
}
