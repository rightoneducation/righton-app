import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CMSArticleType, CMSCornerstoneCaption, CMSCornerstoneTitle, CMSMonsterAvatar } from '@righton/networking';
import { ScreenSize } from '../WebsiteModels';
import { 
  cmsMonsterAvatar0, 
  cmsMonsterAvatar1, 
  cmsMonsterAvatar2, 
  cmsMonsterAvatar3, 
  cmsMonsterAvatar4, 
  cmsMonsterAvatar5
} from '../../images';


type CornerstoneArticleCardProps = {
  screenSize: ScreenSize;
  article: CMSArticleType;
};

const StyledCard = styled(Box)<{ screenSize: ScreenSize }>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  borderRadius: '8px',
  background: '#224996',
  width: '100%',

}));

function CornerstoneArticleCard({
  screenSize,
  article
}: CornerstoneArticleCardProps) {
  const theme = useTheme();
  const monsterAvatarMap: { [key: number]: string } = {
    0: cmsMonsterAvatar0,
    1: cmsMonsterAvatar1,
    2: cmsMonsterAvatar2,
    3: cmsMonsterAvatar3,
    4: cmsMonsterAvatar4,
    5: cmsMonsterAvatar5,
  };
  const avatarSrc = monsterAvatarMap[article.monsterSelect] || cmsMonsterAvatar0;

  return (
    <StyledCard screenSize={screenSize} style={{maxWidth: '420px', minHeight: '545px'}}>
      <img src={article.image?.url ?? ''} alt="Main" style={{minHeight: '300px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
      <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: 1,
          margin: screenSize === ScreenSize.LARGE? '24px': '12px', 
          gap: '10px', 
          boxSizing: 'border-box'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Typography sx={{ fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF' }}>
            {article.tags?.[0]}
          </Typography>
          <CMSCornerstoneTitle sx={{ 
            fontSize: screenSize === ScreenSize.LARGE? '24px': '16px',
            lineHeight: screenSize === ScreenSize.LARGE? '30px': '16px',
          }}>
            {article.title}
          </CMSCornerstoneTitle>
          <CMSCornerstoneCaption>
            {article.caption}
          </CMSCornerstoneCaption>
        </Box>
        <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center'}}>
          <CMSMonsterAvatar src={avatarSrc} alt="Monster Avatar" />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: screenSize === ScreenSize.LARGE? '14px': '12px', 
              fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF' }}>
              {article.author}
            </Typography>
            <Box sx={{ display: 'flex', gap: '8px' }}>
              <Typography sx={{ fontSize: screenSize === ScreenSize.LARGE? '14px': '12px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF' }}>
                {article.date}
              </Typography>
              <Typography sx={{ fontSize: 'clamp(12px, 1vw, 14px)', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF' }}>
                •
              </Typography>
              <Typography sx={{ fontSize: 'clamp(12px, 1vw, 14px)', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF' }}>
                {article.readingTimeMinutes} min read
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledCard>
  );
}

export default CornerstoneArticleCard;
