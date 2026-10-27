import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { ScreenSize } from '../MicroCoachModels';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';
import {
  dashboardCardShadow,
  patternPageBackground,
} from './DashboardStyledComponents';
import { pageGutter } from '../../components/ContentRow';

/*
 * Understand Your Students' Thinking (/review, microcoach-assets/Misconceptions,
 * 1686 wide): the dashboard's stepper row, a title group, three misconception
 * cards, the per-question correct-response tiles and a disclaimer, on the
 * dashboard's cool-white page with its tiled band.
 */

const pillHeight = 50;
const tagRadius = 10;

export const UnderstandPage = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  flexGrow: 1,
  // rev3 PaddingReference: the stepper sits 48 under the header. Shared by
  // every flow page, so the stepper holds its height page to page.
  paddingTop: screenSize === ScreenSize.LARGE ? theme.sizing.space8 : theme.sizing.space6,
  paddingBottom: theme.sizing.space12,
  paddingLeft: pageGutter(theme, screenSize),
  paddingRight: pageGutter(theme, screenSize),
  boxSizing: 'border-box',
  ...patternPageBackground(theme, screenSize),
}));

/*
 * The page column (Figma: 280..1406, the in-app 1128 column) of Review and
 * Select Activity. 32 between sections, as ActivityFlowColumn: DevQA
 * SelectingMisconceptions puts the title 155 under the header, which with
 * the 73-tall circle track leaves ~32 under it, and the Misconception
 * selected bar then sits the same distance from the stepper on every page.
 */
export const UnderstandColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space6,
  width: '100%',
  maxWidth: theme.sizing.appContentMaxWidth,
}));

/*
 * /review below the stepper (rev3 PaddingReference): the title and cards
 * (ReviewIntro, ~56 apart) over the correct-responses section and the AI
 * disclaimer (ReviewFooter, 16 apart), the two groups 74 apart (DevQA
 * SelectingMisconceptions: card edge to the heading's line box; between
 * space11 and space12 with neither close).
 * Grouped so each gap has one owner; UnderstandColumn's gap still spaces the
 * stepper from all of it.
 */
const reviewGroupGap = 74;

export const ReviewBody = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: screenSize === ScreenSize.LARGE ? reviewGroupGap : theme.sizing.space8,
}));

export const ReviewIntro = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: screenSize === ScreenSize.LARGE ? theme.sizing.space10 : theme.sizing.space8,
}));

export const ReviewFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space3,
}));

/** Title + works pill over the subtitle; the banner floats over it. */
export const TitleGroup = styled(Box)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
});

export const TitleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.sizing.space3,
}));

// Figma: 225x31 rx 9.5 on a selectedNavy hairline, Rubik 16.
export const WorksPill = styled(Typography)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 31,
  padding: `0 ${theme.sizing.space2}px`,
  borderRadius: 9.5,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.foreground.selectedNavy}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.rubikBody,
  boxSizing: 'border-box',
}));

// rev2 Misconceptions: "View Mix It Up" beside the works pill — a document
// icon and Rubik 16/600 in brightBlue, opening the MIU PDF in a new tab.
export const ViewMiuLink = styled(Link)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.sizing.space1,
  color: theme.palette.designSystem.foreground.brightBlue,
  ...theme.typography.rubikBody,
  fontWeight: 600,
  textDecoration: 'none',
  '&:hover, &:focus-visible': { textDecoration: 'underline' },
}));

// Figma (SelectingMisconceptions3): a one-time overlay across the title, so it
// takes no space. Its top sits ~19 above the title's.
export const BannerOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -theme.sizing.space4,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  zIndex: 2,
  pointerEvents: 'none',
  '& > *': { pointerEvents: 'auto' },
}));

// Figma (SelectingMisconceptions3): 829x59 rx20, text 20 in from either end.
export const ResultsBannerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space3,
  maxWidth: '100%',
  minHeight: 59,
  padding: `0 ${theme.sizing.space4}px`,
  borderRadius: theme.sizing.space4,
  boxSizing: 'border-box',
  backgroundColor: theme.palette.designSystem.status.lightGreen,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.status.success}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.rubikBodyBold,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
}));

/*
 * At LARGE the cards sit side by side and share their rows (CSS subgrid):
 * badge, title, student count, evidence, explanation, buttons. Each section
 * then starts at the same height on every card, whatever the length of the
 * text above it, and the buttons share the bottom row. Stacked below LARGE,
 * each card is its own column.
 */
export const MISCONCEPTION_CARD_ROWS = 6;

interface AlignedProps {
  isAligned: boolean;
}
const noAligned = (prop: PropertyKey) => prop !== 'isAligned';

/** Figma: three 366-wide cards ~14 apart at LARGE (one grid the cards share rows of), stacked below. */
export const CardRow = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) =>
  screenSize === ScreenSize.LARGE
    ? {
        display: 'grid',
        gridTemplateRows: `repeat(${MISCONCEPTION_CARD_ROWS}, auto)`,
        gridAutoFlow: 'column',
        gridAutoColumns: 'minmax(0, 1fr)',
        columnGap: theme.sizing.space3,
        width: '100%',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.sizing.space3,
        width: '100%',
      },
);


