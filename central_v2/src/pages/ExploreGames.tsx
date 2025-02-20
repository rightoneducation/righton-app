import React, { useState } from 'react';
import {
  ElementType,
  GalleryType,
  IGameTemplate,
} from '@righton/networking';
import { Box, useTheme } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { ScreenSize } from '../lib/CentralModels';
import {
  ExploreGamesMainContainer,
  ExploreGamesUpperContainer,
} from '../lib/styledcomponents/ExploreGamesStyledComponents';
import useExploreGamesStateManager from '../hooks/useExploreGamesStateManager';
import Recommended from '../components/explore/Recommended';
import CardGallery from '../components/cardgallery/CardGallery';
import SearchBar from '../components/searchbar/SearchBar';
import mathSymbolsBackground from '../images/mathSymbolsBackground.svg';
import CentralButton from '../components/button/Button';
import { ButtonType } from '../components/button/ButtonModels';
import test from '../images/test.png';

interface ExploreGamesProps {
  screenSize: ScreenSize;
  setIsUserLoggedIn: (isUserLoggedIn: boolean) => void;
}

export default function ExploreGames({
  screenSize,
  setIsUserLoggedIn
} : ExploreGamesProps) {
  const theme = useTheme();
  const {
    recommendedGames,
    mostPopularGames,
    searchedGames,
    nextToken,
    isLoading,
    searchTerms,
    selectedGrades,
    setIsTabsOpen,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    loadMoreGames,
  } = useExploreGamesStateManager();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const [selectedGame, setSelectedGame] = useState<IGameTemplate | null>(null);
  const [gameSet, setGameSet] = useState<IGameTemplate[]>([]);
  const [imgSrc, setImgSrc] = useState<string>();
  const isSearchResults = searchTerms.length > 0;
  const handleView = (game: IGameTemplate, games: IGameTemplate[]) => {
    setSelectedGame(game);
    setGameSet(games);
    setIsTabsOpen(true);
  };

  // Debug button temporarily added for QA
  const handleSignOut = async () => {
    console.log('here');
    const response = apiClients.auth.awsSignOut();
    setIsUserLoggedIn(false);
    console.log(response);
  }

  return (
    <ExploreGamesMainContainer id="scrollableDiv">
      <Box style={{position: 'absolute', bottom: '20px', right: '20px', zIndex: 40}}> 
        <CentralButton buttonType={ButtonType.SIGNOUT} isEnabled smallScreenOverride onClick={() => handleSignOut()} />  
      </Box>
      <ExploreGamesUpperContainer screenSize={screenSize}>
        {!isSearchResults && 
          <img src={mathSymbolsBackground} alt="Math Symbol Background" style={{width: '100%', height: '100%', position: 'absolute', bottom: '0', zIndex: 0, objectFit: 'none', overflow: 'hidden'}} />
        }
        <SearchBar
          screenSize={screenSize}
          searchTerms={searchTerms}
          handleSearchChange={handleSearchChange}
          handleChooseGrades={handleChooseGrades}
          handleSortChange={handleSortChange}
        />
        { !isSearchResults && 
          <Recommended<IGameTemplate>
            screenSize={screenSize}
            recommendedElements={recommendedGames}
            elementType={ElementType.GAME}
            setIsTabsOpen={setIsTabsOpen}
            handleView={handleView}
          />
        }
      </ExploreGamesUpperContainer>
        <InfiniteScroll
          dataLength={isSearchResults ? searchedGames.length : mostPopularGames.length}
          next={loadMoreGames}
          hasMore={nextToken !== null}
          loader=<h4>loading...</h4>
          scrollableTarget="scrollableDiv"
          style={{
            width: '100vw',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            backgroundColor: theme.palette.primary.creamBackgroundColor,
          }}
        >
          <CardGallery<IGameTemplate>
            screenSize={screenSize}
            searchTerm={isSearchResults ? searchTerms : undefined}
            grades={isSearchResults ? selectedGrades : undefined}
            galleryElements={isSearchResults ? searchedGames : mostPopularGames}
            elementType={ElementType.GAME}
            galleryType={ isSearchResults ? GalleryType.SEARCH_RESULTS : GalleryType.MOST_POPULAR}
            setIsTabsOpen={setIsTabsOpen}
            handleView={handleView}
            isLoading={isLoading}
          />
        </InfiniteScroll>
        <Box 
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexGrow: 1,
            backgroundColor: theme.palette.primary.creamBackgroundColor,
          }}
        />
    </ExploreGamesMainContainer>
  );
}
