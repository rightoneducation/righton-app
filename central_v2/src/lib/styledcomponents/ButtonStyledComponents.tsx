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
  padding: 0,
  borderRadius: `${theme.sizing.xSmPadding}px`,
  textTransform: 'none',
  boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.15)',
  borderStyle: buttonColor === ButtonColor.NULL ? 'solid' : 'none',
  borderWidth: buttonColor === ButtonColor.NULL ? '2px' : '0px',
  borderColor: buttonColor === ButtonColor.NULL ? `${theme.palette.primary.buttonPrimaryDefault}` : 'none',
  backgroundColor: buttonColor === ButtonColor.NULL ? `transparent` : `${theme.palette.primary.buttonPrimaryDefault}`,
  ':hover': {
    backgroundColor: buttonColor === ButtonColor.NULL ? `${theme.palette.primary.buttonCCSSDisable}` : `${theme.palette.primary.buttonPrimaryHover}`,
  },
  '&:disabled': {
    backgroundColor: buttonColor === ButtonColor.NULL ? `transparent` : `${theme.palette.primary.buttonPrimaryDisable}`,
  },
  boxSizing: 'border-box',
  pointerEvents: 'auto',
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

export const ButtonTypography = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'buttonColor',
})<ButtonStyledProps>(({ theme, buttonColor }) => ({
  fontFamily: 'Poppins',
  fontSize: '20px',
  fontWeight: '700',
  textTransform: 'none',
  padding: 0,
  color: buttonColor === ButtonColor.NULL ?  `${theme.palette.primary.buttonPrimaryDefault}` : '#FFFFFF',
}));

export const ButtonCCSS = styled(Box)(({ theme }) => ({
  width: 'auto',
  height: '24px',
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.buttonCCSSHover}`,
  },
  "&:disabled": {
    backgroundColor: `${theme.palette.primary.buttonCCSSDisable}`,
  }
}));

export const ButtonFavourite = styled(Box)(({ theme }) => ({
  width: '26px',
  height: '26px',
  borderRadius: '26px',
  backgroundColor: 'rgba(255,255,255, 0.53)',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: '8px',
  right: '4px',
}));


export const ButtonIconBlue = styled('img')(({ theme }) => ({
  filter: 'brightness(0) saturate(100%) invert(14%) sepia(22%) saturate(7087%) hue-rotate(212deg) brightness(93%) contrast(86%)'
}));