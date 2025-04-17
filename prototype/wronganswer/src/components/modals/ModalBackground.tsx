import React from 'react';
import {
  Box,
  Fade,
  styled,
} from '@mui/material';

const TabContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: '100%',
  width: '100dvw',
  zIndex: 5,
  overflow: 'hidden',
}));

const ModalBackgroundContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  top: 0,
  height: '100%',
  width: '100%',
  background: 'rgba(0,0,0,0.5)',
  zIndex: 5,
}));

interface ModalBackgroundProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
}

export default function ModalBackground({
  isModalOpen,
  handleCloseModal,
}: ModalBackgroundProps) {
  return (
    <Fade
      in={isModalOpen}
      mountOnEnter
      unmountOnExit
      timeout={1000}
      onClick={handleCloseModal}
    >
      <TabContainer>
        <ModalBackgroundContainer />
      </TabContainer>
    </Fade>
  );
}
