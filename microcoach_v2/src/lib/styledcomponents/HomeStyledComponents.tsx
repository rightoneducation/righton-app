import { styled, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { ScreenSize } from '../MicroCoachModels';
import { pageGutter } from '../../components/ContentRow';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';
import homePatternBand from '../../images/homePatternBand.svg';

// Lifted from MisconceptionModalStyledComponents — a touch-drag scroller
// shouldn't show a desktop scrollbar track.
const hideScrollbar = {
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none' as const,
  msOverflowStyle: 'none' as const,
};

export const SIDEBAR_WIDTH = 264;

const chipRadius = 25;
const ctaRadius = 29;

interface ActiveProps {
  isActive: boolean;
}

// Figma (Dashboard1-3): the tiled band runs y 519-877 of the frame, 383 below
// the 136 header. It is drawn under the sidebar, which simply covers it.
const patternBandTop = 383;

export const HomeLayout = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
  alignItems: 'stretch',
  width: '100%',
  flexGrow: 1,
  backgroundColor: theme.palette.designSystem.background.coolWhite,
  // The band is decoration sized for the desktop frame; below LARGE the
  // content stacks and would sit across it at arbitrary points.
  ...(screenSize === ScreenSize.LARGE && {
    backgroundImage: `url(${homePatternBand})`,
    backgroundRepeat: 'repeat-x',
    backgroundPosition: `left 0 top ${patternBandTop}px`,
  }),
}));

// Sits below the header rather than beside it, on the three sidebar screens
// (Home, This Week, Past Activities).
//
// At LARGE the right padding is 0 so the active tab can run flush into the
// page edge, as Figma draws it (x21 to the sidebar's 264). The tabs are 68
// tall on a 99 pitch, so the gap between them is space6.
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
    paddingTop: isLarge ? theme.sizing.space3 : theme.sizing.space4,
    paddingBottom: theme.sizing.space4,
    paddingLeft: isLarge ? theme.sizing.space4 : theme.sizing.space5,
    paddingRight: isLarge ? 0 : theme.sizing.space5,
    backgroundColor: theme.palette.designSystem.background.sidebarBlue,
    boxSizing: 'border-box',
    overflowX: isLarge ? 'visible' : 'auto',
  };
});

const sidebarTabHeight = 68;

// LARGE: a tab rounded on the left only, flush against the page. Below LARGE
// the items sit in a scrolling row, where a flush edge has nothing to meet,
// so they keep the full pill.
export const SidebarItem = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'screenSize',
})<ActiveProps & ScreenSizeProps>(({ theme, isActive, screenSize }) => {
  const isLarge = screenSize === ScreenSize.LARGE;
  const palette = theme.palette.designSystem;

  return {
    justifyContent: 'flex-start',
    flexShrink: 0,
    gap: theme.sizing.space2,
    height: isLarge ? sidebarTabHeight : undefined,
    padding: isLarge
      ? `0 ${theme.sizing.space4}px`
      : `${theme.sizing.space1}px ${theme.sizing.space4}px`,
    borderRadius: isLarge
      ? `${sidebarTabHeight / 2}px 0 0 ${sidebarTabHeight / 2}px`
      : theme.sizing.space5,
    backgroundColor: isActive ? palette.background.sidebarActive : 'transparent',
    color: palette.surface.white,
    ...theme.typography.mediumLabel,
    textTransform: 'none',
    whiteSpace: 'nowrap',
    // Hover stays lighter than the active tab, so pointing at an item never
    // looks like selecting it.
    '&:hover': {
      backgroundColor: isActive
        ? palette.background.sidebarActive
        : palette.background.fadedWhiteHover,
    },
  };
});

// SMALL can't fit three labels across, so the sidebar collapses to a select.
export const SidebarSelect = styled(Select<string>)(({ theme }) => ({
  width: '100%',
  height: 44,
  borderRadius: theme.sizing.space5,
  backgroundColor: theme.palette.designSystem.background.sidebarActive,
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
    // Figma y (Dashboard1-3: baseline 276, 24 lower than the earlier frame).
    // Below that the banner is in flow and sets the hero's position.
    paddingTop: isLarge
      ? theme.sizing.space11 + theme.sizing.space1 + theme.sizing.space5
      : theme.sizing.space6,
    paddingBottom: isLarge ? theme.sizing.space12 : theme.sizing.space8,
    paddingLeft: gutter,
    paddingRight: gutter,
    boxSizing: 'border-box',
  };
});

export const HomeBand = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: theme.sizing.homeContentMaxWidth,
}));

