import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Grid, Container } from '@mui/material';
import HeaderStackContainerStyled from '../../lib/styledcomponents/layout/HeaderStackContainerStyled';
import { ScreenSize } from '../../lib/HostModels';
import Timer from '../Timer';
import { useTSGameSessionContext } from '../../hooks/context/useGameSessionContext';
import { GameSessionContext } from '../../lib/context/GameSessionContext';

interface EndGameHeaderProps {
  screenSize: ScreenSize;
}

export default function EndGameHeader({ screenSize }: EndGameHeaderProps) {
  const theme = useTheme();
  const localGameSession = useTSGameSessionContext(GameSessionContext);

  // same horizontal padding as the Leaderboard/GameInProgress headers:
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
        {/* 44px total above the title (32px from HeaderStackContainerStyled + 12px here);
            the end-game lobby has no phase-pills row, matching the Leaderboard header */}
        <Grid item style={{ paddingTop: '12px' }}>
          <Typography variant="h1" style={{ fontSize: '24px', lineHeight: '36px', fontFamily: 'Poppins' }}>
            Game End Lobby
          </Typography>
        </Grid>
        {/* same timer bar as the Leaderboard header; the end-game state is never a timed
            state, so it renders disabled at 0:00. isAddTime=false hides the add-time button. */}
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
