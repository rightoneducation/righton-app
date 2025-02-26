import { Button, Typography, styled } from '@mui/material';
import { aiGradient, darkPurple } from '../../lib/AITheme';

export const ButtonStyled = styled(Button)(() => ({
  width: '38px',
  minWidth: '38px',
  height: '38px',
  borderRadius: '54px',
  textTransform: 'none',
  boxShadow: '0px 5px 16px 0px rgba(71, 15, 104, 0.6)',
  background: aiGradient,
  ':hover': {
    background: aiGradient,
  },
  '&:disabled': {
    background: aiGradient,
  },
  pointerEvents: 'auto'
}));

export const RegenButtonStyled = styled(Button)(() => ({
  width: 'fit-content',
  borderRadius: '54px',
  textTransform: 'none',
  background: '#FFF',
  ':hover': {
    background: '#FFF',
  },
  '&:disabled': {
    background: '#FFF',
  },
  pointerEvents: 'auto'
}));

export const RegenButtonTextStyled = styled(Typography)(() => ({
  color: darkPurple,
  fontWeight: 700,
  fontSize: '20px'
}));