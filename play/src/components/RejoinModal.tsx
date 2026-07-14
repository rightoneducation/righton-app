import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import { PlayButtonBlock, ButtonType } from '@righton/networking';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';

interface RejoinModalProps {
  handleRejoinSession: () => void;
  handleDontRejoinSession: () => void;
  isModalVisible: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
}

export default function RejoinModal({
  handleRejoinSession,
  handleDontRejoinSession,
  isModalVisible,
  setIsModalVisible,
}: RejoinModalProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isModalVisible}
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
      onRequestClose={() => setIsModalVisible(false)}
      shouldCloseOnOverlayClick
      appElement={document.getElementById('root') || undefined}
    >
      <BodyCardContainerStyled spacing={2}>
        <Typography variant="h1" sx={{ textAlign: 'center', color: theme.palette.designSystem.surface.play }}>
          {t('joingame.rejoinmodal.title1')}
        </Typography>
        <Typography variant="paragraph" sx={{ textAlign: 'center', color: theme.palette.designSystem.surface.play }}>
          {t('joingame.rejoinmodal.title2')}
        </Typography>
        <Box style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%'
        }}>
          <PlayButtonBlock
            buttonType={ButtonType.REJOIN}
            label={t('joingame.rejoinmodal.button1')}
            isEnabled
            onClick={() => {
              handleRejoinSession();
              setIsModalVisible(false);
            }}
          />
          <PlayButtonBlock
            buttonType={ButtonType.DONTREJOIN}
            label={t('joingame.rejoinmodal.button2')}
            isEnabled
            onClick={() => {
              handleDontRejoinSession();
              setIsModalVisible(false);
            }}
          />
        </Box>
      </BodyCardContainerStyled>
    </Modal>
  );
}
