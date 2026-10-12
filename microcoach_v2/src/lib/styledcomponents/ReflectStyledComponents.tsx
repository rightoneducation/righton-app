import { styled, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import landingPagePattern from '../../images/landingPagePattern.svg';
import { ScreenSize } from '../MicroCoachModels';
import { ReflectionTrend } from '../reflectionResults';

const noScreenSize = (prop: PropertyKey) => prop !== 'screenSize';

export const ReflectPage = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100%',
  backgroundImage: `url(${landingPagePattern}), url(${landingPagePattern})`,
  backgroundPosition: 'left 54%, right 54%',
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
  gap: `${theme.sizing.space11}px`,
}));

export const ReflectionCardList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space6}px`,
}));

export const ReflectionCard = styled(Paper, {
  shouldForwardProp: noScreenSize,
})<{ screenSize: ScreenSize }>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space4}px`,
  width: '100%',
  minHeight:
    screenSize === ScreenSize.LARGE
      ? `${theme.sizing.reflectCardMinHeight}px`
      : undefined,
  padding: `${theme.sizing.space4}px`,
  borderRadius: `${theme.sizing.sectionRadius}px`,
  backgroundColor: theme.palette.designSystem.surface.white,
  boxSizing: 'border-box',
}));

export const ReflectionCardTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space5}px`,
}));

export const ReflectionInset = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: `0 ${theme.sizing.space1}px`,
}));

export const ReflectionCardHeading = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space1}px`,
}));

export const ActivityContext = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: `${theme.sizing.space2}px`,
  minHeight: `${theme.sizing.reflectContextMinHeight}px`,
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
  gap: `${theme.sizing.space7}px`,
}));

export const ScoreGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space0}px`,
}));

export const ScoreRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: `${theme.sizing.space6}px`,
}));

export const ScoreValues = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: `${theme.sizing.space2}px`,
}));

interface TrendProps {
  trend: ReflectionTrend;
}

const noTrend = (prop: PropertyKey) => prop !== 'trend';

function trendColor(theme: Theme, trend: ReflectionTrend) {
  if (trend === 'improved') {
    return theme.palette.designSystem.status.reflectionImprovement;
  }
  if (trend === 'declined') {
    return theme.palette.designSystem.status.needsSupport;
  }
  return theme.palette.designSystem.surface.atlanticNavy;
}

function trendBackground(theme: Theme, trend: ReflectionTrend) {
  if (trend === 'improved') {
    return theme.palette.designSystem.status.reflectionImprovementTint;
  }
  if (trend === 'declined') {
    return theme.palette.designSystem.status.reflectionDeclineTint;
  }
  return theme.palette.designSystem.surface.skyBlue;
}

export const ReflectionTrendValue = styled(Typography, {
  shouldForwardProp: noTrend,
})<TrendProps>(({ theme, trend }) => ({
  color: trendColor(theme, trend),
}));

export const ScoreChange = styled(Box, {
  shouldForwardProp: noTrend,
})<TrendProps>(({ theme, trend }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: `${theme.sizing.space1}px`,
  padding: `${theme.sizing.space0}px ${theme.sizing.space1}px`,
  borderRadius: `${theme.sizing.space0}px`,
  backgroundColor: trendBackground(theme, trend),
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.headingLg,
}));

export const MockDataTag = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  padding: `0 ${theme.sizing.space0}px`,
  borderRadius: `${theme.sizing.space0}px`,
  border: theme.borders.faintNavy,
  backgroundColor: theme.palette.designSystem.foreground.wildSand,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.microLabel,
  whiteSpace: 'nowrap',
}));

export const ReflectDetailsButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start',
  minWidth: `${theme.sizing.reflectDetailsButtonWidth}px`,
  height: `${theme.sizing.reflectDetailsButtonHeight}px`,
  padding: `0 ${theme.sizing.space4}px`,
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
