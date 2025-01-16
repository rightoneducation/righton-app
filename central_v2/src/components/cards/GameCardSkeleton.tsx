import React from 'react';
import { Box, Fade, Skeleton, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

const GameCard = styled(Box)(({ theme }) => ({
  maxWidth: '384px',
  height: '100%',
  gap: `${theme.sizing.smPadding}px`,
  borderRadius: `${theme.sizing.smPadding}px`,
  boxShadow: `0px ${theme.sizing.xSmPadding}px ${theme.sizing.smPadding}px -4px #5C769166`,
  background: '#FFF',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  overflow: 'visible',
}));

interface SkeletonGameCardProps {
  index: number;
}

export default function SkeletonGameCard({ index }: SkeletonGameCardProps) {
  const theme = useTheme();
  return (
    <Fade
      in
      timeout={800}
      style={{ transformOrigin: '0 0 0', transitionDelay: `${150 * index}ms` }}
    >
      <GameCard
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '12px'
        }}
      >
        <Skeleton animation="wave" variant="rounded" width="100%" height="186px"/>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignContents: 'center',
            justifyContent: 'space-between',
            paddingLeft:  `${theme.sizing.smPadding}px`,
            paddingRight: `${theme.sizing.smPadding}px`,
            paddingBottom: `${theme.sizing.smPadding}px`,
            gap: '12px'
          }}
        >
          <Skeleton animation="wave" variant="text" width="100%" height='45px' />
          <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton
                animation="wave"
                variant="rounded"
                width={40}
                height={15}
              />
              <Skeleton
                animation="wave"
                variant="rounded"
                width={40}
                height={15}
              />
              <Skeleton
                animation="wave"
                variant="rounded"
                width={40}
                height={15}
              />
            </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Skeleton
              animation="wave"
              variant="text"
              width="100%"
              height={20}
            />
            <Skeleton
              animation="wave"
              variant="text"
              width="100%"
              height={20}
            />
            <Skeleton
              animation="wave"
              variant="text"
              width="100%"
              height={20}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <Skeleton
              animation="wave"
              variant="rectangular"
              sx={{ borderRadius: 1, height: '100%' }}
            />
          </Box>
          <Skeleton
            animation="wave"
            variant="rounded"
            width='100%'
            height='38px'
          />
          <Skeleton
            animation="wave"
            variant="rounded"
            width='100%'
            height='38px'
          />
        </Box>
      </GameCard>
    </Fade>
  );
}
