import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { ScreenSize } from '../../HostModels';

/* lower-level container for content that floats in Start Game page when swiper is not enabled.
   Matches the GameInProgress/PrepareGame two-column arrangement:
   - medium: full-width with 32px (lgPadding) side padding
   - large: a 736 box (8px padding) so the two columns' content spans 720, centered, aligned
     to the 720-centered large header
   border-box keeps the 32px medium padding inside the 100% width (no overflow). */
export const StartGameContentAreaDoubleColumnStyled = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize }>(({ theme, screenSize }) => {
  const isMedium = screenSize === ScreenSize.MEDIUM;
  return {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    maxWidth: isMedium ? '100%' : '736px',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box',
    zIndex: 2,
    paddingTop: `${theme.sizing.mdPadding}px`,
    paddingLeft: isMedium ? `${theme.sizing.lgPadding}px` : `${theme.sizing.xSmPadding}px`,
    paddingRight: isMedium ? `${theme.sizing.lgPadding}px` : `${theme.sizing.xSmPadding}px`,
  };
});