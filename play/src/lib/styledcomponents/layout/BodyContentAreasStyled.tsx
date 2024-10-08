import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';

/* lower-level container for background content in body. floats above body boxes
(body stack container -> body box upper, body box lower, body content area) */
export const BodyContentAreaDoubleColumnStyled = styled(Grid)({
  position: 'absolute',
  top: '0',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  maxWidth: '848px',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 2,
  marginLeft: '0px',
});
export const BodyContentAreaDoubleColumnStyledNoSwiper = styled(BodyContentAreaDoubleColumnStyled)({
  paddingLeft: '48px',
  paddingRight: '48px',
});
export const BodyContentAreaTripleColumnStyled = styled(Grid)({
  position: 'absolute',
  top: '0',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  maxWidth: '1024px',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 2,
  marginLeft: '0px',
});
export const BodyContentAreaTripleColumnStyledNoSwiper = styled(BodyContentAreaTripleColumnStyled)({
  paddingLeft: '48px',
  paddingRight: '48px',
});
// content area of body that floats above background layers above - Single Column Page
export const BodyContentAreaSingleColumnStyled = styled(
  BodyContentAreaDoubleColumnStyled
)(({ theme }) => ({
  justifyContent: 'center',
  
  paddingLeft: `${theme.sizing.mediumPadding}px`,
  paddingRight: `${theme.sizing.mediumPadding}px`,
}));

// content area of body that floats above background layers above - Phase Results Page
export const BodyContentAreaPhaseResultsStyled = styled(
  BodyContentAreaSingleColumnStyled
)({
  position: 'fixed',
});

// content area of body that floats above background layers above - Phase Results Page
export const BodyContentAreaLeaderboardStyled = styled(
  BodyContentAreaDoubleColumnStyled
)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  maxWidth: '500px',
  paddingLeft: `${theme.sizing.mediumPadding}px`,
  paddingRight: `${theme.sizing.mediumPadding}px`,
  height: '100%',
  overflow: 'scroll',
  flexWrap: 'nowrap',
  margin: 0,
  touchAction: 'pan-y', // this constrains the touch controls to only vertical scrolling so it doesn't mess with the swiper X direction swipe
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none', // IE and Edge
}));
