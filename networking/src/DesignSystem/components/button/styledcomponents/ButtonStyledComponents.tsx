import {
  Button,
  Box,
  styled,
  useMediaQuery,
} from '@mui/material';
import { ButtonColor, ButtonShape } from '../PlayButtonModels';

const RED_GRADIENT = 'linear-gradient(90deg, #FC1047 0%, #FC2468 100%)';
const CYAN_GRADIENT = 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)';
const DISABLED_GREY = '#909090';
const RED_SHADOW = '0px 5px 22px rgba(253, 34, 100, 0.3)';
const CYAN_SHADOW = '0px 5px 22px rgba(71, 217, 255, 0.3)';

type PlayButtonStyledProps = {
  buttonColor: ButtonColor;
  buttonShape: ButtonShape;
};

type ShapeProp = { buttonShape: ButtonShape };

const getBackground = (color: ButtonColor) =>
  color === ButtonColor.RED ? RED_GRADIENT : CYAN_GRADIENT;

const getShadow = (color: ButtonColor) =>
  color === ButtonColor.RED ? RED_SHADOW : CYAN_SHADOW;

export const PlayButtonStyled = styled(Button, {
  shouldForwardProp: (prop) =>
    prop !== 'buttonColor' && prop !== 'buttonShape',
})<PlayButtonStyledProps>(({ theme, buttonColor }) => {
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const background = getBackground(buttonColor);
  return {
    width: isDesktop ? '126px' : '280px',
    height: '32px',
    borderRadius: '8px' ,
    textTransform: 'none',
    background,
    boxShadow: getShadow(buttonColor),
    boxSizing: 'border-box',
    '&:hover': {
      background,
    },
    '&:disabled': {
      background: DISABLED_GREY,
      color: '#FFFFFF',
      boxShadow: 'none',
    }
  };
});

export const PlayButtonContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'buttonShape',
})<ShapeProp>(({ buttonShape }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  paddingLeft: buttonShape === ButtonShape.INTRO ? '12px' : '8px',
  paddingRight: buttonShape === ButtonShape.INTRO ? '12px' : '8px',
}));
