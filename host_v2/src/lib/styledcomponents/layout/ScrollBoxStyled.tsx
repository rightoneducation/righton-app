import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

/**
 * lower-level container for background section in body
 * creates a box that constrains touch scrolling to vertical only so that it doesn't conflict with swiper horizontal scrolling
 */
export default styled(Box)(({ theme }) => ({
  // TODO: right now the dynamic height calculation doesn't work: 
  // `calc(100% - ${theme.sizing.headerHeight}px - ${theme.sizing.footerHeight}px)`
  // so it is hardcoded
  height: '457px',
  paddingBottom: `${theme.sizing.mediumPadding}px`, // added so box shadow shows around edge of card
  paddingLeft: `${theme.sizing.smallPadding}px`,
  paddingRight: `${theme.sizing.smallPadding}px`,
  overflow: 'auto',
  touchAction: 'pan-y', // this constrains the touch controls to only vertical scrolling so it doesn't mess with the swiper X direction swipe
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none', // IE and Edge
}));