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
  VerdictChip,
  NumberBadge,
  RepTable,
  RepHeadCell,
  RepBodyCell,
} from '../../lib/styledcomponents/ActivityDetailStyledComponents';
import RepresentationGraph from './RepresentationGraph';

interface Props {
  content: IRepresentationsContent;
}

function RepresentationBody({ item }: { item: IRepresentation }) {
  if (item.line && item.axisRange) {
    return <RepresentationGraph item={item} />;
  }

  if (item.rows && item.columns) {
    const { columns, rows } = item;

    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <RepTable>
          <thead>
            <tr>
              {columns.map((column) => (
                <RepHeadCell key={column} scope="col">
                  {column}
                </RepHeadCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join(',')}>
                {row.map((cell, index) => (
                  <RepBodyCell key={`${row.join(',')}-${columns[index]}`}>
                    {cell}
                  </RepBodyCell>
                ))}
              </tr>
            ))}
          </tbody>
        </RepTable>
      </Box>
    );
  }

  // Shared by the Equation and Verbal cards — both carry `value`. The grid
  // stretches sibling cards to a common height, so claiming the leftover space
  // is what lets the content sit centred rather than at the top.
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
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
      <TonedPanel tone="greyDeep">
        <Typography
          variant="rubikLabelSm"
          sx={{ color: 'designSystem.foreground.slateGrey' }}
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
                ? 'designSystem.status.successTint'
                : 'designSystem.background.offWhite',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Typography
                variant="rubikLabel"
                sx={{ color: 'designSystem.background.navyBlue' }}
              >
                {item.label}
              </Typography>
              <VerdictChip tone={item.matches ? 'match' : 'noMatch'}>
                {item.matchLabel}
              </VerdictChip>
            </Stack>
            <RepresentationBody item={item} />
          </ContentPanel>
        ))}
      </Box>

      <Typography
        variant="headingMdBold"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
      >
        {content.teachingNotesLabel}
      </Typography>
      {content.teachingNotes.map((note) => (
        <Stack key={note.order} direction="row" spacing={2}>
          <NumberBadge>{note.order}</NumberBadge>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="rubikLabel"
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
