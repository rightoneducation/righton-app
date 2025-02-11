import { Button, styled } from '@mui/material';

export const ButtonStyled = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '38px',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  textTransform: 'none',
  boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.15)',
  backgroundColor: `${theme.palette.primary.buttonPrimaryDefault}`,
  ':hover': {
    backgroundColor: `${theme.palette.primary.buttonPrimaryHover}`,
  },
  '&:disabled': {
    backgroundColor: `${theme.palette.primary.buttonPrimaryDisable}`,
    color: `${theme.palette.primary.main}`,
  },
  boxSizing: 'border-box',
  pointerEvents: 'auto',
}));