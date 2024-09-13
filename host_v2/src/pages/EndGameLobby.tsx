import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {debounce} from 'lodash';
import {
  GameSessionState,
  IGameTemplate,
  ITeam
} from '@righton/networking';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { ScreenSize } from '../lib/HostModels';
import EndGameHeader from '../components/EndGame/EndGameHeader';
import EndGameBody from '../components/EndGame/EndGameBody';
import FooterStartGame from '../components/FooterStartGame';

interface EndGameLobbyProps {
  gameTemplates: IGameTemplate[] | null;
  teams: ITeam[]
  gameCode: number,
  currentQuestionIndex: number,
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
  height: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
  backgroundAttachment: 'fixed',
  boxSizing: 'border-box',
  gap: '16px',
});
function EndGameLobby({teams,
  gameTemplates,
  gameCode,
  currentQuestionIndex,
  }: EndGameLobbyProps) {
    const theme = useTheme();
    const [selectedSuggestedGame, setSelectedSuggestedGame] = useState<string | null>(null);
    const [suggestedGameTemplates, setSuggestedGameTemplates] = useState<IGameTemplate[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const screenSize = isSmallScreen ? ScreenSize.SMALL : ScreenSize.LARGE;
    const apiClients = useTSAPIClientsContext(APIClientsContext);
    
    useEffect(()=> {
      apiClients.gameTemplate.listGameTemplatesByGrade(5, null, null, '8', []).then((response) => {
        if (response && setSuggestedGameTemplates)
          setSuggestedGameTemplates(response.gameTemplates);
      });
    },[]) // eslint-disable-line

    const handleButtonClick = () => {
      if (selectedSuggestedGame === null){
        window.location.href = 'http://central.rightoneducation.com/';
      }
      else {
        window.location.href = `http://host.rightoneducation.com/new/${selectedSuggestedGame}`;
      }
    };

    const debouncedGameTemplateSearch = useCallback( // eslint-disable-line
      debounce((search: string) => {
        console.log(search);
        apiClients.gameTemplate.listGameTemplates(5, null, null, search, []).then((response) => {
          console.log(response);
          console.log(search);
          if (response && setSuggestedGameTemplates)
            setSuggestedGameTemplates(response.gameTemplates);
        });
      }, 1000),
      [] 
    );

    const handleUpdateSearchText = (value: string) => {
      debouncedGameTemplateSearch(value);
      setSearchText(value);
    }

    return (
      <SafeAreaStyled>
        <EndGameHeader gameCode = {gameCode} />
        <EndGameBody 
          screenSize={screenSize} 
          gameTemplates={suggestedGameTemplates} 
          teams={teams} 
          selectedSuggestedGame={selectedSuggestedGame} 
          setSelectedSuggestedGame={setSelectedSuggestedGame} 
          currentQuestionIndex={currentQuestionIndex} 
          searchText={searchText}
          handleUpdateSearchText={handleUpdateSearchText}
        />
        <FooterStartGame 
          screenSize={screenSize}
          teamsLength={teams ? teams.length : 0}
          selectedSuggestedGame={selectedSuggestedGame}
          handleButtonClick={handleButtonClick}
          isGamePrepared={false}
        />
      </SafeAreaStyled>
    )
  }
  export default EndGameLobby;