import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MathTypography from '../MathTypography';
import {
  ICompareFacilitate,
  IFavoriteNoFacilitate,
  IMakeYourCaseFacilitate,
  IMathDetectiveFacilitate,
  Tone,
} from '../../lib/ActivityContentModels';
import { WorkStatus } from '../../lib/PipelineModels';
import { withWorkMark } from '../../lib/activityMarks';
import { ScreenSize } from '../../lib/MicroCoachModels';
import {
  ColumnBadge,
  ContentPanel,
  PromptBand,
  StepChip,
  StepRow,
  TonedPanel,
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
  ExampleDetail,
  ExampleHeaderBox,
  ExampleHeaderText,
  ExampleIconTile,
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

/*
 * The Facilitate artifact for Compare the Thinking, Make Your Case, Math
 * Detective and My Favorite No (microcoach-assets/Activities/Activities/
 * <Template>/<Template>_Facilitate_Teacher / _Student). Spot the Slip's lives in
 * FacilitateView. Teacher view adds answers and teaching notes; student view is
 * only what the class sees, and the PDF export follows whichever is on.
 */

const navy = 'designSystem.surface.atlanticNavy';

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

/** A line of student work: tinted and marked in teacher view, plain for students. */
function WorkLine({
  text,
  status,
  isTeacher,
}: {
  text: string;
  status: WorkStatus;
  isTeacher: boolean;
}) {
  return (
    <StepRow
      isError={isTeacher && status === 'INCORRECT'}
      isCorrect={isTeacher && status === 'CORRECT'}
      // These rows carry no step chip, so neither the pill radius nor its
      // 29px floor apply.
      sx={{ px: 1, borderRadius: 0, minHeight: 0 }}
    >
      {/* Figma (My Favorite No): the student work is 14. */}
      <MathTypography
        variant="smallBodyText"
        sx={{ color: navy }}
        text={isTeacher ? withWorkMark(text, status) : text}
      />
    </StepRow>
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
          <MathTypography variant="headingMd" sx={{ color: navy }} text={facilitate.problem} />
        </Box>
        <Stack
          direction={props.screenSize === ScreenSize.SMALL ? 'column' : 'row'}
          spacing={`${theme.sizing.space8}px`}
          divider={
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'designSystem.background.navyBlue' }} />
          }
        >
          {facilitate.strategies.map((strategy) => (
            <Stack key={strategy.label} spacing={`${theme.sizing.space1}px`} sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={`${theme.sizing.space2}px`}>
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
              {strategy.steps.map((step) => {
                let mark = '';
                if (isTeacher && step.highlight === 'ERROR') mark = '✗';
                if (isTeacher && step.highlight === 'SUCCESS') mark = '✓';
                return (
                  <StepRow
                    key={step.step}
                    isError={isTeacher && step.highlight === 'ERROR'}
                    isCorrect={isTeacher && step.highlight === 'SUCCESS'}
                  >
                    <StepChip>{t('activityDetail.stepNumber', { number: step.step })}</StepChip>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <MathTypography variant="rubikBody" sx={{ color: navy }} text={step.text} suffix={mark} />
                    </Box>
                  </StepRow>
                );
              })}
              {isTeacher &&
                strategy.notes.map((note) => (
                  <Stack
                    key={`${note.heading ?? ''}${note.text.slice(0, 24)}`}
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
                          {`${note.heading.replace(/:$/, '')}:`}
                        </Typography>
                      )}
                      <MathTypography variant="rubikBody" sx={{ color: navy }} text={note.text} />
                    </Box>
                  </Stack>
                ))}
            </Stack>
          ))}
        </Stack>
      </ContentPanel>
    </FlowCard>
  );
}

/* ── Make Your Case ───────────────────────────────────────────────────── */

const CLAIM_OPTIONS = ['TRUE', 'FALSE', 'CONDITIONAL'] as const;
const VOTE_OPTIONS = ['YES', 'NO', 'UNDECIDED'] as const;

