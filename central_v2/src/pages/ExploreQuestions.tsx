import React, { useState, useEffect, useCallback, useContext } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ElementType } from '@righton/networking';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { ScreenSize } from '../lib/CentralModels';
import { ExploreGamesMainContainer, ExploreGamesUpperContainer } from '../lib/styledcomponents/ExploreGamesStyledComponents';
import useExploreQuestionsStateManager from '../hooks/useExploreQuestionsStateManager';
import MostPopular from '../components/explore/MostPopular';
import RecommendedQuestions from '../components/explore/RecommendedQuestions';

// interface ExploreGamesProps {
// }

export default function ExploreGames() {
  const theme = useTheme();
  const { t } = useTranslation();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const screenSize = isLargeScreen  // eslint-disable-line
      ? ScreenSize.LARGE 
      : isMediumScreen 
        ? ScreenSize.MEDIUM 
        : ScreenSize.SMALL;
  const {
    recommendedQuestions,
    mostPopularQuestions,
    searchedQuestions,
    nextToken,
    isLoading,
    searchTerms,
    selectedGrades,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    loadMoreQuestions
  } = useExploreQuestionsStateManager();
  
  return (
    <ExploreGamesMainContainer id = "scrollableDiv">
      <ExploreGamesUpperContainer screenSize={screenSize}>
        <RecommendedQuestions screenSize={screenSize} recommendedQuestions={recommendedQuestions}/>
      </ExploreGamesUpperContainer>
      <MostPopular screenSize={screenSize} mostPopularElements={mostPopularQuestions} elementType={ElementType.QUESTION}/>
    </ExploreGamesMainContainer>
  );
}
