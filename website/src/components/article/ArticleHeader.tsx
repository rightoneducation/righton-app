import React, { useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { CMSHeroImage, CMSTitleText, CMSHeaderText, CMSBodyText, PortableTextComponentsConfig, CMSMonsterAvatar, CMSArticleType } from '@righton/networking';
import MathSymbolBackground from '../images/mathSymbolsBackground4.svg';
import { cmsMonsterAvatar0, cmsMonsterAvatar1, cmsMonsterAvatar2, cmsMonsterAvatar3, cmsMonsterAvatar4, cmsMonsterAvatar5 } from '../../images';

const HeaderContainer = styled(Box)(({ theme }) => ({
  width: '100%', 
  display: 'flex', 
  alignItems: 'space-between',
}));

export function ArticleHeader ({ selectedArticle }: { selectedArticle: CMSArticleType }) { // eslint-disable-line
  const monsterAvatarMap: { [key: number]: string } = {
    0: cmsMonsterAvatar0,
    1: cmsMonsterAvatar1,
    2: cmsMonsterAvatar2,
    3: cmsMonsterAvatar3,
    4: cmsMonsterAvatar4,
    5: cmsMonsterAvatar5,
  };

  const avatarSrc = monsterAvatarMap[selectedArticle.monsterSelect] || cmsMonsterAvatar0;
console.log(selectedArticle)
  return (
    <HeaderContainer>
      <Box style={{ display: 'flex', gap: '12px' }}>
        <CMSMonsterAvatar src={avatarSrc} alt="Monster Avatar" />
        <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <CMSBodyText>{selectedArticle.author}</CMSBodyText> 
          <Box style={{ display: 'flex', gap: '8px' }}>
            <CMSBodyText>{selectedArticle.date}</CMSBodyText> 
            <CMSBodyText>•</CMSBodyText>
            <CMSBodyText>{selectedArticle.readingTimeMinutes} min read</CMSBodyText> 
          </Box>
        </Box>
      </Box>
    </HeaderContainer>
  )
}