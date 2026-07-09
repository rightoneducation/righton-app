import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { ScreenSize } from '../../HostModels';

/* lower-level container for background content in body. floats above body boxes
(body stack container -> body box upper, body box lower, body content area) */
export const BodyContentAreaDoubleColumnStyled = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize?: ScreenSize }>(({ screenSize }) => ({
  position: 'absolute',
  top: '0',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  maxWidth: '720px',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 2,
  paddingTop: screenSize === ScreenSize.SMALL ? '32px' : '44px',
}));


// content area of body that floats above background layers above - Double Column Page
// Large: 8px horizontal padding (+16 on maxWidth) reserves outer shadow room so the cards'
// content still spans 720 (aligned to the 720-centered large header) but the outermost
// shadows aren't clipped.
// Medium: the header is full-width with 32px (lgPadding) side padding
// (HeaderContent: Container maxWidth 'none' + lgPadding on medium), and phase 2's swiper is
// full-width with a 32px slidesOffsetBefore/After, so both put their content 32px from the
// viewport edge. Phase 1 matches by going full-width (maxWidth 100% -> no 720 cap, so no
// centering margin gets added outside the 32px) with 32px side padding.
// box-sizing is border-box on both sizes: the base component has height:100% + 44px
// paddingTop, so under the default content-box the box would be ~44px taller than the body
// region and poke down into the sticky footer band (the cards' scroll container would bottom
// out over the footer instead of within the body). border-box folds that padding inside the
// 100% height so the content stays within the body region and scrolls; it also keeps the
// medium 32px side padding inside the 100vw width (content-box would overflow by 64px) and
// makes the large card content span 720 (aligned to the 720-centered large header).
export const BodyContentAreaDoubleColumnStyledNoSwiper = styled(BodyContentAreaDoubleColumnStyled)(({ theme, screenSize }) => {
  const isMedium = screenSize === ScreenSize.MEDIUM;
  return {
    maxWidth: isMedium ? '100%' : '736px',
    paddingLeft: isMedium ? `${theme.sizing.lgPadding}px` : `${theme.sizing.xSmPadding}px`,
    paddingRight: isMedium ? `${theme.sizing.lgPadding}px` : `${theme.sizing.xSmPadding}px`,
    boxSizing: 'border-box',
  };
});

// content area of body that floats above background layers above - Triple Column Page
// same 8px outer shadow room; content still spans 1046
export const BodyContentAreaTripleColumnStyled = styled(
  BodyContentAreaDoubleColumnStyled,
)(({ theme, isShortAnswerEnabled, isHintEnabled }) => ({
  maxWidth: '1062px',
  paddingLeft: `${theme.sizing.xSmPadding}px`,
  paddingRight: `${theme.sizing.xSmPadding}px`,
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
