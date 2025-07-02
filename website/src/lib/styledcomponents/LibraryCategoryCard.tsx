// lib/styledcomponents/BottomCard.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

type BottomCardProps = {
  image: string;
  tag: string;
  date: string;
  views: string;
  title: string;
  caption: string;
};

const CardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  background: '#224996',
  boxSizing: 'border-box',
//   border: '1px solid green',    
  borderRadius: '8px',
//   maxWidth: '426.67px',

//   width: '100%'
}));

const InfoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
//   border: '1px solid #FFFFFF',
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
  fontSize: '16px',
  fontFamily: 'Rubik, sans-serif',
  fontWeight: 400,
  color: '#FFFFFF',
  boxSizing: 'border-box',
}));

export default function BottomCard({
  image,
  tag,
  date,
  views,
  title,
  caption,
}: BottomCardProps) {
  return (
    <CardContainer>
      <img src={image} alt="Thumbnail" />
      <InfoWrapper>
        <TopRow>
          <StyledTag>{tag}</StyledTag>
          <MetaInfo>{`${date} • ${views} views`}</MetaInfo>
        </TopRow>
        <Box sx={{ display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          <TitleText>{title}</TitleText>
          <CaptionText>{caption}</CaptionText>
        </Box>
      </InfoWrapper>
    </CardContainer>
  );
}
