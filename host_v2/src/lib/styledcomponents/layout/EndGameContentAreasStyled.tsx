import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';

/* lower-level container for content that floats in End Game page when swiper is not enabled */
export const EndGameContentAreaDoubleColumnStyled = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: `${theme.breakpoints.values.md}px`,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  margin: 'auto',
  zIndex: 2,
}));