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
import { LocalGameSessionContext } from '../lib/context/LocalGameSessionContext';
import { useTSGameSessionContext } from '../hooks/context/useLocalGameSessionContext';
import { ScreenSize } from '../lib/HostModels';
import HostHeader from '../components/HostHeader';
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
  setIsGamePrepared: (value: boolean) => void;
}  

function StartGame({teams,
  questions,
  title,
  gameCode,
  currentQuestionIndex,
  handleDeleteTeam,
  setIsGamePrepared
  }: StartGameProps) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const screenSize = isSmallScreen ? ScreenSize.SMALL : ScreenSize.LARGE;
    const localGameSession = useTSGameSessionContext(LocalGameSessionContext);

    const handleButtonClick = () => {
      setIsGamePrepared(true);
    }

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
            localGameSession={localGameSession}
            teamsLength={teams ? teams.length : 0}
            screenSize={screenSize}
            handleButtonClick={handleButtonClick}
            isGamePrepared={false}
          />
        </SafeAreaStyled>
    )
  }
  
  export default StartGame;