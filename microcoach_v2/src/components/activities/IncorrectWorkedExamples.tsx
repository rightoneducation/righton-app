import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { IWorkedExamplesContent } from '../../lib/PipelineModels';
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
  const theme = useTheme();

  return (
    <Stack spacing={`${theme.sizing.space4}px`}>
      {content.examples.map((example) => (
        <ContentPanel key={example.label}>
          <Typography
            variant="headingMd"
            sx={{ fontWeight: 700, color: 'designSystem.surface.atlanticNavy' }}
          >
            {example.label}
          </Typography>
          <Typography
            variant="rubikSubBold"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {example.prompt}
          </Typography>

          {example.steps.map((step) => (
            <StepRow key={step.step} isError={isTeacherView && step.isError}>
              <StepChip>{`Step ${step.step}`}</StepChip>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="smallBodyText"
                  sx={{ color: 'designSystem.surface.atlanticNavy' }}
                >
                  {step.text}
                </Typography>
                {isTeacherView && step.errorNote && (
                  <Typography
                    variant="smallBodyText"
                    sx={{ color: 'designSystem.status.errorStroke' }}
                  >
                    {` ← (${step.errorNote})`}
                  </Typography>
                )}
              </Box>
            </StepRow>
          ))}

          {isTeacherView && (
            <Typography
              variant="rubikSubBold"
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
