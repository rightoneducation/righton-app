import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';

/* lower-level container for background content in body. floats above body boxes
(body stack container -> body box upper, body box lower, body content area) */
export const BodyContentAreaDoubleColumnStyled = styled(Grid)(({ theme }) => ({
  position: 'absolute',
  top: '0',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  maxWidth: `${theme.breakpoints.values.lg}px`,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 2,
  paddingTop: `${theme.sizing.mdPadding}px`,
  paddingLeft: `${theme.sizing.xLgPadding}px`, 
  paddingRight: `${theme.sizing.xLgPadding}px`
}));

// content area of body that floats above background layers above - Triple Column Page
export const BodyContentAreaTripleColumnStyled = styled(
  BodyContentAreaDoubleColumnStyled,
)(({ theme, isShortAnswerEnabled, isHintEnabled }) => ({
  maxWidth: isShortAnswerEnabled || isHintEnabled ? '1236px' : `${theme.breakpoints.values.lg}px`,
  justifyContent: 'center',
}));

// content area of body that floats above background layers above - Single Column Page
export const BodyContentAreaSingleColumnStyled = styled(
  BodyContentAreaDoubleColumnStyled,
)(({ theme }) => ({
  justifyContent: 'center',
  maxWidth: `${theme.breakpoints.values.md}px`,
  flexGrow: 1,
  paddingLeft: `0px`,
  paddingRight: `0px`,
}));

// content area of body that floats above background layers above - Phase Results Page
export const BodyContentAreaPhaseResultsStyled = styled(
  BodyContentAreaSingleColumnStyled,
)({
  position: 'fixed',
});

// content area of body that floats above background layers above - Phase Results Page
export const BodyContentAreaLeaderboardStyled = styled(
  BodyContentAreaDoubleColumnStyled,
)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  maxWidth: '500px',
  paddingLeft: `${theme.sizing.mdPadding}px`,
  paddingRight: `${theme.sizing.mdPadding}px`,
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
