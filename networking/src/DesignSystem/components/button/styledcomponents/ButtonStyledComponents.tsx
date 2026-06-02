import {
  Button,
  Box,
  styled,
  useMediaQuery,
} from '@mui/material';
import { PlayButtonShape } from '../PlayButtonModels';
import { HostButtonShape, HostButtonVariant } from '../HostButtonModels';

type PlayButtonStyledProps = {
  buttonShape: PlayButtonShape;
};

type PlayShapeProp = { buttonShape: PlayButtonShape };

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
})<PlayShapeProp>(({ buttonShape }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  paddingLeft: buttonShape === PlayButtonShape.INTRO ? '12px' : '8px',
  paddingRight: buttonShape === PlayButtonShape.INTRO ? '12px' : '8px',
}));

type HostButtonStyledProps = {
  buttonShape: HostButtonShape;
  buttonVariant: HostButtonVariant;
};

type HostShapeProp = { buttonShape: HostButtonShape };

const HOST_BLUE = '#159EFA';
const HOST_FILLED_GRADIENT = 'linear-gradient(to right, #159EFA 0%, #19BCFB 100%)';

export const HostButtonStyled = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'buttonShape' && prop !== 'buttonVariant',
})<HostButtonStyledProps>(({ buttonVariant }) => {
  const isOutline = buttonVariant === HostButtonVariant.OUTLINE;
  const background = isOutline ? 'transparent' : HOST_FILLED_GRADIENT;
  return {
    width: '300px',
    height: '48px',
    borderRadius: '22px',
    textTransform: 'none',
    padding: 0,
    border: `2px solid ${HOST_BLUE}`,
    color: isOutline ? HOST_BLUE : '#FFFFFF',
    background,
    boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
    boxSizing: 'border-box',
    '&:hover': {
      background,
    },
    '&.Mui-disabled': {
      border: `2px solid ${HOST_BLUE}`,
      color: HOST_BLUE,
      background: isOutline ? 'transparent' : '#032563',
      opacity: isOutline ? 0.25 : 1,
      cursor: 'not-allowed',
      boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
    },
  };
});

export const HostButtonBlockStyled = styled(HostButtonStyled)({
  '&&': {
    width: '100%',
  },
});

export const HostButtonContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'buttonShape',
})<HostShapeProp>(({ buttonShape }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  paddingLeft: buttonShape === HostButtonShape.INTRO ? '12px' : '8px',
  paddingRight: buttonShape === HostButtonShape.INTRO ? '12px' : '8px',
}));
