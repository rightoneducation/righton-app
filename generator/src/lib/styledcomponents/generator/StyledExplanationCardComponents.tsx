import { styled, Box } from '@mui/material';

export const ExpandArrowContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isAnalysisExpanded',
})<{ isAnalysisExpanded: boolean }>(({ isAnalysisExpanded }) => ({
  transform: isAnalysisExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
  animation: isAnalysisExpanded
    ? 'rotateScaleOpen 300ms ease-in-out'
    : 'rotateScaleClose 300ms ease-in-out',
  '@keyframes rotateScaleOpen': {
    '0%': {
      transform: 'rotate(0deg) scale(1)',
    },
    '50%': {
      transform: 'rotate(180deg) scale(1.1)',
    },
    '100%': {
      transform: 'rotate(180deg) scale(1)',
    },
  },
  '@keyframes rotateScaleClose': {
    '0%': {
      transform: 'rotate(180deg) scale(1)',
    },
    '50%': {
      transform: 'rotate(0deg) scale(1.1)',
    },
    '100%': {
      transform: 'rotate(0deg) scale(1)',
    },
  },
}));