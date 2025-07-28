import React from 'react';
import { Box, Fade, Skeleton, useTheme, styled } from '@mui/material';
import { ScreenSize } from '../../lib/WebsiteModels';

const StyledCard = styled(Box)<{ screenSize: ScreenSize }>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  borderRadius: '8px',
  background: '#224996',
  width: '100%',
}));

interface SkeletonCornerstoneProps {
  index: number;
  screenSize: ScreenSize;
}

export default function SkeletonCornerstone({
  index,
  screenSize
}: SkeletonCornerstoneProps) {
  const theme = useTheme();
  const contentPadding = screenSize === ScreenSize.LARGE ? '24px' : '12px';
  
  return (
    <Fade
      in
      timeout={800}
      style={{ transformOrigin: '0 0 0', transitionDelay: `${150 * index}ms` }}
    >
      <StyledCard screenSize={screenSize} style={{maxWidth: '420px'}}>
        <Skeleton
          animation="wave"
          variant="rounded"
          width="100%"
          height="300px"
          sx={{
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          }}
        />
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            margin: contentPadding,
            gap: '2px',
            boxSizing: 'border-box',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Skeleton
              animation="wave"
              variant="text"
              width="60px"
              height="14px"
            />
            
            <Skeleton
              animation="wave"
              variant="text"
              width="100%"
              height={screenSize === ScreenSize.LARGE ? '32px' : '20px'}
            />
            <Skeleton
              animation="wave"
              variant="text"
              width="90%"
              height={screenSize === ScreenSize.LARGE ? '32px' : '20px'}
            />
            
            <Skeleton
              animation="wave"
              variant="text"
              width="100%"
              height="16px"
            />
            <Skeleton
              animation="wave"
              variant="text"
              width="80%"
              height="16px"
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
            <Skeleton
              animation="wave"
              variant="circular"
              width="40px"
              height="40px"
            />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Skeleton
                animation="wave"
                variant="text"
                width="80px"
                height={screenSize === ScreenSize.LARGE ? '14px' : '12px'}
              />
              
              <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Skeleton
                  animation="wave"
                  variant="text"
                  width="60px"
                  height={screenSize === ScreenSize.LARGE ? '14px' : '12px'}
                />
                <Skeleton
                  animation="wave"
                  variant="text"
                  width="4px"
                  height={screenSize === ScreenSize.LARGE ? '14px' : '12px'}
                />
                <Skeleton
                  animation="wave"
                  variant="text"
                  width="70px"
                  height={screenSize === ScreenSize.LARGE ? '14px' : '12px'}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </StyledCard>
    </Fade>
  );
}
