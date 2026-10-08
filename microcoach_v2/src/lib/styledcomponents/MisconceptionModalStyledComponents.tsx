import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { ScreenSize } from '../MicroCoachModels';
import { noScreenSize, ScreenSizeProps } from './LandingStyledComponents';

/*
 * Misconception Details (microcoach-assets/Misconceptions/modal, 800 wide): a
 * navy title bar, the misconception's badge and title, two tabs, and one
 * sky-blue panel that scrolls on its own so the frame, tabs and footer stay put.
 */

export const MODAL_MAX_WIDTH = 800;
// Figma: the frame is 1118 tall; on shorter screens it fills what is left.
export const MODAL_MAX_HEIGHT = 1118;

// Distance from the top of the viewport to the top of the modal.
export const MODAL_TOP_OFFSET = 94;

const namePillRadius = 12;
const rowRadius = 10;
const chipRadius = 6;
const highlightRadius = 4;

// Figma: 800x61 atlanticNavy-ish (#1B3467) bar, Poppins 24 "Misconception Details".
export const ModalHeaderBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.sizing.space3,
  flexShrink: 0,
  minHeight: 61,
  paddingLeft: theme.sizing.space5,
  paddingRight: theme.sizing.space3,
  backgroundColor: theme.palette.designSystem.background.navyBlue,
}));

/** Everything under the bar; only the tab panel inside it scrolls. */
export const ModalBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space4,
  flex: '1 1 auto',
  minHeight: 0,
  padding: theme.sizing.space5,
}));

/** Badge over title (Figma: 8 apart). */
export const ModalHeading = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.sizing.space1,
}));

// Tabs and their panel share one outline, so they sit in a column with no gap.
export const TabGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  minHeight: 0,
});

export const ModalTabs = styled(Tabs)({
  minHeight: 0,
  // The fill carries selection; an indicator would cut across the seam where
  // the selected tab joins the panel.
  '& .MuiTabs-indicator': {
    display: 'none',
  },
});

// Figma: two 376x40 tabs, rx12 top; the selected one takes the panel's
// sky blue so the two read as one surface.
export const ModalTab = styled(Tab)(({ theme }) => ({
  minHeight: 40,
  padding: `0 ${theme.sizing.space3}px`,
  border: theme.borders.subtle,
  borderRadius: `${theme.sizing.space2}px ${theme.sizing.space2}px 0 0`,
  alignItems: 'flex-start',
  justifyContent: 'center',
  textAlign: 'left',
  ...theme.typography.headingMd,
  textTransform: 'none',
  color: theme.palette.designSystem.surface.atlanticNavy,
  backgroundColor: theme.palette.designSystem.background.offWhite,
  '&.Mui-selected': {
    color: theme.palette.designSystem.surface.atlanticNavy,
    backgroundColor: theme.palette.designSystem.surface.skyBlue,
    borderBottomColor: 'transparent',
    marginBottom: -theme.borders.borderWidth,
    position: 'relative',
    zIndex: 1,
  },
}));

/** The scroll region: header, tabs and footer stay fixed around it. */
export const TabPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space5,
  flex: '1 1 auto',
  minHeight: 0,
  overflowY: 'auto',
  padding: theme.sizing.space3,
  border: theme.borders.subtle,
  borderRadius: `0 0 ${theme.sizing.space3}px ${theme.sizing.space3}px`,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
}));

export const ModalFooter = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  flexShrink: 0,
});

// Figma: 131x36 rx18 atlanticNavy, Open Sans 14/600 white.
export const ModalCtaButton = styled(Button)(({ theme }) => ({
  minHeight: 36,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: 18,
  backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.buttonLabelSm,
  fontWeight: 600,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.background.navyBlue,
  },
}));

/* ── Student Responses ───────────────────────────────────────────────────── */

/** A small caps label over its text (RESPONSE EVIDENCE:, POSSIBLE EXPLANATION:). */
export const LabelledText = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

export const PanelLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.rubikBody,
  color: theme.palette.designSystem.surface.atlanticNavy,
  textTransform: 'uppercase',
}));

