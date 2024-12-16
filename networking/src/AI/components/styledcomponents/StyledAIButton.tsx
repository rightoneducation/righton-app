import { Button, styled } from '@mui/material';
import { aiGradient } from '../../lib/AITheme';

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