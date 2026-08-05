import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import { ScreenSize } from '../MicroCoachModels';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';

export const SIDEBAR_WIDTH = 264;
export const HOME_CONTENT_MAX_WIDTH = 858;

const stepCircleSize = 40;
const chipRadius = 25;
const ctaRadius = 29;

interface ActiveProps {
  isActive: boolean;
}

const noIsActive = (prop: PropertyKey) => prop !== 'isActive';

export const HomeLayout = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
  alignItems: 'stretch',
  width: '100%',
  flexGrow: 1,
}));

// Sits below the header rather than beside it, and only on this screen — no
// other frame in the set carries a sidebar.
export const Sidebar = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => {
  const isLarge = screenSize === ScreenSize.LARGE;

  return {
    display: 'flex',
    flexDirection: isLarge ? 'column' : 'row',
    flexShrink: 0,
    gap: isLarge ? theme.sizing.space6 : theme.sizing.space3,
    width: isLarge ? SIDEBAR_WIDTH : '100%',
    paddingTop: isLarge ? theme.sizing.space8 : theme.sizing.space4,
    paddingBottom: theme.sizing.space4,
    paddingLeft: theme.sizing.space5,
    paddingRight: theme.sizing.space5,
    backgroundColor: theme.palette.designSystem.foreground.accentBlue,
    boxSizing: 'border-box',
    overflowX: isLarge ? 'visible' : 'auto',
  };
});

export const SidebarItem = styled(Button, {
  shouldForwardProp: noIsActive,
})<ActiveProps>(({ theme, isActive }) => ({
  justifyContent: 'flex-start',
  gap: theme.sizing.space2,
  padding: `${theme.sizing.space1}px ${theme.sizing.space4}px`,
  borderRadius: theme.sizing.space5,
  backgroundColor: isActive
    ? theme.palette.designSystem.foreground.fadedNavyBlue
    : 'transparent',
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.mediumLabel,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.foreground.fadedNavyBlue,
  },
}));

export const HomeContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.sizing.space6,
  flexGrow: 1,
  width: '100%',
  maxWidth: HOME_CONTENT_MAX_WIDTH,
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingTop: theme.sizing.space8,
  paddingBottom: theme.sizing.space12,
  paddingLeft: theme.sizing.space5,
  paddingRight: theme.sizing.space5,
  boxSizing: 'border-box',
}));

export const StepperRow = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  width: '100%',
});

export const StepCircle = styled(Box, {
  shouldForwardProp: noIsActive,
})<ActiveProps>(({ theme, isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: stepCircleSize,
  height: stepCircleSize,
  borderRadius: '50%',
  backgroundColor: isActive
    ? theme.palette.designSystem.foreground.accentBlue
    : theme.palette.designSystem.surface.neutralGray,
  color: theme.palette.designSystem.background.offWhite,
  ...theme.typography.stepNumber,
}));

// Grows to fill whatever the labels leave, so the uneven label widths
// ("Assess" vs "Reflect on impact") need no hardcoded offsets.
export const StepConnector = styled(Box)(({ theme }) => ({
  flex: '1 1 0',
  minWidth: theme.sizing.space5,
  height: theme.borders.borderWidth,
  marginTop: stepCircleSize / 2,
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
}));

export const ClassChip = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isMore',
})<ActiveProps & { isMore?: boolean }>(({ theme, isActive, isMore }) => {
  const palette = theme.palette.designSystem;
  // eslint-disable-next-line no-nested-ternary
  const background = isMore
    ? palette.surface.neutralGray
    : isActive
      ? palette.foreground.accentBlue
      : palette.surface.skyBlue;

  return {
    minWidth: 102,
    height: 50,
    padding: `0 ${theme.sizing.space4}px`,
    borderRadius: chipRadius,
    backgroundColor: background,
    border: isMore
      ? `${theme.borders.borderWidth}px solid ${palette.foreground.disabledStroke}`
      : 'none',
    // eslint-disable-next-line no-nested-ternary
    color: isMore
      ? palette.foreground.selectedNavy
      : isActive
        ? palette.surface.white
        : palette.surface.atlanticNavy,
    ...theme.typography.buttonLabel,
    fontWeight: 400,
    textTransform: 'none',
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: isActive
        ? palette.foreground.accentBlue
        : palette.foreground.lightBlue,
    },
  };
});

// Figma: 403x40, radius 8 — a rounded rect rather than the pills used elsewhere.
export const WeekSelect = styled(Select<string>)(({ theme }) => ({
  width: '100%',
  maxWidth: 403,
  height: 40,
  borderRadius: theme.sizing.space1,
  backgroundColor: theme.palette.designSystem.surface.white,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.placeholderLabel,
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: 2,
    borderColor: theme.palette.designSystem.surface.darkBlue,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.designSystem.surface.darkBlue,
  },
  '& .MuiSelect-icon': {
    color: theme.palette.designSystem.surface.atlanticNavy,
  },
}));

export const HomeCta = styled(Button)(({ theme }) => ({
  minWidth: 440,
  height: 58,
  padding: `0 ${theme.sizing.space6}px`,
  borderRadius: ctaRadius,
  backgroundColor: theme.palette.designSystem.background.navyBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.ctaLabel,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  },
}));

export type { ScreenSizeProps };
