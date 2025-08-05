import React from 'react';
import { Box, Fade, Skeleton, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

const CardContainer = styled(Box)(({ theme }) => ({
  maxHeight: '98px',
  minHeight: '98px',
  display: 'flex',
  gap: '12px',
  background: '#224996',
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

interface ArticleSkeletonProps {
  index: number;
}

export default function ArticleSkeleton({
  index
}: ArticleSkeletonProps) {
  const theme = useTheme();
  
  return (
    <Fade
      in
      timeout={800}
      style={{ transformOrigin: '0 0 0', transitionDelay: `${150 * index}ms` }}
    >
      <CardContainer>
        <Skeleton
          animation="wave"
          variant="rounded"
          width="98px"
          height="98px"
          sx={{
            borderRadius: '8px',
            flexShrink: 0,
          }}
        />
        
        <InfoWrapper>
          <Box sx={{ display: 'flex', flexDirection: 'column', boxSizing: 'border-box', gap: '12px' }}>
            <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Skeleton
                animation="wave"
                variant="rounded"
                width="40px"
                height="15px"
                sx={{ borderRadius: '9px' }}
              />
              <Skeleton
                animation="wave"
                variant="rounded"
                width="50px"
                height="15px"
                sx={{ borderRadius: '9px' }}
              />
              <Skeleton
                animation="wave"
                variant="text"
                width="60px"
                height="12px"
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Skeleton
                animation="wave"
                variant="text"
                width="100%"
                height="16px"
              />
              <Skeleton
                animation="wave"
                variant="text"
                width="90%"
                height="16px"
              />
              
              <Skeleton
                animation="wave"
                variant="text"
                width="80%"
                height="16px"
              />
            </Box>
          </Box>
        </InfoWrapper>
      </CardContainer>
    </Fade>
  );
} 