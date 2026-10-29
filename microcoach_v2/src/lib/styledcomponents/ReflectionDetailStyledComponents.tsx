import { styled, Theme } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { ScreenSize } from '../MicroCoachModels';
import {
  ReflectionDetailSort,
  ReflectionTrend,
} from '../reflectionResults';

const forwardScreenSize = (prop: PropertyKey) => prop !== 'screenSize';
const forwardTrend = (prop: PropertyKey) => prop !== 'trend';
const forwardSort = (prop: PropertyKey) => prop !== 'sort';

function detailTrendColor(theme: Theme, trend: ReflectionTrend) {
  if (trend === 'improved') {
    return theme.palette.designSystem.status.reflectionImprovement;
  }
  // rev5 draws a drop as #D0254D, the same red as fieldErrorStroke.
  if (trend === 'declined') {
    return theme.palette.designSystem.status.fieldErrorStroke;
  }
  return theme.palette.designSystem.surface.atlanticNavy;
}

function detailTrendBackground(theme: Theme, trend: ReflectionTrend) {
  if (trend === 'improved') {
    return theme.palette.designSystem.status.reflectionImprovementTint;
  }
  if (trend === 'declined') {
    return theme.palette.designSystem.status.reflectionDeclineTint;
  }
  return theme.palette.designSystem.surface.skyBlue;
}

export const ReflectionDetailHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: theme.sizing.reflectDetailHeaderHeight,
  padding: `0 ${theme.sizing.space5}px`,
  backgroundColor: theme.palette.designSystem.background.navyBlue,
  color: theme.palette.designSystem.surface.white,
}));

export const ReflectionDetailBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: theme.sizing.space5,
  padding: theme.sizing.space5,
  minHeight: 0,
  overflow: 'hidden',
}));

export const ReflectionDetailIntro = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space0,
}));

export const ReflectionProgressPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  minHeight: 0,
  border: theme.borders.subtle,
  borderRadius: theme.sizing.space2,
  overflow: 'hidden',
  backgroundColor: theme.palette.designSystem.surface.white,
}));

export const ReflectionSummaryPanel = styled(Box, {
  shouldForwardProp: forwardScreenSize,
})<{ screenSize: ScreenSize }>(({ theme, screenSize }) => ({
  display: 'flex',
  flexShrink: 0,
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
  alignItems: screenSize === ScreenSize.SMALL ? 'flex-start' : 'center',
  gap: theme.sizing.space3,
  padding: `${theme.sizing.space4}px ${theme.sizing.space3}px`,
}));

export const ReflectionSummaryScores = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: theme.sizing.space2,
}));

export const ReflectionSummaryChange = styled(Box, {
  shouldForwardProp: forwardTrend,
})<{ trend: ReflectionTrend }>(({ theme, trend }) => ({
  flexShrink: 0,
  padding: theme.sizing.space0,
  borderRadius: theme.sizing.space0,
  backgroundColor: detailTrendBackground(theme, trend),
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.reflectChipLabel,
}));

export const ReflectionPanelDivider = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  height: theme.borders.borderWidth,
  backgroundColor: theme.palette.designSystem.foreground.greyAccent,
}));

export const ReflectionProgressBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: theme.sizing.space5,
  padding: theme.sizing.space6,
  minHeight: 0,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: theme.sizing.space1,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.designSystem.surface.white,
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: theme.sizing.space1,
    backgroundColor: theme.palette.designSystem.foreground.disabledStroke,
  },
  scrollbarColor: `${theme.palette.designSystem.foreground.disabledStroke} ${theme.palette.designSystem.surface.white}`,
  scrollbarWidth: 'thin',
}));

export const ReflectionUnavailableState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: theme.sizing.space13,
  padding: theme.sizing.space5,
  textAlign: 'center',
}));

export const MasteryGroups = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space5,
}));

export const MasterySection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space1,
}));

export const MasterySectionHeader = styled(Box, {
  shouldForwardProp: forwardScreenSize,
})<{ screenSize: ScreenSize }>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
  alignItems: screenSize === ScreenSize.SMALL ? 'stretch' : 'flex-start',
  justifyContent: 'space-between',
  gap: theme.sizing.space2,
}));

export const MasteryHeadingGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space0,
}));

export const MasteryTitleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.sizing.space2,
}));

export const StudentCountChip = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  height: theme.sizing.reflectCountChipHeight,
  padding: `0 ${theme.sizing.space2}px`,
  border: `${theme.borders.borderWidth}px solid ${theme.palette.designSystem.background.navyBlue}`,
  borderRadius: theme.sizing.space2,
  color: theme.palette.designSystem.surface.atlanticNavy,
  backgroundColor: theme.palette.designSystem.surface.white,
  ...theme.typography.smallBodyText,
}));

export const ReflectionSortRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: `${theme.sizing.space1}px`,
}));

