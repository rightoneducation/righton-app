import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

/* high-level header container for game in progress and phase results 
(stack container -> header stack container, body stack container, footer stack container) */
export default styled(Stack)(({ theme }) => ({
  paddingTop: `${theme.sizing.mdPadding}px`,
  border: 'none',
  width: '100vw',
  height: `${theme.sizing.headerHeight}px`,
}));
