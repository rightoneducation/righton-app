import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { IFavoriteNoContent } from '../../lib/PipelineModels';
import {
  ContentPanel,
  TonedPanel,
  StepRow,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';

interface Props {
  content: IFavoriteNoContent;
}

export default function FavoriteNo({ content }: Props) {
  const theme = useTheme();
  const { suggestedExample: example } = content;

  return (
    <Stack spacing={`${theme.sizing.space4}px`}>
      <TonedPanel tone="sky">
        <Typography
          variant="headingMd"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {content.boardPrompt.problem}
        </Typography>
        <Typography
          variant="rubikBody"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {content.boardPrompt.instruction}
        </Typography>
      </TonedPanel>

      <ContentPanel>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1}
        >
          <Typography
            variant="headingMd"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {example.title}
          </Typography>
          <Typography
            variant="rubikSubBold"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {example.sourceLabel}
          </Typography>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="rubikSubBold"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {example.studentWorkLabel}
            </Typography>
            {example.studentWork.map((line) => (
              <StepRow
                key={line.text}
                isError={line.status === 'INCORRECT'}
                isCorrect={line.status === 'CORRECT'}
                sx={{ mt: `${theme.sizing.space0}px` }}
              >
                <Typography
                  variant="smallBodyText"
                  sx={{ color: 'designSystem.surface.atlanticNavy' }}
                >
                  {line.text}
                </Typography>
              </StepRow>
            ))}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="rubikSubBold"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {example.whatToNoticeLabel}
            </Typography>
            {example.whatToNotice.map((note) => (
              <Stack
                key={note.text}
                direction="row"
                alignItems="flex-start"
                spacing={1}
                sx={{ mt: `${theme.sizing.space1}px` }}
              >
                {note.status === 'CORRECT' ? (
                  <CheckCircleIcon
                    fontSize="small"
                    sx={{ color: 'designSystem.status.success' }}
                  />
                ) : (
                  <ErrorIcon
                    fontSize="small"
                    sx={{ color: 'designSystem.status.errorStroke' }}
                  />
                )}
                <Typography
                  variant="smallBodyText"
                  sx={{ color: 'designSystem.surface.atlanticNavy' }}
                >
                  {note.text}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Stack>
      </ContentPanel>

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
