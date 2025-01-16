import { Button, Box, Typography, styled } from '@mui/material';
import { ButtonColor } from '../../components/button/ButtonModels';

type ButtonStyledProps = {
  buttonColor: ButtonColor;
};

export const ButtonStyled = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'buttonColor',
})<ButtonStyledProps>(({ theme, buttonColor }) => ({
  width: '100%',
  height: '38px',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  textTransform: 'none',
  boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.15)',
  backgroundColor: buttonColor === ButtonColor.RED ? `${theme.palette.primary.buttonActionDefault}` : `${theme.palette.primary.buttonPrimaryDefault}`,
  ':hover': {
    backgroundColor: buttonColor === ButtonColor.RED ? `${theme.palette.primary.buttonActionHover}` : `${theme.palette.primary.buttonPrimaryHover}`,
  },
  '&:disabled': {
    backgroundColor: buttonColor === ButtonColor.RED ? `${theme.palette.primary.buttonActionDisable}` : `${theme.palette.primary.buttonPrimaryDisable}`,
  },
  pointerEvents: 'auto'
}));

export const ButtonContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  gap: '8px',
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingLeft: '12px',
  paddingRight: '12px',
}));

export const ButtonIconContainer = styled(Box)(({ theme }) => ({
  height: '20px',
  width: '20px',
}));

export const ButtonTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontSize: '20px',
  fontWeight: '700',
  color: '#FFFFFF',
}));

export const ButtonCCSS = styled(Box)(({ theme }) => ({
  width: 'auto',
  height: 'auto',
  padding: `${theme.sizing.xxSmPadding}px ${theme.sizing.xSmPadding + theme.sizing.xxSmPadding}px`,
  borderRadius: '12px',
  backgroundColor: `${theme.palette.primary.buttonCCSSDefault}`,
  color: '#FFFFFF',
  textTransform: 'none',
  fontFamily: 'Rubik',
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: `${theme.sizing.smPadding}px`,
  textAlign: 'center',
  zIndex: 2,
  boxSizing: 'border-box',
  minWidth: '20px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.buttonCCSSHover}`,
  },
  "&:disabled": {
    backgroundColor: `${theme.palette.primary.buttonCCSSDisable}`,
  }
}));
