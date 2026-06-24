import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {debounce} from 'lodash';
import {
  GameSessionState,
  IGameTemplate,
  ITeam,
  PublicPrivateType
} from '@righton/networking';
import { APIClientsContext } from '../lib/context/ApiClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import mathSymbolsBackground from '../img/mathSymbolsBackground.svg';
import { ScreenSize } from '../lib/HostModels';
import EndGameHeader from '../components/EndGame/EndGameHeader';
import EndGameBody from '../components/EndGame/EndGameBody';
import FooterStartGame from '../components/FooterStartGame';

interface EndGameLobbyProps {
  gameTemplates: IGameTemplate[] | null;
  teams: ITeam[]
  gameCode: number,
  currentQuestionIndex: number,
  currentID: string
}  

// full-screen gradient layer that holds the math-symbols art, same technique as the
// StartGame splash: a positioned Paper behind the content (zIndex -1) so the symbols can
// sit on top of the gradient but below the lobby content.
const BackgroundStyled = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100dvh',
  background: theme.palette.primary.backgroundGradient,
  zIndex: -1,
  overflow: 'hidden',
}));

// math symbols layer, mirroring StartGame's static (un-animated) splash treatment:
// 300vw wide and centered so the art never clips inside the viewport, pinned to the
// bottom and tiled horizontally, rendered at 5% opacity over the gradient.
const MathSymbolsStyled = styled(Box)({
  position: 'absolute',
  left: '-100vw',
  right: '-100vw',
  bottom: 0,
  height: '1084px', // natural height of the math symbols art (2610x1084)
  backgroundImage: `url(${mathSymbolsBackground})`,
  backgroundRepeat: 'repeat-x',
  backgroundPosition: 'bottom center',
  backgroundSize: 'auto',
  pointerEvents: 'none',
  opacity: '5%',
});

const SafeAreaStyled = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxSizing: 'border-box',
  overflow: 'hidden',
  gap: '16px',
});
function EndGameLobby({currentID, teams,
  gameTemplates,
  currentQuestionIndex,
  }: EndGameLobbyProps) {
    const theme = useTheme();
    const [selectedSuggestedGame, setSelectedSuggestedGame] = useState<string | null>(null);
    const [suggestedGameTemplates, setSuggestedGameTemplates] = useState<IGameTemplate[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const screenSize = isSmallScreen ? ScreenSize.SMALL : ScreenSize.LARGE;
    // 3-way size for the header only (matches the Leaderboard header), so its
    // 720-centered desktop / 32px tablet / 24px mobile padding resolves correctly.
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const getHeaderScreenSize = () => {
      if (isLargeScreen) return ScreenSize.LARGE;
      if (isMediumScreen) return ScreenSize.MEDIUM;
      return ScreenSize.SMALL;
    };
    const headerScreenSize = getHeaderScreenSize();
    const apiClients = useTSAPIClientsContext(APIClientsContext);
    const publicPrivate = PublicPrivateType.PUBLIC;
    
    useEffect(()=> {
      apiClients.gameTemplate.listGameTemplatesByGrade(publicPrivate, 5, null, null, null, [], []).then((response) => {
        console.log(response);
        if (response && setSuggestedGameTemplates)
          setSuggestedGameTemplates(response.gameTemplates.filter((template: IGameTemplate) => template.id !== currentID));
      });
    },[]) // eslint-disable-line

    const handleButtonClick = () => {
      if (selectedSuggestedGame === null){
        window.location.href = 'http://central.rightoneducation.com/';
      }
      else {
        window.location.href = `http://host.rightoneducation.com/new/Public/${selectedSuggestedGame}`;
      }
    };

    const debouncedGameTemplateSearch = useCallback( // eslint-disable-line
      debounce((search: string) => {
        console.log(search);
        apiClients.gameTemplate.listGameTemplates(publicPrivate, 5, null, null, search, [], []).then((response) => {
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
        <BackgroundStyled>
          <MathSymbolsStyled />
        </BackgroundStyled>
        <EndGameHeader screenSize={headerScreenSize} />
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
          showSwipeHint={false}
        />
      </SafeAreaStyled>
    )
  }
  export default EndGameLobby;