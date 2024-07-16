import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  IQuestion,
  IGameTemplate,
  ITeam
} from '@righton/networking';
import { ScreenSize } from '../lib/HostModels';
import EndGameHeader from '../components/EndGame/EndGameHeader';
import EndGameBody from '../components/EndGame/EndGameBody';
import EndGameFooter from '../components/EndGame/EndGameFooter';

interface EndGameLobbyProps {
  gameTemplates: IGameTemplate[] | null;
  teams: ITeam[]
  gameCode: number,
  currentQuestionIndex: number,
  handleDeleteTeam: (id: string) => void;
}  

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
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  backgroundAttachment: 'fixed',
  boxSizing: 'border-box',
  gap: '16px',
});
function EndGameLobby({teams,
  gameTemplates,
  gameCode,
  currentQuestionIndex,
  handleDeleteTeam,
  }: EndGameLobbyProps) {
    const theme = useTheme();
    const [isGameSelected, setIsGameSelected] = useState(false)
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const screenSize = isSmallScreen ? ScreenSize.SMALL : ScreenSize.LARGE;
    return (
      <SafeAreaStyled>
        <EndGameHeader gameCode = {gameCode} />
        <EndGameBody screenSize={screenSize} gameTemplates={gameTemplates} teams={teams} isGameSelected={isGameSelected} setIsGameSelected={setIsGameSelected} currentQuestionIndex={currentQuestionIndex} handleDeleteTeam={handleDeleteTeam}/>
        <EndGameFooter 
          screenSize={screenSize}
          teamsLength={teams ? teams.length : 0}
          isGameSelected = {isGameSelected}
        />
      </SafeAreaStyled>
    )
  }
  export default EndGameLobby;