import React from 'react';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { ModalHeaderBar } from '../lib/styledcomponents/MisconceptionModalStyledComponents';
import { CardAction } from '../lib/styledcomponents/ChooseActivityStyledComponents';
import {
  ConfirmActions,
  ConfirmBody,
  ConfirmText,
} from '../lib/styledcomponents/ActivityFlowStyledComponents';

interface VerifyAccountDialogProps {
  // The unverified account's email; null closes the dialog.
  email: string | null;
  isSending: boolean;
  hasError: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Offered from Log in and from sign-up's Continue when the credentials belong
 * to an account that never confirmed its code. Confirming sends a fresh code
 * and the caller routes to /signup/verify.
 *
 * Drawn as ConfirmRemoveDialog is — navy title bar, centred question and
 * detail, Cancel and the confirm below — but kept separate rather than bending
 * that dialog's remove-shaped props to fit.
 */
export default function VerifyAccountDialog({
  email,
  isSending,
  hasError,
  onCancel,
  onConfirm,
}: VerifyAccountDialogProps) {
  const { t } = useTranslation();
  const titleId = React.useId();
  const questionId = React.useId();
  const bodyId = React.useId();

  return (
    <Dialog
      open={email !== null}
      onClose={isSending ? undefined : onCancel}
      disableScrollLock
      aria-labelledby={titleId}
      aria-describedby={`${questionId} ${bodyId}`}
      maxWidth={false}
      slotProps={{
        backdrop: { sx: { bgcolor: 'designSystem.background.scrim' } },
      }}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 800,
          m: 2,
          borderRadius: '8px',
          overflow: 'hidden',
        },
      }}
    >
      <ModalHeaderBar>
        <Typography
          variant="bodyLg"
          id={titleId}
          component="h2"
          sx={{ color: 'designSystem.surface.white' }}
        >
          {t('verifyAccount.barTitle')}
        </Typography>
        <IconButton
          aria-label={t('misconceptionModal.close')}
          onClick={onCancel}
          disabled={isSending}
          sx={{ color: 'designSystem.surface.white' }}
        >
          <CloseIcon />
        </IconButton>
      </ModalHeaderBar>

      <ConfirmBody>
        <ConfirmText>
          <Typography id={questionId} variant="appTitle" component="p" sx={{ maxWidth: 400 }}>
            {t('verifyAccount.title')}
          </Typography>
          <Typography id={bodyId} variant="uploadLabel">
            {t('verifyAccount.body', { email })}
          </Typography>
          {hasError && (
            <Typography
              variant="rubikBody"
              role="alert"
              sx={{ color: 'designSystem.status.errorStroke' }}
            >
              {t('verifyAccount.error')}
            </Typography>
          )}
        </ConfirmText>
        <ConfirmActions>
          <CardAction
            disableElevation
            onClick={onCancel}
            disabled={isSending}
            sx={{ minWidth: 167 }}
          >
            {t('activityList.cancel')}
          </CardAction>
          <CardAction
            isPrimary
            disableElevation
            onClick={onConfirm}
            disabled={isSending}
            startIcon={isSending ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {t('verifyAccount.confirm')}
          </CardAction>
        </ConfirmActions>
      </ConfirmBody>
    </Dialog>
  );
}
