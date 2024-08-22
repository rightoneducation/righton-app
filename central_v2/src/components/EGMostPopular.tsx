import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import StyledGameCard from './GameCard';
import GameCardCarousal from './CardCarousal';
import {ScreenSize } from '../lib/HostModels';
import PaginationContainerStyled from '../lib/PaginationContainerStyled';
import SearchAndFilter from './SearchAndFilter';
import RecommendedGames from './RecommendedGames';

interface EGMostPopularProps {
  screenSize: ScreenSize;
}
 
const EGMostPopularContainer = styled(Box)(({ screenSize }: EGMostPopularProps) => ({
  // height: screenSize === ScreenSize.SMALL ? '438px' : '496px', 
  height: '400px',
  display: 'flex', 
  justifyContent: 'center',
  width: '100%',
  flexDirection: 'column', 
  alignItems: 'center', 
  background: '#E9F1FF',
}));


export default function EGMostPopular({ screenSize }: EGMostPopularProps) {
  const theme = useTheme(); 

  return (
    <EGMostPopularContainer screenSize={screenSize}>
        <Typography> most popular </Typography>
    </EGMostPopularContainer>
  );
}
