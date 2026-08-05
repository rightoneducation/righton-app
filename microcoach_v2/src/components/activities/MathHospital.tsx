import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { IMathHospitalContent } from '../../lib/PipelineModels';
import {
  ContentPanel,
  TonedPanel,
  NumberBadge,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';

interface Props {
  content: IMathHospitalContent;
}

export default function MathHospital({ content }: Props) {
  const theme = useTheme();

  return (
    <Stack spacing={`${theme.sizing.space4}px`}>
      <TonedPanel tone="sky">
        <Typography
          variant="headingMd"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {content.problem}
        </Typography>
        <Typography
          variant="rubikBody"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {content.problemChecklist}
        </Typography>
      </TonedPanel>

      {content.steps.map((step) => (
        <ContentPanel key={step.step}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <NumberBadge>{step.step}</NumberBadge>
            <Typography
              variant="headingSm"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {step.title}
            </Typography>
          </Stack>

          <TonedPanel tone="grey">
            <Typography
              variant="rubikSubBold"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {step.askLabel}
            </Typography>
            <Typography
              variant="rubikBody"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {`"${step.ask}"`}
            </Typography>
          </TonedPanel>

          <TonedPanel tone="sky">
            <Typography
              variant="rubikSubBold"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {step.responseLabel}
            </Typography>
            <Typography
              variant="rubikBody"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {step.response}
            </Typography>
          </TonedPanel>
        </ContentPanel>
      ))}

      <TonedPanel tone="grey">
        <Typography
          variant="smallBodyText"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {content.footnote}
        </Typography>
      </TonedPanel>
    </Stack>
  );
}
