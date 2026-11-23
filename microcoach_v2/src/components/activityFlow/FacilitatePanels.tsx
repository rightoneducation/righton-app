import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MathText from '../MathText';
import MathTypography from '../MathTypography';
import {
  ICompareFacilitate,
  IFavoriteNoFacilitate,
  IMakeYourCaseFacilitate,
  IMathDetectiveFacilitate,
  Tone,
  hasDetectiveNotes,
  teacherStrategyOrder,
} from '../../lib/ActivityContentModels';
import { WorkStatus } from '../../lib/PipelineModels';
import { studentWorkText, withWorkMark } from '../../lib/activityMarks';
import { ScreenSize } from '../../lib/MicroCoachModels';
import {
  ColumnBadge,
  ContentPanel,
  EvidenceTagSlot,
  FavoriteNoTag,
  favoriteNoTagInset,
  StepChip,
  StepRow,
  VerdictChip,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';
import { StepBadge } from '../../lib/styledcomponents/ChooseActivityStyledComponents';
import {
  BringInItem,
  BringInList,
  ClaimAnswerBand,
  ClaimBox,
  ClaimBoxSection,
  ClaimHeading,
  ClaimOptions,
  DetectiveCard,
  DetectiveColumn,
  DetectiveExample,
  DetectiveNoteBox,
  DetectiveSection,
  DetectiveSectionHeading,
  EvidenceNoteCell,
  EvidenceNoteLines,
  EvidenceNoteRow,
  ExampleDetail,
  PotentialAnswer,
  FlowCard,
  SectionPill,
  StudentColumn,
  StudentColumns,
  StudentList,
  StudentListItem,
} from '../../lib/styledcomponents/ActivityFlowStyledComponents';
import {
  ArtifactHeader,
  ArtifactPanelProps,
  ExampleOfHeading,
  ExamplePager,
  ExamplePicker,
  useArtifactView,
} from './ArtifactParts';
import { ReviewCountFlag, ReviewSlot } from './ReviewSlot';

/** The paths of an item's own fields, for a ReviewSlot. */
const fieldsOf = (base: string, fields: string[]) => fields.map((field) => `${base}.${field}`);

/*
 * The Facilitate artifact for Compare the Thinking, Make Your Case, Math
 * Detective and My Favorite No (microcoach-assets/Activities/Activities/
 * <Template>/<Template>_Facilitate_Teacher / _Student). Spot the Slip's lives in
 * FacilitateView. Teacher view adds answers and teaching notes; student view is
 * only what the class sees, and the PDF export follows whichever is on.
 */

const navy = 'designSystem.surface.atlanticNavy';

// Generated questions can put prose inside LaTeX \text{…}. KaTeX otherwise
// renders that prose in its own serif font, overriding the question's Rubik.
const ExampleQuestion = styled(MathTypography)(({ theme }) => ({
  ...theme.typography.rubikSubBold,
  '& .katex': {
    fontWeight: theme.typography.rubikSubBold.fontWeight,
  },
  '& .katex .text': {
    fontFamily: theme.typography.rubikSubBold.fontFamily,
    fontWeight: theme.typography.rubikSubBold.fontWeight,
  },
}));

/** A note's tone as the icon the frames draw beside it. */
function ToneIcon({ tone }: { tone: Tone }) {
  if (tone === 'SUCCESS') {
    return <CheckCircleIcon fontSize="small" sx={{ color: 'designSystem.status.success' }} />;
  }
  if (tone === 'ERROR') {
    return <ErrorIcon fontSize="small" sx={{ color: 'designSystem.status.errorIcon' }} />;
  }
  return <InfoOutlinedIcon fontSize="small" sx={{ color: navy }} />;
}

/**
 * A line of student work behind its step chip: tinted and marked in teacher
 * view, plain for students. The teacher view tags the response's error line.
 */
function WorkLine({
  text,
  status,
  isTeacher,
  path,
  stepNumber,
  showTag,
}: {
  text: string;
  status: WorkStatus;
  isTeacher: boolean;
  // The line's path in the activity, for the review layer.
  path: string;
  stepNumber: number;
  showTag: boolean;
}) {
  const { t } = useTranslation();
  return (
    <ReviewSlot paths={fieldsOf(path, ['text', 'status'])}>
      <StepRow
        isError={isTeacher && status === 'INCORRECT'}
        isCorrect={isTeacher && status === 'CORRECT'}
        // Figma (qa2 MyFavNo): the chip sits flush in the shaded row, no inset;
        // the tag's right gap matches its top and bottom.
        sx={{ pt: 0, pl: 0, pr: showTag ? `${favoriteNoTagInset}px` : undefined }}
      >
        <StepChip>{t('activityDetail.stepNumber', { number: stepNumber })}</StepChip>
        {/* Stretched to the row and centred, so a one-line step sits mid-pill;
            the row stays flex-start so a wrapped step keeps its chip on top. */}
        <Box sx={{ flex: 1, minWidth: 0, alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
          {/* Figma (My Favorite No): the student work is 14. */}
          <MathTypography
            variant="smallBodyText"
            sx={{ color: navy }}
            text={isTeacher ? withWorkMark(text, status) : studentWorkText(text)}
          />
        </Box>
        {showTag && (
          <EvidenceTagSlot>
            <FavoriteNoTag>{t('activityFlow.facilitate.favoriteNoTag')}</FavoriteNoTag>
          </EvidenceTagSlot>
        )}
      </StepRow>
    </ReviewSlot>
  );
}

/* ── Compare the Thinking ─────────────────────────────────────────────── */

export function CompareThinkingPanel({
  facilitate,
  ...props
}: ArtifactPanelProps & { facilitate: ICompareFacilitate }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const titleId = React.useId();
  const view = useArtifactView(props);
  const { isTeacher } = view;
  const strategies = isTeacher
    ? teacherStrategyOrder(facilitate.strategies)
    : facilitate.strategies;

  return (
    <FlowCard component="section" aria-labelledby={titleId}>
      <ArtifactHeader titleId={titleId} title={props.template.artifactTitle} view={view} />
      <ContentPanel>
        <Box
          sx={{
            textAlign: 'center',
            pb: `${theme.sizing.space3}px`,
            borderBottom: `${theme.borders.borderWidth}px solid`,
            borderColor: 'designSystem.background.navyBlue',
          }}
        >
          <Typography variant="rubikBody" sx={{ color: navy }}>
            {t('activityFlow.facilitate.problem')}
          </Typography>
          <ReviewSlot paths="content.facilitate.problem">
            <MathTypography variant="headingMd" sx={{ color: navy }} text={facilitate.problem} />
          </ReviewSlot>
        </Box>
        <Stack
          direction={props.screenSize === ScreenSize.SMALL ? 'column' : 'row'}
          spacing={`${theme.sizing.space8}px`}
          divider={
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'designSystem.background.navyBlue' }} />
          }
        >
          {strategies.map((strategy) => {
            // The teacher view reorders the strategies: paths use the stored order.
            const strategyPath = `content.facilitate.strategies[${facilitate.strategies.indexOf(strategy)}]`;
            return (
              <Stack key={strategy.label} spacing={`${theme.sizing.space1}px`} sx={{ flex: 1, minWidth: 0 }}>
                <ReviewSlot paths={fieldsOf(strategyPath, ['verdict', 'label'])}>
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    spacing={`${theme.sizing.space2}px`}
                  >
                    <ColumnBadge
                      isCorrect={strategy.verdict !== 'INCORRECT'}
                      isRevealed={isTeacher && strategy.verdict !== null}
                    >
                      {strategy.label}
                    </ColumnBadge>
                    {isTeacher && strategy.verdict && (
                      <VerdictChip tone={strategy.verdict === 'INCORRECT' ? 'wrong' : 'correct'}>
                        {t(`activityFlow.facilitate.strategyVerdict.${strategy.verdict}`)}
                      </VerdictChip>
                    )}
                  </Stack>
                </ReviewSlot>
                {strategy.steps.map((step, stepIndex) => {
                  let mark = '';
                  if (isTeacher && step.highlight === 'ERROR') mark = '✗';
                  if (isTeacher && step.highlight === 'SUCCESS') mark = '✓';
                  return (
                    <ReviewSlot
                      key={step.step}
                      paths={fieldsOf(`${strategyPath}.steps[${stepIndex}]`, ['text', 'highlight', 'step'])}
                    >
                      <StepRow
                        isError={isTeacher && step.highlight === 'ERROR'}
                        isCorrect={isTeacher && step.highlight === 'SUCCESS'}
                        sx={{ pt: 0, pl: 0 }}
                      >
                        <StepChip>{t('activityDetail.stepNumber', { number: step.step })}</StepChip>
                        <Box sx={{ flex: 1, minWidth: 0, alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
                          <MathTypography variant="rubikBody" sx={{ color: navy }} text={step.text} suffix={mark} />
                        </Box>
                      </StepRow>
                    </ReviewSlot>
                  );
                })}
                {isTeacher &&
                  strategy.notes.map((note) => (
                    <ReviewSlot
                      key={`${note.heading ?? ''}${note.text.slice(0, 24)}`}
                      paths={fieldsOf(`${strategyPath}.notes[${strategy.notes.indexOf(note)}]`, ['text', 'heading', 'tone'])}
                    >
                      <Stack
                        direction="row"
                        alignItems="flex-start"
                        spacing={`${theme.sizing.space1}px`}
                        sx={{ pt: `${theme.sizing.space1}px` }}
                      >
                        <ToneIcon tone={note.tone} />
                        <Box sx={{ minWidth: 0 }}>
                          {/* Figma (Compare the Thinking Teacher2): "WHY IT WORKS:" Rubik 16/500, text 16. */}
                          {note.heading && (
                            <Typography variant="rubikLabel" sx={{ color: navy, textTransform: 'uppercase' }}>
                              <MathText text={note.heading.replace(/:$/, '')} inline />:
                            </Typography>
                          )}
                          <MathTypography variant="rubikBody" sx={{ color: navy }} text={note.text} />
                        </Box>
                      </Stack>
                    </ReviewSlot>
                  ))}
              </Stack>
            );
          })}
        </Stack>
      </ContentPanel>
    </FlowCard>
  );
}

/* ── Make Your Case ───────────────────────────────────────────────────── */

const CLAIM_OPTIONS = ['TRUE', 'FALSE', 'CONDITIONAL'] as const;
const VOTE_OPTIONS = ['YES', 'NO', 'UNDECIDED'] as const;

/** Student view: a heading pill over its numbered list. */
function NumberedList({
  title,
  items,
  pathOf,
}: {
  title: string;
  items: string[];
  // Each item's path in the activity, for the review layer.
  pathOf: (index: number) => string;
}) {
  return (
    <StudentColumn>
      <SectionPill>{title}</SectionPill>
      <StudentList>
        {items.map((item, index) => (
          <StudentListItem key={item}>
            <StepBadge aria-hidden>{index + 1}</StepBadge>
            <ReviewSlot paths={pathOf(index)}>
              <MathTypography variant="rubikBody" component="span" sx={{ color: navy }} text={item} />
            </ReviewSlot>
          </StudentListItem>
        ))}
      </StudentList>
    </StudentColumn>
  );
}

/*
 * DevQA MakeYourCase_Teacher / _Student: one box, the claim and its options
 * over a hairline, then the teacher's examples to bring in, or the students'
 * steps and examples side by side. The generated arguments aren't in the
 * frame and aren't shown here (they stay in the teacher PDF).
 */
export function MakeYourCasePanel({
  facilitate,
  ...props
}: ArtifactPanelProps & { facilitate: IMakeYourCaseFacilitate }) {
  const { t } = useTranslation();
  const titleId = React.useId();
  const view = useArtifactView(props);
  const { isTeacher } = view;
  const { resolution } = facilitate;

  return (
    <FlowCard component="section" aria-labelledby={titleId}>
      <ArtifactHeader titleId={titleId} title={props.template.artifactTitle} view={view} />
      <ClaimBox>
        <ClaimBoxSection>
          <ClaimHeading>
            <Typography variant="rubikBody">{t('activityFlow.facilitate.claim')}</Typography>
            <ReviewSlot paths="content.facilitate.claim">
              <MathTypography variant="headingMd" text={`"${facilitate.claim}"`} />
            </ReviewSlot>
          </ClaimHeading>
          <ClaimOptions>
            {isTeacher
              ? CLAIM_OPTIONS.map((option) => {
                  const label = t(`activityFlow.facilitate.claimOption.${option}`);
                  if (option !== resolution.verdict) {
                    return (
                      <Typography key={option} variant="rubikBody">
                        {label}
                      </Typography>
                    );
                  }
                  return (
                    <ClaimAnswerBand key={option}>
                      <Typography variant="rubikBody">{`${label} ✓`}</Typography>
                      <Typography variant="rubikLabel">{t('activityFlow.facilitate.why')}</Typography>
                      <ReviewSlot paths={['content.facilitate.resolution.why', 'content.facilitate.resolution.verdict']}>
                        <MathTypography variant="rubikBody" text={resolution.why} />
                      </ReviewSlot>
                    </ClaimAnswerBand>
                  );
                })
              : VOTE_OPTIONS.map((option) => (
                  <Typography key={option} variant="rubikBody">
                    {t(`activityFlow.facilitate.voteOption.${option}`)}
                  </Typography>
                ))}
          </ClaimOptions>
        </ClaimBoxSection>

        <ClaimBoxSection isDivided>
          {isTeacher ? (
            <>
              <SectionPill>{t('activityFlow.facilitate.examplesToBringIn')}</SectionPill>
              <BringInList>
                {facilitate.examples.map((example, index) => (
                  <BringInItem key={example.prompt}>
                    <ReviewSlot paths={`content.facilitate.examples[${index}].prompt`}>
                      <MathTypography variant="rubikBody" text={`${index + 1}. ${example.prompt}`} />
                    </ReviewSlot>
                    <ReviewSlot paths={`content.facilitate.examples[${index}].answer`}>
                      <MathTypography
                        variant="rubikBody"
                        text={t('activityFlow.facilitate.exampleAnswer', { answer: example.answer })}
                      />
                    </ReviewSlot>
                  </BringInItem>
                ))}
              </BringInList>
            </>
          ) : (
            <StudentColumns screenSize={props.screenSize}>
              <NumberedList
                title={t('activityFlow.facilitate.stepsToFollow')}
                items={facilitate.studentSteps}
                pathOf={(index) => `content.facilitate.studentSteps[${index}]`}
              />
              <NumberedList
                title={t('activityFlow.facilitate.examplesToTry')}
                items={facilitate.examples.map((example) => example.prompt)}
                pathOf={(index) => `content.facilitate.examples[${index}].prompt`}
              />
            </StudentColumns>
          )}
        </ClaimBoxSection>
      </ClaimBox>
    </FlowCard>
  );
}

/* ── Math Detective ───────────────────────────────────────────────────── */

export function MathDetectivePanel({
  facilitate,
  ...props
}: ArtifactPanelProps & { facilitate: IMathDetectiveFacilitate }) {
  const { t } = useTranslation();
  const titleId = React.useId();
  const view = useArtifactView(props);
  const { isTeacher } = view;
  const [index, setIndex] = React.useState(0);
  const { examples, issue } = facilitate;
  const example = examples[index];
  // Older activities have no per-step notes, so their teacher view keeps the
  // right/wrong marks and shows the solution alone.
  const hasNotes = hasDetectiveNotes(example);
  const copy = 'activityFlow.facilitate.detective';

  const steps = (example?.workSummary ?? []).map((line, lineIndex) => ({
    ...line,
    number: lineIndex + 1,
    text: isTeacher && !hasNotes ? withWorkMark(line.text, line.status) : line.text,
    isMarked: isTeacher && hasNotes && Boolean(line.isEvidence),
  }));

  const examplePath = `content.facilitate.examples[${index}]`;
  const linePath = (step: (typeof steps)[number]) => `${examplePath}.workSummary[${step.number - 1}]`;
  const stepRow = (step: (typeof steps)[number]) => (
    <ReviewSlot key={step.number} paths={fieldsOf(linePath(step), ['text', 'status', 'isEvidence'])}>
      <StepRow isEvidence={step.isMarked}>
        <StepChip>{t('activityDetail.stepNumber', { number: step.number })}</StepChip>
        {/* Stretched and centred, so a one-line step sits mid-row beside its note box. */}
        <Box sx={{ flex: 1, minWidth: 0, alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
          <MathTypography
            variant="smallBodyText"
            boldMath={step.isMarked}
            sx={step.isMarked ? { fontWeight: 600 } : undefined}
            text={step.text}
          />
        </Box>
      </StepRow>
    </ReviewSlot>
  );

  // Teacher view: the step's note, or "-" when it has none.
  const teacherNote = (step: (typeof steps)[number]) => {
    const isKey = step.note?.kind === 'KEY_EVIDENCE';
    return (
      <ReviewSlot paths={fieldsOf(`${linePath(step)}.note`, ['text', 'kind'])}>
        <DetectiveNoteBox isKey={isKey}>
          {/* Figma: the note at 12. */}
          <Typography variant="microLabel" component="div">
            {isKey && <strong>{t(`${copy}.keyEvidence`)} </strong>}
            {step.note ? <MathText text={step.note.text} inline /> : '-'}
          </Typography>
        </DetectiveNoteBox>
      </ReviewSlot>
    );
  };

  const columnLabel = (key: string) => (
    <Typography variant="rubikSubBold" sx={{ textTransform: 'uppercase' }}>
      {t(`${copy}.${key}`)}
    </Typography>
  );

  // Each step beside its box: the teacher's note, or the student's space to write.
  // An older activity's teacher view has no notes, so it shows the steps alone.
  const showsBoxes = !isTeacher || hasNotes;
  const isSmall = props.screenSize === ScreenSize.SMALL;

  return (
    <FlowCard component="section" aria-labelledby={titleId}>
      <ArtifactHeader
        titleId={titleId}
        title={props.template.artifactTitle}
        titleAside={t('activityFlow.facilitate.anonymousResponse')}
        view={view}
      />
      <DetectiveSection>
        <DetectiveSectionHeading>
          <Typography variant="headingMd" component="h3">{t(`${copy}.evidenceTitle`)}</Typography>
          <Typography variant="microLabel">{t(`${copy}.evidenceSubtitle`)}</Typography>
        </DetectiveSectionHeading>
        {issue && (
          <DetectiveCard>
            <Typography variant="headingSm">
              {t(`${copy}.${isTeacher ? 'focusTeacher' : 'focusStudent'}`)}
            </Typography>
            <ReviewSlot paths="content.facilitate.issue">
              <Typography variant="smallBodyText" component="div">
                <strong>{t(`${copy}.issue`)}</strong>{' '}
                <MathText text={issue} inline />
              </Typography>
            </ReviewSlot>
          </DetectiveCard>
        )}
        <DetectiveCard>
          <Typography variant="headingSm">{t(`${copy}.findEvidence`)}</Typography>
          <Typography variant="smallBodyText">
            {t(`${copy}.${isTeacher ? 'findEvidenceTeacher' : 'findEvidenceStudent'}`)}
          </Typography>
        </DetectiveCard>
        <ExamplePicker
          count={examples.length}
          index={index}
          onSelect={setIndex}
          screenSize={props.screenSize}
          renderTile={(tileIndex) => (
            <>
              <Typography variant="headingMdBold" component="span">
                {t('activityFlow.facilitate.exampleLabel', { number: tileIndex + 1 })}
              </Typography>
              <ExampleQuestion boldMath variant="rubikSubBold" component="span" text={examples[tileIndex].problem} />
              <ReviewCountFlag prefix={`content.facilitate.examples[${tileIndex}]`} />
            </>
          )}
        />
        {example && (
          <DetectiveExample aria-live="polite">
            <ExampleOfHeading index={index} count={examples.length} />
            <ReviewSlot paths={fieldsOf(examplePath, ['prompt', 'problem'])}>
              <ExampleQuestion boldMath variant="rubikSubBold" text={example.prompt} />
            </ReviewSlot>
            {showsBoxes ? (
              <DetectiveColumn>
                <EvidenceNoteRow screenSize={props.screenSize}>
                  <EvidenceNoteCell>{columnLabel(isTeacher ? 'solutionTeacher' : 'solutionStudent')}</EvidenceNoteCell>
                  {!isSmall && (
                    <EvidenceNoteCell>{columnLabel(isTeacher ? 'teacherNotes' : 'yourEvidenceNotes')}</EvidenceNoteCell>
                  )}
                </EvidenceNoteRow>
                {steps.map((step) => (
                  <EvidenceNoteRow key={step.number} screenSize={props.screenSize}>
                    <EvidenceNoteCell>{stepRow(step)}</EvidenceNoteCell>
                    <EvidenceNoteCell>
                      {isTeacher ? teacherNote(step) : <EvidenceNoteLines aria-hidden />}
                    </EvidenceNoteCell>
                  </EvidenceNoteRow>
                ))}
              </DetectiveColumn>
            ) : (
              <DetectiveColumn>
                {columnLabel('solutionTeacher')}
                {steps.map(stepRow)}
              </DetectiveColumn>
            )}
          </DetectiveExample>
        )}
      </DetectiveSection>
      {example && (
        <DetectiveSection>
          <DetectiveSectionHeading>
            <Typography variant="headingMd" component="h3">
              {t(`${copy}.${isTeacher ? 'stagesTitleTeacher' : 'stagesTitleStudent'}`)}
            </Typography>
            <Typography variant="microLabel">
              {t(`${copy}.${isTeacher ? 'stagesSubtitleTeacher' : 'stagesSubtitleStudent'}`)}
            </Typography>
          </DetectiveSectionHeading>
          {example.stages.map((stage, stageIndex) => {
            const stagePath = `${examplePath}.stages[${stageIndex}]`;
            return (
              <DetectiveCard key={stage.kind}>
                <Typography variant="headingSm">
                  {t(`activityFlow.facilitate.stage.${stage.kind}`)}
                </Typography>
                <ReviewSlot paths={fieldsOf(stagePath, ['ask', 'kind'])}>
                  <MathTypography variant="rubikBody" text={stage.ask} />
                </ReviewSlot>
                {isTeacher && (
                  <PotentialAnswer>
                    {/* Figma: the label 13/600 over the answer at 12. */}
                    <Typography variant="microLabel" sx={{ fontSize: 13, fontWeight: 600 }}>
                      {t(`${copy}.potentialAnswer`)}
                    </Typography>
                    <ReviewSlot paths={`${stagePath}.answer`}>
                      <MathTypography variant="microLabel" text={stage.answer} />
                    </ReviewSlot>
                  </PotentialAnswer>
                )}
              </DetectiveCard>
            );
          })}
        </DetectiveSection>
      )}
      <ExamplePager index={index} count={examples.length} onChange={setIndex} />
    </FlowCard>
  );
}

/* ── My Favorite No ───────────────────────────────────────────────────── */

export function FavoriteNoPanel({
  facilitate,
  ...props
}: ArtifactPanelProps & { facilitate: IFavoriteNoFacilitate }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const titleId = React.useId();
  const view = useArtifactView(props);
  const { isTeacher } = view;
  const [index, setIndex] = React.useState(0);
  const { examples } = facilitate;
  const example = examples[index];
  // PRESERVE first, as the frame lists what the reasoning gets right before what changes.
  const notice = example
    ? [...example.notice].sort((a, b) => Number(a.kind === 'REVISE') - Number(b.kind === 'REVISE'))
    : [];
  // The prompt asks for one INCORRECT line; tag only the first if there are more.
  const tagIndex = example ? example.work.findIndex((line) => line.status === 'INCORRECT') : -1;

  return (
    <FlowCard component="section" aria-labelledby={titleId}>
      <ArtifactHeader titleId={titleId} title={props.template.artifactTitle} view={view} />
      <ExamplePicker
        count={examples.length}
        index={index}
        onSelect={setIndex}
        screenSize={props.screenSize}
        renderTile={(tileIndex) => (
          <>
            <Typography variant="headingMdBold" component="span">
              {t('activityFlow.facilitate.exampleLabel', { number: tileIndex + 1 })}
            </Typography>
            <ExampleQuestion boldMath variant="rubikSubBold" component="span" text={examples[tileIndex].problem} />
            <ReviewCountFlag prefix={`content.facilitate.examples[${tileIndex}]`} />
          </>
        )}
      />
      {example && (
        <ExampleDetail aria-live="polite">
          <ExampleOfHeading index={index} count={examples.length} />
          <ReviewSlot paths={fieldsOf(`content.facilitate.examples[${index}]`, ['prompt', 'problem'])}>
            <ExampleQuestion boldMath variant="rubikSubBold" text={example.prompt} />
          </ReviewSlot>
          <Stack
            direction={props.screenSize === ScreenSize.SMALL ? 'column' : 'row'}
            spacing={`${theme.sizing.space5}px`}
          >
            <Stack spacing={`${theme.sizing.space0}px`} sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="rubikSubBold" sx={{ color: navy }}>
                {t('activityFlow.facilitate.studentWork')}
              </Typography>
              {example.work.map((line, lineIndex) => (
                <WorkLine
                  key={line.text}
                  text={line.text}
                  status={line.status}
                  isTeacher={isTeacher}
                  path={`content.facilitate.examples[${index}].work[${lineIndex}]`}
                  stepNumber={lineIndex + 1}
                  showTag={isTeacher && lineIndex === tagIndex}
                />
              ))}
            </Stack>
            {isTeacher && (
              <Stack spacing={`${theme.sizing.space1}px`} sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="rubikSubBold" sx={{ color: navy }}>
                  {t('activityFlow.facilitate.whatToNotice')}
                </Typography>
                {notice.map((item) => (
                  <ReviewSlot
                    key={item.text}
                    // Sorted for display: the path uses the stored order.
                    paths={fieldsOf(`content.facilitate.examples[${index}].notice[${example.notice.indexOf(item)}]`, ['text', 'kind'])}
                  >
                    <Stack direction="row" alignItems="flex-start" spacing={`${theme.sizing.space1}px`}>
                      <ToneIcon tone={item.kind === 'PRESERVE' ? 'SUCCESS' : 'ERROR'} />
                      <MathTypography variant="smallBodyText" sx={{ color: navy }} text={item.text} />
                    </Stack>
                  </ReviewSlot>
                ))}
              </Stack>
            )}
          </Stack>
        </ExampleDetail>
      )}
      <ExamplePager index={index} count={examples.length} onChange={setIndex} />
    </FlowCard>
  );
}
