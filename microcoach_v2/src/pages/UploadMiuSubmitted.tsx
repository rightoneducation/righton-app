import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentRow from '../components/ContentRow';
import StartOverDialog from '../components/StartOverDialog';
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
 * Files submitted (Figma Upload5): the analysis has started. "Start over"
 * confirms, then cancels this submission; "Upload new classroom" starts a fresh
 * upload and leaves this one running.
 */
export default function UploadMiuSubmitted(props: UploadStepProps) {
  const { screenSize, actions } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const isI18nReady = useI18nReady();
  const isLarge = screenSize === ScreenSize.LARGE;
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [isStartingOver, setIsStartingOver] = React.useState(false);

  if (!isI18nReady) return null;

  const handleStartOver = async () => {
    setIsStartingOver(true);
    await actions.startOver();
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: `${theme.sizing.space6}px`,
            }}
          >
            <Typography
              variant="h1"
              sx={{ color: 'designSystem.surface.atlanticNavy' }}
            >
              {t('upload.submittedTitle')}
            </Typography>
            {/* Figma: a 44px green check beside the title. */}
            <CheckCircleIcon
              aria-hidden
              sx={{ fontSize: 44, color: 'designSystem.status.success', flexShrink: 0 }}
            />
          </Box>
          <Typography
            variant="bodyLg"
            sx={{
              color: 'designSystem.surface.ashyGray',
              letterSpacing: '0.05em',
              whiteSpace: 'pre-line',
            }}
          >
            {t('upload.submittedBody')}
          </Typography>
        </Box>

        <UploadSummaryCard {...props} />

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
            startIcon={<ArrowBackIcon fontSize="small" />}
            onClick={() => setIsConfirming(true)}
          >
            {t('upload.startOver')}
          </GhostAction>
          <SignUpCta
            disableElevation
            onClick={actions.startNewClassroom}
            sx={{ maxWidth: 262 }}
          >
            {t('upload.newClassroom')}
          </SignUpCta>
        </Box>
      </ContentRow>
      <StartOverDialog
        open={isConfirming}
        isWorking={isStartingOver}
        onKeep={() => setIsConfirming(false)}
        onConfirm={handleStartOver}
      />
    </UploadLayout>
  );
}