// Figma: 366x544 rx 32, white with the dashboard card's soft shadow.
export const MisconceptionCardSurface = styled(Box, {
  shouldForwardProp: noAligned,
})<AlignedProps>(({ theme, isAligned }) => ({
  ...(isAligned
    ? {
        display: 'grid',
        gridRow: `span ${MISCONCEPTION_CARD_ROWS}`,
        gridTemplateRows: 'subgrid',
        rowGap: theme.sizing.space3,
        alignContent: 'start',
      }
    : { display: 'flex', flexDirection: 'column', gap: theme.sizing.space3 }),
  // rev3 PaddingReference: ~36 inside; space7 per design call (2026-10-16).
  // DevQA SelectingMisconceptions: 58 under the buttons.
  padding: theme.sizing.space7,
  paddingBottom: theme.sizing.space10,
  borderRadius: theme.sizing.space6,
  backgroundColor: theme.palette.designSystem.surface.white,
  boxShadow: dashboardCardShadow,
  boxSizing: 'border-box',
}));

/** Badge, title and student-count chip (Figma: ~6-10 between): three of the card's rows. */
export const CardHeading = styled(Box, {
  shouldForwardProp: noAligned,
})<AlignedProps>(({ theme, isAligned }) =>
  isAligned
    ? {
        display: 'grid',
        gridRow: 'span 3',
        gridTemplateRows: 'subgrid',
        rowGap: theme.sizing.space2,
        justifyItems: 'start',
        alignItems: 'start',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: theme.sizing.space2,
      },
);

export const BadgeRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space1,
}));

interface BadgeProps {
  isFocus: boolean;
}

// Figma: RECOMMENDED FOCUS is 215x36 rx10 brightBlue with white Poppins
// 16/600; ADDITIONAL MISCONCEPTION is 263x37 on a greyAccent hairline.
export const CardBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFocus',
})<BadgeProps>(({ theme, isFocus }) => {
  const palette = theme.palette.designSystem;

  return {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 36,
    // Figma (rev2 Misconceptions, rev3 PaddingReference): text 16 in.
    padding: `0 ${theme.sizing.space3}px`,
    borderRadius: tagRadius,
    backgroundColor: isFocus ? palette.foreground.brightBlue : 'transparent',
    border: isFocus ? 'none' : `${theme.borders.borderWidth}px solid ${palette.foreground.greyAccent}`,
    color: isFocus ? palette.surface.white : palette.surface.atlanticNavy,
    ...theme.typography.headingSm,
    fontWeight: isFocus ? 600 : 400,
    textTransform: 'uppercase',
    boxSizing: 'border-box',
  };
});

// Figma: h30 rx10 skyBlue, Poppins 16/500.
export const PrevalenceTag = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 30,
  padding: `0 ${theme.sizing.space2}px`,
  borderRadius: tagRadius,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.placeholderLabel,
  cursor: 'default',
}));

/** The student-count chip and, on one card, the Highest frequency tag beside it. */
export const TagRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.sizing.space1,
}));

// Not in Figma yet: the PrevalenceTag shape in the light-green fill and success
// border Profile already pairs, so it reads as a label beside the count.
export const HighestFrequencyTag = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 30,
  padding: `0 ${theme.sizing.space2}px`,
  borderRadius: tagRadius,
  backgroundColor: theme.palette.designSystem.status.lightGreen,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.status.success}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.placeholderLabel,
  cursor: 'default',
  boxSizing: 'border-box',
}));

/** A small caps label over its text (RESPONSE EVIDENCE:, POSSIBLE EXPLANATION:). */
export const LabelledBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
}));

export const BlockLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.smallBodyText,
  color: theme.palette.designSystem.surface.atlanticNavy,
  textTransform: 'uppercase',
}));

// The evidence line opens the details modal, so it is a button styled as text.
export const EvidenceLink = styled('button')(({ theme }) => ({
  all: 'unset',
  cursor: 'pointer',
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.rubikBody,
  '&:hover, &:focus-visible': { textDecoration: 'underline' },
}));

// marginTop auto keeps the buttons along the bottom when a card is stretched to
// its row's tallest (Review's carousel); in the grid they already have their row.
export const CardActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.sizing.space1,
  marginTop: 'auto',
}));

interface CardButtonProps {
  isPrimary?: boolean;
}

// Figma: 149x50 rx25, Rubik 16/500 white — View details on accentBlue,
// Select on navyBlue.
export const CardButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isPrimary',
})<CardButtonProps>(({ theme, isPrimary }) => {
  const palette = theme.palette.designSystem;

  return {
    flex: '1 1 0',
    minWidth: 0,
    minHeight: pillHeight,
    borderRadius: pillHeight / 2,
    backgroundColor: isPrimary ? palette.background.navyBlue : palette.foreground.accentBlue,
    color: palette.surface.white,
    ...theme.typography.buttonLabel,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: isPrimary ? palette.background.navyBlue : palette.foreground.accentBlue,
    },
  };
});

/** "Correct responses across the N Mix It Up questions" and its tiles. */
export const CorrectSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space3,
}));

export const TileRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.sizing.space10,
}));

// Figma: 95x101 rx 14.5, white on a greyAccent hairline; Q#, the percentage
// (Rubik 24), then "Correct" in correctGreen.
export const QuestionTile = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 95,
  minHeight: 101,
  borderRadius: 14.5,
  backgroundColor: theme.palette.designSystem.surface.white,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.foreground.greyAccent}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  boxSizing: 'border-box',
  cursor: 'default',
}));

export const TilePercent = styled(Typography)(({ theme }) => ({
  ...theme.typography.smallTitle,
  fontWeight: 400,
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

export type { ScreenSizeProps };
