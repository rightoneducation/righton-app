import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ContentRow from '../components/ContentRow';
import { ScreenSize } from '../lib/MicroCoachModels';
import { UploadStepProps } from '../lib/UploadModels';
import { formatWeekLabel } from '../lib/weeks';
import { SignUpCta } from '../lib/styledcomponents/SignUpStyledComponents';
import {
  GhostAction,
  SummaryCard,
  SummaryCardBody,
  SummaryCardHeader,
  SummaryRow,
} from '../lib/styledcomponents/UploadStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';

/** The confirmation step: what is about to be submitted, and for whom. */
export default function UploadRtdReview({
  screenSize,
  upload,
  actions,
  user,
  classrooms,
}: UploadStepProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { userProfile } = user;

  const isReady = useAllReady(useI18nReady());

  // Reached without both files — send them back rather than confirm nothing.
  if (!upload.exemplar || !upload.responses) {
    return <Navigate to="/upload-rtd" replace />;
  }
  if (!isReady) return null;

  const className =
    classrooms.classrooms.find((c) => c.id === classrooms.selectedClassId)
      ?.name ?? t('upload.noClass');
  const teacherName = [userProfile?.firstName, userProfile?.lastName]
    .filter(Boolean)
    .join(' ');

  const rows = [
    {
      label: t('upload.teacher'),
      value: [teacherName, userProfile?.email].filter(Boolean).join(' · '),
    },
    { label: t('upload.class'), value: className },
    {
      label: t('upload.week'),
      value: formatWeekLabel(upload.weekStart, t, i18n.language),
    },
    { label: t('upload.ppqExemplar'), value: upload.exemplar.name },
    { label: t('upload.ppqResponses'), value: upload.responses.name },
  ];

  const handleSubmit = () => {
    actions.submit();
    navigate('/reflect');
  };

  return (
    <ContentRow
      screenSize={screenSize}
      columnWidth={theme.sizing.reviewContentMaxWidth}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: `${theme.sizing.space5}px`,
        pt: `${theme.sizing.space8}px`,
        pb: `${theme.sizing.space12}px`,
      }}
    >
      <Typography
        variant="h1"
        sx={{ color: 'designSystem.surface.atlanticNavy', textAlign: 'center' }}
      >
        {t('upload.reviewTitle')}
      </Typography>
      <Typography
        variant="bodyLg"
        sx={{
          color: 'designSystem.surface.atlanticNavy',
          textAlign: 'center',
        }}
      >
        {t('upload.reviewBody')}
      </Typography>

      <SummaryCard>
        <SummaryCardHeader>
          {/* Reversed out on the navy band, not navy on white. */}
          <Typography variant="subheadingLg">{t('upload.uploaded')}</Typography>
        </SummaryCardHeader>

        <SummaryCardBody>
          {rows.map((row) => (
            <SummaryRow key={row.label} screenSize={screenSize}>
              <Typography
                variant="submissionLabel"
                sx={{ color: 'designSystem.surface.atlanticNavy' }}
              >
                {row.label}
              </Typography>
              <Typography
                variant="submissionLabelLight"
                sx={{ color: 'designSystem.surface.atlanticNavy' }}
              >
                {row.value}
              </Typography>
            </SummaryRow>
          ))}
        </SummaryCardBody>
      </SummaryCard>

      <Stack
        direction={screenSize === ScreenSize.LARGE ? 'row' : 'column'}
        spacing={`${theme.sizing.space3}px`}
        sx={{ alignItems: 'center' }}
      >
        <GhostAction disableElevation onClick={() => navigate('/upload-rtd')}>
          {t('upload.backToUpload')}
        </GhostAction>
        {/* Figma: 262 wide here rather than 240 — the label is longer. */}
        <SignUpCta
          disableElevation
          onClick={handleSubmit}
          sx={{ maxWidth: 262 }}
        >
          {t('upload.submit')}
        </SignUpCta>
      </Stack>
    </ContentRow>
  );
}
