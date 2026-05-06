import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import mathSymbolsBackground from '../../../img/mathSymbolsBackground.svg';

/* lower-level container for background section in body 
(body stack container -> body box upper, body box lower, body content area) */
export default styled(Box)(({ theme }) => ({
  flex: 1,
  width: '100vw',
  backgroundImage: `
    linear-gradient(180deg, rgba(42, 18, 79, 0.95), rgba(96, 41, 181, 0.95)),
    url(${mathSymbolsBackground})
  `,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'bottom', // Adjust as needed
  backgroundSize: `100% 100%, auto 100%`,
  backgroundAttachment: 'fixed',
  zIndex: 0,
  
}));
