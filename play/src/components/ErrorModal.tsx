import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import { PlayButtonBlock, ButtonType } from '@righton/networking';
import { StorageKey, StorageKeyEduDataStudentId, ErrorType } from '../lib/PlayModels';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';

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
      sx={{ textAlign: 'center', color: theme.palette.designSystem.surface.play }}
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
          width: 'calc(100% - 48px)',
          position: 'absolute',
          maxWidth: '430px',
          inset: 'auto',
          margin: '24px',
          borderRadius: '8px',
          backgroundColor: theme.palette.primary.main,
          boxShadow: `0px 20px 20px rgba(0, 0, 0, 0.25)`,
          boxSizing: 'border-box',
          padding: '48px'
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
      <BodyCardContainerStyled data-testid="errormodal" spacing={2}>
        <Typography variant="h1" sx={{ textAlign: 'center', color: theme.palette.designSystem.surface.play }}>
          {upperTextMap[errorType]}
        </Typography>
        {lowerText}
        <Box style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%'
        }}>
          <PlayButtonBlock
            buttonType={ButtonType.RETRY}
            label={`${t('error.connect.button1')}${retryCounter}`}
            isEnabled
            onClick={handleRetry}
          />
          {errorType === ErrorType.CONNECT && (
            <PlayButtonBlock
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
        </Box>
      </BodyCardContainerStyled>
    </Modal>
  );
}
