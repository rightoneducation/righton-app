import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

/* high-level header container for game in progress and phase results 
(stack container -> header stack container, body stack container, footer stack container) */
export default styled(Stack)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  paddingTop: `${theme.sizing.mdPadding}px`,
  background: theme.palette.primary.backgroundGradient,
  border: 'none',
  width: '100vw',
  height: `${theme.sizing.fullHeaderHeight}px`,
  zIndex: -1,
}));
