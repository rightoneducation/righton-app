import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ScreenSize } from '../WebsiteModels';

type ArticleCardProps = {
  image: string;
  category: string;
  title: string;
  description: string;
  avatar: string;
  author: string;
  date: string;
  readTime: string;
  screenSize: ScreenSize;
};

const StyledCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  // border: '1px solid white',
  boxSizing: 'border-box',
  borderRadius: '8px',
  background: '#224996',
  width: '100%',
  // minWidth: '287px',

}));

function ArticleCard({
  image,
  category,
  title,
  description,
  avatar,
  author,
  date,
  readTime,
  screenSize,
}: ArticleCardProps) {
  const theme = useTheme();

  return (
    <StyledCard>
      <img src={image} alt="Main" style={{ width: '100%', height: 'auto' }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', 
        margin: screenSize === ScreenSize.LARGE? '24px': '12px', 
        gap: '2px', boxSizing: 'border-box' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Typography sx={{ fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF' }}>
            {category}
          </Typography>
          <Typography sx={{ 
          fontSize: screenSize === ScreenSize.LARGE? '24px': '16px',
          lineHeight: screenSize === ScreenSize.LARGE? '130%': '100%',
          fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF' }}>
            {title}
          </Typography>
          <Typography sx={{ 
            lineHeight: screenSize === ScreenSize.LARGE? '150%': '100%',
            fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF' }}>
            {description}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center'}}>
          <img src={avatar} alt="Avatar" />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: screenSize === ScreenSize.LARGE? '14px': '12px', 
              fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF' }}>
              {author}
            </Typography>
            <Box sx={{ display: 'flex', gap: '8px' }}>
              <Typography sx={{ fontSize: screenSize === ScreenSize.LARGE? '14px': '12px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF' }}>
                {date}
              </Typography>
              <Typography sx={{ fontSize: 'clamp(12px, 1vw, 14px)', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF' }}>
                •
              </Typography>
              <Typography sx={{ fontSize: 'clamp(12px, 1vw, 14px)', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF' }}>
                {readTime}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledCard>
  );
}

export default ArticleCard;
