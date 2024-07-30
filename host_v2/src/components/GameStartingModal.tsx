import React from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles'; 
import Modal from 'react-modal';
import LoadingIndicator from './LoadingIndicator';

const TimerContainer = styled(Box)({
  width: '242px',
  height: '242px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const TimerText = styled(Typography)({
  fontSize: '20px',
  fontWeight: '700',
  fontFamily: 'Karla',
  color: 'white',
  lineHeight: '23.38px',
  textAlign: 'center',
});

interface GameStartingModalProps {
  isTimerVisible: boolean;
  setIsTimerVisible: (value: boolean) => void;
}

export default function GameStartingModal({
  isTimerVisible,
  setIsTimerVisible,
}: GameStartingModalProps ) {
  return (
    <Modal
      isOpen={isTimerVisible}
      contentLabel="Game Load Modal"
      style={{
        content: {
          position: 'sticky',
          top: '0px',
          left: '0px',
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto',
          width: '100%',
          height: '100%',
          minHeight: '100vh',
          padding: '-20px',
          gap: '5%',
          justifyContent: 'center',
          alignItems: 'center',
          border: '0',
          background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
        },
      }}
      appElement={document.getElementById('root') || undefined}
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
          radius={110}
          timerStartInSecond={3}
          setIsTimerVisible={setIsTimerVisible}
          gameCreate={false}
        />
      </TimerContainer>
      <TimerText>
        The game will begin soon.
      </TimerText>
    </Modal>
  );
}