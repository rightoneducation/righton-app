import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { SelectChangeEvent } from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Modal from 'react-modal';
import { IImplementedActivity } from '../lib/PipelineModels';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  MockReflectionAnswerResult,
  MockReflectionStudentResult,
  ReflectionDetailSort,
  mockReflectionQuestions,
  mockReflectionStudents,
} from '../lib/mocks/reflectionDetail';
import {
  AnswerDistribution,
  AnswerResponse,
  AssessmentLabel,
  AssessmentResponseList,
  AssessmentResponseRow,
  CorrectAnswerText,
  MasteryGroups,
  MasteryHeadingGroup,
  MasterySection,
  MasterySectionHeader,
  MasteryTitleRow,
  QuestionMetricGroup,
  QuestionResultAccordion,
  QuestionResultDetails,
  QuestionResultSummary,
  QuestionResultsSection,
  QuestionSummaryContent,
  QuestionToggle,
  ReflectionDetailBody,
  ReflectionDetailHeader,
  ReflectionDetailIntro,
  ReflectionPanelDivider,
  ReflectionProgressBody,
  ReflectionProgressPanel,
  ReflectionSortRow,
  ReflectionSortSelect,
  ReflectionSummaryChange,
  ReflectionSummaryPanel,
  ReflectionSummaryScores,
  StudentCountChip,
  StudentNamePill,
  StudentResultChip,
  StudentResultList,
  StudentResultValue,
} from '../lib/styledcomponents/ReflectionDetailStyledComponents';
import { ReflectionTrendValue } from '../lib/styledcomponents/ReflectStyledComponents';
import { getReflectionTrend } from '../lib/reflectionResults';

interface ReflectionDetailModalProps {
  activity: IImplementedActivity | null;
  screenSize: ScreenSize;
  onClose: () => void;
}

interface StudentGroupProps {
  title: string;
  description: string;
  students: CompleteReflectionStudentResult[];
  sort: ReflectionDetailSort;
  screenSize: ScreenSize;
  onSortChange: (sort: ReflectionDetailSort) => void;
}

interface ResponseRowProps {
  label: string;
  answers: MockReflectionAnswerResult[];
  screenSize: ScreenSize;
}

const QUESTION_COUNT = 6;

type CompleteReflectionStudentResult = MockReflectionStudentResult & {
  questionsCorrectBefore: number;
  questionsCorrectAfter: number;
};

function hasCompleteResults(
  student: MockReflectionStudentResult,
): student is CompleteReflectionStudentResult {
  return (
    student.questionsCorrectBefore !== null &&
    student.questionsCorrectAfter !== null
  );
}

function sortStudents(
  students: CompleteReflectionStudentResult[],
  sort: ReflectionDetailSort,
) {
  return [...students].sort((studentA, studentB) => {
    const scoreDifference =
      sort === 'highestScoring'
        ? studentB.questionsCorrectAfter - studentA.questionsCorrectAfter
        : studentB.questionsCorrectAfter -
          studentB.questionsCorrectBefore -
          (studentA.questionsCorrectAfter - studentA.questionsCorrectBefore);

    if (scoreDifference !== 0) return scoreDifference;
    return studentA.displayName.localeCompare(studentB.displayName);
  });
}

function studentTrend(student: CompleteReflectionStudentResult) {
  return getReflectionTrend(
    student.questionsCorrectAfter - student.questionsCorrectBefore,
  );
}

function formatStudentChange(change: number, noChangeLabel: string) {
  if (change === 0) return noChangeLabel;
  return change > 0 ? `+${change}` : change;
}

