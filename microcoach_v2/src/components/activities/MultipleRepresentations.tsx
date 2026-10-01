import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import MathText from '../MathText';
import MathTypography from '../MathTypography';
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
                  <MathText text={column} inline />
                </RepHeadCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join(',')}>
                {row.map((cell, index) => (
                  <RepBodyCell key={`${row.join(',')}-${columns[index]}`}>
                    <MathText text={String(cell)} inline />
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
      <MathTypography
        variant="headingMd"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
        text={item.value ?? item.lineLabel}
      />
      {item.detail && (
        <MathTypography
          variant="rubikBody"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
          text={item.detail}
        />
      )}
      {item.plottedPoints && (
        <MathTypography
          variant="smallBodyText"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
          text={item.plottedPoints.join('  ·  ')}
        />
      )}
    </Box>
  );
}

export default function MultipleRepresentations({ content }: Props) {
  const theme = useTheme();

  return (
    <Stack spacing={`${theme.sizing.space4}px`}>
      <TonedPanel tone="greyDeep">
        <MathTypography
          variant="rubikLabelSm"
          sx={{ color: 'designSystem.foreground.slateGrey' }}
          text={content.studentTaskLabel}
        />
        <MathTypography
          variant="rubikBody"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
          text={`"${content.studentTask}"`}
        />
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
              <MathTypography
                variant="rubikLabel"
                sx={{ color: 'designSystem.background.navyBlue' }}
                text={item.label}
              />
              <VerdictChip tone={item.matches ? 'match' : 'noMatch'}>
                {item.matchLabel}
              </VerdictChip>
            </Stack>
            <RepresentationBody item={item} />
          </ContentPanel>
        ))}
      </Box>

      <MathTypography
        variant="headingMdBold"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
        text={content.teachingNotesLabel}
      />
      {content.teachingNotes.map((note) => (
        <Stack key={note.order} direction="row" spacing={2}>
          <NumberBadge>{note.order}</NumberBadge>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <MathTypography
              variant="rubikLabel"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
              text={note.title}
            />
            <MathTypography
              variant="rubikBody"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
              text={note.body}
            />
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