// Figma: 719 wide rx16 offWhite card on a greyAccent hairline, 12 in.
export const QuestionCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  padding: theme.sizing.space2,
  borderRadius: theme.sizing.space3,
  backgroundColor: theme.palette.designSystem.background.offWhite,
  border: theme.borders.subtle,
}));

export const QuestionHeading = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: theme.sizing.space2,
  color: theme.palette.designSystem.background.navyBlue,
  ...theme.typography.headingMd,
}));

export const OptionList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space0,
}));

interface OptionUnitProps {
  isFlagged: boolean;
}

// One answer option and, when shown, who chose it. A flagged option (cited as
// evidence on the card) is outlined in needsSupport salmon.
export const OptionUnit = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFlagged',
})<OptionUnitProps>(({ theme, isFlagged }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
  padding: `${theme.sizing.space0}px ${theme.sizing.space1}px`,
  borderRadius: highlightRadius,
  border: isFlagged
    ? `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.status.needsSupport}`
    : theme.borders.transparent,
}));

/** "B. Dashed line, shaded below  Correct answer      30%  Show students ›" */
export const OptionRow = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: screenSize === ScreenSize.LARGE ? 'nowrap' : 'wrap',
  gap: theme.sizing.space2,
  color: theme.palette.designSystem.background.navyBlue,
  ...theme.typography.smallBodyText,
}));

export const OptionText = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  flexWrap: 'wrap',
  columnGap: theme.sizing.space2,
  flex: '1 1 auto',
  minWidth: 0,
}));

interface OptionTagProps {
  tone: 'correct' | 'flagged';
}

export const OptionTag = styled('span', {
  shouldForwardProp: (prop) => prop !== 'tone',
})<OptionTagProps>(({ theme, tone }) => ({
  color:
    tone === 'correct'
      ? theme.palette.designSystem.status.correctGreen
      : theme.palette.designSystem.status.prerequisite,
}));

export const OptionPercent = styled('span')({
  flexShrink: 0,
  minWidth: 40,
  textAlign: 'right',
});

// "Show students ›" — text-only, the chevron turns down when open.
export const ShowStudentsButton = styled(ButtonBase)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.sizing.space0,
  flexShrink: 0,
  minWidth: 128,
  justifyContent: 'space-between',
  padding: `0 ${theme.sizing.space0}px`,
  borderRadius: highlightRadius,
  color: theme.palette.designSystem.background.navyBlue,
  ...theme.typography.smallBodyText,
  '&:hover, &.Mui-focusVisible': { textDecoration: 'underline' },
}));

/* ── Fallback errors list (sessions written before per-option data) ──────── */

// Figma (old frame): rx16 sky-blue panel, one per answer option.
export const ErrorBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  padding: theme.sizing.space3,
  borderRadius: theme.sizing.space3,
  backgroundColor: theme.palette.designSystem.background.offWhite,
  border: theme.borders.subtle,
}));

export const ErrorTagChip = styled(Box)(({ theme }) => ({
  alignSelf: 'flex-start',
  padding: `${theme.sizing.space0}px ${theme.sizing.space2}px`,
  borderRadius: namePillRadius,
  backgroundColor: theme.palette.designSystem.surface.white,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.microLabel,
  whiteSpace: 'nowrap',
}));

/* ── Shared name pills (also used by BeforeClassPhase) ───────────────────── */

interface NamePillProps {
  tone: 'support' | 'understood';
}

export const StudentNamePill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<NamePillProps>(({ theme, tone }) => ({
  padding: `${theme.sizing.space0}px ${theme.sizing.space1}px`,
  borderRadius: namePillRadius,
  backgroundColor:
    tone === 'support'
      ? theme.palette.designSystem.status.needsSupport
      : theme.palette.designSystem.status.understood,
  color:
    tone === 'support'
      ? theme.palette.designSystem.surface.white
      : theme.palette.designSystem.background.navyBlue,
  ...theme.typography.microLabel,
  whiteSpace: 'nowrap',
}));

export const NamePillGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.sizing.space1,
}));

