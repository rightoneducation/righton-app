import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';
import { ScreenSize } from '../../PlayModels';

interface FooterStackContainerStyledProps {
  screenSize: ScreenSize;
}

const PADDING_BOTTOM_BY_SIZE: Record<ScreenSize, string> = {
  [ScreenSize.SMALL]: '48px',
  [ScreenSize.MEDIUM]: '60px',
  [ScreenSize.LARGE]: '48px',
};

/* high-level footer container for game in progress and phase results
(stack container -> header stack container, body stack container, footer stack container) */
export default styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<FooterStackContainerStyledProps>(({ screenSize }) => ({
  paddingBottom: PADDING_BOTTOM_BY_SIZE[screenSize],
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
  border: 'none',
  position: 'sticky',
  bottom: 0,
  zIndex: 3,
  boxSizing: 'border-box',
}));
