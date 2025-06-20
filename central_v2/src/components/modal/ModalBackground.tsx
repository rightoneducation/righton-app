import React from 'react';
import {
  Box,
  Fade,
  Slide,
  Tabs,
  Tab,
  Grid,
  styled,
  Modal,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TabContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: '100%',
  width: '100dvw',
  zIndex: 1305,
  overflow: 'hidden',
}));

const ModalBackgroundContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  top: 0,
  height: '100%',
  width: '100%',
  background: 'rgba(0,0,0,0.5)',
  zIndex: 1305,
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1305,
      }}
    >
      <TabContainer>
        <ModalBackgroundContainer />
      </TabContainer>
    </Fade>
  );
}
