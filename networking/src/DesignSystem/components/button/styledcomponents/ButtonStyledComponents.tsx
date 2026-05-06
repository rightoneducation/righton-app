import {
  Button,
  Box,
  styled,
  useMediaQuery,
} from '@mui/material';
import { ButtonShape } from '../PlayButtonModels';

type PlayButtonStyledProps = {
  buttonShape: ButtonShape;
};

type ShapeProp = { buttonShape: ButtonShape };

export const PlayButtonStyled = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'buttonShape',
})<PlayButtonStyledProps>(({ theme }) => {
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const color = theme.palette.designSystem.surface.pink;
  return {
    width: isDesktop ? '135px' : '280px',
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