export const ReflectionSortSelect = styled(Select)(({ theme }) => ({
  minWidth: `${theme.sizing.reflectDetailSortWidth}px`,
  height: `${theme.sizing.reflectDetailSortHeight}px`,
  borderRadius: `${theme.sizing.space5}px`,
  color: theme.palette.designSystem.surface.white,
  backgroundColor: theme.palette.designSystem.surface.steelBlue,
  ...theme.typography.microLabel,
  '& .MuiSelect-select': {
    paddingTop: `${theme.sizing.space1}px`,
    paddingBottom: `${theme.sizing.space1}px`,
  },
  '& .MuiSelect-icon': {
    color: theme.palette.designSystem.surface.white,
  },
  '& .MuiSelect-iconOpen': {
    transform: 'none',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

export const ReflectionSortMenuItem = styled(MenuItem)(({ theme }) => ({
  minHeight: `${theme.sizing.space5}px`,
  padding: `0 ${theme.sizing.space1}px`,
  borderRadius: `${theme.sizing.space0}px`,
  justifyContent: 'center',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  color: theme.palette.designSystem.surface.white,
  backgroundColor: theme.palette.designSystem.foreground.fadedNavyBlue,
  ...theme.typography.microLabel,
  '&:hover': {
    backgroundColor: theme.palette.designSystem.foreground.fadedNavyBlue,
  },
}));

export const StudentResultList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: theme.sizing.space2,
  rowGap: theme.sizing.space1,
}));

export const StudentResultChip = styled(Box, {
  shouldForwardProp: forwardSort,
})<{ sort: ReflectionDetailSort }>(({ theme, sort }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space1,
  padding:
    sort === 'highestScoring'
      ? `${theme.sizing.space0}px ${theme.sizing.space2}px`
      : theme.sizing.space1,
  borderRadius:
    sort === 'highestScoring'
      ? theme.sizing.space5
      : theme.sizing.space0,
  backgroundColor:
    sort === 'highestScoring'
      ? theme.palette.designSystem.background.navyBlue
      : theme.palette.designSystem.surface.skyBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.microLabel,
}));

export const StudentNamePill = styled(Box, {
  shouldForwardProp: forwardSort,
})<{ sort: ReflectionDetailSort }>(({ theme, sort }) => ({
  padding:
    sort === 'highestScoring'
      ? 0
      : `${theme.sizing.space0}px ${theme.sizing.space2}px`,
  borderRadius: theme.sizing.space5,
  backgroundColor:
    sort === 'highestScoring'
      ? 'transparent'
      : theme.palette.designSystem.background.navyBlue,
  color: theme.palette.designSystem.surface.white,
  whiteSpace: 'nowrap',
}));

export const StudentResultValue = styled(Typography, {
  shouldForwardProp: forwardTrend,
})<{ trend: ReflectionTrend }>(({ theme, trend }) => ({
  color: detailTrendColor(theme, trend),
  ...theme.typography.microLabel,
  fontWeight: 500,
  whiteSpace: 'nowrap',
}));

export const QuestionResultsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
}));

export const QuestionResultAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: `${theme.sizing.space3}px !important`,
  boxShadow: 'none',
  overflow: 'hidden',
  backgroundColor: theme.palette.designSystem.surface.skyBlue,
  '&::before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
  },
}));

export const QuestionResultSummary = styled(AccordionSummary)(({ theme }) => ({
  minHeight: theme.sizing.space13,
  padding: `0 ${theme.sizing.space2}px`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  '&.Mui-expanded': {
    minHeight: theme.sizing.space13,
  },
  '& .MuiAccordionSummary-content': {
    margin: `${theme.sizing.space2}px 0`,
  },
  '& .MuiAccordionSummary-content.Mui-expanded': {
    margin: `${theme.sizing.space2}px 0`,
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    alignSelf: 'flex-start',
    marginLeft: theme.sizing.space2,
    marginTop: theme.sizing.space3,
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'none',
  },
}));

export const QuestionSummaryContent = styled(Box, {
  shouldForwardProp: forwardScreenSize,
})<{ screenSize: ScreenSize }>(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.sizing.space1,
}));

export const QuestionMetricGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.sizing.space1,
}));

export const QuestionToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space0,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.reflectChipLabel,
  whiteSpace: 'nowrap',
}));

export const QuestionResultDetails = styled(AccordionDetails)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space3,
  padding: `0 ${theme.sizing.space2}px ${theme.sizing.space3}px`,
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

export const AssessmentResponseList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
}));

// One MIU in an expanded question: its own question (with the standard it
// assesses) above that MIU's answer distribution.
export const AssessmentBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.sizing.space2,
}));

export const AssessmentQuestionRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.sizing.space2,
}));

export const AssessmentResponseRow = styled(Box, {
  shouldForwardProp: forwardScreenSize,
})<{ screenSize: ScreenSize }>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
  alignItems: screenSize === ScreenSize.SMALL ? 'flex-start' : 'center',
  gap: theme.sizing.space2,
}));

export const AssessmentLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.sizing.reflectMiuLabelWidth,
  height: theme.sizing.reflectMiuLabelHeight,
  borderRadius: theme.sizing.space0,
  backgroundColor: theme.palette.designSystem.foreground.brightBlue,
  color: theme.palette.designSystem.surface.white,
  ...theme.typography.bodyText,
}));

export const AnswerDistribution = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.sizing.space2,
}));

export const AnswerResponse = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.sizing.space0,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.smallBodyText,
  whiteSpace: 'nowrap',
}));

export const CorrectAnswerText = styled(Box)(({ theme }) => ({
  color: theme.palette.designSystem.status.reflectionImprovement,
  ...theme.typography.smallBodyText,
}));
