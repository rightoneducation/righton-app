import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import { ScreenSize } from '../MicroCoachModels';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';
import { dashboardCardShadow } from './DashboardStyledComponents';

/*
 * The activity flow (microcoach-assets/Activities/InflowScreens and
 * SpotTheSlip_BeforeClass, 1692 wide): the stepper and "Misconception
 * selected" bar, the template's name with Change activity, three phase
 * buttons (Before class › Facilitate activity › Closing discussion), the
 * phase's white cards, then Back / Next pills. My Activity and its
 * Change activity dialog share the same card language.
 */

const phaseButtonWidth = 200;
const phaseButtonHeight = 36;
const navPillHeight = 42;
const toggleHeight = 37;
const exportHeight = 35;
const runBadgeSize = 29;
const questionBadgeSize = 30;
const codeChipRadius = 4;

/** The page column. Figma: ~32 between the stepper, the bar and the heading. */
export const ActivityFlowColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space6,
  width: '100%',
  maxWidth: theme.sizing.appContentMaxWidth,
}));

/** Heading, phase buttons, the phase's cards and the Back / Next row. */
export const ActivityFlowBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space5,
}));

/** Name + Change activity over the routine (Figma: nearly touching). */
export const TemplateHeading = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space0,
}));

// Change Activity is centred on the name (Before Class, My Activity frames).
export const TemplateNameRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  columnGap: theme.sizing.space5,
  rowGap: theme.sizing.space0,
}));

// Figma: Rubik 15/600 atlanticNavy, text only; always underlined so it reads
// as a link (dev QA 2026-10-27).
export const ChangeActivityLink = styled(ButtonBase)(({ theme }) => ({
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.buttonLabelSm,
  fontSize: 15,
  fontWeight: 600,
  borderRadius: codeChipRadius,
  textDecoration: 'underline',
}));

export const PhaseNav = styled('nav')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.sizing.space4,
}));

interface ActiveProps {
  isActive: boolean;
}

// Rendered as a router link, as Header's pills are.
type RouterExtras = { component?: React.ElementType; to?: string };

// Figma: 200x36 rx8, Rubik 14/500 offWhite; the current phase atlanticNavy,
// the others accentBlue.
export const PhaseButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<ActiveProps & RouterExtras>(({ theme, isActive }) => ({
  gap: theme.sizing.space1,
  width: phaseButtonWidth,
  maxWidth: '100%',
  height: phaseButtonHeight,
  borderRadius: theme.sizing.space1,
  backgroundColor: isActive
    ? theme.palette.designSystem.surface.atlanticNavy
    : theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.background.offWhite,
  ...theme.typography.buttonLabelSm,
  '& svg': { fontSize: 16 },
  '&:hover, &.Mui-focusVisible': {
    backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  },
}));

/** The phase's cards (Figma: 20 apart). */
export const PhaseCards = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space4,
}));

// Figma: 1130 wide rx12 white, 25 in, with the dashboard card's soft shadow.
export const FlowCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space4,
  padding: theme.sizing.space5,
  borderRadius: theme.sizing.space2,
  backgroundColor: theme.palette.designSystem.surface.white,
  boxShadow: dashboardCardShadow,
  color: theme.palette.designSystem.surface.atlanticNavy,
  boxSizing: 'border-box',
}));

export const FlowCardTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space0,
}));

// Every phase card: the duration chip sits 24 after the title, centred on it,
// rather than at the card's far edge (Before Class_SpottheSlipActivity; all
// phases from dev QA 2026-10-28).
export const FlowCardTitleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.sizing.space5,
}));

/* ── Before class ─────────────────────────────────────────────────────── */

// Figma: three lines ~29 apart, each a 20px navy disc then Rubik 16.
export const Checklist = styled('ol')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));

// The step text centres on its disc (dev QA 2026-10-28), as StepRow's does.
export const ChecklistItem = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space2,
  ...theme.typography.rubikBody,
}));

/** The grouping card's title over its sequence (Figma: ~12 apart). */
export const GroupingHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.sizing.space2,
}));

/* ── Facilitate activity ─────────────────────────────────────────────── */

interface RunGridProps extends ScreenSizeProps {
  rows: number;
}

// Figma: two columns at LARGE, filled top to bottom (3 + 2), ~48 apart.
export const RunGrid = styled('ol', {
  shouldForwardProp: (prop) => prop !== 'rows' && noScreenSize(prop),
})<RunGridProps>(({ theme, screenSize, rows }) => {
  const isLarge = screenSize === ScreenSize.LARGE;
  return {
    display: 'grid',
    gridTemplateColumns: isLarge ? '1fr 1fr' : '1fr',
    gridTemplateRows: isLarge ? `repeat(${rows}, auto)` : undefined,
    gridAutoFlow: isLarge ? 'column' : 'row',
    gap: `${theme.sizing.space5}px ${theme.sizing.space8}px`,
    margin: 0,
    padding: 0,
    listStyle: 'none',
  };
});

