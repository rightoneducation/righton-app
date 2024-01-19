import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

/* high-level header container for game in progress and phase results 
(stack container -> header stack container, body stack container, footer stack container) */
export default styled(Stack)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  left: 0,
  paddingBottom: `${theme.sizing.mediumPadding}px`,
  background: theme.palette.primary.mainColor,
  border: 'none',
  width: '100vw',
  zIndex: -1,
}));