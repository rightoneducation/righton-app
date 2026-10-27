import { alpha, styled, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { ScreenSize } from '../MicroCoachModels';
import { pageGutter } from '../../components/ContentRow';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';
import sidebarPatternTile from '../../images/sidebarPatternTile.svg';

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
// sidebarPatternTile.svg is design's 497-wide module (dashboard/v2/
// BackgroundPattern.svg) padded to 601: the frames repeat it every 601px
// (x -1, 600, 1201), and repeat-x lays copies edge to edge at the image width.
const patternBandTop = 383;

/**
 * The cool-white page with the tiled pattern band, shared by the sidebar
 * screens and the MIU upload flow (their frames draw the same band).
 */
export const patternPageBackground = (theme: Theme, screenSize: ScreenSize) => ({
  backgroundColor: theme.palette.designSystem.background.coolWhite,
  // The band is decoration sized for the desktop frame; below LARGE the
  // content stacks and would sit across it at arbitrary points.
  ...(screenSize === ScreenSize.LARGE && {
    backgroundImage: `url(${sidebarPatternTile})`,
    backgroundRepeat: 'repeat-x',
    backgroundPosition: `left 0 top ${patternBandTop}px`,
  }),
});

export const SidebarLayout = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
  alignItems: 'stretch',
  width: '100%',
  flexGrow: 1,
  ...patternPageBackground(theme, screenSize),
}));

// Sits below the header rather than beside it, on the three sidebar screens
// (Dashboard, This Week, Past Activities).
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

interface SidebarContentProps extends ScreenSizeProps {
  // The list pages open on a page title; the dashboard opens on its stepper.
  isTitled?: boolean;
  // Overrides the LARGE section gap (a theme.sizing token).
  contentGap?: number;
}

// The sidebar screens' content column: its gap spaces the page's sections and
// its padding is the page inset. Not clamped itself — each section sets its own
// max width, so the stepper and card can run wider than the picker column.
// Figma (rev2 LandingPage, LARGE): the dashboard's stepper ring starts ~62
// under the header and Weekly Activity Progress sits ~45 below the card (the
// stepper-to-card gap is DashboardIntro's); the list pages' title sits ~92
// down; the gap from title to list differs per page, so a page can pass its
// own (contentGap).
export const SidebarContent = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'screenSize' && prop !== 'isTitled' && prop !== 'contentGap',
})<SidebarContentProps>(({ theme, screenSize, isTitled, contentGap }) => {
  const isLarge = screenSize === ScreenSize.LARGE;
  const gutter = pageGutter(theme, screenSize);
  let paddingTop = theme.sizing.space6;
  let gap = theme.sizing.space6;
  if (isLarge) {
    paddingTop = isTitled ? theme.sizing.space13 : theme.sizing.space11;
    gap = contentGap ?? theme.sizing.space8;
  }

  return {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap,
    flexGrow: 1,
    width: '100%',
    // A flex item defaults to min-width: auto, so without this the column
    // grows to fit the stepper row (track + My activity, ~1044) and widens
    // the page past the viewport between 1024 and ~1356.
    minWidth: 0,
    paddingTop,
    paddingBottom: isLarge ? theme.sizing.space12 : theme.sizing.space8,
    paddingLeft: gutter,
    paddingRight: gutter,
    boxSizing: 'border-box',
  };
});

export const SidebarTitleBand = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: theme.sizing.dashboardContentMaxWidth,
}));

// Home: the stepper row over the upload card (Figma rev2 LandingPage: ~78
// from the step labels to the card). Grouped so that gap stays separate from
// the page column's, which spaces the card from Weekly Activity Progress.
export const DashboardIntro = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap:
    screenSize === ScreenSize.LARGE
      ? theme.sizing.space12
      : theme.sizing.space6,
  width: '100%',
}));

// Figma (Dashboard1): three stacked soft shadows, offset down and right.
export const dashboardCardShadow = [
  '5px 8px 9px rgba(0, 0, 0, 0.03)',
  '11px 18px 13px rgba(0, 0, 0, 0.02)',
  '20px 32px 15px rgba(0, 0, 0, 0.01)',
].join(', ');

// Figma (DevQA TeacherDashboard): 1206x542, radius 20, holding the heading,
// then the pickers and CTA. The two groups sit ~94 apart, between space12 and
// space13 with neither close; each spaces its own items more tightly. The
// title sits 28 under the card's top edge and the CTA ~28 over its bottom.
const dashboardCardInsetY = 28;

export const DashboardCard = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => {
  const isLarge = screenSize === ScreenSize.LARGE;

  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: isLarge ? 94 : theme.sizing.space6,
    width: '100%',
    maxWidth: theme.sizing.dashboardCardMaxWidth,
    padding: isLarge
      ? `${dashboardCardInsetY}px ${theme.sizing.space6}px`
      : theme.sizing.space4,
    borderRadius: theme.sizing.space4,
    backgroundColor: theme.palette.designSystem.surface.white,
    boxShadow: dashboardCardShadow,
    boxSizing: 'border-box',
  };
});

// Title over subtitle (Figma: ~24 between them).
export const DashboardHeading = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.sizing.space5,
  textAlign: 'center',
}));

