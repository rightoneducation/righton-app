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
  gap: `calc(${theme.sizing.xSmPadding}px + ${theme.sizing.xxSmPadding}px )`,
  paddingBottom: `${theme.sizing.mdPadding}px`, // added so box shadow shows around edge of card
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
  gap: `calc(${theme.sizing.xSmPadding}px + ${theme.sizing.xxSmPadding}px )`,
  overflow: 'auto',
  touchAction: 'pan-y', // this constrains the touch controls to only vertical scrolling so it doesn't mess with the swiper X direction swipe
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none', // IE and Edge
}));