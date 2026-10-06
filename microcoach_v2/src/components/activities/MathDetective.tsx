import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MathTypography from '../MathTypography';
import { IMathDetectiveContent } from '../../lib/PipelineModels';
import {
  ContentPanel,
  TonedPanel,
  PromptBand,
  PromptIconTile,
  NumberBadge,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';

interface Props {
  content: IMathDetectiveContent;
}

export default function MathDetective({ content }: Props) {
  const theme = useTheme();

  return (
    <Stack spacing={`${theme.sizing.space5}px`}>
      <PromptBand tone="sky">
        <PromptIconTile>
          <LocalHospitalOutlinedIcon />
        </PromptIconTile>
        <Box sx={{ minWidth: 0 }}>
          <MathTypography
            variant="headingMd"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
            text={content.problem}
          />
          <MathTypography
            variant="rubikBody"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
            text={content.problemChecklist}
          />
        </Box>
      </PromptBand>

      {content.steps.map((step) => (
        <ContentPanel key={step.step}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <NumberBadge>{step.step}</NumberBadge>
            <MathTypography
              variant="headingSm"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
              text={step.title}
            />
          </Stack>

          <TonedPanel tone="grey">
            <MathTypography
              variant="headingSm"
              sx={{ color: 'designSystem.background.navyBlue' }}
              text={step.askLabel}
            />
            <MathTypography
              variant="rubikBody"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
              text={`"${step.ask}"`}
            />
          </TonedPanel>

          <TonedPanel tone="periwinkle">
            <MathTypography
              variant="headingSm"
              sx={{ color: 'designSystem.background.navyBlue' }}
              text={step.responseLabel}
            />
            <MathTypography
              variant="rubikBody"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
              text={step.response}
            />
          </TonedPanel>
        </ContentPanel>
      ))}

      <PromptBand tone="grey">
        <InfoOutlinedIcon
          sx={{ color: 'designSystem.surface.atlanticNavy', flexShrink: 0 }}
        />
        <MathTypography
          variant="rubikBody"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
          text={content.footnote}
        />
      </PromptBand>
    </Stack>
  );
}
