import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';
import { ScreenSize } from '../MicroCoachModels';

// This Week (dashboard/v2 Dashboard2) and Past Activities (Dashboard3): a
// column of white cards, each with a trash tile beside it, under the sidebar
// screens' shared title.

const actionHeight = 42;
const tagRadius = 4;

// A column of cards, 12 apart (Figma). The page column's gap spaces it from
// the title above.
export const ActivityList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  width: '100%',
  maxWidth: theme.sizing.activityListMaxWidth,
}));

// Past Activities: a week's heading over its cards (Figma: ~20 between).
export const WeekGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space4,
}));

// Past Activities: one WeekGroup per week, ~64 between weeks (Figma
// Dashboard3_a: ~70 from a week's last card to the next heading).
export const ActivityGroupList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space11,
  width: '100%',
  maxWidth: theme.sizing.activityListMaxWidth,
}));

// Figma (Dashboard2): "Week 9: Oct 19-23", Poppins 16/600, over the cards.
// Inset to the cards' text edge (the card's own padding).
export const WeekSubheading = styled(Typography)(({ theme }) => ({
  paddingLeft: theme.sizing.space5,
  ...theme.typography.headingSm,
  letterSpacing: '-0.02em',
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

// Figma (Dashboard3_a): a Rubik 24/600 heading over each week's cards, with
// Sort on the right of the first.
export const WeekHeadingRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.sizing.space3,
  // Inset to the cards' text edge, like WeekSubheading.
  paddingLeft: theme.sizing.space5,
}));

export const WeekHeading = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.appTitle.fontFamily,
  fontWeight: 600,
  fontSize: 24,
  lineHeight: 'normal',
  letterSpacing: '-0.02em',
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

// Figma: a bare icon + "Sort" in Rubik 14, no container.
export const SortButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  marginLeft: 'auto',
  padding: `${theme.sizing.space0}px ${theme.sizing.space1}px`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.buttonLabelSmLight,
  textTransform: 'none',
}));

// Figma: 160x122 radius 8, accentBlue (#4B6FA4, 1 off), right-aligned Rubik 16
// offWhite; the selected option sits on a navy radius-8 bar.
export const sortMenuPaperSx = {
  minWidth: 160,
  borderRadius: '8px',
  bgcolor: 'designSystem.foreground.accentBlue',
  color: 'designSystem.background.offWhite',
  '& .MuiList-root': { py: 0.5 },
  '& .MuiMenuItem-root': {
    minHeight: 38,
    justifyContent: 'flex-end',
    borderRadius: '8px',
    typography: 'rubikBody',
  },
  '& .MuiMenuItem-root.Mui-selected, & .MuiMenuItem-root.Mui-selected:hover':
    { bgcolor: 'designSystem.background.navyBlue' },
};

// Figma: 16 between the card and its trash tile.
export const CardRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'stretch',
  gap: theme.sizing.space3,
}));

// Figma: 1172 wide, radius 16, one navy-free 8% drop. The left column holds
// the class line and the step track or activity name; the right column the
// status line and the action, right-aligned.
export const ActivityCard = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => {
  const isLarge = screenSize === ScreenSize.LARGE;

  return {
    display: 'flex',
    flexDirection: isLarge ? 'row' : 'column',
    alignItems: isLarge ? 'center' : 'flex-start',
    justifyContent: 'space-between',
    gap: theme.sizing.space4,
    flexGrow: 1,
    minWidth: 0,
    padding: isLarge ? theme.sizing.space5 : theme.sizing.space4,
    borderRadius: theme.sizing.space3,
    backgroundColor: theme.palette.designSystem.surface.white,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    boxSizing: 'border-box',
  };
});

export const CardColumn = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'align',
})<{ align: 'start' | 'end' }>(({ theme, align }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: align === 'end' ? 'flex-end' : 'flex-start',
  gap: theme.sizing.space2,
  minWidth: 0,
  textAlign: align === 'end' ? 'right' : 'left',
}));

export const CardLine = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.sizing.space2,
  minWidth: 0,
}));

// Figma: Rubik 20/600.
export const ClassName = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.rubikBody.fontFamily,
  fontWeight: 600,
  fontSize: 20,
  lineHeight: 'normal',
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

// Figma (Dashboard3): the activity under the class line, Rubik 20 regular.
export const ActivityName = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.rubikBody.fontFamily,
  fontWeight: 400,
  fontSize: 20,
  lineHeight: 'normal',
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

// Figma: Rubik 16/500, the step's status or "Review class results".
export const CardMessage = styled(Typography)(({ theme }) => ({
  ...theme.typography.rubikBody,
  fontWeight: 500,
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

// Figma: "24 students", 27 tall, radius 4, skyBlue, Poppins 12/500 navy.
export const StudentsTag = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  height: 27,
  padding: `0 ${theme.sizing.space2}px`,
  borderRadius: tagRadius,
  backgroundColor: theme.palette.designSystem.foreground.skyBlue,
  color: theme.palette.designSystem.background.navyBlue,
  ...theme.typography.bodyText,
  fontSize: 12,
  fontWeight: 500,
  whiteSpace: 'nowrap',
}));

// Figma (Dashboard3): "Completed Oct 22", 26 tall, accentBlue, white.
export const CompletedTag = styled(StudentsTag)(({ theme }) => ({
  height: 26,
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.surface.white,
}));

// Figma: 42 tall navy pill, Rubik 16/500 in #F6F7F8 (offWhite, 9 off), with a
// trailing arrow or chevron.
export const CardActionButton = styled(Button)(({ theme }) => ({
  flexShrink: 0,
  height: actionHeight,
  padding: `0 ${theme.sizing.space4}px`,
  borderRadius: actionHeight / 2,
  backgroundColor: theme.palette.designSystem.background.navyBlue,
  color: theme.palette.designSystem.background.offWhite,
  ...theme.typography.buttonLabel,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '& .MuiButton-endIcon': { marginLeft: theme.sizing.space2 },
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  },
}));

// Figma (Dashboard2): "Waiting on MicroCoach...", the action slot while the
// pipeline runs: #E0E4EF (greyAccent, 6 off) on a navy hairline, Rubik 16.
export const WaitingPill = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  height: actionHeight - 1,
  padding: `0 ${theme.sizing.space4}px`,
  borderRadius: (actionHeight - 1) / 2,
  border: `1px solid ${theme.palette.designSystem.background.navyBlue}`,
  backgroundColor: theme.palette.designSystem.foreground.greyAccent,
  color: theme.palette.designSystem.background.navyBlue,
  ...theme.typography.rubikBody,
  letterSpacing: '-0.02em',
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
}));

// Figma: the 44-wide tile beside each card holding Remove.
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

export type { ScreenSizeProps };
