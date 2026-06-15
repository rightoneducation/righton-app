import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import mathSymbolsBackground from '../../../img/mathSymbolsBackground.svg';

// main container for Launch New Game screen
// background matches the StartGame splash: primary gradient + math symbols at the bottom
export default styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexFlow: 'column wrap',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  overflow: 'hidden',
  background: theme.palette.primary.backgroundGradient,
  paddingLeft: `${theme.sizing.xLgPadding}px`,
  paddingRight: `${theme.sizing.xLgPadding}px`,
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
    opacity: '5%',
  },
}));