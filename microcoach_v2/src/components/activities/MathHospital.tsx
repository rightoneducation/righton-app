import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IMathHospitalContent } from '../../lib/PipelineModels';
import {
  ContentPanel,
  TonedPanel,
  PromptBand,
  PromptIconTile,
  NumberBadge,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';

interface Props {
  content: IMathHospitalContent;
}

export default function MathHospital({ content }: Props) {
  const theme = useTheme();

  return (
    <Stack spacing={`${theme.sizing.space5}px`}>
      <PromptBand tone="sky">
        <PromptIconTile>
          <LocalHospitalOutlinedIcon />
        </PromptIconTile>
        <Box sx={{ minWidth: 0 }}>
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
        </Box>
      </PromptBand>

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
              variant="headingSm"
              sx={{ color: 'designSystem.background.navyBlue' }}
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

          <TonedPanel tone="periwinkle">
            <Typography
              variant="headingSm"
              sx={{ color: 'designSystem.background.navyBlue' }}
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

      <PromptBand tone="grey">
        <InfoOutlinedIcon
          sx={{ color: 'designSystem.surface.atlanticNavy', flexShrink: 0 }}
        />
        <Typography
          variant="rubikBody"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {content.footnote}
        </Typography>
      </PromptBand>
    </Stack>
  );
}
