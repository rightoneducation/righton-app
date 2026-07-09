import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';

/* lower-level container for content that floats in End Game page when swiper is not enabled.
   Matches the Leaderboard body (StartGameContentAreaDoubleColumnStyled large case): a 736 box
   with 8px (xSmPadding) side padding so the two columns' content spans 720, centered, aligned
   to the 720-centered EndGame header. border-box keeps the padding inside the 100% width. */
export const EndGameContentAreaDoubleColumnStyled = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: '736px',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  boxSizing: 'border-box',
  margin: 'auto',
  zIndex: 2,
  paddingLeft: `${theme.sizing.xSmPadding}px`,
  paddingRight: `${theme.sizing.xSmPadding}px`,
}));