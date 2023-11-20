import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

export default styled(Stack)(({ theme }) => ({
  height: '100%',
  position: 'fixed', // 100%, fixed to prevent sizing changes on mobile based on url bar etc
  width: '100%',
  background: `radial-gradient(circle 500px at 50% 60%, #7D64C7 13.54%, #514187 51.56%, #3A2D66 77.6%, #352960 88.02%, #312759 100%) no-repeat`,
  backgroundSize: `100%`,
  backgroundPosition: 'center top',
  backgroundAttachment: 'fixed',
  display: 'flex',
  alignItems: 'center',
}));
