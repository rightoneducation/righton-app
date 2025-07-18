import React, { useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { CMSHeroImage, CMSTitleText, CMSHeaderText, CMSBodyText, PortableTextComponentsConfig } from '@righton/networking';
import MathSymbolBackground from '../images/mathSymbolsBackground4.svg';

const HeaderContainer = styled(Box)(({ theme }) => ({
  width: '100%', 
  display: 'flex', 
  alignItems: 'space-between',
}));

export function ArticleHeader( // eslint-disable-line
  { selectedArticle } : any
) {  
  return (
    <HeaderContainer>
      <Box style={{ display: 'flex', gap: '12px' }}>
        <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <CMSBodyText>{selectedArticle.author}</CMSBodyText> 
          <Box style={{ display: 'flex', gap: '8px' }}>
            <CMSBodyText>{selectedArticle.date}</CMSBodyText> 
            <CMSBodyText>•</CMSBodyText>
            <CMSBodyText>{selectedArticle.date}</CMSBodyText> 
          </Box>
        </Box>
      </Box>
    </HeaderContainer>
  )
}