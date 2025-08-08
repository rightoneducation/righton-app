import React from 'react';
import { Box, Fade, styled } from '@mui/material';

const TabContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: '100%',
  width: '100%',
  zIndex: 7,
  overflow: 'hidden',
}));

const ModalBackground = styled(Box)(({ theme }) => ({
  position: 'relative',
  top: 0,
  height: '100%',
  width: '100%',
  background: 'rgba(0,0,0,0.5)',
  zIndex: 5,
}));

interface ShareMobileModalBackgroundProps {
  isShareModalOpen: boolean;
  handleCloseShareModalClick: () => void;
}

export default function ShareMobileModalBackground({
  isShareModalOpen,
  handleCloseShareModalClick,
}: ShareMobileModalBackgroundProps) {
  return (
    <Fade
      in={isShareModalOpen}
      mountOnEnter
      onClick={handleCloseShareModalClick}
    >
      <TabContainer>
        <ModalBackground />
      </TabContainer>
    </Fade>
  );
}
