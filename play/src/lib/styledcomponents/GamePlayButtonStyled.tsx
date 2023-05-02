import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

// gameplay button
export const GamePlayButtonStyled = styled(Button)(({ theme }) => ({
  width: '160px', // per figma
  height: '26px',
  borderRadius: '22px',
  textTransform: 'none',
  background: `${theme.palette.primary.highlightGradient}`,
  boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
  '&:hover': {
    background: `${theme.palette.primary.highlightGradient}`,
  },
}));

export const GamePlayButtonStyledDisabled = styled(GamePlayButtonStyled)(({ theme }) => ({
    background: `${theme.palette.primary.extraDarkGrey}`,
    boxShadow: 'none',
    '&:hover': {
      background: `${theme.palette.primary.extraDarkGrey}`,
    },
}));
