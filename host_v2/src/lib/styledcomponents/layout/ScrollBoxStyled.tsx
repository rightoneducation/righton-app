import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

/**
 * lower-level container for background section in body
 * creates a box that constrains touch scrolling to vertical only so that it doesn't conflict with swiper horizontal scrolling
 */
export default styled(Box)(({ theme }) => ({
  height: `calc(100% - ${theme.sizing.smPadding}px)`,
  display: 'flex',
  flexDirection: 'column',
  gap: `16px`,
  // "bleed" the scroll container outward: horizontal padding gives the card's box
  // shadow room inside this overflow clip, while the matching negative margin cancels
  // that padding for layout so the cards keep their full width (shadow lives in the
  // gap/outer space instead of narrowing content). bottom padding does the same vertically.
  paddingLeft: `${theme.sizing.xSmPadding}px`,
  paddingRight: `${theme.sizing.xSmPadding}px`,
  paddingBottom: `${theme.sizing.mdPadding}px`,
  marginLeft: `-${theme.sizing.xSmPadding}px`,
  marginRight: `-${theme.sizing.xSmPadding}px`,
  overflow: 'auto',
  touchAction: 'pan-y', // this constrains the touch controls to only vertical scrolling so it doesn't mess with the swiper X direction swipe
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none', // IE and Edge
}));

export const StartEndGameScrollBoxStyled = styled(Box)(({ theme, currentQuestionIndex }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: `${theme.sizing.xSmPadding}px`,
  overflow: 'auto',
  touchAction: 'pan-y', // this constrains the touch controls to only vertical scrolling so it doesn't mess with the swiper X direction swipe
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none', // IE and Edge
}));