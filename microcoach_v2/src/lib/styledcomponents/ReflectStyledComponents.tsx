import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import landingPagePattern from '../../images/landingPagePattern.svg';
import { ScreenSize } from '../MicroCoachModels';

export const ReflectPage = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100%',
  backgroundImage: `url(${landingPagePattern}), url(${landingPagePattern})`,
  backgroundPosition: 'left 58%, right 58%',
  backgroundRepeat: 'no-repeat, no-repeat',
  backgroundSize: '313px 236px, 313px 236px',
  backgroundColor: theme.palette.designSystem.background.offWhite,
}));

export const ReflectPageContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space5}px`,
  position: 'relative',
  zIndex: 1,
}));

export const ReflectHeading = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space1}px`,
}));

export const ReflectResultsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space12}px`,
}));

export const ReflectionCardList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space6}px`,
}));

export const ReflectionCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space5}px`,
  width: '100%',
  padding: `${theme.sizing.space5}px`,
  borderRadius: `${theme.sizing.sectionRadius}px`,
  backgroundColor: theme.palette.designSystem.surface.white,
  boxSizing: 'border-box',
}));

export const ReflectionCardHeading = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space1}px`,
}));

export const ActivityContext = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space2}px`,
  padding: `${theme.sizing.space3}px`,
  borderRadius: `${theme.sizing.space2}px`,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
}));

export const ActivityContextRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: `${theme.sizing.space2}px`,
}));

export const ReflectSkillCodeChip = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  alignSelf: 'flex-start',
  padding: `${theme.sizing.space0}px ${theme.sizing.space1}px`,
  borderRadius: `${theme.sizing.space0}px`,
  backgroundColor: theme.palette.designSystem.background.navyBlue,
  color: theme.palette.designSystem.background.offWhite,
  ...theme.typography.outcomeLabel,
  whiteSpace: 'nowrap',
}));

export const ReflectionResults = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: `${theme.sizing.space4}px`,
}));

export const ScoreGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space1}px`,
}));

export const ScoreRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: `${theme.sizing.space2}px`,
}));

export const ScoreChange = styled(Box)(({ theme }) => ({
  padding: `${theme.sizing.space2}px ${theme.sizing.space3}px`,
  borderRadius: `${theme.sizing.space0}px`,
  backgroundColor: theme.palette.designSystem.status.reflectionImprovementTint,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.rubikSubBold,
}));

export const ReflectDetailsButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start',
  padding: `${theme.sizing.space1}px ${theme.sizing.space7}px`,
  borderRadius: `${theme.sizing.space4}px`,
  backgroundColor: theme.palette.designSystem.background.navyBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.buttonLabelSm,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.designSystem.surface.atlanticNavy,
  },
}));

export const ReflectModalBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space5}px`,
  padding: `${theme.sizing.space5}px`,
  overflowY: 'auto',
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
}));

export const ComparisonRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize }>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.LARGE ? 'row' : 'column',
  gap: `${theme.sizing.space3}px`,
}));

export const ComparisonBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: '1 1 0',
  flexDirection: 'column',
  gap: `${theme.sizing.space1}px`,
  padding: `${theme.sizing.space4}px`,
  borderRadius: `${theme.sizing.space3}px`,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
}));
