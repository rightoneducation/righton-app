import { styled, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

const pillRadius = 18;
const cardRadius = 24;
const chipRadius = 15;
// Figma: the "Step N" pill is 66 x 29. Both the chip's radius and the step
// row's are derived from the height, so the pair stays a true pill.
const stepChipWidth = 66;
const stepChipHeight = 29;
// Figma: the board-prompt icon tile, 52 square with a 13.2 radius.
const promptTileSize = 52;
const promptTileRadius = 13;
const verdictChipHeight = 26;
// Figma: the compare columns' A/B badge.
const columnBadgeSize = 40;
const columnBadgeRadius = 16;

interface ActiveProps {
  isActive: boolean;
}

export const PhaseTabBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.sizing.space2,
  width: '100%',
}));

export const PhaseTab = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<ActiveProps>(({ theme, isActive }) => ({
  minWidth: 200,
  height: 36,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: pillRadius,
  backgroundColor: isActive
    ? theme.palette.designSystem.surface.atlanticNavy
    : theme.palette.designSystem.foreground.accentBlue,
  color: isActive
    ? theme.palette.designSystem.surface.white
    : theme.palette.designSystem.background.offWhite,
  ...theme.typography.buttonLabelSm,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  },
}));

export const PhaseTabSeparator = styled(Box)(({ theme }) => ({
  ...theme.typography.rubikBody,
  fontWeight: 600,
  color: theme.palette.designSystem.surface.atlanticNavy,
  userSelect: 'none',
}));

