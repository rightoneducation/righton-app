import {
  Button,
  Box,
  styled,
  useMediaQuery,
} from '@mui/material';
import { ButtonType, ButtonShape } from '../PlayButtonModels';

type PlayButtonStyledProps = {
  buttonShape: ButtonShape;
  buttonType?: ButtonType;
};

type ShapeProp = { buttonShape: ButtonShape };

export const PlayButtonStyled = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'buttonShape' && prop !== 'buttonType',
})<PlayButtonStyledProps>(({ theme, buttonType }) => {
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const color = theme.palette.designSystem.surface.pink;
  if (buttonType === ButtonType.DONTREJOIN || buttonType === ButtonType.QUIT) {
    const outlineColor = theme.palette.designSystem.surface.play;
    return {
      width: isDesktop ? '355px' : '280px',
      height: '32px',
      borderRadius: '8px',
      textTransform: 'none',
      padding: 0,
      background: 'transparent',
      border: `2px solid ${outlineColor}`,
      color: outlineColor,
      boxSizing: 'border-box',
      '& .MuiTypography-root': {
        color: outlineColor,
      },
      '&:hover': {
        background: 'transparent',
      },
      '&.Mui-disabled': {
        opacity: 0.3,
        background: 'transparent',
        border: `2px solid ${outlineColor}`,
        color: outlineColor,
        boxShadow: 'none',
      }
    };
  }
  return {
    width: isDesktop ? '355px' : '280px',
    height: '32px',
    borderRadius: '8px',
    textTransform: 'none',
    padding: 0,
    background: color,
    boxSizing: 'border-box',
    '&:hover': {
      background: color,
    },
    '&.Mui-disabled': {
      opacity: 0.3,
      background: color,
      color: '#FFFFFF',
      boxShadow: 'none',
    }
  };
});

export const PlayButtonBlockStyled = styled(PlayButtonStyled)({
  '&&': {
    width: '100%',
  },
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