export const RunStepItem = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.sizing.space2,
}));

// Figma: a 29px atlanticNavy disc, Poppins 14.6/600 offWhite.
export const RunBadge = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: runBadgeSize,
  height: runBadgeSize,
  borderRadius: '50%',
  backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  color: theme.palette.designSystem.background.offWhite,
  ...theme.typography.labelSmBold,
}));

export const RunStepText = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
  minWidth: 0,
}));

export const RunStepTitleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.sizing.space2,
  minHeight: runBadgeSize,
}));

/** Toggle and its note on the left, the export button on the right. */
export const ExamplesToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.sizing.space3,
}));

export const ToggleGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.sizing.space2,
}));

// Figma: 259x37 skyBlue pill holding two 130-wide halves; the chosen half
// is atlanticNavy with white text.
export const ViewPillToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: toggleHeight,
  borderRadius: toggleHeight / 2,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
}));

export const ViewPillOption = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<ActiveProps>(({ theme, isActive }) => ({
  minWidth: 130,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: toggleHeight / 2,
  backgroundColor: isActive
    ? theme.palette.designSystem.surface.atlanticNavy
    : 'transparent',
  color: isActive
    ? theme.palette.designSystem.surface.white
    : theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.rubikBody,
  letterSpacing: '-0.02em',
  '&.Mui-focusVisible': {
    outline: `2px solid ${theme.palette.designSystem.foreground.accentBlue}`,
  },
}));

// Figma: 206x35 rx17.5, #F3F4F6 (wildSand, Δ3) on a greyAccent hairline,
// Rubik 14/500 navyBlue with an upload icon after.
export const ExportButton = styled(Button)(({ theme }) => ({
  height: exportHeight,
  padding: `0 ${theme.sizing.space4}px`,
  borderRadius: exportHeight / 2,
  backgroundColor: theme.palette.designSystem.foreground.wildSand,
  border: theme.borders.subtle,
  color: theme.palette.designSystem.background.navyBlue,
  ...theme.typography.buttonLabelSm,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.foreground.greyAccent,
  },
}));

// Figma: three 338-wide tiles ~15 apart; one column at SMALL.
export const ExampleTiles = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'grid',
  gridTemplateColumns:
    screenSize === ScreenSize.SMALL ? '1fr' : 'repeat(3, minmax(0, 1fr))',
  gap: theme.sizing.space3,
}));

interface SelectedProps {
  isSelected: boolean;
}

// Figma: rx11.5 white on a greyAccent hairline; the selected one skyBlue on
// a 2px accentBlue line. The second pixel is an inset shadow so selecting a
// tile never shifts its content.
export const ExampleTile = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<SelectedProps>(({ theme, isSelected }) => {
  const palette = theme.palette.designSystem;
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    gap: theme.sizing.space1,
    padding: theme.sizing.space3,
    borderRadius: theme.sizing.space2,
    border: `${theme.borders.borderWidth}px solid ${
      isSelected ? palette.foreground.accentBlue : palette.foreground.greyAccent
    }`,
    boxShadow: isSelected ? `inset 0 0 0 1px ${palette.foreground.accentBlue}` : 'none',
    backgroundColor: isSelected ? palette.surface.skyBlue : palette.surface.white,
    color: palette.surface.atlanticNavy,
    textAlign: 'left',
    '&:hover': {
      backgroundColor: palette.surface.skyBlue,
    },
  };
});

// Figma: 305x30 rx8, #D0254D at 30% (errorTint), Rubik 14 with "Slip" bold.
export const SlipChip = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: 30,
  padding: `${theme.sizing.space0}px ${theme.sizing.space2}px`,
  borderRadius: theme.sizing.space1,
  backgroundColor: theme.palette.designSystem.status.errorTint,
  ...theme.typography.smallBodyText,
}));

// Figma: rx11.5 on a greyAccent hairline, 15 in.
export const ExampleDetail = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  padding: theme.sizing.space3,
  borderRadius: theme.sizing.space2,
  border: theme.borders.subtle,
}));

export const ExampleSteps = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
}));

export const PagerRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.sizing.space3,
}));

// Figma: Rubik 16/500 atlanticNavy; Prev greys out (#878787 → mutedGrey, Δ8)
// on the first example.
export const PagerButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  padding: `0 ${theme.sizing.space1}px`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.buttonLabel,
  textTransform: 'none',
  '&.Mui-disabled': {
    color: theme.palette.designSystem.foreground.mutedGrey,
  },
}));

/* ── Math Detective: the open example's header ───────────────────────── */

const exampleIconSize = 52;