// The pickers and the CTA under them (Figma: ~32 between).
export const DashboardForm = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.sizing.space6,
  width: '100%',
}));

// The step track on the left, "My activity" on the right. Below LARGE the two
// stack. At LARGE they wrap the same way once the column is narrower than
// both (~1044; under ~1356 with the sidebar) rather than overflowing it.
// At LARGE the button is centred on the whole track, circles and labels
// (DevQA TeacherDashboard, rev3 PaddingReference).
export const StepperBand = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => {
  const isLarge = screenSize === ScreenSize.LARGE;

  return {
    display: 'flex',
    flexDirection: isLarge ? 'row' : 'column',
    flexWrap: isLarge ? 'wrap' : 'nowrap',
    alignItems: isLarge ? 'center' : 'flex-start',
    justifyContent: 'space-between',
    gap: theme.sizing.space4,
    width: '100%',
    maxWidth: theme.sizing.stepperMaxWidth,
  };
});

// Whenever the column is narrower than the track (always at MEDIUM, and at
// LARGE from 1024 to ~1106), the row becomes a native touch-drag scroller:
// overflow-x gives momentum scrolling for free, and scroll-snap settles it on
// step boundaries. Wider than the track it never scrolls.
export const StepperRow = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space2,
  minWidth: 0,
  maxWidth: '100%',
  overflowX: 'auto',
  ...hideScrollbar,
  ...(screenSize !== ScreenSize.LARGE && {
    width: '100%',
    scrollSnapType: 'x mandatory',
  }),
}));

export type StepState = 'COMPLETE' | 'CURRENT' | 'UPCOMING';

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
    backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  },
  // rev2 LandingPage: greyed out (#666666 at 50%; ashyGray, 7 off) until the
  // class has a chosen activity.
  '&.Mui-disabled': {
    backgroundColor: alpha(theme.palette.designSystem.surface.ashyGray, 0.5),
    color: theme.palette.designSystem.surface.white,
  },
}));

// Figma: three chips per row (the export's 3 + 2 wrap). The class column's
// wrapped content (chips, hint, error) is capped at that width, so it never
// widens the column; the label alone decides how wide the column is.
const CHIP_WIDTH = 102;
const CHIPS_PER_ROW = 3;
const classSlotMaxWidth = (theme: Theme) =>
  CHIPS_PER_ROW * CHIP_WIDTH + (CHIPS_PER_ROW - 1) * theme.sizing.space5;

// Class column, then week column (Figma: ~84 between the label's end and the
// select). Below LARGE the two stack, class above week.
export const PickerRow = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => {
  const isLarge = screenSize === ScreenSize.LARGE;

  return {
    display: 'flex',
    flexDirection: isLarge ? 'row' : 'column',
    // From 1024 to ~1100 the card is too narrow for the class label and a
    // readable week select side by side, so the week column wraps under.
    flexWrap: isLarge ? 'wrap' : 'nowrap',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: theme.sizing.dashboardContentMaxWidth,
    gap: isLarge ? theme.sizing.space12 : theme.sizing.space6,
  };
});

const WEEK_SELECT_MIN_WIDTH = 240;

// At LARGE a column either fits its content (class) or takes the rest of the
// row (`grow`, week). Below LARGE each spans the full width.
export const PickerColumn = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'grow' && prop !== 'screenSize',
})<ScreenSizeProps & { grow?: boolean }>(({ theme, screenSize, grow }) => {
  const isLarge = screenSize === ScreenSize.LARGE;
  let flex = 'none';
  if (isLarge) flex = grow ? '1 1 auto' : '0 0 auto';

  return {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.sizing.space3,
    flex,
    width: isLarge ? undefined : '100%',
    // The week column wraps rather than squeezing the select below the
    // longest week label ("Week 10 (Oct 26-30)").
    minWidth: isLarge && grow ? WEEK_SELECT_MIN_WIDTH : 0,
  };
});

// One line at LARGE, where it sets the class column's width. Below LARGE the
// column is the full width and the label wraps.
export const PickerLabel = styled(Typography, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  ...theme.typography.formLabel,
  color: theme.palette.designSystem.surface.darkBlue,
  whiteSpace: screenSize === ScreenSize.LARGE ? 'nowrap' : 'normal',
}));

export const ChipWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  columnGap: theme.sizing.space5,
  rowGap: theme.sizing.space4,
  maxWidth: classSlotMaxWidth(theme),
}));

// The no-classes hint and the load error, in the chips' place and width.
export const PickerNote = styled(Typography)(({ theme }) => ({
  ...theme.typography.rubikBody,
  maxWidth: classSlotMaxWidth(theme),
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
    minWidth: CHIP_WIDTH,
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

export const DashboardCta = styled(Button)(({ theme }) => ({
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
    backgroundColor: theme.palette.designSystem.background.navyBlue,
  },
  // Disabled only while the next step is still loading (it shows a spinner):
  // keep the button's own colours, dimmed, rather than MUI's grey.
  '&.Mui-disabled': {
    backgroundColor: theme.palette.designSystem.background.navyBlue,
    color: theme.palette.designSystem.surface.white,
    opacity: 0.7,
  },
}));

export type { ScreenSizeProps };
