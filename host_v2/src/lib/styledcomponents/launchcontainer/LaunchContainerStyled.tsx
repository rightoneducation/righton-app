import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// main container for Launch New Game screen
export default styled(Box)(({ theme }) => ({
  display: 'flex',
  flexFlow: 'column wrap',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  overflow: 'hidden',
  background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
}));