function StudentGroup({
  title,
  description,
  students,
  sort,
  screenSize,
  onSortChange,
}: StudentGroupProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const sortedStudents = React.useMemo(
    () => sortStudents(students, sort),
    [sort, students],
  );

  const handleSortChange = (event: SelectChangeEvent<unknown>) => {
    onSortChange(event.target.value as ReflectionDetailSort);
  };

  return (
    <MasterySection>
      <MasterySectionHeader screenSize={screenSize}>
        <MasteryHeadingGroup>
          <MasteryTitleRow>
            <Typography variant="headingMd" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
              {title}
            </Typography>
            <StudentCountChip>
              {t('reflect.studentCount', { count: students.length })}
            </StudentCountChip>
          </MasteryTitleRow>
          <Typography variant="uploadLabel" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
            {description}
          </Typography>
        </MasteryHeadingGroup>
        <ReflectionSortRow>
          <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
            {t('reflect.sortBy')}
          </Typography>
          <ReflectionSortSelect
            value={sort}
            onChange={handleSortChange}
            renderValue={() =>
              sort === 'highestScoring'
                ? t('reflect.highestScoring')
                : t('reflect.mostImproved')
            }
            inputProps={{ 'aria-label': t('reflect.sortStudents') }}
            MenuProps={{
              PaperProps: {
                sx: {
                  mt: `-${theme.sizing.space1}px`,
                  width: theme.sizing.reflectDetailSortWidth,
                  minWidth: `${theme.sizing.reflectDetailSortWidth}px !important`,
                  borderRadius: `0 0 ${theme.sizing.space2}px ${theme.sizing.space2}px`,
                  color: 'designSystem.surface.white',
                  backgroundColor: 'designSystem.surface.steelBlue',
                  boxShadow: 'none',
                  '& .MuiMenuItem-root': {
                    minHeight: theme.sizing.space6,
                    mx: `${theme.sizing.space1}px`,
                    my: `${theme.sizing.space0}px`,
                    borderRadius: `${theme.sizing.space0}px`,
                    backgroundColor: 'designSystem.foreground.fadedNavyBlue',
                  },
                  '& .MuiMenuItem-root:hover': {
                    backgroundColor: 'designSystem.foreground.fadedNavyBlue',
                  },
                },
              },
            }}
          >
            {sort === 'mostImproved' && (
              <MenuItem value="highestScoring">
                {t('reflect.highestScoring')}
              </MenuItem>
            )}
            {sort === 'highestScoring' && (
              <MenuItem value="mostImproved">
                {t('reflect.mostImproved')}
              </MenuItem>
            )}
          </ReflectionSortSelect>
        </ReflectionSortRow>
      </MasterySectionHeader>

      <StudentResultList>
        {sortedStudents.map((student) => {
          const change =
            student.questionsCorrectAfter - student.questionsCorrectBefore;
          const score = `${student.questionsCorrectAfter}/${QUESTION_COUNT}`;
          const changeLabel = formatStudentChange(
            change,
            t('reflect.noChange'),
          );

          return (
            <StudentResultChip key={student.id} sort={sort}>
              <StudentNamePill sort={sort}>
                {student.displayName}
                {sort === 'highestScoring' ? ` ${score}` : ''}
              </StudentNamePill>
              {sort === 'mostImproved' && (
                <StudentResultValue
                  variant="rubikBodyBold"
                  trend={studentTrend(student)}
                >
                  {changeLabel}
                </StudentResultValue>
              )}
            </StudentResultChip>
          );
        })}
      </StudentResultList>
    </MasterySection>
  );
}

