import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ScreenSize } from '../MicroCoachModels';

const forwardScreenSize = (prop: PropertyKey) => prop !== 'screenSize';
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
  gap: `${theme.sizing.space4}px`,
  padding: `${theme.sizing.space5}px`,
  minHeight: 0,
  overflow: 'hidden',
}));

export const ReflectionDetailIntro = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space0}px`,
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
  gap: `${theme.sizing.space3}px`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  padding: `${theme.sizing.space4}px ${theme.sizing.space3}px`,
}));

export const ReflectionSummaryScores = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: `${theme.sizing.space5}px`,
  minWidth: 0,
}));

export const ReflectionSummaryAssessment = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: `${theme.sizing.space0}px`,
  minWidth: 0,
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

export const ReflectionSummaryDescription = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.space0}px`,
  flex: '1 1 auto',
  minWidth: 0,
  color: theme.palette.designSystem.surface.atlanticNavy,
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
  gap: `${theme.sizing.space2}px`,
  padding: `${theme.sizing.space5}px`,
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

export const ProficiencySection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  flexDirection: 'column',
  gap: `${theme.sizing.space3}px`,
  color: theme.palette.designSystem.surface.atlanticNavy,
}));

export const ProficiencyCards = styled(Box, {
  shouldForwardProp: forwardScreenSize,
})<{ screenSize: ScreenSize }>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
  gap: `${theme.sizing.space2}px`,
}));

export const ProficiencyCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: `${theme.sizing.space1}px`,
  flex: '1 1 0',
  minWidth: 0,
  padding: `${theme.sizing.space2}px`,
  border: theme.borders.subtle,
  borderRadius: theme.sizing.space2,
}));

export const ProficiencyCounts = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: `${theme.sizing.space2}px`,
}));

export const ProficiencyCountGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: `${theme.sizing.space0}px`,
}));

export const ProficiencyCount = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'assessment',
})<{ assessment: 'before' | 'after' }>(({ theme, assessment }) => ({
  ...theme.typography.headingLg,
  color: assessment === 'before'
    ? theme.palette.designSystem.surface.steelBlue
    : theme.palette.designSystem.surface.atlanticNavy,
}));

export const ProficiencyChange = styled(Box)(({ theme }) => ({
  padding: `${theme.sizing.space0}px ${theme.sizing.space2}px`,
  border: theme.borders.subtle,
  borderColor: theme.palette.designSystem.background.navyBlue,
  borderRadius: theme.sizing.space1,
  ...theme.typography.smallBodyText,
}));

export const QuestionResultsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
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
  minHeight: 0,
  padding: `${theme.sizing.space2}px`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  '&.Mui-expanded': {
    minHeight: 0,
  },
  '& .MuiAccordionSummary-content': {
    margin: 0,
  },
  '& .MuiAccordionSummary-content.Mui-expanded': {
    margin: 0,
  },
}));

export const QuestionSummaryContent = styled(Box, {
  shouldForwardProp: forwardScreenSize,
})<{ screenSize: ScreenSize }>(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: `${theme.sizing.space0}px`,
}));

export const QuestionSummaryHeading = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: `${theme.sizing.space2}px`,
  width: '100%',
}));

export const QuestionMetricGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  minWidth: 0,
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.sizing.space1,
}));

export const QuestionToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: `${theme.sizing.space0}px`,
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
  gap: `${theme.sizing.space0}px`,
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.smallBodyText,
  whiteSpace: 'nowrap',
}));

export const CorrectAnswerText = styled(Box)(({ theme }) => ({
  color: theme.palette.designSystem.status.reflectionImprovement,
  ...theme.typography.smallBodyText,
}));
