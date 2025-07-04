import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { CMS_HeroImage, CMS_TitleText, CMS_HeaderText, CMS_BodyText } from '@righton/networking';
import MathSymbolBackground from '../images/mathSymbolsBackground4.svg';

const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '24px', 
  width: '100%', 
  height: '100%',
  paddingTop: '101px',
  paddingBottom: '101px',
  paddingLeft: '105px',
  paddingRight: '105px',
  boxSizing: 'border-box',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${MathSymbolBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -2,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(2, 33, 95, 0.9)',
    zIndex: -1,
  }
}));


export default function Article( 
  selectedArticle: any
) { 
  return (
    <MainContainer>
      <CMS_HeroImage src={selectedArticle.image.asset._ref} alt="Article Hero"/>
      <CMS_TitleText>{selectedArticle.title}</CMS_TitleText>
      <CMS_HeaderText>{selectedArticle.header}</CMS_HeaderText>
      <CMS_BodyText>{selectedArticle.body}</CMS_BodyText>
    </MainContainer>
  )
}