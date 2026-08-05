import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import {
  IRepresentation,
  IRepresentationsContent,
} from '../../lib/PipelineModels';
import {
  ContentPanel,
  TonedPanel,
  StepChip,
  NumberBadge,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';

interface Props {
  content: IRepresentationsContent;
}

function RepresentationBody({ item }: { item: IRepresentation }) {
  if (item.rows && item.columns) {
    return (
      <Box>
        <Stack direction="row" justifyContent="space-around">
          {item.columns.map((column) => (
            <Typography
              key={column}
              variant="rubikSubBold"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {column}
            </Typography>
          ))}
        </Stack>
        {item.rows.map((row) => (
          <Stack
            key={row.join(',')}
            direction="row"
            justifyContent="space-around"
          >
            {row.map((cell) => (
              <Typography
                key={`${row.join(',')}-${cell}`}
                variant="rubikBody"
                sx={{ color: 'designSystem.surface.atlanticNavy' }}
              >
                {cell}
              </Typography>
            ))}
          </Stack>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="headingMd"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
      >
        {item.value ?? item.lineLabel}
      </Typography>
      {item.detail && (
        <Typography
          variant="rubikBody"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {item.detail}
        </Typography>
      )}
      {item.plottedPoints && (
        <Typography
          variant="smallBodyText"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {item.plottedPoints.join('  ·  ')}
        </Typography>
      )}
    </Box>
  );
}

export default function MultipleRepresentations({ content }: Props) {
  const theme = useTheme();

  return (
    <Stack spacing={`${theme.sizing.space4}px`}>
      <TonedPanel tone="grey">
        <Typography
          variant="rubikSubBold"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {content.studentTaskLabel}
        </Typography>
        <Typography
          variant="rubikBody"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {`"${content.studentTask}"`}
        </Typography>
      </TonedPanel>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: `${theme.sizing.space4}px`,
        }}
      >
        {content.representations.map((item) => (
          <ContentPanel
            key={item.kind}
            sx={{
              backgroundColor: item.matches
                ? 'designSystem.status.lightGreen'
                : 'designSystem.surface.white',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Typography
                variant="rubikSubBold"
                sx={{ color: 'designSystem.surface.atlanticNavy' }}
              >
                {item.label}
              </Typography>
              <StepChip
                sx={{
                  backgroundColor: item.matches
                    ? 'designSystem.status.understood'
                    : 'designSystem.foreground.accentBlue',
                  color: item.matches
                    ? 'designSystem.background.navyBlue'
                    : 'designSystem.surface.white',
                }}
              >
                {item.matchLabel}
              </StepChip>
            </Stack>
            <RepresentationBody item={item} />
          </ContentPanel>
        ))}
      </Box>

      <Typography
        variant="headingSm"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
      >
        {content.teachingNotesLabel}
      </Typography>
      {content.teachingNotes.map((note) => (
        <Stack key={note.order} direction="row" spacing={2}>
          <NumberBadge>{note.order}</NumberBadge>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="rubikSubBold"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {note.title}
            </Typography>
            <Typography
              variant="rubikBody"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {note.body}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
