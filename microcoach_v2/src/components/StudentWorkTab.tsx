import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IStudentWork } from '../lib/PipelineModels';
import {
  ErrorBlock,
  OptionLetterBadge,
  ErrorTagChip,
  StudentNamePill,
  NamePillGroup,
} from '../lib/styledcomponents/MisconceptionModalStyledComponents';
import { CountChip } from '../lib/styledcomponents/UnderstandStyledComponents';

interface StudentWorkTabProps {
  studentWork: IStudentWork | null;
}

export default function StudentWorkTab({ studentWork }: StudentWorkTabProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  if (!studentWork) {
    return (
      <Typography
        variant="bodyText"
        sx={{ color: 'designSystem.surface.ashyGray' }}
      >
        {t('misconceptionModal.noStudentWork')}
      </Typography>
    );
  }

  return (
    <Stack spacing={`${theme.sizing.space4}px`}>
      <Typography
        variant="mediumLabel"
        sx={{ color: 'designSystem.surface.atlanticNavy', fontWeight: 700 }}
      >
        {t('misconceptionModal.errorsByFrequency')}
      </Typography>

      {studentWork.errorsByFrequency.map((bucket) => (
        <ErrorBlock key={bucket.optionLetter}>
          <Stack
            direction="row"
            alignItems="flex-start"
            spacing={`${theme.sizing.space2}px`}
          >
            <OptionLetterBadge>{bucket.optionLetter}</OptionLetterBadge>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="bodyText"
                sx={{
                  fontWeight: 700,
                  color: 'designSystem.surface.atlanticNavy',
                }}
              >
                {bucket.optionSummary}
              </Typography>
              <Typography
                variant="bodyText"
                sx={{
                  mt: `${theme.sizing.space0}px`,
                  color: 'designSystem.surface.atlanticNavy',
                }}
              >
                {bucket.interpretation}
              </Typography>
            </Box>
            <ErrorTagChip>{bucket.errorTag}</ErrorTagChip>
          </Stack>

          <NamePillGroup>
            <Typography
              variant="xsLabel"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {t('misconceptionModal.studentCount', {
                count: bucket.studentCount,
              })}
            </Typography>
            {bucket.students.map((name) => (
              <StudentNamePill key={name} tone="support">
                {name}
              </StudentNamePill>
            ))}
          </NamePillGroup>
        </ErrorBlock>
      ))}

      <Stack
        direction="row"
        alignItems="center"
        spacing={`${theme.sizing.space2}px`}
      >
        <Typography
          variant="mediumLabel"
          sx={{ color: 'designSystem.surface.atlanticNavy', fontWeight: 700 }}
        >
          {studentWork.understoodConcept.sectionTitle}
        </Typography>
        <CountChip>{studentWork.understoodConcept.countChip}</CountChip>
      </Stack>
      <Typography
        variant="xsLabel"
        sx={{ color: 'designSystem.surface.ashyGray' }}
      >
        {studentWork.understoodConcept.subLabel}
      </Typography>
      <NamePillGroup>
        {studentWork.understoodConcept.students.map((name) => (
          <StudentNamePill key={name} tone="understood">
            {name}
          </StudentNamePill>
        ))}
      </NamePillGroup>
    </Stack>
  );
}
