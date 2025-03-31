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

export const ButtonSecondaryStyled = styled(ButtonStyled)(({ theme }) => ({
  backgroundColor: `${theme.palette.primary.buttonActionDefault}`,
  ':hover': {
    backgroundColor: `${theme.palette.primary.buttonActionHover}`,
  },
  '&:disabled': {
    backgroundColor: `${theme.palette.primary.buttonActionDisable}`,
    color: `${theme.palette.primary.main}`,
  },
}));

export const ButtonWrongAnswerStyled = styled(ButtonStyled)(({ theme }) => ({
  backgroundColor: `white`,
  color: `${theme.palette.primary.darkBlue}`,
  border: `2px solid ${theme.palette.primary.darkBlue}`,
  ':hover': {
    backgroundColor: `${theme.palette.primary.buttonPrimaryDisable}`,
  },
  '&:disabled': {
    backgroundColor: `white`,
    color: `${theme.palette.primary.darkBlue}`,
    opacity: '0.5'
  },
}));


export const ButtonSaveStyled = styled(ButtonStyled)(({ theme }) => ({
  backgroundColor: `${theme.palette.primary.buttonSaveDefault}`,
  color: `${theme.palette.primary.buttonPrimaryDefault}`,
  ':hover': {
    backgroundColor: `${theme.palette.primary.buttonSaveDisable}`,
    color: `${theme.palette.primary.buttonPrimaryDefault}`,
  },
  '&:disabled': {
    backgroundColor: `${theme.palette.primary.buttonSaveDisable}`,
    color: `${theme.palette.primary.buttonPrimaryDefault}`,
  },
}));