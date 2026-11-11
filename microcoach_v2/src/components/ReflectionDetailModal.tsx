import React from 'react';
import { useTranslation } from 'react-i18next';
import { alpha, useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AppModal from './AppModal';
import MathTypography from './MathTypography';
import type { IMicroCoachReflectionAnswerResult } from '../api/Models/IMicroCoachSession';
import { IImplementedActivity } from '../lib/PipelineModels';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  AnswerDistribution,
  AnswerResponse,
  AssessmentBlock,
  AssessmentLabel,
  AssessmentQuestionRow,
  AssessmentResponseList,
  AssessmentResponseRow,
  CorrectAnswerText,
  ProficiencyCard,
  ProficiencyCards,
  ProficiencyChange,
  ProficiencyCount,
  ProficiencyCountGroup,
  ProficiencyCounts,
  ProficiencySection,
  QuestionMetricGroup,
  QuestionResultAccordion,
  QuestionResultDetails,
  QuestionResultSummary,
  QuestionResultsSection,
  QuestionSummaryContent,
  QuestionSummaryHeading,
  QuestionToggle,
  ReflectionDetailBody,
  ReflectionDetailHeader,
  ReflectionDetailIntro,
  ReflectionPanelDivider,
  ReflectionProgressBody,
  ReflectionProgressPanel,
  ReflectionSummaryAssessment,
  ReflectionSummaryDescription,
  ReflectionSummaryPanel,
  ReflectionSummaryScores,
  ReflectionUnavailableState,
} from '../lib/styledcomponents/ReflectionDetailStyledComponents';
import { ReflectionTrendValue, ReflectSkillCodeChip } from '../lib/styledcomponents/ReflectStyledComponents';
import { getReflectionProficiency, getReflectionTrend } from '../lib/reflectionResults';

interface ReflectionDetailModalProps {
  activity: IImplementedActivity | null;
  screenSize: ScreenSize;
  onClose: () => void;
}

interface ResponseRowProps {
  label: string;
  questionText: string | null;
  answers: IMicroCoachReflectionAnswerResult[];
  screenSize: ScreenSize;
}

function ResponseRow({
  label,
  questionText,
  answers,
  screenSize,
}: ResponseRowProps) {
  const { t } = useTranslation();

  return (
    <AssessmentBlock>
      {questionText && (
        <AssessmentQuestionRow>
          <MathTypography
            variant="bodyText"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
            text={questionText}
          />
        </AssessmentQuestionRow>
      )}
      <AssessmentResponseRow screenSize={screenSize}>
        <AssessmentLabel>{label}</AssessmentLabel>
        <AnswerDistribution>
          {answers.map((answer) => (
            <AnswerResponse key={answer.letter}>
              <span>{`${answer.letter}. ${Math.round(answer.percentChosen)}%`}</span>
              {answer.isCorrect && (
                <CorrectAnswerText>{t('reflect.correct')}</CorrectAnswerText>
              )}
            </AnswerResponse>
          ))}
        </AnswerDistribution>
      </AssessmentResponseRow>
    </AssessmentBlock>
  );
}