// DevQA MathDetective: 1049x75 rx11.5 on a #E0E4EF (greyAccent, Δ6) hairline;
// the icon tile ~12 down and 16 in, the text 12 after it.
export const ExampleHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space2,
  padding: `${theme.sizing.space2}px ${theme.sizing.space3}px`,
  borderRadius: theme.sizing.space2,
  border: theme.borders.subtle,
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

// Figma: a 52px atlanticNavy tile, rx13, holding a white pencil.
export const ExampleIconTile = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: exampleIconSize,
  height: exampleIconSize,
  borderRadius: theme.sizing.space2,
  backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  color: theme.palette.designSystem.surface.white,
}));

export const ExampleHeaderText = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
});

/* ── Make Your Case ───────────────────────────────────────────────────── */

const sectionPillHeight = 40;

// DevQA MakeYourCase_Teacher / _Student: one box rx11.5 on a #E0E4EF
// (greyAccent, Δ6) hairline, the claim section over the examples section.
export const ClaimBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.sizing.space2,
  border: theme.borders.subtle,
  color: theme.palette.designSystem.surface.atlanticNavy,
  overflow: 'hidden',
}));

interface ClaimBoxSectionProps {
  // The sections after the first start on the hairline that splits the box.
  isDivided?: boolean;
}

export const ClaimBoxSection = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDivided',
})<ClaimBoxSectionProps>(({ theme, isDivided }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space3,
  padding: theme.sizing.space3,
  ...(isDivided && { borderTop: theme.borders.subtle }),
}));

/** "Claim" over the claim itself, centred (Figma: Rubik 16, Poppins 20/600). */
export const ClaimHeading = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.sizing.space1,
  textAlign: 'center',
}));

/** The A / B / C lines (Figma: ~12 apart). */
export const ClaimOptions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
}));

// Teacher view: the option the mathematics supports, with its Why?, on
// #ECFFE3 (lightGreen) rx16. The band reaches 4 past the text so the option
// stays level with the others.
export const ClaimAnswerBand = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.sizing.space0,
  margin: `0 -${theme.sizing.space0}px`,
  borderRadius: theme.sizing.space3,
  backgroundColor: theme.palette.designSystem.status.lightGreen,
}));

// Figma: navyBlue h40 rx16, Poppins 16/600 offWhite, 12 in. (The student
// frame's second pill is #1B2A6B; treated as a slip, both are navyBlue.)
export const SectionPill = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  minHeight: sectionPillHeight,
  padding: `0 ${theme.sizing.space2}px`,
  borderRadius: theme.sizing.space3,
  backgroundColor: theme.palette.designSystem.background.navyBlue,
  color: theme.palette.designSystem.background.offWhite,
  ...theme.typography.headingSm,
}));

/** Teacher view: each example to bring in (Figma: ~20 apart). */
export const BringInList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space4,
}));

// The prompt sits 24 in from its answer.
export const BringInItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  '& > :first-of-type': { paddingLeft: theme.sizing.space5 },
}));

// Student view: Steps to follow | Examples to try, split by a hairline;
// stacked below LARGE.
export const StudentColumns = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => {
  const isLarge = screenSize === ScreenSize.LARGE;
  return {
    display: 'flex',
    flexDirection: isLarge ? 'row' : 'column',
    gap: theme.sizing.space6,
    '& > *': { flex: '1 1 0', minWidth: 0 },
    '& > * + *': isLarge
      ? { borderLeft: theme.borders.subtle, paddingLeft: theme.sizing.space6 }
      : { borderTop: theme.borders.subtle, paddingTop: theme.sizing.space3 },
  };
});

/** A pill over its numbered list (Figma: 16 apart). */
export const StudentColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space3,
}));

export const StudentList = styled('ol')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));

// Figma: a 20px navy disc, the text 12 after it.
export const StudentListItem = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space2,
}));

/* ── Closing discussion ───────────────────────────────────────────────── */

// Figma: three questions across, a full-width rule, then their answers.
export const QuestionGrid = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'grid',
  gridTemplateColumns:
    screenSize === ScreenSize.LARGE ? 'repeat(3, minmax(0, 1fr))' : '1fr',
  gap: `${theme.sizing.space4}px ${theme.sizing.space8}px`,
}));

export const QuestionCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.sizing.space4,
}));

// Figma: a 30px atlanticNavy disc, bold white numeral.
export const QuestionBadge = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: questionBadgeSize,
  height: questionBadgeSize,
  borderRadius: '50%',
  backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.stepLabel,
}));

