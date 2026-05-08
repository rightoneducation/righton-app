import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';
import mathSymbolsBackground from '../../../img/mathSymbolsBackground.svg';

export default styled(Stack)(({ theme }) => ({
  height: '100%',
  position: 'fixed', // 100%, fixed to prevent sizing changes on mobile based on url bar etc
  width: '100%',
  isolation: 'isolate',
  backgroundImage: 'linear-gradient(180deg, #2A124F, #6029B5)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'bottom', // Adjust as needed
  backgroundSize: `100% 100%`,
  backgroundAttachment: 'fixed',
  display: 'flex',
  alignItems: 'center',
  touchAction: 'none',
  // '&::before': {
  //   content: '""',
  //   position: 'absolute',
  //   inset: 0,
  //   zIndex: 0,
  //   backgroundImage: `url(${mathSymbolsBackground})`,
  //   backgroundRepeat: 'no-repeat',
  //   backgroundPosition: 'bottom',
  //   backgroundSize: 'auto 100%',
  //   backgroundAttachment: 'fixed',
  //   pointerEvents: 'none',
  // },
  // '& > *': {
  //   position: 'relative',
  //   zIndex: 1,
  // },
}));
