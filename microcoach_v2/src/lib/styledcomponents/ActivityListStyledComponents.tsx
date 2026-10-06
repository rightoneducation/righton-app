import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';
import { ScreenSize } from '../MicroCoachModels';

// This Week (dashboard/Dashboard2) and Past Activities (Dashboard3): a toolbar
// over a column of white cards, under the sidebar screens' shared title.

const pillHeight = 36;
const tagHeight = 27;
const outlinePillHeight = 25;

// Figma (Dashboard2): the 76 between the title's line box and the toolbar,
// then 20 down to the first card, then 12 between cards.
export const ActivityList = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  width: '100%',
  maxWidth: theme.sizing.activityListMaxWidth,
  marginTop:
    screenSize === ScreenSize.LARGE
      ? theme.sizing.space11 + theme.sizing.space2
      : theme.sizing.space6,
}));

export const ActivityToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.sizing.space3,
  marginBottom: theme.sizing.space1,
}));

// Figma: 213x36 skyBlue pill, plus icon and Rubik 16/500 navy.
export const AddClassPill = styled(Button)(({ theme }) => ({
  height: pillHeight,
  padding: `0 ${theme.sizing.space4}px`,
  borderRadius: pillHeight / 2,
  backgroundColor: theme.palette.designSystem.foreground.skyBlue,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.buttonLabel,
  letterSpacing: 0,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.foreground.lightBlue,
  },
}));

// Figma: a bare icon + "Sort" in Rubik 14, no container.
export const SortButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  padding: `${theme.sizing.space0}px ${theme.sizing.space1}px`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.buttonLabelSmLight,
  textTransform: 'none',
}));

// Figma: 160x122 radius 8, accentBlue, right-aligned Poppins 16/600 offWhite.
export const sortMenuPaperSx = {
  minWidth: 160,
  borderRadius: '8px',
  bgcolor: 'designSystem.foreground.accentBlue',
  color: 'designSystem.background.offWhite',
  '& .MuiMenuItem-root': {
    justifyContent: 'flex-end',
    typography: 'headingSm',
  },
  '& .MuiMenuItem-root.Mui-selected, & .MuiMenuItem-root.Mui-selected:hover':
    { bgcolor: 'designSystem.background.fadedWhiteVeil' },
};

export const CardRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'stretch',
  gap: theme.sizing.space2,
}));

// Figma: radius 16, a navy 8% drop under a wider soft shadow — three-layer
// grey on This Week, a single pink-tinted one on Past Activities.
export const ActivityCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tint',
})<{ tint: 'grey' | 'pink' }>(({ theme, tint }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  minWidth: 0,
  padding: `${theme.sizing.space4}px ${theme.sizing.space3}px`,
  borderRadius: theme.sizing.space3,
  backgroundColor: theme.palette.designSystem.surface.white,
  boxShadow: [
    '0px 2px 8px rgba(0, 0, 0, 0.08)',
    ...(tint === 'pink'
      ? ['0px 5px 22px rgba(244, 190, 216, 0.15)']
      : [
          '5px 8px 9px rgba(0, 0, 0, 0.03)',
          '11px 18px 13px rgba(0, 0, 0, 0.02)',
        ]),
  ].join(', '),
  boxSizing: 'border-box',
}));

// Figma (Dashboard2): the 44-wide tile beside each card holding Remove.
export const RemoveTile = styled(Button)(({ theme }) => ({
  flexShrink: 0,
  minWidth: 44,
  width: 44,
  padding: 0,
  borderRadius: theme.sizing.space3,
  backgroundColor: theme.palette.designSystem.surface.white,
  color: theme.palette.designSystem.surface.atlanticNavy,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.foreground.skyBlue,
  },
}));

export const CardLine = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  columnGap: theme.sizing.space2,
  rowGap: theme.sizing.space1,
  minWidth: 0,
}));

// Figma: Poppins 15 at 55%, separating the class name from its tags.
export const CardDivider = styled('span')(({ theme }) => ({
  ...theme.typography.bodyText,
  fontSize: 15,
  color: theme.palette.designSystem.surface.atlanticNavy,
  opacity: 0.55,
}));

// Figma: 27 tall, radius 4, Poppins 12.
export const CardTag = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: 'step' | 'count' }>(({ theme, tone }) => {
  const palette = theme.palette.designSystem;
  const isStep = tone === 'step';

  return {
    display: 'inline-flex',
    alignItems: 'center',
    height: tagHeight,
    padding: `0 ${isStep ? theme.sizing.space1 : theme.sizing.space2}px`,
    borderRadius: theme.sizing.space0,
    backgroundColor: isStep ? palette.foreground.brightBlue : palette.foreground.skyBlue,
    color: isStep ? palette.background.offWhite : palette.background.navyBlue,
    ...theme.typography.bodyText,
    fontSize: 12,
    fontWeight: isStep ? 400 : 500,
    whiteSpace: 'nowrap',
  };
});

// Figma: 25 tall outlined pills, Poppins 14. `success` is "Waiting on
// MicroCoach"; `plain` the navy-outlined date and count pills.
export const OutlinePill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: 'plain' | 'success' }>(({ theme, tone }) => {
  const palette = theme.palette.designSystem;
  const isSuccess = tone === 'success';

  return {
    display: 'inline-flex',
    alignItems: 'center',
    height: outlinePillHeight,
    padding: `0 ${theme.sizing.space1}px`,
    borderRadius: outlinePillHeight / 2,
    border: `${theme.borders.borderWidth}px solid ${
      isSuccess ? palette.surface.green : palette.background.navyBlue
    }`,
    backgroundColor: isSuccess ? palette.surface.lightGreen : 'transparent',
    color: isSuccess ? palette.surface.green : palette.surface.atlanticNavy,
    ...theme.typography.xsLabel,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
  };
});

// Figma (Dashboard3): 35 tall, accentBlue on a navy hairline, Poppins 14 white.
export const IncompletePill = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  height: 35,
  padding: `0 ${theme.sizing.space1}px`,
  borderRadius: 17.5,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.xsLabel,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
}));

// Figma: 66x36 navy pill, Rubik 14 white.
export const OpenButton = styled(Button)(({ theme }) => ({
  flexShrink: 0,
  minWidth: 66,
  height: pillHeight,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: pillHeight / 2,
  backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.buttonLabelSmLight,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.background.navyBlue,
  },
}));

// Figma (Dashboard3): "Open activity details" and "Remove", 36 tall skyBlue
// pills with a navy icon, Rubik 14.
export const SoftPillButton = styled(Button)(({ theme }) => ({
  flexShrink: 0,
  height: pillHeight,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: pillHeight / 2,
  backgroundColor: theme.palette.designSystem.foreground.skyBlue,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.buttonLabelSmLight,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '& .MuiButton-startIcon': { marginRight: theme.sizing.space0 },
  '&:hover': {
    backgroundColor: theme.palette.designSystem.foreground.lightBlue,
  },
}));

export type { ScreenSizeProps };
