import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';
import mathSymbolsBackground from '../../../img/mathSymbolsBackground.svg';


export default styled(Stack)(({ theme }) => ({
  height: '100%',
  position: 'fixed', // 100%, fixed to prevent sizing changes on mobile based on url bar etc
  width: '100%',
  // background: `${theme.palette.primary.splashScreenBackgroundGradient} no-repeat`,
  backgroundImage: `
    linear-gradient(180deg, rgba(42, 18, 79, 0.95), rgba(96, 41, 181, 0.95)),
    url(${mathSymbolsBackground})
  `,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'bottom', // Adjust as needed
  backgroundSize: `100% 100%, auto 100%`,
  backgroundAttachment: 'fixed',
  display: 'flex',
  alignItems: 'center',
  touchAction: 'none'
}));
