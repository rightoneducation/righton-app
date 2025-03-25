import { Button, Box, Typography, styled, useTheme } from '@mui/material';
import { ButtonColor } from '../../components/button/ButtonModels';

type ButtonStyledProps = {
  buttonColor: ButtonColor;
  isOnQuestionTab?: boolean;
};

const getBackgroundColor = (theme: any, buttonColor: ButtonColor) => {
  switch (buttonColor) {
    case ButtonColor.RED:
      return `${theme.palette.primary.buttonActionDefault}`;
    case ButtonColor.NULL:
      return 'transparent';
    case ButtonColor.LIGHTBLUE:
      return `${theme.palette.primary.buttonDraftDefault}`;
    case ButtonColor.BLUE:
    default:
      return `${theme.palette.primary.buttonPrimaryDefault}`;
  }
};

const getHoverColor = (theme: any, buttonColor: ButtonColor) => {
  switch (buttonColor) {
    case ButtonColor.RED:
      return `${theme.palette.primary.buttonActionHover}`;
    case ButtonColor.NULL:
      return 'transparent';
    case ButtonColor.LIGHTBLUE:
      return `${theme.palette.primary.buttonDraftHover}`;
    case ButtonColor.BLUE:
    default:
      return `${theme.palette.primary.buttonPrimaryHover}`;
  }
};

const getDisableColor = (theme: any, buttonColor: ButtonColor) => {
  switch (buttonColor) {
    case ButtonColor.RED:
      return `${theme.palette.primary.buttonActionDisable}`;
    case ButtonColor.NULL:
      return 'transparent';
    case ButtonColor.LIGHTBLUE:
      return `${theme.palette.primary.buttonDraftDisable}`;
    case ButtonColor.BLUE:
    default:
      return `${theme.palette.primary.buttonPrimaryDisable}`;
  }
};

export const ButtonStyled = styled(Button, {
  shouldForwardProp: (prop) => (prop !== 'buttonColor' && prop !== 'isOnQuestionTab'),
})<ButtonStyledProps>(({ theme, buttonColor, isOnQuestionTab }) => ({
  width: '100%',
  height: isOnQuestionTab ? '100%' : '38px',
  padding: isOnQuestionTab ? '8px' : 0,
  borderRadius: `${theme.sizing.xSmPadding}px`,
  textTransform: 'none',
  boxShadow: isOnQuestionTab ? 'none' : '0px 5px 22px 0px rgba(71, 217, 255, 0.15)',
  borderStyle: buttonColor === ButtonColor.NULL ? 'solid' : 'none',
  borderWidth: buttonColor === ButtonColor.NULL ? '2px' : '0px',
  borderColor: buttonColor === ButtonColor.NULL ? `${theme.palette.primary.buttonPrimaryDefault}` : 'none',
  backgroundColor: getBackgroundColor(theme, buttonColor),
  ':hover': {
    backgroundColor: getHoverColor(theme, buttonColor),
  },
  '&:disabled': {
    backgroundColor: getDisableColor(theme, buttonColor),
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

export const ButtonTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'buttonColor',
})<ButtonStyledProps>(({ theme, buttonColor }) => ({
  fontFamily: 'Poppins',
  fontSize: '20px',
  fontWeight: '700',
  textTransform: 'none',
  padding: 0,
  color: buttonColor === ButtonColor.NULL ?  `${theme.palette.primary.buttonPrimaryDefault}` : '#FFFFFF',
  whiteSpace: 'nowrap',
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