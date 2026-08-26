import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

const pillRadius = 18;
const cardRadius = 24;
const chipRadius = 15;
const stepChipRadius = 13;

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
      : `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
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
  backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  color: theme.palette.designSystem.background.offWhite,
  ...theme.typography.headingSm,
}));

export const StepChip = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  padding: `${theme.sizing.space0}px ${theme.sizing.space2}px`,
  borderRadius: stepChipRadius,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  color: theme.palette.designSystem.surface.atlanticNavy,
  fontFamily: "'Rubik', sans-serif",
  fontWeight: 400,
  fontSize: '13px',
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
}));

interface StepRowProps {
  isError?: boolean;
  isCorrect?: boolean;
}

export const StepRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isError' && prop !== 'isCorrect',
})<StepRowProps>(({ theme, isError, isCorrect }) => {
  const palette = theme.palette.designSystem;
  let background = 'transparent';
  if (isError) background = palette.status.error;
  else if (isCorrect) background = palette.status.lightGreen;

  return {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.sizing.space2,
    padding: `${theme.sizing.space0}px ${theme.sizing.space1}px`,
    borderRadius: stepChipRadius,
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

// Shared surface for the panels inside a phase — examples, columns, blocks.
export const ContentPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  padding: theme.sizing.space4,
  borderRadius: theme.sizing.space3,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.surface.atlanticNavy}`,
  boxSizing: 'border-box',
}));

interface TonePanelProps {
  tone?: 'neutral' | 'sky' | 'grey';
}

export const TonedPanel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<TonePanelProps>(({ theme, tone = 'neutral' }) => {
  const palette = theme.palette.designSystem;
  const background = {
    neutral: 'transparent',
    sky: palette.surface.skyBlue,
    grey: palette.foreground.wildSand,
  };

  return {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.sizing.space1,
    padding: theme.sizing.space3,
    borderRadius: theme.sizing.space3,
    backgroundColor: background[tone],
    boxSizing: 'border-box',
  };
});
