import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';
import mathSymbolsBackground from '../../../img/mathSymbolsBackground.svg';

/* top-level container for game in progress and phase results 
(stack container -> header stack container, body stack container, footer stack container) */
export default styled(Stack)({
  height: '100%',
  position: 'fixed', // 100%, fixed to prevent sizing changes on mobile based on url bar etc
  width: '100%',
  touchAction: 'none',
  backgroundImage: `
    linear-gradient(180deg, rgba(42, 18, 79, 0.95), rgba(96, 41, 181, 0.95)),
    url(${mathSymbolsBackground})
  `,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'bottom', // Adjust as needed
  backgroundSize: `100% 100%, auto 100%`,
  backgroundAttachment: 'fixed',
  zIndex: 0,
});
