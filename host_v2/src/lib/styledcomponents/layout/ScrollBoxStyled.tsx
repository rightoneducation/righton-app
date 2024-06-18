import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

/**
 * lower-level container for background section in body
 * creates a box that constrains touch scrolling to vertical only so that it doesn't conflict with swiper horizontal scrolling
 */
export default styled(Box)(({ theme }) => ({
  height: `calc(100vh - ${theme.sizing.headerHeight}px - ${theme.sizing.footerHeight}px)`,
  paddingBottom: `${theme.sizing.mdPadding}px`, // added so box shadow shows around edge of card
  marginLeft: `${theme.sizing.xSmPadding}px`,
  marginRight: `${theme.sizing.xSmPadding}px`,
  overflow: 'auto',
  touchAction: 'pan-y', // this constrains the touch controls to only vertical scrolling so it doesn't mess with the swiper X direction swipe
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none', // IE and Edge
}));
