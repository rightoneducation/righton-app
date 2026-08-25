import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IFavoriteNoContent } from '../../lib/PipelineModels';
import { withWorkMark } from '../../lib/activityMarks';
import {
  ContentPanel,
  PromptBand,
  PromptIconTile,
  StepRow,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';

interface Props {
  content: IFavoriteNoContent;
}

export default function FavoriteNo({ content }: Props) {
  const theme = useTheme();
  const { suggestedExample: example } = content;

  return (
    <Stack spacing={`${theme.sizing.space5}px`}>
      <PromptBand tone="sky">
        <PromptIconTile>
          <EditOutlinedIcon />
        </PromptIconTile>
        <Box sx={{ minWidth: 0 }}>
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
        </Box>
      </PromptBand>

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
            variant="headingSm"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {example.sourceLabel}
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={`${theme.sizing.space5}px`}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="rubikSubBold"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {example.studentWorkLabel}
            </Typography>
            {/* Figma fills every one of these rows — 489 x 18, no radius —
                green for the working that holds up and rose for the step that
                breaks. The first row is filled but carries no tick, which is
                why the mark is a separate decision from the fill. */}
            {example.studentWork.map((line) => (
              <StepRow
                key={line.text}
                isError={line.status === 'INCORRECT'}
                isCorrect={line.status === 'CORRECT'}
                sx={{
                  mt: `${theme.sizing.space0}px`,
                  px: `${theme.sizing.space2}px`,
                  // Square, and sized by the text: these rows carry no step
                  // chip, so neither the pill radius nor its 29px floor apply.
                  borderRadius: 0,
                  minHeight: 0,
                }}
              >
                <Typography
                  variant="smallBodyText"
                  sx={{ color: 'designSystem.surface.atlanticNavy' }}
                >
                  {line.showMark === false
                    ? line.text
                    : withWorkMark(line.text, line.status)}
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
                spacing={`${theme.sizing.space1}px`}
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
                    sx={{ color: 'designSystem.status.errorIcon' }}
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
