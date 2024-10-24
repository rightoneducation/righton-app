import React from 'react';
import { Box, Fade, Slide, Tabs, Tab, Grid, styled, Modal } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TabContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: '100dvh',
  width: '100dvw',
  zIndex: 5,
  overflow: 'hidden'
}));

const ModalBackground = styled(Box)(({ theme }) => ({
  position: 'relative',
  top: 0,
  height: '100%',
  width: '100%',
  background: 'rgba(0,0,0,0.5)',
  zIndex: 5
}));

interface QuestionTabsModalBackgroundProps {
  isTabsOpen: boolean;
}

export default function QuestionTabsModalBackground({isTabsOpen}: QuestionTabsModalBackgroundProps) {

  return (
    <Fade in={isTabsOpen}  mountOnEnter unmountOnExit timeout={1000}>
      <TabContainer>
      <ModalBackground/>
      </TabContainer>
    </Fade>
  );
}