import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { SelectChangeEvent } from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AppModal from './AppModal';
import type {
  IMicroCoachReflectionAnswerResult,
  IMicroCoachReflectionStudentResult,
} from '../api/Models/IMicroCoachSession';
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
  ReflectionSortMenuItem,
  ReflectionSortRow,
  ReflectionSortSelect,
  ReflectionSummaryChange,
  ReflectionSummaryPanel,
  ReflectionSummaryScores,
  ReflectionUnavailableState,
  StudentCountChip,
  StudentNamePill,
  StudentResultChip,
  StudentResultList,
  StudentResultValue,
} from '../lib/styledcomponents/ReflectionDetailStyledComponents';
import {
  ReflectionTrendValue,
  ReflectSkillCodeChip,
} from '../lib/styledcomponents/ReflectStyledComponents';
import {
  getReflectionTrend,
  ReflectionDetailSort,
} from '../lib/reflectionResults';

interface ReflectionDetailModalProps {
  activity: IImplementedActivity | null;
  screenSize: ScreenSize;
  onClose: () => void;
}

interface StudentGroupProps {
  title: string;
  description: string;
  students: CompleteReflectionStudentResult[];
  studentCount: number;
  questionCount: number;
  sort: ReflectionDetailSort;
  screenSize: ScreenSize;
  onSortChange: (sort: ReflectionDetailSort) => void;
}

interface ResponseRowProps {
  label: string;
  questionText: string | null;
  standard: string | null;
  answers: IMicroCoachReflectionAnswerResult[];
  screenSize: ScreenSize;
}

type DisplayReflectionStudentResult = IMicroCoachReflectionStudentResult & {
  displayName: string;
};

type CompleteReflectionStudentResult = DisplayReflectionStudentResult & {
  questionsCorrectBefore: number;
  questionsCorrectAfter: number;
};

function hasCompleteResults<
  StudentResult extends IMicroCoachReflectionStudentResult,
>(student: StudentResult): student is StudentResult & {
  questionsCorrectBefore: number;
  questionsCorrectAfter: number;
} {
  return (
    student.questionsCorrectBefore !== null &&
    student.questionsCorrectAfter !== null
  );
}

function splitStudentName(studentName: string) {
  const normalizedName = studentName.replace(/\s+/g, ' ').trim();
  const commaIndex = normalizedName.indexOf(',');
  const displayOrderName =
    commaIndex >= 0
      ? `${normalizedName.slice(commaIndex + 1)} ${normalizedName.slice(0, commaIndex)}`.replace(
        /\s+/g,
        ' ',
      ).trim()
      : normalizedName;
  const [firstName, ...lastNameParts] = displayOrderName.split(' ');

  return {
    firstName,
    lastName: lastNameParts.join(' '),
  };
}

function addStudentDisplayNames<
  StudentResult extends IMicroCoachReflectionStudentResult,
