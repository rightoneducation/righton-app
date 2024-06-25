import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';
import BackgroundContainerStyled from './BackgroundContainerStyled';

export default styled(BackgroundContainerStyled)(({ theme }) => ({
  height: '100%',
  position: 'fixed', // 100%, fixed to prevent sizing changes on mobile based on url bar etc
  width: '100%',
  background: `${theme.palette.primary.radialGradient} no-repeat`,
  backgroundSize: `100%`,
  backgroundPosition: 'center top',
  backgroundAttachment: 'fixed',
  display: 'flex',
  alignItems: 'center',
  touchAction: 'auto'
}));