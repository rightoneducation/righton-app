import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box, Button } from '@mui/material';
import StyledGameCard from './GameCard';
import GameCardCarousal from './CardCarousal';
import {ScreenSize } from '../lib/HostModels';
import PaginationContainerStyled from '../lib/PaginationContainerStyled';
import SearchBar from './SearchBar';
import Filter from '../images/filter.svg';

interface SearchAndFilterProps {
  screenSize?: ScreenSize;
}

const SearchAndFilterContainer = styled(Box)(( { screenSize }: SearchAndFilterProps ) => ({
  height: screenSize === ScreenSize.SMALL ? '70px' : '88px',
  width: '100vw', 
  display: 'flex', 
  justifyContent: 'center',
  // flexDirection: 'column', 
  alignItems: 'center', 
  backgroundColor: '#02215F' 
}));

const PrimaryButton2 = styled(Button)(( { screenSize }: SearchAndFilterProps ) => ({
    width: screenSize === ScreenSize.SMALL ? 'auto' :'115px',
    minWidth: '44px',
    height: '38px',
    padding: '4px 12px 4px 12px',
    gap: '8px',
    borderRadius: '54px',
    background: 'linear-gradient(90deg, #E81144 0%, #E31C5E 100%)',
    boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
    color: '#FFFFFF',
    textTransform: 'none',
    marginRight: '32px',
  }));
const PrimaryButton2Text = styled(Typography)(() => ({
    width: '52px',
    height: '30px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: '20px',
    lineHeight: '30px',
    color: '#FFFFFF'
  }));
export default function SearchAndFilter({ screenSize }: SearchAndFilterProps) {
  const theme = useTheme(); 

  return (
    <SearchAndFilterContainer screenSize={screenSize}>
      <SearchBar screenSize={screenSize}/>
      <PrimaryButton2 screenSize={screenSize}> 
        <img src={Filter} alt="Filter Icon" />
        {screenSize !== ScreenSize.SMALL && (
            <PrimaryButton2Text>Filter</PrimaryButton2Text> 
        )}
        </PrimaryButton2>
    </SearchAndFilterContainer>
  );
}
