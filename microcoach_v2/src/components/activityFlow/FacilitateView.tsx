import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MathTypography from '../MathTypography';
import { GroupingOptions } from '../GroupingChips';
import { ISpotTheSlipFacilitate } from '../../lib/ActivityContentModels';
import formatStepAnnotation from '../../lib/activityMarks';
import { DurationChip } from '../../lib/styledcomponents/ChooseActivityStyledComponents';
import {
  StepChip,
  StepRow,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';
import {
  ExampleDetail,
  ExampleSteps,
  FlowCard,
  FlowCardHeader,
  FlowCardTitle,
  PhaseCards,
  RunBadge,
  RunGrid,
  RunStepItem,
  RunStepText,
  RunStepTitleRow,
  SlipChip,
} from '../../lib/styledcomponents/ActivityFlowStyledComponents';
import {
  ArtifactHeader,
  ArtifactPanelProps,
  ExampleOfHeading,
  ExamplePager,
  ExamplePicker,
  useArtifactView,
} from './ArtifactParts';
import {
  CompareThinkingPanel,
  FavoriteNoPanel,
  MakeYourCasePanel,
  MathDetectivePanel,
} from './FacilitatePanels';

/**
 * Spot the Slip's worked examples (InflowScreens/Facilitate_Teacher, _Student).
 * The examples sit side by side as tiles; picking one, or Prev / Next, shows
 * it in full below. Teacher view adds each example's slip, the step
 * annotations and the final outcome; student view is only what the class
 * sees. Export gives the PDF for the current view.
 */
function SpotTheSlipPanel({
  facilitate,
  ...props
}: ArtifactPanelProps & { facilitate: ISpotTheSlipFacilitate }) {
  const { t } = useTranslation();
  const titleId = React.useId();
  const view = useArtifactView(props);
  const { isTeacher } = view;
  const [exampleIndex, setExampleIndex] = React.useState(0);
  const { examples } = facilitate;
  const example = examples[exampleIndex];

  return (
    <FlowCard component="section" aria-labelledby={titleId}>
      <ArtifactHeader titleId={titleId} title={props.template.artifactTitle} view={view} />

      <ExamplePicker
        count={examples.length}
        index={exampleIndex}
        onSelect={setExampleIndex}
        screenSize={props.screenSize}
        renderTile={(index) => (
          <>
            <Typography variant="headingMdBold" component="span">
              {t('activityFlow.facilitate.exampleLabel', { number: index + 1 })}
            </Typography>
            <MathTypography variant="rubikSubBold" component="span" text={examples[index].problem} />
            {isTeacher && (
              <SlipChip>
                <span>
                  <strong>{t('activityFlow.facilitate.slip')}</strong>
                  {`: ${examples[index].slip}`}
                </span>
              </SlipChip>
            )}
          </>
        )}
      />

      {example && (
        <ExampleDetail aria-live="polite">
          <ExampleOfHeading index={exampleIndex} count={examples.length} />
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

      <ExamplePager index={exampleIndex} count={examples.length} onChange={setExampleIndex} />
    </FlowCard>
  );
}

/** The template's own artifact, by content type. */
function ArtifactPanel(props: ArtifactPanelProps) {
  const { content } = props;
  const { facilitate } = content;
  switch (facilitate.type) {
    case 'INCORRECT_WORKED_EXAMPLES':
      return <SpotTheSlipPanel facilitate={facilitate} {...props} />;
    case 'COMPARE_THE_THINKING':
      return <CompareThinkingPanel facilitate={facilitate} {...props} />;
    case 'MAKE_YOUR_CASE':
      return <MakeYourCasePanel facilitate={facilitate} {...props} />;
    case 'MATH_DETECTIVE':
      return <MathDetectivePanel facilitate={facilitate} {...props} />;
    case 'FAVORITE_NO':
      return <FavoriteNoPanel facilitate={facilitate} {...props} />;
    default:
      return null;
  }
}

/** Facilitate activity: how to run it, then the template's own artifact. */
export default function FacilitateView({
  content,
  template,
  misconceptionTitle,
  screenSize,
}: ArtifactPanelProps) {
  const { t } = useTranslation();
  const { howToRun } = content;
  const runTitleId = React.useId();

  return (
    <PhaseCards>
      <FlowCard component="section" aria-labelledby={runTitleId}>
        <FlowCardHeader>
          <FlowCardTitle>
            <Typography id={runTitleId} variant="headingLg" component="h2">
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

      <ArtifactPanel
        content={content}
        template={template}
        misconceptionTitle={misconceptionTitle}
        screenSize={screenSize}
      />
    </PhaseCards>
  );
}
