import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import landingPagePattern from '../../images/landingPagePattern.svg';

const cardRadius = 24;
const comparisonRadius = 16;

export const ReflectPage = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100%',
  backgroundImage: `url(${landingPagePattern}), url(${landingPagePattern})`,
  backgroundPosition: 'left 58%, right 58%',
  backgroundRepeat: 'no-repeat, no-repeat',
  backgroundSize: '313px 236px, 313px 236px',
  backgroundColor: theme.palette.designSystem.background.offWhite,
}));

export const ReflectContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space5,
  position: 'relative',
  zIndex: 1,
}));

export const ReflectionCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space5,
  width: '100%',
  padding: theme.sizing.space5,
  borderRadius: cardRadius,
  backgroundColor: theme.palette.designSystem.surface.white,
  boxShadow: '0 12px 28px rgba(27, 52, 103, 0.12)',
  boxSizing: 'border-box',
}));

export const ActivityContext = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
  padding: theme.sizing.space3,
  borderRadius: comparisonRadius,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
}));

export const ActivityContextRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.sizing.space2,
}));

export const ReflectionResults = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isLarge',
})<{ isLarge: boolean }>(({ theme, isLarge }) => ({
  display: 'flex',
  flexDirection: isLarge ? 'row' : 'column',
  alignItems: isLarge ? 'center' : 'flex-start',
  justifyContent: 'space-between',
  gap: theme.sizing.space4,
}));

export const ScoreGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
}));

export const ScoreRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.sizing.space2,
}));

export const ScoreChange = styled(Box)(({ theme }) => ({
  padding: `${theme.sizing.space1}px ${theme.sizing.space2}px`,
  borderRadius: comparisonRadius,
  backgroundColor: theme.palette.designSystem.status.lightGreen,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.rubikSubBold,
}));

export const ReflectDetailsButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start',
  minWidth: 148,
  height: 36,
  padding: `0 ${theme.sizing.space4}px`,
  borderRadius: 18,
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
  gap: theme.sizing.space5,
  padding: theme.sizing.space5,
  overflowY: 'auto',
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
}));

export const ComparisonGrid = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isLarge',
})<{ isLarge: boolean }>(({ theme, isLarge }) => ({
  display: 'grid',
  gridTemplateColumns: isLarge ? 'repeat(2, minmax(0, 1fr))' : '1fr',
  gap: theme.sizing.space3,
}));

export const ComparisonBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
  padding: theme.sizing.space4,
  borderRadius: comparisonRadius,
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
}));
