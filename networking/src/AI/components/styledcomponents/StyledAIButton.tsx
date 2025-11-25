import { Button, Typography, styled } from '@mui/material';
import { darkPurple } from '../../lib/AITheme';

export const ButtonStyled = styled(Button)(() => ({
  width: '100%',
  height: '38px',
  borderRadius: '8px',
  textTransform: 'none',
  background: darkPurple,
  ':hover': {
    background: '#642db9',
  },
  '&:disabled': {
    background: '#c1abe3',
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