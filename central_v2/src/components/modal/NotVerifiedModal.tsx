import React from 'react';
import { Box, Paper, Fade, Typography, styled } from '@mui/material';
import CentralButton from '../button/Button';
import { ButtonType } from '../button/ButtonModels';

const IntegratedContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '16px',
  width: 'calc(90%)',
  height: 'auto',
  top: '50%',
  transform: 'translateY(-50%)',
  maxHeight: '100%',
  maxWidth: '400px',
  background: '#FFF',
  paddingTop: '16px',
  paddingBottom: '16px',
  paddingLeft: '24px',
  paddingRight: '24px',
  zIndex: 1310,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  boxSizing: 'border-box',
}));

const DragText = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontSize: '24px',
  fontWeight: 700,
  textAlign: 'center',
}));

const SubText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Rubik, sans-serif',
  width: '100%',
  fontSize: '16px',
  fontWeight: 400,
  textAlign: 'center',
  maxWidth: '300px',
}));

const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
}));

interface NotVerifiedModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NotVerifiedModal({
  isModalOpen,
  setIsModalOpen,
}: NotVerifiedModalProps) {
  const message1 =
    'We have detected that this email was registered but not verified.';
  const message2 =
    'For security reasons, you will have to sign up again and complete verification with this email.';

  const handleCloseModalClickCancel = async () => {
    setIsModalOpen(false);
  };

  return (
    <Fade
      in={isModalOpen}
      mountOnEnter
      unmountOnExit
      timeout={1000}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <IntegratedContainer elevation={12}>
        <Box
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '16px',
            padding: '24px',
          }}
        >
          <DragText>Alert:</DragText>
          <SubText>{message1}</SubText>
          <SubText>{message2}</SubText>
          <ButtonsContainer>
            <CentralButton
              buttonType={ButtonType.OK}
              isEnabled
              smallScreenOverride
              onClick={handleCloseModalClickCancel}
            />
          </ButtonsContainer>
        </Box>
      </IntegratedContainer>
    </Fade>
  );
}
