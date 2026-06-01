import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import { PlayButton, ButtonType } from '@righton/networking';
import { StorageKey, StorageKeyEduDataStudentId, ErrorType } from '../lib/PlayModels';

interface ErrorModalProps {
  isModalOpen: boolean;
  errorType: ErrorType;
  errorText?: string;
  retry?: number;
  handleRetry: () => void;
}

export default function ErrorModal({
  isModalOpen,
  errorType,
  errorText,
  retry,
  handleRetry,
}: ErrorModalProps) {
  const theme = useTheme();
  const isExtraSmallDevice = useMediaQuery(theme.breakpoints.down('xs'));
  const { t } = useTranslation();
  const navigate = useNavigate();

  const upperTextMap = {
    [ErrorType.CONNECT]: t('error.connect.title1'),
    [ErrorType.ANSWER]: t('error.game.answer'),
    [ErrorType.CONFIDENCE]: t('error.game.confidence'),
    [ErrorType.SCORE]: t('error.game.score'),
    [ErrorType.JOIN]: t('error.connect.join'),
  };

  const lowerText = [
    <Typography
      key={uuidv4()}
      variant="paragraph"
      sx={{ textAlign: 'center', fontStyle: 'italic', color: theme.palette.designSystem.surface.play }}
    >
      {errorText}
    </Typography>,
  ];

  const retryCounter =
    errorType === ErrorType.CONNECT && retry && retry > 0
      ? ` (${retry})`
      : '';

  return (
    <Modal
      isOpen={isModalOpen}
      contentLabel="Rejoin Modal"
      style={{
        content: {
          position: 'absolute',
          width: isExtraSmallDevice
            ? `calc(100% - (2 * ${theme.sizing.extraLargePadding}px))`
            : `calc(${theme.breakpoints.values.xs}px - (2 * ${theme.sizing.extraLargePadding}px))`,
          minWidth: '200px',
          minHeight: '100px',
          inset: 'auto',
          margin: '20px',
          borderRadius: '16px',
          backgroundColor: theme.palette.primary.main,
          boxShadow: `0px 20px 20px rgba(0, 0, 0, 0.25)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
        overlay: {
          height: '100%',
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
      shouldCloseOnOverlayClick={false}
      appElement={document.getElementById('root') || undefined}
    >
      <Stack
        data-testid="errormodal"
        spacing={2}
        sx={{ paddingBottom: `${theme.sizing.mediumPadding}px` }}
      >
        <Typography variant="semiBoldParagraph" sx={{ textAlign: 'center', color: theme.palette.designSystem.surface.play }}>
          {upperTextMap[errorType]}
        </Typography>
        {lowerText}
      </Stack>
      <Stack spacing={2} style={{ alignItems: 'center' }}>
        <PlayButton
          buttonType={ButtonType.RETRY}
          label={`${t('error.connect.button1')}${retryCounter}`}
          isEnabled
          onClick={handleRetry}
        />
        {errorType === ErrorType.CONNECT && (
          <PlayButton
            buttonType={ButtonType.QUIT}
            label={t('error.connect.button2')}
            isEnabled
            onClick={() => {
              window.localStorage.removeItem(StorageKey);
              window.localStorage.removeItem(StorageKeyEduDataStudentId);
              navigate('/');
            }}
          />
        )}
      </Stack>
    </Modal>
  );
}
