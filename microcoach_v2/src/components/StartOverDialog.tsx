import React from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import { dashboardCardShadow } from '../lib/styledcomponents/DashboardStyledComponents';
import { UploadPill } from '../lib/styledcomponents/UploadStyledComponents';

// Figma (Upload6_new): a 60px light-blue badge holding the accentBlue "!".
// #DBEAF2 is 8 off fadedLightBlue at its widest channel, so it reuses it.
const Badge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: '50%',
  backgroundColor: theme.palette.designSystem.foreground.fadedLightBlue,
  color: theme.palette.designSystem.foreground.accentBlue,
}));

// Figma: badge, then ~16 to the title, ~20 to the body, ~40 to the buttons.
const DialogBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.sizing.space7,
  textAlign: 'center',
}));

const DialogText = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.sizing.space3,
}));

const DialogActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.sizing.space5,
}));

// Figma: Open Sans 16/600 navy with a back arrow, no fill. The app does not
// load Open Sans, so Rubik stands in at the same size and weight.
const SecondaryAction = styled(Button)(({ theme }) => ({
  color: theme.palette.designSystem.surface.atlanticNavy,
  ...theme.typography.buttonLabel,
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
}));

interface StartOverDialogProps {
  open: boolean;
  isWorking: boolean;
  onKeep: () => void;
  onConfirm: () => void;
}

/**
 * Upload notes (Upload6): "Yes, start over" cancels the submission and clears
 * the files; "Keep my submission" or the X closes and changes nothing. Keeping
 * the submission is the filled, default action.
 */
export default function StartOverDialog({
  open,
  isWorking,
  onKeep,
  onConfirm,
}: StartOverDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={isWorking ? undefined : onKeep}
      aria-labelledby="start-over-title"
      maxWidth={false}
      slotProps={{
        backdrop: { sx: { bgcolor: 'designSystem.background.scrimLight' } },
      }}
      PaperProps={{
        sx: {
          position: 'relative',
          width: '100%',
          maxWidth: 1000,
          m: 2,
          p: 3,
          borderRadius: '32px',
          boxShadow: dashboardCardShadow,
        },
      }}
    >
      <IconButton
        aria-label={t('upload.close')}
        onClick={onKeep}
        disabled={isWorking}
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
          color: 'designSystem.foreground.selectedNavy',
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogBody>
        <DialogText>
          <Badge aria-hidden>
            <ErrorIcon sx={{ fontSize: 28 }} />
          </Badge>
          <Typography
            id="start-over-title"
            variant="navTitle2"
            component="h2"
            sx={{ color: 'designSystem.surface.nearBlack' }}
          >
            {t('upload.startOverTitle')}
          </Typography>
          <Typography
            variant="bodyText"
            sx={{
              color: 'designSystem.surface.ashyGray',
              whiteSpace: 'pre-line',
            }}
          >
            {t('upload.startOverBody')}
          </Typography>
        </DialogText>
        <DialogActionsRow>
          <SecondaryAction
            disableElevation
            onClick={onConfirm}
            disabled={isWorking}
            startIcon={
              isWorking ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <ArrowBackIcon fontSize="small" />
              )
            }
          >
            {t('upload.startOverConfirm')}
          </SecondaryAction>
          <UploadPill
            disableElevation
            onClick={onKeep}
            disabled={isWorking}
            autoFocus
          >
            {t('upload.startOverKeep')}
          </UploadPill>
        </DialogActionsRow>
      </DialogBody>
    </Dialog>
  );
}
