import React from 'react';
import { Typography, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Modal from 'react-modal';
import LaunchContainerStyled from '../lib/styledcomponents/launchcontainer/LaunchContainerStyled';
import LoadingIndicator from './LoadingIndicator';

const TimerContainer = styled(Box)({
  width: '140px',
  height: '140px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

interface GameStartingModalProps {
  isTimerVisible: boolean;
  setIsTimerVisible: (value: boolean) => void;
}

export default function GameStartingModal({
  isTimerVisible,
  setIsTimerVisible,
}: GameStartingModalProps ) {
  const theme = useTheme();
  return (
    <Modal
      isOpen={isTimerVisible}
      contentLabel="Game Load Modal"
      style={{
        content: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: 0,
          border: '0',
          borderRadius: 0,
          overflow: 'hidden',
          background: 'transparent',
        },
      }}
      appElement={document.getElementById('root') || undefined}
    >
      {/* same background treatment as the loading screen: gradient + math symbols ::before */}
      <LaunchContainerStyled>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
            // text above the timer on mobile/tablet, below it on desktop
            flexDirection: { xs: 'column-reverse', lg: 'column' },
            gap: '36px',
          }}
        >
          <TimerContainer>
            <LoadingIndicator
              theme={[
                'rgb(126, 90, 175)',
                'rgb(148, 98, 179)',
                'rgb(169, 104, 180)',
                'rgb(186, 107, 177)',
                'rgb(202, 109, 172)',
                'rgb(218, 112, 168)',
                'rgb(237, 115, 166)',
                'rgb(255, 120, 165)',
              ]}
              radius={70}
              timerStartInSecond={3}
              setIsTimerVisible={setIsTimerVisible}
              gameCreate={false}
            />
          </TimerContainer>
          <Typography
            variant="h2"
            sx={{
              ...theme.typography.designSystem.h2, // 20px Poppins 700 (design system source of truth)
              color: '#fff',
              textAlign: 'center',
            }}
          >
            Starting your game...
          </Typography>
        </Box>
      </LaunchContainerStyled>
    </Modal>
  );
}
