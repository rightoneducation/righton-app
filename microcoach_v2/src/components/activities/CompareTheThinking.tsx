import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { ICompareContent } from '../../lib/PipelineModels';
import {
  ContentPanel,
  TonedPanel,
  StepChip,
  StepRow,
  NumberBadge,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';

interface Props {
  content: ICompareContent;
  isTeacherView: boolean;
}

export default function CompareTheThinking({ content, isTeacherView }: Props) {
  const theme = useTheme();

  return (
    <ContentPanel>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="rubikBody"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {content.problemLabel}
        </Typography>
        <Typography
          variant="headingMd"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {content.problem}
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {content.columns.map((column) => (
          <Box key={column.label} sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <NumberBadge
                sx={{
                  backgroundColor: column.isCorrect
                    ? 'designSystem.status.understood'
                    : 'designSystem.status.needsSupport',
                  color: 'designSystem.background.navyBlue',
                }}
              >
                {column.label}
              </NumberBadge>
              {/* Student view hides the verdict, the error highlight and the
                  annotation — it is the same board without the answers. */}
              {isTeacherView && (
                <StepChip
                  sx={{
                    backgroundColor: column.isCorrect
                      ? 'designSystem.status.lightGreen'
                      : 'designSystem.status.error',
                  }}
                >
                  {column.verdict}
                </StepChip>
              )}
            </Stack>

            {column.steps.map((step) => (
              <StepRow
                key={step.step}
                isError={isTeacherView && step.isError}
                isCorrect={isTeacherView && column.isCorrect && step.step === 4}
                sx={{ mt: `${theme.sizing.space1}px` }}
              >
                <StepChip>{`Step ${step.step}`}</StepChip>
                <Typography
                  variant="smallBodyText"
                  sx={{ color: 'designSystem.surface.atlanticNavy' }}
                >
                  {step.text}
                </Typography>
              </StepRow>
            ))}

            {isTeacherView && (
              <Typography
                variant="rubikBody"
                sx={{
                  mt: `${theme.sizing.space2}px`,
                  color: 'designSystem.surface.atlanticNavy',
                }}
              >
                {column.annotation}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>

      <TonedPanel tone="grey">
        <Typography
          variant="smallBodyText"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {content.keyTakeaway.label}
        </Typography>
        <Typography
          variant="rubikBody"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {content.keyTakeaway.text}
        </Typography>
      </TonedPanel>
    </ContentPanel>
  );
}
