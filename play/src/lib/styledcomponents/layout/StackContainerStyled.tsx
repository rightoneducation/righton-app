import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';
import mathSymbolsBackground from '../../../img/mathSymbolsBackground.svg';

/* top-level container for game in progress and phase results 
(stack container -> header stack container, body stack container, footer stack container) */
export default styled(Stack)({
  height: '100%',
  position: 'fixed', // 100%, fixed to prevent sizing changes on mobile based on url bar etc
  width: '100%',
  isolation: 'isolate',
  backgroundImage: 'linear-gradient(180deg, #2A124F, #6029B5)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'bottom',
  backgroundSize: `100% 100%`,
  zIndex: 0,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    backgroundImage: `url(${mathSymbolsBackground})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom',
    backgroundSize: 'auto',
    pointerEvents: 'none',
    opacity: '10%',
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
});
