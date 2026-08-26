import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AppContentRow from '../components/AppContentRow';
import { ScreenSize } from '../lib/MicroCoachModels';
import { useMicroCoachDataState } from '../hooks/context/useMicroCoachDataContext';
import { useMisconceptions } from '../hooks/useMisconceptions';
import {
  useUploadDispatch,
  useUploadState,
} from '../hooks/context/useUploadContext';
import { SignUpCta } from '../lib/styledcomponents/SignUpStyledComponents';
import {
  SummaryRow,
  UploadCard,
  ScreenSizeProps,
} from '../lib/styledcomponents/UploadStyledComponents';
import { useAllReady, useI18nReady } from '../hooks/readiness';

/** The confirmation step: what is about to be submitted, and for whom. */
export default function UploadRtdReview({ screenSize }: ScreenSizeProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { session } = useMisconceptions();
  const { userProfile } = useMicroCoachDataState();
  const upload = useUploadState();
  const dispatch = useUploadDispatch();
  const isReady = useAllReady(useI18nReady());

  // Reached without both files — send them back rather than confirm nothing.
  if (!upload.exemplar || !upload.responses) {
    return <Navigate to="/upload-rtd" replace />;
  }
  if (!isReady) return null;

  const className =
    session.classes.find((option) => option.id === session.selectedClassId)
      ?.name ?? session.classes[0]?.name;

  const rows = [
    {
      label: t('upload.teacher'),
      value: `${userProfile?.teacherName ?? session.teacher.displayName} · ${
        userProfile?.email ?? session.teacher.email
      }`,
    },
    { label: t('upload.class'), value: className },
    { label: t('upload.week'), value: session.selectedWeek },
    { label: t('upload.ppqExemplar'), value: upload.exemplar.name },
    { label: t('upload.ppqResponses'), value: upload.responses.name },
  ];

  const handleSubmit = () => {
    dispatch({ type: 'SUBMIT' });
    navigate('/reflect');
  };

  return (
    <AppContentRow
      screenSize={screenSize}
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
        variant="smallTitle"
        sx={{
          color: 'designSystem.surface.atlanticNavy',
          textAlign: 'center',
          fontWeight: 400,
        }}
      >
        {t('upload.reviewBody')}
      </Typography>

      <UploadCard sx={{ maxWidth: 1126 }}>
        <Typography
          variant="smallTitle"
          sx={{ color: 'designSystem.surface.atlanticNavy' }}
        >
          {t('upload.uploaded')}
        </Typography>
        {rows.map((row) => (
          <SummaryRow key={row.label} screenSize={screenSize}>
            <Typography
              variant="submissionLabel"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {row.label}
            </Typography>
            <Typography
              variant="submissionLabel"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {row.value}
            </Typography>
          </SummaryRow>
        ))}
      </UploadCard>

      <Stack
        direction={screenSize === ScreenSize.LARGE ? 'row' : 'column'}
        spacing={`${theme.sizing.space3}px`}
        sx={{ alignItems: 'center' }}
      >
        <SignUpCta
          disableElevation
          onClick={() => navigate('/upload-rtd')}
          sx={{
            backgroundColor: 'designSystem.surface.skyBlue',
            color: 'designSystem.background.navyBlue',
            '&:hover': { backgroundColor: 'designSystem.foreground.lightBlue' },
          }}
        >
          {t('upload.backToUpload')}
        </SignUpCta>
        {/* Figma: 262 wide here rather than 240 — the label is longer. */}
        <SignUpCta
          disableElevation
          onClick={handleSubmit}
          sx={{ maxWidth: 262 }}
        >
          {t('upload.submit')}
        </SignUpCta>
      </Stack>
    </AppContentRow>
  );
}
