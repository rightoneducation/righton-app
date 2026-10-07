import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

interface ConfirmRemoveDialogProps {
  // The class whose session is being removed; null closes the dialog.
  className: string | null;
  isRemoving: boolean;
  hasError: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  // Wording overrides; the defaults describe removing a session.
  title?: string;
  body?: string;
  errorText?: string;
}

// Confirms a delete from the backend: a session (This Week, Past Activities) or
// a class (Account Settings, through the wording props). No frame draws this step, so
// it is a plain MUI dialog until design supplies one.
export default function ConfirmRemoveDialog({
  className,
  isRemoving,
  hasError,
  onCancel,
  onConfirm,
  title,
  body,
  errorText,
}: ConfirmRemoveDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={className !== null} onClose={isRemoving ? undefined : onCancel}>
      <DialogTitle>{title ?? t('activityList.removeTitle')}</DialogTitle>
      <DialogContent>
        <Typography variant="rubikBody">
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isRemoving}>
          {t('activityList.cancel')}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isRemoving}
          color="error"
          startIcon={isRemoving ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {t('activityList.remove')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