>(students: StudentResult[]): Array<StudentResult & { displayName: string }> {
  const namedStudents = students.flatMap((student) => {
    const studentName = student.studentName?.trim();
    if (!studentName) return [];

    return [{ student, ...splitStudentName(studentName) }];
  });
  const firstNameCounts = namedStudents.reduce<Map<string, number>>(
    (counts, student) => {
      const normalizedFirstName = student.firstName.toLocaleLowerCase();
      counts.set(
        normalizedFirstName,
        (counts.get(normalizedFirstName) ?? 0) + 1,
      );
      return counts;
    },
    new Map(),
  );

  return namedStudents.map(({ student, firstName, lastName }) => {
    const hasDuplicateFirstName =
      (firstNameCounts.get(firstName.toLocaleLowerCase()) ?? 0) > 1;
    const lastInitial = lastName.charAt(0).toLocaleUpperCase();

    return {
      ...student,
      displayName:
        hasDuplicateFirstName && lastInitial
          ? `${firstName} ${lastInitial}.`
          : firstName,
    };
  });
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
  studentCount,
  questionCount,
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

  const [isSortOpen, setIsSortOpen] = React.useState(false);

  const handleSortChange = (event: SelectChangeEvent<unknown>) => {
    onSortChange(event.target.value as ReflectionDetailSort);
  };

  return (
    <MasterySection>
      <MasterySectionHeader screenSize={screenSize}>
        <MasteryHeadingGroup>
          <MasteryTitleRow>
            <Typography variant="reflectGroupTitle" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
              {title}
            </Typography>
            <StudentCountChip>
              {t('reflect.studentCount', { count: studentCount })}
            </StudentCountChip>
          </MasteryTitleRow>
          <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
            {description}
          </Typography>
        </MasteryHeadingGroup>
        <ReflectionSortRow>
          <Typography variant="microLabel" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
            {t('reflect.sortBy')}
          </Typography>
          <ReflectionSortSelect
            value={sort}
            open={isSortOpen}
            onOpen={() => setIsSortOpen(true)}
            onClose={() => setIsSortOpen(false)}
            onChange={handleSortChange}
            renderValue={() =>
              sort === 'highestScoring'
                ? t('reflect.highestScoring')
                : t('reflect.mostImproved')
            }
            inputProps={{ 'aria-label': t('reflect.sortStudents') }}
            MenuProps={{
              MenuListProps: {
                sx: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: `${theme.sizing.space0}px`,
                  padding: `${theme.sizing.space2}px ${theme.sizing.space2}px ${theme.sizing.space1}px`,
                },
              },
              PaperProps: {
                sx: {
                  width: `${theme.sizing.reflectDetailSortWidth}px`,
                  borderRadius: `0 0 ${theme.sizing.space3}px ${theme.sizing.space3}px`,
                  color: 'designSystem.surface.white',
                  backgroundColor: 'designSystem.surface.steelBlue',
                  backgroundImage: 'none',
                  boxShadow: 'none',
                },
              },
            }}
          >
            {sort === 'mostImproved' && (
              <ReflectionSortMenuItem value="highestScoring">
                {t('reflect.highestScoring')}
              </ReflectionSortMenuItem>
            )}
            {sort === 'highestScoring' && (
              <ReflectionSortMenuItem value="mostImproved">
                {t('reflect.mostImproved')}
              </ReflectionSortMenuItem>
            )}
          </ReflectionSortSelect>
        </ReflectionSortRow>
      </MasterySectionHeader>

      <StudentResultList>
        {sortedStudents.map((student) => {
          const change =
            student.questionsCorrectAfter - student.questionsCorrectBefore;
          const score = `${student.questionsCorrectAfter}/${questionCount}`;
          const changeLabel = formatStudentChange(
            change,
            t('reflect.noChange'),
          );

          return (
            <StudentResultChip key={student.studentId} sort={sort}>
              <StudentNamePill sort={sort}>
                {student.displayName}
                {sort === 'highestScoring' ? ` ${score}` : ''}
              </StudentNamePill>
              {sort === 'mostImproved' && (
                <StudentResultValue
                  variant="microLabel"
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

function ResponseRow({
  label,
  questionText,
  standard,
  answers,
  screenSize,
}: ResponseRowProps) {
  const { t } = useTranslation();

  return (
    <AssessmentBlock>
      {questionText && (
        <AssessmentQuestionRow>
          {standard && <ReflectSkillCodeChip>{standard}</ReflectSkillCodeChip>}
          <Typography variant="bodyText" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
            {questionText}
          </Typography>
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
  const [masterySort, setMasterySort] =
    React.useState<ReflectionDetailSort>('highestScoring');
  const [supportSort, setSupportSort] =
    React.useState<ReflectionDetailSort>('highestScoring');
  const [expandedQuestions, setExpandedQuestions] = React.useState<Set<number>>(
    () => new Set([1]),
  );

  const studentGroups = React.useMemo(() => {
    const studentResults = activity?.studentResults ?? [];
    const questionCount = activity?.questionCount ?? 0;
    const masteryThreshold = Math.max(questionCount - 1, 0);
    const completeStudents = studentResults.filter(hasCompleteResults);
    const namedStudents = addStudentDisplayNames(studentResults);
    const namedCompleteStudents = namedStudents.filter(hasCompleteResults);
    const reachedMasteryResults = completeStudents.filter(
      (student) => student.questionsCorrectAfter >= masteryThreshold,
    );
    const notYetAtMasteryResults = completeStudents.filter(
      (student) => student.questionsCorrectAfter < masteryThreshold,
    );
    const incompleteResults = studentResults.filter(
      (student) => !hasCompleteResults(student),
    );

    return {
      reachedMastery: namedCompleteStudents.filter(
        (student) => student.questionsCorrectAfter >= masteryThreshold,
      ),
      reachedMasteryCount: reachedMasteryResults.length,
      notYetAtMastery: namedCompleteStudents.filter(
        (student) => student.questionsCorrectAfter < masteryThreshold,
      ),
      notYetAtMasteryCount: notYetAtMasteryResults.length,
      incompleteComparisons: namedStudents.filter(
        (student) => !hasCompleteResults(student),
      ),
      incompleteComparisonCount: incompleteResults.length,
    };
  }, [activity]);

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
  const hasDetailedResults =
    activity.studentResults.length > 0 && activity.questionResults.length > 0;

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
          backgroundColor: theme.palette.designSystem.background.scrim,
          zIndex: theme.zIndex.modal,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: isLarge
            ? `${theme.sizing.headerHeight + theme.sizing.space8}px ${theme.sizing.space1}px ${theme.sizing.space8}px`
            : theme.sizing.space1,
        },
        content: {
          position: 'relative',
          inset: 'auto',
          width: '100%',
          maxWidth: isLarge
            ? theme.sizing.reflectDetailModalMaxWidth
            : '100%',
          // rev5 draws the modal at its content's height, not full-screen;
          // past the viewport the progress panel scrolls.
          height: isLarge ? 'auto' : `calc(100vh - ${theme.sizing.space3}px)`,
          maxHeight: isLarge ? '100%' : `calc(100vh - ${theme.sizing.space3}px)`,
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
              <Typography variant="reflectDetailScore" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                {t('reflect.percentCorrect', {
                  percent: Math.round(activity.averagePercentCorrectBefore),
                })}
              </Typography>
              <Typography variant="reflectDetailScore" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                →
              </Typography>
              <ReflectionTrendValue variant="reflectDetailScore" trend={summaryTrend}>
                {t('reflect.percentCorrect', {
                  percent: Math.round(activity.averagePercentCorrectAfter),
                })}
              </ReflectionTrendValue>
            </ReflectionSummaryScores>
            <Typography variant="rubikSubBold" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
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
            {!hasDetailedResults ? (
              <ReflectionUnavailableState>
                <Typography
                  variant="rubikBody"
                  sx={{ color: 'designSystem.surface.ashyGray' }}
                >
                  {t('reflect.detailsUnavailable')}
                </Typography>
              </ReflectionUnavailableState>
            ) : (
              <>
                <MasteryGroups>
              <StudentGroup
                title={t('reflect.reachedMastery')}
                description={t('reflect.reachedMasteryDescription')}
                students={studentGroups.reachedMastery}
                studentCount={studentGroups.reachedMasteryCount}
                questionCount={activity.questionCount}
                sort={masterySort}
                screenSize={screenSize}
                onSortChange={setMasterySort}
              />
              <StudentGroup
                title={t('reflect.notYetAtMastery')}
                description={t('reflect.notYetAtMasteryDescription')}
                students={studentGroups.notYetAtMastery}
                studentCount={studentGroups.notYetAtMasteryCount}
                questionCount={activity.questionCount}
                sort={supportSort}
                screenSize={screenSize}
                onSortChange={setSupportSort}
              />
              <MasterySection>
                <MasteryHeadingGroup>
                  <MasteryTitleRow>
                    <Typography variant="reflectGroupTitle" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                      {t('reflect.incompleteComparison')}
                    </Typography>
                    <StudentCountChip>
                      {t('reflect.studentCount', {
                        count: studentGroups.incompleteComparisonCount,
                      })}
                    </StudentCountChip>
                  </MasteryTitleRow>
                  <Typography variant="rubikBody" sx={{ color: 'designSystem.surface.atlanticNavy' }}>
                    {t('reflect.incompleteComparisonDescription')}
                  </Typography>
                </MasteryHeadingGroup>
                <StudentResultList>
                  {studentGroups.incompleteComparisons.map((student) => (
                    <StudentResultChip
                      key={student.studentId}
                      sort="mostImproved"
                    >
                      <StudentNamePill sort="mostImproved">
                        {student.displayName}
                      </StudentNamePill>
                      <StudentResultValue variant="microLabel" trend="unchanged">
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
                      </QuestionSummaryContent>
                    </QuestionResultSummary>

                    <QuestionResultDetails>
                      <Typography
                        variant="smallBodyText"
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
                          // Results written before the per-MIU fields carry
                          // only questionText, which is MIU 1's.
                          questionText={
                            question.beforeQuestionText ?? question.questionText
                          }
                          standard={question.beforeStandard}
                          answers={question.beforeAnswers}
                          screenSize={screenSize}
                        />
                        <ResponseRow
                          label={t('reflect.miu2')}
                          questionText={question.afterQuestionText}
                          standard={question.afterStandard}
                          answers={question.afterAnswers}
                          screenSize={screenSize}
                        />
                      </AssessmentResponseList>
                    </QuestionResultDetails>
                  </QuestionResultAccordion>
                );
                  })}
                </QuestionResultsSection>
              </>
            )}
          </ReflectionProgressBody>
        </ReflectionProgressPanel>
      </ReflectionDetailBody>
    </AppModal>
  );
}
