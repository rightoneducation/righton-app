import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import MathTypography from '../MathTypography';
import { ICompareContent, IExampleStep } from '../../lib/PipelineModels';
import {
  ColumnBadge,
  ContentPanel,
  PromptBand,
  StepChip,
  StepRow,
  VerdictChip,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';

interface Props {
  content: ICompareContent;
  isTeacherView: boolean;
}

/**
 * This template marks a step with a bare glyph rather than the parenthesised
 * note the worked-example template uses — the columns are narrow and the
 * verdict chip above already names the outcome. Same annotation model, a
 * different presentation of it.
 */
function stepMark(step: IExampleStep): string {
  if (!step.annotation) return '';
  return step.annotation.kind === 'ERROR' ? '✗' : '✓';
}

export default function CompareTheThinking({ content, isTeacherView }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ContentPanel>
      {/* Figma stacks two bordered boxes sharing an edge at y 733, which reads
          as one panel split by a rule. */}
      <Box
        sx={{
          textAlign: 'center',
          pb: `${theme.sizing.space3}px`,
          borderBottom: `${theme.borders.borderWidth}px solid`,
          borderColor: 'designSystem.background.navyBlue',
        }}
      >
        <MathTypography
          variant="rubikBody"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
          text={content.problemLabel}
        />
        <MathTypography
          variant="headingMd"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
          text={content.problem}
        />
      </Box>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={`${theme.sizing.space11}px`}
        // Figma: a 1px navy rule at x 822, dead centre between the columns.
        // Stack's own divider collapses correctly when they stack at xs.
        divider={
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: 'designSystem.background.navyBlue' }}
          />
        }
      >
        {content.columns.map((column) => (
          <Box key={column.label} sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={`${theme.sizing.space2}px`}
            >
              <ColumnBadge
                isCorrect={column.isCorrect}
                isRevealed={isTeacherView}
              >
                {column.label}
              </ColumnBadge>
              {isTeacherView && (
                <VerdictChip tone={column.isCorrect ? 'correct' : 'wrong'}>
                  {column.verdict}
                </VerdictChip>
              )}
            </Stack>

            {column.steps.map((step) => {
              const mark = isTeacherView ? stepMark(step) : '';

              return (
                <StepRow
                  key={step.step}
                  isError={isTeacherView && step.annotation?.kind === 'ERROR'}
                  isCorrect={
                    isTeacherView && step.annotation?.kind === 'CORRECT'
                  }
                  sx={{ mt: `${theme.sizing.space1}px` }}
                >
                  <StepChip>
                    {t('activityDetail.stepNumber', { number: step.step })}
                  </StepChip>
                  <MathTypography
                    variant="smallBodyText"
                    sx={{ color: 'designSystem.surface.atlanticNavy' }}
                    text={step.text}
                    suffix={mark}
                  />
                </StepRow>
              );
            })}

            {isTeacherView && (
              <Stack
                direction="row"
                alignItems="flex-start"
                spacing={`${theme.sizing.space1}px`}
                sx={{ mt: `${theme.sizing.space2}px` }}
              >
                {column.isCorrect ? (
                  <CheckCircleIcon
                    fontSize="small"
                    sx={{ color: 'designSystem.status.success' }}
                  />
                ) : (
                  <ErrorIcon
                    fontSize="small"
                    sx={{ color: 'designSystem.status.errorIcon' }}
                  />
                )}
                <MathTypography
                  variant="rubikBody"
                  sx={{ color: 'designSystem.surface.atlanticNavy' }}
                  text={column.annotation}
                />
              </Stack>
            )}
          </Box>
        ))}
      </Stack>

      {/* The student frame closes on the takeaway with its blank still open;
          the teacher frame shows the per-column reasoning instead. */}
      {!isTeacherView && (
        <PromptBand tone="grey">
          <Box sx={{ minWidth: 0 }}>
            <MathTypography
              variant="rubikBody"
              sx={{
                display: 'block',
                color: 'designSystem.surface.atlanticNavy',
              }}
              text={content.keyTakeaway.label}
            />
            <MathTypography
              variant="rubikBody"
              sx={{
                display: 'block',
                color: 'designSystem.surface.atlanticNavy',
              }}
              text={content.keyTakeaway.text}
            />
          </Box>
        </PromptBand>
      )}
    </ContentPanel>
  );
}
