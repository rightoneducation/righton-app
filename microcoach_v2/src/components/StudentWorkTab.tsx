import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IStudentWork } from '../lib/PipelineModels';
import { ScreenSize } from '../lib/MicroCoachModels';
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
  screenSize: ScreenSize;
}

interface UnderstoodConceptSectionProps {
  studentWork: IStudentWork | null;
}

export default function StudentWorkTab({
  studentWork,
  screenSize,
}: StudentWorkTabProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  // Below LARGE the badge and tag chip leave the copy roughly 150px at 393, so
  // they move onto their own row and the copy takes the full width.
  const isStacked = screenSize !== ScreenSize.LARGE;

  if (!studentWork) {
    return (
      <Typography
        variant="smallBodyText"
        sx={{ color: 'designSystem.surface.ashyGray' }}
      >
        {t('misconceptionModal.noStudentWork')}
      </Typography>
    );
  }

  return (
    <Stack spacing={`${theme.sizing.space4}px`}>
      <Typography
        variant="headingSm"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
      >
        {t('misconceptionModal.errorsByFrequency')}
      </Typography>

      {studentWork.errorsByFrequency.map((bucket) => {
        const copy = (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="rubikSubBold"
              sx={{ color: 'designSystem.background.navyBlue' }}
            >
              {bucket.optionSummary}
            </Typography>
            <Typography
              variant="smallBodyText"
              sx={{
                mt: `${theme.sizing.space0}px`,
                color: 'designSystem.background.navyBlue',
              }}
            >
              {bucket.interpretation}
            </Typography>
          </Box>
        );

        return (
          <ErrorBlock key={bucket.optionLetter}>
            {isStacked ? (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={`${theme.sizing.space2}px`}
              >
                <OptionLetterBadge>{bucket.optionLetter}</OptionLetterBadge>
                <ErrorTagChip>{bucket.errorTag}</ErrorTagChip>
              </Stack>
            ) : null}

            {isStacked ? (
              copy
            ) : (
              <Stack
                direction="row"
                alignItems="flex-start"
                spacing={`${theme.sizing.space2}px`}
              >
                <OptionLetterBadge>{bucket.optionLetter}</OptionLetterBadge>
                {copy}
                <ErrorTagChip>{bucket.errorTag}</ErrorTagChip>
              </Stack>
            )}

            <NamePillGroup>
              <Typography
                variant="smallBodyText"
                sx={{ color: 'designSystem.background.navyBlue' }}
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
        );
      })}
    </Stack>
  );
}

/**
 * Sits below the bordered tab panel rather than inside it, matching Wireframe2
 * where the panel's outline closes after the last error block.
 */
export function UnderstoodConceptSection({
  studentWork,
}: UnderstoodConceptSectionProps) {
  const theme = useTheme();

  if (!studentWork) return null;

  const { understoodConcept } = studentWork;

  return (
    <Stack
      spacing={`${theme.sizing.space1}px`}
      // Sits outside the bordered tab panel, so inset it by the panel's border
      // plus padding to line up with the error blocks inside it.
      sx={{
        px: `${theme.sizing.space3 + theme.borders.borderWidth}px`,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={`${theme.sizing.space2}px`}
      >
        <Typography
          variant="headingSm"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {understoodConcept.sectionTitle}
        </Typography>
        <CountChip dense>{understoodConcept.countChip}</CountChip>
      </Stack>
      <Typography
        variant="microLabel"
        sx={{ color: 'designSystem.surface.atlanticNavy' }}
      >
        {understoodConcept.subLabel}
      </Typography>
      <NamePillGroup>
        {understoodConcept.students.map((name) => (
          <StudentNamePill key={name} tone="understood">
            {name}
          </StudentNamePill>
        ))}
      </NamePillGroup>
    </Stack>
  );
}
