import { Box, styled } from '@mui/material';

export const RegenExplanationStyledCard = styled(Box)(({ theme }) => ({ // eslint-disable-line
  background: `${theme.palette.primary.aiGradient}`,
  width: '100%',
  paddingTop: '10px',
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingBottom: '12px',
  borderRadius: `${theme.sizing.xxSmPadding}px`,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.smPadding}px`,
  position: 'relative'
}));