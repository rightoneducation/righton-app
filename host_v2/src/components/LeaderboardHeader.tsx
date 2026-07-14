import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Grid, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GameSessionState } from '@righton/networking';
import HeaderStackContainerStyled from '../lib/styledcomponents/layout/HeaderStackContainerStyled';
import { ScreenSize } from '../lib/HostModels';
import Timer from './Timer';
import { useTSGameSessionContext } from '../hooks/context/useGameSessionContext';
import { GameSessionContext } from '../lib/context/GameSessionContext';

interface LeaderboardHeaderProps {
  screenSize: ScreenSize;
}

export default function LeaderboardHeader({ screenSize }: LeaderboardHeaderProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const localGameSession = useTSGameSessionContext(GameSessionContext);

  // same horizontal padding as GameInProgress/PrepareGame headers (HeaderContent):
  // 24px (mdPadding) on mobile, 32px (lgPadding) on tablet, 0 on desktop (720 centered)
  const horizontalPaddingBySize: Record<ScreenSize, number> = {
    [ScreenSize.SMALL]: theme.sizing.mdPadding,
    [ScreenSize.MEDIUM]: theme.sizing.lgPadding,
    [ScreenSize.LARGE]: 0,
  };

  return (
    <HeaderStackContainerStyled>
      <Container
        style={{
          maxWidth: screenSize === ScreenSize.MEDIUM ? 'none' : 720,
          paddingLeft: `${horizontalPaddingBySize[screenSize]}px`,
          paddingRight: `${horizontalPaddingBySize[screenSize]}px`,
        }}
      >
        {/* 44px total above the title: 32px from HeaderStackContainerStyled + 12px here.
            The leaderboard has no phase-pills row, so this sits tighter than the other
            headers (which land their title at 76px). */}
        <Grid item style={{ paddingTop: '12px' }}>
          <Typography variant="h1" style={{ fontSize: '24px', lineHeight: '36px', fontFamily: 'Poppins' }}>
          {localGameSession.currentState === GameSessionState.TEAMS_JOINING ? t('gameinprogress.header.leaderboard') : t('gameinprogress.header.finalresults')}
          </Typography>
        </Grid>
        {/* same timer bar as the GameInProgress/PrepareGame headers; on the leaderboard the
            game state is never a timed state, so it renders disabled at 0:00. isAddTime=false
            hides the add-time button. */}
        <Grid item style={{ paddingTop: `${theme.sizing.xSmPadding}px` }}>
          <Timer
            totalTime={0}
            isAddTime={false}
            localGameSession={localGameSession}
          />
        </Grid>
      </Container>
    </HeaderStackContainerStyled>
  );
}
