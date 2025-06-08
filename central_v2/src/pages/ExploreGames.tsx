import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import {
  ElementType,
  GalleryType,
  SortDirection,
  SortType,
  PublicPrivateType,
  IGameTemplate,
  IUserProfile,
  GradeTarget
} from '@righton/networking';
import { Box, CircularProgress, useTheme } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { useCentralDataState, useCentralDataDispatch } from '../hooks/context/useCentralDataContext';
import { ScreenSize } from '../lib/CentralModels';
import {
  ExploreGamesMainContainer,
  ExploreGamesUpperContainer,
} from '../lib/styledcomponents/ExploreGamesStyledComponents';
import Recommended from '../components/explore/Recommended';
import CardGallery from '../components/cardgallery/CardGallery';
import SearchBar from '../components/searchbar/SearchBar';
import mathSymbolsBackground from '../images/mathSymbolsBackground.svg';
import CentralButton from '../components/button/Button';
import { ButtonType } from '../components/button/ButtonModels';

interface ExploreGamesProps {
  screenSize: ScreenSize;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  fetchElements: () => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (
    newSort: {
      field: SortType;
      direction: SortDirection | null;
    }
  ) => void;
  handleSearchChange: (searchString: string) => void;
  loadMore: () => void;
}

export default function ExploreGames({
  screenSize,
  setIsTabsOpen,
  fetchElements,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  loadMore,
} : ExploreGamesProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  
  
  const [gameSet, setGameSet] = useState<IGameTemplate[]>([]);
  const [imgSrc, setImgSrc] = useState<string>();
  const isSearchResults = centralData?.searchTerms?.length > 0;
  const [hasInitialized, setHasInitialized] = useState(false);
    
  if (!hasInitialized) {
    const needsFetch = centralData.recommendedGames.length === 0 || centralData.mostPopularGames.length === 0; 
    if (needsFetch) {
      fetchElements(); 
    }
    setHasInitialized(true);
  }

  const handleView = (game: IGameTemplate, games: IGameTemplate[]) => {
    centralDataDispatch({ type: 'SET_SELECTED_GAME', payload: null });
    setGameSet(games);
    navigate(`/games/${game.publicPrivateType}/${game.id}`);
  };

  return (
    <ExploreGamesMainContainer id="scrollableDiv">
      <ExploreGamesUpperContainer screenSize={screenSize}>
        {!isSearchResults && 
          <img src={mathSymbolsBackground} alt="Math Symbol Background" style={{width: '100%', height: '100%', position: 'absolute', bottom: '0', zIndex: 0, objectFit: 'none', overflow: 'hidden'}} />
        }
        <SearchBar
          screenSize={screenSize}
          searchTerms={centralData.searchTerms}
          handleSearchChange={handleSearchChange}
          handleChooseGrades={handleChooseGrades}
          handleSortChange={handleSortChange}
        />
        { !isSearchResults && 
          <Recommended<IGameTemplate>
            screenSize={screenSize}
            recommendedElements={centralData.recommendedGames}
            elementType={ElementType.GAME}
            setIsTabsOpen={setIsTabsOpen}
            handleView={handleView}
          />
        }
      </ExploreGamesUpperContainer>
        <InfiniteScroll
          dataLength={isSearchResults ? centralData.searchedGames.length : centralData.mostPopularGames.length}
          next={loadMore}
          hasMore={centralData.nextToken !== null}
          loader={
            <Box style={{width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: '20px'}}> 
              <h4>
                ...
              </h4>
            </Box>
          }
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
            searchTerm={isSearchResults ? centralData.searchTerms : undefined}
            grades={isSearchResults ? centralData.selectedGrades : undefined}
            galleryElements={isSearchResults ? centralData.searchedGames : centralData.mostPopularGames}
            elementType={ElementType.GAME}
            galleryType={ isSearchResults ? GalleryType.SEARCH_RESULTS : GalleryType.MOST_POPULAR}
            setIsTabsOpen={setIsTabsOpen}
            handleView={handleView}
            isLoading={centralData.isLoading}
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