// Figma: #C9D4E4 → periwinkle (Δ6), across every column.
export const QuestionRule = styled('hr')(({ theme }) => ({
  gridColumn: '1 / -1',
  width: '100%',
  margin: 0,
  border: 'none',
  borderTop: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.foreground.periwinkle}`,
}));

export const AnswerCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
}));

// Figma: three 358-wide cards ~28 apart, top-aligned so opening one card's
// Try asking grows only that card. Stacked below LARGE.
export const WatchForRow = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
  alignItems: screenSize === ScreenSize.LARGE ? 'flex-start' : 'stretch',
  gap: theme.sizing.space5,
  '& > *': { flex: '1 1 0', minWidth: 0 },
}));

// The Watch for text, as tall as the longest card's (dev QA 2026-10-27): every
// card's text sits in the one grid cell, only its own visible, so shorter text
// leaves a gap and Try asking starts level on every card. Only the text is
// shared — opening Try asking still grows just that card.
export const WatchForTextStack = styled(Box)({
  display: 'grid',
  '& > *': { gridArea: '1 / 1' },
});

// A stacked copy of another card's text: holds the height, unseen and unread.
export const WatchForTextSpacer = styled(Box)({
  visibility: 'hidden',
});

// Figma: #F3F4F6 (wildSand) on a 2px #C1D1E1 (periwinkle, Δ2) line, rx8.
export const TryAskingBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.sizing.space1,
  border: `2px solid ${theme.palette.designSystem.foreground.periwinkle}`,
  backgroundColor: theme.palette.designSystem.foreground.wildSand,
  overflow: 'hidden',
}));

export const TryAskingToggle = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  minHeight: 30,
  padding: `${theme.sizing.space1}px ${theme.sizing.space2}px`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.headingSm,
  textAlign: 'left',
}));

export const TryAskingDetail = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space5,
  padding: `0 ${theme.sizing.space2}px ${theme.sizing.space3}px`,
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

export const TryAskingBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
}));

// Figma: #E5F0F5 → fadedLightBlue (Δ2), rx12, 22 in.
export const TakeawayBand = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
  padding: theme.sizing.space5,
  borderRadius: theme.sizing.space2,
  backgroundColor: theme.palette.designSystem.foreground.fadedLightBlue,
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

/* ── Back / Next ──────────────────────────────────────────────────────── */

export const FlowNavRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.sizing.space3,
}));

interface NavPillProps {
  isPrimary?: boolean;
}

// Figma: h42 rx21, Rubik 16/500; Back on accentBlue, Next on navyBlue.
export const NavPill = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isPrimary',
})<NavPillProps>(({ theme, isPrimary }) => ({
  height: navPillHeight,
  padding: `0 ${theme.sizing.space4}px`,
  borderRadius: navPillHeight / 2,
  backgroundColor: isPrimary
    ? theme.palette.designSystem.background.navyBlue
    : theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.buttonLabel,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '& .MuiButton-startIcon, & .MuiButton-endIcon': { margin: 0 },
  gap: theme.sizing.space2,
  '&:hover': {
    backgroundColor: isPrimary
      ? theme.palette.designSystem.background.navyBlue
      : theme.palette.designSystem.foreground.accentBlue,
  },
}));

/* ── My Activity ──────────────────────────────────────────────────────── */

/** Title over the intro (Figma: nearly touching). */
// The heading over the saved activity (InflowScreens/MyActivity: ~59 from
// the intro to the card).
export const MyActivityBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space10,
}));

export const MyActivityHeading = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space0,
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

export const MyActivityList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space5,
}));

// Figma: 1130x310 rx32 white, 25 in, soft shadow.
export const MyActivityCardSurface = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space5,
  padding: theme.sizing.space5,
  borderRadius: theme.sizing.sectionRadius,
  backgroundColor: theme.palette.designSystem.surface.white,
  boxShadow: dashboardCardShadow,
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

// Figma: 1080x96 rx12 skyBlue, 18 in.
export const MisconceptionBand = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
  padding: theme.sizing.space3,
  borderRadius: theme.sizing.space2,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
}));

export const MisconceptionBandHead = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.sizing.space3,
}));

// Figma: 93x27 rx4 atlanticNavy, Poppins 12 bold offWhite.
export const CodeChip = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 27,
  padding: `0 ${theme.sizing.space1}px`,
  borderRadius: codeChipRadius,
  backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  color: theme.palette.designSystem.background.offWhite,
  ...theme.typography.xsLabel,
  fontSize: 12,
  fontWeight: 700,
  whiteSpace: 'nowrap',
}));

export const MyActivityActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.sizing.space4,
}));

/* ── Change activity dialog ───────────────────────────────────────────── */

// Figma: 800 wide, the navy title bar, then the question centred ~32 in.
export const ConfirmBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.sizing.space7,
  padding: `${theme.sizing.space7}px ${theme.sizing.space6}px ${theme.sizing.space5}px`,
  textAlign: 'center',
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

export const ConfirmText = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.sizing.space3,
}));

export const ConfirmActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: theme.sizing.space12,
  rowGap: theme.sizing.space3,
}));

export type { ScreenSizeProps };
