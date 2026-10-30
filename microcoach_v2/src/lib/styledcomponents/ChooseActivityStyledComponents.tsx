import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import { ScreenSize } from '../MicroCoachModels';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';
import { dashboardCardShadow } from './DashboardStyledComponents';

/*
 * Select Activity (/review/:id/activities, microcoach-assets/SelectActivity,
 * 1692 wide): the Understand page's shell — stepper row, a "Misconception
 * selected" bar, title — then one card per next-step activity.
 */

const chipRadius = 4;
const actionHeight = 37;
const stepBadgeSize = 20;

// Figma: 1130x65 rx12 white on a 2px periwinkle hairline, Rubik 20, 32 in.
export const SelectedBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.sizing.space3,
  minHeight: 65,
  padding: `${theme.sizing.space2}px ${theme.sizing.space6}px`,
  borderRadius: theme.sizing.space2,
  backgroundColor: theme.palette.designSystem.surface.white,
  border: `2px solid ${theme.palette.designSystem.foreground.periwinkle}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.uploadLabel,
  boxSizing: 'border-box',
}));

// "Change" — text only, back to the misconceptions.
export const ChangeLink = styled(ButtonBase)(({ theme }) => ({
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.uploadLabel,
  borderRadius: chipRadius,
  // Underlined at rest, so it reads as a link (dev QA 2026-10-30).
  textDecoration: 'underline',
}));

/*
 * Below the stepper: the Misconception selected bar, then the title and
 * cards. Figma puts the title ~60 under the bar (space10; 56 and 64 are
 * equally near, and My Activity's ~59 already took space10). Grouped here so
 * UnderstandColumn's 32, which Review shares, still spaces the stepper.
 */
export const ChooseActivityBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space10,
}));

/** The title over the cards, 32 apart as before. */
export const ChooseActivityMain = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space6,
}));

/** Title over subtitle (Figma: 8 apart). */
export const TitleBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
}));

/*
 * At LARGE the cards sit side by side and share their rows (CSS subgrid):
 * name, subtitle, grouping chips, Why this activity?, How to run it, buttons.
 * Each section starts at the same height on every card, whatever the length
 * of the text above it. Stacked below LARGE, each card is its own column.
 */
export const ACTIVITY_CARD_ROWS = 6;

interface AlignedProps {
  isAligned: boolean;
}
const noAligned = (prop: PropertyKey) => prop !== 'isAligned';

/** Figma: two 551-wide cards 28 apart at LARGE (one grid the cards share rows of), stacked below. */
export const ActivityCardRow = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) =>
  screenSize === ScreenSize.LARGE
    ? {
        display: 'grid',
        gridTemplateRows: `repeat(${ACTIVITY_CARD_ROWS}, auto)`,
        gridAutoFlow: 'column',
        gridAutoColumns: 'minmax(0, 1fr)',
        columnGap: theme.sizing.space6,
        width: '100%',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.sizing.space6,
        width: '100%',
      },
);

// Figma: 551x475 rx32 white with the dashboard card's soft shadow, 25 in;
// its sections 16 apart. 32 over the title (dev QA 2026-10-29), as on the
// activity flow's cards.
export const ActivityCardSurface = styled(Box, {
  shouldForwardProp: noAligned,
})<AlignedProps>(({ theme, isAligned }) => ({
  ...(isAligned
    ? {
        display: 'grid',
        gridRow: `span ${ACTIVITY_CARD_ROWS}`,
        gridTemplateRows: 'subgrid',
        rowGap: theme.sizing.space3,
        alignContent: 'start',
      }
    : { display: 'flex', flexDirection: 'column', gap: theme.sizing.space3 }),
  padding: `${theme.sizing.space6}px ${theme.sizing.space5}px ${theme.sizing.space5}px`,
  borderRadius: theme.sizing.space6,
  backgroundColor: theme.palette.designSystem.surface.white,
  boxShadow: dashboardCardShadow,
  boxSizing: 'border-box',
}));

/** Name, routine and grouping sequence, tight together (Figma: ~10 apart): three of the card's rows. */
export const CardHeader = styled(Box, {
  shouldForwardProp: noAligned,
})<AlignedProps>(({ theme, isAligned }) =>
  isAligned
    ? {
        display: 'grid',
        gridRow: 'span 3',
        gridTemplateRows: 'subgrid',
        rowGap: theme.sizing.space1,
        alignItems: 'start',
      }
    : { display: 'flex', flexDirection: 'column', gap: theme.sizing.space1 },
);

export const NameRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.sizing.space2,
}));

// Figma: 78x27 rx4 brightBlue, Poppins 12 offWhite.
export const DurationChip = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  minHeight: 27,
  padding: `0 ${theme.sizing.space1}px`,
  borderRadius: chipRadius,
  backgroundColor: theme.palette.designSystem.foreground.brightBlue,
  color: theme.palette.designSystem.background.offWhite,
  ...theme.typography.xsLabel,
  fontSize: 12,
  whiteSpace: 'nowrap',
}));

export const GroupingSequence = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.sizing.space1,
}));

// Figma: h27 rx4 skyBlue, icon + Poppins 12/500 navyBlue.
export const GroupingChip = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.sizing.space0,
  minHeight: 27,
  padding: `0 ${theme.sizing.space1}px`,
  borderRadius: chipRadius,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  color: theme.palette.designSystem.background.navyBlue,
  ...theme.typography.xsLabel,
  fontSize: 12,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  '& img': { width: 16, height: 16, objectFit: 'contain' },
}));

export const SequenceArrow = styled('span')(({ theme }) => ({
  color: theme.palette.designSystem.background.navyBlue,
  ...theme.typography.rubikBody,
  fontWeight: 600,
}));

/** A heading over its text ("Why this activity?", "How to run it"). */
export const CardSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

// Figma: five steps in two columns (3 + 2), 29 apart; one column below LARGE.
export const RunSteps = styled('ol', {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'grid',
  gridTemplateColumns: screenSize === ScreenSize.LARGE ? '1fr 1fr' : '1fr',
  gridTemplateRows: screenSize === ScreenSize.LARGE ? 'repeat(3, auto)' : undefined,
  gridAutoFlow: screenSize === ScreenSize.LARGE ? 'column' : 'row',
  gap: `${theme.sizing.space1}px ${theme.sizing.space3}px`,
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));

export const RunStep = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space1,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.microLabel,
}));

// Figma: a 20px navyBlue disc, the number in bold white.
export const StepBadge = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: stepBadgeSize,
  height: stepBadgeSize,
  borderRadius: '50%',
  backgroundColor: theme.palette.designSystem.background.navyBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.microLabel,
  fontWeight: 700,
}));

/** Pushed to the card's foot so both cards' buttons line up. */
export const CardActionRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.sizing.space2,
  // Stacked, the buttons sit at the card's foot; side by side, the shared
  // bottom row puts them there.
  marginTop: 'auto',
  alignSelf: 'end',
}));

interface CardActionProps {
  isPrimary?: boolean;
}

// Figma: 167/163x37 rx18.5, Open Sans-ish 14/600 white — View activity
// details on accentBlue, Select activity on navyBlue.
export const CardAction = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isPrimary',
})<CardActionProps>(({ theme, isPrimary }) => ({
  minHeight: actionHeight,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: actionHeight / 2,
  backgroundColor: isPrimary
    ? theme.palette.designSystem.background.navyBlue
    : theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.buttonLabelSm,
  fontWeight: 600,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: isPrimary
      ? theme.palette.designSystem.background.navyBlue
      : theme.palette.designSystem.foreground.accentBlue,
  },
}));

export type { ScreenSizeProps };