// Figma: 1126x506 rx24, white on a navy hairline, 24 inset.
export const PhaseCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space4,
  width: '100%',
  padding: theme.sizing.space5,
  borderRadius: cardRadius,
  backgroundColor: theme.palette.designSystem.surface.white,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.surface.atlanticNavy}`,
  boxSizing: 'border-box',
}));

export const PhaseFooterBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.sizing.space2,
  width: '100%',
  marginTop: 'auto',
  paddingTop: theme.sizing.space4,
}));

export type FooterTone = 'quiet' | 'solid';

interface FooterActionProps {
  tone: FooterTone;
}

export const PhaseFooterAction = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<FooterActionProps>(({ theme, tone }) => ({
  minWidth: tone === 'solid' ? 240 : 200,
  height: 36,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: pillRadius,
  backgroundColor:
    tone === 'solid'
      ? theme.palette.designSystem.background.navyBlue
      : theme.palette.designSystem.surface.skyBlue,
  border:
    tone === 'solid'
      ? 'none'
      : // Every activity frame outlines the quiet actions at 50%, not full.
        `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.foreground.fadedDeepNavy}`,
  color:
    tone === 'solid'
      ? theme.palette.designSystem.surface.white
      : theme.palette.designSystem.background.navyBlue,
  ...theme.typography.buttonLabelSmLight,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor:
      tone === 'solid'
        ? theme.palette.designSystem.surface.atlanticNavy
        : theme.palette.designSystem.foreground.lightBlue,
  },
}));

export const NumberBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: theme.sizing.space6,
  height: theme.sizing.space6,
  borderRadius: '50%',
  backgroundColor: theme.palette.designSystem.background.navyBlue,
  color: theme.palette.designSystem.background.offWhite,
  ...theme.typography.headingSm,
}));

// Figma: 66 x 29 with a 14.5 radius — a true pill, so the radius tracks the
// asserted height rather than being a separate number. Height is asserted the
// way the other pill controls in the app are (ClassChip, WeekSelect): the row
// rhythm depends on it, so it can't be left to fall out of the type scale.
export const StepChip = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  minWidth: stepChipWidth,
  height: stepChipHeight,
  padding: `0 ${theme.sizing.space2}px`,
  borderRadius: stepChipHeight / 2,
  backgroundColor: theme.palette.designSystem.foreground.wildSand,
  border: theme.borders.subtle,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.stepChipLabel,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
}));

// Figma: 40 square, radius 16, sitting behind the column letter. The fill is
// the whole signal — the teacher frame tints it by correctness, the student
// frame draws no fill at all so the answer is not given away.
export const ColumnBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCorrect' && prop !== 'isRevealed',
})<{ isCorrect: boolean; isRevealed: boolean }>(({
  theme,
  isCorrect,
  isRevealed,
}) => {
  const palette = theme.palette.designSystem;
  let background = 'transparent';
  if (isRevealed) {
    background = isCorrect
      ? palette.status.lightGreen
      : palette.status.errorTint;
  }

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: columnBadgeSize,
    height: columnBadgeSize,
    borderRadius: columnBadgeRadius,
    backgroundColor: background,
    color: palette.background.navyBlue,
    ...theme.typography.headingMd,
  };
});

// The Table representation card. A real <table> rather than stacked rows, so
// it announces as tabular data; the rule colour is the light `subtle` border
// rather than the card's navy, which would fight the panel outline.
export const RepTable = styled('table')({
  borderCollapse: 'collapse',
  width: '100%',
});

const repCell = (theme: Theme) => ({
  border: theme.borders.subtle,
  padding: `${theme.sizing.space2}px ${theme.sizing.space3}px`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  textAlign: 'center' as const,
});

export const RepHeadCell = styled('th')(({ theme }) => ({
  ...repCell(theme),
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  ...theme.typography.rubikSubBold,
}));

export const RepBodyCell = styled('td')(({ theme }) => ({
  ...repCell(theme),
  ...theme.typography.rubikBody,
}));

export type OutcomeTone = 'correct' | 'wrong' | 'match' | 'noMatch';

interface VerdictProps {
  tone: OutcomeTone;
}

// Figma: 26 tall, rx 13 — a pill whose fill is the whole signal. The wrong
// side uses the same errorTint the error row does, so a column and its steps
// read as one colour.
export const VerdictChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<VerdictProps>(({ theme, tone }) => {
  const palette = theme.palette.designSystem;
  const fills: Record<OutcomeTone, string> = {
    correct: palette.status.lightGreen,
    wrong: palette.status.errorTint,
    match: palette.status.success,
    noMatch: palette.foreground.accentBlue,
  };
  // The compare columns tint a pale chip and keep navy text; the
  // representation cards fill solid and reverse out.
  const isSolid = tone === 'match' || tone === 'noMatch';

  return {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    height: verdictChipHeight,
    padding: `0 ${theme.sizing.space2}px`,
    borderRadius: verdictChipHeight / 2,
    backgroundColor: fills[tone],
    color: isSolid ? palette.background.offWhite : palette.surface.atlanticNavy,
    ...theme.typography.smallBodyText,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
  };
});

interface StepRowProps {
  isError?: boolean;
  isCorrect?: boolean;
}

// The highlight runs the full row width, behind the chip as well as the body —
// in Figma it is painted before the chip, which then stacks on top. Radius
// matches the chip so a single-line row reads as one pill; a wrapped row grows
// and keeps the same corner.
export const StepRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isError' && prop !== 'isCorrect',
})<StepRowProps>(({ theme, isError, isCorrect }) => {
  const palette = theme.palette.designSystem;
  let background = 'transparent';
  if (isError) background = palette.status.errorTint;
  else if (isCorrect) background = palette.status.lightGreen;

  return {
    display: 'flex',
    // Figma centres the chip against the body, so a two-line step keeps its
    // chip on the block's mid-line rather than at the first line.
    alignItems: 'center',
    gap: theme.sizing.space0,
    minHeight: stepChipHeight,
    borderRadius: stepChipHeight / 2,
    backgroundColor: background,
  };
});

export const ViewToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space0,
  padding: theme.sizing.space0,
  borderRadius: chipRadius,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
}));

export const ViewToggleOption = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<ActiveProps>(({ theme, isActive }) => ({
  minWidth: 0,
  padding: `${theme.sizing.space0}px ${theme.sizing.space2}px`,
  borderRadius: chipRadius,
  backgroundColor: isActive
    ? theme.palette.designSystem.surface.atlanticNavy
    : 'transparent',
  color: isActive
    ? theme.palette.designSystem.surface.white
    : theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.microLabel,
  letterSpacing: '-0.02em',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: isActive
      ? theme.palette.designSystem.surface.atlanticNavy
      : theme.palette.designSystem.foreground.lightBlue,
  },
}));

// Figma: 52 x 52, rx 13.2, filled with the same vertical ramp the upload
// icons use — the gradient token matches stop for stop, so it is reused
// rather than redeclared. Appears in the board-prompt band of both My
// Favorite No and Math Hospital.
export const PromptIconTile = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: promptTileSize,
  height: promptTileSize,
  borderRadius: promptTileRadius,
  background: theme.palette.designSystem.gradients.uploadIcons,
  color: theme.palette.designSystem.surface.white,
}));

// Shared surface for the panels inside a phase — examples, columns, blocks.
export const ContentPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  // All four frames that carry an inner panel draw it identically: x 306,
  // w 1049, rx 11.5, content inset 15. So the radius and padding are the
  // design system's, not one template's.
  padding: theme.sizing.space3,
  borderRadius: theme.sizing.space2,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.surface.atlanticNavy}`,
  boxSizing: 'border-box',
}));

interface TonePanelProps {
  tone?: 'neutral' | 'sky' | 'grey' | 'greyDeep' | 'periwinkle';
}

export const TonedPanel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<TonePanelProps>(({ theme, tone = 'neutral' }) => {
  const palette = theme.palette.designSystem;
  const background = {
    neutral: 'transparent',
    sky: palette.surface.skyBlue,
    grey: palette.foreground.wildSand,
    // The student-task band sits a step darker than the footnote bands.
    greyDeep: palette.foreground.greyAccent,
    // Math Hospital's expected-answer panel: accentBlue at 30% over white,
    // which lands on the existing periwinkle within a channel or two.
    periwinkle: palette.foreground.periwinkle,
  };

  return {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.sizing.space1,
    padding: theme.sizing.space3,
    // Figma: rx 12 on every band panel (board prompt, footnote, student task).
    borderRadius: theme.sizing.space2,
    backgroundColor: background[tone],
    boxSizing: 'border-box',
  };
});

// The board-prompt band and the closing footnote are the same 1050-wide,
// rx 12 panel in every frame that has them; only the tone differs.
export const PromptBand = styled(TonedPanel)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.sizing.space3,
}));
