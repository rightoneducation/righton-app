import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import mathSymbolsBackground from '../../../img/mathSymbolsBackground.svg';

/* lower-level container for background section in body 
(body stack container -> body box upper, body box lower, body content area) */
export default styled(Box)(({ theme }) => ({
  flex: 1,
  width: '100vw',
  position: 'relative',
  isolation: 'isolate',
  backgroundImage: 'linear-gradient(180deg, #2A124F, #6029B5)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'bottom', // Adjust as needed
  backgroundSize: `100% 100%`,
  backgroundAttachment: 'fixed',
  zIndex: 0,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    backgroundImage: `url(${mathSymbolsBackground})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom',
    backgroundSize: 'auto 100%',
    backgroundAttachment: 'fixed',
    opacity: 0.25,
    pointerEvents: 'none',
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));
