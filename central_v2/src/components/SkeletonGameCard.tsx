import React from 'react';
import { Box, Fade, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

const GameCard = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '260px',
  padding: `12px ${theme.sizing.smPadding}px 12px ${theme.sizing.smPadding}px`,
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

export default function SkeletonGameCard({index}: SkeletonGameCardProps) {
  return (
    <Fade in timeout={800}  style={{ transformOrigin: '0 0 0', transitionDelay: `${150*index}ms` }}>   
      <GameCard sx={{ padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 2, height: '260px' }}>
        <Box sx={{ display: 'flex', alignContents: 'center', justifyContent: 'space-between'}}>
          <Skeleton animation="wave" variant="text" width="70%" height={30} />
          <Skeleton animation="wave" variant="circular" width={30} height={30} />
        </Box>
        <Box sx={{display: 'flex', gap: 2, flexGrow: 1, width: '100%'}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, width: '100%'}}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Skeleton animation="wave" variant="text" width="100%" height={20} />
              <Skeleton animation="wave" variant="text" width="100%" height={20} />
              <Skeleton animation="wave" variant="text" width="100%" height={20} />
            </Box>
            <Box sx={{display: 'flex', gap: 2}}>
              <Skeleton animation="wave" variant="rounded" width={40} height={15} />
              <Skeleton animation="wave" variant="rounded" width={40} height={15} />
              <Skeleton animation="wave" variant="rounded" width={40} height={15} />
            </Box>
          </Box>
          <Box sx={{width: '100%'}}>
            <Skeleton animation="wave" variant="rectangular" sx={{ borderRadius: 1, height: '100%' }} />
          </Box>
        </Box>
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2}}>
          <Skeleton animation="wave" variant="rectangular" width={60} height={30} sx={{ borderRadius: 1 }} />
          <Skeleton animation="wave" variant="rectangular" width={60} height={30} sx={{ borderRadius: 1 }} />
        </Box>
      </GameCard>
    </Fade>
  );
}