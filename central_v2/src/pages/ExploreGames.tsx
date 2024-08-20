import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import StyledGameCard from '../components/GameCard';
import GameCardCarousal from '../components/CardCarousal';
import {ScreenSize } from '../lib/HostModels';
import PaginationContainerStyled from '../lib/PaginationContainerStyled';

interface ExploreGamesProps {
  sampleProp: string;
}

const ExploreGamesContainer = styled(Box)(({ theme }) => ({
  height: '100vh', 
  display: 'flex', 
  justifyContent: 'center',
  width: '100%',
  flexDirection: 'column', 
  alignItems: 'center', 
  backgroundColor: '#02215F' 
}));

export default function ExploreGames({ sampleProp }: ExploreGamesProps) {
  const theme = useTheme(); 
  const { t } = useTranslation();

  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const screenSize = isLargeScreen  // eslint-disable-line
        ? ScreenSize.LARGE 
        : isMediumScreen 
          ? ScreenSize.MEDIUM 
          : ScreenSize.SMALL;

  return (
    <ExploreGamesContainer>
      <GameCardCarousal screenSize = {screenSize} />
      <PaginationContainerStyled className="swiper-pagination-container" />

      {/* <StyledGameCard/> */}
    </ExploreGamesContainer>
  );
}
