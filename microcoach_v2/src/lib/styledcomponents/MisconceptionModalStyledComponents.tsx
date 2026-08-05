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
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
}));

const statChipBase = (theme: import('@mui/material/styles').Theme) => ({
  alignSelf: 'flex-start',
  padding: `${theme.sizing.space0}px ${theme.sizing.space3}px`,
  borderRadius: statChipRadius,
  ...theme.typography.rubikBody,
});

export const SupportStatChip = styled(Box)(({ theme }) => ({
  ...statChipBase(theme),
  backgroundColor: theme.palette.designSystem.status.needsSupport,
  color: theme.palette.designSystem.background.offWhite,
}));

export const UnderstoodStatChip = styled(Box)(({ theme }) => ({
  ...statChipBase(theme),
  backgroundColor: theme.palette.designSystem.status.understood,
  color: theme.palette.designSystem.background.navyBlue,
}));

// Tabs and their panel share one continuous outline, so they live in a single
// flex column with no gap between them.
export const TabGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

export const ModalTabs = styled(Tabs)({
  // The outline carries selection; a sliding indicator would cut across the
  // seam where the selected tab joins the panel.
  '& .MuiTabs-indicator': {
    display: 'none',
  },
});

export const ModalTab = styled(Tab)(({ theme }) => ({
  border: theme.borders.faintNavy,
  borderRadius: `${theme.sizing.space2}px ${theme.sizing.space2}px 0 0`,
  alignItems: 'flex-start',
  textAlign: 'left',
  ...theme.typography.headingMd,
  textTransform: 'none',
  color: theme.palette.designSystem.foreground.fadedAtlanticNavy,
  backgroundColor: theme.palette.designSystem.background.cream,
  '&.Mui-selected': {
    border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
    color: theme.palette.designSystem.surface.atlanticNavy,
    fontWeight: 700,
    // Sit on top of the panel's top border and hide the 1px beneath, so the
    // tab outline reads as continuous with the panel outline.
    backgroundColor: theme.palette.designSystem.surface.white,
    borderBottomColor: 'transparent',
    marginBottom: -theme.borders.borderWidth,
    position: 'relative',
    zIndex: 1,
  },
}));

export const TabPanel = styled(Box)(({ theme }) => ({
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  borderRadius: `0 0 ${theme.sizing.space2}px ${theme.sizing.space2}px`,
  padding: theme.sizing.space3,
  backgroundColor: theme.palette.designSystem.surface.white,
}));

// Figma: 720x186 rx16 sky-blue panel, one per answer option.
export const ErrorBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  padding: theme.sizing.space3,
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
  borderRadius: theme.sizing.space2,
  backgroundColor: theme.palette.designSystem.surface.white,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  color: theme.palette.designSystem.background.navyBlue,
  ...theme.typography.headingMd,
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
    ...theme.typography.microLabel,
    whiteSpace: 'nowrap',
  };
});

export const ModalFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: theme.sizing.space2,
}));
