// lib/styledcomponents/BottomCard.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CMSCardThumbnailImage, CMSCardTag, CMSCardCaption, CMSCardTitle, CMSCardDateText, CMSArticleType } from '@righton/networking'; 

type ShareMobileModalCardProps = {
  selectedArticle: CMSArticleType;
};

const CardContainer = styled(Box)(({ theme }) => ({
  maxHeight: '98px',
  display: 'flex',
  gap: '12px',
  background: '#22499C',
  boxSizing: 'border-box',
  borderRadius: '8px',
}));

const InfoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '12px 0',
  boxSizing: 'border-box',
  width: '100%'
}));

const TopRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',
  alignItems: 'center',
  boxSizing: 'border-box',
}));

const StyledTag = styled(Typography)(({ theme }) => ({
  fontSize: '8px',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
  color: '#FFFFFF',
  border: '1px solid #FFFFFF',
  padding: '4px',
  borderRadius: '9px',
  boxSizing: 'border-box',
}));

const MetaInfo = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  fontFamily: 'Rubik, sans-serif',
  fontWeight: 300,
  color: '#FFFFFF',
  boxSizing: 'border-box',
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 600,
  color: '#FFFFFF',
  boxSizing: 'border-box',
}));

const CaptionText = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  fontFamily: 'Rubik, sans-serif',
  fontWeight: 400,
  color: '#FFFFFF',
  boxSizing: 'border-box',
}));

export default function ShareMobileModalCard({
  selectedArticle,
}: ShareMobileModalCardProps) {
  const { title, caption, image } = selectedArticle;
  return (
    <CardContainer>
      {image && (
        <CMSCardThumbnailImage
          src={image.url}
          alt="Article Thumbnail"
        />
      )}
      <InfoWrapper>
        <Box sx={{ display: 'flex', flexDirection: 'column', boxSizing: 'border-box', gap: '12px', paddingRight: '12px' }}>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
            <CMSCardTitle>{title}</CMSCardTitle>
            <CMSCardCaption >{caption}</CMSCardCaption>
          </Box>
          <CaptionText>
            www.rightoneducation.com
          </CaptionText>
        </Box>
      </InfoWrapper>
    </CardContainer>
  );
}
