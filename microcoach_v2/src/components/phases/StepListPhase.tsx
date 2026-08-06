import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { IPhaseStep } from '../../lib/PipelineModels';
import { NumberBadge } from '../../lib/styledcomponents/ActivityDetailStyledComponents';

interface Props {
  title?: string;
  steps: IPhaseStep[] | null;
  /** Discussion lays its questions out in a row at LARGE; Facilitation stacks. */
  asColumns?: boolean;
}

export default function StepListPhase({ title, steps, asColumns }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  if (!steps || steps.length === 0) {
    return (
      <Typography
        variant="smallBodyText"
        sx={{ color: 'designSystem.surface.ashyGray' }}
      >
        {t('activityDetail.noContent')}
      </Typography>
    );
  }

  return (
    <Stack spacing={`${theme.sizing.space4}px`}>
      {title && (
        <Typography
          variant="headingMd"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {title}
        </Typography>
      )}

      <Stack
        direction={asColumns ? { xs: 'column', md: 'row' } : 'column'}
        spacing={`${theme.sizing.space4}px`}
        alignItems="flex-start"
      >
        {steps.map((step) => (
          <Stack
            key={step.order}
            direction={asColumns ? 'column' : 'row'}
            spacing={asColumns ? 1 : 2}
            sx={{ flex: asColumns ? '1 1 0' : undefined, minWidth: 0 }}
          >
            <NumberBadge>{step.order}</NumberBadge>
            <Stack spacing={`${theme.sizing.space0}px`} sx={{ minWidth: 0 }}>
              <Typography
                variant="rubikBody"
                sx={{
                  fontWeight: 500,
                  color: 'designSystem.surface.atlanticNavy',
                }}
              >
                {step.title}
              </Typography>
              {step.body && (
                <Typography
                  variant="rubikBody"
                  sx={{ color: 'designSystem.surface.atlanticNavy' }}
                >
                  {step.body}
                </Typography>
              )}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
