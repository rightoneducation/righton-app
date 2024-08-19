import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

// content container inside of card
export default styled(Button)(({ theme }) => ({
  display: 'flex',
  width: '75px',
  height: '30px',
  borderRadius: '34px',
  background: theme.palette.primary.timerGradient,
  boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.30)',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  textTransform: 'none',
  "&:disabled": {
    background: theme.palette.primary.extraDarkGrey,
    boxShadow: '0px 5px 22px 0px rgba(0,0,0, 0.1)',
  }
}));
