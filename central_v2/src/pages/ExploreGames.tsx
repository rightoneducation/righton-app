import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { APIClients } from '@righton/networking';
import { useTranslation } from 'react-i18next';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import StyledGameCard from '../components/GameCard';
import GameCardCarousal from '../components/CardCarousal';
import {ScreenSize } from '../lib/HostModels';
import PaginationContainerStyled from '../lib/PaginationContainerStyled';
import RecommendedGames from '../components/RecommendedGames';
import ExploreGamesUpper from '../components/ExploreGamesUpper';
import EGMostPopular from '../components/EGMostPopular';
import EGHeader from '../components/EGHeader';

interface ExploreGamesProps {
  apiClients: APIClients;
}

const ExploreGamesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#02215F',
  overflow: 'auto',
  height: '100vh',
  width: '100%',
}));
const HeaderContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: '#02215F',
  width: '100%',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));


export default function ExploreGames({ apiClients }: ExploreGamesProps) {
  const theme = useTheme(); 
  const { t } = useTranslation();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const screenSize = isLargeScreen  // eslint-disable-line
      ? ScreenSize.LARGE 
      : isMediumScreen 
        ? ScreenSize.MEDIUM 
        : ScreenSize.SMALL;
  apiClients.gameTemplate. listGameTemplates(12,null, null, null).then(response => {
    console.log(response) ;
    const nextToken = response?.nextToken;
    apiClients.gameTemplate.listGameTemplates(8, nextToken || null, null, null).then(response2 => {
    console.log(response2);
    })
  });
  return (
    <ExploreGamesContainer>
      <HeaderContainer>
        <EGHeader screenSize={screenSize} />
      </HeaderContainer>
      <Box mt={screenSize === ScreenSize.SMALL ? '77px' : '94px'} />
      <ExploreGamesUpper screenSize={screenSize} apiClients={apiClients} />
      <EGMostPopular screenSize={screenSize} apiClients={apiClients} />
    </ExploreGamesContainer>
  );
}

