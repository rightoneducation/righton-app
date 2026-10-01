import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MathTypography from '../MathTypography';
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
          <MathTypography
            variant="headingMd"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
            text={content.boardPrompt.problem}
          />
          <MathTypography
            variant="rubikBody"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
            text={content.boardPrompt.instruction}
          />
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
          <MathTypography
            variant="headingMd"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
            text={example.title}
          />
          <MathTypography
            variant="headingSm"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
            text={example.sourceLabel}
          />
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={`${theme.sizing.space5}px`}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <MathTypography
              variant="rubikSubBold"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
              text={example.studentWorkLabel}
            />
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
                <MathTypography
                  variant="smallBodyText"
                  sx={{ color: 'designSystem.surface.atlanticNavy' }}
                  text={
                    line.showMark === false
                      ? line.text
                      : withWorkMark(line.text, line.status)
                  }
                />
              </StepRow>
            ))}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <MathTypography
              variant="rubikSubBold"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
              text={example.whatToNoticeLabel}
            />
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
                <MathTypography
                  variant="smallBodyText"
                  sx={{ color: 'designSystem.surface.atlanticNavy' }}
                  text={note.text}
                />
              </Stack>
            ))}
          </Box>
        </Stack>
      </ContentPanel>

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