// Figma: h24 rx12 navyBlue chips, cream Rubik 12, 16 apart across, 4 down.
export const ResponderPill = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 24,
  padding: `0 ${theme.sizing.space2}px`,
  borderRadius: namePillRadius,
  backgroundColor: theme.palette.designSystem.background.navyBlue,
  color: theme.palette.designSystem.background.cream,
  ...theme.typography.microLabel,
  whiteSpace: 'nowrap',
}));

export const ResponderGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  rowGap: theme.sizing.space0,
  columnGap: theme.sizing.space3,
}));

/* ── Related Skills ──────────────────────────────────────────────────────── */

// Figma: white rx12 cards, 16 in, the group name over its rows.
export const SkillCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  padding: theme.sizing.space3,
  borderRadius: theme.sizing.space2,
  backgroundColor: theme.palette.designSystem.surface.white,
  minWidth: 0,
}));

/** Prerequisite Gaps beside Upcoming Skills (Figma: 8 apart); stacked below LARGE. */
export const SkillColumns = styled(Box, {
  shouldForwardProp: noScreenSize,
})<ScreenSizeProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
  alignItems: 'flex-start',
  gap: theme.sizing.space1,
  '& > *': { flex: '1 1 0' },
}));

export const SkillRowList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
}));

export type SkillTone = 'focus' | 'prerequisite' | 'upcoming';

interface SkillToneProps {
  tone: SkillTone;
}

// Figma: rx10 rows, 8 in, min 48 tall — atlanticNavy for the focus skill,
// neutral grey for the others.
export const SkillRowSurface = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<SkillToneProps>(({ theme, tone }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
  minHeight: 48,
  padding: theme.sizing.space1,
  borderRadius: rowRadius,
  boxSizing: 'border-box',
  backgroundColor:
    tone === 'focus'
      ? theme.palette.designSystem.surface.atlanticNavy
      : theme.palette.designSystem.surface.neutralGray,
  color:
    tone === 'focus'
      ? theme.palette.designSystem.background.offWhite
      : theme.palette.designSystem.surface.black,
}));

export const SkillRowHead = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space1,
}));

interface SkillCodeChipProps extends SkillToneProps {
  hasInfo: boolean;
}

// Figma: h32 rx6 chip with a 16px ⓘ and the code — white for the focus skill,
// prerequisite orange and navy for the others. Without an ⓘ the code keeps
// the chip's own inset.
export const SkillCodeChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tone' && prop !== 'hasInfo',
})<SkillCodeChipProps>(({ theme, tone, hasInfo }) => {
  const palette = theme.palette.designSystem;
  const background = {
    focus: palette.surface.white,
    prerequisite: palette.status.prerequisite,
    upcoming: palette.background.navyBlue,
  };

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.sizing.space0,
    flexShrink: 0,
    minHeight: 32,
    paddingLeft: hasInfo ? 0 : theme.sizing.space1,
    paddingRight: theme.sizing.space1,
    borderRadius: chipRadius,
    backgroundColor: background[tone],
    color: tone === 'focus' ? palette.background.navyBlue : palette.surface.white,
    ...theme.typography.smallBodyText,
    whiteSpace: 'nowrap',
  };
});

// The name and chevron toggle the row; the chip's ⓘ stays its own button.
export const SkillToggle = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.sizing.space1,
  flex: '1 1 auto',
  minWidth: 0,
  minHeight: 32,
  paddingRight: theme.sizing.space1,
  borderRadius: chipRadius,
  textAlign: 'left',
  color: 'inherit',
  ...theme.typography.smallBodyText,
  '&.Mui-focusVisible': { outline: `2px solid ${theme.palette.designSystem.foreground.brightBlue}` },
}));

/** The expanded description (and, for the focus skill, its components). */
export const SkillDetail = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
  padding: `0 ${theme.sizing.space1}px ${theme.sizing.space0}px`,
  ...theme.typography.smallBodyText,
}));

export const ComponentList = styled('ul')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space0,
  margin: 0,
  paddingLeft: theme.sizing.space4,
}));
