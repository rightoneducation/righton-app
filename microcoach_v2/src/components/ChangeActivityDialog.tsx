import React from 'react';
import { useTranslation } from 'react-i18next';
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

interface ChangeActivityDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * My Activity modal (InflowScreens/MyActivity_Modal): confirms before Change
 * activity leaves for the Select Activity page. Changing nothing here: the
 * saved activity is only replaced once another one is selected there.
 */
export default function ChangeActivityDialog({
  open,
  onCancel,
  onConfirm,
}: ChangeActivityDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="change-activity-title"
      aria-describedby="change-activity-question change-activity-body"
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
          id="change-activity-title"
          component="h2"
          sx={{ color: 'designSystem.surface.white' }}
        >
          {t('activityFlow.changeDialog.title')}
        </Typography>
        <IconButton
          aria-label={t('activityFlow.changeDialog.close')}
          onClick={onCancel}
          sx={{ color: 'designSystem.surface.white' }}
        >
          <CloseIcon />
        </IconButton>
      </ModalHeaderBar>

      <ConfirmBody>
        <ConfirmText>
          <Typography
            id="change-activity-question"
            variant="appTitle"
            component="p"
            sx={{ maxWidth: 400 }}
          >
            {t('activityFlow.changeDialog.question')}
          </Typography>
          <Typography id="change-activity-body" variant="uploadLabel">
            {t('activityFlow.changeDialog.body')}
          </Typography>
        </ConfirmText>
        <ConfirmActions>
          <CardAction disableElevation onClick={onCancel} sx={{ minWidth: 167 }}>
            {t('activityFlow.changeDialog.cancel')}
          </CardAction>
          <CardAction isPrimary disableElevation onClick={onConfirm} autoFocus>
            {t('activityFlow.changeDialog.confirm')}
          </CardAction>
        </ConfirmActions>
      </ConfirmBody>
    </Dialog>
  );
}
