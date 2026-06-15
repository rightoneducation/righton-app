import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';
import mathSymbolsBackground from '../../../img/mathSymbolsBackground.svg';

// math symbols art is natively 2610x1084; the header shows a scaled-down version.
// HEADER_SYMBOL_SCALE drives both this static header AND the StartGame->PrepareGame
// curtain animation endpoint, so the handoff stays pixel-perfect. Tune here.
export const MATH_SYMBOL_NATURAL_WIDTH = 2610;
export const HEADER_SYMBOL_SCALE = 0.5;

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
    backgroundSize: `${MATH_SYMBOL_NATURAL_WIDTH * HEADER_SYMBOL_SCALE}px auto`, // scaled-down symbols (matches the curtain's end state)
    pointerEvents: 'none',
    opacity: '5%'
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));
