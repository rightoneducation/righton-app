import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { APIClients, IGameTemplate } from '@righton/networking';
import { useTranslation } from 'react-i18next';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import {ScreenSize } from '../lib/HostModels';
import RecommendedGames from './RecommendedGames';

interface ExploreGamesUpperProps {
  screenSize: ScreenSize;
  apiClients: APIClients;
  recommendedGames: IGameTemplate[];
}
interface ExploreGamesUpperContainerProps {
    screenSize: ScreenSize;
  }
const ExploreGamesUpperContainer = styled(Box)<ExploreGamesUpperContainerProps>(({ screenSize }) => ({
    height: screenSize === ScreenSize.SMALL ? '368px' : '408px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#02215F',
  }));


export default function ExploreGamesUpper({ screenSize, apiClients, recommendedGames }: ExploreGamesUpperProps) {
  const theme = useTheme(); 

  return (
    <ExploreGamesUpperContainer screenSize={screenSize}>
        <RecommendedGames screenSize={screenSize} apiClients={apiClients} recommendedGames={recommendedGames}/>
    </ExploreGamesUpperContainer>
  );
}