export default function ReflectionDetailModal({
  activity,
  screenSize,
  onClose,
}: ReflectionDetailModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isLarge = screenSize === ScreenSize.LARGE;
  const [expandedQuestions, setExpandedQuestions] = React.useState<Set<number>>(
    () => new Set([1]),
  );

  const handleClose = () => {
    setExpandedQuestions(new Set([1]));
    onClose();
  };

  if (!activity) return null;

  const proficiency = getReflectionProficiency(activity);
  const beforePercent = proficiency.hasScores
    ? proficiency.averageBefore
    : activity.averagePercentCorrectBefore;
  const afterPercent = proficiency.hasScores
    ? proficiency.averageAfter
    : activity.averagePercentCorrectAfter;
  const summaryTrend = beforePercent !== null && afterPercent !== null
    ? getReflectionTrend(afterPercent - beforePercent)
    : 'unchanged';
  const formatPercent = (percent: number | null) => percent === null
    ? t('reflect.valueUnavailable')
    : t('reflect.percentCorrect', { percent: Math.round(percent) });
  const participation = (count: number, assessment: string) => proficiency.hasScores
    ? t('reflect.participation', { count, assessment })
    : t('reflect.participationUnavailable', { assessment });

  const toggleQuestion = (questionNumber: number, isExpanded: boolean) => {
    setExpandedQuestions((current) => {
      const next = new Set(current);
      if (isExpanded) next.add(questionNumber);
      else next.delete(questionNumber);
      return next;
    });
  };

  return (
    <AppModal
      isOpen
      onRequestClose={handleClose}
      contentLabel={t('reflect.detailsFor', { title: activity.title })}
      style={{
        overlay: {
          backgroundColor: alpha(theme.palette.designSystem.surface.black, 0.66),
          zIndex: theme.zIndex.modal,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: isLarge
            ? `${theme.sizing.space8}px ${theme.sizing.space1}px`
            : `${theme.sizing.space1}px`,
        },
        content: {
          position: 'relative',
          inset: 'auto',
          width: '100%',
          maxWidth: isLarge ? theme.sizing.reflectDetailModalMaxWidth : '100%',
          height: isLarge ? 'auto' : `calc(100dvh - ${theme.sizing.space3}px)`,
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          border: 'none',
          borderRadius: theme.sizing.space2,
          overflow: 'hidden',
          backgroundColor: theme.palette.designSystem.surface.white,
        },
      }}
    >
      <ReflectionDetailHeader>
        <Typography variant="bodyLg" sx={{ color: 'designSystem.surface.white' }}>
          {t('reflect.detailsTitle')}
        </Typography>
        <IconButton
          aria-label={t('reflect.closeDetails')}
          onClick={handleClose}
          sx={{ color: 'designSystem.surface.white' }}
        >
          <CloseIcon />
        </IconButton>
      </ReflectionDetailHeader>

      <ReflectionDetailBody>
        <ReflectionDetailIntro>
          <Typography variant="headingLg" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
            {activity.misconceptionTitle}
          </Typography>
          <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
            {t('reflect.detailsSubtitle')}
          </Typography>
        </ReflectionDetailIntro>

        <ReflectionProgressPanel>
          <ReflectionSummaryPanel screenSize={screenSize}>
            <ReflectionSummaryScores>
              <ReflectionSummaryAssessment>
                <Typography variant="reflectDetailScore">{formatPercent(beforePercent)}</Typography>
                <Typography variant="microLabel">
                  {participation(proficiency.beforeCount, t('reflect.miu1'))}
                </Typography>
              </ReflectionSummaryAssessment>
              <Typography variant="headingLg">→</Typography>
              <ReflectionSummaryAssessment>
                <ReflectionTrendValue variant="reflectDetailScore" trend={summaryTrend}>
                  {formatPercent(afterPercent)}
                </ReflectionTrendValue>
                <Typography variant="microLabel">
                  {participation(proficiency.afterCount, t('reflect.miu2'))}
                </Typography>
              </ReflectionSummaryAssessment>
            </ReflectionSummaryScores>
            <ReflectionSummaryDescription>
              <Typography variant="rubikSubBold">
                {t('reflect.scoreSubtitle', { count: activity.questionCount })}
              </Typography>
              <Typography variant="microLabel">{t('reflect.assessmentDenominatorNote')}</Typography>
            </ReflectionSummaryDescription>
          </ReflectionSummaryPanel>

          <ReflectionPanelDivider />
          <ReflectionProgressBody>
            <ProficiencySection>
              <ReflectionDetailIntro>
                <Typography variant="rubikBodyBold">{t('reflect.proficiencyTitle')}</Typography>
                <Typography variant="rubikBody">{t('reflect.proficiencySubtitle')}</Typography>
              </ReflectionDetailIntro>
              {proficiency.hasScores ? (
                <ProficiencyCards screenSize={screenSize}>
                  {proficiency.bands.map((band) => {
                    const change = band.after - band.before;
                    const scoreRange = band.minimum === band.maximum
                      ? String(band.minimum)
                      : `${band.minimum}–${band.maximum}`;
                    return (
                      <ProficiencyCard key={band.key}>
                        <Typography variant="rubikSubBold">{t(`reflect.proficiency.${band.key}`)}</Typography>
                        <Typography variant="smallBodyText">
                          {band.maximum >= band.minimum
                            ? t('reflect.proficiencyRange', { range: scoreRange })
                            : t('reflect.proficiencyRangeUnavailable')}
                        </Typography>
                        <ProficiencyCounts>
                          <ProficiencyCountGroup>
                            <Typography variant="microLabel">{t('reflect.miu1')}</Typography>
                            <ProficiencyCount assessment="before">{band.before}</ProficiencyCount>
                          </ProficiencyCountGroup>
                          <Typography variant="headingLg">→</Typography>
                          <ProficiencyCountGroup>
                            <Typography variant="microLabel">{t('reflect.miu2')}</Typography>
                            <ProficiencyCount assessment="after">{band.after}</ProficiencyCount>
                          </ProficiencyCountGroup>
                          <Typography variant="microLabel">{t('reflect.studentsLabel')}</Typography>
                        </ProficiencyCounts>
                        <ProficiencyChange>
                          {change === 0
                            ? t('reflect.noChange')
                            : t('reflect.proficiencyChange', { change: `${change > 0 ? '+' : ''}${change}` })}
                        </ProficiencyChange>
                      </ProficiencyCard>
                    );
                  })}
                </ProficiencyCards>
              ) : (
                <Typography variant="rubikBody">{t('reflect.proficiencyUnavailable')}</Typography>
              )}
            </ProficiencySection>
            <ReflectionPanelDivider />
            {activity.questionResults.length > 0 ? (
                <QuestionResultsSection>
                  {activity.questionResults.map((question) => {
                const isExpanded = expandedQuestions.has(
                  question.questionNumber,
                );
                const trend = getReflectionTrend(
                  question.percentCorrectAfter -
                    question.percentCorrectBefore,
                );

                return (
                  <QuestionResultAccordion
                    key={question.questionNumber}
                    disableGutters
                    expanded={isExpanded}
                    onChange={(_event, expanded) =>
                      toggleQuestion(question.questionNumber, expanded)
                    }
                  >
                    <QuestionResultSummary>
                      <QuestionSummaryContent screenSize={screenSize}>
                        <QuestionSummaryHeading>
                        <QuestionMetricGroup>
                          <Typography variant="headingMd" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                            {`Q${question.questionNumber}`}
                          </Typography>
                          <Typography variant="headingMd" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                            {`${Math.round(question.percentCorrectBefore)}%`}
                          </Typography>
                          <Typography variant="headingMd" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                            →
                          </Typography>
                          <ReflectionTrendValue variant="headingMd" trend={trend}>
                            {`${Math.round(question.percentCorrectAfter)}%`}
                          </ReflectionTrendValue>
                          <Typography variant="headingMd" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                            {t('reflect.correctResponses')}
                          </Typography>
                        </QuestionMetricGroup>
                        <QuestionToggle>
                          {isExpanded
                            ? t('reflect.hideDetails')
                            : t('reflect.showDetails')}
                          {isExpanded ? (
                            <KeyboardArrowUpIcon fontSize="small" />
                          ) : (
                            <KeyboardArrowDownIcon fontSize="small" />
                          )}
                        </QuestionToggle>
                        </QuestionSummaryHeading>
                        {isExpanded && (
                          <Typography
                            variant="smallBodyText"
                            sx={{ textTransform: 'uppercase' }}
                          >
                            {t('reflect.responseDistributionTitle')}
                          </Typography>
                        )}
                      </QuestionSummaryContent>
                    </QuestionResultSummary>

                    <QuestionResultDetails>
                      {(question.beforeStandard || question.afterStandard) && (
                        <AssessmentQuestionRow>
                          {Array.from(new Set([question.beforeStandard, question.afterStandard]))
                            .filter((standard): standard is string => !!standard)
                            .map((standard) => (
                              <ReflectSkillCodeChip key={standard}>{standard}</ReflectSkillCodeChip>
                            ))}
                        </AssessmentQuestionRow>
                      )}
                      <AssessmentResponseList>
                        <ResponseRow
                          label={t('reflect.miu1')}
                          // Results written before the per-MIU fields carry
                          // only questionText, which is MIU 1's.
                          questionText={
                            question.beforeQuestionText ?? question.questionText
                          }
                          answers={question.beforeAnswers}
                          screenSize={screenSize}
                        />
                        <ResponseRow
                          label={t('reflect.miu2')}
                          questionText={question.afterQuestionText}
                          answers={question.afterAnswers}
                          screenSize={screenSize}
                        />
                      </AssessmentResponseList>
                    </QuestionResultDetails>
                  </QuestionResultAccordion>
                );
                  })}
                </QuestionResultsSection>
            ) : (
              <ReflectionUnavailableState>
                <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.ashyGray' }}>
                  {t('reflect.detailsUnavailable')}
                </Typography>
              </ReflectionUnavailableState>
            )}
          </ReflectionProgressBody>
        </ReflectionProgressPanel>
      </ReflectionDetailBody>
    </AppModal>
  );
}
