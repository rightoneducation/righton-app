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
import EndGameFooter from '../components/FooterStartGame';

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
    const [isSuggestedGameSelected, setIsSuggestedGameSelected] = useState(false);
    const [suggestedGameTemplates, setSuggestedGameTemplates] = useState<IGameTemplate[]>([]);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const screenSize = isSmallScreen ? ScreenSize.SMALL : ScreenSize.LARGE;
    console.log(suggestedGameTemplates);
    return (
      <SafeAreaStyled>
        <EndGameHeader gameCode = {gameCode} />
        <EndGameBody screenSize={screenSize} gameTemplates={suggestedGameTemplates} teams={teams} isSuggestedGameSelected={isSuggestedGameSelected} setIsSuggestedGameSelected={setIsSuggestedGameSelected} currentQuestionIndex={currentQuestionIndex} handleDeleteTeam={handleDeleteTeam}/>
        <EndGameFooter 
          screenSize={screenSize}
          teamsLength={teams ? teams.length : 0}
          setSuggestedGameTemplates={setSuggestedGameTemplates}
          isSuggestedGameSelected = {isSuggestedGameSelected}
        />
      </SafeAreaStyled>
    )
  }
  export default EndGameLobby;