// Figma (Dashboard1): three stacked soft shadows, offset down and right.
export const homeCardShadow = [
  '5px 8px 9px rgba(0, 0, 0, 0.03)',
  '11px 18px 13px rgba(0, 0, 0, 0.02)',
  '20px 32px 15px rgba(0, 0, 0, 0.01)',
].join(', ');

// Figma (Dashboard1): 914x322, radius 20, holding the subtitle and pickers.
// 914 is the 858 picker column plus 28 each side.
export const HomeCard = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => {
  const isLarge = screenSize === ScreenSize.LARGE;
  const inset = theme.sizing.space5 + theme.sizing.space0;

  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.sizing.space6,
    width: '100%',
    maxWidth: theme.sizing.homeCardMaxWidth,
    padding: isLarge
      ? `${theme.sizing.space6}px ${inset}px ${theme.sizing.space6 + theme.sizing.space0}px`
      : theme.sizing.space4,
    borderRadius: theme.sizing.space4,
    backgroundColor: theme.palette.designSystem.surface.white,
    boxShadow: homeCardShadow,
    boxSizing: 'border-box',
  };
});

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

// Breadcrumb on the left, "My activity" on the right. Below LARGE the two
// stack, since the five labels alone already overflow the width.
export const StepperBand = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => {
  const isLarge = screenSize === ScreenSize.LARGE;

  return {
    display: 'flex',
    flexDirection: isLarge ? 'row' : 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.sizing.space4,
    width: '100%',
    maxWidth: theme.sizing.stepperMaxWidth,
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
  gap: theme.sizing.space2,
  minWidth: 0,
  // Figma: the labels' line box starts ~19 below the My activity button's top.
  paddingTop: screenSize === ScreenSize.LARGE ? theme.sizing.space4 : 0,
  ...(screenSize !== ScreenSize.LARGE && {
    width: '100%',
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    ...hideScrollbar,
  }),
}));

export type StepState = 'COMPLETE' | 'CURRENT' | 'UPCOMING';

// Figma (Dashboard1): every label is the same navy; only the current step is
// marked, by a 3.33px rule running 20px past the label each side.
const stepItemStyles = (
  theme: Theme,
  screenSize: ScreenSize,
  stepState: StepState,
) => ({
  display: 'flex',
  // Must not shrink, or the row has nothing to overflow and labels collide.
  flexShrink: 0,
  padding: `0 ${theme.sizing.space4}px ${theme.sizing.space4}px`,
  borderBottom: `3px solid ${
    stepState === 'CURRENT'
      ? theme.palette.designSystem.surface.atlanticNavy
      : 'transparent'
  }`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.stepLabel,
  whiteSpace: 'nowrap' as const,
  ...(screenSize !== ScreenSize.LARGE && { scrollSnapAlign: 'start' }),
});

const noStepProps = (prop: PropertyKey) =>
  prop !== 'screenSize' && prop !== 'stepState';

export const StepItem = styled(Box, {
  shouldForwardProp: noStepProps,
})<ScreenSizeProps & { stepState: StepState }>(
  ({ theme, screenSize, stepState }) =>
    stepItemStyles(theme, screenSize, stepState),
);

// A step that links back to its page: same look as StepItem, but a real button
// so it takes keyboard focus and Enter/Space. The label underlines on hover and
// focus so it reads as a link.
export const StepButton = styled(ButtonBase, {
  shouldForwardProp: noStepProps,
})<ScreenSizeProps & { stepState: StepState }>(
  ({ theme, screenSize, stepState }) => ({
    ...stepItemStyles(theme, screenSize, stepState),
    '&:hover .step-label, &.Mui-focusVisible .step-label': {
      textDecoration: 'underline',
    },
  }),
);

// Figma: Rubik 23.3/600, sitting level with the labels' baseline.
export const StepSeparator = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  fontFamily: theme.typography.stepLabel.fontFamily,
  fontWeight: 600,
  fontSize: 23,
  lineHeight: 1,
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

// Figma: 229x42, radius 21. Drawn in Open Sans 14/600, which the app does not
// load; Rubik at the same size and weight stands in.
export const MyActivityButton = styled(Button)(({ theme }) => ({
  flexShrink: 0,
  minWidth: 229,
  height: 42,
  padding: `0 ${theme.sizing.space5}px`,
  borderRadius: 21,
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.buttonLabelSm,
  fontWeight: 600,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  },
}));

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
  // Figma #E0E4EF: 6 off greyAccent at its widest channel, so it reuses it.
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: 2,
    borderColor: theme.palette.designSystem.foreground.greyAccent,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.designSystem.foreground.greyAccent,
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
