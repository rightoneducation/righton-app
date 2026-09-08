import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { IWorkedExamplesContent } from '../../lib/PipelineModels';
import formatStepAnnotation from '../../lib/activityMarks';
import {
  ContentPanel,
  StepChip,
  StepRow,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';

interface Props {
  content: IWorkedExamplesContent;
  isTeacherView: boolean;
}

export default function IncorrectWorkedExamples({
  content,
  isTeacherView,
}: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack spacing={`${theme.sizing.space5}px`}>
      {content.examples.map((example) => (
        <ContentPanel key={example.label}>
          <Typography
            variant="headingMdBold"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {example.label}
          </Typography>
          <Typography
            variant="rubikSubBold"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {example.prompt}
          </Typography>

          <Stack spacing={`${theme.sizing.space1}px`}>
            {example.steps.map((step) => {
              /* Figma runs the annotation on as part of the step's own text
                 run — same family, size and colour — so it is concatenated
                 rather than given its own element. Student view drops it
                 entirely: "Student view shows the problem clean". */
              const annotation =
                isTeacherView && step.annotation
                  ? formatStepAnnotation(step.annotation, t)
                  : null;

              return (
                <StepRow
                  key={step.step}
                  isError={isTeacherView && step.annotation?.kind === 'ERROR'}
                >
                  <StepChip>
                    {t('activityDetail.stepNumber', { number: step.step })}
                  </StepChip>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="smallBodyText"
                      sx={{ color: 'designSystem.surface.atlanticNavy' }}
                    >
                      {annotation ? `${step.text} ${annotation}` : step.text}
                    </Typography>
                  </Box>
                </StepRow>
              );
            })}
          </Stack>

          {isTeacherView && (
            <Typography
              variant="outcomeLabel"
              sx={{
                textTransform: 'uppercase',
                color: 'designSystem.surface.atlanticNavy',
              }}
            >
              {`${example.finalOutcomeLabel} ${example.finalOutcome}`}
            </Typography>
          )}
        </ContentPanel>
      ))}
    </Stack>
  );
}
