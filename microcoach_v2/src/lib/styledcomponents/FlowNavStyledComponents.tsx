import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';

const actionRadius = 18;

interface ActiveProps {
  isActive: boolean;
}

const noIsActive = (prop: PropertyKey) => prop !== 'isActive';

export const FlowTab = styled(ButtonBase, {
  shouldForwardProp: noIsActive,
})<ActiveProps>(({ theme, isActive }) => ({
  padding: `0 0 ${theme.sizing.space0}px`,
  ...theme.typography.navTab,
  color: theme.palette.designSystem.surface.atlanticNavy,
  borderBottom: `2px solid ${
    isActive ? theme.palette.designSystem.background.navyBlue : 'transparent'
  }`,
  borderRadius: 0,
  whiteSpace: 'nowrap',
  '&:hover': {
    borderBottomColor: theme.palette.designSystem.foreground.fadedNavyBlue,
  },
}));

export const FlowTabSeparator = styled(Box)(({ theme }) => ({
  ...theme.typography.navTab,
  fontWeight: 600,
  letterSpacing: 'normal',
  color: theme.palette.designSystem.surface.atlanticNavy,
  userSelect: 'none',
}));

export const FlowNavAction = styled(Button)(({ theme }) => ({
  minWidth: 160,
  height: 36,
  padding: `0 ${theme.sizing.space4}px`,
  borderRadius: actionRadius,
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.buttonLabel,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  },
}));
