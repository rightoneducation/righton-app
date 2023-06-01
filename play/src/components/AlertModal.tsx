import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import IntroButtonStyled from '../lib/styledcomponents/IntroButtonStyled';

interface AlertModalProps {
  errorText: string;
  retry: number;
  handleRetry: () => void;
}

export default function AlertModal({
  errorText,
  retry,
  handleRetry,
}: AlertModalProps) {
  const theme = useTheme();
  const isExtraSmallDevice = useMediaQuery(theme.breakpoints.down('xs'));
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Modal
      isOpen
      contentLabel="Rejoin Modal"
      style={{
        content: {
          position: 'absolute',
          width: isExtraSmallDevice
            ? `calc(100% - (2 * ${theme.sizing.extraLargePadding}px))`
            : `calc(${theme.breakpoints.values.xs}px - (2 * ${theme.sizing.extraLargePadding}px))`,
          minWidth: '200px',
          minHeight: '200px',
          inset: 'auto',
          margin: '20px',
          borderRadius: '24px',
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
      <Stack spacing={2}>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>
          {t('error.connecting.title1')}
        </Typography>
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', fontStyle: 'italic' }}
        >
          {errorText}
        </Typography>
      </Stack>
      <Stack spacing={2} style={{ alignItems: 'center' }}>
        <IntroButtonStyled
          onClick={() => {
            handleRetry();
          }}
          style={{
            background: `${theme.palette.primary.highlightGradient}`,
            boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
          }}
        >
          {t('error.connecting.button1')}
          {retry > 0 ? ` (${retry})` : null}
        </IntroButtonStyled>
        <IntroButtonStyled
          onClick={() => {
            window.localStorage.removeItem('rightOn');
            navigate('/');
          }}
          style={{
            boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)',
          }}
        >
          {t('error.connecting.button2')}
        </IntroButtonStyled>
      </Stack>
    </Modal>
  );
}