function ResponseRow({ label, answers, screenSize }: ResponseRowProps) {
  const { t } = useTranslation();

  return (
    <AssessmentResponseRow screenSize={screenSize}>
      <AssessmentLabel>{label}</AssessmentLabel>
      <AnswerDistribution>
        {answers.map((answer) => (
          <AnswerResponse key={answer.id}>
            <span>{`${answer.letter}. ${answer.percentChosen}%`}</span>
            {answer.isCorrect && (
              <CorrectAnswerText>{t('reflect.correct')}</CorrectAnswerText>
            )}
          </AnswerResponse>
        ))}
      </AnswerDistribution>
    </AssessmentResponseRow>
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
  const [masterySort, setMasterySort] =
    React.useState<ReflectionDetailSort>('highestScoring');
  const [supportSort, setSupportSort] =
    React.useState<ReflectionDetailSort>('highestScoring');
  const [expandedQuestions, setExpandedQuestions] = React.useState<Set<number>>(
    () => new Set([1]),
  );

  const reachedMastery = React.useMemo(
    () =>
      mockReflectionStudents
        .filter(hasCompleteResults)
        .filter((student) => student.questionsCorrectAfter >= 5),
    [],
  );
  const notYetAtMastery = React.useMemo(
    () =>
      mockReflectionStudents
        .filter(hasCompleteResults)
        .filter((student) => student.questionsCorrectAfter <= 4),
    [],
  );
  const incompleteComparisons = React.useMemo(
    () => mockReflectionStudents.filter((student) => !hasCompleteResults(student)),
    [],
  );

  const handleClose = () => {
    setMasterySort('highestScoring');
    setSupportSort('highestScoring');
    setExpandedQuestions(new Set([1]));
    onClose();
  };

  if (!activity) return null;

  const questionChange =
    activity.averageQuestionsCorrectAfter -
    activity.averageQuestionsCorrectBefore;
  const formattedQuestionChange = `${questionChange > 0 ? '+' : ''}${questionChange.toFixed(1)}`;
  const summaryTrend = getReflectionTrend(
    activity.averagePercentCorrectAfter -
      activity.averagePercentCorrectBefore,
  );

  const toggleQuestion = (questionNumber: number, isExpanded: boolean) => {
    setExpandedQuestions((current) => {
      const next = new Set(current);
      if (isExpanded) next.add(questionNumber);
      else next.delete(questionNumber);
      return next;
    });
  };

  return (
    <Modal
      isOpen
      onRequestClose={handleClose}
      contentLabel={t('reflect.detailsFor', { title: activity.title })}
      style={{
        overlay: {
          backgroundColor: theme.palette.designSystem.background.scrim,
          zIndex: theme.zIndex.modal,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: theme.sizing.space1,
        },
        content: {
          position: 'relative',
          inset: 'auto',
          width: '100%',
          maxWidth: isLarge
            ? theme.sizing.reflectDetailModalMaxWidth
            : '100%',
          height: `calc(100vh - ${theme.sizing.space3}px)`,
          maxHeight: `calc(100vh - ${theme.sizing.space3}px)`,
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
        <Typography variant="navTitle2" sx={{ color: 'designSystem.surface.white' }}>
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
          <Typography variant="navTitle2" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
            {activity.misconceptionTitle}
          </Typography>
          <Typography variant="uploadLabel" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
            {t('reflect.detailsSubtitle')}
          </Typography>
        </ReflectionDetailIntro>

        <ReflectionProgressPanel>
          <ReflectionSummaryPanel screenSize={screenSize}>
            <ReflectionSummaryScores>
              <Typography variant="appTitle" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                {t('reflect.percentCorrect', {
                  percent: activity.averagePercentCorrectBefore,
                })}
              </Typography>
              <Typography variant="appTitle" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                →
              </Typography>
              <ReflectionTrendValue variant="appTitle" trend={summaryTrend}>
                {t('reflect.percentCorrect', {
                  percent: activity.averagePercentCorrectAfter,
                })}
              </ReflectionTrendValue>
            </ReflectionSummaryScores>
            <Typography variant="rubikBodyBold" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
              {t('reflect.scoreSubtitle', { count: activity.questionCount })}
            </Typography>
            <ReflectionSummaryChange trend={summaryTrend}>
              {summaryTrend === 'unchanged'
                ? t('reflect.noChange')
                : t('reflect.averageQuestionsGain', {
                  change: formattedQuestionChange,
                })}
            </ReflectionSummaryChange>
          </ReflectionSummaryPanel>

          <ReflectionPanelDivider />

          <ReflectionProgressBody>
            <MasteryGroups>
              <StudentGroup
                title={t('reflect.reachedMastery')}
                description={t('reflect.reachedMasteryDescription')}
                students={reachedMastery}
                sort={masterySort}
                screenSize={screenSize}
                onSortChange={setMasterySort}
              />
              <StudentGroup
                title={t('reflect.notYetAtMastery')}
                description={t('reflect.notYetAtMasteryDescription')}
                students={notYetAtMastery}
                sort={supportSort}
                screenSize={screenSize}
                onSortChange={setSupportSort}
              />
              <MasterySection>
                <MasteryHeadingGroup>
                  <MasteryTitleRow>
                    <Typography variant="headingMd" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                      {t('reflect.incompleteComparison')}
                    </Typography>
                    <StudentCountChip>
                      {t('reflect.studentCount', {
                        count: incompleteComparisons.length,
                      })}
                    </StudentCountChip>
                  </MasteryTitleRow>
                  <Typography variant="uploadLabel" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                    {t('reflect.incompleteComparisonDescription')}
                  </Typography>
                </MasteryHeadingGroup>
                <StudentResultList>
                  {incompleteComparisons.map((student) => (
                    <StudentResultChip key={student.id} sort="mostImproved">
                      <StudentNamePill sort="mostImproved">
                        {student.displayName}
                      </StudentNamePill>
                      <StudentResultValue variant="rubikBodyBold" trend="unchanged">
                        {student.questionsCorrectAfter === null
                          ? t('reflect.miu1Only')
                          : t('reflect.miu2Only')}
                      </StudentResultValue>
                    </StudentResultChip>
                  ))}
                </StudentResultList>
              </MasterySection>
            </MasteryGroups>

            <ReflectionPanelDivider />

            <QuestionResultsSection>
              {mockReflectionQuestions.map((question) => {
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
                    <QuestionResultSummary
                      expandIcon={(
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
                      )}
                    >
                      <QuestionSummaryContent screenSize={screenSize}>
                        <QuestionMetricGroup>
                          <Typography variant="headingMd" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                            {`Q${question.questionNumber}`}
                          </Typography>
                          <Typography variant="headingMd" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                            {`${question.percentCorrectBefore}%`}
                          </Typography>
                          <Typography variant="headingMd" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                            →
                          </Typography>
                          <ReflectionTrendValue variant="headingMd" trend={trend}>
                            {`${question.percentCorrectAfter}%`}
                          </ReflectionTrendValue>
                          <Typography variant="headingMd" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                            {t('reflect.correctResponses')}
                          </Typography>
                        </QuestionMetricGroup>
                        <Typography variant="uploadLabel" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                          {question.questionText}
                        </Typography>
                      </QuestionSummaryContent>
                    </QuestionResultSummary>

                    <QuestionResultDetails>
                      <Typography
                        variant="rubikBody"
                        sx={{
                          color: 'designSystem.surface.atlanticNavy',
                          textTransform: 'uppercase',
                        }}
                      >
                        {t('reflect.responseDistributionTitle')}
                      </Typography>
                      <AssessmentResponseList>
                        <ResponseRow
                          label={t('reflect.miu1')}
                          answers={question.beforeAnswers}
                          screenSize={screenSize}
                        />
                        <ResponseRow
                          label={t('reflect.miu2')}
                          answers={question.afterAnswers}
                          screenSize={screenSize}
                        />
                      </AssessmentResponseList>
                    </QuestionResultDetails>
                  </QuestionResultAccordion>
                );
              })}
            </QuestionResultsSection>
          </ReflectionProgressBody>
        </ReflectionProgressPanel>
      </ReflectionDetailBody>
    </Modal>
  );
}
