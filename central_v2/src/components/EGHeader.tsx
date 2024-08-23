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

interface EGHeaderProps {
  screenSize: ScreenSize;
}
 
const EGHeaderContainer = styled(Box)(({ screenSize }: EGHeaderProps) => ({
    height: screenSize === ScreenSize.SMALL ? '77px' : '94px', 
    display: 'flex', 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    background: 'none',
  }));


export default function EGHeader({ screenSize }: EGHeaderProps) {
  const theme = useTheme(); 

  return (
    <EGHeaderContainer screenSize={screenSize}>
        <Typography style={{color:'#FFFFFF'}}> header </Typography>
    </EGHeaderContainer>
  );
}
