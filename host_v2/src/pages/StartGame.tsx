import React from 'react';
import {Box, Paper, Typography} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import {
  ITeam,
  IQuestion,
  IHostTeamAnswers,
  GameSessionState
} from '@righton/networking';
import { ScreenSize } from '../lib/HostModels';
import HostHeader from '../components/HostHeader';
import GameCard from '../components/GameCard';
import CurrentStudents from '../components/CurrentStudents';
import FooterStartGame from '../components/FooterStartGame';
import HostBody from '../components/HostBody';

const BackgroundStyled = styled(Paper)({
  minHeight: '100vh',
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  backgroundAttachment: 'fixed',
})

const SafeAreaStyled = styled(Box)({
  paddingTop: '47px',
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
});

interface StartGameProps {
  teams: ITeam[];
  questions:IQuestion[];
  title: string;
  gameCode: number;
  currentQuestionIndex: number;
  handleDeleteTeam: (id: string) => void;
  setLocalHostTeamAnswers: (value: IHostTeamAnswers) => void;
}  

function StartGame({teams,
  questions,
  title,
  gameCode,
  currentQuestionIndex,
  handleDeleteTeam,
  setLocalHostTeamAnswers
  }: StartGameProps) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const screenSize = isSmallScreen ? ScreenSize.SMALL : ScreenSize.LARGE;
    return (
        <SafeAreaStyled>
          <HostHeader gameCode = {gameCode} />
          <HostBody 
            teams={teams} 
            questions={questions} 
            title={title} 
            currentQuestionIndex={currentQuestionIndex}
            handleDeleteTeam={handleDeleteTeam} 
            screenSize={screenSize}
          />
          <FooterStartGame 
            teamsLength={teams ? teams.length : 0}
            screenSize={screenSize}
            setLocalHostTeamAnswers={setLocalHostTeamAnswers}
          />
        </SafeAreaStyled>
    )
  }
  
  export default StartGame;