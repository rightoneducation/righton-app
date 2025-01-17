import React, { useState } from 'react';
import {
  ElementType,
  GalleryType,
  IGameTemplate,
} from '@righton/networking';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
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

interface ExploreGamesProps {
  screenSize: ScreenSize;
}

export default function ExploreGames({
  screenSize
} : ExploreGamesProps) {
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
  const [selectedGame, setSelectedGame] = useState<IGameTemplate | null>(null);
  const [gameSet, setGameSet] = useState<IGameTemplate[]>([]);

  const handleView = (game: IGameTemplate, games: IGameTemplate[]) => {
    setSelectedGame(game);
    setGameSet(games);
    setIsTabsOpen(true);
  };
  return (
    <ExploreGamesMainContainer id="scrollableDiv">
      {searchTerms.length > 0 ? (
        <>
          <SearchBar
            screenSize={screenSize}
            handleSearchChange={handleSearchChange}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
          />
          <CardGallery<IGameTemplate>
            screenSize={screenSize}
            searchTerm={searchTerms}
            grades={selectedGrades}
            galleryElements={searchedGames}
            isLoading={isLoading}
            elementType={ElementType.GAME}
            galleryType={GalleryType.SEARCH_RESULTS}
            setIsTabsOpen={setIsTabsOpen}
            handleView={handleView}
          />
        </>
      ) : (
        <>
          <ExploreGamesUpperContainer screenSize={screenSize}>
            <img src={mathSymbolsBackground} alt="Math Symbol Background" style={{width: '100%', height: '100%', position: 'absolute', bottom: '0', zIndex: 0, objectFit: 'cover'}} />
            <SearchBar
              screenSize={screenSize}
              handleSearchChange={handleSearchChange}
              handleChooseGrades={handleChooseGrades}
              handleSortChange={handleSortChange}
            />
            <Recommended<IGameTemplate>
              screenSize={screenSize}
              recommendedElements={recommendedGames}
              elementType={ElementType.GAME}
              setIsTabsOpen={setIsTabsOpen}
              handleView={handleView}
            />
          </ExploreGamesUpperContainer>
          <InfiniteScroll
            dataLength={mostPopularGames.length}
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
            }}
          >
            <CardGallery<IGameTemplate>
              screenSize={screenSize}
              galleryElements={mostPopularGames}
              elementType={ElementType.GAME}
              galleryType={GalleryType.MOST_POPULAR}
              setIsTabsOpen={setIsTabsOpen}
              handleView={handleView}
              isLoading={isLoading}
            />
          </InfiniteScroll>
        </>
      )}
    </ExploreGamesMainContainer>
  );
}
