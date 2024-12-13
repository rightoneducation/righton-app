import { Button, styled } from '@mui/material';
import { aiGradient } from '../../lib/AITheme';

export const ButtonStyled = styled(Button)(() => ({
  width: 'fit-content',
  height: '38px',
  borderRadius: '54px',
  textTransform: 'none',
  boxShadow: '0px 0px 8px 0px rgba(71, 217, 255, 0.4)',
  background: aiGradient,
  ':hover': {
    background: aiGradient,
  },
  '&:disabled': {
    background: aiGradient,
  },
  pointerEvents: 'auto'
}));