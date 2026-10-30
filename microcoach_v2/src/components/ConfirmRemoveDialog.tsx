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

interface ConfirmRemoveDialogProps {
  // The class whose session is being removed; null closes the dialog.
  className: string | null;
  isRemoving: boolean;
  hasError: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  // Wording overrides; the defaults describe removing a session.
  barTitle?: string;
  title?: string;
  body?: string;
  errorText?: string;
  confirmLabel?: string;
}

/**
 * Confirms a delete from the backend: a session, or a class (Account Settings,
 * through the wording props). Drawn as the Change activity dialog is (My
 * Activity modal): the navy title bar, the question and its detail centred,
 * Cancel and the confirm below (dev QA 2026-10-30). The page keeps its
 * scrollbar while it is open, so nothing behind it shifts.
 */
export default function ConfirmRemoveDialog({
  className,
  isRemoving,
  hasError,
  onCancel,
  onConfirm,
  barTitle,
  title,
  body,
  errorText,
  confirmLabel,
}: ConfirmRemoveDialogProps) {
  const { t } = useTranslation();
  const titleId = React.useId();
  const questionId = React.useId();
  const bodyId = React.useId();

  return (
    <Dialog
      open={className !== null}
      onClose={isRemoving ? undefined : onCancel}
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
          {barTitle ?? title ?? t('activityList.removeTitle')}
        </Typography>
        <IconButton
          aria-label={t('misconceptionModal.close')}
          onClick={onCancel}
          disabled={isRemoving}
          sx={{ color: 'designSystem.surface.white' }}
        >
          <CloseIcon />
        </IconButton>
      </ModalHeaderBar>

      <ConfirmBody>
        <ConfirmText>
          <Typography id={questionId} variant="appTitle" component="p" sx={{ maxWidth: 400 }}>
            {title ?? t('activityList.removeTitle')}
          </Typography>
          <Typography id={bodyId} variant="uploadLabel">
            {body ?? t('activityList.removeBody', { className })}
          </Typography>
          {hasError && (
            <Typography
              variant="rubikBody"
              role="alert"
              sx={{ color: 'designSystem.status.errorStroke' }}
            >
              {errorText ?? t('activityList.removeError')}
            </Typography>
          )}
        </ConfirmText>
        <ConfirmActions>
          <CardAction
            disableElevation
            onClick={onCancel}
            disabled={isRemoving}
            sx={{ minWidth: 167 }}
          >
            {t('activityList.cancel')}
          </CardAction>
          <CardAction
            isPrimary
            disableElevation
            onClick={onConfirm}
            disabled={isRemoving}
            startIcon={isRemoving ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {confirmLabel ?? t('activityList.remove')}
          </CardAction>
        </ConfirmActions>
      </ConfirmBody>
    </Dialog>
  );
}
