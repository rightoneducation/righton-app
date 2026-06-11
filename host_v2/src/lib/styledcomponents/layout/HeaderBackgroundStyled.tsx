import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';
import mathSymbolsBackground from '../../../img/mathSymbolsBackground.svg';

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
  height: `200px`,
  zIndex: -1,
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
    opacity: '5%'
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));
