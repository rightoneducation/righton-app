import React from 'react';
import { Box, Fade, styled } from '@mui/material';

const TabContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100%',
  overflow: 'auto',
  zIndex: 5,
  display: 'flex',
  background: 'rgba(0,0,0,0.5)',
  pointEvents: 'auto',
}));

interface CCSSTabsModalBackgroundProps {
  isTabsOpen: boolean;
  handleBackToExplore: () => void;
  children: React.ReactNode;
}

export default function CCSSTabsModalBackground({
  isTabsOpen,
  handleBackToExplore,
  children,
}: CCSSTabsModalBackgroundProps) {
  return (
    <Box
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Fade
        in={isTabsOpen}
        mountOnEnter
        unmountOnExit
        timeout={1000}
        style={{ height: '100%' }}
      >
        <TabContainer onClick={handleBackToExplore} />
      </Fade>
      {children}
    </Box>
  );
}
