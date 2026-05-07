import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';
import NewPlayBackground from '../../../img/NewPlayBackground.svg';

export default styled(Stack)(({ theme }) => ({
  height: '100%',
  position: 'fixed', // 100%, fixed to prevent sizing changes on mobile based on url bar etc
  width: '100%',
  background: `#290F51 url(${NewPlayBackground}) no-repeat`,
  backgroundSize: `100%`,
  backgroundPosition: 'center top',
  backgroundAttachment: 'fixed',
  display: 'flex',
  alignItems: 'center',
  touchAction: 'none'
}));
