import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

/* top-level container for game in progress and phase results 
(stack container -> header stack container, body stack container, footer stack container) */
export default styled(Stack)({
  height: '100%',
  position: 'fixed', // 100%, fixed to prevent sizing changes on mobile based on url bar etc
  width: '100%',
});