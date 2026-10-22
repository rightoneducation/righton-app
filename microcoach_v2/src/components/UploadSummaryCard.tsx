import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ScreenSize } from '../lib/MicroCoachModels';
import { UploadStepProps } from '../lib/UploadModels';
import { formatSchoolWeek } from '../lib/weeks';
import {
  SummaryCard,
  SummaryCardBody,
  SummaryCardHeader,
  SummaryRow,
} from '../lib/styledcomponents/UploadStyledComponents';

type UploadSummaryCardProps = Pick<
  UploadStepProps,
  'screenSize' | 'upload' | 'classrooms' | 'teacher'
>;

/**
 * "UPLOADED": what is being (review) or has been (submitted) sent — teacher,
 * class, week and both files. Figma (Upload4/5): grey labels left, navy values
 * right, the teacher's name over their email.
 */
export default function UploadSummaryCard({
  screenSize,
  upload,
  classrooms,
  teacher,
}: UploadSummaryCardProps) {
  const { t, i18n } = useTranslation();
  const isLarge = screenSize === ScreenSize.LARGE;
  const teacherName = [teacher?.firstName, teacher?.lastName]
    .filter(Boolean)
    .join(' ');
  const className =
    classrooms.find((classroom) => classroom.id === upload.classId)?.name ?? '';

  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: t('upload.teacher'),
      value: (
        <>
          {teacherName}
          {teacher?.email && (
            <Box component="span" sx={{ display: 'block', fontWeight: 400 }}>
              {teacher.email}
            </Box>
          )}
        </>
      ),
    },
    { label: t('upload.class'), value: className },
    {
      label: t('upload.week'),
      value: formatSchoolWeek(upload.weekStart, t, i18n.language, 'upload.weekOption'),
    },
    { label: t('upload.exemplar'), value: upload.exemplar?.name },
    { label: t('upload.responses'), value: upload.responses?.name },
  ];

  return (
    <SummaryCard>
      <SummaryCardHeader>
        <Typography variant="subheadingLg" sx={{ letterSpacing: '0.03em' }}>
          {t('upload.uploaded')}
        </Typography>
      </SummaryCardHeader>
      <SummaryCardBody>
        {rows.map((row) => (
          <SummaryRow key={row.label} screenSize={screenSize}>
            <Typography
              variant="submissionLabel"
              sx={{ color: 'designSystem.surface.ashyGray', letterSpacing: '0.05em' }}
            >
              {row.label}
            </Typography>
            <Typography
              variant="submissionLabel"
              sx={{
                color: 'designSystem.surface.atlanticNavy',
                letterSpacing: '0.05em',
                textAlign: isLarge ? 'right' : 'left',
                overflowWrap: 'anywhere',
              }}
            >
              {row.value}
            </Typography>
          </SummaryRow>
        ))}
      </SummaryCardBody>
    </SummaryCard>
  );
}
