import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import HowToVoteOutlinedIcon from '@mui/icons-material/HowToVoteOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MathTypography from '../MathTypography';
import { IMakeYourCaseContent } from '../../lib/PipelineModels';
import {
  ContentPanel,
  TonedPanel,
  PromptBand,
  PromptIconTile,
  StepChip,
  VerdictChip,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';

interface Props {
  content: IMakeYourCaseContent;
  isTeacherView: boolean;
}

/**
 * Make Your Case — the claim and the vote are student-facing; the worked
 * positions and the resolution are not. The template's `views.student` is
 * explicit that students should not be shown the intended resolution or which
 * argument is strongest, so both are gated on `isTeacherView` rather than
 * merely de-emphasised. Same split the compare template makes with its verdicts.
 */
export default function MakeYourCase({ content, isTeacherView }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack spacing={`${theme.sizing.space5}px`}>
      {/* The claim itself — the thing under argument, so it leads. */}
      <PromptBand tone="sky">
        <PromptIconTile>
          <GavelOutlinedIcon />
        </PromptIconTile>
        <Box sx={{ minWidth: 0 }}>
          <MathTypography
            variant="rubikBody"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
            text={content.claim.label}
          />
          <MathTypography
            variant="headingMd"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
            text={content.claim.text}
          />
        </Box>
      </PromptBand>

      {/* Students commit before arguing, which is what gives the revisit step
          something to move. Options render as chips in the order given. */}
      <ContentPanel>
        <Stack direction="row" alignItems="center" spacing={2}>
          <HowToVoteOutlinedIcon
            sx={{ color: 'designSystem.surface.atlanticNavy', flexShrink: 0 }}
          />
          <MathTypography
            variant="headingSm"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
            text={content.initialVote.label}
          />
        </Stack>
        <Stack
          direction="row"
          spacing={`${theme.sizing.space2}px`}
          sx={{ flexWrap: 'wrap', gap: `${theme.sizing.space1}px` }}
        >
          {content.initialVote.options.map((option) => (
            <StepChip key={option}>{option}</StepChip>
          ))}
        </Stack>
      </ContentPanel>

      {/* What counts as a case — the prompts students build an argument from. */}
      <ContentPanel>
        <MathTypography
          variant="headingSm"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
          text={content.evidence.label}
        />
        <Stack spacing={`${theme.sizing.space1}px`}>
          {content.evidence.prompts.map((prompt) => (
            <TonedPanel tone="grey" key={prompt}>
              <MathTypography
                variant="rubikBody"
                sx={{ color: 'designSystem.surface.atlanticNavy' }}
                text={`"${prompt}"`}
              />
            </TonedPanel>
          ))}
        </Stack>
      </ContentPanel>

      {isTeacherView && (
        <>
          {/* Anticipated arguments, with the strongest marked so the teacher
              knows which to steer the discussion towards. */}
          <ContentPanel>
            <Typography
              variant="headingSm"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {t('activityDetail.makeYourCasePositions')}
            </Typography>
            <Stack spacing={`${theme.sizing.space2}px`}>
              {content.positions.map((position) => (
                <TonedPanel
                  tone={position.isStrongest ? 'periwinkle' : 'grey'}
                  key={position.label}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={`${theme.sizing.space1}px`}
                    sx={{ flexWrap: 'wrap' }}
                  >
                    <MathTypography
                      variant="headingSm"
                      sx={{ color: 'designSystem.background.navyBlue' }}
                      text={position.label}
                    />
                    <VerdictChip tone={position.isStrongest ? 'correct' : 'noMatch'}>
                      {position.stance}
                    </VerdictChip>
                  </Stack>
                  <MathTypography
                    variant="rubikBody"
                    sx={{ color: 'designSystem.surface.atlanticNavy' }}
                    text={position.argument}
                  />
                </TonedPanel>
              ))}
            </Stack>
          </ContentPanel>

          <PromptBand tone="periwinkle">
            <PromptIconTile>
              <InfoOutlinedIcon />
            </PromptIconTile>
            <Box sx={{ minWidth: 0 }}>
              <MathTypography
                variant="headingSm"
                sx={{ color: 'designSystem.surface.atlanticNavy' }}
                text={content.resolution.label}
              />
              <MathTypography
                variant="rubikBody"
                sx={{ color: 'designSystem.surface.atlanticNavy' }}
                text={content.resolution.text}
              />
            </Box>
          </PromptBand>
        </>
      )}

      <PromptBand tone="grey">
        <InfoOutlinedIcon
          sx={{ color: 'designSystem.surface.atlanticNavy', flexShrink: 0 }}
        />
        <Box sx={{ minWidth: 0 }}>
          <MathTypography
            variant="rubikBody"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
            text={content.keyTakeaway.label}
          />
          <MathTypography
            variant="headingSm"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
            text={content.keyTakeaway.text}
          />
        </Box>
      </PromptBand>
    </Stack>
  );
}
