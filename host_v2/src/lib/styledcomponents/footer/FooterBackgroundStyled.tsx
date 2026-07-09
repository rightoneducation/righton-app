import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';
import { ScreenSize } from '../../HostModels';

/* high-level header container for game in progress and phase results
(stack container -> header stack container, body stack container, footer stack container).
Full-width colored bar; the screenSize-conditional horizontal padding insets the footer
content (outer wrapper inset: 32px tablet only; mobile/desktop inset is handled by the
inner FooterContainer). box-sizing is border-box so the padding stays within the 100vw
width and doesn't cause overflow. */
export default styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize?: ScreenSize }>(({ theme, screenSize }) => {
  const horizontalPaddingBySize: Record<ScreenSize, string> = {
    [ScreenSize.SMALL]: '0px',
    [ScreenSize.MEDIUM]: '32px',
    [ScreenSize.LARGE]: '0px',
  };
  const horizontalPadding = screenSize ? horizontalPaddingBySize[screenSize] : '0px';
  return {
    position: 'sticky',
    bottom: 0,
    left: 0,
    background: theme.palette.designSystem.foreground.warmBase,
    border: 'none',
    width: '100vw',
    boxSizing: 'border-box',
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    zIndex: -1,
  };
});
