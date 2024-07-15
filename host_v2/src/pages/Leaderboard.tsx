import React, { useState } from 'react';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import { ITeam, IQuestion } from '@righton/networking';
import { ScreenSize } from '../lib/HostModels';
import HostHeader from '../components/HostHeader';
import LeaderboardHeader from '../components/LeaderboardHeader';
import FooterStartGame from '../components/FooterStartGame';
import HostBody from '../components/HostBody';

interface LeaderboardProps {
  teams: ITeam[];
  questions:IQuestion[];
  currentQuestionIndex: number;
  title: string;
  handleDeleteTeam: (id: string) => void, 
}

const SafeAreaStyled = styled(Box)((theme) => ({
  paddingTop: `10px`,
  paddingBottom: '34px',
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  backgroundAttachment: 'fixed',
  boxSizing: 'border-box',
  gap: '16px',
}));

export default function Leaderboard({
 teams,
 questions,
 currentQuestionIndex,
 title,
 handleDeleteTeam
}: LeaderboardProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const screenSize = isSmallScreen ? ScreenSize.SMALL : ScreenSize.LARGE;
    return(
      <SafeAreaStyled>
        <LeaderboardHeader />
        <HostBody 
          teams={teams} 
          questions={questions} 
          title={title} 
          currentQuestionIndex={currentQuestionIndex}
          screenSize={screenSize}
          handleDeleteTeam={handleDeleteTeam}
        />
        <FooterStartGame 
          teamsLength={teams ? teams.length : 0}
          screenSize={screenSize}
          currentQuestionIndex={currentQuestionIndex}
        />
    </SafeAreaStyled>
  );
}