/** Student view: a heading pill over its numbered list. */
function NumberedList({ title, items }: { title: string; items: string[] }) {
  return (
    <StudentColumn>
      <SectionPill>{title}</SectionPill>
      <StudentList>
        {items.map((item, index) => (
          <StudentListItem key={item}>
            <StepBadge aria-hidden>{index + 1}</StepBadge>
            <MathTypography variant="rubikBody" component="span" sx={{ color: navy }} text={item} />
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
            <MathTypography variant="headingMd" text={`"${facilitate.claim}"`} />
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
                      <MathTypography variant="rubikBody" text={resolution.why} />
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
                {facilitate.examples.map((example) => (
                  <BringInItem key={example.prompt}>
                    <MathTypography variant="rubikBody" text={example.prompt} />
                    <MathTypography
                      variant="rubikBody"
                      text={t('activityFlow.facilitate.exampleAnswer', { answer: example.answer })}
                    />
                  </BringInItem>
                ))}
              </BringInList>
            </>
          ) : (
            <StudentColumns screenSize={props.screenSize}>
              <NumberedList title={t('activityFlow.facilitate.stepsToFollow')} items={facilitate.studentSteps} />
              <NumberedList
                title={t('activityFlow.facilitate.examplesToTry')}
                items={facilitate.examples.map((example) => example.prompt)}
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
  const { examples } = facilitate;
  const example = examples[index];
  const workLine = (lines: typeof example.workSummary) =>
    lines.map((line) => (isTeacher ? withWorkMark(line.text, line.status) : line.text)).join('   ');

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
            <MathTypography variant="rubikSubBold" component="span" text={examples[tileIndex].problem} />
            <MathTypography variant="smallBodyText" component="span" text={workLine(examples[tileIndex].workSummary)} />
          </>
        )}
      />
      {example && (
        <ExampleDetail aria-live="polite">
          <ExampleOfHeading index={index} count={examples.length} />
          {/* DevQA MathDetective: the pencil tile, then the problem (Poppins
              20/600) over the work in one line (Rubik 16), marked in teacher view. */}
          <ExampleHeaderBox>
            <ExampleIconTile aria-hidden>
              <EditIcon />
            </ExampleIconTile>
            <ExampleHeaderText>
              <MathTypography variant="headingMd" text={example.prompt} />
              <MathTypography variant="rubikBody" text={workLine(example.workSummary)} />
            </ExampleHeaderText>
          </ExampleHeaderBox>
          {example.stages.map((stage) => (
            <ContentPanel key={stage.kind}>
              <Typography variant="headingSm" sx={{ color: navy }}>
                {t(`activityFlow.facilitate.stage.${stage.kind}`)}
              </Typography>
              <TonedPanel tone="grey">
                {isTeacher && (
                  <Typography variant="rubikSubBold" sx={{ color: 'designSystem.background.navyBlue' }}>
                    {t('activityFlow.facilitate.askStudents')}
                  </Typography>
                )}
                <MathTypography variant="rubikBody" sx={{ color: navy }} text={`"${stage.ask}"`} />
              </TonedPanel>
              {isTeacher && (
                <TonedPanel tone="periwinkle">
                  <Typography variant="rubikSubBold" sx={{ color: 'designSystem.background.navyBlue' }}>
                    {t(`activityFlow.facilitate.stageAnswer.${stage.kind}`)}
                  </Typography>
                  <MathTypography variant="rubikBody" sx={{ color: navy }} text={stage.answer} />
                </TonedPanel>
              )}
            </ContentPanel>
          ))}
        </ExampleDetail>
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
            <MathTypography variant="rubikSubBold" component="span" text={examples[tileIndex].problem} />
          </>
        )}
      />
      {example && (
        <ExampleDetail aria-live="polite">
          <ExampleOfHeading index={index} count={examples.length} />
          {/* Figma (My Favorite No Teacher): Poppins 16/600. */}
          <Typography variant="headingSm">{t('activityFlow.facilitate.anonymousResponse')}</Typography>
          <MathTypography variant="rubikSubBold" text={example.prompt} />
          <Stack
            direction={props.screenSize === ScreenSize.SMALL ? 'column' : 'row'}
            spacing={`${theme.sizing.space5}px`}
          >
            <Stack spacing={`${theme.sizing.space0}px`} sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="rubikSubBold" sx={{ color: navy }}>
                {t('activityFlow.facilitate.studentWork')}
              </Typography>
              {example.work.map((line) => (
                <WorkLine key={line.text} text={line.text} status={line.status} isTeacher={isTeacher} />
              ))}
            </Stack>
            {isTeacher && (
              <Stack spacing={`${theme.sizing.space1}px`} sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="rubikSubBold" sx={{ color: navy }}>
                  {t('activityFlow.facilitate.whatToNotice')}
                </Typography>
                {notice.map((item) => (
                  <Stack key={item.text} direction="row" alignItems="flex-start" spacing={`${theme.sizing.space1}px`}>
                    <ToneIcon tone={item.kind === 'PRESERVE' ? 'SUCCESS' : 'ERROR'} />
                    <MathTypography variant="smallBodyText" sx={{ color: navy }} text={item.text} />
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
          {isTeacher && (
            <PromptBand tone="grey">
              <InfoOutlinedIcon sx={{ color: navy, flexShrink: 0 }} />
              <MathTypography variant="rubikBody" sx={{ color: navy }} text={example.sourceNote} />
            </PromptBand>
          )}
        </ExampleDetail>
      )}
      <ExamplePager index={index} count={examples.length} onChange={setIndex} />
    </FlowCard>
  );
}
