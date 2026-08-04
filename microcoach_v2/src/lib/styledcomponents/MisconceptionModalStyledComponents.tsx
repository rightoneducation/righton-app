import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

export const MODAL_MAX_WIDTH = 800;

const statChipRadius = 19;
const blockRadius = 16;
const namePillRadius = 12;
const codePillRadius = 18;

export const ModalHeaderBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  minHeight: theme.sizing.space11,
  paddingLeft: theme.sizing.space5,
  paddingRight: theme.sizing.space5,
  backgroundColor: theme.palette.designSystem.background.navyBlue,
}));

// Distance from the top of the viewport to the top of the modal.
export const MODAL_TOP_OFFSET = 94;

export const ModalBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space4,
  padding: theme.sizing.space5,
  overflowY: 'auto',
}));

const statChipBase = (theme: import('@mui/material/styles').Theme) => ({
  alignSelf: 'flex-start',
  padding: `${theme.sizing.space0}px ${theme.sizing.space4}px`,
  borderRadius: statChipRadius,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.placeholderLabel,
});

export const SupportStatChip = styled(Box)(({ theme }) => ({
  ...statChipBase(theme),
  backgroundColor: theme.palette.designSystem.status.needsSupport,
}));

export const UnderstoodStatChip = styled(Box)(({ theme }) => ({
  ...statChipBase(theme),
  backgroundColor: theme.palette.designSystem.status.understood,
}));

export const ModalTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.designSystem.background.navyBlue,
  },
}));

export const ModalTab = styled(Tab)(({ theme }) => ({
  border: theme.borders.subtle,
  borderRadius: `${theme.sizing.space2}px ${theme.sizing.space2}px 0 0`,
  ...theme.typography.mediumLabel,
  textTransform: 'none',
  color: theme.palette.designSystem.surface.ashyGray,
  '&.Mui-selected': {
    border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
    color: theme.palette.designSystem.surface.atlanticNavy,
    fontWeight: 700,
  },
}));

// Figma: 720x186 rx16 sky-blue panel, one per answer option.
export const ErrorBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  padding: theme.sizing.space4,
  borderRadius: blockRadius,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
}));

export const OptionLetterBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: theme.sizing.space7,
  height: theme.sizing.space7,
  borderRadius: '50%',
  backgroundColor: theme.palette.designSystem.surface.white,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.mediumLabel,
}));

export const ErrorTagChip = styled(Box)(({ theme }) => ({
  alignSelf: 'flex-start',
  padding: `${theme.sizing.space0}px ${theme.sizing.space2}px`,
  borderRadius: namePillRadius,
  backgroundColor: theme.palette.designSystem.surface.white,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.xsLabel,
  whiteSpace: 'nowrap',
}));

interface NamePillProps {
  tone: 'support' | 'understood';
}

export const StudentNamePill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<NamePillProps>(({ theme, tone }) => ({
  padding: `${theme.sizing.space0}px ${theme.sizing.space2}px`,
  borderRadius: namePillRadius,
  backgroundColor:
    tone === 'support'
      ? theme.palette.designSystem.status.needsSupport
      : theme.palette.designSystem.status.understood,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.xsLabel,
  whiteSpace: 'nowrap',
}));

export const NamePillGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.sizing.space1,
}));

type SkillTone = 'focus' | 'prerequisite' | 'upcoming';

interface SkillBlockProps {
  tone: SkillTone;
}

// Figma fills: focus is solid sky blue; prerequisite is the needs-support
// salmon at 20%; upcoming is the accent blue at 40%.
export const SkillBlock = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<SkillBlockProps>(({ theme, tone }) => {
  const background = {
    focus: theme.palette.designSystem.surface.skyBlue,
    prerequisite: alpha(theme.palette.designSystem.status.needsSupport, 0.2),
    upcoming: alpha(theme.palette.designSystem.foreground.accentBlue, 0.4),
  };

  return {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.sizing.space2,
    padding: theme.sizing.space4,
    borderRadius: blockRadius,
    backgroundColor: background[tone],
  };
});

export const SkillCodePill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<SkillBlockProps>(({ theme, tone }) => {
  const background = {
    focus: theme.palette.designSystem.surface.atlanticNavy,
    prerequisite: theme.palette.designSystem.status.prerequisite,
    upcoming: 'transparent',
  };

  return {
    flexShrink: 0,
    alignSelf: 'flex-start',
    padding: `${theme.sizing.space0}px ${theme.sizing.space2}px`,
    borderRadius: codePillRadius,
    backgroundColor: background[tone],
    border:
      tone === 'upcoming'
        ? `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.surface.atlanticNavy}`
        : 'none',
    color:
      tone === 'upcoming'
        ? theme.palette.designSystem.surface.atlanticNavy
        : theme.palette.designSystem.surface.white,
    ...theme.typography.xsLabel,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  };
});

export const ModalFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: theme.sizing.space2,
}));
