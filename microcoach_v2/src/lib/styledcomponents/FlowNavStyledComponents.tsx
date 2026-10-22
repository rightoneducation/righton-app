import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';

interface ActiveProps {
  isActive: boolean;
}

const noIsActive = (prop: PropertyKey) => prop !== 'isActive';

export const FlowTab = styled(ButtonBase, {
  shouldForwardProp: noIsActive,
})<ActiveProps>(({ theme, isActive }) => ({
  padding: `0 0 ${theme.sizing.space0}px`,
  ...theme.typography.navTab,
  color: isActive
    ? theme.palette.designSystem.surface.atlanticNavy
    : theme.palette.designSystem.foreground.mutedGrey,
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

interface CompactActionProps {
  compact?: boolean;
}

export const FlowNavAction = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'compact',
})<CompactActionProps>(({ theme, compact }) => ({
  minWidth: compact
    ? `${theme.sizing.reflectHomeActionWidth}px`
    : `${theme.sizing.flowActionMinWidth}px`,
  height: compact
    ? `${theme.sizing.reflectHomeActionHeight}px`
    : `${theme.sizing.flowActionHeight}px`,
  padding: `0 ${theme.sizing.space4}px`,
  borderRadius: `${theme.sizing.space4}px`,
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.buttonLabel,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  },
}));
