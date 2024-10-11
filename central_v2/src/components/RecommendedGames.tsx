import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { APIClients, IGameTemplate } from '@righton/networking';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import GameCardCarousal from './CardCarousal';
import {ScreenSize } from '../lib/CentralModels';
import PaginationContainerStyled from '../lib/PaginationContainerStyled';

interface RecommendedGamesProps {
  screenSize: ScreenSize;
  apiClients: APIClients;
  recommendedGames: IGameTemplate[];
}
interface RecommendedGamesContainerProps {
  screenSize: ScreenSize;
}

const RecommendedGamesContainer = styled(Box)<RecommendedGamesContainerProps>(({ theme, screenSize }) => ({
  height: screenSize === ScreenSize.SMALL ? '368px': '408px', 
  gap: `${theme.sizing.smPadding}px`,
  display: 'flex', 
  width: '100%',
  flexDirection: 'column', 
  alignItems: 'center', 
  backgroundColor: `${theme.palette.primary.extraDarkBlue}` 
}));

const Title = styled(Typography)<{ screenSize: ScreenSize }>(({ screenSize, theme }) => ({
  fontFamily: 'Poppins',
  fontWeight: '700',
  fontSize: screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : '40px',
  lineHeight: screenSize === ScreenSize.SMALL ? '36px' : '60px',
  color: '#FFFFFF',
}));

export default function RecommendedGames({ screenSize, apiClients, recommendedGames }: RecommendedGamesProps) {
  const theme = useTheme(); 

  return (
    <RecommendedGamesContainer screenSize={screenSize}>
      <Title screenSize={screenSize}>Recommended Games</Title>
      <GameCardCarousal apiClients={apiClients} recommendedGames={recommendedGames}/>
      <PaginationContainerStyled className="swiper-pagination-container"/>
    </RecommendedGamesContainer>
  );
}
