import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IosShareIcon from '@mui/icons-material/IosShare';
import MathTypography from '../MathTypography';
import { GroupingOptions } from '../GroupingChips';
import {
  IActivityContent,
  ISpotTheSlipFacilitate,
} from '../../lib/ActivityContentModels';
import { IActivityTemplateCopy } from '../../lib/activityTemplates';
import formatStepAnnotation from '../../lib/activityMarks';
import exportActivityPdf, { PdfAudience } from '../../lib/pdf/exportActivityPdf';
import { DurationChip } from '../../lib/styledcomponents/ChooseActivityStyledComponents';
import {
  StepChip,
  StepRow,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';
import {
  ExampleDetail,
  ExampleSteps,
  ExampleTile,
  ExampleTiles,
  ExamplesToolbar,
  ExportButton,
  FlowCard,
  FlowCardHeader,
  FlowCardTitle,
  PagerButton,
  PagerRow,
  PhaseCards,
  RunBadge,
  RunGrid,
  RunStepItem,
  RunStepText,
  RunStepTitleRow,
  ScreenSizeProps,
  SlipChip,
  ToggleGroup,
  ViewPillOption,
  ViewPillToggle,
} from '../../lib/styledcomponents/ActivityFlowStyledComponents';

interface PanelProps extends ScreenSizeProps {
  content: IActivityContent;
  template: IActivityTemplateCopy;
  misconceptionTitle: string;
}

/**
 * Spot the Slip's worked examples (InflowScreens/Facilitate_Teacher, _Student).
 * The examples sit side by side as tiles; picking one, or Prev / Next, shows
 * it in full below. Teacher view adds each example's slip, the step
 * annotations and the final outcome; student view is only what the class
 * sees. Export gives the PDF for the current view.
 */
function SpotTheSlipPanel({
  facilitate,
  content,
  template,
  misconceptionTitle,
  screenSize,
}: PanelProps & { facilitate: ISpotTheSlipFacilitate }) {
  const { t } = useTranslation();
  const [audience, setAudience] = React.useState<PdfAudience>('teacher');
  const [exampleIndex, setExampleIndex] = React.useState(0);
  const [isExporting, setIsExporting] = React.useState(false);

  const isTeacher = audience === 'teacher';
  const { examples } = facilitate;
  const example = examples[exampleIndex];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportActivityPdf({
        audience,
        content,
        facilitate,
        template,
        misconceptionTitle,
        t,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <FlowCard component="section" aria-labelledby="examples-title">
      <Typography id="examples-title" variant="headingMd" component="h2">
        {template.artifactTitle}
      </Typography>

      <ExamplesToolbar>
        <ToggleGroup>
          <ViewPillToggle role="group" aria-label={t('activityFlow.facilitate.viewLabel')}>
            <ViewPillOption
              isActive={isTeacher}
              aria-pressed={isTeacher}
              onClick={() => setAudience('teacher')}
            >
              {t('activityFlow.facilitate.teacherView')}
            </ViewPillOption>
            <ViewPillOption
              isActive={!isTeacher}
              aria-pressed={!isTeacher}
              onClick={() => setAudience('student')}
            >
              {t('activityFlow.facilitate.studentView')}
            </ViewPillOption>
          </ViewPillToggle>
          <Typography variant="microLabel">
            {t('activityFlow.facilitate.viewNote')}
          </Typography>
        </ToggleGroup>
        <ExportButton
          disableElevation
          disabled={isExporting}
          endIcon={<IosShareIcon />}
          onClick={handleExport}
        >
          {(() => {
            if (isExporting) return t('activityFlow.facilitate.exporting');
            return isTeacher
              ? t('activityFlow.facilitate.exportTeacher')
              : t('activityFlow.facilitate.exportStudent');
          })()}
        </ExportButton>
      </ExamplesToolbar>

      <ExampleTiles screenSize={screenSize}>
        {examples.map((item, index) => (
          <ExampleTile
            key={item.prompt}
            isSelected={index === exampleIndex}
            aria-pressed={index === exampleIndex}
            onClick={() => setExampleIndex(index)}
          >
            <Typography variant="headingMdBold" component="span">
              {t('activityFlow.facilitate.exampleLabel', { number: index + 1 })}
            </Typography>
            <MathTypography variant="rubikSubBold" component="span" text={item.problem} />
            {isTeacher && (
              <SlipChip>
                <span>
                  <strong>{t('activityFlow.facilitate.slip')}</strong>
                  {`: ${item.slip}`}
                </span>
              </SlipChip>
            )}
          </ExampleTile>
        ))}
      </ExampleTiles>

      {example && (
        <ExampleDetail aria-live="polite">
          <Typography variant="headingMdBold" component="h3">
            {t('activityFlow.facilitate.exampleLabel', { number: exampleIndex + 1 })}
            <Typography component="span" variant="headingMd" sx={{ fontWeight: 400 }}>
              {` ${t('activityFlow.facilitate.ofTotal', { total: examples.length })}`}
            </Typography>
          </Typography>
          <MathTypography variant="rubikSubBold" text={example.prompt} />
          <ExampleSteps>
            {example.steps.map((step) => {
              const annotation =
                isTeacher && step.annotation
                  ? formatStepAnnotation(step.annotation, t)
                  : null;
              return (
                <StepRow
                  key={step.step}
                  isError={isTeacher && step.annotation?.kind === 'ERROR'}
                >
                  <StepChip>
                    {t('activityDetail.stepNumber', { number: step.step })}
                  </StepChip>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <MathTypography
                      variant="smallBodyText"
                      text={step.text}
                      suffix={annotation}
                    />
                  </Box>
                </StepRow>
              );
            })}
          </ExampleSteps>
          {/* The frame keeps FINAL in student view too; it gives the slip
              away, so it follows the student PDF and stays teacher-only. */}
          {isTeacher && (
            <MathTypography
              variant="outcomeLabel"
              sx={{ textTransform: 'uppercase' }}
              text={`${t('activityFlow.facilitate.final')} ${example.finalOutcome}`}
            />
          )}
        </ExampleDetail>
      )}

      {examples.length > 1 && (
        <PagerRow>
          <PagerButton
            startIcon={<ArrowBackIcon />}
            disabled={exampleIndex === 0}
            onClick={() => setExampleIndex((index) => Math.max(index - 1, 0))}
          >
            {t('activityFlow.facilitate.prev')}
          </PagerButton>
          <PagerButton
            endIcon={<ArrowForwardIcon />}
            disabled={exampleIndex === examples.length - 1}
            onClick={() =>
              setExampleIndex((index) => Math.min(index + 1, examples.length - 1))
            }
          >
            {t('activityFlow.facilitate.next')}
          </PagerButton>
        </PagerRow>
      )}
    </FlowCard>
  );
}

/**
 * Facilitate activity: how to run it, then the template's own artifact. Only
 * Spot the Slip's is built so far; the other templates' panels follow.
 */
export default function FacilitateView({
  content,
  template,
  misconceptionTitle,
  screenSize,
}: PanelProps) {
  const { t } = useTranslation();
  const { facilitate, howToRun } = content;

  return (
    <PhaseCards>
      <FlowCard component="section" aria-labelledby="how-to-run-title">
        <FlowCardHeader>
          <FlowCardTitle>
            <Typography id="how-to-run-title" variant="headingLg" component="h2">
              {t('activityFlow.facilitate.title')}
            </Typography>
            <Typography variant="rubikBody">
              {t('activityFlow.facilitate.subtitle')}
            </Typography>
          </FlowCardTitle>
          <DurationChip>{content.durations.facilitate}</DurationChip>
        </FlowCardHeader>
        <RunGrid screenSize={screenSize} rows={Math.ceil(howToRun.length / 2)}>
          {howToRun.map((step, index) => (
            <RunStepItem key={step.title}>
              <RunBadge aria-hidden>{index + 1}</RunBadge>
              <RunStepText>
                <RunStepTitleRow>
                  <MathTypography variant="rubikSubBold" component="h3" text={step.title} />
                  <GroupingOptions groupings={step.groupings} />
                </RunStepTitleRow>
                <MathTypography variant="smallBodyText" text={step.body} />
              </RunStepText>
            </RunStepItem>
          ))}
        </RunGrid>
      </FlowCard>

      {facilitate.type === 'INCORRECT_WORKED_EXAMPLES' ? (
        <SpotTheSlipPanel
          facilitate={facilitate}
          content={content}
          template={template}
          misconceptionTitle={misconceptionTitle}
          screenSize={screenSize}
        />
      ) : (
        <FlowCard component="section" aria-labelledby="examples-title">
          <Typography id="examples-title" variant="headingMd" component="h2">
            {template.artifactTitle}
          </Typography>
          <Typography variant="rubikBody">{t('activityFlow.materialsComing')}</Typography>
        </FlowCard>
      )}
    </PhaseCards>
  );
}
