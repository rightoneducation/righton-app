import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// content container inside of card
export default styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '75px',
  height: '30px',
  borderRadius: '34px',
  background: theme.palette.primary.timerGradient,
  boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.30)',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  marginLeft: `-${theme.sizing.xxLgPadding}px`,
}));
