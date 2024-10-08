import React, { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { APIClients, IGameTemplate } from '@righton/networking';
import { useTranslation } from 'react-i18next';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box, Button } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ScreenSize } from '../lib/HostModels';
import ExploreGamesUpper from '../components/ExploreGamesUpper';
import EGMostPopular from '../components/EGMostPopular';
import {fetchMoreGames} from "../lib/HelperFunctions";

interface ExploreQuestionsProps {
  apiClients: APIClients;
}

const ExploreQuestionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: `${theme.palette.primary.extraDarkBlue}`,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none',
  width: '100%',
  height: '100vh',
}));

export default function ExploreQuestions({ apiClients }: ExploreQuestionsProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isXLScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const screenSize = isLargeScreen  // eslint-disable-line
      ? ScreenSize.LARGE 
      : isMediumScreen 
        ? ScreenSize.MEDIUM 
        : ScreenSize.SMALL;



  useEffect(() => {
    // TODO - api requests for questions similar to explore games
  }, []);


  return (
    <ExploreQuestionsContainer id = "scrollableDiv">
          <Typography> EXPLORE QUESTIONS PAGE</Typography>
    </ExploreQuestionsContainer>
  );
}
