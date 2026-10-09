import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
  NumberBadge,
  PromptBand,
  StepChip,
  StepRow,
  TonedPanel,
  VerdictChip,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';
import { ExampleDetail, FlowCard } from '../../lib/styledcomponents/ActivityFlowStyledComponents';
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
function WorkLine({ text, status, isTeacher }: { text: string; status: WorkStatus; isTeacher: boolean }) {
  return (
    <StepRow
      isError={isTeacher && status === 'INCORRECT'}
      isCorrect={isTeacher && status === 'CORRECT'}
      // These rows carry no step chip, so neither the pill radius nor its
      // 29px floor apply.
      sx={{ px: 1, borderRadius: 0, minHeight: 0 }}
    >
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
                      <MathTypography variant="smallBodyText" sx={{ color: navy }} text={step.text} suffix={mark} />
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
                      {note.heading && (
                        <Typography variant="rubikSubBold" sx={{ color: navy, textTransform: 'uppercase' }}>
                          {note.heading}
                        </Typography>
                      )}
                      <MathTypography variant="smallBodyText" sx={{ color: navy }} text={note.text} />
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

function NumberedList({ title, items }: { title: string; items: string[] }) {
  const theme = useTheme();
  return (
    <ContentPanel>
      <Typography variant="headingSm" sx={{ color: navy }}>
        {title}
      </Typography>
      {items.map((item, index) => (
        <Stack key={item} direction="row" alignItems="center" spacing={`${theme.sizing.space2}px`}>
          <NumberBadge>{index + 1}</NumberBadge>
          <MathTypography variant="rubikBody" sx={{ color: navy }} text={item} />
        </Stack>
      ))}
    </ContentPanel>
  );
}

export function MakeYourCasePanel({
  facilitate,
  ...props
}: ArtifactPanelProps & { facilitate: IMakeYourCaseFacilitate }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const titleId = React.useId();
  const view = useArtifactView(props);
  const { isTeacher } = view;
  const { resolution } = facilitate;

  return (
    <FlowCard component="section" aria-labelledby={titleId}>
      <ArtifactHeader titleId={titleId} title={props.template.artifactTitle} view={view} />
      <PromptBand tone="sky">
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="rubikBody" sx={{ color: navy }}>
            {t('activityFlow.facilitate.claim')}
          </Typography>
          <MathTypography variant="headingMd" sx={{ color: navy }} text={`"${facilitate.claim}"`} />
        </Box>
      </PromptBand>

      {isTeacher ? (
        <>
          <Stack spacing={`${theme.sizing.space1}px`}>
            {CLAIM_OPTIONS.map((option) => {
              const isResolution = option === resolution.verdict;
              return (
                <TonedPanel key={option} tone={isResolution ? 'periwinkle' : 'grey'}>
                  <Typography variant="rubikSubBold" sx={{ color: navy }}>
                    {t(`activityFlow.facilitate.claimOption.${option}`)}
                    {isResolution ? ' ✓' : ''}
                  </Typography>
                  {isResolution && (
                    <>
                      <Typography variant="rubikSubBold" sx={{ color: navy }}>
                        {t('activityFlow.facilitate.why')}
                      </Typography>
                      <MathTypography variant="smallBodyText" sx={{ color: navy }} text={resolution.why} />
                    </>
                  )}
                </TonedPanel>
              );
            })}
          </Stack>

          <ContentPanel>
            <Typography variant="headingSm" sx={{ color: navy }}>
              {t('activityFlow.facilitate.examplesToBringIn')}
            </Typography>
            {facilitate.examples.map((example) => (
              <Box key={example.prompt}>
                <MathTypography variant="rubikSubBold" sx={{ color: navy }} text={example.prompt} />
                <MathTypography
                  variant="smallBodyText"
                  sx={{ color: navy }}
                  text={t('activityFlow.facilitate.exampleAnswer', { answer: example.answer })}
                />
              </Box>
            ))}
          </ContentPanel>

          {/* Not in the frame: the generated arguments on both sides, kept for
              the teacher rather than dropped. */}
          <ContentPanel>
            <Typography variant="headingSm" sx={{ color: navy }}>
              {t('activityFlow.facilitate.argumentsTitle')}
            </Typography>
            {facilitate.arguments.map((argument) => (
              <TonedPanel key={argument.text.slice(0, 40)} tone="grey">
                <Box>
                  <VerdictChip tone={argument.stance === 'SUPPORT' ? 'correct' : 'wrong'} sx={{ display: 'inline-flex' }}>
                    {t(`activityFlow.facilitate.argumentStance.${argument.stance}`)}
                  </VerdictChip>
                </Box>
                <MathTypography variant="smallBodyText" sx={{ color: navy }} text={argument.text} />
              </TonedPanel>
            ))}
          </ContentPanel>
        </>
      ) : (
        <>
          <Stack direction="row" flexWrap="wrap" gap={`${theme.sizing.space2}px`}>
            {VOTE_OPTIONS.map((option) => (
              <StepChip key={option}>{t(`activityFlow.facilitate.voteOption.${option}`)}</StepChip>
            ))}
          </Stack>
          <NumberedList title={t('activityFlow.facilitate.stepsToFollow')} items={facilitate.studentSteps} />
          <NumberedList
            title={t('activityFlow.facilitate.examplesToTry')}
            items={facilitate.examples.map((example) => example.prompt)}
          />
        </>
      )}
    </FlowCard>
  );
}

/* ── Math Detective ───────────────────────────────────────────────────── */

export function MathDetectivePanel({
  facilitate,
  ...props
}: ArtifactPanelProps & { facilitate: IMathDetectiveFacilitate }) {
  const { t } = useTranslation();
  const theme = useTheme();
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
          <MathTypography variant="rubikSubBold" text={example.prompt} />
          <Stack spacing={`${theme.sizing.space0}px`}>
            {example.workSummary.map((line) => (
              <WorkLine key={line.text} text={line.text} status={line.status} isTeacher={isTeacher} />
            ))}
          </Stack>
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
          <Typography variant="microLabel">{t('activityFlow.facilitate.anonymousResponse')}</Typography>
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
              <MathTypography variant="smallBodyText" sx={{ color: navy }} text={example.sourceNote} />
            </PromptBand>
          )}
        </ExampleDetail>
      )}
      <ExamplePager index={index} count={examples.length} onChange={setIndex} />
    </FlowCard>
  );
}
