import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentRow from '../components/ContentRow';
import UploadSummaryCard from '../components/UploadSummaryCard';
import { ScreenSize } from '../lib/MicroCoachModels';
import { UploadStepProps } from '../lib/UploadModels';
import { SignUpCta } from '../lib/styledcomponents/SignUpStyledComponents';
import {
  GhostAction,
  UploadLayout,
} from '../lib/styledcomponents/UploadStyledComponents';
import { useI18nReady } from '../hooks/readiness';

/**
 * Review and submit (Figma Upload4): everything about to be sent, then the
 * submit that uploads both files and starts the analysis. "Back to upload"
 * keeps the picked files.
 */
export default function UploadMiuReview(props: UploadStepProps) {
  const { screenSize, upload, actions } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isI18nReady = useI18nReady();
  const isLarge = screenSize === ScreenSize.LARGE;
  const isSubmitting = upload.submitStatus === 'SUBMITTING';

  if (!isI18nReady) return null;

  const handleSubmit = async () => {
    // Replace, so Back from the success screen cannot resubmit.
    if (await actions.submit()) navigate('/upload-miu/submitted', { replace: true });
  };

  return (
    <UploadLayout screenSize={screenSize}>
      <ContentRow
        screenSize={screenSize}
        columnWidth={theme.sizing.reviewContentMaxWidth}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: `${theme.sizing.space11}px`,
          pt: `${isLarge ? theme.sizing.space14 : theme.sizing.space8}px`,
          pb: `${theme.sizing.space12}px`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: `${theme.sizing.space5}px`,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h1"
            sx={{ color: 'designSystem.surface.atlanticNavy' }}
          >
            {t('upload.reviewTitle')}
          </Typography>
          <Typography
            variant="bodyLg"
            sx={{
              color: 'designSystem.surface.ashyGray',
              letterSpacing: '0.05em',
              whiteSpace: 'pre-line',
            }}
          >
            {t('upload.reviewBody')}
          </Typography>
        </Box>

        <UploadSummaryCard {...props} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: `${theme.sizing.space3}px`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: isLarge ? 'row' : 'column',
              alignItems: 'center',
              gap: `${theme.sizing.space3}px`,
            }}
          >
            <GhostAction
              disableElevation
              disabled={isSubmitting}
              startIcon={<ArrowBackIcon fontSize="small" />}
              onClick={() => navigate('/upload-miu')}
            >
              {t('upload.backToUpload')}
            </GhostAction>
            {/* Figma: 262 wide here rather than 240 — the label is longer. */}
            <SignUpCta
              disableElevation
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              onClick={handleSubmit}
              sx={{ maxWidth: 262 }}
            >
              {isSubmitting ? (
                <CircularProgress
                  size={24}
                  color="inherit"
                  aria-label={t('upload.submitting')}
                />
              ) : (
                t('upload.submit')
              )}
            </SignUpCta>
          </Box>
          {upload.submitStatus === 'ERROR' && (
            <Typography
              variant="rubikBody"
              role="alert"
              sx={{ color: 'designSystem.status.errorStroke', textAlign: 'center' }}
            >
              {t(
                upload.submitError === 'ANALYSIS'
                  ? 'upload.submitErrorAnalysis'
                  : 'upload.submitErrorUpload',
              )}
            </Typography>
          )}
        </Box>
      </ContentRow>
    </UploadLayout>
  );
}
