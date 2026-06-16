import {
  Button,
  Box,
  styled,
  useMediaQuery,
} from '@mui/material';
import { PlayButtonShape } from '../PlayButtonModels';

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

export const HostButtonStartStyled = styled(Button)(({ theme }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return {
    width: isMobile ? '100%' : '343px',
    height: '32px',
    borderRadius: '8px',
    textTransform: 'none',
    padding: 0,
    border: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.designSystem.background.central.darkNavy,
    background: theme.palette.primary.main,
    boxSizing: 'border-box',
    '&:hover': {
      background: 'rgba(255,255,255, 0.5)',
    },
    '&.Mui-disabled': {
      border: `2px solid ${theme.palette.primary.main}`,
      background: 'transparent',
      color: theme.palette.primary.main,
      cursor: 'not-allowed',
    },
  };
});

export const HostButtonGameStyled = styled(HostButtonStartStyled)(({ theme }) => {
  return {
    color: theme.palette.primary.main,
    background: theme.palette.designSystem.surface.play,
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.designSystem.surface.play,
      opacity: 0.75
    },
    '&.Mui-disabled': {
      background: theme.palette.designSystem.surface.play,
      opacity: 0.3
    }
  }
})

export const HostButtonBlockStyled = styled(HostButtonStartStyled)({
  '&&': {
    width: '100%',
  },
});

export const HostButtonSortStyled = styled(Button)(({ theme }) => {
  const color = theme.palette.designSystem.surface.pink;
  return {
    width: '32px', // 48px face less the 16px of horizontal content padding that already exists
    height: '36px',
    minWidth: 0, // override MUI Button's default 64px min-width
    borderRadius: '8px',
    padding: 0,
    background: color,
    boxShadow: '0px 5px 22px 0px rgba(244, 190, 216, 0.15)', // F4BED8 @ 15%
    boxSizing: 'border-box',
    '&:hover': {
      background: color,
    },
    '&.Mui-disabled': {
      background: color,
      opacity: 0.3,
    },
  };
});

export const HostButtonContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  gap: `${theme.sizing.xSmPadding}px`
}));
