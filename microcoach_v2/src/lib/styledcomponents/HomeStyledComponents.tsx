import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { ScreenSize } from '../MicroCoachModels';
import { pageGutter } from '../../components/ContentRow';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';

// Lifted from MisconceptionModalStyledComponents — a touch-drag scroller
// shouldn't show a desktop scrollbar track.
const hideScrollbar = {
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none' as const,
  msOverflowStyle: 'none' as const,
};

export const SIDEBAR_WIDTH = 264;

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

// SMALL can't fit three labels across, so the sidebar collapses to a select.
export const SidebarSelect = styled(Select<string>)(({ theme }) => ({
  width: '100%',
  height: 44,
  borderRadius: theme.sizing.space5,
  backgroundColor: theme.palette.designSystem.foreground.fadedNavyBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.mediumLabel,
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '& .MuiSelect-icon': { color: theme.palette.designSystem.surface.white },
}));

// Not clamped itself — each band below sets its own max width, so the stepper
// can run wider than the column the rest of the page sits in.
export const HomeContent = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => {
  const isLarge = screenSize === ScreenSize.LARGE;
  const gutter = pageGutter(theme, screenSize);

  return {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
    width: '100%',
    // At LARGE the banner floats, so this alone puts the hero's line box at the
    // Figma y. Below that the banner is in flow and sets the hero's position.
    paddingTop: isLarge
      ? theme.sizing.space11 + theme.sizing.space1
      : theme.sizing.space6,
    paddingBottom: isLarge ? theme.sizing.space12 : theme.sizing.space8,
    paddingLeft: gutter,
    paddingRight: gutter,
    boxSizing: 'border-box',
  };
});

export const HomeBand = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'wide',
})<{ wide?: boolean }>(({ theme, wide }) => ({
  width: '100%',
  maxWidth: wide
    ? theme.sizing.stepperMaxWidth
    : theme.sizing.homeContentMaxWidth,
}));

// Figma draws the banner over the hero's leading rather than above it, so at
// LARGE it sits out of flow. Below LARGE the copy wraps to several lines and
// would grow down into the hero, so it returns to the flow instead.
export const FloatingBanner = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => {
  const isLarge = screenSize === ScreenSize.LARGE;

  if (!isLarge) {
    return {
      width: '100%',
      maxWidth: theme.sizing.bannerMaxWidth,
      marginBottom: theme.sizing.space6,
      boxSizing: 'border-box',
    };
  }

  return {
    position: 'absolute',
    top: theme.sizing.space5,
    left: '50%',
    transform: 'translateX(-50%)',
    width: `calc(100% - ${2 * pageGutter(theme, screenSize)}px)`,
    maxWidth: theme.sizing.bannerMaxWidth,
    boxSizing: 'border-box',
    zIndex: 1,
  };
});

// At SMALL the five steps are far wider than the viewport, so the row becomes
// a native touch-drag scroller: overflow-x gives momentum scrolling for free,
// and scroll-snap settles it on step boundaries.
export const StepperRow = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  width: '100%',
  ...(screenSize !== ScreenSize.LARGE && {
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    paddingBottom: theme.sizing.space1,
    ...hideScrollbar,
  }),
}));

export const StepItem = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.sizing.space1,
  // Must not shrink, or the row has nothing to overflow and labels collide.
  flexShrink: 0,
  ...(screenSize !== ScreenSize.LARGE && { scrollSnapAlign: 'start' }),
}));

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
// ("Assess" vs "Reflect on impact") need no hardcoded offsets. Inside the
// SMALL scroller it takes a fixed width instead, since there is no width left
// to distribute.
export const StepConnector = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => {
  const isSmall = screenSize === ScreenSize.SMALL;

  return {
    flex: isSmall ? `0 0 ${theme.sizing.space11}px` : '1 1 0',
    minWidth: isSmall ? undefined : theme.sizing.space5,
    height: theme.borders.borderWidth,
    marginTop: stepCircleSize / 2,
    backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  };
});

// Figma: the 858 content column splits 357 (chips) + 98 gap + 403 (select).
// Below LARGE the two stack, class above week.
export const PickerRow = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => {
  const isLarge = screenSize === ScreenSize.LARGE;

  return {
    display: 'flex',
    flexDirection: isLarge ? 'row' : 'column',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: theme.sizing.homeContentMaxWidth,
    gap: isLarge ? theme.sizing.space13 : theme.sizing.space6,
  };
});

// flex-basis resolves against the main axis, so the LARGE basis has to drop
// once the row turns into a column or it would set a height.
export const PickerColumn = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'basis' && prop !== 'screenSize',
})<ScreenSizeProps & { basis: number }>(({ theme, screenSize, basis }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space3,
  flex: screenSize === ScreenSize.LARGE ? `1 1 ${basis}px` : 'none',
  width: screenSize === ScreenSize.LARGE ? undefined : '100%',
  minWidth: 0,
}));

// Figma runs this label to ~370, past its own 357 column and into the gutter.
// That only fits at LARGE — narrower than that it has to wrap.
export const PickerLabel = styled(Typography, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  ...theme.typography.formLabel,
  color: theme.palette.designSystem.surface.darkBlue,
  whiteSpace: screenSize === ScreenSize.LARGE ? 'nowrap' : 'normal',
}));

// 357px against 102px chips fits exactly three, so the 3 + 2 wrap in the
// export falls out of the column width rather than an authored break.
export const ChipWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  columnGap: theme.sizing.space5,
  rowGap: theme.sizing.space4,
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
  // width/maxWidth rather than minWidth: at 393 a 440 minimum overflows the
  // page, and minWidth beats the parent's width.
  width: '100%',
  maxWidth: 440,
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
