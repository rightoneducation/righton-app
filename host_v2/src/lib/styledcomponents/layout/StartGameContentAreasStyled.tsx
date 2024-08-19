import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';

/* lower-level container for content that floats in Start Game page when swiper is not enabled */
export const StartGameContentAreaDoubleColumnStyled = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  maxWidth: `${theme.breakpoints.values.md}px`,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 2,
  paddingTop: `${theme.sizing.mdPadding}px`,
}));