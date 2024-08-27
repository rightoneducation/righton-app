import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { APIClients } from '@righton/networking';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import StyledGameCard from './GameCard';
import GameCardCarousal from './CardCarousal';
import {ScreenSize } from '../lib/HostModels';
import PaginationContainerStyled from '../lib/PaginationContainerStyled';

interface RecommendedGamesProps {
  screenSize: ScreenSize;
  apiClients?: APIClients;
}

const RecommendedGamesContainer = styled(Box)(({ screenSize }: RecommendedGamesProps) => ({
  height: screenSize === ScreenSize.SMALL ? '368px': '408px', 
  gap: '16px',
  display: 'flex', 
  // justifyContent: 'center',
  width: '100%',
  flexDirection: 'column', 
  alignItems: 'center', 
  backgroundColor: '#02215F' 
}));

const Title = styled(Typography)<{ screenSize: ScreenSize }>(({ screenSize }) => ({
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: screenSize === ScreenSize.SMALL ? '24px' : '40px',
  lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
  color: '#FFFFFF',
}));

export default function RecommendedGames({ screenSize, apiClients }: RecommendedGamesProps) {
  const theme = useTheme(); 

  return (
    <RecommendedGamesContainer screenSize={screenSize}>
      <Title screenSize={screenSize}>Recommended Games</Title>
      <GameCardCarousal apiClients={apiClients}/>
      <PaginationContainerStyled className="swiper-pagination-container"/>
    </RecommendedGamesContainer>
  );
}
