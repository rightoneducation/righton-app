import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { ScreenSize } from '../MicroCoachModels';

const rowRadius = 16;
const chipRadius = 13;
const actionRadius = 18;

export const PlanBackButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start',
  minWidth: 0,
  padding: 0,
  backgroundColor: 'transparent',
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.buttonLabel,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'transparent',
    textDecoration: 'underline',
  },
}));

export const ChangeActivityButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-end',
  minWidth: 151,
  height: 36,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: actionRadius,
  backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.buttonLabelSmLight,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.background.navyBlue,
  },
}));

interface PlanRowProps {
  isCompleted?: boolean;
}

export const PlanRow = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isCompleted',
})<PlanRowProps>(({ theme, isCompleted }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  width: '100%',
  padding: theme.sizing.space5,
  borderRadius: rowRadius,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.surface.atlanticNavy}`,
  backgroundColor: isCompleted
    ? theme.palette.designSystem.surface.neutralGray
    : theme.palette.designSystem.surface.white,
  boxSizing: 'border-box',
}));

// Completed rows sit inside a grey backing panel — the "done" treatment.
export const CompletedPanel = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  width: '100%',
  padding: theme.sizing.space2,
  borderRadius: rowRadius,
  backgroundColor: theme.palette.designSystem.surface.neutralGray,
  boxSizing: 'border-box',
}));

export const PlanMetaChip = styled(Box)(({ theme }) => ({
  padding: `${theme.sizing.space0}px ${theme.sizing.space2}px`,
  borderRadius: chipRadius,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.xsLabel,
  whiteSpace: 'nowrap',
}));

export const PlanMetaSeparator = styled(Box)(({ theme }) => ({
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.xsLabel,
  fontSize: '15px',
  userSelect: 'none',
}));

export const SkillCodePill = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  padding: `${theme.sizing.space0}px ${theme.sizing.space2}px`,
  borderRadius: chipRadius,
  backgroundColor: theme.palette.designSystem.foreground.accentBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.smallBodyText,
  whiteSpace: 'nowrap',
}));

export type RowActionTone = 'quiet' | 'solid';

interface RowActionProps {
  tone: RowActionTone;
}

export const RowAction = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<RowActionProps>(({ theme, tone }) => ({
  height: 36,
  padding: `0 ${theme.sizing.space3}px`,
  borderRadius: actionRadius,
  backgroundColor:
    tone === 'solid'
      ? theme.palette.designSystem.surface.atlanticNavy
      : theme.palette.designSystem.surface.skyBlue,
  color:
    tone === 'solid'
      ? theme.palette.designSystem.surface.white
      : theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.buttonLabelSmLight,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor:
      tone === 'solid'
        ? theme.palette.designSystem.background.navyBlue
        : theme.palette.designSystem.foreground.lightBlue,
  },
}));

export const RowActionBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.sizing.space2,
  width: '100%',
}));

/**
 * The upload prompt closing My Plan. Figma: 1126x328 rx 32 in sky blue — the
 * full content column, so it reads as the page's next action rather than
 * another item in the list.
 */
export const UploadPromptCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.sizing.space4,
  width: '100%',
  padding: theme.sizing.space6,
  borderRadius: 32,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  boxSizing: 'border-box',
}));

/** The three stat columns above the prompt; they stack below LARGE. */
export const UploadStatRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize }>(({ theme, screenSize }) => ({
  display: 'grid',
  gridTemplateColumns:
    screenSize === ScreenSize.LARGE ? 'repeat(3, 1fr)' : '1fr',
  gap: theme.sizing.space6,
  width: '100%',
}));
